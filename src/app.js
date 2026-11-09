/* AEK Gestionale PWA — interfaccia mobile-first senza framework o backend. */
(function(g) {
  "use strict";
  const C=g.AEKCore;
  const $=id=>document.getElementById(id);
  const E=C.esc;
  const CONFIG_KEY="aek_v1_config";
  const defaults={clientId:"",spreadsheetId:"",calendarId:"",driveRootFolderId:""};
  let initialConfig={...defaults};
  try {
    const saved=JSON.parse(localStorage.getItem(CONFIG_KEY)||"{}");
    for(const key of Object.keys(defaults))if(typeof saved[key]==="string")initialConfig[key]=saved[key];
  } catch {}
  const state={
    page:"home",mode:"demo",config:initialConfig,store:null,email:"",
    data:C.demo(),personId:"",modal:null,busy:false,error:"",notice:"",
    search:"",docFile:null
  };
  const people=()=>state.data.Persone||[];
  const quotes=()=>state.data.Quote||[];
  const documents=()=>state.data.Documenti||[];
  const events=()=>state.data.Eventi||[];
  const person=id=>people().find(x=>x.persona_id===id);
  const useGoogle=()=>state.mode==="google"&&!!state.store?.token;
  const fmtDate=x=>{
    if(!x)return "—";
    const d=new Date(x.length===10?x+"T12:00:00":x);
    return Number.isNaN(d.getTime())?E(x):new Intl.DateTimeFormat("it-IT",{day:"2-digit",month:"short",year:"numeric"}).format(d);
  };
  const fmtEvent=e=>{
    const raw=e.start?.dateTime||e.start?.date||"";
    const d=new Date(raw.length===10?raw+"T12:00:00":raw);
    if(!raw||Number.isNaN(d.getTime()))return "Data da definire";
    return new Intl.DateTimeFormat("it-IT",{dateStyle:"medium",...(e.start?.dateTime?{timeStyle:"short"}:{})}).format(d);
  };
  const safeDriveFolder=id=> /^[a-zA-Z0-9_-]{5,}$/.test(String(id||""))?"https://drive.google.com/drive/folders/"+encodeURIComponent(id):"";
  const tag=(value)=> {
    const s=String(value||"").toLowerCase();
    const tone=/inattivo|assente|scaduto/.test(s)?"red":/pagata|presente|attivo|valido/.test(s)?"green":/parziale|da_verificare|da_confermare|da_pagare/.test(s)?"amber":"neutral";
    return '<span class="tag '+tone+'">'+E((value||"—").replaceAll("_"," "))+"</span>";
  };
  const btn=(label,action,cls="btn",extra="")=>'<button class="'+cls+'" type="button" data-action="'+action+'" '+extra+'>'+label+"</button>";
  const svgIcon=(name)=>({"home":"⌂","squadra":"♟","agenda":"▦","documenti":"▤","quote":"€","settings":"⚙"}[name]||"•");
  const navs=[["home","Panoramica"],["squadra","Squadra"],["agenda","Agenda"],["documenti","Documenti"],["quote","Quote"],["settings","Impostazioni"]];
  function notice(text,type="info"){
    state.notice={text,type};render();
  }
  const actionable=()=>useGoogle()||state.mode==="demo";
  function pageTitle(){
    return ({home:"La tua squadra, in ordine",squadra:"La squadra",agenda:"Agenda",documenti:"Archivio documenti",quote:"Registro quote",settings:"Configurazione"})[state.page]||"AEK Gestionale";
  }
  function shell(content){
    const connected=useGoogle();
    const connection=connected?"Google collegato · "+E(state.email):state.mode==="demo"?"Modalità dimostrativa":"Google non collegato";
    return '<div class="layout"><aside class="sidebar"><div class="brand"><div class="logo">A<span>✦</span></div><div><strong>AEK Gestionale</strong><small>Team workspace</small></div></div>'+
    '<nav class="nav">'+navs.map(([key,label])=>'<button class="navlink '+(state.page===key?"active":"")+'" data-action="nav" data-page="'+key+'"><span class="nav-symbol">'+svgIcon(key)+'</span>'+label+'</button>').join("")+'</nav>'+
    '<div class="sidebar-footer"><span class="small">Prima versione · v0.1</span><span class="small">Solo 2 account autorizzati</span></div></aside>'+
    '<div class="main"><header class="topbar"><div class="mobile-brand">✦ AEK <span>Gestionale</span></div><div class="top-status"><span class="status-dot '+(connected?"online":"")+'"></span>'+connection+'</div><div class="top-actions">'+btn("↻ Aggiorna","refresh","btn soft small")+
    (connected?btn("Esci","logout","btn ghost small"):btn("Collega Google","go-settings","btn primary small"))+'</div></header>'+
    '<main class="content"><div class="page-top"><div><p class="eyebrow">AEK / ORGANIZZAZIONE SQUADRA</p><h1>'+pageTitle()+'</h1></div><div class="page-controls">'+
    (state.mode==="demo"?'<span class="pill-demo">● DATI FITTIZI</span>':'')+'</div></div>'+
    (state.error?'<div class="alert error" role="alert">'+E(state.error)+' <button data-action="dismiss">×</button></div>':'')+
    (state.notice?'<div class="alert '+(state.notice.type==="error"?"error":"success")+'">'+E(state.notice.text)+' <button data-action="dismiss">×</button></div>':'')+
    (state.mode==="demo"?'<div class="demo-banner"><div><strong>Anteprima interattiva</strong><p>I dati mostrati sono inventati e le modifiche demo non vengono salvate su Google.</p></div>'+btn("Configura la versione reale","go-settings","btn outline")+'</div>':"")+
    (state.busy?'<div class="loading">Operazione in corso…</div>':"")+
    content+'</main><div class="mobile-nav">'+navs.filter(x=>x[0]!=="settings").map(([key,label])=>'<button class="'+(state.page===key?"selected":"")+'" data-action="nav" data-page="'+key+'"><span>'+svgIcon(key)+'</span>'+label+'</button>').join("")+'<button data-action="go-settings"><span>⚙</span>Altro</button></div></div></div>'+modalHtml();
  }
  function quickPersonCard(p){
    return '<button class="person-card" data-action="view-person" data-id="'+E(p.persona_id)+'"><span class="avatar">'+E(p.nome.slice(0,1)+p.cognome.slice(0,1))+'</span><span class="person-card-info"><strong>'+E(C.personName(p))+'</strong><small>'+E(p.ruolo)+' · '+E(p.persona_id)+'</small></span>'+tag(p.stato)+'<span class="chevron">›</span></button>';
  }
  function eventCards(items){
    if(!items.length)return '<div class="empty"><div>▦</div><strong>Nessun evento disponibile</strong><p>Imposta l’ID del calendario Google in Impostazioni o aggiungi un evento nel calendario della squadra.</p></div>';
    return items.slice(0,12).map(x=>{
      const href=C.allowedLink(x.htmlLink);
      return '<article class="event-row"><div class="event-symbol">▦</div><div class="event-main"><strong>'+E(x.summary||"Evento senza titolo")+'</strong><p>'+E(fmtEvent(x))+(x.location?" · "+E(x.location):"")+'</p></div>'+(href?'<a href="'+E(href)+'" target="_blank" rel="noopener noreferrer" class="btn soft small">Apri ↗</a>':"")+'</article>';
    }).join("");
  }
  function home(){
    const active=people().filter(x=>x.stato==="attivo").length;
    const remaining=quotes().reduce((acc,q)=>acc+Math.max(0,(C.parseEuro(q.importo_previsto)||0)-(C.parseEuro(q.importo_versato)||0)),0);
    const next=documents().filter(d=>d.scadenza&&new Date(d.scadenza+"T12:00:00")<=new Date(Date.now()+30*86400000)&&d.stato!=="archiviato").length;
    return '<div class="hero"><div><div class="hero-label">IL QUADRO GENERALE</div><h2>Tutto ciò che serve<br>alla tua squadra.</h2><p>Persone, impegni e documenti in un unico posto. Google rimane la fonte dei dati.</p>'+
    '<div class="hero-actions">'+btn("Apri la squadra →","go-squadra","btn light")+btn("Visualizza agenda","go-agenda","btn hero-outline")+'</div></div><div class="hero-graphic"><div class="hero-ball">✦</div></div></div>'+
    '<div class="stats"><div class="stat"><span>COMPONENTI ATTIVI</span><strong>'+active+'</strong><small>Anagrafica condivisa</small></div>'+
    '<div class="stat"><span>QUOTE DA VERIFICARE</span><strong>'+C.euro(remaining)+'</strong><small>Importo residuo indicativo</small></div>'+
    '<div class="stat"><span>DOCUMENTI DA CONTROLLARE</span><strong>'+next+'</strong><small>Scaduti o entro 30 giorni</small></div></div>'+
    '<div class="two-col"><section class="panel"><div class="panel-header"><div><h3>Prossimi appuntamenti</h3><p>Direttamente dal calendario</p></div>'+btn("Vedi tutti →","go-agenda","btn text")+'</div>'+eventCards(events().slice(0,3))+'</section>'+
    '<section class="panel"><div class="panel-header"><div><h3>La squadra</h3><p>Accesso rapido ai componenti</p></div>'+btn("Elenco completo →","go-squadra","btn text")+'</div><div class="person-stack">'+people().slice(0,4).map(quickPersonCard).join("")+'</div></section></div>';
  }
  function squadra(){
    const q=state.search.toLowerCase();
    const arr=people().filter(p=>C.personName(p).toLowerCase().includes(q)||p.ruolo.toLowerCase().includes(q)||p.persona_id.toLowerCase().includes(q));
    return '<section class="panel"><div class="panel-header"><div><h3>Componenti della squadra</h3><p>'+arr.length+' risultati · Una sola anagrafica per Google Sheets e app</p></div>'+btn("+ Nuovo componente","new-person","btn primary")+'</div>'+
    '<form data-form="search" class="searchline"><input type="search" name="q" aria-label="Cerca giocatore" placeholder="Cerca per nome, ruolo o ID" value="'+E(state.search)+'"><button class="btn soft" type="submit">Cerca</button></form>'+
    '<div class="person-grid">'+(arr.length?arr.map(quickPersonCard).join(""):'<div class="empty"><strong>Nessun componente trovato</strong><p>Prova una ricerca diversa.</p></div>')+'</div></section>';
  }
  function personPage(){
    const p=person(state.personId);
    if(!p){state.personId="";return squadra();}
    const qs=quotes().filter(x=>x.persona_id===p.persona_id);
    const ds=documents().filter(x=>x.persona_id===p.persona_id);
    const folder=safeDriveFolder(p.drive_folder_id);
    return '<div class="backline">'+btn("← Torna alla squadra","back-squadra","btn ghost small")+'</div>'+
    '<div class="detail-head"><div class="detail-person"><div class="avatar big">'+E(p.nome[0]+p.cognome[0])+'</div><div><span class="eyebrow">'+E(p.persona_id)+'</span><h2>'+E(C.personName(p))+'</h2><div class="muted">'+E(p.ruolo)+(p.numero_maglia?" · Maglia "+E(p.numero_maglia):"")+'</div></div></div><div>'+btn("Modifica profilo","edit-person","btn primary")+'</div></div>'+
    '<div class="two-col detail-layout"><section class="panel"><h3>Profilo</h3><div class="kv"><span>Stato</span>'+tag(p.stato)+'</div>'+
    '<div class="kv"><span>Email</span><strong>'+E(p.email||"—")+'</strong></div><div class="kv"><span>Telefono</span><strong>'+E(p.telefono||"—")+'</strong></div>'+
    '<div class="divider"></div><div class="panel-header"><div><h3>Documenti</h3><p>Cartella Drive individuale</p></div>'+btn("+ Documento","new-doc","btn soft small")+'</div>'+
    (ds.length?ds.map(d=>'<div class="document-inline"><span>▤ '+E(d.descrizione)+'</span>'+tag(d.stato)+
      (C.allowedLink(d.drive_url)?'<a href="'+E(C.allowedLink(d.drive_url))+'" target="_blank" rel="noopener">Apri ↗</a>':"")+'</div>').join(""):'<p class="muted">Nessun documento indicizzato.</p>')+
    '<div class="folder-actions">'+(folder?'<a class="btn soft small" target="_blank" rel="noopener" href="'+E(folder)+'">Apri cartella Drive ↗</a>':btn("Crea cartella su Drive","make-folder","btn soft small"))+'</div>'+
    '<p class="hint">I certificati sanitari non vengono caricati in questa prima versione.</p></section>'+
    '<section class="panel"><div class="panel-header"><div><h3>Quote</h3><p>Registro versamenti manuali</p></div>'+btn("+ Quota","new-quote","btn soft small")+'</div>'+
    (qs.length?qs.map(q=>'<div class="quote-inline"><div><strong>'+E(q.tipo)+'</strong><p>'+E(q.stagione)+' · '+C.euro(q.importo_versato)+' di '+C.euro(q.importo_previsto)+'</p></div>'+tag(q.stato)+btn("Modifica","edit-quote","btn ghost small",'data-id="'+E(q.quota_id)+'"')+'</div>').join(""):'<div class="empty compact">Nessuna quota registrata.</div>')+
    '</section></div>';
  }
  function documenti(){
    return '<section class="panel"><div class="panel-header"><div><h3>Documentazione dei componenti</h3><p>Link ai file su Google Drive, senza copie nell’app</p></div>'+btn("+ Aggiungi documento","new-doc","btn primary")+'</div>'+
    '<div class="table-wrap"><table><thead><tr><th>Componente</th><th>Documento</th><th>Categoria</th><th>Scadenza</th><th>Stato</th><th></th></tr></thead><tbody>'+
    (documents().length?documents().map(d=>'<tr><td>'+E(C.personName(person(d.persona_id)))+'</td><td><strong>'+E(d.descrizione)+'</strong></td><td>'+E(d.categoria)+'</td><td>'+fmtDate(d.scadenza)+'</td><td>'+tag(d.stato)+'</td><td>'+
      (C.allowedLink(d.drive_url)?'<a href="'+E(C.allowedLink(d.drive_url))+'" rel="noopener noreferrer" target="_blank" class="inline-link">Apri ↗</a>':'—')+
      ' '+btn("Modifica","edit-doc","btn ghost small",'data-id="'+E(d.documento_id)+'"')+'</td></tr>').join(""):'<tr><td colspan="6">Nessun documento.</td></tr>')+
    '</tbody></table></div><p class="hint">Per caricare un file nell’app occorre abilitare separatamente Google Drive; senza questa autorizzazione puoi caricarlo manualmente su Drive e registrare il link.</p></section>';
  }
  function quotePage(){
    const sum=quotes().reduce((acc,q)=>acc+(C.parseEuro(q.importo_versato)||0),0);
    return '<section class="panel"><div class="panel-header"><div><h3>Quote e versamenti</h3><p>Solo registrazione, nessun pagamento online o fatturazione</p></div>'+btn("+ Nuova quota","new-quote","btn primary")+'</div>'+
    '<div class="mini-summary">Totale versamenti registrati <strong>'+C.euro(sum)+'</strong></div><div class="table-wrap"><table><thead><tr><th>Componente</th><th>Tipo</th><th>Stagione</th><th>Versato</th><th>Stato</th><th></th></tr></thead><tbody>'+
    (quotes().length?quotes().map(q=>'<tr><td>'+E(C.personName(person(q.persona_id)))+'</td><td><strong>'+E(q.tipo)+'</strong></td><td>'+E(q.stagione)+'</td><td>'+C.euro(q.importo_versato)+' / '+C.euro(q.importo_previsto)+'</td><td>'+tag(q.stato)+'</td><td>'+
    (C.allowedLink(q.ricevuta_drive_url)?'<a class="inline-link" href="'+E(C.allowedLink(q.ricevuta_drive_url))+'" rel="noopener noreferrer" target="_blank">Ricevuta ↗</a>':'')+
    ' '+btn("Modifica","edit-quote","btn ghost small",'data-id="'+E(q.quota_id)+'"')+'</td></tr>').join(""):'<tr><td colspan="6">Nessuna quota.</td></tr>')+
    '</tbody></table></div></section>';
  }
  function agenda(){
    return '<section class="panel"><div class="panel-header"><div><h3>Appuntamenti squadra</h3><p>Eventi letti dal calendario Google; gli orari si modificano in Calendar.</p></div>'+
    (state.config.calendarId?'<a href="https://calendar.google.com/calendar/u/0/r" target="_blank" rel="noopener noreferrer" class="btn soft">Apri Calendar ↗</a>':'')+'</div>'+eventCards(events())+'</section>';
  }
  function settings(){
    const c=state.config;
    const field=(name,label,placeholder,help)=>'<label class="input-field"><span>'+label+'</span><input name="'+name+'" type="text" autocomplete="off" value="'+E(c[name])+'" placeholder="'+E(placeholder||"")+'"><small>'+help+'</small></label>';
    return '<div class="two-col settings-layout"><section class="panel"><div class="panel-header"><div><h3>Collega gli strumenti Google</h3><p>Configurazione locale sul dispositivo, senza password.</p></div></div>'+
    '<form data-form="settings" class="settings-form">'+
    field("clientId","Client ID OAuth Google","123456...apps.googleusercontent.com","Crea un client OAuth di tipo Applicazione web in Google Cloud.")+
    field("spreadsheetId","ID Google Sheets","ID dall'URL del foglio","Il file deve contenere Persone, Quote e Documenti con intestazioni previste.")+
    field("calendarId","ID Google Calendar (facoltativo)","primary oppure ID calendario","Per la squadra usa il calendario condiviso dedicato, altrimenti lascia vuoto.")+
    field("driveRootFolderId","ID cartella Giocatori su Drive (facoltativo)","ID dall'URL della cartella","Per creare cartelle personali o caricare documenti direttamente.")+
    '<button class="btn primary" type="submit">Salva configurazione</button></form>'+
    '<div class="settings-actions">'+btn("Accedi con Google","connect","btn outline")+btn("Usa demo","demo","btn soft")+'</div></section>'+
    '<section class="panel"><h3>Prima di usare dati reali</h3><div class="step"><span>1</span><div><strong>Imposta due account autorizzati</strong><p>Configura i due test user nel consenso OAuth e condividi Sheets, Drive e Calendar solo con loro.</p></div></div>'+
    '<div class="step"><span>2</span><div><strong>Crea il modello Sheets</strong><p>Tre schede: Persone, Quote e Documenti, con intestazioni identiche al modello pubblicato.</p></div></div>'+
    '<div class="step"><span>3</span><div><strong>Attiva le API necessarie</strong><p>Sheets API, Calendar API e Drive API nel progetto Google Cloud.</p></div></div>'+
    '<div class="step"><span>4</span><div><strong>Prova con dati fittizi</strong><p>Non caricare certificati medici o documenti reali prima di verificare privacy e accessi.</p></div></div>'+
    '<p class="hint">La configurazione contiene soltanto identificativi, non credenziali segrete. Il token Google rimane esclusivamente nella memoria della pagina, e non viene salvato. <a class="inline-link" target="_blank" rel="noopener" href="https://github.com/PLorrai94/Aek-Gestionale-Excel-PWA/blob/dev/docs/14-avvio-prima-versione.md">Guida completa ↗</a></p></section></div>';
  }
  const formField=(label,name,value="",type="text",required=false,placeholder="")=>
    '<label class="input-field"><span>'+E(label)+'</span><input name="'+E(name)+'" type="'+type+'" value="'+E(value)+'" placeholder="'+E(placeholder)+'" '+(required?"required":"")+'></label>';
  const formSelect=(label,name,values,chosen)=>'<label class="input-field"><span>'+E(label)+'</span><select name="'+E(name)+'">'+values.map(v=>'<option value="'+E(v)+'" '+(v===chosen?"selected":"")+'>'+E(v.replaceAll("_"," "))+'</option>').join("")+'</select></label>';
  const personSelect=(selected)=>'<label class="input-field"><span>Componente</span><select name="persona_id">'+people().map(p=>'<option value="'+E(p.persona_id)+'" '+(p.persona_id===selected?"selected":"")+'>'+E(C.personName(p))+' ('+E(p.persona_id)+')</option>').join("")+'</select></label>';
  function modalHtml(){
    if(!state.modal)return "";
    const kind=state.modal.kind,item=state.modal.item||{},edit=!!state.modal.original;
    const commonClose='<button type="button" class="close" data-action="close-modal" aria-label="Chiudi">×</button>';
    let body="",title="";
    if(kind==="person"){
      title=edit?"Modifica componente":"Nuovo componente";
      body='<div class="form-grid">'+formField("Nome *","nome",item.nome,"text",true)+formField("Cognome *","cognome",item.cognome,"text",true)+
      formSelect("Ruolo","ruolo",C.OPTIONS.ruolo,item.ruolo||"giocatore")+formField("Numero maglia","numero_maglia",item.numero_maglia,"text")+
      formField("Email","email",item.email,"email")+formField("Telefono","telefono",item.telefono,"tel")+
      formSelect("Stato","stato",C.OPTIONS.stato,item.stato||"attivo")+'</div><p class="hint">L’ID è permanente. Per un giocatore uscito usa lo stato «inattivo».</p>';
    } else if(kind==="quote"){
      title=edit?"Modifica quota":"Registra quota";
      body='<div class="form-grid">'+personSelect(item.persona_id||state.personId||people()[0]?.persona_id)+formField("Stagione *","stagione",item.stagione||"2026/27","text",true)+
      formField("Tipo quota *","tipo",item.tipo,"text",true)+formField("Importo previsto (€) *","importo_previsto",item.importo_previsto||"0","text",true)+
      formField("Importo versato (€) *","importo_versato",item.importo_versato||"0","text",true)+formField("Data versamento","data_versamento",item.data_versamento,"date")+
      formField("Link ricevuta Google Drive","ricevuta_drive_url",item.ricevuta_drive_url,"url")+'</div><p class="hint">Lo stato (pagata, parziale o da pagare) viene calcolato dagli importi.</p>';
    } else if(kind==="doc"){
      title=edit?"Modifica documento":"Aggiungi documento";
      body='<div class="form-grid">'+personSelect(item.persona_id||state.personId||people()[0]?.persona_id)+
      formSelect("Categoria","categoria",C.OPTIONS.categoria,item.categoria||"generale")+
      formField("Descrizione *","descrizione",item.descrizione,"text",true)+formField("Scadenza","scadenza",item.scadenza,"date")+
      formSelect("Stato","stato",C.OPTIONS.statoDocumento,item.stato||"presente")+
      formField("Link Google Drive","drive_url",item.drive_url,"url")+'</div>'+
      (!edit?'<label class="input-field upload-control"><span>Oppure carica direttamente un file su Drive (facoltativo)</span><input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"><small>Massimo 5 MB, serve autorizzazione Google Drive aggiuntiva. Il file sarà inserito nella cartella del giocatore.</small></label>':"")+
      '<p class="hint">I certificati medici non sono ammessi nel caricamento automatico di questa versione; richiedono uno spazio e permessi specifici.</p>';
    }
    return '<div class="modal-backdrop" role="presentation"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><h2 id="modal-title">'+title+'</h2>'+commonClose+'</div>'+
      '<form data-form="'+kind+'" class="modal-form">'+body+'<div class="form-actions">'+btn("Annulla","close-modal","btn ghost")+'<button type="submit" class="btn primary" '+(state.busy?"disabled":"")+'>Salva</button></div></form></section></div>';
  }
  function render(){
    const pages={home,squadra,agenda,documenti,quote:quotePage,settings};
    const content=(state.personId&&state.page==="squadra")?personPage():(pages[state.page]||home)();
    $("app").innerHTML=shell(content);
    document.title=pageTitle()+" · AEK Gestionale";
  }
  const clearFeedback=()=>{state.error="";state.notice="";};
  async function reload(){
    if(useGoogle())state.data=await state.store.loadAll();
  }
  async function work(fn){
    if(state.busy)return;
    clearFeedback();state.busy=true;render();
    try {await fn();}
    catch(err){state.error=err.message||"Operazione non riuscita.";}
    finally {state.busy=false;render();}
  }
  function openModal(kind,id=""){
    const names={person:"Persone",doc:"Documenti",quote:"Quote"};
    const keys={person:"persona_id",doc:"documento_id",quote:"quota_id"};
    const item=id?state.data[names[kind]].find(x=>x[keys[kind]]===id):null;
    state.modal={kind,item:item?{...item}:{},original:item?{...item}:null};
    state.docFile=null;
    render();
    document.querySelector(".modal input")?.focus();
  }
  async function save(kind,form){
    const table={person:"Persone",doc:"Documenti",quote:"Quote"}[kind];
    const data=Object.fromEntries(new FormData(form).entries());
    delete data.file;
    for(const k of Object.keys(data))data[k]=C.normaliseText(data[k]);
    const original=state.modal?.original||null;
    const item={...(original||{}),...data};
    const key=C.TABLES[table][0];
    item[key]=original?.[key]||C.newId({person:"P",doc:"D",quote:"Q"}[kind]);
    if(kind==="person")C.validPerson(item);
    if(kind==="quote")C.validQuote(item,people());
    if(kind==="doc"){
      C.validDocument(item,people());
      const file=form.querySelector('input[name="file"]')?.files?.[0];
      if(file){
        if(state.mode==="demo") {
          throw new Error("Il caricamento file non è disponibile nella demo: collega Google Drive oppure incolla un link.");
        }
        const who=person(item.persona_id);
        if(!who)throw new Error("Seleziona un giocatore valido.");
        if(!state.store.drive)await state.store.authorize(true);
        // Non si richiede consenso Google fino a quando l'utente sceglie davvero un file.
        item.drive_url=await state.store.uploadPlayerDocument(who,file,item.categoria);
      }
    }
    if(state.mode==="demo"){
      const list=state.data[table];
      const i=list.findIndex(x=>x[key]===item[key]);
      if(i>=0)list[i]=item;else list.push(item);
    } else {
      if(!useGoogle())throw new Error("Collega prima il tuo account Google.");
      await state.store.upsert(table,item,original);
      await reload();
    }
    state.modal=null;
    state.notice={text:"Salvataggio completato"+(state.mode==="demo"?" (solo demo).":"."),type:"success"};
  }
  async function act(button){
    const action=button.dataset.action,id=button.dataset.id||"";
    if(action==="dismiss"){clearFeedback();render();return;}
    if(action==="close-modal"){state.modal=null;render();return;}
    if(action==="nav"){state.page=button.dataset.page;state.personId="";clearFeedback();render();return;}
    if(action==="go-settings"){state.page="settings";state.personId="";render();return;}
    if(action==="go-squadra"||action==="back-squadra"){state.page="squadra";state.personId="";render();return;}
    if(action==="go-agenda"){state.page="agenda";state.personId="";render();return;}
    if(action==="view-person"){state.page="squadra";state.personId=id;render();return;}
    if(action==="new-person"){openModal("person");return;}
    if(action==="edit-person"){openModal("person",state.personId);return;}
    if(action==="new-quote"){openModal("quote");return;}
    if(action==="edit-quote"){openModal("quote",id);return;}
    if(action==="new-doc"){openModal("doc");return;}
    if(action==="edit-doc"){openModal("doc",id);return;}
    if(action==="demo"){
      state.store?.disconnect();state.store=null;state.email="";state.mode="demo";state.data=C.demo();state.personId="";state.page="home";state.error="";render();return;
    }
    if(action==="logout"){
      state.store?.disconnect();state.store=null;state.email="";state.data={Persone:[],Quote:[],Documenti:[],Eventi:[]};state.mode="google";state.personId="";state.page="settings";notice("Disconnesso: nessun dato personale è rimasto nella pagina.");return;
    }
    if(action==="connect"){
      // OAuth viene aperto direttamente dal click, senza operazioni asincrone preliminari.
      const store=new g.AEKGoogle.GoogleStore(state.config);
      await work(async()=>{
        const email=await store.authorize();
        state.store=store;state.email=email;state.data=await store.loadAll();state.mode="google";state.page="home";state.personId="";
        state.notice={text:"Collegato con "+email+". Le autorizzazioni reali sono gestite da Google.",type:"success"};
      });return;
    }
    if(action==="refresh"){
      await work(async()=>{
        if(!useGoogle())throw new Error("In modalità demo non serve ricaricare: usa la navigazione o riconnetti Google.");
        await reload();state.notice={text:"Dati aggiornati da Google.",type:"success"};
      });return;
    }
    if(action==="make-folder"){
      const p=person(state.personId);if(!p)return;
      await work(async()=>{
        if(!useGoogle())throw new Error("Per creare cartelle, collega Google nelle Impostazioni.");
        if(!state.store.drive)await state.store.authorize(true);
        const id=await state.store.ensurePlayerFolder(p);
        await reload();
        state.notice={text:"Cartella creata o trovata in Drive. ID: "+id,type:"success"};
      });return;
    }
  }
  document.addEventListener("click",e=>{
    const b=e.target.closest("[data-action]");
    if(!b)return;
    if(b.tagName==="BUTTON")e.preventDefault();
    act(b).catch(err=>{state.error=err.message||"Errore inatteso.";state.busy=false;render();});
  });
  document.addEventListener("submit",async e=>{
    const form=e.target.closest("form[data-form]");
    if(!form)return;
    e.preventDefault();const kind=form.dataset.form;
    if(kind==="search"){state.search=C.normaliseText(new FormData(form).get("q"));render();return;}
    if(kind==="settings"){
      const f=new FormData(form);
      state.config=Object.fromEntries(Object.keys(defaults).map(x=>[x,C.normaliseText(f.get(x))]));
      localStorage.setItem(CONFIG_KEY,JSON.stringify(state.config));
      state.store?.disconnect();state.store=null;state.email="";state.mode="demo";state.data=C.demo();
      notice("Impostazioni salvate su questo dispositivo. Ora premi «Accedi con Google».");return;
    }
    if(["person","quote","doc"].includes(kind)){
      await work(async()=>await save(kind,form));
    }
  });
  if("serviceWorker" in navigator && (location.protocol==="https:"||location.hostname==="localhost")){
    navigator.serviceWorker.register("./sw.js").catch(()=>{});
  }
  render();
})(window);