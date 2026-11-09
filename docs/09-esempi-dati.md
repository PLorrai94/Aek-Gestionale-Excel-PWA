# 09 — Esempi fittizi per provare il modello

> **Tutti i dati sono inventati.** Gli esempi servono a testare le operazioni manuali; non vanno confusi con i dati della squadra reale.

## Persone

| persona_id | nome | cognome | ruolo | numero_maglia | email | telefono | stato | note |
|---|---|---|---|---|---|---|---|---|
| P-0001 | Marco | Rossi | giocatore | 7 | marco@example.invalid | | attivo | |
| P-0002 | Luca | Bianchi | allenatore | | luca@example.invalid | | attivo | |
| P-0003 | Andrea | Verdi | giocatore | 11 | | | inattivo | |

## Eventi

| evento_id | etichetta | tipo | calendar_event_id | calendar_url |
|---|---|---|---|---|
| E-0001 | Allenamento prova | allenamento | | |
| E-0002 | Partita prova | partita | | |

Le colonne Calendar sono lasciate vuote perché **non sono stati creati eventi reali**. Quando si crea un evento su Google Calendar, l'editor inserisce il link; l'app potrà aggiungere l'ID API verificato.

## Partecipazioni

| evento_id | persona_id | convocazione | disponibilita | presenza | note |
|---|---|---|---|---|---|
| E-0001 | P-0001 | convocato | disponibile | non_registrata | |
| E-0001 | P-0002 | da_definire | da_confermare | non_registrata | |
| E-0002 | P-0001 | convocato | indisponibile | non_registrata | |

## Test manuali

1. Aggiornare `P-0001` cambiando il numero di maglia da 7 a 9: il suo ID non cambia.
2. Passare `P-0003` da `inattivo` ad `attivo`: le vecchie presenze restano collegate.
3. Modificare la disponibilità per la coppia `E-0002` / `P-0001`: correggere la **riga esistente**, non duplicarla.
4. Ordinare i giocatori per cognome: nessun riferimento deve usare la posizione della riga.
5. Quando esisterà il calendario di prova, collegare l'evento `E-0001` tramite `calendar_url` e verificare che data/ora rimangano soltanto in Calendar.
