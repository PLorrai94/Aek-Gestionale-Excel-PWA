# 14 — Avvio della prima versione PWA

**Stato:** prototipo sorgente sul branch dev; non ancora distribuito, né provato con account Google reali. Il repository è pubblico, **i dati Google devono rimanere privati**.

## Cosa offre oggi il codice v0.1

- PWA responsive con cinque sezioni: Panoramica, Squadra, Agenda, Documenti, Quote; più Impostazioni.
- Demo interattiva con **dati fittizi**, non persistenti (si azzera ricaricando).
- Anagrafica (aggiunta/modifica/stato attivo-inattivo), ricerca, scheda individuale.
- Quote: importi previsti e versati, stato calcolato, ricevuta come link a Google Drive. **Nessun pagamento online.**
- Documenti: categoria, descrizione, scadenza, stato, link Drive.
- Calendar: elenco eventi futuri **in sola lettura**; per modificarli si usa direttamente Calendar.
- Google Drive: creazione cartella individuale per persona, upload PDF/JPG/PNG/WebP fino a **5 MB** in sottocartelle per categoria; autorizzazione Drive richiesta solo quando si usa questa operazione.
- Google Sheets: lo stesso archivio può essere modificato direttamente nel foglio o dalla PWA.

**Esclusi da questa prima versione:** convocazioni, presenze, statistiche avanzate, PDF e report, notifiche push, fatture, incassi, editing offline, autenticazione dei giocatori, accesso Gmail API, caricamento di certificati medici o referti. Queste funzioni non vengono eliminate dal censimento, sono soltanto fuori dal prototipo iniziale.

## 1. Pubblicare la PWA su HTTPS

Non serve un backend, npm o Docker: i file index.html, src/*.js, styles.css, manifest.webmanifest e sw.js sono statici.

Per GitHub Pages:
1. Apri il repository GitHub → Settings → Pages.
2. Seleziona **Deploy from a branch**, il branch **dev** e la cartella **/(root)**, quindi salva.
3. Attendi che GitHub mostri l'URL effettivamente pubblicato (ipoteticamente: https://plorrai94.github.io/Aek-Gestionale-Excel-PWA/).
4. Questa impostazione non è stata attivata automaticamente. Un hosting HTTPS statico alternativo va bene ugualmente.

**ATTENZIONE:** GitHub Pages rende pubblica l'interfaccia, non i dati Google. Qualunque persona può vedere il codice della demo, ma **solo account con reale accesso ai documenti Google possono leggere/scrivere i dati reali**. Non pubblicare link con accesso «chiunque».

La PWA memorizza offline **solo i file statici**, mai le risposte delle API Google o i documenti reali. Non funziona come editor offline.

## 2. Preparare Google Sheets

Crea un nuovo Google Sheets privato chiamato **AEK_Dati_Squadra**, con esattamente queste tre schede (nomi e intestazioni senza cambiamenti). Copia la riga sotto ognuna e incollala interamente nella cella A1: i campi sono separati dal carattere TAB.

**Persone — colonne A:I**

    persona_id	nome	cognome	ruolo	numero_maglia	email	telefono	stato	drive_folder_id

**Quote — colonne A:I**

    quota_id	persona_id	stagione	tipo	importo_previsto	importo_versato	data_versamento	stato	ricevuta_drive_url

**Documenti — colonne A:G**

    documento_id	persona_id	categoria	descrizione	drive_url	scadenza	stato

La riga 1 è obbligatoria; le righe successive possono inizialmente essere vuote. I nomi e l'ordine delle intestazioni devono coincidere esattamente con quelli sopra. Le vecchie schede Eventi, Partecipazioni, Liste e Guida sono proposte per una fase successiva e **non richieste dall'app v0.1**.

**Regole di modifica manuale:** una riga per persona/quota/documento, chiave ID univoca e stabile, non eliminare chiavi usate in altri fogli, numeri di telefono come testo. L'app genera ID univoci casuali del tipo P-XXXXXXXXXXXX; è possibile usare anche ID leggibili manuali (es. P-0001), purché non duplicati.

Valori ammessi:
- Ruolo: giocatore, allenatore, dirigente, collaboratore; stato persona: attivo, inattivo.
- Stato quota: da_pagare, parziale, pagata; per valori numerici usare 100 oppure 100.00.
- Categoria documento: generale, liberatoria, foto, ricevuta. Stato: presente, da_verificare, scaduto, archiviato.

La PWA, prima di aggiornare una riga, ne rilegge i dati e segnala se sono cambiati. **Google Sheets non garantisce in questo schema lock o transazioni atomiche**: i due utenti devono evitare modifiche simultanee allo stesso elemento e possono usare la cronologia versioni per ripristinare.

## 3. Preparare Google Drive

Crea una cartella privata **AEK_Squadra** e dentro una cartella privata **Giocatori**, condivisa solo con i due account autorizzati. Dall'URL della cartella Giocatori copia la parte ID (dopo /folders/).

Quando scegli **Crea cartella** per un giocatore, l'app ricerca una cartella che inizi con il suo ID, eventualmente crea «P-ID - Nome Cognome» e salva il relativo ID sulla riga Persone. Per caricare un documento PDF o un'immagine sotto 5 MB, crea una sottocartella generale, liberatoria, foto o ricevuta, poi salva sul foglio Documenti il link del file.

Serve un consenso aggiuntivo all'ambito OAuth **Google Drive completo**. È un ambito ampio/restricted: adatto a un esperimento controllato con due tester, ma da riesaminare prima di una distribuzione estesa. La condivisione Google resta comunque indispensabile.

**Certificati medici non supportati in questa prima versione.** Non utilizzare «generale» per aggirare questa limitazione: prima vanno definiti base giuridica, destinatari autorizzati, archivio protetto, minimizzazione e conservazione. Anche la data di scadenza può essere un'informazione sanitaria.

## 4. Preparare Calendar

Crea o usa un calendario privato **AEK - Squadra**, condiviso solo con i due account. Nelle impostazioni di Google Calendar apri **Integra calendario** per trovare il Calendar ID. La PWA legge gli eventi futuri (non li modifica); orario, luogo e titolo restano ufficialmente su Calendar.

Come test è possibile usare «primary», ma questo mostra gli eventi personali dell'account: per il lavoro reale è preferibile un calendario della squadra dedicato.

## 5. Impostare OAuth Google Cloud

Nella [Google Cloud Console](https://console.cloud.google.com/) segui questi passi:

1. Crea un progetto Google Cloud dedicato, ad esempio «AEK-PWA».
2. Abilita **Google Sheets API**, **Google Calendar API** e **Google Drive API**.
3. Configura la schermata consenso OAuth in modalità **Testing** con **esattamente i due account Google autorizzati** nell'elenco *test users*. Gli avvisi Google di app non verificata possono apparire nella fase di test.
4. Crea un OAuth client di tipo **Web application**. In **Authorized JavaScript origins** inserisci soltanto l'origine dell'host HTTPS, **senza percorso**. Per GitHub Pages: https://plorrai94.github.io. Per prova locale su server: http://localhost:8000.
5. Apri **Impostazioni** della PWA; incolla **Client ID**, **Spreadsheet ID**, **Calendar ID** (opzionale) e **Drive folder ID** (opzionale). Salva la configurazione e premi **Accedi con Google**.

Scopes all'accesso: email, Google Sheets lettura/scrittura e Calendar sola lettura. Google Drive (lettura/scrittura) viene richiesto solo quando premi *Crea cartella* o scegli un file da caricare.

La PWA non chiede e non conserva password. Gli access token restano **solo in memoria**, mentre gli ID non segreti della configurazione vengono memorizzati nel localStorage del browser.

**Due test users OAuth non bastano da soli**: il Google Sheet, il calendario e la cartella Drive devono essere condivisi manualmente solo con le due persone. Occorre anche provare che un terzo account non abbia accesso. Nessun dato personale deve apparire nei file pubblici di GitHub.

## 6. Prove prima dei dati reali

- Aprire la demo con browser e smartphone; verificare che tutti i nomi siano inventati.
- Aggiungere un componente in demo e ricaricare la pagina: le modifiche demo devono sparire.
- Collegare Google con il primo account; verificare la lettura delle tre schede.
- Aggiungere un componente fittizio nella PWA, controllare la sua nuova riga direttamente in Google Sheets.
- Modificare un nome dal foglio, premere «Aggiorna» nell'app e verificare il nuovo valore.
- Registrare una quota e aggiungere manualmente un link Drive.
- Se si prova Drive, creare cartella, caricare un **documento inventato** sotto 5MB e verificare i link.
- Collegare il secondo account e ripetere i controlli.
- Verificare che un terzo account non possa leggere i dati.
- Provare su iPhone, Android e desktop; verificare installazione PWA, scadenza token e logout.
- Prima di usare dati reali, definire informativa, autorizzazioni, durata dei documenti e sicurezza dei dispositivi.

## 7. Limitazioni e punti da migliorare

- Non è presente un backend: sono le condivisioni di Google a decidere l'accesso.
- L'interfaccia statica e la demo sono pubbliche, i dati reali no.
- Gli ID Google e il Client ID non sono password, ma non vanno confusi con autorizzazioni.
- Se il caricamento su Drive riesce ma la scrittura dell'indice Sheets fallisce, il file resterà su Drive senza indice: recuperarlo manualmente, non ripetere l'upload indiscriminatamente.
- Il controllo contro le modifiche concorrenti è **best effort**, non atomico.
- Il prototipo **non è stato testato qui con account Google reali**. Le prove nella sezione precedente sono indispensabili prima dell'utilizzo sul campo.

## Riferimenti ufficiali

- [Google Identity Services, token model](https://developers.google.com/identity/oauth2/web/guides/use-token-model)
- [Google Sheets API valori](https://developers.google.com/workspace/sheets/api/guides/values)
- [Drive API cartelle](https://developers.google.com/workspace/drive/api/guides/folder)
- [Drive API upload](https://developers.google.com/workspace/drive/api/guides/manage-uploads)
- [Calendar API eventi](https://developers.google.com/workspace/calendar/api/v3/reference/events/list)
- [OAuth testing e scope restricted](https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification)
