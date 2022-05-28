<template>
  <OptionItem
    v-for="(task, i) in tasks"
    :key="task.word"
    v-model="tasks[i]"
    :words="words"
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
    <q-btn @click="emit('finish')" class="q-mb-md full-width" color="primary">
      Вернуться на главную
    </q-btn>
  </template>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import OptionItem from 'components/modes/OptionItem.vue'
import {
  IDictionaryItem,
  IOptionDictionary,
  IOptionDictionaryItem,
} from 'src/types/IDictionary'

interface Props {
  tasks: IOptionDictionary
}

const emit = defineEmits(['finish'])
const props = defineProps<Props>()

const tasks = ref<IOptionDictionary>(props.tasks)
const errors = ref<IDictionaryItem[]>([])
const isFinished = ref(false)

const words = computed(() => {
  const wordsList: string[] = []

  tasks.value.forEach((task: IOptionDictionaryItem) => {
    wordsList.push(task.word)
  })

  return wordsList
})

const isSubmitButtonDisabled = computed(() =>
  tasks.value.some((task) => task.answer === undefined)
)

const correctAnswersCount = computed(
  () => tasks.value.length - errors.value.length
)

const correctAnswersPercent = computed(
  () => 1 - errors.value.length / tasks.value.length
)

function onSubmit() {
  const errorsList: IDictionaryItem[] = []

  tasks.value.forEach((task: IOptionDictionaryItem) => {
    if (task.answer === undefined) return

    if (task.answer !== task.word) {
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
