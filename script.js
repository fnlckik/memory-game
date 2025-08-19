const characters = [
    "black-widow", "captain-america",
    "hawkeye", "hulk",
    "iron-man", "thor"
];

const board = document.querySelector("#board");

function randint(a, b) {
    return Math.floor(Math.random() * (b-a+1)) + a;
}

// --------------------------------------

function createCard(card) {
    const li = document.createElement("li");
    li.innerHTML = `
        <div class="card">
            <div class="front hidden"></div>
            <div class="back">
                <img src="./images/${card}.png">
            </div>
        </div>
    `;
    return li;
}

function hideCard(li) {
    setTimeout(() => {
        li.querySelector(".back").classList.add("hidden");
        li.querySelector(".front").classList.remove("hidden");
    }, 3000);
}

function loadCards(cards) {
    for (const card of cards) {
        const li = createCard(card);
        hideCard(li);
        board.appendChild(li);
    }
}

function shuffle(cards) {
    for (let i = 0; i < cards.length; i++) {
        const r = randint(i, cards.length-1);
        const temp = cards[i];
        cards[i] = cards[r];
        cards[r] = temp;
    }
}

function startGame() {
    cards = [...characters, ...characters];
    shuffle(cards);
    loadCards(cards);
}

// Automatic start (manual testing)
function main() {
    startGame();
}
main();