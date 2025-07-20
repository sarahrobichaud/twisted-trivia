<script setup lang="ts">
import Input from '~/components/ui/Input.vue';
import Button from '~/components/ui/Button.vue';
const roomCode = ref('');

const handleJoinRoom = () => {
    if (roomCode.value.length === 0) {
        return;
    }

    console.log(roomCode.value);
}

</script>
<template>
    <div class="flex flex-col items-center justify-center">
        <h1 class="text-heading-1 font-heading-1 mb-8">Join a Room</h1>
        <form class="flex flex-col gap-4" @submit.prevent="handleJoinRoom">
            <Input v-model="roomCode" labelFor="Room Code" name="roomCode" type="text" placeholder="Room Code"
                fontSize="32px" />
            <Button textContent="Join" />
        </form>
    </div>
</template>