const localTable = document.querySelector("#localStats");
const globalTable = document.querySelector("#globalStats");

function loadLocalStats() {
    let games = JSON.parse(localStorage.getItem("games"));
    if (!games) return;

    const header = document.createElement("tr");
    header.innerHTML = `<th>Email</th>
                        <th>Kor</th>
                        <th>Szint</th>
                        <th>Idő (mp)</th>
                        <th>Hibák (db)</th>
                        <th>Dátum</th>`;
    localTable.appendChild(header);
    for (const game of games) {
        const tr = document.createElement("tr");
        console.log(game);
        for (const key in game) {
            tr.innerHTML += `<td>${game[key]}</td>`
        }
        localTable.appendChild(tr);
    }
}

loadLocalStats();