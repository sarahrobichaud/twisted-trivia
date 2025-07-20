<script setup lang="ts">
import { useSocket } from '~/composables/socket/useSocket';
import { useGameStore } from '~/store/gameStore';

const { gameID } = useRoute().params as { gameID: string };
const { code } = useRoute().query as { code: string };

const gameStore = useGameStore()

const socket = useSocket(gameID, code)

onMounted(async () => {

    if (!gameID || !code) {
        navigateTo('/')
    }

    await socket.connect()
})

onUnmounted(() => {
    socket.disconnect();
})

</script>
<template>
    <div v-if="gameStore.connected">
        <div>
            <h1>Room {{ gameStore.game.gameInfo.title }}</h1>
            <p>Join Code: {{ gameStore.game.gameInfo.joinCode }}</p>
        </div>
    </div>
    <div v-else>
        <p>Connecting to game...</p>
    </div>
</template>
