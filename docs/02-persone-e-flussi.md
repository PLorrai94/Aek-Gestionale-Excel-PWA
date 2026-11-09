# 02 — Persone e flussi di lavoro

**Stato:** scenari iniziali, da confrontare con il lavoro reale della squadra. **Confermata la regola v1: solo staff esplicitamente autorizzato modifica i dati.**

## Persone coinvolte

| Ruolo operativo | Necessità principali | Modifiche nella prima versione |
| --- | --- | --- |
| Responsabile / amministratore | Mantiene l'elenco ufficiale, definisce accessi e condivisioni | Sì, tutte le informazioni organizzative consentite |
| Allenatore / collaboratore | Consulta squadra e agenda, aggiorna convocazioni e presenze | Sì, soltanto con autorizzazione nominativa all’accesso Google |
| Giocatore / componente | Potrà consultare solo le informazioni rese disponibili | **No**; anche l’eventuale accesso in lettura è da decidere |

I ruoli sono **funzionali**, non una nuova piattaforma account: l’identità prevista è Google. Una persona può avere più ruoli (per esempio dirigente e giocatore), ma **il ruolo dichiarato nel foglio `Persone` non concede permessi tecnici**: gli editor vengono autorizzati sul file Google. Nessun giocatore modifica dati nella v1 salvo sia anche un membro dello staff esplicitamente autorizzato.

## Flusso A — Inserire o aggiornare una persona

1. Il responsabile apre l'app dal telefono oppure il foglio Google.
2. Cerca la persona o aggiunge una nuova scheda con i campi minimi.
3. La modifica viene scritta nella **stessa anagrafica condivisa**.
4. Gli altri collaboratori vedono il valore aggiornato quando aprono/aggiornano la vista.

**Da evitare:** importare ed esportare un file Excel a ogni cambiamento.

## Flusso B — Organizzare un allenamento o una partita

1. Il responsabile/allenatore crea l'evento sul **Google Calendar della squadra**.
2. L'evento appare nell'agenda dell'app (nella prima fase si può anche aprire il calendario condiviso tramite link).
3. L'app non mantiene una copia distinta di data, orario e luogo.
4. In caso di variazione si aggiorna l'evento originale, non un secondo archivio.

## Flusso C — Convocazioni e presenze, senza complicazioni

1. Un allenatore sceglie l'evento.
2. Indica i convocati usando una lista di nomi.
3. Registra **disponibilità** (da confermare / disponibile / indisponibile) e, dopo l'evento, **presenza** (presente / assente / non registrata).
4. Lo stato viene memorizzato in un foglio collegato all'ID evento e all'ID della persona.

**Semplificazione:** nessun algoritmo di convocazione, statistiche automatiche o notifiche obbligatorie. Valutare se la convocazione serva davvero in ogni tipo di evento.

## Flusso D — Consultare un documento

1. Un collaboratore apre la sezione **Documenti**.
2. Trova un collegamento alla cartella o al file condiviso in Drive.
3. Visualizza/modifica direttamente con gli strumenti Google, in base ai suoi permessi.

**Semplificazione:** non sviluppare subito un archivio file alternativo dentro l'app.

## Flusso E — Comunicare con la squadra

1. Il responsabile vede i riferimenti condivisi o un gruppo di destinatari concordato.
2. Apre il programma email per scrivere la comunicazione.
3. In una fase successiva si valuteranno bozze precompilate o invii da Gmail, solo se realmente necessari.

**Nota:** l'app non deve accedere automaticamente alla casella Gmail né leggerne il contenuto nel primo MVP.

## Schermate minime proposte

- **Home:** prossimi appuntamenti e accesso rapido.
- **Squadra:** ricerca e schede persone.
- **Agenda:** eventi del calendario.
- **Partecipazione:** convocazioni e presenze (fase successiva alla semplice consultazione).
- **Documenti:** collegamenti alle cartelle/file Drive.

Niente dashboard statistiche elaborate, dieci sottomenu o pannelli di amministrazione separati.

## Test pratico di validazione

Chiedere a un allenatore e a un altro collaboratore di eseguire gli scenari sul telefono e sul foglio Google. Annotare ogni passaggio inutile: è questa osservazione che deciderà l'interfaccia.
