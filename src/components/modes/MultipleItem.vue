<template>
  <q-card>
    <q-card-section
      class="bg-primary text-white"
      :class="{
        'bg-red-6': task.isError === true,
        'bg-green-6': task.isError === false,
        'bg-primary': task.isError === undefined,
      }"
    >
      <div class="text-h6">{{ task.word }}</div>
    </q-card-section>

    <q-separator />

    <q-card-actions vertical>
      <q-btn
        v-for="translation in task.options"
        :key="translation"
        @click="setAnswer(translation)"
        color="primary"
        :flat="
          !Array.isArray(task.answers) || !task.answers.includes(translation)
        "
        :class="{
          'bg-red-6 text-white':
            task.isError && !task.translations.includes(translation),
          'bg-green-6 text-white':
            task.isError && task.translations.includes(translation),
        }"
      >
        {{ translation }}
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { random, shuffle } from 'lodash'
import { IMultipleDictionaryItem } from 'src/types/IDictionary'

interface Props {
  modelValue: IMultipleDictionaryItem
  translations: string[]
}

const props = defineProps<Props>()

const task = ref<IMultipleDictionaryItem>(props.modelValue)

/** Initial task.options */
const translationsList: string[] = []
const translationsLengthLimit =
  props.translations.length >= 4 ? 4 : props.translations.length

const rightTranslationsCount = random(1, translationsLengthLimit)

/** Добавляем в список правильные переводы */
for (let i = 0; i < rightTranslationsCount; i++) {
  if (
    typeof task.value.translations[i] !== 'undefined' &&
    translationsList.length < translationsLengthLimit
  ) {
    let randomRightTranslation

    do {
      randomRightTranslation =
        task.value.translations[random(task.value.translations.length - 1)]
    } while (translationsList.includes(randomRightTranslation))

    translationsList.push(randomRightTranslation)
  }
}

/** Добавляем в список случайные переводы */
for (let i = translationsList.length; i < translationsLengthLimit; i++) {
  let randomTranslation

  do {
    randomTranslation =
      props.translations[random(props.translations.length - 1)]
  } while (translationsList.includes(randomTranslation))

  translationsList.push(randomTranslation)
}

task.value.options = shuffle(translationsList)
/** /Initial task.options */

function setAnswer(translation: string) {
  if (!Array.isArray(task.value.answers)) task.value.answers = []

  if (!task.value.answers.includes(translation)) {
    task.value.answers.push(translation)
  } else {
    const i = task.value.answers.indexOf(translation)

    if (i > -1) {
      task.value.answers.splice(i, 1)
    }
  }
}
</script>
