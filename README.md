# AEK Gestionale — Documentazione del progetto

> **Versione documentazione:** 0.4 (analisi funzionale e accessi) — 9 novembre 2026. **Solo progettazione:** nessuna applicazione, foglio Google o calendario creato da questa documentazione.

AEK Gestionale è un progetto **semplice** per organizzare una sola squadra amatoriale: componenti, allenamenti, partite, convocazioni, disponibilità, presenze e documenti.

L'interfaccia futura sarà una **PWA mobile-first** installabile su iPhone/Android e usabile via browser. Il progetto si basa su Google Sheets, Calendar, Drive e collegamenti a Gmail: non sostituisce questi strumenti, li unisce.

## Prima versione applicativa v0.1 (branch dev)

Il repository contiene ora un **prototipo PWA mobile-first realmente navigabile**, senza build: apri [index.html](index.html) su un hosting statico HTTPS per visualizzare la **demo interattiva con dati fittizi**.

Le funzioni presenti nel codice sono **anagrafica persone**, **scheda giocatore**, **registro quote (senza incassi online)**, **indice documenti/link Drive**, **agenda Google Calendar in lettura**, **cartelle Drive per giocatore** e upload di PDF/immagini entro 5 MB (previa autorizzazione Google). L'accesso ai dati Google richiede una configurazione OAuth e la condivisione privata dei file con **due soli account**. Non sono caricati certificati medici in questa versione.

**La PWA non è ancora pubblicata su un dominio né verificata con account Google reali.** Per la messa in funzione consulta [14 — Guida di avvio v0.1](docs/14-avvio-prima-versione.md). I nuovi fogli richiesti dal codice sono soltanto **Persone, Quote, Documenti**; le altre schede dello schema teorico sono proposte future. In questa fase non sono stati creati fogli, cartelle o calendari Google reali.

**Test disponibili:** Node.js 20+ con il comando `node --test tests/*.test.mjs`. Nessun pacchetto esterno da installare.

## Decisione confermata: accesso ai dati soltanto per 2 persone

**Esattamente due persone autorizzate potranno consultare e modificare tutti i dati ordinari della squadra nella prima versione**. Useranno due account Google specifici con condivisioni private su Sheets, Drive e Calendar. Giocatori, altri allenatori/collaboratori ed esterni non hanno accesso, neppure in sola lettura. L'accesso a eventuali dati sanitari va autorizzato separatamente secondo necessità e condizioni applicabili: i due account non sono automaticamente legittimati a tutto. I dettagli sono in [04 — Architettura e sicurezza](docs/04-architettura-e-sicurezza.md) e [11 — Analisi vecchio gestionale](docs/11-recupero-funzioni-vecchio-gestionale.md).

## Decisione v0.2: progettare uno schema nuovo da zero

**Non adattiamo gli Excel esistenti.** Progettiamo dati con intestazioni e identificativi stabili, modificabili sia direttamente in Google Sheets sia dalla futura app.

**Un solo file Google Sheets** `AEK_Dati_Squadra` con cinque schede:

1. `Persone` — giocatori e staff.
2. `Eventi` — indice minimale per collegare gli eventi di Google Calendar a convocazioni e presenze.
3. `Partecipazioni` — convocazioni, disponibilità e presenze per coppia evento/persona.
4. `Liste` — opzioni ufficiali per i menu a tendina.
5. `Guida` — istruzioni per chi modifica i dati manualmente.

La **data, l'ora e il luogo degli eventi** rimangono in **Google Calendar** (unica fonte autorevole); il foglio `Eventi` contiene solo l'identificativo interno, il collegamento Calendar e pochi metadati necessari all'app. I documenti vivono in Drive. Gmail resta gestito da Gmail, non da una copia di messaggi nell'app.

## Leggi i documenti

1. [Visione e perimetro](docs/01-visione-e-perimetro.md)
2. [Persone e flussi](docs/02-persone-e-flussi.md)
3. [Dati e strumenti Google](docs/03-dati-e-google-workspace.md) — **aggiornato v0.2**
4. [Architettura e sicurezza](docs/04-architettura-e-sicurezza.md) — **aggiornato v0.2**
5. [Roadmap e decisioni](docs/05-roadmap-e-decisioni.md) — **aggiornato v0.2**
6. [Raccolta esigenze](docs/06-raccolta-esigenze.md)
7. [Modello dati e regole](docs/07-modello-dati.md) — **nuovo, documento di riferimento**
8. [Operazioni manuali e dall'app](docs/08-procedure-e-sincronizzazione.md) — **nuovo**
9. [Esempi con dati fittizi](docs/09-esempi-dati.md) — **nuovo**
10. [Quote e documenti personali su Drive](docs/10-quote-documenti-drive.md) — **proposta da discutere, non ancora approvata**
11. [Prima analisi del vecchio gestionale](docs/11-recupero-funzioni-vecchio-gestionale.md) — **ipotesi preliminari, nessuna priorità approvata**
12. [Inventario completo delle funzioni presenti nel codice storico](docs/12-inventario-funzioni-implementate-vecchio-progetto.md) — **censimento neutrale, fonte principale prima di decidere**
14. [Guida di avvio prima versione PWA](docs/14-avvio-prima-versione.md) — **configurazione Google, privacy e test**

## Regole non negoziabili

- **Un solo dato ufficiale**: evitare copie attive degli stessi eventi e delle stesse persone.
- **Modifiche manuali e dall'app equivalenti**: la UI non deve richiedere colonne o formule che un editor umano non possa capire.
- **ID immutabili**: i collegamenti non dipendono dal numero della riga né da nome/cognome.
- **Nessuna gestione pagamenti** o contabilità.
- **Privacy e autorizzazioni**: accesso ai dati ordinari riservato ai due account Google esplicitamente autorizzati, senza accessi giocatore nella v1. Per i certificati sanitari servono verifiche/autorizzazioni specifiche. Le protezioni delle celle non sono misure di sicurezza.
- **Nessun segreto o dato personale nel codice pubblico**: la PWA v0.1 contiene soltanto codice applicativo e dati demo *fittizi*. Non inserire file .env, token o dati personali nel repository.

## Stato

**Fase attuale: prototipo v0.1 realizzato su dev per sperimentare con dati inventati; la valutazione finale delle funzioni storiche rimane aperta.** Le ipotesi dei documenti precedenti non sono decisioni di sviluppo. Il documento [12 — Inventario](docs/12-inventario-funzioni-implementate-vecchio-progetto.md) distingue codice esistente, implementazioni parziali e voci pianificate.

Il criterio dei **due utenti autorizzati è confermato**; gli altri aspetti rimangono uno **schema proposto**, non ancora validato dalla squadra. L'elenco dei campi è volutamente piccolo. Non è stata effettuata alcuna migrazione dagli Excel esistenti.
