/* AEK Gestionale — logica dati indipendente da Google e dall'interfaccia. */
(function (g) {
  "use strict";
  const TABLES = Object.freeze({
    Persone: ["persona_id","nome","cognome","ruolo","numero_maglia","email","telefono","stato","drive_folder_id"],
    Quote: ["quota_id","persona_id","stagione","tipo","importo_previsto","importo_versato","data_versamento","stato","ricevuta_drive_url"],
    Documenti: ["documento_id","persona_id","categoria","descrizione","drive_url","scadenza","stato"]
  });
  const OPTIONS = Object.freeze({
    ruolo: ["giocatore","allenatore","dirigente","collaboratore"],
    stato: ["attivo","inattivo"],
    categoria: ["generale","liberatoria","foto","ricevuta"],
    statoDocumento: ["presente","da_verificare","scaduto","archiviato"]
  });
  const demo = () => ({
    Persone: [
      {persona_id:"P-0001",nome:"Marco",cognome:"Rossi",ruolo:"giocatore",numero_maglia:"7",email:"marco@example.invalid",telefono:"",stato:"attivo",drive_folder_id:""},
      {persona_id:"P-0002",nome:"Luca",cognome:"Bianchi",ruolo:"allenatore",numero_maglia:"",email:"luca@example.invalid",telefono:"",stato:"attivo",drive_folder_id:""},
      {persona_id:"P-0003",nome:"Andrea",cognome:"Verdi",ruolo:"giocatore",numero_maglia:"11",email:"",telefono:"",stato:"inattivo",drive_folder_id:""}
    ],
    Quote: [
      {quota_id:"Q-0001",persona_id:"P-0001",stagione:"2026/27",tipo:"Quota attività",importo_previsto:"100",importo_versato:"100",data_versamento:"2026-10-20",stato:"pagata",ricevuta_drive_url:""},
      {quota_id:"Q-0002",persona_id:"P-0003",stagione:"2026/27",tipo:"Quota attività",importo_previsto:"100",importo_versato:"25",data_versamento:"2026-10-21",stato:"parziale",ricevuta_drive_url:""}
    ],
    Documenti: [
      {documento_id:"D-0001",persona_id:"P-0001",categoria:"liberatoria",descrizione:"Liberatoria stagione",drive_url:"",scadenza:"",stato:"presente"},
      {documento_id:"D-0002",persona_id:"P-0003",categoria:"generale",descrizione:"Modulo anagrafico",drive_url:"",scadenza:"2026-12-20",stato:"da_verificare"}
    ],
    Eventi: [
      {id:"demo-1",summary:"Allenamento squadra",start:{dateTime:"2026-11-12T19:30:00+01:00"},location:"Campo sportivo",htmlLink:""},
      {id:"demo-2",summary:"Partita amichevole",start:{dateTime:"2026-11-15T15:00:00+01:00"},location:"Campo comunale",htmlLink:""}
    ]
  });
  const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, chr => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[chr]));
  const newId = prefix => prefix+"-"+crypto.randomUUID().replace(/-/g,"").slice(0,12).toUpperCase();
  const allowedLink = raw => {
    try {
      const url = new URL(String(raw || ""));
      return (url.protocol==="https:" && /(^|\.)google\.(com|it)$|(^|\.)googleusercontent\.com$/.test(url.hostname))
        ? url.href : "";
    } catch { return ""; }
  };
  const rowsToObjects = (rows, table) => {
    if (!Array.isArray(rows) || !rows.length) throw new Error("La scheda "+table+" è vuota: manca la riga di intestazione.");
    const expected = TABLES[table];
    if (!expected) throw new Error("Scheda sconosciuta: "+table);
    const header = rows[0].map(x => String(x).trim());
    if (header.join("|") !== expected.join("|")) throw new Error("Intestazioni di "+table+" non corrispondenti al modello. Consulta docs/14-avvio-prima-versione.md");
    return rows.slice(1).map((row,index)=>{
      const item = Object.fromEntries(expected.map((key,j)=>[key,String(row[j] ?? "")]));
      Object.defineProperty(item,"_sheetRow",{value:index+2,enumerable:false,writable:true});
      return item;
    }).filter(item=>expected.some(key=>String(item[key]).trim()));
  };
  const valuesOf = (table, item) => TABLES[table].map(key=>String(item[key] ?? ""));
  const parseEuro = raw => {
    const n = Number(String(raw == null ? "" : raw).trim().replace(",","."));
    return Number.isFinite(n) && n>=0 ? Math.round((n+Number.EPSILON)*100)/100 : NaN;
  };
  const euro = raw => new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR"}).format(parseEuro(raw)||0);
  const moneyState = (expected,paid) => {
    const a=parseEuro(expected),b=parseEuro(paid);
    if(!Number.isFinite(a)||!Number.isFinite(b))return "da_pagare";
    return b>=a ? "pagata" : b>0 ? "parziale" : "da_pagare";
  };
  const personName = x => x ? [x.nome,x.cognome].filter(Boolean).join(" ") : "Sconosciuto";
  const validPerson = item => {
    if(!String(item.nome||"").trim()||!String(item.cognome||"").trim())throw new Error("Nome e cognome sono obbligatori.");
    if(!OPTIONS.ruolo.includes(item.ruolo))throw new Error("Ruolo non valido.");
    if(!OPTIONS.stato.includes(item.stato))throw new Error("Stato non valido.");
    if(item.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email))throw new Error("Indirizzo email non valido.");
    if(item.numero_maglia&&!/^\d{1,3}$/.test(String(item.numero_maglia)))throw new Error("Numero maglia non valido.");
    return item;
  };
  const validQuote = (item,people) => {
    if(!people.some(x=>x.persona_id===item.persona_id))throw new Error("La quota deve essere associata a una persona esistente.");
    if(!item.stagione||!item.tipo)throw new Error("Stagione e tipo quota sono obbligatori.");
    const a=parseEuro(item.importo_previsto),b=parseEuro(item.importo_versato);
    if(!Number.isFinite(a)||!Number.isFinite(b))throw new Error("Gli importi devono essere numeri non negativi.");
    if(b>a)throw new Error("Versato maggiore del previsto: verificare la quota prima di salvare.");
    item.importo_previsto=a.toFixed(2);item.importo_versato=b.toFixed(2);
    item.stato=moneyState(a,b);
    if(item.ricevuta_drive_url&&!allowedLink(item.ricevuta_drive_url))throw new Error("Usa un collegamento Google Drive valido per la ricevuta.");
    return item;
  };
  const validDocument = (item,people) => {
    if(!people.some(x=>x.persona_id===item.persona_id))throw new Error("Documento associato a una persona inesistente.");
    if(!OPTIONS.categoria.includes(item.categoria))throw new Error("Tipo documento non consentito in questa versione.");
    if(!item.descrizione)throw new Error("Inserisci una descrizione.");
    if(item.drive_url&&!allowedLink(item.drive_url))throw new Error("Usa un link Google Drive valido.");
    if(!OPTIONS.statoDocumento.includes(item.stato))throw new Error("Stato documento non valido.");
    return item;
  };
  function normaliseText(value) {
    return String(value ?? "").trim().replace(/[\u0000-\u001F\u007F]/g," ");
  }
  g.AEKCore={TABLES,OPTIONS,demo,esc,newId,allowedLink,rowsToObjects,valuesOf,parseEuro,euro,moneyState,personName,validPerson,validQuote,validDocument,normaliseText};
})(window);