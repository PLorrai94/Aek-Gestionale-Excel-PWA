/* AEK Gestionale — adattatore Google APIs. Token solo in memoria, mai in localStorage. */
(function(g) {
  "use strict";
  const C=g.AEKCore;
  const BASIC_SCOPES=[
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/calendar.events.readonly"
  ];
  const DRIVE_SCOPE="https://www.googleapis.com/auth/drive";
  const letter=n=>String.fromCharCode(64+n);
  function apiError(status,content) {
    const reason=content?.error?.message||content?.message||("HTTP "+status);
    if(status===401)return new Error("Sessione Google scaduta. Ricollegati con il pulsante Accedi.");
    if(status===403)return new Error("Permessi Google insufficienti (403). Verifica condivisioni e autorizzazioni: "+reason);
    if(status===404)return new Error("Risorsa Google non trovata (404). Controlla gli ID configurati.");
    return new Error("Google API "+status+": "+reason);
  }
  class GoogleStore {
    constructor(config) {
      this.config=config;
      this.token="";
      this.email="";
      this.scopes="";
      this.drive=false;
    }
    async authorize(needsDrive=false) {
      if(!this.config.clientId)throw new Error("Configura prima l'ID client OAuth in Impostazioni.");
      if(!g.google?.accounts?.oauth2)throw new Error("Libreria Google non caricata. Controlla la connessione e riprova.");
      const scopes=[...BASIC_SCOPES,...(needsDrive?[DRIVE_SCOPE]:[])].join(" ");
      const result=await new Promise((resolve,reject)=>{
        const client=g.google.accounts.oauth2.initTokenClient({
          client_id:this.config.clientId,
          scope:scopes,
          include_granted_scopes:true,
          callback:response=>{
            if(response?.error)reject(new Error("Accesso Google negato: "+response.error));
            else if(!response?.access_token)reject(new Error("Nessun token ricevuto da Google."));
            else resolve(response);
          },
          error_callback:()=>reject(new Error("La finestra Google è stata chiusa o bloccata. Riprova dal pulsante Accedi."))
        });
        // La richiesta deve nascere direttamente dall'interazione dell'utente.
        client.requestAccessToken({prompt:"select_account"});
      });
      this.token=result.access_token;
      this.scopes=result.scope||"";
      this.drive=this.scopes.split(" ").includes(DRIVE_SCOPE);
      const profile=await this.request("https://www.googleapis.com/oauth2/v3/userinfo");
      this.email=profile.email||"";
      if(!this.email)throw new Error("Google non ha restituito l'indirizzo email dell'account.");
      return this.email;
    }
    disconnect() {
      if(this.token&&g.google?.accounts?.oauth2?.revoke)g.google.accounts.oauth2.revoke(this.token,()=>{});
      this.token=""; this.email=""; this.scopes=""; this.drive=false;
    }
    async request(url,{method="GET",headers={},body}={}) {
      if(!this.token)throw new Error("Accedi prima con il tuo account Google.");
      const response=await fetch(url,{
        method,
        headers:{Authorization:"Bearer "+this.token,...headers},
        ...(body===undefined?{}:{body})
      });
      if(!response.ok){
        let payload={};try{payload=await response.json();}catch{}
        throw apiError(response.status,payload);
      }
      if(response.status===204)return {};
      return response.json();
    }
    sheetUrl(range) {
      const id=encodeURIComponent(this.config.spreadsheetId);
      return "https://sheets.googleapis.com/v4/spreadsheets/"+id+"/values/"+encodeURIComponent(range);
    }
    async readTable(table) {
      if(!C.TABLES[table])throw new Error("Scheda sconosciuta.");
      const content=await this.request(this.sheetUrl("'"+table+"'!A1:Z"));
      return C.rowsToObjects(content.values||[],table);
    }
    async loadAll() {
      if(!this.config.spreadsheetId)throw new Error("Inserisci l'ID Google Sheets nelle impostazioni.");
      const [Persone,Quote,Documenti]=await Promise.all(["Persone","Quote","Documenti"].map(x=>this.readTable(x)));
      const Eventi=await this.loadCalendar();
      return {Persone,Quote,Documenti,Eventi};
    }
    async loadCalendar() {
      if(!this.config.calendarId)return [];
      const min=new Date();min.setDate(min.getDate()-1);
      const params=new URLSearchParams({
        timeMin:min.toISOString(),maxResults:"80",singleEvents:"true",orderBy:"startTime",
        fields:"items(id,summary,start,location,htmlLink),nextPageToken"
      });
      const url="https://www.googleapis.com/calendar/v3/calendars/"+encodeURIComponent(this.config.calendarId)+"/events?"+params;
      const result=await this.request(url);
      return result.items||[];
    }
    async upsert(table,record,original=null) {
      const columns=C.TABLES[table];if(!columns)throw new Error("Scheda sconosciuta.");
      const idKey=columns[0],id=record[idKey];
      if(!id)throw new Error("Identificativo mancante.");
      const current=await this.readTable(table);
      const found=current.find(x=>x[idKey]===id);
      if(original){
        if(!found)throw new Error("Il record è stato cancellato dal foglio. Ricarica.");
        if(JSON.stringify(C.valuesOf(table,found))!==JSON.stringify(C.valuesOf(table,original))){
          throw new Error("Un'altra persona ha modificato questo record. Aggiorna i dati prima di salvare.");
        }
        const range="'"+table+"'!A"+found._sheetRow+":"+letter(columns.length)+found._sheetRow;
        await this.request(this.sheetUrl(range)+"?valueInputOption=RAW",{
          method:"PUT",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({values:[C.valuesOf(table,record)]})
        });
      } else {
        if(found)throw new Error("ID già presente. Riprova a inserire il record.");
        const range="'"+table+"'!A1:"+letter(columns.length);
        await this.request(this.sheetUrl(range)+":append?valueInputOption=RAW&insertDataOption=INSERT_ROWS",{
          method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({values:[C.valuesOf(table,record)]})
        });
      }
      return record;
    }
    assertDrive() {
      if(!this.drive)throw new Error("Serve autorizzare separatamente l'accesso a Google Drive.");
    }
    async driveListFolders(parent,query) {
      this.assertDrive();
      const q=["'"+parent.replace(/'/g,"\\'")+"' in parents","mimeType = 'application/vnd.google-apps.folder'","trashed = false", "name contains '"+query.replace(/'/g,"\\'")+"'"].join(" and ");
      const params=new URLSearchParams({q,fields:"files(id,name),nextPageToken",pageSize:"100",supportsAllDrives:"true",includeItemsFromAllDrives:"true"});
      return this.request("https://www.googleapis.com/drive/v3/files?"+params);
    }
    async createFolder(parent,name,matchPrefix=name) {
      this.assertDrive();
      const existing=await this.driveListFolders(parent,matchPrefix);
      const found=(existing.files||[]).find(f=>f.name===name||f.name.startsWith(matchPrefix));
      if(found)return found.id;
      const result=await this.request("https://www.googleapis.com/drive/v3/files?fields=id,name&supportsAllDrives=true",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name,mimeType:"application/vnd.google-apps.folder",parents:[parent]})
      });
      return result.id;
    }
    async ensurePlayerFolder(person) {
      this.assertDrive();
      if(person.drive_folder_id)return person.drive_folder_id;
      if(!this.config.driveRootFolderId)throw new Error("Indica in Impostazioni l'ID della cartella Drive 'Giocatori'.");
      const name=person.persona_id+" - "+C.personName(person);
      const folderId=await this.createFolder(this.config.driveRootFolderId,name,person.persona_id);
      const changed={...person,drive_folder_id:folderId};
      await this.upsert("Persone",changed,person);
      return folderId;
    }
    async uploadPlayerDocument(person,file,category) {
      this.assertDrive();
      if(!C.OPTIONS.categoria.includes(category))throw new Error("Categoria non ammessa.");
      if(!file||!file.size)throw new Error("Scegli un documento.");
      if(file.size>5*1024*1024)throw new Error("In questa versione il file deve essere entro 5 MB.");
      const allowed=["application/pdf","image/jpeg","image/png","image/webp"];
      if(!allowed.includes(file.type))throw new Error("Sono accettati PDF, JPG, PNG e WebP.");
      const root=await this.ensurePlayerFolder(person);
      const folder=await this.createFolder(root,category,category);
      const boundary="aek_"+Math.random().toString(36).slice(2);
      const parts=new Blob([
        "--"+boundary+"\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n",
        JSON.stringify({name:file.name,parents:[folder]}),
        "\r\n--"+boundary+"\r\nContent-Type: "+file.type+"\r\n\r\n",
        file,
        "\r\n--"+boundary+"--"
      ]);
      const data=await this.request("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink&supportsAllDrives=true",{
        method:"POST",
        headers:{"Content-Type":"multipart/related; boundary="+boundary},
        body:parts
      });
      if(!data.id)throw new Error("Google Drive non ha restituito l'ID del documento.");
      return data.webViewLink||("https://drive.google.com/file/d/"+encodeURIComponent(data.id)+"/view");
    }
  }
  g.AEKGoogle={GoogleStore,BASIC_SCOPES,DRIVE_SCOPE};
})(window);