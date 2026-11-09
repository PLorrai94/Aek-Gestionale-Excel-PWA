# AEK Gestionale — Documentazione del progetto

> **Versione documentazione:** 0.3 — 9 novembre 2026. **Solo progettazione:** nessuna applicazione, foglio Google o calendario creato da questa documentazione.

AEK Gestionale è un progetto **semplice** per organizzare una sola squadra amatoriale: componenti, allenamenti, partite, convocazioni, disponibilità, presenze e documenti.

L'interfaccia futura sarà una **PWA mobile-first** installabile su iPhone/Android e usabile via browser. Il progetto si basa su Google Sheets, Calendar, Drive e collegamenti a Gmail: non sostituisce questi strumenti, li unisce.

## Decisione confermata v0.3: chi può modificare i dati

**Solo responsabili, allenatori e collaboratori espressamente autorizzati potranno modificare i dati nella prima versione**, tanto dal foglio Google quanto dalla futura app. Il ruolo sportivo non assegna automaticamente accesso: serve una condivisione Google esplicita. Giocatori non autorizzati e persone esterne non modificano l'archivio; l'eventuale consultazione dei dati da parte dei giocatori è ancora da definire. I dati privati non devono essere divulgati tramite fogli o collegamenti pubblici. I dettagli sono in [04 — Architettura e sicurezza](docs/04-architettura-e-sicurezza.md).

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

## Regole non negoziabili

- **Un solo dato ufficiale**: evitare copie attive degli stessi eventi e delle stesse persone.
- **Modifiche manuali e dall'app equivalenti**: la UI non deve richiedere colonne o formule che un editor umano non possa capire.
- **ID immutabili**: i collegamenti non dipendono dal numero della riga né da nome/cognome.
- **Nessuna gestione pagamenti** o contabilità.
- **Privacy e autorizzazioni**: modifica solo a responsabili, allenatori e collaboratori esplicitamente autorizzati; i giocatori non sono editor nella v1. Le protezioni delle celle non sono misure di sicurezza.
- **Niente codice o credenziali in questa fase**: il repository pubblico contiene solo documentazione e, in futuro, esempi *fittizi*.

## Stato

Il criterio sugli editor è **confermato**; gli altri aspetti rimangono uno **schema proposto**, non ancora validato dalla squadra. L'elenco dei campi è volutamente piccolo. Non è stata effettuata alcuna migrazione dagli Excel esistenti.
