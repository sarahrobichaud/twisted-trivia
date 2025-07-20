<script setup lang="ts">

const props = defineProps<{
    textContent: string;
}>()

const emit = defineEmits<{
    (e: 'click'): void
}>()

</script>

<template>
    <button
        class="bg-black border hover:bg-white/5 hover:cursor-pointer border-brand-primary rounded-md px-4 py-2 text-brand-primary font-body-bold"
        @click="emit('click')">
        {{ textContent }}
    </button>
</template>