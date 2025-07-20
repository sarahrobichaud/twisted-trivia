<script setup lang="ts">

const { placeholder, modelValue, labelFor, type = 'text', name, fontSize = '16px' } = defineProps<{
    placeholder: string;
    modelValue: string;
    labelFor: string;
    type: string;
    name: string;
    fontSize: string;
}>()


const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
}

</script>

<template>
    <div class="flex flex-col text-white mx-5 md:mx-0 space-y-2 mb-2">
        <label :for="labelFor">
            {{ labelFor.toLocaleUpperCase() }}
        </label>
        <input :type="type" :name="name" @input="handleInput" :placeholder="placeholder" :value="modelValue"
            :style="{ fontSize: fontSize }"
            class="p-2 px-4 bg-white/5 border-neutral-border border-2 font-body focus:outline-brand-primary focus:outline-offset-2 focus:outline-2" />
    </div>
</template>