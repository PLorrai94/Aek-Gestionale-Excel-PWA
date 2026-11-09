# 03 — Struttura Google: modello proposto v0.3

## L'idea

Usiamo i servizi Google già disponibili, ma senza costringere chi lavora a usare l'app. Un collaboratore può aprire Sheets, modificare un valore e ritrovarlo nella PWA; un collaboratore può modificare lo stesso dato dalla PWA e vederlo in Sheets. La sincronizzazione effettiva sarà progettata/validata durante lo sviluppo.

Non partiamo dai vecchi Excel e **non manteniamo copie parallele `.xlsx`** dei dati attivi. Lo standard di lavoro sarà **Google Sheets nativo**. Gli `.xlsx` restano eventualmente solo esportazioni, non fonti concorrenti.

## Spazio Drive della squadra

```text
AEK_Squadra/                               [cartella condivisa, accesso riservato]
├── 01_Dati/                                [solo staff autorizzato]
│   └── AEK_Dati_Squadra                    [Google Sheets: 5 schede]
├── 02_Documenti/                           [permessi per singolo documento]
├── 03_Modelli_e_istruzioni/                [documenti e guide]
└── 90_Archivio_e_backup/                   [accesso ristretto]
```

Una cartella condivisa in **Il mio Drive** è sufficiente nella prima fase. Un *Drive condiviso* Google Workspace è un'altra modalità (non obbligatoria), da valutare soltanto se già disponibile.

## Il file `AEK_Dati_Squadra`

| Scheda | Funzione | Chi la modifica | Regola |
|---|---|---|---|
| `Persone` | Anagrafica minima di giocatori e staff | Staff fidato / app autorizzata | 1 riga = 1 persona |
| `Eventi` | Collegare Calendar alle attività della squadra | Staff fidato / app autorizzata | 1 riga = 1 evento referenziato |
| `Partecipazioni` | Convocazioni, disponibilità, presenze | Staff fidato / app autorizzata | 1 riga = 1 coppia evento/persona |
| `Liste` | Dizionario delle opzioni dei menu | Responsabile del file | Cambia raramente |
| `Guida` | Regole per gli utenti dei fogli | Responsabile del file | Nessun dato operativo |

Le colonne e gli esempi sono in [07 — Modello dati](07-modello-dati.md). Come si interviene manualmente è in [08 — Procedure](08-procedure-e-sincronizzazione.md).

## Calendar è la fonte ufficiale dell'agenda

Creare o riutilizzare un solo calendario dedicato alla squadra (`AEK - Squadra`). Su Calendar vivono **titolo effettivo, data, ora, luogo, descrizione e annullamento degli eventi**. La scheda `Eventi` conserva soltanto una chiave leggibile, un'etichetta operativa, il tipo e, quando possibile, il collegamento o ID di Calendar. Il foglio non gestisce un secondo orario.

Quando un collaboratore crea a mano un evento in Calendar, può riportarne il link in `Eventi` e assegnare una chiave (`E-0001`); l'app potrà semplificare questa operazione e registrare anche l'ID API. Non confondere l'URL con l'ID API Google.

## Gmail e Drive senza complessità

- **Gmail:** usare collegamenti o un `mailto:` per aprire una bozza. Nessuna copia della posta o invio automatico nell'MVP.
- **Drive:** archiviare documenti e concedere gli accessi sul file reale. La PWA può presentare collegamenti ai documenti condivisi, senza copiarne il contenuto in Sheets.

## Permessi e responsabilità

Il foglio `AEK_Dati_Squadra` non deve essere visibile a tutta la squadra se include recapiti o altri dati personali. Solo responsabili, allenatori e collaboratori **autorizzati nominalmente** avranno la modifica. Essere allenatore o collaboratore non implica automaticamente essere editor. Una persona con accesso di scrittura al foglio può anche aprirlo fuori dall'app; nascondere colonne o schermate **non garantisce riservatezza**.

Nella **v1 nessun giocatore può aggiornare dati tramite l’app o il foglio**, salvo che sia anche staff formalmente autorizzato. L’accesso in sola lettura dei giocatori non è ancora deciso; un link in sola lettura al file anagrafico non deve esporre contatti e altri dati privati.

Se in futuro i singoli giocatori dovranno aggiornare soltanto la propria disponibilità, servirà un canale separato (ad esempio un modulo controllato, oppure un piccolo servizio che validi identità e modifiche). Non si concederà a tutti la modifica del foglio anagrafico.

## Cosa NON facciamo ora

Nessuna analisi e importazione dei fogli precedenti; nessun account Workspace obbligatorio; nessuna automazione di mail, push o pagamenti. Prepariamo prima lo schema, poi lo proveremo con dati fittizi.

## Riferimenti ufficiali

- [Google Sheets API: leggere e scrivere valori](https://developers.google.com/workspace/sheets/api/guides/values)
- [Google Calendar API: modello degli eventi](https://developers.google.com/workspace/calendar/api/v3/reference/events)
- [Google Drive API: file, cartelle e proprietà](https://developers.google.com/workspace/drive/api/guides/about-files)
- [Proteggere intervalli e fogli (non è una misura di sicurezza)](https://support.google.com/docs/answer/1218656?hl=it)
