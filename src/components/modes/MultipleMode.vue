<template>
  <MultipleItem
    v-for="(task, i) in tasks"
    :key="task.word"
    v-model="tasks[i]"
    :translations="translations"
    class="q-mb-sm"
  />
  <q-btn
    v-show="!isFinished"
    @click="onSubmit"
    :disable="isSubmitButtonDisabled"
    class="q-mb-md full-width"
    color="primary"
  >
    Завершить
  </q-btn>
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
        {{ correctAnswersCount }} / {{ tasks.length }}
      </div>
    </q-linear-progress>
    <q-btn
      @click="emit('finish', correctAnswersCount, tasks.length)"
      class="q-mb-md full-width"
      color="primary"
    >
      Вернуться на главную
    </q-btn>
  </template>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { shuffle } from 'lodash'
import MultipleItem from 'src/components/modes/MultipleItem.vue'
import {
  IDictionary,
  IMultipleDictionary,
  IMultipleDictionaryItem,
} from 'src/types/IDictionary'

interface Props {
  tasks: IMultipleDictionary
}

const emit = defineEmits(['finish'])
const props = defineProps<Props>()

const tasks = ref<IMultipleDictionary>(shuffle(props.tasks))
const errors = ref<IDictionary>([])
const isFinished = ref(false)

const translations = computed(() => {
  const translationsList: string[] = []

  tasks.value.forEach((task: IMultipleDictionaryItem) => {
    translationsList.push(...task.translations)
  })

  return translationsList
})

const isSubmitButtonDisabled = computed(() =>
  tasks.value.some(
    (task: IMultipleDictionaryItem) =>
      !Array.isArray(task.answers) || !task.answers.length
  )
)

const correctAnswersCount = computed(
  () => tasks.value.length - errors.value.length
)

const correctAnswersPercent = computed(
  () => 1 - errors.value.length / tasks.value.length
)

function onSubmit() {
  const errorsList: IDictionary = []

  tasks.value.forEach((task: IMultipleDictionaryItem) => {
    if (!Array.isArray(task.answers) || !Array.isArray(task.options)) return

    const rightOptions = task.options.reduce(
      (optionsList: string[], optionItem: string) => {
        if (task.translations.includes(optionItem)) {
          optionsList.push(optionItem)
        }

        return optionsList
      },
      []
    )

    const isErrorTask =
      rightOptions.length === task.answers.length &&
      task.answers.every((translationAnswer) =>
        rightOptions.includes(translationAnswer)
      )

    if (!isErrorTask) {
      task.isError = true
      errorsList.push(task)
      return
    }

    task.isError = false
  })

  errors.value = errorsList
  isFinished.value = true
}
</script>
