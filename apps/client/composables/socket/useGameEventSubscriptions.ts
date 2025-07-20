import type { Socket } from "socket.io-client"
import { useGameStore } from "~/store/gameStore"

const gameStore = useGameStore()

export type GameSubscription = 'update' | 'init' | 'tick'

export const useGameEventSubscriptions = (socket: Socket) => {
    return {
        subscribe: (event: GameSubscription) => {
            switch (event) {
                case 'update':
                    return gameUpdates(socket)
                case 'init':
                    return gameInits(socket)
                case 'tick':
                    return gameTicks(socket)
                default:
                    throw new Error(`Invalid event: ${event}`)
            }

        }
    }
}


const gameUpdates = (socket: Socket) => {
    socket?.on('phaseUpdate', (data) => {
    })

    socket?.on('playerUpdate', (data) => {
    })

    socket?.on('hostActionsUpdate', (data) => {
    })

}

const gameInits = (socket: Socket) => {
    socket?.on('waitingInit', gameStore.handleWaitingInit)
    socket?.on('questionInit', (data) => {
    })
    socket?.on('cooldownInit', () => { })

    socket?.on('endInit', () => { })

    socket?.on('phaseUpdate', (data) => {
    })

    socket?.on('playerUpdate', (data) => {
    })

    socket?.on('hostConfirm', () => { })
}

const gameTicks = (socket: Socket) => {
    socket?.on('questionTick', (data) => {
    })
}

