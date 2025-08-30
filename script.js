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
    "könnyű": 6,
    "normál": 11,
    "nehéz": 15
};

const board = document.querySelector("#board");

// Time count
let remaining = [];
let startTime = 0;
let timerId;

// Current data
let email, age;
let usedRevealPair = false, usedRevealBoard = false;
let level = "könnyű";
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
            <div class="back flipped"></div>
            <div class="front">
                <img src="./images/${card}.png" alt="${card}">
            </div>
        </div>
    `;
    return li;
}

function hideCards() {
    return new Promise(resolve => {
        setTimeout(() => {
            for (const li of board.children) {
                li.querySelector(".front").classList.add("flipped");
                li.querySelector(".back").classList.remove("flipped");
            }
            startTime = Date.now();
            resolve("Kártyák elrejtve!");
        }, 3000);
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
    card.querySelector(".back").classList.add("flipped");
    card.querySelector(".front").classList.remove("flipped");
}

async function flipBack(card) {
    card.querySelector(".front").classList.add("flipped");
    card.querySelector(".back").classList.remove("flipped");
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

function getStats() {
    let games = JSON.parse(localStorage.getItem("games"));
    if (!games) games = [];
    return games;
}

function saveStats() {
    const time = parseInt((currentTime - startTime) / 1000);
    const date = new Date(Date.now()).toLocaleDateString();
    const data = { email, age, level, time, errorCount, date };
    const games = getStats();
    games.push(data);
    localStorage.setItem("games", JSON.stringify(games));
}

async function postStats() {
    const time = parseInt((currentTime - startTime) / 1000);
    const data = { email, age, level, time, mistakes: errorCount };
    const OPTIONS = {
        method: "POST",
        body: JSON.stringify(data)
    };
    const response = await fetch("http://localhost/memory/create/", OPTIONS);
    const message = await response.json();
    console.log(message);
}

async function checkEndgame() {
    if (remaining.length > 0) return;
    clearInterval(timerId);
    const p = document.querySelector("#win");
    p.style.display = "block";
    board.style.display = "none";
    board.removeEventListener("click", handleStep);
    saveStats();
    await postStats();
}

function checkPair(a, b) {
    const hero1 = a.querySelector("img").alt;
    const hero2 = b.querySelector("img").alt;
    if (hero1 === hero2) {
        a.classList.add("d-none");
        b.classList.add("d-none");
        remaining = remaining.filter(e => e !== hero1);
    } else {
        flipBack(a); flipBack(b);
        errorCount++;
        const errorSpan = document.querySelector("#error");
        errorSpan.innerText = errorCount;
    }
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
    await checkEndgame();
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

function readData() {
    const emailInput = document.querySelector("input[type=text]");
    email = emailInput.value;
    const ageInput = document.querySelector("input[type=number]");
    age = parseInt(ageInput.value);
    const p = document.querySelector("form p");
    p.innerText = (email && age) ? "" : "Add meg az email címed és a korod!";
    const select = document.querySelector("select");
    level = select.value;
}

async function startGame(e) {
    e.preventDefault();
    readData();
    if (!email || !age) return;
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

board.addEventListener("mousedown", e => e.preventDefault());

// Abilities
const revealPairBtn = document.querySelector("#revealPair");
async function revealPair() {
    if (usedRevealPair) return;
    usedRevealPair = true;
    revealPairBtn.disabled = true;
    revealPairBtn.removeEventListener("click", revealPair);
    board.removeEventListener("click", handleStep);

    const chosen = cards[randint(0, cards.length - 1)];
    const pair = Array.from(board.children).filter(e => e.querySelector("img").alt === chosen);
    reveal(pair[0]);
    await showPair(pair[0], pair[1]);
    if (last && last.parentNode.classList.contains("flipped")) last = null;
    board.addEventListener("click", handleStep);
}

const revealBoardBtn = document.querySelector("#revealBoard");
function revealBoard() {
    if (usedRevealBoard) return;
    usedRevealBoard = true;
    revealBoardBtn.disabled = true;
    revealBoardBtn.removeEventListener("click", revealPair);
    board.removeEventListener("click", handleStep);
    for (const card of board.children) {
        reveal(card);
    }
    hideCards();
    board.addEventListener("click", handleStep);
}
revealBoardBtn.addEventListener("click", revealBoard);