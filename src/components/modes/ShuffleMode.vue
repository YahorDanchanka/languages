<template>
  <div class="shuffle">
    <q-banner class="bg-primary text-white q-mb-sm">
      <template v-slot:avatar>
        <q-icon name="priority_high" />
      </template>
      Расположите буквы таким образом, чтобы получилось слово
    </q-banner>
    <ShuffleItem
      v-for="(dictionaryItem, i) in dictionary"
      :key="dictionaryItem.id"
      :modelValue="dictionary[i]"
      @update:modelValue="(newValue) => (dictionary[i].letters = newValue)"
    />
    <q-btn
      class="q-mb-md full-width"
      color="primary"
      label="Завершить"
      @click="checkAnswers"
      v-show="!isFinished"
    />
    <template v-if="isFinished">
      <q-linear-progress
        stripe
        rounded
        size="20px"
        color="primary"
        class="q-mb-sm"
        :value="correctAnswersPercent"
      >
        <div
          class="absolute-full flex flex-center text-white"
          style="font-size: 14px"
        >
          {{ correctAnswersCount }} / {{ dictionary.length }}
        </div>
      </q-linear-progress>
      <q-btn @click="emit('finish')" class="q-mb-md full-width" color="primary">
        Вернуться
      </q-btn>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { shuffle } from 'lodash'
import {
  IDictionary,
  IShuffleDictionaryItem,
  IShuffleDictionary,
} from 'src/types/IDictionary'
import ShuffleItem from 'components/modes/ShuffleItem.vue'

const props = defineProps<{ tasks: IDictionary }>()
const emit = defineEmits(['finish'])

const dictionary = ref<IShuffleDictionary>(props.tasks)
const errors = ref<IDictionary>([])
const isFinished = ref(false)

dictionary.value.forEach(
  (dictionaryItem) =>
    (dictionaryItem.letters = shuffle(dictionaryItem.word.split('')))
)

const correctAnswersCount = computed(
  () => dictionary.value.length - errors.value.length
)

const correctAnswersPercent = computed(
  () => 1 - errors.value.length / dictionary.value.length
)

function checkAnswers() {
  const errorsList: IDictionary = []

  dictionary.value.forEach((dictionaryItem: IShuffleDictionaryItem) => {
    const wordResult = dictionaryItem.letters?.join('').trim().toLowerCase()
    const isRight =
      wordResult && wordResult === dictionaryItem.word.trim().toLowerCase()

    if (!isRight) {
      dictionaryItem.isError = true
      errorsList.push(dictionaryItem)
      return
    }

    dictionaryItem.isError = false
  })

  errors.value = errorsList
  isFinished.value = true
}
</script>
