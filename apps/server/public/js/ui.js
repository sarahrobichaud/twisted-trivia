export const screens = {
    waiting: document.getElementById("waiting-room"),
    questioning: document.getElementById("question-view-container"),
    cooldown: document.getElementById("cooldown-view"),
    end: document.getElementById("end-view"),
}

export const titleBar = {
    activePhase: document.getElementById("active-phase"),
    timer: document.getElementById("time-left"),
    joinCodeContainer: document.getElementById("join-code-container"),
    joinCodeSeparator: document.getElementById("join-code-separator"),
}


export const lobbyScreen = {
    titleBar: {
        gameTitle: document.getElementById("game-title"),
        questionCount: document.getElementById("question-count"),
        joinCode: document.getElementById("join-code"),
    },
    hostPanel: {
        self: document.getElementById("host-panel"),
        startGameBtn: document.getElementById("start-game-btn"),
    },
    shared: {
        playerList: document.getElementById("player-list"),
    },
    playerPanel: {
        self: document.getElementById("player-lobby-panel"),
    }
}

export const questionScreen = {
    shared: {
        questionContent: document.getElementById("question-content"),
    },
    player: {
        self: document.getElementById("question-view-player"),
        answerButtons: Array.from(document.querySelectorAll("#player-answer-btn-1, #player-answer-btn-2, #player-answer-btn-3, #player-answer-btn-4")),
        answerButtonsContainer: document.getElementById("question-answers-container"),
        answerResultContainer: document.getElementById("player-answer-result-container"),
        answerResultText: document.getElementById("player-answer-result-text"),
        answerResultMultiplier: document.getElementById("player-answer-result-multiplier"),
    },
    host: {
        self: document.getElementById("question-view-host"),
        answerCount: document.getElementById("answer-count"),
        questionNumber: document.getElementById("question-number"),
    }
}

export const cooldownScreen = {
    shared: {
        playerList: document.getElementById("cooldown-player-list"),
        correctAnswer: document.getElementById("cooldown-correct-answer"),
    },
    player: {
        self: document.getElementById("player-cooldown-panel"),
        playerText: document.getElementById("cooldown-player-text"),
    },
    host: {
        self: document.getElementById("host-cooldown-panel"),
        nextQuestionBtn: document.getElementById("cooldown-next-question-btn"),
        endGameBtn: document.getElementById("cooldown-end-game-btn"),
    }
}

export const endScreen = {
    playerList: document.getElementById("end-player-list"),
    reason: document.getElementById("end-game-reason"),
}

export const updateWaitingTitleBar = (uiState) => {
    lobbyScreen.titleBar.gameTitle.textContent = uiState.quiz.title;
    lobbyScreen.titleBar.questionCount.textContent = `${uiState.quiz.questionCount} Questions`;
    lobbyScreen.titleBar.joinCode.textContent = uiState.joinCode;
}

export const updateActivePhase = (uiState) => {
    titleBar.activePhase.textContent = uiState.phase.charAt(0).toUpperCase() + uiState.phase.slice(1);
}

/**
 *  Question Screen
 */

export const updateQuestionContent = (uiState) => {
    console.log("Updating question content", uiState);
    questionScreen.shared.questionContent.textContent = uiState.question.active;
}

export const updateQuestionTick = (uiState) => {
    titleBar.timer.textContent = uiState.question.timeLeft;
    questionScreen.host.answerCount.textContent = uiState.question.answerCount;
}

export const updateHostQuestionScreen = (uiState) => {
    questionScreen.host.questionNumber.textContent = `Question ${uiState.question.currentQuestion.content}`;
}

export const updatePlayerQuestionScreen = (uiState) => {
    console.log("Updating player question screen", uiState);

    if (uiState.player.hasAnswered) {
        questionScreen.player.answerButtonsContainer.classList.add("hidden");
        questionScreen.player.answerResultContainer.classList.remove("hidden");
        questionScreen.player.answerResultText.textContent = uiState.player.isCorrect ? "Correct!" : "Incorrect!";

        if (uiState.player.isCorrect) {
            questionScreen.player.answerResultMultiplier.classList.remove("hidden");
            questionScreen.player.answerResultMultiplier.textContent = `Time Multiplier: +${uiState.player.multiplier}x`;
        } else {
            questionScreen.player.answerResultMultiplier.classList.add("hidden");
        }

        return;
    }

    questionScreen.player.answerButtonsContainer.classList.remove("hidden");
    questionScreen.player.answerResultContainer.classList.add("hidden");

    questionScreen.player.answerButtons.forEach((button, index) => {
        button.textContent = uiState.question.answers[index].text;
        button.setAttribute("data-answer-id", uiState.question.answers[index].id);
    });
}



export function updateCooldownCorrectAnswer(uiState) {
    console.log("Updating cooldown correct answer", uiState);
    cooldownScreen.shared.correctAnswer.textContent = uiState.cooldown.correctAnswer;
}

export function updatePlayerList(uiState) {
    console.log("Updating player list");
    lobbyScreen.shared.playerList.innerHTML = "";
    uiState.waiting.playerList.forEach(player => {
        const li = document.createElement("li");
        li.textContent = player.username;

        console.log("Player socketId", player.socketId);
        console.log("UI socketID", uiState.socketID);
        if (player.socketId === uiState.socketID) {
            li.classList.add("text-blue-500", "font-bold");
        }

        if (player.isHost) {
            li.classList.add("font-bold");
            li.textContent += " (Host)";
        }

        li.textContent += ` - (${player.status})`;


        lobbyScreen.shared.playerList.appendChild(li);
    });
}

export function updateCooldownPlayerList(uiState) {
    console.log("Updating cooldown player list", uiState);
    cooldownScreen.shared.playerList.innerHTML = "";
    uiState.cooldown.playerList.forEach(player => {
        const li = document.createElement("li");
        li.textContent = `${player.position}. ${player.username} - ${player.score}pts`;
        cooldownScreen.shared.playerList.appendChild(li);
    });
}

export function updateEndPlayerList(uiState) {
    console.log("Updating end player list", uiState);
    endScreen.playerList.innerHTML = "";
    uiState.end.playerList.forEach(player => {
        const li = document.createElement("li");
        li.textContent = `${player.position}. ${player.username} - ${player.score}pts`;
        endScreen.playerList.appendChild(li);
    });
}

export function updateEndGameReason(uiState) {
    console.log("Updating end game reason", uiState);
    endScreen.reason.textContent = uiState.end.reason;
}

export function changeScreen(uiState) {
    switchToScreen(uiState);
}

function switchToScreen(uiState) {
    const { phase, isHost } = uiState;

    Object.values(screens).forEach(screen => {
        screen.classList.add("hidden");
    });

    console.log("Switching to screen", phase);
    console.log("Screens", screens);
    const screen = screens[phase];

    if (phase === 'questioning') {
        titleBar.timer.classList.remove("hidden");
        questionScreen.player.answerResultContainer.classList.add("hidden");
        questionScreen.player.answerButtonsContainer.classList.remove("hidden");
    } else {
        titleBar.timer.classList.add("hidden");
        questionScreen.player.answerResultContainer.classList.add("hidden");
        questionScreen.player.answerButtonsContainer.classList.add("hidden");
    }

    if (phase === 'waiting') {
        titleBar.joinCodeContainer.classList.remove("hidden");
        titleBar.joinCodeSeparator.classList.remove("hidden");
    } else {
        titleBar.joinCodeContainer.classList.add("hidden");
        titleBar.joinCodeSeparator.classList.add("hidden");
    }


    if (!screen) console.error(`Screen ${phase} not found`);

    screens[phase].classList.remove("hidden");
}

export function updateHostActions(uiState) {

    const { phase, isHost, host } = uiState;

    if (phase === 'waiting') {
        if (isHost) {
            lobbyScreen.hostPanel.self.classList.remove("hidden");
            lobbyScreen.playerPanel.self.classList.add("hidden");

            if (!host.canStartGame) {
                lobbyScreen.hostPanel.startGameBtn.setAttribute("disabled", "disabled");
                lobbyScreen.hostPanel.startGameBtn.classList.add("!bg-gray-400", "hover:cursor-not-allowed");
                lobbyScreen.hostPanel.startGameBtn.textContent = "Waiting for players...";
            } else {
                lobbyScreen.hostPanel.startGameBtn.removeAttribute("disabled");
                lobbyScreen.hostPanel.startGameBtn.classList.remove("!bg-gray-400", "hover:cursor-not-allowed");
                lobbyScreen.hostPanel.startGameBtn.textContent = "Start Game";
            }
        } else {
            lobbyScreen.hostPanel.self.classList.add("hidden");
            lobbyScreen.playerPanel.self.classList.remove("hidden");
        }
    }

    if (phase === 'questioning') {
        if (isHost) {
            questionScreen.host.self.classList.remove("hidden");
            questionScreen.player.self.classList.add("hidden");
        } else {
            questionScreen.host.self.classList.add("hidden");
            questionScreen.player.self.classList.remove("hidden");
        }
    }

    if (phase === 'cooldown') {
        if (isHost) {
            cooldownScreen.host.self.classList.remove("hidden");
            cooldownScreen.host.nextQuestionBtn.classList[host.canGoToNextQuestion ? "remove" : "add"]("hidden");
            cooldownScreen.host.endGameBtn.classList[host.canEndGame ? "remove" : "add"]("hidden");
            cooldownScreen.player.playerText.classList.add("hidden");
        } else {
            cooldownScreen.host.self.classList.add("hidden");
            cooldownScreen.player.self.classList.remove("hidden");
            cooldownScreen.player.playerText.textContent = "Waiting for host to continue...";
        }
    }
}
