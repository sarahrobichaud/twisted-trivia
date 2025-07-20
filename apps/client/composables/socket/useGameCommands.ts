import type { Socket } from "socket.io-client"

export const useGameCommands = (socket: Socket) => {

    const startGame = () => {
        socket?.emit('startGame')
    }

    const endGame = () => {
        socket?.emit('endGame')
    }

    const goToNextQuestion = () => {
        socket?.emit('nextQuestion')
    }

    const submitAnswer = () => {
    }

    return {
        startGame,
        endGame,
        goToNextQuestion,
        submitAnswer
    }
}