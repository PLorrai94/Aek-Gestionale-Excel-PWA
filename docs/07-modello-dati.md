# 07 — Modello dati AEK: schema v0.2

> **Documento di riferimento.** Lo scopo è definire dati e regole che funzionino **sia con inserimento manuale in Google Sheets, sia tramite la futura app**. Lo schema è una proposta, non è stato ancora creato un foglio reale.

## Criteri di progettazione

1. Un file Google Sheets nativo (`AEK_Dati_Squadra`), poche schede; nessun database aggiuntivo nella prima versione.
2. Ogni scheda contiene una **tabella semplice**: prima riga con nomi fissi, una riga per record, nessuna cella unita o tabella incrociata.
3. **Chiave primaria testuale**, non il numero di riga. Il nome può cambiare, l'ID no.
4. Menu a tendina per gli stati; testo semplice per le note non sensibili.
5. Nessuna formula necessaria per leggere/scrivere i dati dall'app. Eventuali fogli riepilogativi saranno separati dalle tabelle dati.
6. Non cancellare persone che hanno presenze storiche: cambiare `stato` in `inattivo`.
7. Non conservare password, informazioni sanitarie, numeri di documento o dati finanziari.

## Scheda `Persone`

| Colonna | Tipo | Obbligatoria | Esempio | Descrizione |
|---|---|:---:|---|---|
| `persona_id` | testo ID | sì | `P-0001` | Univoco, permanente; non cambiare mai |
| `nome` | testo | sì | `Marco` | Nome |
| `cognome` | testo | sì | `Rossi` | Cognome |
| `ruolo` | lista | sì | `giocatore` | Ruolo principale |
| `numero_maglia` | numero intero | no | `7` | Se pertinente, non è una chiave |
| `email` | testo | no | `marco@example.invalid` | Dato personale, visibile allo staff autorizzato |
| `telefono` | testo | no | `+39 000 000 0000` | Come testo, per conservare `+` e zeri |
| `stato` | lista | sì | `attivo` | Non eliminare persone per una semplice uscita |
| `note` | testo | no | `Preferisce comunicazioni via email` | Solo note organizzative non sensibili |

Valori `ruolo`: `giocatore`, `allenatore`, `dirigente`, `collaboratore`.
Valori `stato`: `attivo`, `inattivo`.

**Semplicità intenzionale:** una persona ha un solo *ruolo principale*. Se la squadra utilizza davvero più ruoli contemporanei, il requisito andrà documentato prima di aggiungere nuove tabelle.

## Scheda `Eventi` (indice, non calendario alternativo)

| Colonna | Tipo | Obbligatoria | Esempio | Descrizione |
|---|---|:---:|---|---|
| `evento_id` | testo ID | sì | `E-0001` | Chiave AEK stabile per convocazioni/presenze |
| `etichetta` | testo | sì | `Allenamento del martedì` | Nome breve per riconoscere il collegamento |
| `tipo` | lista | sì | `allenamento` | Categoria usata nell'app |
| `calendar_event_id` | testo | no | `a1b2c3...` | ID restituito dalle API Google, compilato dall'app quando disponibile |
| `calendar_url` | URL | no | `https://calendar.google.com/...` | Collegamento apribile manualmente |

Valori `tipo`: `allenamento`, `partita`, `riunione`, `altro`.

**Regola decisiva:** titolo effettivo, data, ora, luogo e stato dell'appuntamento sono su **Google Calendar**. Non duplicarli in questo foglio. `etichetta` è un promemoria operativo che può non coincidere con il titolo attuale di Calendar; l'app mostra i dati reali di Calendar quando disponibili.

**Procedura manuale:** prima creare l'appuntamento in Calendar; poi aggiungere una riga con `evento_id` (nuovo, univoco) e `calendar_url`. La colonna `calendar_event_id` può rimanere vuota finché l'app non ha collegato correttamente l'evento. Non tentare di estrarre l'ID API manualmente dal link.

## Scheda `Partecipazioni`

| Colonna | Tipo | Obbligatoria | Esempio | Descrizione |
|---|---|:---:|---|---|
| `evento_id` | riferimento | sì | `E-0001` | Deve esistere in `Eventi.evento_id` |
| `persona_id` | riferimento | sì | `P-0001` | Deve esistere in `Persone.persona_id` |
| `convocazione` | lista | sì | `convocato` | Stato della convocazione |
| `disponibilita` | lista | sì | `da_confermare` | Disponibilità dichiarata/conosciuta |
| `presenza` | lista | sì | `non_registrata` | Esito dopo l'evento |
| `note` | testo | no | `Avvisato telefonicamente` | Solo note organizzative non sensibili |

Valori `convocazione`: `da_definire`, `convocato`, `non_convocato`.
Valori `disponibilita`: `da_confermare`, `disponibile`, `indisponibile`.
Valori `presenza`: `non_registrata`, `presente`, `assente`.

La **coppia (`evento_id`, `persona_id`) è unica**: non devono esistere due righe della stessa persona per lo stesso evento. L'app dovrà cercare la coppia esistente prima di aggiungerla, senza presumere che Sheets impedisca da solo i doppioni.

**Regola d'uso:** la convocazione è una scelta dello staff; la disponibilità è una risposta/indicazione; la presenza registra ciò che è successo. Non sono sinonimi. Evitare di trasformare automaticamente `indisponibile` in `assente` prima della data dell'evento.

## Schede `Liste` e `Guida`

**`Liste`** è un dizionario per i menu a tendina. È modificabile solo dal responsabile del modello. Organizzazione suggerita: colonne indipendenti per `ruolo`, `stato_persona`, `tipo_evento`, `convocazione`, `disponibilita`, `presenza` (liste verticali; celle vuote alla fine consentite). Le opzioni sono quelle elencate sopra.

**`Guida`** è una pagina per chi opera manualmente, con regole pratiche: non rinominare colonne, non riutilizzare ID, non inserire righe sopra l'intestazione, non cambiare i valori dei menu senza accordo, non creare copie locali dei dati attivi, non inserire note sensibili.

## Relazioni logiche

```text
Persone (persona_id) 1 ─── N Partecipazioni N ─── 1 Eventi (evento_id)
                                                    │
                                                    └─ link / ID ── Google Calendar
```

Le relazioni sono **regole logiche/documentate**, non vincoli garantiti da Google Sheets. Nel foglio è possibile usare convalide, ma l'app deve comunque verificare che le chiavi esistano e che non ci siano duplicati.

## Convenzione ID e collaborazione

- ID leggibili e facili da compilare a mano: `P-0001`, `P-0002` e `E-0001`, `E-0002`.
- Il responsabile assegna il prossimo ID libero controllando **tutte le righe**, comprese quelle inattive. Non riciclare gli ID.
- L'app non deve basarsi sulla posizione della riga: trova il record tramite ID prima di aggiornare.
- Per scritture simultanee, **un semplice controllo prima della scrittura non garantisce unicità assoluta**. Nella prima fase si concorda che un solo collaboratore alla volta inserisca nuovi record di quello stesso tipo, oppure si rivede la strategia ID con un servizio di assegnazione affidabile. Non promettere transazioni o blocchi automatici inesistenti in Sheets.
- Se l'app implementerà la creazione di ID senza coordinamento manuale, dovrà adottare una strategia robusta e documentata (ad esempio ID casuali sufficientemente lunghi e controlli di unicità), non un contatore basato sulla riga.

## Modifiche manuali sicure

- Intestazioni immutabili, prima riga bloccata, filtri attivi (meglio *viste filtro* per non disturbare gli altri).
- Convalida dati per i campi enumerati; la colonna `telefono` va trattata come **testo**.
- Non eliminare righe con riferimenti attivi; non incollare blocchi che spostano soltanto alcune colonne.
- Le date degli appuntamenti restano in Calendar: si evita un secondo formato data in Sheets.
- Un valore errato si corregge direttamente nella stessa riga, poi si controllano i riferimenti.

## Dati personali e accesso

Lo schema è destinato a un **foglio privato dello staff**. I contatti non devono essere condivisi con tutti i giocatori solo perché la PWA li mostra ad alcuni utenti. Se servono viste pubbliche/di giocatore, andranno implementate senza esporre il foglio intero; celle protette o schede nascoste **non equivalgono a un controllo di sicurezza**.
