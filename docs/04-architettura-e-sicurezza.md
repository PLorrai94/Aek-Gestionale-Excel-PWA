# 04 — Architettura leggera e sicurezza

**Stato:** proposta tecnica; nessuna app o integrazione è stata implementata. **Regola utenti v1 confermata:** modifiche riservate a responsabili, allenatori e collaboratori con autorizzazione esplicita.

## Il modello più semplice da verificare

```text
iPhone / Android / Browser desktop
               |
       AEK Gestionale (PWA)
               |
       Accesso con account Google
               |
        API Google autorizzate
       /         |          \
  Sheets      Calendar      Drive
 anagrafica   eventi      documenti
 partecipazioni              condivisi

Gmail: apertura manuale della posta / bozza, NON lettura automatica.
```

### Componenti proposti

- **Frontend:** una piccola applicazione web responsive; stack candidato React + TypeScript + Vite (da approvare solo quando inizierà lo sviluppo).
- **Installazione:** PWA con manifest, HTTPS e impostazioni per la schermata Home. Il browser resta un canale supportato.
- **Hosting:** hosting statico semplice; provider da scegliere prima della realizzazione (ad esempio Firebase Hosting o altro hosting statico affidabile).
- **Login:** accesso Google per identificare l'utente. L'autenticazione non è automaticamente autorizzazione: serve verificare le condivisioni dei singoli file/servizi.
- **Dati:** Google Sheets (`Persone`, `Eventi`, `Partecipazioni`, `Liste`, `Guida`) e Google Calendar. Calendar resta autorevole per data/ora/luogo; Sheets conserva l'indice per le relazioni, senza database Oracle o microservizi.
- **Scrittura:** per il primo MVP solo **responsabili, allenatori e collaboratori esplicitamente autorizzati** con reali permessi Google di modifica. L'app, dove previsto, opera usando OAuth Google con i permessi minimi necessari.
- **Gmail:** un semplice collegamento o `mailto:` non richiede accesso Gmail API.

## Modifica manuale e dall'app: uno schema solo

La PWA deve leggere gli ID dai valori delle celle e trovare le righe per chiave, **non memorizzare numeri di riga**. Se il foglio viene riordinato o filtrato, il comportamento deve restare corretto. Dopo il salvataggio l'app rilegge il dato; quando un collaboratore modifica il foglio direttamente, la PWA offre un aggiornamento esplicito. Le API Sheets non danno automaticamente transazioni e vincoli tipici di un database: evitare promesse di modifica contemporanea senza conflitti. Dettagli in [07 — Modello dati](07-modello-dati.md) e [08 — Procedure](08-procedure-e-sincronizzazione.md).

## Perché non sviluppare un backend subito?

Se le persone che devono modificare il foglio sono un piccolo gruppo di collaboratori fidati, possono operare con gli strumenti e i permessi Google. L'interfaccia può usare le API direttamente dopo autorizzazione, senza introdurre un server da gestire.

**Cosa questa scelta NON risolve:** il requisito "ogni giocatore modifica solo i propri dati". Un editor del foglio ha anche accesso diretto al documento; nascondere i campi nell'app non equivale a proteggerli. Se in futuro serviranno azioni limitate per persona, prevedere un piccolo backend che controlli identità, regole e scritture prima di accedere ai fogli. Niente backend finché non esiste questo bisogno reale.

## Accessi e permessi minimi

| Soggetto | Anagrafica | Calendar | Drive documenti |
| --- | --- | --- | --- |
| Responsabile autorizzato | Modifica | Gestisce eventi se abilitato | Gestisce condivisioni se proprietario/gestore |
| Allenatore autorizzato | Modifica | Gestisce eventi se abilitato | Accesso ai file assegnati |
| Collaboratore autorizzato | Modifica | Gestisce eventi se abilitato | Accesso ai file assegnati |
| Allenatore/collaboratore **non autorizzato** | Nessuna modifica | Solo accessi concessi separatamente | Solo accessi concessi separatamente |
| Giocatore non autorizzato | **Nessuna modifica**; lettura ancora da definire | Solo eventi resi condivisibili | Solo documenti specificamente condivisi |
| Persona esterna | Nessun accesso ai dati privati | Solo eventuali eventi resi pubblici | Nessun accesso ai file privati |

**È una matrice di autorizzazione prevista**, non una configurazione già applicata. I permessi effettivi si impostano nella condivisione di Sheets, Drive e Calendar, ciascuno secondo il proprio modello. Gli editor di uno stesso file Google Sheets possono in generale aprire anche le altre schede del file: eventuali dati riservati a un sottoinsieme dello staff dovranno stare in un **file separato**, non in colonne nascoste.

**Regola del primo rilascio:** la schermata di modifica è visibile solo ai collaboratori abilitati, ma la sicurezza reale dipende dai permessi Google. Non basta un campo `ruolo` modificabile nel foglio, né un controllo della sola interfaccia.

## Sicurezza e gestione pratica

1. Condividere i file **per account specifico**, non con il link pubblico "chiunque".
2. Limitare le richieste OAuth alle funzioni effettive (non chiedere tutti i permessi Drive e Gmail).
3. Nessun segreto, token, credenziale, file `.env` o dati personali dentro un repository pubblico.
4. Versionare la struttura dei fogli, non i dati reali dei componenti sul repository.
5. Prima del lancio provare con un account autorizzato e uno senza permessi.
6. Mantenere un responsabile della proprietà dei file, della condivisione e del recupero dati.
7. Utilizzare cronologia versioni e definire una semplice copia di sicurezza periodica.
8. Evitare l'inserimento di certificati medici e altri dati di salute: non sono necessari al perimetro iniziale.

## Accesso offline

**Non è un requisito iniziale.** Installare una PWA non significa poter aggiornare i fogli Sheets o Calendar senza rete. La consultazione di dati Google aggiornati richiede connessione; l'editing offline e la risoluzione dei conflitti aggiungerebbero complessità. Se serve, se ne parlerà dopo l'uso reale.

## Decisioni tecniche da confermare prima del codice

- Gli account sono Google personali (`@gmail.com`) o di una stessa organizzazione Workspace?
- Quali persone devono **modificare dal telefono**, non solo dal foglio?
- È accettabile che gli editor autorizzati possano modificare l’intero foglio (limite pratico di Google Sheets)?
- Le informazioni personali devono essere visibili a tutta la squadra o solo allo staff?
- È necessario creare automaticamente appuntamenti e inviare mail, oppure bastano collegamenti nella prima versione?

## Fonti

- [MDN: installazione PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable).
- [Google: autenticazione e autorizzazione web](https://developers.google.com/identity/oauth2/web/guides/overview).
- [Google: ambiti OAuth delle API](https://developers.google.com/identity/protocols/oauth2/scopes).
