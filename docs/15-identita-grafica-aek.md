# 15 — Identità grafica A.E.K. F.C. ripristinata

**Versione:** tema grafico v0.1, 9 novembre 2026 · **Branch:** dev. Lavoro puramente visivo, senza cambiare modello dati o integrazioni Google.

## Provenienza

Stile recuperato dall'archivio storico fornito dall'utente:

- `ui-angular-app/src/styles.css` — variabili e palette principali;
- `ui-angular-app/src/app/shared/sidebar/sidebar.component.css` — navigazione antracite con selezione gialla;
- `ui-angular-app/src/app/shared/navbar/navbar.component.css` — barra superiore scura e marchio AEK;
- `ui-angular-app/src/app/pages/home/home.css` — aree in evidenza nere/gialle;
- `ui-angular-app/public/icons/icon-512x512.png` — stemma del club con aquila bicipite, ripreso e ottimizzato.

## Palette originale

| Uso | Colore | Codice |
|---|---|---|
| Sfondo principale | Nero grafite | `#1A1A1A` |
| Superfici e pannelli | Antracite | `#2E2E2E` |
| Giallo principale AEK | Giallo oro | `#FFD700` |
| Giallo chiaro / hover | Giallo chiaro | `#FFF066` |
| Testo primario | Bianco tenue | `#F0F0F0` |
| Testo secondario | Grigio | `#BDBDBD` |

Gli stati operativi (verde, ambra, rosso) restano distinti dal giallo del club per mantenere leggibilità e significato.

## File aggiunti

- `styles.brand.css` — **solo override visivi**; caricato dopo `styles.css` per lasciare inalterato il foglio CSS funzionale.
- `icons/aek-crest-original.png` — ricostruzione ottimizzata dello **stesso stemma originale** dall'archivio storico.
- `icons/aek-crest.svg` — versione scalabile dell'icona con lo stesso stemma incorporato (non un marchio disegnato ex novo).

## File aggiornati

- `src/app.js` — **solo il markup del marchio** nella barra laterale, nell'intestazione mobile e nell'area principale; la logica di gestione squadra, quote, documenti e OAuth non è cambiata.
- `index.html` — collegamento al nuovo CSS, nuova favicon e icona Apple, tema barra browser scuro.
- `manifest.webmanifest` — nome/icone/colors coerenti con il club.
- `sw.js` — asset grafici e nuovo tema nella cache statica `aek-static-v2-brand`, così la PWA installata può aggiornare l'interfaccia invece di continuare a usare il vecchio tema.
- `README.md` — nota sul recupero dell'identità visiva.

## Componenti visivi recuperati

- Barra laterale nera e antracite, selezione attiva **giallo oro con testo nero**.
- Intestazione superiore antracite con bordo giallo.
- Sfondo scuro, pannelli di antracite, sottili bordi e separatori grigi.
- Hero panoramica nero/giallo, con **stemma del club** anziché simbolo generico.
- Pulsanti primari gialli, pulsanti secondari scuri.
- Navigazione mobile scura con selezione gialla.
- Stato focus visibile in giallo e colore distinto per errori e successi.

Non è stata riprodotta integralmente la vecchia UI Angular: sono stati ripresi i suoi **segni distintivi**, conservando la più semplice struttura mobile-first della PWA.

## Come tornare al tema precedente senza cambiare l'app

1. Rimuovere (o commentare) solo il link `styles.brand.css` in `index.html`.
2. Ripristinare nel markup di `src/app.js` il marchio precedente **se desiderato**; l'uso dello stemma originale rimane comunque compatibile con il vecchio tema.
3. Aggiornare la versione della cache in `sw.js` quando si cambia un file statico.

Il vecchio `styles.css` è rimasto integro. Per rollback completo recuperare il commit prima del tema e ripristinare soltanto i file visivi — **non serve modificare la logica Google o i fogli**.

## Verifiche consigliate

- Desktop: barra laterale, panoramica, liste, tabelle, impostazioni, modali.
- Mobile (larghezza 390 px): barra inferiore, schermate di dettaglio, contrasto dei pulsanti.
- Dopo un aggiornamento: chiudere e riaprire la PWA installata, verificare che il nuovo tema venga scaricato.
- In caso di cache ostinata: aggiornare il sito oppure cancellare i dati del sito se necessario; non cancellare dati Google.
