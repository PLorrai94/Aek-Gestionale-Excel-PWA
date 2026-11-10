# 17 — Prova personale AEK Gestionale v0.2: gratis e senza Google

**Stato:** sorgenti pronti sul branch `dev`, con modalità di prova locale persistente. **Non dichiarare il sito pubblicato** finché non appare come attivo nelle impostazioni GitHub Pages e l'indirizzo non è stato aperto dal browser. Il branch `main` rimane invariato.

## Obiettivo di questo passaggio

Permettere al creatore del gestionale di provare davvero la navigazione e le operazioni più importanti **prima** di configurare Google Cloud, i permessi dei due account e i documenti privati.

La versione di prova è **pubblica nella parte grafica**, ma contiene solo nomi inventati. Non richiede login, carta di credito, prova temporanea, abbonamenti o servizi a pagamento.

## A. Pubblicazione gratuita: unica operazione nelle impostazioni GitHub

La repository `PLorrai94/Aek-Gestionale-Excel-PWA` contiene già `index.html` e il file `.nojekyll`. Per renderla apribile da un telefono, il **proprietario** del repository deve attivare GitHub Pages:

1. Apri [Settings → Pages](https://github.com/PLorrai94/Aek-Gestionale-Excel-PWA/settings/pages) del repository.
2. Alla sezione **Build and deployment**, seleziona **Source: Deploy from a branch**.
3. Nel selettore Branch scegli **`dev`**; nel selettore Cartella scegli **`/(root)`**.
4. Premi **Save**.
5. Quando GitHub mostra **Visit site**, apri quell'indirizzo: per questo repository la forma attesa è `https://plorrai94.github.io/Aek-Gestionale-Excel-PWA/`. **Non è verificato come attivo finché GitHub non completa la pubblicazione.**

Questa pubblicazione **non modifica main**. GitHub Pages è disponibile nei repository pubblici con GitHub Free e non richiede una carta di credito. La pagina HTML, la grafica e i dati fittizi sono pubblici: **non** inserire dati veri finché non sono state verificate tutte le autorizzazioni e le misure privacy.

Se Pages segnala un problema: controlla che il branch sia `dev`, cartella `/(root)`, che la repository rimanga pubblica e che GitHub Actions/Pages siano abilitati come previsto dalle impostazioni GitHub.

Per informazioni aggiornate: [Configurazione della sorgente GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## B. Cosa si può provare subito

La prima schermata mostra tre persone **fittizie**. Sono disponibili:

- **Squadra:** apri la pagina, cerca, seleziona un giocatore, modifica nome/ruolo/maglia, aggiungi un componente, rendi inattivo.
- **Quote:** registra una quota fittizia, importo previsto, importo versato parziale/completo, stagione e osserva lo stato calcolato. Nessun incasso reale.
- **Documenti:** crea una voce fittizia, scegli categoria e scadenza. Non caricare file medici o personali reali.
- **Agenda:** eventi dimostrativi statici; nella prova locale non puoi creare eventi in Google Calendar.
- **Panoramica:** verifica che i totali si aggiornino dopo le modifiche.

**Novità v0.2:** i record inseriti o modificati durante la prova vengono salvati nel **browser locale del dispositivo**, tramite `localStorage`. Se ricarichi, restano visibili. Se apri la stessa pagina su un altro telefono o browser, vedrai un archivio di prova **diverso**: non c'è sincronizzazione tra dispositivi. Non è un archivio sicuro di dati personali, né un backup; cancella i dati di navigazione e perderai le prove.

È disponibile il pulsante **Ripristina dati prova**, che chiede conferma e riporta la demo allo stato iniziale.

## C. Percorso test consigliato (10 operazioni)

1. Apri l'app da browser del telefono.
2. Vai in **Squadra**, apri Marco Rossi e modifica la maglia da 7 a 9.
3. Torna alla squadra e controlla che il nuovo numero sia visibile.
4. Crea un **nuovo giocatore fittizio**, ad esempio «Giulia Prova», e assegnagli un ruolo.
5. Ricarica la pagina: il nuovo componente deve essere ancora presente.
6. Vai in **Quote**, crea una quota di prova di 100 euro con 25 euro versati: deve apparire **parziale**.
7. Vai in **Documenti** e inserisci una liberatoria fittizia per il nuovo componente.
8. Torna in **Panoramica**, verifica il numero di persone e l'importo ancora da registrare.
9. Chiudi e riapri il browser, controlla che le modifiche di prova siano rimaste.
10. Premi **Ripristina dati prova** e conferma: devono tornare i dati iniziali.

## D. Installare sulla schermata Home

Dopo aver attivato Pages e aperto l'indirizzo HTTPS:
- **iPhone:** Safari → Condividi → **Aggiungi alla schermata Home**; denominazione e posizione possono variare a seconda di iOS.
- **Android:** Chrome → menu → **Installa app** / **Aggiungi alla schermata Home**.

L'installazione non passa dagli store. Le informazioni Google reali richiedono comunque rete; la cache del service worker contiene solo asset statici pubblici.

## E. Cosa non provare ancora

Non utilizzare i propri documenti della squadra, dati anagrafici personali, certificati medici o foto reali in modalità demo. La modalità demo salva informazioni localmente **senza protezioni per dati sensibili**. Non è ancora il sistema operativo a due account.

Non provare a collegare OAuth Google fino a quando il progetto Google Cloud, la riduzione dei permessi Drive e la condivisione dei due account non sono stati configurati e collaudati secondo [guida 14](14-avvio-prima-versione.md) e [vincolo costo zero, guida 16](16-condivisione-accessi-e-costi-zero.md). La modalità demo serve a validare le schermate, non l'integrazione Google.

## F. Come segnalare un problema

Segna: **pagina**, **operazione**, **risultato atteso**, **cosa succede realmente**, **dispositivo/browser**. È utile anche uno screenshot **privo di dati personali**. Questo ci permette di correggere la PWA sul branch `dev` senza perdere ciò che già funziona.

## G. Controlli già eseguiti sul codice

- Sintassi JavaScript delle risorse principali verificata.
- Avvio simulato della UI e presenza delle schermate.
- Registrazione fittizia di una nuova persona, persistenza locale e ripristino della demo verificati con un DOM/browser simulato.
- Controlli su intestazioni dei fogli, riferimenti logici delle righe, stati delle quote e URL ammessi.

**Non è stato effettuato ancora un test end-to-end reale su Safari iPhone, Chrome Android o con API Google autentiche.** Dopo l'attivazione Pages vanno provati su dispositivo.
