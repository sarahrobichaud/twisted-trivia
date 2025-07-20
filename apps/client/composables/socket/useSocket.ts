import { io, Socket } from 'socket.io-client'
import { useGameStore } from '~/store/gameStore'
import { useGameEventSubscriptions } from './useGameEventSubscriptions'

const gameStore = useGameStore()

interface QuizSocket {
    connect: () => void
    disconnect: () => void
}

let socket: Socket | null = null

export const useSocket = (gameID: string, playerCode: string) => {

    const url = 'http://localhost:3000/socket/game'

    const options = {
        path: '/trivia-app',
        auth: {
            gameId: gameID,
            code: playerCode,
        },
    }


    const connect = async () => {
        console.log('connecting to socket')

        await new Promise(resolve => setTimeout(resolve, 1000))

        socket = io(url, options);
        const gameSubscriptions = useGameEventSubscriptions(socket)


        setupSystemSubscriptions()

        gameSubscriptions.subscribe('init')
        gameSubscriptions.subscribe('update')
        gameSubscriptions.subscribe('tick')
    }

    const setupSystemSubscriptions = () => {

        if (!socket) {
            throw new Error('Socket not connected, cannot setup system subscriptions')
        }

        socket?.on('connect', () => {
            console.log('connected to socket')
            gameStore.setConnected(true)
        })

        socket?.on('connect_error', async (err) => {
            alert(`There was a connection error! ERROR: ${err.message}`)
        })

        socket?.on('disconnect', () => {
            console.log('disconnected from socket')
            gameStore.setConnected(false)
            socket = null;
        })
    }

    const disconnect = () => {
        socket?.disconnect()
    }

    return {
        connect,
        disconnect
    }
}