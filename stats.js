const localTable = document.querySelector("#localStats");
const globalTable = document.querySelector("#globalStats");

let games = JSON.parse(localStorage.getItem("games"));

function generateRows(data) {
    localTable.innerHTML = "";
    const header = document.createElement("tr");
    header.innerHTML = `<th>Email</th>
                        <th>Kor</th>
                        <th>Szint</th>
                        <th>Idő (mp)</th>
                        <th>Hibák (db)</th>
                        <th>Dátum</th>`;
    localTable.appendChild(header);
    for (const game of data) {
        const tr = document.createElement("tr");
        for (const key in game) {
            tr.innerHTML += `<td>${game[key]}</td>`
        }
        localTable.appendChild(tr);
    }
}

function loadLocalStats() {
    if (!games) return;
    generateRows(games);
    filterInput.parentNode.classList.remove("d-none");
}

const filterInput = document.querySelector("input");
function filterData() {
    const email = filterInput.value;
    const data = games.filter(e => e.email.includes(email));
    generateRows(data);
}
filterInput.addEventListener("input", filterData);

loadLocalStats();