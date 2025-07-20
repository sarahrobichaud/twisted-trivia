<script setup lang="ts">

const { text, to, external = false, variant = 'default' } = defineProps<{
    text: string;
    to: string;
    external?: boolean;
    variant?: 'default' | 'brand';
}>()

const classes = computed(() => {
    return {
        "bg-black hover:underline py-2 font-body-bold": true,
        "text-brand-primary hover:text-brand-primary/80": variant === 'brand',
        "text-default-font hover:text-default-font/80": variant === 'default'
    }
})


const target = computed(() => external ? '_blank' : '_self')
const rel = computed(() => external ? 'noopener noreferrer' : '')

</script>

<template>
    <NuxtLink v-if="!external" :class="classes" :to="to">
        {{ text }}
    </NuxtLink>
    <a v-else :class="classes" :href="to" :target="target" :rel="rel">
        {{ text }}
    </a>
</template>