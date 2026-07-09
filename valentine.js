const inviteCard = document.querySelector(".invite-card");
const resultCard = document.querySelector(".result-card");
const resultCopy = document.querySelector("#result-copy");
const notifyStatus = document.querySelector(".notify-status");
const yesButton = document.querySelector(".yes-btn");
const maybeButton = document.querySelector(".maybe-btn");
const noFeedback = document.querySelector(".no-feedback");
const resetButton = document.querySelector(".reset-btn");
const moodButtons = [...document.querySelectorAll(".mood-chip")];
const scenePanels = [...document.querySelectorAll(".scene-panel")];
const progressDots = [...document.querySelectorAll(".progress-dot")];
const nextButtons = [...document.querySelectorAll(".scene-next")];
const backButtons = [...document.querySelectorAll(".scene-back")];
const questionCopy = document.querySelector("#question-copy");

// Paste the Google Apps Script web-app URL ending in /exec after deployment.
const notificationWebhook = "https://script.google.com/macros/s/AKfycbx_NWrLukBxS61JZ_54pY8KZaev4Zel84liw5Gld6J4MchHHliPW4el45A_YzONxVNHTw/exec";

const moodMessages = {
    coffee: {
        question: "We could get coffee, talk for a while, and keep the evening easy.",
        result: "Coffee sounds lovely. I will find a cozy place."
    },
    dinner: {
        question: "We could have dinner somewhere relaxed and take our time talking.",
        result: "Dinner sounds lovely. I will choose a relaxed place."
    },
    surprise: {
        question: "I can plan a simple surprise and make it an easy evening.",
        result: "I will plan something small and relaxed."
    }
};

const maybeLabels = [
    "Another day?",
    "Maybe coffee sometime?",
    "We can keep it simple.",
    "No rush at all.",
    "Take your time."
];

const maybeMessages = [
    "That is okay. We can choose another day.",
    "It can just be a simple coffee.",
    "No big plan, only a relaxed conversation.",
    "No pressure at all.",
    "Take all the time you need."
];

let maybeClicks = 0;

moodButtons.forEach((button) => {
    button.addEventListener("click", () => {
        moodButtons.forEach((item) => {
            item.classList.remove("is-active");
            item.setAttribute("aria-pressed", "false");
        });
        button.classList.add("is-active");
        button.setAttribute("aria-pressed", "true");
        questionCopy.textContent = moodMessages[button.dataset.mood].question;
    });
});

nextButtons.forEach((button) => {
    button.addEventListener("click", () => showScene(button.dataset.next));
});

backButtons.forEach((button) => {
    button.addEventListener("click", () => showScene(button.dataset.back));
});

yesButton.addEventListener("click", () => {
    const mood = getSelectedMood();

    resultCopy.textContent = moodMessages[mood.id].result;
    resultCard.hidden = false;
    document.body.classList.add("modal-open");
    void notifyOwner(mood);
});

resetButton.addEventListener("click", resetInvite);

maybeButton.addEventListener("click", () => {
    const index = maybeClicks % maybeLabels.length;

    maybeButton.textContent = maybeLabels[index];
    noFeedback.textContent = maybeMessages[index];
    maybeClicks += 1;
    yesButton.classList.toggle("is-warm", maybeClicks >= 3);
});

function getSelectedMood() {
    const button = document.querySelector(".mood-chip.is-active");

    return {
        id: button.dataset.mood,
        label: button.dataset.label
    };
}

function showScene(sceneName) {
    scenePanels.forEach((panel) => {
        const isActive = panel.dataset.scene === sceneName;

        panel.hidden = !isActive;
        panel.classList.toggle("is-active", isActive);
    });

    progressDots.forEach((dot) => {
        dot.classList.toggle("is-active", dot.dataset.progress === sceneName);
    });

    inviteCard.dataset.step = sceneName;
    noFeedback.textContent = "";
}

function getAnswerMessage() {
    const mood = getSelectedMood();

    return `Yes, I would like to go on a date. Choice: ${mood.label}.`;
}

function resetInvite() {
    resultCard.hidden = true;
    document.body.classList.remove("modal-open");
    noFeedback.textContent = "";
    notifyStatus.textContent = "";
    maybeClicks = 0;
    maybeButton.textContent = "Maybe another time";
    yesButton.classList.remove("is-warm");
    showScene("intro");
}

async function notifyOwner(mood) {
    if (!notificationWebhook) {
        notifyStatus.textContent = "";
        return;
    }

    notifyStatus.textContent = "Sending your answer...";

    try {
        await fetch(notificationWebhook, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
                answer: "yes",
                mood: mood.label,
                message: getAnswerMessage(),
                sentAt: new Date().toISOString(),
                pageUrl: window.location.href
            })
        });

        notifyStatus.textContent = "Your answer was sent.";
    } catch {
        notifyStatus.textContent = "I could not send it automatically. Please try again later.";
    }
}
