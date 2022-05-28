<template>
  <TrueFalseItem
    v-for="(task, i) in tasks"
    :key="task.word"
    v-model="tasks[i]"
    :translations="translations"
    class="q-mb-sm"
  />
  <q-btn
    v-show="!isFinished"
    :disable="isSubmitButtonDisabled"
    @click="onSubmit"
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
    <q-btn @click="emit('finish')" class="q-mb-md full-width" color="primary">
      Вернуться
    </q-btn>
  </template>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import TrueFalseItem from 'src/components/modes/TrueFalseItem.vue'
import {
  IAnswerDictionary,
  IAnswerDictionaryItem,
  IDictionary,
} from 'src/types/IDictionary'

interface Props {
  tasks: IAnswerDictionary
}

const emit = defineEmits(['finish'])
const props = defineProps<Props>()

const tasks = ref<IAnswerDictionary>(props.tasks)
const errors = ref<IDictionary>([])
const isFinished = ref(false)

const isSubmitButtonDisabled = computed(() =>
  tasks.value.some((task) => task.answer === undefined)
)

const translations = computed(() =>
  tasks.value.reduce((translationsList: string[], task) => {
    translationsList.push(...task.translations)
    return translationsList
  }, [])
)

const correctAnswersCount = computed(
  () => tasks.value.length - errors.value.length
)
const correctAnswersPercent = computed(
  () => 1 - errors.value.length / tasks.value.length
)

function onSubmit() {
  const errorsList: IDictionary = []

  tasks.value.forEach((task: IAnswerDictionaryItem) => {
    if (!task.translation || task.answer === undefined) return

    if (
      (task.translations.includes(task.translation) && !task.answer) ||
      (!task.translations.includes(task.translation) && task.answer)
    ) {
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
