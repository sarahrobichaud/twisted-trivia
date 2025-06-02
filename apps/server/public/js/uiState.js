export const uiState = {
    isHost: false,
    phase: "waiting",
    socketID: null,
    joinCode: null,
    quiz: {
        title: null,
        questionCount: 0,
    },
    player: {
        hasAnswered: false,
        isCorrect: false,
        multiplier: 1,
        timeToAnswer: 0,
    },
    waiting: {
        playerList: []
    },
    question: {
        active: "This is a question",
        answers: [{ id: 1, text: "Answer 1" }, { id: 2, text: "Answer 2" }, { id: 3, text: "Answer 3" }, { id: 4, text: "Answer 4" }],
        currentQuestion: 0,
        answerCount: 0,
        timeLeft: 0,
    },
    host: {
        canStartGame: false,
        canGoToNextQuestion: false,
        canEndGame: false,
    },
    cooldown: {
        correctAnswer: null,
        playerList: []
    },
    end: {
        reason: null,
        playerList: []
    }
}

