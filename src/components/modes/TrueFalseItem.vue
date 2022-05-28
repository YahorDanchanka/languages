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
      <div class="text-h6">{{ task.word }}</div>
      <div class="text-subtitle2">{{ task.translation }}</div>
    </q-card-section>

    <q-separator />

    <q-card-actions vertical>
      <q-btn-group spread>
        <q-btn
          @click="setAnswer(true)"
          color="primary"
          :flat="task.answer === undefined || task.answer === false"
        >
          Да
        </q-btn>
        <q-btn
          @click="setAnswer(false)"
          color="primary"
          :flat="task.answer === undefined || task.answer === true"
        >
          Нет
        </q-btn>
      </q-btn-group>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { random } from 'lodash'
import { IAnswerDictionaryItem } from 'src/types/IDictionary'

interface Props {
  modelValue: IAnswerDictionaryItem
  translations: string[]
}

const emit = defineEmits(['update:modelValue'])
const props = defineProps<Props>()

const task = ref<IAnswerDictionaryItem>(props.modelValue)

/** Задаём вопрос (перевод) */
if (Math.random() <= 0.4) {
  task.value.translation =
    task.value.translations[random(task.value.translations.length - 1)]
} else {
  task.value.translation =
    props.translations[random(props.translations.length - 1)]
}

function setAnswer(answer: boolean) {
  task.value.answer = answer
  emit('update:modelValue', task.value)
}
</script>
