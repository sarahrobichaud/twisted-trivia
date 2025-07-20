<script setup lang="ts">
const { fetchQuizzes, createAndConnectToGame } = await useQuizApi();

const quizzes = await fetchQuizzes();

const handleCreateRoom = async (quizID: string) => {
    const connection = await createAndConnectToGame(quizID, 'test');

    const { gameID, accessToken } = connection.data;

    if (connection.success) {
        navigateTo(`/room/${gameID}?code=${accessToken}`);
    }
}

</script>
<template>
    <h1 class="text-heading-2 font-heading-2 mb-8 text-brand-primary">Available Quizzes</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4" v-if="quizzes?.success">
        <QuizCard @create-room="handleCreateRoom" v-for="quiz in quizzes.data" :key="quiz.id" :quiz="quiz" />
    </div>
    <div v-else>
        <p>Error: {{ quizzes?.message }}</p>
    </div>
</template>