
/* ---------- AUTH CHECK ---------- */
if (sessionStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
}

/* ---------- FULLSCREEN ---------- */
let fullscreenExitCount = 0;
let testStarted = false;

document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("fullscreenModal");
    const startBtn = document.getElementById("startTestBtn");

    modal.style.display = "flex";

    startBtn.addEventListener("click", async () => {

        try {

            await document.documentElement.requestFullscreen();

            modal.style.display = "none";

            if (!testStarted) {
                testStarted = true;
                initTimer();
            }

        } catch (err) {

            alert("Fullscreen permission denied.");

        }

    });

});

/* ---------- FULLSCREEN EXIT DETECTION ---------- */
document.addEventListener("fullscreenchange", () => {

    if (!document.fullscreenElement && testStarted) {

        fullscreenExitCount++;

        if (fullscreenExitCount >= 2) {

            alert("You exited fullscreen multiple times. Test terminated.");

            logout(true);

        } else {

            const modal = document.getElementById("fullscreenModal");

            document.querySelector("#fullscreenModal h2").innerText =
                "Fullscreen Required";

            document.querySelector("#fullscreenModal p").innerText =
                "You exited fullscreen mode. Click OK to continue the test.";

            modal.style.display = "flex";
        }
    }

});

/* ---------- TIMER ---------- */
const timerElement = document.getElementById("timer");
const warningMessage = document.getElementById("warningMessage");

const TOTAL_TIME = 2400; // 40 minutes
const STORAGE_KEY = "sadhana_timer_start";

let visibilityCount = 0;

function nowSeconds() {
    return Math.floor(Date.now() / 1000);
}
const progressCircle = document.getElementById("progressCircle");

const radius = 42;
const circumference = 2 * Math.PI * radius;

progressCircle.style.strokeDasharray = circumference;
function updateTimerDisplay(timeLeft) {

    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;

    timerElement.textContent =
        String(m).padStart(2, "0") +
        ":" +
        String(s).padStart(2, "0");

    const progress = timeLeft / TOTAL_TIME;

    progressCircle.style.strokeDashoffset =
        circumference * (1 - progress);

    // Change timer color based on remaining time
    if (timeLeft <= 300) { // Last 5 minutes
        progressCircle.style.stroke = "#ff4d4d";
    }
    else if (timeLeft <= 900) { // Last 15 minutes
        progressCircle.style.stroke = "#ffb300";
    }
    else {
        progressCircle.style.stroke = "goldenrod";
    }
}
function initTimer() {
    let startTime = localStorage.getItem(STORAGE_KEY);

    if (!startTime) {
        startTime = nowSeconds();
        localStorage.setItem(STORAGE_KEY, startTime);
    }

    const interval = setInterval(() => {

        const elapsed = nowSeconds() - startTime;
        const timeLeft = TOTAL_TIME - elapsed;

        if (timeLeft <= 0) {
            clearInterval(interval);

            alert("Time is up! Test ended.");

            logout(true);
        } else {
            updateTimerDisplay(timeLeft);
        }

    }, 1000);
}

function clearTimer() {
    localStorage.removeItem(STORAGE_KEY);
}



/* ---------- TAB SWITCH RULE ---------- */
document.addEventListener("visibilitychange", () => {

    if (document.visibilityState === "hidden") {

        visibilityCount++;

        warningMessage.style.display = "block";

        if (visibilityCount >= 2) {
            alert("Multiple tab switches detected.");
            logout(true);
        }
    }
});

/* ---------- LOGOUT ---------- */
function logout(force = false) {

    if (force || confirm("Confirm logout?")) {

        clearTimer();

        sessionStorage.clear();

        window.location.href = "index.html";
    }
}

/* ---------- DEVTOOLS DETECTION ---------- */
let devToolsOpened = false;

setInterval(() => {

    if (
        window.outerHeight - window.innerHeight > 160 ||
        window.outerWidth - window.innerWidth > 100
    ) {

        if (!devToolsOpened) {

            devToolsOpened = true;

            alert("Warning: Close Developer Tools.");
        }

    } else {

        devToolsOpened = false;
    }

}, 500);

/* ---------- DISABLE RIGHT CLICK ---------- */
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

/* ---------- BLOCK COMMON SHORTCUTS ---------- */
document.addEventListener("keydown", (e) => {

    const key = e.key.toLowerCase();

    if (
        e.ctrlKey &&
        ["c", "v", "x", "u", "s"].includes(key)
    ) {
        e.preventDefault();
    }
});