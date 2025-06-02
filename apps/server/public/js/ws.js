import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
import * as ui from "./ui.js";
import { uiState } from "./uiState.js";

document.body.classList.add('hidden');
const url = new URL(window.location.href);
const gameID = url.pathname.split("/").pop();
const playerCode = url.searchParams.get("code");

const options = {
    path: "/trivia-app",
    auth: {
        gameId: gameID,
        code: playerCode
    }
}

const namespace = "/socket/game";
const ioURL = new URL("http://localhost:3000");

ioURL.pathname = namespace;

const socket = io(ioURL.toString(), options);

socket.on("connect", () => {
    console.log("Connected to server");
    uiState.socketID = socket.id;
    document.body.classList.remove('hidden');
});

socket.on("playerUpdate", (data) => {
    console.log("Player update:", data);

    uiState.waiting.playerList = data.players;

    ui.updatePlayerList(uiState);
})

socket.on("phaseUpdate", (data) => {
    console.log("Phase update:", data);
    uiState.phase = data.activePhase;

    if (uiState.phase === "question") {
        uiState.player.hasAnswered = false;
        uiState.player.isCorrect = false;
        uiState.player.multiplier = 1;
        uiState.player.timeToAnswer = 0;
    }

    // Prevent flashing
    clearTimeout(window._screenChangeTimeout);
    window._screenChangeTimeout = setTimeout(() => {
        ui.changeScreen(uiState);
    }, 150);
    ui.updateActivePhase(uiState);
})

ui.lobbyScreen.hostPanel.startGameBtn.addEventListener("click", () => {
    socket.emit("startGame");
})

ui.cooldownScreen.host.nextQuestionBtn.addEventListener("click", () => {
    socket.emit("nextQuestion");
})

ui.cooldownScreen.host.endGameBtn.addEventListener("click", () => {
    socket.emit("endGame");
})

ui.questionScreen.player.answerButtons.forEach(button => {
    button.addEventListener("click", () => {
        const answerId = button.getAttribute("data-answer-id");
        socket.emit("answerQuestion", answerId, (ack) => {
            uiState.player.isCorrect = ack.isCorrect;
            uiState.player.multiplier = ack.multiplier;
            uiState.player.timeToAnswer = ack.timeToAnswer;
            uiState.player.hasAnswered = true;
            ui.updatePlayerQuestionScreen(uiState);
        });
    })
})

socket.on("hostActionsUpdate", data => {
    console.log("Host actions update:", data);
    uiState.host = data;
    ui.updateHostActions(uiState);
});

socket.on("waitingInit", (data) => {
    console.log("Waiting init:", data);

    uiState.quiz.title = data.title;
    uiState.quiz.questionCount = data.questionCount;
    uiState.joinCode = data.joinCode;

    ui.updateWaitingTitleBar(uiState);
    ui.updateHostActions(uiState);
})

socket.on("questionInit", data => {

    console.log("Question init:", data);

    uiState.player.hasAnswered = false;
    uiState.player.isCorrect = false;
    uiState.player.multiplier = 1;
    uiState.player.timeToAnswer = 0;

    uiState.question.active = data.question;
    uiState.question.answers = data.choices;
    uiState.question.currentQuestion = data.questionNumber;

    if (uiState.isHost) {
        ui.updateHostQuestionScreen(uiState);
    } else {
        ui.updatePlayerQuestionScreen(uiState);
    }

    ui.updateQuestionContent(uiState);
    ui.updateHostActions(uiState);
});


socket.on('questionTick', data => {
    console.log("Question tick:", data);
    uiState.question.timeLeft = data.timeLeft;
    uiState.question.answerCount = data.answerCount;
    ui.updateQuestionTick(uiState);
})


socket.on("hostConfirm", () => {
    uiState.isHost = true;
    clearTimeout(window._screenChangeTimeout);
    window._screenChangeTimeout = setTimeout(() => {
        ui.changeScreen(uiState);
    }, 150);
    ui.updateHostActions(uiState);
});


socket.on("cooldownInit", data => {
    console.log("Cooldown init:", data);
    uiState.cooldown.playerList = data.players;
    uiState.cooldown.correctAnswer = data.correctAnswer;
    ui.updateCooldownPlayerList(uiState);
    ui.updateCooldownCorrectAnswer(uiState);
    ui.updateHostActions(uiState);
})

socket.on("endInit", data => {
    console.log("End init:", data);
    uiState.end.reason = data.reason;
    uiState.end.playerList = data.players;
    ui.updateEndPlayerList(uiState);
    ui.updateEndGameReason(uiState);
})

socket.on("connect_error", (error) => {
    console.error("Connection error:", error);
    alert("Connection error: " + error.message);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
    alert("Disconnected from server");
    window.location.href = "http://localhost:3000/app";
});

