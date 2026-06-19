<script setup lang="ts">
import type { Knob, KnobOption, KnobValues } from '../../data/types';

defineProps<{ knobs: Knob[]; values: KnobValues }>();
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
      <span class="hl-knob-label">{{ knob.label }}</span>

      <select
        v-if="knob.type === 'select'"
        class="hl-knob-select"
        :value="values[knob.id]"
        @change="set(knob.id, ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="opt in knob.options" :key="optionValue(opt)" :value="optionValue(opt)">
          {{ optionLabel(opt) }}
        </option>
      </select>

      <input
        v-else-if="knob.type === 'boolean'"
        type="checkbox"
        class="hl-knob-check"
        :checked="Boolean(values[knob.id])"
        @change="set(knob.id, ($event.target as HTMLInputElement).checked)"
      />

      <input
        v-else-if="knob.type === 'text'"
        type="text"
        class="hl-knob-input"
        :value="values[knob.id]"
        :placeholder="knob.placeholder"
        @input="set(knob.id, ($event.target as HTMLInputElement).value)"
      />

      <span v-else-if="knob.type === 'number'" class="hl-knob-range">
        <input
          type="range"
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
