<template>
  <q-card>
    <q-card-section
      class="text-white"
      :class="{
        'bg-red-6': task.isError === true,
        'bg-green-6': task.isError === false,
        'bg-primary': task.isError === undefined,
      }"
    >
      <div class="text-h6">{{ translation }}</div>
    </q-card-section>

    <q-separator />

    <q-card-actions vertical>
      <q-input
        v-model="task.answer"
        label="Слово"
        :rules="[
          (val) => (val && val.length > 0) || 'Необходимо заполнить «Слово».',
        ]"
        hide-bottom-space
        outlined
        dense
      />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { random, upperFirst } from 'lodash'
import { IInputDictionaryItem } from 'src/types/IDictionary'

interface Props {
  modelValue: IInputDictionaryItem
}

const emit = defineEmits(['update:modelValue'])
const props = defineProps<Props>()

const task = ref<IInputDictionaryItem>(props.modelValue)

const translation = computed(() =>
  upperFirst(
    task.value.translations[random(task.value.translations.length - 1)]
  )
)

watch(task, () => emit('update:modelValue', task.value))
</script>
