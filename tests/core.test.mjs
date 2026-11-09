import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const base=new URL("../",import.meta.url);
const src=readFileSync(new URL("src/core.js",base),"utf8");
const window={};
vm.runInNewContext(src,{window,crypto:{randomUUID:()=>"abcd1234-abcd-4444-abcd-aaaa00001111"},URL});
const C=window.AEKCore;

test("Le tre tabelle hanno colonne stabili",()=>{
  assert.equal(C.TABLES.Persone[0],"persona_id");
  assert.equal(C.TABLES.Quote[0],"quota_id");
  assert.equal(C.TABLES.Documenti[0],"documento_id");
});
test("Gli ID non dipendono dalla posizione della riga",()=>{
  assert.equal(C.newId("P"),"P-ABCD1234ABCD");
  const rows=[C.TABLES.Persone,[],["P-0001","Marco","Rossi","giocatore","7","","","attivo",""]];
  const data=C.rowsToObjects(rows,"Persone");
  assert.equal(data[0]._sheetRow,3);
  assert.equal(data[0].persona_id,"P-0001");
});
test("Il modello segnala intestazioni alterate",()=>{
  assert.throws(()=>C.rowsToObjects([["nome","persona_id"]],"Persone"),/Intestazioni/);
});
test("I valori testo e HTML vengono messi in sicurezza",()=>{
  assert.equal(C.esc('<img src=x onerror="alert(1)">'),'&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
  assert.equal(C.allowedLink("javascript:alert(1)"),"");
  assert.equal(C.allowedLink("https://evil.example/"),"");
  assert.equal(C.allowedLink("https://drive.google.com/file/d/abc/view"),"https://drive.google.com/file/d/abc/view");
});
test("Le quote funzionano con importi parziali",()=>{
  assert.equal(C.moneyState(100,25),"parziale");
  assert.equal(C.moneyState(100,100),"pagata");
  assert.equal(C.moneyState(100,0),"da_pagare");
  const q=C.validQuote({persona_id:"P-0001",stagione:"2026/27",tipo:"Quota",importo_previsto:"100,00",importo_versato:"25",ricevuta_drive_url:""},[{persona_id:"P-0001"}]);
  assert.equal(q.importo_versato,"25.00");
  assert.equal(q.stato,"parziale");
  assert.throws(()=>C.validQuote({...q,importo_versato:"125"},[{persona_id:"P-0001"}]),/maggiore/);
});
test("I documenti sanitari non sono un tipo caricabile nella v0.1",()=>{
  const people=[{persona_id:"P-0001"}];
  assert.throws(()=>C.validDocument({persona_id:"P-0001",categoria:"certificato",descrizione:"Certificato",stato:"presente"},people),/non consentito/);
  const d=C.validDocument({persona_id:"P-0001",categoria:"liberatoria",descrizione:"Liberatoria",stato:"presente"},people);
  assert.equal(d.categoria,"liberatoria");
});
test("Un record viene convertito nelle celle nell'ordine corretto",()=>{
  const item={nome:"Marco",cognome:"Rossi",persona_id:"P-0001",stato:"attivo",ruolo:"giocatore"};
  const cells=C.valuesOf("Persone",item);
  assert.equal(cells[0],"P-0001");
  assert.equal(cells[1],"Marco");
  assert.equal(cells[7],"attivo");
  assert.equal(cells.length,9);
});
