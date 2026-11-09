# 01 — Visione e perimetro

**Stato:** bozza da confermare con lo staff.

## Il problema da risolvere

La squadra usa già strumenti Google e probabilmente messaggi e fogli condivisi. Le informazioni utili sono disperse fra più schermate e l'uso da cellulare può essere scomodo. Il precedente gestionale è diventato più complesso del lavoro che doveva semplificare.

**Risultato cercato:** una sola porta d'accesso, semplice da cellulare, da cui vedere le persone, gli impegni e le informazioni organizzative aggiornate, con possibilità per **più collaboratori autorizzati** di intervenire.

## Principi non negoziabili

1. **Google prima dell'app:** usare i servizi già familiari (Drive, Calendar e Gmail) e definire **nuovi fogli Sheets con struttura stabile**, senza dipendere dai vecchi Excel.
2. **Niente trasferimenti obbligati:** chi usa il foglio direttamente può continuare a farlo.
3. **Poche schermate:** informazioni più comuni raggiungibili in pochi tocchi.
4. **Niente dati duplicati:** una modifica è conservata nella fonte Google definita.
5. **Permessi semplici ma reali:** non affidarsi solo a pulsanti nascosti nell'interfaccia.
6. **Una squadra per iniziare:** il supporto multi-squadra non è un requisito MVP.
7. **Nessun obbligo di installazione:** usare il sito dal browser deve bastare.

## Funzioni MVP candidate (ordine di utilità)

| Area | Azione concreta | Origine dei dati |
| --- | --- | --- |
| Squadra | Elenco giocatori, allenatori e staff; ricerca e scheda essenziale | Google Sheets |
| Organizzazione | Persone attive/inattive, ruoli, numero maglia, contatti autorizzati | Google Sheets |
| Agenda | Vedere allenamenti, partite e riunioni; aprire l'evento originale | Google Calendar |
| Partecipazione | Segnare disponibilità/presenza e convocazioni in modo semplice | Google Sheets + ID evento Calendar |
| Materiale | Aprire file e documenti organizzativi condivisi | Google Drive |
| Comunicazioni | Aprire Gmail o preparare una mail manuale | Gmail / app email |

L'MVP non deve necessariamente includere tutto al primo rilascio: **prima elenco squadra e calendario; poi partecipazione e modifiche dall'app.**

## Esplicitamente fuori perimetro

Pagamenti, quote, tesoreria, fatture, rimborsi, fatture fiscali, PayPal/Stripe; inventario complesso; statistiche sportive avanzate, classifiche, intelligenza artificiale, notifiche push automatiche, gestione multi-società; gestione sanitaria, certificati medici e documenti d'identità; portali pubblici per famiglie, automazioni e workflow burocratici; server dedicati e architettura a microservizi.

I dati personali davvero necessari saranno definiti prima della raccolta: non usare il foglio per memorizzare informazioni superflue.

## Come misuriamo la semplicità

- Una persona autorizzata trova il numero di un compagno senza cercare in più file.
- Un collaboratore modifica un dato e gli altri vedono il dato aggiornato senza ricopiare informazioni.
- La data di una partita si modifica **una sola volta** in Calendar.
- L'app funziona bene su uno schermo piccolo; non serve un manuale per le attività ordinarie.
- I fogli e i calendari restano accessibili anche se l'app è temporaneamente indisponibile.

## Questioni ancora aperte

Quali operazioni fate davvero ogni settimana? Chi può modificare i dati? I singoli giocatori devono vedere i contatti di tutti o solo le informazioni generali? Quali operazioni devono essere possibili sia da Sheets sia dall'app? Queste risposte determinano il primo rilascio.
