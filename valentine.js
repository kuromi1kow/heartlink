const inviteCard = document.querySelector(".invite-card");
const resultCard = document.querySelector(".result-card");
const resultCopy = document.querySelector("#result-copy");
const yesButton = document.querySelector(".yes-btn");
const noButton = document.querySelector(".no-btn");
const noFeedback = document.querySelector(".no-feedback");
const resetButton = document.querySelector(".reset-btn");
const telegramButton = document.querySelector("#telegram-btn");
const instagramButton = document.querySelector("#instagram-btn");
const copyButton = document.querySelector("#copy-btn");
const notifyStatus = document.querySelector(".notify-status");
const moodButtons = document.querySelectorAll(".mood-chip");

const yourTelegramUsername = "ghinayatolla";
const yourInstagramUsername = "ghinayatolla";
const ownerNotificationWebhook = "";
const noMessages = [
    "Are you sure? I promise it will be calm and sweet.",
    "Maybe one coffee first? No pressure.",
    "I can choose a better plan if you want.",
    "Okay, I will wait. But the Yes button is still here."
];

const moodMessages = {
    coffee: "Coffee first sounds perfect. I will find the coziest place and keep the conversation easy.",
    dinner: "Dinner date it is. I will choose somewhere warm, pretty, and worth dressing up for.",
    surprise: "Surprise mode unlocked. I will plan something sweet and tell you just enough to be curious."
};

let selectedMood = "coffee";
let noAttempts = 0;

moodButtons.forEach((button) => {
    button.addEventListener("click", () => {
        moodButtons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        selectedMood = button.dataset.mood;
    });
});

yesButton.addEventListener("click", async () => {
    resultCopy.textContent = moodMessages[selectedMood];
    resultCard.hidden = false;
    document.body.classList.add("modal-open");
    notifyStatus.textContent = "Saving your answer...";
    createConfetti();
    await notifyOwner();
});

resetButton.addEventListener("click", () => {
    resultCard.hidden = true;
    document.body.classList.remove("modal-open");
    noAttempts = 0;
    noButton.classList.remove("is-running");
    noButton.style.left = "";
    noButton.style.top = "";
    noButton.style.transform = "";
    noButton.textContent = "No";
    noFeedback.textContent = "";
    yesButton.classList.remove("is-suggested");
    notifyStatus.textContent = "";
});

noButton.addEventListener("mouseenter", () => {
    if (!isTouchDevice()) {
        moveNoButton();
    }
});

noButton.addEventListener("focus", () => {
    if (!isTouchDevice()) {
        moveNoButton();
    }
});

noButton.addEventListener("click", () => {
    if (isTouchDevice()) {
        handleNoGently();
        return;
    }

    moveNoButton();
});

copyButton.addEventListener("click", async () => {
    await copyMessage(getAnswerMessage());
});

telegramButton.addEventListener("click", async () => {
    const copied = await copyMessage(getAnswerMessage());
    notifyStatus.textContent = copied
        ? "Answer copied. Paste it into Telegram."
        : "Copy the answer above, then paste it into Telegram.";

    const telegramUrl = yourTelegramUsername
        ? `https://t.me/${yourTelegramUsername}`
        : "https://t.me/";

    window.open(telegramUrl, "_blank", "noopener,noreferrer");
});

instagramButton.addEventListener("click", async () => {
    const copied = await copyMessage(getAnswerMessage());
    notifyStatus.textContent = copied
        ? "Answer copied. Paste it into Instagram DM."
        : "Copy the answer above, then paste it into Instagram DM.";

    const instagramUrl = yourInstagramUsername
        ? `https://www.instagram.com/${yourInstagramUsername}/`
        : "https://www.instagram.com/direct/inbox/";

    window.open(instagramUrl, "_blank", "noopener,noreferrer");
});

function moveNoButton() {
    noAttempts += 1;
    const labels = ["No", "Are you sure?", "Think again", "Too slow", "Try yes"];
    const buttonRect = noButton.getBoundingClientRect();
    const safePadding = 18;
    const maxX = window.innerWidth - buttonRect.width - safePadding;
    const maxY = window.innerHeight - buttonRect.height - safePadding;
    const nextX = Math.max(safePadding, Math.floor(Math.random() * maxX));
    const nextY = Math.max(safePadding, Math.floor(Math.random() * maxY));

    noButton.classList.add("is-running");
    noButton.style.left = `${nextX}px`;
    noButton.style.top = `${nextY}px`;
    noButton.textContent = labels[Math.min(noAttempts, labels.length - 1)];
    noFeedback.textContent = noMessages[Math.min(noAttempts - 1, noMessages.length - 1)];
}

function handleNoGently() {
    noAttempts += 1;
    const labels = ["Are you sure?", "Maybe coffee?", "One chance?", "Yes looks better"];
    const nudges = ["translateX(8px)", "translateX(-8px)", "translateY(-4px)", "scale(0.98)"];

    noButton.classList.remove("is-running");
    noButton.style.left = "";
    noButton.style.top = "";
    noButton.textContent = labels[Math.min(noAttempts - 1, labels.length - 1)];
    noButton.style.transform = nudges[noAttempts % nudges.length];
    noFeedback.textContent = noMessages[Math.min(noAttempts - 1, noMessages.length - 1)];

    yesButton.classList.toggle("is-suggested", noAttempts >= 2);
}

function isTouchDevice() {
    return window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 640;
}

function createConfetti() {
    const colors = ["#d94568", "#ff8a6b", "#86c7b6", "#f4c86a", "#2f2630"];

    for (let index = 0; index < 70; index += 1) {
        const piece = document.createElement("span");
        piece.className = "confetti-piece";
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.background = colors[index % colors.length];
        piece.style.animationDelay = `${Math.random() * 0.45}s`;
        piece.style.setProperty("--fall-x", `${Math.random() * 220 - 110}px`);
        document.body.appendChild(piece);
        piece.addEventListener("animationend", () => piece.remove());
    }
}

function getAnswerMessage() {
    const selectedLabel = document.querySelector(".mood-chip.is-active").textContent;

    return `Yes, I want to go on a date. My choice: ${selectedLabel}.`;
}

async function notifyOwner() {
    if (!ownerNotificationWebhook) {
        notifyStatus.textContent = "Your answer is saved. No extra message needed.";
        return;
    }

    try {
        await fetch(ownerNotificationWebhook, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                answer: "yes",
                mood: document.querySelector(".mood-chip.is-active").textContent,
                message: getAnswerMessage(),
                sentAt: new Date().toISOString()
            })
        });

        notifyStatus.textContent = "Answer sent. You do not need to text anything.";
    } catch (error) {
        notifyStatus.textContent = "Could not send automatically. Use Telegram or Instagram below.";
    }
}

async function copyMessage(message) {
    if (navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(message);
            notifyStatus.textContent = "Answer copied.";
            return true;
        } catch (error) {
            notifyStatus.textContent = message;
        }
    }

    notifyStatus.textContent = message;
    return false;
}
