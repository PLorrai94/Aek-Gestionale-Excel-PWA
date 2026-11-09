# 08 — Procedure manuali e comportamento atteso dell'app

> **Scopo:** la stessa operazione deve poter essere completata in Google Sheets oppure nella futura PWA senza produrre due archivi o perdere collegamenti.

## 1. Aggiungere una persona

**In Google Sheets:** aprire `Persone`; controllare che non ci sia già; aggiungere una riga in fondo; assegnare un `persona_id` non usato (ad esempio `P-0004`); compilare nome, cognome, ruolo e stato; aggiungere eventuali recapiti solo se necessari; salvare (Sheets salva automaticamente).

**Dall'app (futura):** aprire `Squadra` → `Nuovo componente`; compilare gli stessi campi; l'app verifica i dati e la mancanza di duplicati, assegna/ottiene un ID stabile secondo la strategia approvata, scrive su Sheets e rilegge il record salvato.

## 2. Modificare un componente

**In Sheets:** cercare `persona_id`; modificare la stessa riga, senza alterare l'ID.

**Nell'app:** caricare i dati aggiornati, modificare solo i campi desiderati e salvare. Prima di salvare l'app deve ricontrollare che il record esista e ridurre il rischio di sovrascrivere modifiche recenti; se trova una differenza, chiedere all'utente di ricaricare o risolvere.

## 3. Uscita dalla squadra

**Entrambi i canali:** impostare `stato = inattivo`. Non cancellare il record; le partecipazioni storiche continuano a fare riferimento allo stesso ID.

## 4. Creare un evento

**Manuale:** creare prima partita/allenamento su `AEK - Squadra` in Google Calendar; poi aggiungere una riga nella tab `Eventi` con `evento_id` nuovo, `etichetta`, `tipo` e `calendar_url`. `calendar_event_id` può restare vuoto. Evitare di replicare data/ora sul foglio.

**Nell'app:** proporre una vista calendario ed eventualmente l'azione `Crea evento`; se vengono autorizzate le API necessarie, creare l'evento in Calendar e registrare in `Eventi` il riferimento restituito. In una prima versione può limitarsi ad aprire Calendar e guidare l'inserimento manuale.

**Modifica data/ora:** farla esclusivamente su Google Calendar; il foglio `Eventi` non è la fonte di questi dati.

## 5. Registrare convocazione o presenza

**Manuale:** cercare `evento_id` nella scheda `Eventi` e `persona_id` in `Persone`; cercare se la coppia è già in `Partecipazioni`; se sì, modificare quella riga; altrimenti aggiungerla con gli stati predefiniti. Usare il menu a tendina, non descrizioni improvvisate.

**Nell'app:** aprire un evento → selezionare un componente → impostare convocazione/disponibilità/presenza. L'app usa gli ID per trovare e aggiornare **la stessa riga logica**; non crea una nuova partecipazione se la coppia esiste già.

## 6. Condivisione documenti e comunicazioni

Documenti: salvare in Drive, regolare i permessi nel file Google e aprirli dalla PWA mediante link. Gmail: aprire la posta o una bozza con `mailto:` senza duplicare i messaggi nel database/foglio.

## 7. Risoluzione problemi semplici

| Problema | Come intervenire |
|---|---|
| Una persona appare due volte | Confrontare `persona_id` e dati; accertare quale record è quello giusto; aggiornare i riferimenti prima di disattivare/correggere il duplicato |
| Un ID cambia dopo un riordino | Errore di implementazione: l'app deve cercare il record tramite ID, mai tramite numero della riga memorizzato |
| Una presenza punta a un ID inesistente | Correggere il riferimento oppure ripristinare la persona/evento; non cancellare indiscriminatamente la riga |
| Due persone modificano quasi contemporaneamente | Ricaricare i dati, controllare la cronologia versioni e ripetere la modifica necessaria; la soluzione robusta a conflitti simultanei non è inclusa nella prima fase |
| Un evento è cancellato su Calendar | Il riferimento nel foglio va esaminato; non cancellare automaticamente presenze storiche senza decisione esplicita |
| L'app non vede le modifiche manuali | Ricaricare e verificare autenticazione, condivisioni, scheda/colonne e collegamento corretto; l'app deve prevedere aggiornamento esplicito |

## 8. Criteri di accettazione prima del software

Con **soli dati fittizi**, un collaboratore deve poter:

- aggiungere una persona via Sheets senza sapere programmare;
- modificare il suo ruolo e ritrovarla sempre con lo stesso `persona_id`;
- creare un evento Calendar e collegarlo al foglio `Eventi`;
- aggiungere una partecipazione senza doppioni;
- segnare un giocatore inattivo conservando lo storico;
- capire dove correggere un valore sbagliato usando la scheda `Guida`.

Solo dopo questi test ha senso costruire la PWA sulle stesse operazioni.

## 9. Confini della prima versione

- **Solo responsabili, allenatori e collaboratori autorizzati nominativamente** scrivono il foglio, manualmente e tramite app. Non dare a tutti i giocatori accesso di scrittura per consentire aggiornamenti personali.
- Nessuna garanzia di modifica offline, salvataggio multiutente transazionale o sincronizzazione in tempo reale.
- Aggiornamenti dell'app: dopo operazioni di scrittura la PWA rilegge il dato; per cambiamenti fatti fuori dall'app offre il pulsante **Aggiorna**. Eventuale refresh automatico sarà aggiunto solo se davvero necessario.
- Backup periodico, cronologia versioni di Sheets e account Google proprietario della cartella devono essere gestiti da un responsabile.
