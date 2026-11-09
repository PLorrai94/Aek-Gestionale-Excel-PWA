# 11 — Funzioni da recuperare dal vecchio AEK Gestionale

> **Analisi del materiale storico**, 9 novembre 2026 — proposta di selezione funzionale, senza riutilizzo automatico del vecchio codice. 
>
> **Decisione attuale D-11 (confermata): accesso ai dati riservato a due sole persone.** La lista di funzionalità seguente **non** è una lista di requisiti approvati.

## Materiale esaminato

Archivio consegnato dall'utente: `AEK_GESTIONALE-fase-6-demo-and-deploy(1).zip`.

Principali fonti del progetto precedente:

- `docs/overview/FUNCTIONAL_SPEC.md` — funzioni e roadmap del gestionale completo.
- `docs/overview/TEAM_MANAGER_PRO.md` — versione italiana delle specifiche.
- `docs/status/current.md` — stato dichiarato dei moduli e dei limiti.
- `docs/features/EXPORT_FEATURES.md` — specifiche sulle esportazioni, contrassegnate come *planned*.
- `ui-angular-app/src/app/core/models/player.model.ts`
- `ui-angular-app/src/app/core/models/document.model.ts`
- `ui-angular-app/src/app/core/models/fee.model.ts`
- `ui-angular-app/src/app/core/models/callup.model.ts`
- `ui-angular-app/src/app/core/models/training.model.ts`
- `ui-angular-app/src/app/core/models/season.model.ts`
- `ui-angular-app/src/app/pages/players/player-list/player-list.component.html`
- `ui-angular-app/src/app/pages/players/player-documents/player-documents.component.html`
- `ui-angular-app/src/app/pages/players/player-fees/player-fees.component.html`
- `ui-angular-app/src/app/pages/dashboard/dashboard.html`

**Limite dell'analisi:** è una ricognizione di **specifiche e schermate/file**, non una prova che tutte le funzionalità storiche fossero pronte o funzionanti in produzione. Il progetto precedente contiene descrizioni sia di moduli dichiarati completati, sia di elementi ancora pianificati o in sviluppo: non trattarli come realizzati e testati.

## Decisione D-11: due account autorizzati e nessun altro accesso

- Un **account Google proprietario/responsabile** e un **secondo account Google autorizzato**: esattamente due persone possono leggere e modificare i dati operativi, per ora.
- Il file principale Google Sheets, le cartelle Drive e l'eventuale calendario privato devono essere accessibili soltanto a questi due account, salvo l'accesso tecnico dei servizi Google necessario al funzionamento.
- Nessun accesso (neppure in sola lettura) a giocatori, altri allenatori, collaboratori, o pubblico. Nessun account autonomo giocatore, nessuna registrazione pubblica.
- È un requisito di **accesso**, non un permesso a trattare qualsiasi dato: prima di raccogliere **certificati sanitari** bisogna verificare che entrambi gli incaricati siano autorizzati anche a quella categoria e che sussistano finalità e condizioni giuridiche adeguate. In caso contrario il materiale sanitario non va messo in cartelle condivise da entrambi.
- Condivisioni Google **per account nominativo**, non `chiunque abbia il link`. L'interfaccia può verificare l'accesso Google, ma il controllo effettivo deve essere in Sheets/Drive/Calendar. Non bastano pulsanti o schede nascoste.
- La futura PWA sarà accessibile solo dopo autenticazione Google appropriata; non deve esporre dati personali in asset statici o cache aperte. Verificare accessi e log-out da un dispositivo condiviso.

## Funzionalità da recuperare subito a livello di progettazione

| Funzione nel vecchio sistema | Riferimento | Versione semplice proposta per AEK PWA | Stato |
| --- | --- | --- | --- |
| **Anagrafica giocatori**: nome, contatti, ruolo/posizione, numero, stato | `player.model.ts`, elenco `player-list.component.html` | `Persone` con ID stabile; aggiungere **posizione**, **piede preferito** e **taglia divisa** solo se la squadra li usa; foto profilo come file Drive privato | Alta priorità proposta |
| **Scheda giocatore unica**: documenti, quote, presenze e dati generali | Sezioni `pages/players/*` e profilo a schede nello stato progetto | Una vista mobile con sezioni **Profilo**, **Documenti**, **Quote**, **Eventi/Presenze**; i dati provengono dalle rispettive fonti Google | Alta priorità proposta |
| **Upload documenti** con tipo, descrizione e scadenza | `document.model.ts`, `player-documents.component.html` | Cartella Drive per `persona_id`; upload di PDF/foto dall'app **oppure manuale**; indice Sheets di file e scadenze | Alta priorità proposta, privacy da risolvere |
| **Quote, versamenti e stato** (pending/partial/paid/overdue) | `fee.model.ts`, `player-fees.component.html` | Solo **registro quote ricevute**, importo previsto/versato, stato, data e allegato su Drive; **nessun pagamento online, fatturazione o contabilità** | Alta priorità proposta |
| **Stagioni sportive** con stagione attiva | `season.model.ts` | Un valore `stagione` per quote/eventi se necessario; archivio logico per stagione. **Nessuna gestione campionati/classifiche** | Alta priorità, molto semplice |
| **Calendario partite e allenamenti** | `FUNCTIONAL_SPEC.md`, `training.model.ts` | **Google Calendar** come unica fonte per date, orari e luoghi; Sheets mantiene solo eventuali riferimenti evento | Alta priorità proposta |

## Funzionalità utili per un secondo momento

| Funzione storica | Traduzione leggera proposta | Cosa evitare |
| --- | --- | --- |
| **Convocazioni**: bozza/pubblicata, elenco giocatori | Selezionare i convocati su un evento e poter stampare una lista | Pubblicazione multi-canale, workflow complicati e notifiche automatiche |
| **Presenze**: presente, assente giustificato, ingiustificato, in ritardo | Un semplice stato per persona/evento, con eventuale nota | Statistiche disciplinari e tracking arrivo/uscita se non servono |
| **Dashboard** con alert su scadenze e partite senza convocati | Home con 2–3 indicatori: prossimi eventi, documenti in scadenza, eventuali quote da verificare | Grafici avanzati e decine di KPI |
| **Esportazioni** della rosa e delle convocazioni | Esportazione semplice in PDF/stampa da browser oppure link al foglio, solo se necessario | Microservizi PDF dedicati, esportazione massiva di dati sensibili |
| **Risultato partita** | Avversario e punteggio nelle informazioni evento o in tabella minima solo se richiesto | Statistiche giocatori, classifiche, algoritmi e dashboard |
| **Promemoria documenti in scadenza** | Riepilogo consultabile dall'app con filtro `scade entro N giorni` | Motori di notifiche, job scheduler, email massiva inizialmente |

## Idee da lasciare fuori

- **Infortuni, gravità, tempi di recupero, idoneità automatica e informazioni mediche dettagliate**: dati sensibili e workflow sanitari non essenziali. La semplice **scadenza del certificato** va comunque trattata come informazione potenzialmente sanitaria e separata se necessario.
- **Statistiche avanzate** (goal/assist/minuti, classifica marcatori), cartellini e sospensioni automatizzate, gestione formazione e pianificazione esercizi.
- **Iscrizione online e portale famiglie**: incompatibili con il requisito di esattamente due utenti, almeno per la prima versione.
- **Pagamenti Stripe/PayPal**, prima nota contabile, rimborsi staff, e-fatture, dichiarazioni fiscali, ricevute fiscali generate automaticamente.
- **Libro soci, verbali, safeguarding come moduli software complessi**: eventuali obblighi dell'associazione restano da gestire correttamente fuori da questa semplificazione, non vanno considerati assolti dall'app.
- **Sito pubblico auto-generato, notifiche push, AI**.
- **Server Java a microservizi, Oracle, JWT personalizzati, gateway, Eureka, Docker, Jenkins**: nessuna di queste infrastrutture è necessaria per il prototipo basato su Google.

## La scheda giocatore come centro dell'esperienza

```text
Squadra → Cerca/Seleziona giocatore → Scheda giocatore
 ├── Profilo (anagrafica, ruolo, numero, foto)
 ├── Documenti (link a cartella Drive, lista file e scadenze)
 ├── Quote (versato / da versare, ricevute Drive)
 └── Partecipazioni (eventi, convocazioni e presenze)
```

Non costruire pagine separate per ogni micro-funzione. La foto è un file privato su Drive, non un contenuto pubblico per la PWA. La cartella giocatore può essere creata manualmente e collegata tramite `drive_folder_id`; quando la futura app supporterà la creazione automatica, dovrà evitare cartelle duplicate.

## Schema minimo: che cosa cambierebbe rispetto alle 5 schede iniziali

**Non alterare subito lo schema approvato:** la v0.3 era una proposta base a cinque tab. Questa analisi suggerisce di **valutare**:

1. Nella scheda `Persone`: eventuali `posizione`, `taglia`, `foto_drive_id` o `foto_drive_url`, `drive_folder_id`; scegliere solo i campi realmente usati.
2. Una tab **`Quote`**, limitata a registrazioni di stato/versamento e link ricevute, senza pagamenti online (vedi documento 10).
3. Una tab **`Documenti`**, per categorizzare gli allegati Drive con eventuale scadenza; per gli elementi sanitari usare un archivio riservato verificato sul piano privacy (vedi documento 10).
4. **Stagione** come attributo semplice delle quote o delle attività, non come gestione completa dei campionati.

Le nuove colonne e schede sono **da approvare prima di creare il foglio ufficiale**, e solo se portano utilità pratica. È preferibile una scheda in più ben motivata a decine di campi inutilizzati.

## Domande per stabilire l'MVP reale

1. Le due persone devono poter fare entrambe tutto, oppure una soltanto documenti/quote?
2. La cartella con i certificati medici può essere vista legittimamente da entrambe? Se no, serve un archivio con accesso ancora più ristretto.
3. Di una quota serve solo “pagata / non pagata”, oppure anche **pagamento parziale** e più versamenti?
4. Tra allenamenti, partite, convocazioni e presenze, quali operazioni fate ogni settimana?
5. La **stagione sportiva** va registrata separatamente o basta l'anno nel nome degli eventi?

## Prossima verifica

Senza codice, confrontare **una scheda giocatore fittizia** (profilo, quattro tipi di documenti, una quota e due eventi) con il lavoro effettivo delle due persone. Conservare solo i campi usati davvero.

**Nessuna informazione del vecchio file `.env`, dato personale, credenziale o configurazione privata è stata trasferita nella documentazione.**
