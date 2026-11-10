# 16 — File condivisi, accessi privati e requisito COSTO ZERO

**Decisioni:** D-11 (già confermata) = solo **due persone** possono leggere e scrivere i dati. **D-13 (confermata 2026-11-10):** nessuna prova gratuita a tempo, nessun abbonamento, nessun account di fatturazione collegato, nessuna carta di credito necessaria e nessun servizio pay-as-you-go. In caso di superamento delle quote gratuite, preferiamo riduzione delle funzionalità, errore controllato o attesa; **mai addebiti**. La gratuità eterna non può essere garantita contrattualmente: verificare condizioni dei fornitori prima di ogni attivazione.

## Come circolano i dati

- **Google Drive**: conserva file PDF, foto, liberatorie e ricevute, organizzati per persona. Usa una cartella radice privata e una sottocartella per ciascun `persona_id`. Non caricare certificati medici nell'archivio generale finché non siano risolti privacy, base giuridica e accessi.
- **Google Sheets**: conserva tabelle leggibili e modificabili sia da browser Sheets sia dalla PWA. In v0.1, le schede esatte sono `Persone`, `Quote` e `Documenti`. Le schede teoriche del modello 07 non sono tutte già supportate dalla PWA. Non duplicare file Excel attivi.
- **Google Calendar**: un calendario squadra privato, condiviso con i due account; la PWA legge gli eventi, che si aggiornano manualmente su Calendar.
- **Gmail**: soltanto apertura manuale di posta/bozze; nessuna lettura automatica né accesso Gmail API nella v0.1.
- **PWA**: visualizza dati provenienti dalle API Google utilizzando le autorizzazioni temporanee dell'utente; la schermata demo contiene soltanto dati inventati. Il codice pubblico non deve contenere alcun dato della squadra.

## Cosa significa "condiviso" in pratica

Il proprietario del file Google apre *Condividi*, seleziona **Accesso generale: Con limitazioni** e concede l'accesso solo ai **due account nominativi**, per esempio proprietario e un collaboratore editor. Anche il calendario dedicato e la cartella Drive devono essere condivisi con la stessa disciplina. La condivisione di un foglio non concede automaticamente accesso al calendario, e viceversa. Non usare `Chiunque abbia il link` per i dati della squadra.

**Una cartella condivisa su "Il mio Drive" non è un "Drive condiviso" Google Workspace.** Il primo è disponibile negli account Google personali gratuiti; il secondo è una funzionalità d'organizzazione che non dobbiamo acquistare per questo progetto. I documenti ereditano di norma gli accessi della cartella; per contenuti sensibili creare una struttura separata con autorizzazioni ancora più ristrette.

Il proprietario delle risorse deve essere chiaramente definito: controlla lo spazio disponibile sul suo account, evita condivisioni accidentalmente pubbliche ed esporta periodicamente copie di backup in modo appropriato e protetto.

## Costo dei componenti e limiti reali

| Componente | Formula proposta | Condizione per restare a €0 |
|---|---|---|
| Account Google personali / Drive | Google gratuito, **fino a 15 GB per account** condivisi fra Gmail, Drive, Foto | Monitorare capienza; non aderire a Google One o Google Workspace |
| Google Sheets / Calendar | Servizi Google personali gratuiti | Entro limiti del servizio |
| GitHub repository + GitHub Pages | GitHub Free, repository **pubblico** | Non abilitare servizi a pagamento; il sito Pages resta pubblico |
| PWA browser/iPhone/Android | Installazione dal browser | Niente App Store/Play Store a pagamento, dominio personalizzato o developer membership |
| Google Cloud OAuth e API | Progetto con API Workspace necessarie | **NON collegare un account di fatturazione**; se una funzionalità richiede billing, interrompere e riprogettare |
| Cloudflare Zero Trust Access | Piano Free pubblicizzato come `$0 forever` e fino a 50 utenti | **NON selezionato**: la procedura di attivazione richiede comunque dati di pagamento; non soddisfa il criterio "niente carta/nessun rischio" |

**ATTENZIONE (novembre 2026):** Google indica che il normale utilizzo delle API Sheets, Drive e Calendar non ha costi extra, ma il superamento di alcune quote potrà comportare addebiti per i progetti con account di fatturazione associato. Da qui la regola vincolante di non associare billing al progetto. Non presumere che tutte le funzioni future siano utilizzabili senza fatturazione.

Le API hanno quote/rate limit; a due persone, con accesso umano occasionale, il fabbisogno previsto è contenuto, ma il codice deve gestire `429 Too Many Requests` senza cicli di tentativi incontrollati.

## Distinzione decisiva: proteggere dati e proteggere il sito

### Opzione A — GitHub Pages + login Google (costo zero e niente carta)

La PWA attuale è un'app statica. **Il sito e il suo codice sono pubblicamente apribili**, anche da chi non fa parte della squadra. L'interfaccia in modalità demo mostra dati fittizi. Le API Google, se i file sono privati, impediscono a un terzo utente di leggere o modificare i dati della squadra. Possiamo aggiungere una schermata iniziale di accesso e un controllo email in interfaccia, ma **questo controllo client-side non è una protezione del sito**: è la condivisione server-side Google a proteggere i dati.

Questa configurazione **soddisfa la riservatezza dei dati per due persone**, ma **non** il requisito letterale "nessun altro può visitare la pagina web". È quindi un'opzione solo se l'utente accetta la differenza.

### Opzione B — Sito stesso privato

Per negare l'accesso alla pagina prima di inviare HTML/JS serve un **controllo lato hosting/rete/server**, non una semplice lista email nel JavaScript. Cloudflare Access potrebbe farlo e pubblicizza un piano gratuito, ma l'onboarding Zero Trust richiede dati di pagamento: **non è la scelta predefinita** per questa squadra. Non attivare prodotti o servizi che richiedono di inserire una carta per provare una funzione anche se pubblicizzata come gratuita. Un'alternativa veramente privata andrà selezionata solo dopo averne verificato disponibilità gratuita duratura, assenza di carta e compatibilità PWA.

**Non dichiarare che l'app è accessibile solo a due persone finché un sistema di controllo dell'accesso prima del caricamento della pagina non è stato configurato e testato.**

## Google OAuth: "Testing" non è una prova gratuita, ma c'è una scadenza tecnica

La modalità di pubblicazione OAuth Google `Testing` non costa per definizione, ma l'autorizzazione concessa dall'utente ha una scadenza di **7 giorni**; i refresh token di applicazioni esterne di test sono limitati in modo analogo. Non significa che il servizio venga disabilitato dopo 7 giorni o passi automaticamente a pagamento, ma richiede periodicamente un nuovo consenso e può essere scomodo per l'uso continuativo.

Per un'app personale usata da due persone conosciute, le policy Google descrivono **eccezioni alla verifica OAuth** e possibilità di procedere con app non verificata entro limiti di utenti, anche in stato Published/In Production. Prima dell'utilizzo stabile, verificare la configurazione OAuth, i permessi necessari e gli eventuali avvisi; non introdurre domini a pagamento o verifiche onerose per un'app usata da due persone.

**Riduzione dei permessi (lavoro da fare):** nella v0.1 il codice richiede lo scope ampio `https://www.googleapis.com/auth/drive` (classificato *restricted*) per cartelle e upload. Prima di adottarlo con dati reali valutare il più limitato `drive.file`, preferibilmente con Google Picker o con file creati/selezionati dall'app. Richiede modifiche e verifiche al flusso Drive; non sostituire la stringa di scope senza provare il funzionamento. Anche `spreadsheets` è classificato scope *sensitive*.

## Check-list blocca-spese prima di mettere in servizio

- [ ] Account Google personali esistenti, **senza Google One / Workspace acquistati per l'app**.
- [ ] Progetto Google Cloud **senza Cloud Billing collegato**. Se il prodotto richiesto chiede billing, non procedere.
- [ ] Nessuna carta fornita a Cloudflare, trial, dominio o provider hosting.
- [ ] GitHub Free e, se scelta, GitHub Pages; sapere che **la pagina è pubblica**.
- [ ] Foglio, calendario e cartelle private condivisi solo ai due account.
- [ ] Prova con **terzo account** non autorizzato: dati non accessibili, upload e modifiche negati.
- [ ] Privilegi OAuth ridotti al minimo e comportamento dei 7 giorni di Testing compreso.
- [ ] Monitoraggio dei 15 GB, cronologia versioni e backup periodico protetto.
- [ ] Nessun file medico o personale inserito nel repository pubblico.
- [ ] Per superamento quote si blocca l'operazione e si interviene manualmente, **mai abilitazione automatica a piani a pagamento**.

## Fonti ufficiali verificate nel novembre 2026

- [Google Drive: spazio gratis e limite](https://support.google.com/drive/answer/9312312)
- [Google Sheets API: quote e pricing](https://developers.google.com/workspace/sheets/api/limits)
- [Google Drive API: quote e pricing](https://developers.google.com/workspace/drive/api/guides/limits)
- [Google Calendar API: quote e pricing](https://developers.google.com/workspace/calendar/api/guides/quota)
- [Google Cloud project: billing opzionale secondo le API utilizzate](https://developers.google.com/workspace/guides/create-project)
- [Google OAuth: Publishing status e scadenza Testing](https://support.google.com/cloud/answer/15549945)
- [Google OAuth: eccezioni per app a uso personale](https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification)
- [Google Drive OAuth: differenza fra drive e drive.file](https://developers.google.com/workspace/drive/api/guides/api-specific-auth)
- [GitHub Pages Free e visibilità pubblica](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Cloudflare Zero Trust: piano Free](https://www.cloudflare.com/plans/zero-trust-services/)
- [Cloudflare Zero Trust: setup e dati di pagamento anche nel piano Free](https://developers.cloudflare.com/cloudflare-one/setup/)
