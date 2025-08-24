const characters = [
    "black-widow", "captain-america",
    "hawkeye", "hulk",
    "iron-man", "thor"
];

const board = document.querySelector("#board");
let last = null, current = null;

function randint(a, b) {
    return Math.floor(Math.random() * (b-a+1)) + a;
}

// --------------------------------------

function createCard(card) {
    const li = document.createElement("li");
    li.innerHTML = `
        <div class="card">
            <div class="front">
                <img src="./images/${card}.png" alt="${card}">
            </div>
            <div class="back hidden"></div>
        </div>
    `;
    return li;
}

function hideCards() {
    return new Promise(resolve => {
        setTimeout(() => {
            for (const li of board.children) {
                li.querySelector(".front").classList.add("hidden");
                li.querySelector(".back").classList.remove("hidden");
            }
            resolve("Kártyák elrejtve!");
        }, 30);
    });
}

async function loadCards(cards) {
    for (const card of cards) {
        const li = createCard(card);
        board.appendChild(li);
    }
    await hideCards();
}

function shuffle(cards) {
    for (let i = 0; i < cards.length; i++) {
        const r = randint(i, cards.length-1);
        const temp = cards[i];
        cards[i] = cards[r];
        cards[r] = temp;
    }
}

async function reveal(card) {
    card.querySelector(".front").classList.remove("hidden");
    card.querySelector(".back").classList.add("hidden");
}

async function hide(card) {
    card.querySelector(".back").classList.remove("hidden");
    card.querySelector(".front").classList.add("hidden");
}

async function showCards(a, b) {
    return new Promise(resolve => {
        reveal(a); reveal(b);
        setTimeout(() => {
            checkPair(a, b);
            resolve();
        }, 1000);
    });
}

function checkPair(a, b) {
    const hero1 = a.querySelector("img").alt;
    const hero2 = b.querySelector("img").alt;
    if (hero1 === hero2) {
        a.classList.add("hidden");
        b.classList.add("hidden");
    } else {
        hide(a); hide(b);
    }
}

async function handleStep(e) {
    if (!e.target.matches(".back")) return;
    board.removeEventListener("click", handleStep);
    const current = e.target.parentNode;
    if (!last) {
        last = current;
    } else if (current !== last) {
        await showCards(last, current);
        last = null;
    }
    board.addEventListener("click", handleStep);
}

async function startGame() {
    cards = [...characters, ...characters];
    shuffle(cards);
    await loadCards(cards);
    board.addEventListener("click", handleStep);
}

// Automatic start (manual testing)
function main() {
    startGame();
}
main();