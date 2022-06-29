<template>
  <q-form @submit="onSubmit">
    <InputItem
      v-for="(task, i) in tasks"
      :key="task.word"
      v-model="tasks[i]"
      class="q-mb-sm"
    />
    <q-btn
      v-show="!isFinished"
      type="submit"
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
  </q-form>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { shuffle } from 'lodash'
import InputItem from 'src/components/modes/InputItem.vue'
import {
  IDictionary,
  IInputDictionary,
  IInputDictionaryItem,
} from 'src/types/IDictionary'

interface Props {
  tasks: IInputDictionary
}

const emit = defineEmits(['finish'])
const props = defineProps<Props>()

const tasks = ref<IInputDictionary>(shuffle(props.tasks))
const errors = ref<IDictionary>([])
const isFinished = ref(false)

const correctAnswersCount = computed(
  () => tasks.value.length - errors.value.length
)
const correctAnswersPercent = computed(
  () => 1 - errors.value.length / tasks.value.length
)

function onSubmit() {
  if (isFinished.value) return

  const errorsList: IDictionary = []

  tasks.value.forEach((task: IInputDictionaryItem) => {
    if (task.answer === undefined) return

    if (task.answer.toLowerCase().trim() !== task.word.toLowerCase().trim()) {
      task.isError = true
      task.answer = `${task.answer} ≠ ${task.word}`
      errorsList.push(task)
      return
    }

    task.isError = false
  })

  errors.value = errorsList
  isFinished.value = true
}
</script>
