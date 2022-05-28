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
      <q-btn
        v-for="word in words"
        :key="word"
        @click="setAnswer(word)"
        color="primary"
        :flat="task.answer === undefined || task.answer !== word"
        :class="{
          'bg-red-6 text-white': task.isError && task.word !== word,
          'bg-green-6 text-white': task.isError && task.word === word,
        }"
      >
        {{ word }}
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { random, shuffle, slice, uniq, upperFirst } from 'lodash'
import { IOptionDictionaryItem } from 'src/types/IDictionary'

interface Props {
  modelValue: IOptionDictionaryItem
  words: string[]
}

const emit = defineEmits(['update:modelValue'])
const props = defineProps<Props>()

const task = ref<IOptionDictionaryItem>(props.modelValue)

/** Генерируем уникальный массив слов */
const words = computed(() => {
  let wordsList = [task.value.word]

  do {
    const itemsCount = props.words.length >= 4 ? 4 : props.words.length
    wordsList = [
      task.value.word,
      ...slice(shuffle(props.words), 0, itemsCount - 1),
    ]
  } while (wordsList.length !== uniq(wordsList).length)

  return shuffle(wordsList)
})

const translation = computed(() =>
  upperFirst(
    task.value.translations[random(task.value.translations.length - 1)]
  )
)

function setAnswer(word: string) {
  task.value.answer = word
}
</script>
