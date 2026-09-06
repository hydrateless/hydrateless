<script setup lang="ts">
import { useId } from 'vue';
import type { Knob, KnobOption, KnobValues } from '../../data/types';

defineProps<{ knobs: Knob[]; values: KnobValues; disabled?: boolean }>();
const id = useId();
const emit = defineEmits<{ change: [string, string | boolean | number] }>();

function set(id: string, value: string | boolean | number) {
  emit('change', id, value);
}

function optionLabel(option: string | KnobOption): string {
  return typeof option === 'string' ? option : option.label;
}
function optionValue(option: string | KnobOption): string {
  return typeof option === 'string' ? option : option.value;
}
</script>

<template>
  <div class="hl-knobs">
    <label v-for="knob in knobs" :key="knob.id" class="hl-knob">
      <span :id="`${id}-${knob.id}`" class="hl-knob-label">{{ knob.label }}</span>

      <select
        v-if="knob.type === 'select'"
        class="hl-knob-select"
        :disabled="disabled"
        :aria-labelledby="`${id}-${knob.id}`"
        :value="values[knob.id]"
        @change="set(knob.id, ($event.target as HTMLSelectElement).value)"
      >
        <option
          v-for="opt in knob.options"
          :key="optionValue(opt)"
          :value="optionValue(opt)"
          :selected="optionValue(opt) === values[knob.id]"
        >
          {{ optionLabel(opt) }}
        </option>
      </select>

      <input
        v-else-if="knob.type === 'boolean'"
        type="checkbox"
        class="hl-knob-check"
        :disabled="disabled"
        :aria-labelledby="`${id}-${knob.id}`"
        :checked="Boolean(values[knob.id])"
        @change="set(knob.id, ($event.target as HTMLInputElement).checked)"
      />

      <input
        v-else-if="knob.type === 'text'"
        type="text"
        class="hl-knob-input"
        :disabled="disabled"
        :aria-labelledby="`${id}-${knob.id}`"
        :value="values[knob.id]"
        :placeholder="knob.placeholder"
        @input="set(knob.id, ($event.target as HTMLInputElement).value)"
      />

      <span v-else-if="knob.type === 'number'" class="hl-knob-range">
        <input
          type="range"
          :disabled="disabled"
          :aria-labelledby="`${id}-${knob.id}`"
          :min="knob.min"
          :max="knob.max"
          :step="knob.step"
          :value="Number(values[knob.id])"
          @input="set(knob.id, Number(($event.target as HTMLInputElement).value))"
        />
        <output>{{ values[knob.id] }}</output>
      </span>
    </label>
  </div>
</template>
