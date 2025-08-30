const localTable = document.querySelector("#localStats");
const globalTable = document.querySelector("#globalStats");

let games = JSON.parse(localStorage.getItem("games"));

function generateRows(data, table) {
    table.innerHTML = "";
    const header = document.createElement("tr");
    header.innerHTML = `<th>Email</th>
                        <th>Kor</th>
                        <th>Szint</th>
                        <th>Idő (mp)</th>
                        <th>Hibák (db)</th>
                        <th>Dátum</th>`;
    table.appendChild(header);
    for (const game of data) {
        const tr = document.createElement("tr");
        for (const key in game) {
            tr.innerHTML += `<td>${game[key]}</td>`
        }
        table.appendChild(tr);
    }
}

function loadLocalStats() {
    if (!games) return;
    generateRows(games, localTable);
    filterInput.parentNode.classList.remove("d-none");
}

const filterInput = document.querySelector("input");
function filterData() {
    const email = filterInput.value;
    const data = games.filter(e => e.email.includes(email));
    generateRows(data, localTable);
}
filterInput.addEventListener("input", filterData);

function compareTo(a, b) {
    if (a.playtime < b.playtime || a.playtime === b.playtime && a.mistakes < b.mistakes) {
        return -1;
    } else if (a.playtime > b.playtime || a.playtime === b.playtime && a.mistakes > b.mistakes) {
        return 1;
    } else {
        return 0;
    }
}

const selectLevel = document.querySelector("select");
async function loadGlobalStats(e) {
    const level = e.target.value;
    const response = await fetch(`http://localhost/memory/?level=${level}`);
    const data = await response.json();
    data.sort(compareTo);
    generateRows(data, globalTable);
}
selectLevel.addEventListener("change", loadGlobalStats);

loadLocalStats();