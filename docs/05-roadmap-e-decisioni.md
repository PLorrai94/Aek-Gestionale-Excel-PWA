# 05 — Roadmap, verifiche e decisioni

**Stato:** piano per piccoli incrementi. Nessuna data di consegna promessa.

## Fase 0 — Definire e provare un modello nostro (ora)

**Da produrre solo documentazione:** schema Sheets nuovo senza adattare gli Excel esistenti, regole per chiavi/stati, istruzioni per modifica manuale, flussi tra Sheets e Calendar, esempi con dati *fittizi*. L'inventario degli Excel precedenti è esplicitamente fuori dalla fase attuale.

**Criterio di fine:** il responsabile e almeno un altro utilizzatore verificano lo schema proposto su carta, inclusi i casi in cui un record viene riordinato, reso inattivo o modificato da un'altra persona.

## Fase 1 — Organizzare gli strumenti Google

Senza costruire ancora l'app: identificare il proprietario dei dati, creare o riutilizzare una cartella condivisa, creare da zero il file `AEK_Dati_Squadra` secondo lo schema approvato, selezionare il calendario ufficiale, definire le condivisioni.

**Criterio di fine:** due collaboratori autorizzati possono modificare un dato di prova nello stesso foglio e vedere il risultato; un account non autorizzato non può modificare né leggere l’archivio riservato.

## Fase 2 — Prima app: consultazione rapida

Creare solo quando la fase 1 è stabile: PWA responsive con accesso Google, schermata Squadra, Agenda e collegamenti Drive. Integrazioni ridotte al minimo; nessun nuovo archivio parallelo.

**Criterio di fine:** la stessa informazione è consultabile da browser desktop, iPhone e Android; gli eventi arrivano dal calendario reale; i dati privati non sono pubblici.

## Fase 3 — Modifiche condivise dall'app

Per gli editor autorizzati: aggiunta/modifica delle schede essenziali, controlli sui campi, gestione dei conflitti o almeno regole chiare per non sovrascrivere modifiche altrui. Nessun edit per giocatore sulla propria riga senza il necessario controllo lato server.

**Criterio di fine:** modifiche da due dispositivi sono visibili e corrette; tentativi di scrittura non autorizzati falliscono; la cronologia e il ripristino dei fogli sono verificati.

## Fase 4 — Partecipazioni, se davvero utili

Convocazioni, disponibilità e presenze collegate agli eventi Google Calendar. Se le disponibilità arrivano già efficacemente via un modulo o un altro metodo, non ricostruire il processo senza beneficio concreto.

**Criterio di fine:** è possibile selezionare un evento, segnare lo stato di una persona e ritrovare l'informazione senza copiarla altrove.

## Cose da NON pianificare adesso

Pagamenti, portale pubblico, ruoli con decine di livelli, notifiche push, automazioni Gmail, statistiche avanzate, offline editabile, sviluppo nativo iOS/Android, infrastruttura Docker/Kubernetes, microservizi e database dedicato.

## Registro decisioni

| ID | Proposta | Stato | Motivazione |
| --- | --- | --- | --- |
| D-01 | Gestire una sola squadra all'inizio | Da confermare | Riduce il modello dati |
| D-02 | Usare Google Sheets nativo come archivio principale | Consigliata, da validare | Integrazione API e modifica condivisa |
| D-03 | Usare un calendario Google come fonte ufficiale per eventi | Consigliata, da validare | Evita doppioni |
| D-04 | PWA invece di app native separate | Consigliata, da validare | Un'unica interfaccia per telefono e browser |
| D-05 | **Solo responsabili, allenatori e collaboratori esplicitamente autorizzati possono modificare dati nella v1** | **CONFERMATA — 2026-11-09** | Mantiene semplice il modello e limita l’accesso in scrittura |
| D-06 | Gmail tramite collegamenti, non accesso alla casella | Consigliata, da validare | Minori permessi e complessità |
| D-07 | Nessun backend nel primo prototipo | Proposta, compatibile con D-05 | Rivalutare se servono permessi granulari o procedure automatiche di modifica |
| D-08 | Nuovo schema a 5 schede, indipendente dai vecchi Excel | Proposto v0.2 | Supporta modifica manuale e via app |
| D-09 | Calendar fonte ufficiale per data/ora/luogo; `Eventi` è solo un indice | Proposto v0.2 | Niente doppio calendario |
| D-10 | ID permanenti per persone ed eventi, indipendenti dalla riga | Proposto v0.2 | Evita collegamenti fragili |
| D-11 | **Solo due persone esplicitamente autorizzate possono accedere ai dati ordinari, sia in lettura sia in modifica** | **CONFERMATA — 2026-11-09; specifica ulteriormente D-05** | Nessun accesso giocatore/altro staff per la v1 |
| D-12 | **Censire tutte le funzioni effettivamente presenti nel vecchio codice prima di qualsiasi scelta** | **IN CORSO — [inventario](12-inventario-funzioni-implementate-vecchio-progetto.md)** | Non scegliere ora cosa mantenere, né cambiare il modello Google sulla base di ipotesi |

## Blocco decisioni funzionali

Il documento [12 — Inventario delle funzioni storiche](12-inventario-funzioni-implementate-vecchio-progetto.md) precede la valutazione delle nuove funzionalità. La roadmap tecnica è ancora una bozza: **nessuna nuova feature è approvata dal solo fatto di essere implementata nel vecchio progetto**.

## Regola di avanzamento

La scelta D-11 specifica D-05: nella v1 **solo due persone accedono ai dati (lettura e modifica)**. Non è previsto accesso giocatori, neppure in lettura. Restano da identificare privatamente i due account e da verificare la liceità degli accessi ai dati sanitari.

Non aprire la fase seguente finché la precedente non è stata provata con i processi reali. Una nuova funzionalità deve sempre indicare **chi la userà, quando, quale dato legge/scrive e come capire se funziona**.
