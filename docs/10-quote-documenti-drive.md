# 10 — Quote, documenti e cartelle personali su Google Drive

> **Stato: PROPOSTA IN DISCUSSIONE — 9 novembre 2026.** Questo documento raccoglie nuove esigenze emerse dopo la v0.3. Non approva automaticamente le nuove funzioni, non crea risorse Google, non introduce codice. È necessario decidere come gestire i permessi e gli obblighi privacy **prima di caricare documenti reali**.

## Obiettivo

Conservare **una cartella Drive per ogni componente/giocatore** con documenti generali, fotografia, liberatorie firmate, eventuali attestazioni relative alle quote e, se necessario e legittimo, certificati di idoneità sportiva. Dall'app il personale autorizzato potrà aprire la cartella e caricare file; le medesime operazioni continueranno a poter essere svolte manualmente in Google Drive.

Un registro minimo in Google Sheets indicizza i file e le eventuali scadenze; **i file non vengono salvati dentro le celle di Sheets**.

## Drive: cartelle consigliate

```text
AEK_Squadra/
├── 01_Dati/
│   └── AEK_Dati_Squadra [Google Sheets privato staff]
├── 02_Giocatori/
│   ├── P-0001_Mario_Rossi/ [esempio fittizio]
│   │   ├── 01_Documenti_generali/
│   │   ├── 02_Quote_e_ricevute/
│   │   ├── 03_Foto_e_liberatorie/
│   │   └── 04_Certificati_medici/ [ACCESSO LIMITATO; vedi sotto]
│   └── P-0002_Luca_Bianchi/
└── 03_Documentazione_generale_squadra/
```

Usare `persona_id` come chiave stabile e nelle cartelle; una modifica del nome non rompe i riferimenti. Un solo `drive_folder_id`/link può essere conservato nella tab `Persone` per aprire la cartella di riferimento senza ricercarla per nome. La creazione di cartelle potrà avvenire manualmente o via Drive API; va previsto il caso di cartella già esistente per evitare duplicati.

**Questa gerarchia è concettuale:** se la sottocartella `04_Certificati_medici` non può essere efficacemente isolata con la funzione Drive *Accesso limitato*, spostare i file sanitari in **uno spazio separato**, non ereditante la condivisione generale. La scheda del giocatore potrà collegare a documenti fisicamente separati. Non dare accesso alla cartella principale a chi non deve vedere i documenti che vi ereditano i permessi.

### Drive condiviso o cartella condivisa?

- Con account Google personale basta inizialmente una **cartella condivisa su Il mio Drive**, appartenente a un account responsabile definito.
- Se disponibile una versione Google Workspace idonea, un **Drive condiviso** è una possibile evoluzione: i file appartengono al team, non a un singolo utente.
- In entrambi i casi usare permessi per utenti/gruppi autorizzati, **mai “chiunque abbia il link”** per documenti privati.
- In Drive i file ereditano di norma le autorizzazioni della cartella superiore; per restringere l'accesso utilizzare **cartelle con accesso limitato** e verificarne il comportamento con account di prova.
- Gli incaricati dell'anagrafica non necessariamente devono consultare documenti sanitari: predisporre gruppi/autorizzazioni distinte.

Riferimenti Google:
- [Condivisione cartelle e accessi](https://support.google.com/drive/answer/7166529?hl=it)
- [Cartelle con accesso limitato](https://developers.google.com/workspace/drive/api/guides/limited-expansive-access?hl=it)
- [Creazione di cartelle e caricamento file via API](https://developers.google.com/workspace/drive/api/guides/folder?hl=it)
- [Drive condivisi Workspace](https://support.google.com/a/users/answer/7212025?hl=it)

## Schede aggiuntive PROPOSTE, non ancora parte dello schema approvato

Lo schema v0.3 resta a 5 schede. Si propongono **due schede opzionali** (separate dove serve per riservatezza): `Quote` e `Documenti`.

### `Quote` — solo registro manuale, nessuna elaborazione pagamenti

| Colonna | Descrizione |
|---|---|
| `quota_id` | ID stabile, es. `Q-0001` |
| `persona_id` | Collegamento a `Persone` |
| `stagione` | Es. `2026-2027` |
| `tipo` | Es. iscrizione, contributo attività |
| `importo_previsto` | Euro, valore numerico |
| `importo_versato` | Euro, valore numerico |
| `data_versamento` | Data effettiva, quando disponibile |
| `stato` | `da_pagare`, `parziale`, `pagata` |
| `ricevuta_drive_url` | Link al documento, se presente |

Questa tabella **non incassa denaro**: registra una quota e il relativo allegato. Non è contabilità né emissione automatica di ricevute fiscali; eventuali obblighi amministrativi restano fuori dalla app. Per rate/versamenti multipli sarà eventualmente necessario un modello diverso: non inventarlo ora. Permesso di modifica solo alle persone incaricate delle quote; se non coincide con tutti gli editor dell'anagrafica, usare **un file Google Sheets distinto** con autorizzazioni più ristrette.

### `Documenti` — indice dei file su Drive

| Colonna | Descrizione |
|---|---|
| `documento_id` | ID univoco |
| `persona_id` | Giocatore o componente associato |
| `categoria` | `generale`, `liberatoria`, `foto`, `ricevuta`; categoria `certificato` soltanto in un archivio di metadati riservato |
| `descrizione` | Etichetta comprensibile, senza dati sensibili |
| `drive_url` | Collegamento Drive apribile anche manualmente |
| `drive_file_id` | ID risorsa Drive, compilabile via API (facoltativo per inserimento manuale) |
| `scadenza` | Data opzionale, quando ha significato |
| `stato` | `presente`, `da_verificare`, `scaduto`, `archiviato` |

Non fare affidamento sulla sola tab per ottenere un elenco di file: un file può essere aggiunto manualmente in Drive senza che compaia automaticamente nell'indice. La procedura manuale prevede **caricare su Drive + compilare la riga indice**; l'app potrà fare entrambi i passi e riaprire i file da Drive. Valutare in futuro una riconciliazione periodica, non necessaria al primo prototipo.

### Certificati sanitari: non nel registro comune senza valutazione

Il certificato medico e i relativi metadati di idoneità possono rivelare dati sulla salute, quindi richiedono garanzie specifiche (GDPR art. 9). Prima di archiviare copie: verificare necessità, base giuridica appropriata, informativa, categorie di destinatari, durata di conservazione e procedura per eliminazione/scadenza. **Non assumere che il consenso sia sempre l'unica base sufficiente**. Evitare referti, diagnosi e documenti medici ulteriori che non servono allo scopo.

Anche un campo come `certificato_valido` o `scadenza_certificato` può essere un dato sanitario: conservarlo soltanto nel perimetro accessibile agli incaricati che ne hanno bisogno. Non metterlo nel foglio comune se tutti gli editor non sono autorizzati a conoscerlo. Verificare la conformità con il responsabile privacy dell'associazione o un professionista competente prima dell'uso reale.

Riferimenti: [Commissione europea — dati particolari](https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en); [Garante privacy — dati sanitari e conservazione](https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/9091942).

### Fotografie e liberatorie

Foto profilo e immagini riconoscibili sono dati personali. Distinguere l'uso amministrativo della foto dalla **pubblicazione** sul sito/social: sono finalità differenti e potrebbero richiedere autorizzazioni o basi giuridiche distinte. Conservare eventuali liberatorie firmate in cartelle accessibili solo agli incaricati e prevedere una procedura per revoche, cessazione dell'uso e conservazione. Per minorenni verificare i requisiti applicabili e l'autorizzazione di chi esercita la responsabilità genitoriale.

## Concessione accessi: due persone soltanto (decisione v0.4)

La decisione più recente è che **soltanto due persone specifiche** possano consultare e modificare i dati operativi, mediante due account Google autorizzati. Non è previsto alcun accesso alle cartelle da parte dei giocatori o di altri allenatori, collaboratori ed esterni. Nessuna condivisione tramite link pubblico.

**Dato sanitario:** il fatto di essere una delle due persone non conferisce automaticamente la legittimazione a trattare certificati medici. Occorre confermare separatamente chi può accedere, perché e per quanto tempo. Se solo una delle due persone è autorizzata ai certificati, l'archivio sanitario deve essere separato (o protetto con una restrizione effettiva e verificata) rispetto alle cartelle accessibili a entrambe.

Per quote e ricevute, foto e liberatorie, verificare comunque quali dati sono necessari e quali entrambe le persone devono realmente conoscere. Le scelte su contenuti e scadenze sono ancora proposte, non autorizzazioni già configurate.

## Flusso di lavoro

**Manuale:** creare cartella per `persona_id`; caricare PDF/JPG nella sottocartella adeguata; impostare/controllare permessi; incollare link nel relativo indice Sheets; aggiornare stato e scadenza se pertinenti.

**Futura app:** dalla scheda giocatore → scheda `Documenti` o `Quote` → `Carica`; scegliere file da telefono; l'app usa Drive API con permessi minimi, carica nel posto corretto, registra link e metadati e mostra stato/scadenza. **Non duplicare il binario del file in Sheets.**

## Questioni aperte

1. Chi può leggere quote, foto/liberatorie e certificati (non solo modificarli)?
2. Le quote sono annuali o di altro tipo? Ci sono pagamenti parziali?
3. Serve una sola foto profilo o anche una galleria?
4. Serve conservare il certificato completo o basta registrare in modo riservato la verifica di validità e scadenza?
5. I documenti appartengono anche a staff/allenatori o soltanto ai giocatori?
6. Utilizziamo Google Workspace con Drive condiviso oppure Gmail personali con cartella condivisa?

**Non avviare la raccolta di documenti veri prima di avere concordato autorizzazioni, finalità e conservazione.**
