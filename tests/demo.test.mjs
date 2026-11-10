import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../"+path, import.meta.url),"utf8");

function start(saved={}) {
  const memory = {...saved};
  const store = {
    getItem: key => memory[key] ?? null,
    setItem: (key,val) => {memory[key]=String(val)},
    removeItem: key => {delete memory[key]}
  };
  const handlers={};
  let pageHTML="";
  const appNode={set innerHTML(val){pageHTML=val},get innerHTML(){return pageHTML}};
  const document={
    getElementById:()=>appNode,
    querySelector:()=>({focus(){}}),
    addEventListener:(type,handler)=>{handlers[type]=handler},
    title:""
  };
  const window={confirm:()=>true};
  const crypto={randomUUID:()=>"abcd1234-2222-4333-8444-555566667777"};
  class FormData {
    constructor(form){this.fields=form.fields??{}}
    entries(){return Object.entries(this.fields)}
    get(key){return this.fields[key]??null}
  }
  const context=vm.createContext({
    window,document,crypto,FormData,localStorage:store,
    navigator:{},location:{protocol:"http:",hostname:"localhost"},
    URL,Intl,Date,console
  });
  vm.runInContext(read("src/core.js"),context);
  window.AEKGoogle={};
  vm.runInContext(read("src/app.js"),context);
  const click=action=>{
    const button={tagName:"BUTTON",dataset:{action}};
    handlers.click({
      target:{closest:selector=>selector==="[data-action]"?button:null},
      preventDefault(){}
    });
  };
  const submit=async fields=>{
    const form={
      dataset:{form:"person"},
      fields,
      querySelector:()=>null,
      closest:selector=>selector==="form[data-form]"?form:null
    };
    await handlers.submit({target:form,preventDefault(){}});
  };
  return {memory,click,submit,getHTML:()=>pageHTML};
}

test("La prova parte solo con dati fittizi",()=>{
  const app=start();
  assert.match(app.getHTML(),/Modalità prova personale/);
  assert.match(app.getHTML(),/DATI FITTIZI/);
});

test("Aggiunta giocatore resta nel browser e sopravvive al riavvio",async()=>{
  const app=start();
  app.click("go-squadra");
  app.click("new-person");
  await app.submit({
    nome:"Giulia",cognome:"Prova",ruolo:"giocatore",
    numero_maglia:"9",email:"giulia@example.invalid",telefono:"",stato:"attivo"
  });
  assert.match(app.getHTML(),/Giulia Prova/);
  const stored=JSON.parse(app.memory.aek_v1_demo_solo_test);
  assert.equal(stored.version,1);
  assert.ok(stored.data.Persone.some(p=>p.nome==="Giulia"));
  const restarted=start(app.memory);
  restarted.click("go-squadra");
  assert.match(restarted.getHTML(),/Giulia Prova/);
});

test("Ripristina demo cancella i dati locali di prova",async()=>{
  const app=start();
  app.click("go-squadra");
  app.click("new-person");
  await app.submit({
    nome:"Giulia",cognome:"Prova",ruolo:"giocatore",
    numero_maglia:"9",email:"",telefono:"",stato:"attivo"
  });
  app.click("reset-demo");
  assert.equal(app.memory.aek_v1_demo_solo_test,undefined);
  const restarted=start(app.memory);
  restarted.click("go-squadra");
  assert.doesNotMatch(restarted.getHTML(),/Giulia Prova/);
  assert.match(restarted.getHTML(),/Marco Rossi/);
});

test("Memoria demo corrotta torna a dati iniziali senza bloccare l'app",()=>{
  const app=start({aek_v1_demo_solo_test:"{invalido"});
  assert.match(app.getHTML(),/DATI FITTIZI/);
});
