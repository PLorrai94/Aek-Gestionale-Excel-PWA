import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = name => readFileSync(new URL("../"+name, import.meta.url), "utf8");

test("Il tema grafico è isolato e caricato dopo il CSS base", () => {
  const index=read("index.html");
  const first=index.indexOf('href="./styles.css"'),second=index.indexOf('href="./styles.brand.css"');
  assert.ok(first>=0 && second>first, "Il foglio brand deve seguire il foglio base");
  const style=read("styles.brand.css");
  for(const color of ["#1a1a1a","#2e2e2e","#ffd700","#fff066"]){
    assert.ok(style.toLowerCase().includes(color), "Manca il colore "+color);
  }
  assert.match(style,/\.navlink\.active/);
  assert.match(style,/\.mobile-nav/);
});

test("Lo stemma originale compare in sidebar, header mobile e home",()=>{
  const app=read("src/app.js");
  const references=app.match(/aek-crest-original\.png/g)||[];
  assert.equal(references.length,3);
  assert.ok(!app.includes('class="hero-ball"'));
});

test("PWA e cache puntano agli asset AEK aggiornati",()=>{
  const index=read("index.html");
  const manifest=JSON.parse(read("manifest.webmanifest"));
  const worker=read("sw.js");
  assert.match(index,/icons\/aek-crest\.svg/);
  assert.match(index,/icons\/aek-crest-original\.png/);
  assert.ok(manifest.icons.some(icon=>icon.src.includes("aek-crest-original.png")));
  for(const path of ["styles.brand.css","aek-crest-original.png","aek-crest.svg"]){
    assert.ok(worker.includes(path), "Risorsa assente dalla cache PWA: "+path);
  }
  assert.ok(worker.includes("aek-static-v2-brand"));
});

test("I file del brand esistono nel progetto",()=>{
  assert.ok(readFileSync(new URL("../icons/aek-crest-original.png",import.meta.url)).length>1000);
  assert.match(read("icons/aek-crest.svg"),/<svg\b/);
});
