# 12 — Inventario funzionale del vecchio gestionale (senza selezionare cosa tenere)

> **Censimento basato sul codice consegnato**, 9 novembre 2026. **Stato: inventario, non backlog né lista di requisiti approvati.** Non viene proposto di reintrodurre automaticamente nessuna funzione.
>
> Fonte: archivio dell'utente `AEK_GESTIONALE-fase-6-demo-and-deploy(1).zip`. I nomi dei file citati di seguito sono percorsi **dentro quell'archivio**, non nel nuovo repository.
>
> Vincolo attuale del nuovo progetto (confermato): **esattamente due persone possono accedere ai dati ordinari**. L'inventario storico include ruoli e portali non compatibili con questo vincolo, perché in questa fase registriamo tutto ciò che è stato effettivamente sviluppato prima di decidere.

## Metodo e livello delle prove

Ho confrontato (1) le dichiarazioni del vecchio `docs/status/current.md` e dei file `STATUS.md`, (2) le classi di dominio, DTO e servizi Java, (3) i controller e loro endpoint REST, (4) i componenti, modelli, servizi e rotte Angular, (5) test e audit già presenti nel pacchetto.

### Legenda

- **A — codice backend e interfaccia:** logica e accesso nell'interfaccia presenti, non necessariamente collaudati insieme in questa analisi.
- **B — backend presente, UI incompleta o non individuata:** API/logica implementata, ma manca un percorso completo confermato in Angular.
- **C — UI/configurazione presente, integrazione incompleta o da verificare:** non equiparare a funzione completa.
- **D — documentata/pianificata:** nessuna implementazione completa trovata.
- **NR — non rilevata nell'archivio:** potrebbe essere richiesta per la nuova app ma non va dichiarata già implementata.

**Limiti:** non ho eseguito i microservizi, non ho fatto login, test reali del database o prove di caricamento file. Le suite e gli esiti citati sono **resoconti storici del repository**, non test eseguiti in questa sessione. La presenza di un endpoint, una schermata o un test non garantisce correttezza, sicurezza, performance e compatibilità di produzione.

## 1 — Anagrafica, giocatori e scheda personale

| ID | Funzione riscontrata | Evidenza | Stato |
|---|---|---|---|
| ANA-01 | Inserire un giocatore | `PlayerController.java` POST, `PlayerService.java`, `player-form.component.ts` | A |
| ANA-02 | Consultare, cercare e paginare elenco giocatori | `PlayerController.java` GET, `player-list.component.ts` ricerca/paginazione | A |
| ANA-03 | Filtrare per stato ed elencare i giocatori attivi | `getActivePlayers`, `getAllPlayers`, `player-list.component.ts` | A |
| ANA-04 | Aprire scheda dettaglio, aggiornare e cancellare giocatore | `PlayerController.java` GET/PUT/DELETE, `player-form.component.ts` | A |
| ANA-05 | Salvare email, telefono, data di nascita, codice fiscale, note | `Player.java`, `PlayerRequest.java` e form | A |
| ANA-06 | Posizione, piede preferito, taglia, numero maglia | `Player.java`, `player.model.ts`, form | A |
| ANA-07 | Stati attivo, inattivo, infortunato, squalificato | `PlayerStatus.java`, `player.model.ts`, lista | A |
| ANA-08 | Vista `/me` per profilo giocatore collegato all'utente | `PlayerController.java`, `UserProfileComponent` | B |
| ANA-09 | Scheda giocatore organizzata in sezioni documenti, infortuni, cartellini, quote, partite e statistiche | `app.routes.ts`, `pages/players/*` | A |
| ANA-10 | Mostrare la foto/avatar nella lista giocatori | `player-list.component.html` usa `profilePictureUrl` con fallback | **C**: il backend `Player.java` e `PlayerRequest.java` esaminati **non contengono** `profilePictureUrl`; upload della foto non provato |

## 2 — Partite e calendario sportivo interno

| ID | Funzione | Evidenza | Stato |
|---|---|---|---|
| PAR-01 | Creare, leggere, modificare ed eliminare partite | `MatchController.java`, `MatchService.java`, `match-form.component.ts`, `match-list.component.ts` | A |
| PAR-02 | Memorizzare avversario, data, ora, campo/luogo e casa/trasferta | `MatchRequest.java`, `Match.java` | A |
| PAR-03 | Stato partita, risultato e note | `MatchRequest.java`, `MatchController.java` | A |
| PAR-04 | Cercare/filtrare partite, prossimi incontri e intervalli di date | `MatchService.java`, `MatchController.java`, `match-list.component.ts` | A |
| PAR-05 | Consultare il dettaglio di una partita | `match-detail.component.ts`, rotta `matches/:id` | A |
| PAR-06 | Sincronizzare partite con Google Calendar | Stato storico in `docs/status/current.md` la indica **mancante** | **NR** |

## 3 — Convocazioni

| ID | Funzione | Evidenza | Stato |
|---|---|---|---|
| CON-01 | Creare e aggiornare convocazione collegata a una partita | `CallupController.java`, `CallupService.java` | A |
| CON-02 | Selezionare/deselezionare i convocati | `callup-editor.component.ts` e modello `CallupPlayer` | A |
| CON-03 | Consultare esistenza e dettaglio convocazione | `GET /team/matches/{matchId}/callup`, `/exists` | A |
| CON-04 | Stato bozza e pubblicazione della convocazione | `CallupController.java` POST `/publish`, `CallupStatus.java` | A |
| CON-05 | Eliminazione della convocazione | `CallupController.java` DELETE | B |
| CON-06 | Controllo idoneità sportiva per convocazione | `PlayerEligibilityService.java`, `EligibilityController.java`, `callup-editor.component.ts` | A |
| CON-07 | PDF della convocazione | `CallupController.java` GET `/pdf`, `PdfService.java`, `PdfServiceTest.java` | **B/A**: API e servizio presenti; interfaccia di stampa da riverificare |
| CON-08 | Invio email alla pubblicazione della convocazione | `NotificationService.notifyCallupPublished`, `EmailService.sendCallupNotification` | B; funziona se configurato SMTP/attivato |

## 4 — Allenamenti e presenze

| ID | Funzione | Evidenza | Stato |
|---|---|---|---|
| ALL-01 | Creare/aggiornare/eliminare sessione di allenamento | `TrainingController.java`, `TrainingService.java`, `training-form.component.ts` | A |
| ALL-02 | Tipologia, orari, luogo, descrizione e note | `TrainingSessionRequest.java`, `training.model.ts` | A |
| ALL-03 | Stato programmato/completato/annullato | `TrainingController.java` `/complete` e `/cancel` | A |
| ALL-04 | Lista, prossime sessioni e ricerca per data/intervallo | `TrainingController.java`, `training-list.component.ts` | A |
| ALL-05 | Calendario mensile **interno** degli allenamenti | `training-calendar.ts`, `training-calendar.html` e rotta `training/calendar` | A; NON Google Calendar |
| ALL-06 | Presenze per singolo giocatore, registrazione singola o multipla | `TrainingController.java` `/attendance` e `/attendance/bulk`, `training-detail.component.ts` | A |
| ALL-07 | Stati di presenza e note | `AttendanceStatus.java`, `AttendanceService.java`, modelli Angular | A |
| ALL-08 | Storico/statistiche presenze per periodo e giocatore | `TrainingController.java` `/stats/attendance`, `/period`, `/player/{id}` | B; logica backend e UI di dettaglio, rappresentazione completa da verificare |

## 5 — Documenti associati al giocatore

| ID | Funzione | Evidenza | Stato |
|---|---|---|---|
| DOC-01 | Elenco documenti del singolo giocatore | `DocumentController.java`, `player-documents.component.ts` | A |
| DOC-02 | Caricamento file PDF e immagini, con controllo estensione/dimensione | `DocumentController.uploadDocument`, `DocumentService.validateFile`, `player-documents.component.ts` | A |
| DOC-03 | Download del documento | `DocumentController.downloadDocument`, frontend `downloadDocument` | A |
| DOC-04 | Eliminare documento | `DocumentController.deleteDocument`, frontend `deleteDocument` con conferma | A |
| DOC-05 | Tipo documento, descrizione, scadenza e metadati file | `PlayerDocument.java`, `DocumentUploadRequest.java`, form | A |
| DOC-06 | Filtrare documenti per tipo | `DocumentController.java` `/type/{type}` | B |
| DOC-07 | Indicatore di validità/avvicinamento scadenza/scaduto | `DocumentStatus.java`, `document-status-badge`, `DocumentService` | A |
| DOC-08 | Alert documenti scaduti e in scadenza | `EligibilityController.java`, `AlertService.java`, dashboard | A |
| DOC-09 | Archivio fisico in cartelle per giocatore | `DocumentService.storeFile` salva nel filesystem in `player-{id}/...` | **A (solo filesystem storico)** |
| DOC-10 | Google Drive, cartelle condivise e `drive_folder_id` | Non presenti nei servizi del vecchio gestionale | **NR** |
| DOC-11 | Upload di ricevuta **collegata a ogni versamento** | `FeePayment.java` non contiene ID file o allegato | **NR** come funzione specifica; l'upload documenti è generico |

**Nota:** per i nuovi documenti su Drive la soluzione andrà implementata con le API Google; non è già disponibile nel vecchio codice. Il trattamento di certificati medici va progettato con accessi e garanzie specifici.

## 6 — Infortuni e idoneità (dati sanitari)

| ID | Funzione | Evidenza | Stato |
|---|---|---|---|
| SAL-01 | Registrare infortunio con tipologia, gravità e note | `InjuryController.java`, `InjuryService.java`, `player-injuries.component.ts` | A |
| SAL-02 | Stato infortunio e data prevista di recupero/risoluzione | `PlayerInjury.java`, `InjuryController.java` `/resolve` | A |
| SAL-03 | Storico infortuni per giocatore | `InjuryController.java`, `player-injuries.component.ts` | A |
| SAL-04 | Verifica automatica idoneità basata su documenti sanitari, infortuni e sospensioni | `PlayerEligibilityService.java`, `EligibilityController.java` | A/B |
| SAL-05 | Elenco infortuni attivi e relativo alert | `EligibilityController.java`, `AlertService.java` | A |

**Rilevato, non autorizzato all'uso futuro.** Sono funzioni che trattano dati sulla salute: non basta che il codice esista per trasferirle nella nuova app.

## 7 — Disciplina e squalifiche

| ID | Funzione | Evidenza | Stato |
|---|---|---|---|
| DIS-01 | Inserire, modificare, eliminare cartellino giallo/rosso | `DisciplinaryCardController.java`, `DisciplinaryCardService.java`, `card-form.component.ts` | A |
| DIS-02 | Collegare cartellino a partita e giocatore, minuto/motivo | `DisciplinaryCardRequest.java` | A |
| DIS-03 | Storico cartellini per giocatore e per partita | `DisciplinaryCardController.java` `/players`, `/matches`, scheda `player-cards` | A |
| DIS-04 | Calcolo squalifica e marcatura squalifica scontata | `/suspension-status`, `/serve-suspension`, `DisciplinaryCardService.java` | A |
| DIS-05 | Integrazione della squalifica nel controllo idoneità | `PlayerEligibilityService.java` | A/B |

## 8 — Quote e registrazioni di versamento (modulo squadra)

| ID | Funzione | Evidenza | Stato |
|---|---|---|---|
| QUO-01 | Creare/modificare/eliminare quota del singolo giocatore | `FeeController.java`, `FeeService.java`, `fee-form.component.ts` | A |
| QUO-02 | Tipo, descrizione, importo, scadenza e stato della quota | `PlayerFee.java`, `FeeType.java`, `FeeStatus.java` | A |
| QUO-03 | Registrare **uno o più versamenti** sulla stessa quota | `FeePayment.java`, `FeeService.recordPayment`, `payment-form.component.ts` | A |
| QUO-04 | Data, importo, modalità e nota di un versamento | `FeePayment.java`, `PaymentRequest.java` | A |
| QUO-05 | Calcolo importo residuo, quote scadute e elenco quote | `FeeController.java` `/outstanding`, `/overdue`, `/fees` | A |
| QUO-06 | Storico quote e pagamenti della singola persona | `player-fees.component.ts`, `FeeController.java` | A |
| QUO-07 | Allegare specificamente ricevuta al versamento | Non presente in `FeePayment.java`; i documenti sono modulo a parte | **NR** |
| QUO-08 | Elaborazione pagamento online nel semplice modulo quote | `FeeController` registra versamenti, non incassa carte | **NR** in questo modulo |

**Differenza importante:** questo modulo quote è distinto dal grande `finance-service`. Nel profilo **demo** storico, `environment.features.finance = false`, quindi le rotte quote e pagamenti sono volutamente nascoste, pur avendo codice.

## 9 — Risultati e statistiche sportive

| ID | Funzione | Evidenza | Stato |
|---|---|---|---|
| STA-01 | Registrare goal, assist, minuti e note di prestazione per giocatore/partita | `MatchStatisticController.java`, `MatchStatisticService.java` | A |
| STA-02 | Inserimento in blocco statistiche di una partita | `/matches/{matchId}/statistics/bulk` | B |
| STA-03 | Modifica/cancellazione statistiche per giocatore/partita | `MatchStatisticController.java` | A/B |
| STA-04 | Storico partite, statistiche personali e aggregazioni di periodo | `player-matches.component.ts`, `player-stats.component.ts`, `MatchStatisticService.java` | A |
| STA-05 | Classifica marcatori e assist | `/statistics/top-scorers`, `top-scorers.component.ts` | A |
| STA-06 | Dashboard squadra con grafici e filtri per intervallo | `team-stats.component.ts`, `statistics.service.ts`, Chart.js | A |
| STA-07 | Sintesi risultati, vittorie/pareggi/sconfitte, goal fatti/subiti, contributori | `team-stats.component.ts`, `statistics.service.ts` | A, calcoli lato UI |

## 10 — Stagioni, competizioni, classifiche

| ID | Funzione | Evidenza | Stato |
|---|---|---|---|
| STG-01 | Creazione, lettura, modifica ed eliminazione stagione sportiva | `SeasonController.java`, `SeasonService.java`, `season-list`, `season-form` | A |
| STG-02 | Selezionare stagione attiva e leggerla | `SeasonController.java` `/active`, `/{id}/activate`, `SeasonService.java` | A/B |
| STG-03 | Elencare competizioni di una stagione | `SeasonController.java`, `season-detail.ts` | A |
| STG-04 | CRUD competizioni (campionato/coppa/torneo ecc.) | `CompetitionController.java`, `CompetitionService.java` | **B**: API presente; interfaccia dedicata completa non individuata |
| STG-05 | Memorizzare/aggiornare classifiche e posizioni | `CompetitionController.java` `/standings`, `StandingService.java` | **B**: backend; UI specifica non verificata |

## 11 — Dashboard, alert e notifiche

| ID | Funzione | Evidenza | Stato |
|---|---|---|---|
| NAV-01 | Dashboard con conteggi giocatori, incontri e prossime partite | `dashboard.ts` | A |
| NAV-02 | Alert documenti in scadenza, infortuni attivi e partite prive di convocazione | `AlertService.java`, `EligibilityController.java`, `dashboard.ts` | A |
| NAV-03 | Preferenze personali sulle notifiche (tipi attivi/disattivi, anticipo) | `NotificationController.java`, `NotificationService.java`, `notification-preferences.ts` | A |
| NAV-04 | Email di convocazione pubblicata tramite SMTP | `EmailService.java`, `NotificationService.java` | **B**: servizio realizzato, invio dipende da SMTP/configurazione |
| NAV-05 | Job schedulato per promemoria email scadenza documenti | `NotificationService.java` con `@Scheduled` e invio asincrono | **B**: logica presente, esecuzione dipende da stack attivo |
| NAV-06 | Preferenze e storico/contatore email in coda | `NotificationController.java` e repository notifiche | B |
| NAV-07 | Integrazione diretta con **Gmail API** | Nessun client Gmail API individuato | **NR** |
| NAV-08 | Notifiche push native/browser | `docs/status/current.md` indica push mancanti | **NR** |

## 12 — Gestione utenti e autorizzazioni del progetto storico

| ID | Funzione | Evidenza | Stato |
|---|---|---|---|
| UTE-01 | Login username/password e rilascio access token JWT | `AuthController.java`, `security-service`, `login.component.ts` | A |
| UTE-02 | Registrazione utente (attivabile/disattivabile via configurazione) | `AuthController.java`, `register.component.ts`, feature flag | A |
| UTE-03 | Ruoli ADMIN, SECRETARY, COACH, PLAYER e protezione delle rotte | `UserController.java`, `app.routes.ts`, `guards/*` | A |
| UTE-04 | Elenco, creazione, modifica, cancellazione utenti e assegnazione ruoli | `UserController.java`, `user-list.component.ts`, `user-form.component.ts` | A |
| UTE-05 | Profilo utente e preferenze | `UserController.java`, `user-profile.component.ts`, `notification-preferences.ts` | A |
| UTE-06 | Refresh e logout con revoca refresh token | `AuthController.java` | **B/C**: backend implementato, ma l'audit demo segnala **mancato uso del refresh token nel frontend** |
| UTE-07 | Login tramite Google OAuth | `docs/status/current.md` indica OAuth2 non disponibile; codice storico usa JWT custom | **NR** |
| UTE-08 | Regola di accesso a **due soli account Google** | Nuovo requisito, non implementazione storica | **NR** |

**Non trasferire le autorizzazioni dal vecchio codice presupponendo che siano già corrette:** sono un'altra architettura e un altro modello di utenti. Nella futura app con due utenti si dovranno usare controlli reali di accesso Google.

## 13 — Contabilità avanzata (`finance-service`): codice presente ma funzione separata

| ID | Funzione | Evidenza | Stato |
|---|---|---|---|
| FIN-01 | Registrazioni di cassa/ledger: elenco, inserimento, modifica, cancellazione | `LedgerController.java`, `LedgerService.java` | **B**: API implementata, UI finance storicamente scaffold |
| FIN-02 | Piani di pagamento e rate per giocatore | `PaymentPlanController.java`, `PaymentPlanService.java` | B |
| FIN-03 | Registrare una rata pagata | `PaymentPlanController.java` `/installments/{id}/pay` | B |
| FIN-04 | Fatture: creazione, modifica, emissione | `InvoiceController.java`, `InvoiceService.java` | B |
| FIN-05 | Generazione ed esportazione XML fattura | `InvoiceController.java` `/xml`, `/xml/download` | **B**, conformità fiscale non certificata |
| FIN-06 | Richieste rimborso, approvazione e pagamento | `ReimbursementController.java`, `ReimbursementService.java` | B |
| FIN-07 | Certificazioni/ricevute fiscali con PDF | `TaxDeductionController.java`, `TaxDeductionService.java` | **B**, criticità di accesso segnalata nell'audit demo |
| FIN-08 | Alert finanziari | `FinanceAlertsController.java`, `FinanceAlertService.java` | B |
| FIN-09 | Checkout PayPal + webhook | Endpoint e servizio presenti, ma `finance-service/STATUS.md` indica **integrazione PayPal sospesa** | **C** |
| FIN-10 | Schermate Angular per ledger, pagamenti, fatture, rimborsi, ricevute e alert | `pages/finance/*`, `ui-angular-app/STATUS.md` le definisce **UI scaffold** | **C** |

**Nota di sicurezza storica:** l'audit `docs/development/demo-readiness-audit-2026-10-11.md` descrive un problema P1 ancora fuori scope demo: lettura di ricevute fiscali senza corretta verifica del proprietario nel modulo finance. **Non usare queste API su dati reali finché il problema non è risolto e verificato.** Il servizio finance è escluso dal profilo demo.

## 14 — Interfaccia, usabilità e funzionalità PWA

| ID | Funzione | Evidenza | Stato |
|---|---|---|---|
| UX-01 | Layout responsive con navigazione e componenti condivisi | `shared/layout`, `shared/sidebar`, componenti pagine | A |
| UX-02 | Applicazione web installabile PWA, manifest e icone | `ui-angular-app/public/manifest.webmanifest`, `ngsw-config.json` | **C**: configurato e riportato nei test storici, installazione su dispositivo non riprovata qui |
| UX-03 | Service worker, gestione aggiornamenti e prompt di installazione | `pwa.service.ts`, `ngsw-config.json` | C |
| UX-04 | Pagina fallback offline e cache di asset/alcune richieste API | `public/offline.html`, `ngsw-config.json` | C; non garantisce editing offline |
| UX-05 | Interfaccia in italiano e inglese | `assets/i18n/it.json`, `en.json`, `translate.service.ts` | A |
| UX-06 | Messaggi operativi, conferme prima di eliminare e stati di caricamento | `shared/notification`, `shared/confirm-dialog`, componenti pagine | A |
| UX-07 | Schermate statistiche con grafici Chart.js | `team-stats.component.ts` | A |
| UX-08 | Gestione errori globale/interceptor | `core/handlers`, `core/interceptors` | A/C |

**Caveat tecnico:** alcune URL in `ngsw-config.json` indicano `/api/players`, `/api/matches`, `/api/training`, mentre le rotte del servizio sono `/api/team/...` attraverso gateway. L'effettiva copertura della cache API va verificata: non presumere che la sincronizzazione offline funzioni. Caching di dati personali su dispositivi richiede inoltre una valutazione specifica.

## 15 — Esportazioni, report e attività operative

| ID | Funzione | Evidenza | Stato |
|---|---|---|---|
| EXP-01 | **PDF convocazioni** | `CallupController.java` `/pdf`, `PdfService.java` | **B/A** |
| EXP-02 | Export lista giocatori in PDF/Excel | `docs/features/EXPORT_FEATURES.md` specifica prevista in Phase 6; `PlayerController` senza `/export` | **D** |
| EXP-03 | Report giocatore PDF | `EXPORT_FEATURES.md`; `PlayerController` senza `/{id}/report` | **D** |
| EXP-04 | Export calendario partite PDF/Excel/iCal | `EXPORT_FEATURES.md`, endpoint non presente in `MatchController` | **D** |
| EXP-05 | Report partita e classifica, statistiche PDF/Excel | `EXPORT_FEATURES.md`, endpoint riportati come planned | **D** |
| EXP-06 | Dashboard report generale | `pages/reports/reports.ts` dice **Under construction**, non è una vista completa | **C** |
| OPS-01 | Migrazioni DB, backup/deploy/CI, guide demo e automazioni infrastrutturali | `scripts/*`, `docs/deployment/*`, `Jenkinsfile`, `docker-compose*` | **C**: infrastruttura storica non necessaria per dire che una funzione utente sia implementata |
| OPS-02 | Test unitari/integrazione e Playwright | `team-service/src/test`, `security-service/src/test`, `finance-service/src/test`, `ui-angular-app/e2e` | **C**: suite presenti, non eseguite ora |

## 16 — Cosa non risultava già implementato, pur essendo utile al nuovo progetto

Questi elementi **non sono funzioni recuperabili direttamente dal vecchio codice**: richiederebbero una nuova integrazione, pur potendo sfruttare la logica e le schermate storiche come riferimento.

| Richiesta nuova | Esito della ricognizione |
|---|---|
| Google Sign-In / OAuth con due account autorizzati | **Non presente**: il sistema storico usa credenziali proprie e JWT |
| Lettura/scrittura di Google Sheets da app mantenendo modifiche manuali | **Non presente**: dati storici in Oracle |
| Eventi e sincronizzazione con Google Calendar | **Non presente**: calendario allenamenti interno e partite in database |
| Cartella Drive per ciascun giocatore | **Non presente**: documenti storici su filesystem locale |
| Upload documenti direttamente in Drive dalla scheda giocatore | **Non presente**: il vecchio upload usa storage locale |
| Allegato di ricevuta collegato a uno specifico pagamento | **Non presente** nel modello `FeePayment` |
| Utilizzo di Gmail API | **Non presente**: email tramite SMTP |
| Modifica manuale in Google Sheets e aggiornamento nella app | **Non presente**: il gestionale storico gestisce internamente i dati |

## 17 — Risultati dei test storici e limiti conosciuti

Il documento `docs/development/demo-readiness-audit-2026-10-11.md`, con aggiornamento datato 2026-10-15, dichiara una verifica demo con **156 test security (3 saltati), 419 team (3 saltati), 84 gateway, 290 Angular e 76 Playwright superati**; segnala però che molte prove browser usavano API simulate e che il collaudo finale con Docker/ThinkCentre era ancora da effettuare. Non sono risultati misurati in questa ricognizione.

Tra i limiti indicati:
- rinnovo del token non gestito coerentemente nell'interfaccia;
- problema storico di accesso alle ricevute fiscali nel finance-service, escluso dalla demo ma non corretto;
- integrazioni Google assenti;
- rapporti/export generici ancora pianificati;
- UI del grande finance-service dichiarata scaffold;
- upload documenti con limite di 10 MiB e archiviazione su filesystem, non Drive.

## 18 — Registro neutro da usare **solo dopo** questo censimento

La classificazione di quali funzioni servono **non viene fatta adesso**. Quando vorremo discuterle, prendiamo ciascun ID di questa tabella e annotiamo separatamente:

| ID funzione | Utilizzata oggi? | Utile nella nuova PWA? | È già offerta da Google? | Complessità di reimplementazione | Decisione |
|---|---|---|---|---|---|
| (es. ANA-01) | da compilare | da compilare | da compilare | da stimare | **non ancora presa** |

**Non modificare lo schema Google esistente in base a questo inventario.** Finché non avremo concluso la valutazione delle funzioni, i documenti 07–11 rimangono bozze o analisi preliminari, e non istruzioni per costruire l'app.

## Fonti principali interne all'archivio storico

- `docs/status/current.md` — stato dichiarato dei moduli e limiti.
- `docs/development/demo-readiness-audit-2026-10-11.md` — verifica demo, problemi risolti e limiti rimasti.
- `team-service/STATUS.md`, `finance-service/STATUS.md`, `ui-angular-app/STATUS.md`, `security-service/STATUS.md`.
- `docs/features/EXPORT_FEATURES.md` — esportazioni **pianificate**.
- `team-service/src/main/java/com/PierLorrai/Gestionale/team_service/controller/*Controller.java`.
- `team-service/src/main/java/com/PierLorrai/Gestionale/team_service/service/*.java`.
- `team-service/src/main/java/com/PierLorrai/Gestionale/team_service/model/*.java`.
- `security-service/src/main/java/com/PierLorrai/Gestionale/controller/*.java`.
- `finance-service/src/main/java/com/PierLorrai/Gestionale/finance_service/controller/*.java`.
- `ui-angular-app/src/app/app.routes.ts`, `pages/**/*`, `core/services/*`.
- `ui-angular-app/ngsw-config.json`, `ui-angular-app/public/manifest.webmanifest`.

**Protezione dei dati:** non inserire nel nuovo repository pubblico file `.env`, credenziali, password o dati di giocatori reali contenuti negli archivi storici.
