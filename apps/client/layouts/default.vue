<script setup lang="ts">
import Link from '~/components/ui/Link.vue';

</script>

<template>
    <div class="bg-default-background min-h-screen text-default-font">
        <div class="bg-brand-primary">
            <div class="wrapper py-2 text-black font-caption-bold text-caption-bold flex justify-between items-center">
                <p>SyncedFocus.com</p>
                <p>Blah blah blah</p>
            </div>
        </div>
        <header class="border-b border-neutral-border/50">
            <div class="wrapper py-4">
                <div class="flex items-center justify-between">
                    <NuxtLink to="/" class="text-4xl font-heading-1 text-heading-1">SFQuizzes</NuxtLink>
                    <ul class="flex items-center gap-4 font-body">
                        <li>
                            <Link to="/" text="Quiz List" />
                        </li>
                        <li>
                            <Link to="/join" text="Join with Code" variant="brand" />
                        </li>
                    </ul>
                </div>
            </div>
        </header>
        <main class="wrapper">
            <slot />
        </main>
        <footer class="wrapper flex justify-center">
            <p>By
                <Link variant="brand" to="https://github.com/sarahrobichaud" target="_blank"
                    text="github.com/sarahrobichaud" />
            </p>
        </footer>
    </div>
</template>