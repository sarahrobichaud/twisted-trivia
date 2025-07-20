<script setup lang="ts">
import type { QuizDetail } from '~/types/quiz';
import Link from './ui/Link.vue';
import Button from './ui/Button.vue';


const props = defineProps<{
    quiz: QuizDetail
}>()

const emit = defineEmits<{
    (e: 'createRoom', quizID: string): void
}>()

</script>

<template>
    <div class="bg-black border-neutral-border border shadow-md rounded-lg p-4">
        <h2 class="text-2xl font-heading-3 font-bold mb-4">{{ quiz.title }}</h2>
        <p class="text-caption text-subtext-color mb-4">{{ quiz.description }}</p>
        <div class="flex justify-between items-center">
            <p class="font-caption-bold">{{ quiz.questionCount }} questions</p>
            <Button @click="emit('createRoom', quiz.id)" textContent="Create a Room" />
        </div>
    </div>
</template>