<script setup lang="ts">
type SelectValue = string | number

defineProps<{
  options: Array<{ label: string; value: SelectValue }>
  variant?: 'filter' | 'form'
}>()

const [model, modifiers] = defineModel<SelectValue>({ required: true })

function updateValue(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  model.value = modifiers.number ? Number(value) : value
}
</script>

<template>
  <select :value="model" :class="variant === 'form' ? 'form-select' : 'filter-select'" @change="updateValue">
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>
