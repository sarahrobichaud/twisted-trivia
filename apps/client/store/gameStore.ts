import { GAME_PHASE, type GamePhase } from "~/types/quiz";

interface HostActions {
    canStartGame: boolean
    canEndGame: boolean
    canGoToNextQuestion: boolean
}

interface QuestionInfo {
    questionNumber: 0,
    questionCount: 0,
    answerCount: 0,
    timeLeft: 0,
    question: { consent: '', id: '', point: 0 },
    correctAnswer: '',
}

interface GameInfo {
    gameID: string
    joinCode: string,
    playerCode: string;
    gamePhase: GamePhase;
    title: string;
    players: string[]
}
interface PlayerInfo {
    hasAnswered: boolean
    isCorrect: boolean;
    multiplier: number;
    timeToAnswer: number;
    isHost: boolean;
    lastAnswer: string;
}

interface Game {
    isInGame: boolean;
    gameInfo: GameInfo;
    hostActions: HostActions;
    questionInfo: QuestionInfo;
    playerInfo: PlayerInfo;
}

export const useGameStore = defineStore('game', () => {

    const game = ref<Game>({
        gameInfo: {
            gameID: '',
            joinCode: '',
            playerCode: '',
            gamePhase: GAME_PHASE.WAITING,
            title: '',
            players: []
        },
        playerInfo: {
            hasAnswered: false,
            isCorrect: false,
            multiplier: 0,
            timeToAnswer: 0,
            isHost: false,
            lastAnswer: ''
        },
        hostActions: {
            canStartGame: false,
            canEndGame: false,
            canGoToNextQuestion: false
        },
        questionInfo: {
            questionNumber: 0,
            questionCount: 0,
            answerCount: 0,
            timeLeft: 0,
            question: { consent: '', id: '', point: 0 },
            correctAnswer: ''
        },
        isInGame: false
    })

    const connected = computed(() => game.value.isInGame)

    const setConnected = (connected: boolean) => {
        game.value.isInGame = connected
    }

    const handleWaitingInit = (data: any) => {
        game.value.gameInfo.joinCode = data.joinCode
        game.value.questionInfo.questionCount = data.questionCount
        game.value.gameInfo.title = data.title
    }

    return {
        game,
        handleWaitingInit,
        connected,
        setConnected
    }

})