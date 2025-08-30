const characters = [
    "black-widow", "captain-america",
    "hawkeye", "hulk",
    "iron-man", "thor",
    "ant-man", "falcon", "star-lord",
    "vision", "wanda-maximoff",
    "black-panther", "captain-marvel",
    "doctor-strange", "spider-man"
];

const cardNumbers = {
    "easy": 6,
    "normal": 11,
    "hard": 15
};

const board = document.querySelector("#board");

// Time count
let remaining = [];
let startTime = 0;
let timerId;

// Current data
let username;
let usedRevealPair = false, usedRevealBoard = false;
let level = "easy";
let cards = [];
let currentTime = 0;
let errorCount = 0;
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
            startTime = Date.now();
            resolve("Kártyák elrejtve!");
        }, 300);
    });
}

async function loadCards(cards) {
    remaining = [...cards];
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

async function flip(card) {
    card.querySelector(".back").classList.remove("hidden");
    card.querySelector(".front").classList.add("hidden");
}

async function showPair(a, b) {
    return new Promise(resolve => {
        reveal(b);
        setTimeout(() => {
            checkPair(a, b);
            resolve();
        }, 1000);
    });
}

function checkEndgame() {
    if (remaining.length > 0) return;
    clearInterval(timerId);
    const p = document.querySelector("#win");
    p.style.display = "block";
    board.style.display = "none";
    board.removeEventListener("click", handleStep);
}

function checkPair(a, b) {
    const hero1 = a.querySelector("img").alt;
    const hero2 = b.querySelector("img").alt;
    if (hero1 === hero2) {
        a.classList.add("hidden");
        b.classList.add("hidden");
        remaining = remaining.filter(e => e !== hero1);
    } else {
        flip(a); flip(b);
        errorCount++;
        const errorSpan = document.querySelector("#error");
        errorSpan.innerText = errorCount;
    }
    checkEndgame();
}

async function handleStep(e) {
    if (!e.target.matches(".back")) return;
    board.removeEventListener("click", handleStep);
    const current = e.target.parentNode;
    if (!last) {
        last = current;
        reveal(last);
    } else if (current !== last) {
        await showPair(last, current);
        last = null;
    }
    board.addEventListener("click", handleStep);
}

function countTime() {
    const timeSpan = document.querySelector("#time");
    const resultDiv = timeSpan.parentNode.parentNode;
    resultDiv.classList.remove("d-none");
    timerId = setInterval(() => {
        currentTime = Date.now();
        const elapsed = parseInt((currentTime - startTime) / 1000);
        timeSpan.innerText = elapsed;
    }, 1000);
}

function getData() {
    const input = document.querySelector("input");
    username = input.value;
    const p = document.querySelector("form p");
    p.innerText = name ? "" : "Add meg a neved!";
    const select = document.querySelector("select");
    level = select.value;
}

async function startGame(e) {
    e.preventDefault();
    getData();
    if (!username) return;
    button.disabled = true;
    button.removeEventListener("click", startGame);
    
    board.classList.remove("d-none");
    cards = characters.splice(0, cardNumbers[level]);
    cards = [...cards, ...cards];
    shuffle(cards);
    await loadCards(cards);
    document.querySelector("#ability").classList.remove("d-none");
    countTime();

    board.addEventListener("click", handleStep);
    revealPairBtn.addEventListener("click", revealPair);
}
const button = document.querySelector("form button");
button.addEventListener("click", startGame);

// Abilities
const revealPairBtn = document.querySelector("#revealPair");
async function revealPair() {
    if (!username || usedRevealPair) return;
    usedRevealPair = true;
    revealPairBtn.disabled = true;
    revealPairBtn.removeEventListener("click", revealPair);
    board.removeEventListener("click", handleStep);

    const chosen = cards[randint(0, cards.length - 1)];
    const pair = Array.from(board.children).filter(e => e.querySelector("img").alt === chosen);
    reveal(pair[0]);
    await showPair(pair[0], pair[1]);

    const lastParent = last.parentNode;
    console.log(last, lastParent.classList.contains("hidden"));
    
    if (lastParent.classList.contains("hidden")) last = null;
    board.addEventListener("click", handleStep);
}

const revealBoardBtn = document.querySelector("#revealBoard");
function revealBoard() {
    board.removeEventListener("click", handleStep);

    board.addEventListener("click", handleStep);
}
revealBoardBtn.addEventListener("click", revealBoard);