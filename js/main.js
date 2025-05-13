const entrate = document.getElementById("entrate");
const spese = document.getElementById("spese");
const bilancio = document.getElementById("bilancio");
const descrizione = document.getElementById("descrizione");
const importo = document.getElementById("importo");
const select = document.getElementById("tipo");
const data = document.getElementById("data");
const btn = document.getElementById("btn-add");
const table = document.getElementById("lista-transazioni");
const form = document.getElementById("form");
const parEntrate = document.getElementById("par-entrate");
const parSpese = document.getElementById("par-spese");
const parBilancio = document.getElementById("par-bilancio");

const transazioni = [];
let totaleEntrate = 0;
let totaleSpese = 0;

// Carica le transazioni salvate all'avvio
window.addEventListener("load", () => {
  const datiSalvati = JSON.parse(localStorage.getItem("transazioni")) || [];
  datiSalvati.forEach((transazione) => {
    transazioni.push(transazione);
    aggiungiTransazioneAlDOM(transazione);
  });
  aggiornaTotali();
});

// Aggiunge una transazione alla tabella e aggiorna i totali
function aggiungiTransazioneAlDOM(transazione) {
  const riga = document.createElement("tr");
  const btnElimina = document.createElement("button");
  btnElimina.innerHTML = `<i class="fa-solid fa-trash"></i>`;
  btnElimina.classList.add("btn-delete");

  riga.innerHTML = `
    <td>${transazione.data}</td>
    <td>${transazione.descrizione}</td>
    <td>${transazione.tipo}</td>
    <td>${transazione.importo}</td>
  `;

  table.appendChild(riga);
  riga.appendChild(btnElimina);

  if (transazione.tipo.toLowerCase() === "entrata") {
    riga.classList.add("entrata");
    btnElimina.classList.add("btn-entrata");
    totaleEntrate += transazione.importo;
  } else if (transazione.tipo.toLowerCase() === "spesa") {
    riga.classList.add("spesa");
    btnElimina.classList.add("btn-spesa");
    totaleSpese -= transazione.importo;
  }

  aggiornaTotali();
  aggiungiEventoElimina(riga, transazione, btnElimina);
}

// Listener per il bottone "Aggiungi"
btn.addEventListener("click", function (e) {
  e.preventDefault();

  if (!select.value || !descrizione.value || !importo.value || !data.value) {
    alert("Compila tutti i campi per aggiungere una transazione.");
    return;
  }

  const transazione = {
    descrizione: descrizione.value,
    importo: parseFloat(importo.value),
    tipo: select.value,
    data: data.value,
  };

  transazioni.push(transazione);
  localStorage.setItem("transazioni", JSON.stringify(transazioni));

  aggiungiTransazioneAlDOM(transazione);

  // Reset campi input
  descrizione.value = "";
  importo.value = "";
  select.value = "";
  data.value = "";
});

// Listener per il pulsante "Reset dati"
document.getElementById("reset-dati").addEventListener("click", function () {
  localStorage.removeItem("transazioni");
  location.reload();
});

// Rimuove la transazione dall'array e da localStorage
function rimuoviTransazione(transazioneDaRimuovere) {
  const indice = transazioni.findIndex(
    (t) =>
      t.descrizione === transazioneDaRimuovere.descrizione &&
      t.data === transazioneDaRimuovere.data &&
      t.tipo === transazioneDaRimuovere.tipo &&
      t.importo === transazioneDaRimuovere.importo
  );

  if (indice !== -1) {
    transazioni.splice(indice, 1);
    localStorage.setItem("transazioni", JSON.stringify(transazioni));
  }
}

// Aggiorna i totali di entrate, spese e bilancio
function aggiornaTotali() {
  totaleEntrate = 0;
  totaleSpese = 0;

  transazioni.forEach((transazione) => {
    if (transazione.tipo.toLowerCase() === "entrata") {
      totaleEntrate += transazione.importo;
    } else if (transazione.tipo.toLowerCase() === "spesa") {
      totaleSpese -= transazione.importo;
    }
  });

  parEntrate.innerText = `${totaleEntrate.toFixed(2)} €`;
  parSpese.innerText = `${totaleSpese.toFixed(2)} €`;
  parBilancio.innerText = `${(totaleEntrate + totaleSpese).toFixed(2)} €`;
}

// Aggiunge il comportamento al bottone elimina
function aggiungiEventoElimina(riga, transazione, btnElimina) {
  btnElimina.addEventListener("click", function () {
    riga.remove();
    rimuoviTransazione(transazione);
    aggiornaTotali();
  });
}
