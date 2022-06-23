<template>
  <q-page padding>
    <q-stepper
      v-show="!submitted"
      v-model="step"
      color="primary"
      :animated="!submitted"
      vertical
    >
      <q-step :name="1" :title="languageStepTitle" icon="edit">
        <q-select
          v-model="language"
          :options="languagesOptions"
          label="Язык"
          option-value="code"
          emit-value
          map-options
          outlined
          dense
        />
      </q-step>
      <q-step
        :name="2"
        title="Выбрать режим"
        icon="settings"
        active-icon="settings"
      >
        <q-select
          v-model="mode"
          :options="modesOptions"
          class="q-mb-sm"
          label="Режим"
          option-value="componentName"
          outlined
          dense
          emit-value
          map-options
        />
        <q-btn-group push spread>
          <q-btn
            @click="onSubmit"
            :disable="isSubmitButtonDisabled"
            color="primary"
            push
          >
            Подтвердить
          </q-btn>
          <q-btn @click="goBack" color="primary" push>Вернуться</q-btn>
        </q-btn-group>
      </q-step>
    </q-stepper>
    <component
      @finish="onFinish"
      v-if="submitted && dictionaryOfLanguage.length > 0"
      :is="components[mode]"
      :tasks="dictionaryOfLanguage"
    />
  </q-page>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { IDictionary } from 'src/types/IDictionary'
import { useDictionaryStore } from 'stores/dictionary'
import { useLanguagesStore } from 'stores/languages'
import { useHistoryStore } from 'stores/history'
import {
  extractDictionaryByLanguage,
  getLanguages,
} from 'src/services/DictionaryService'
import { removeReactivity } from 'src/helpers'
import TrueFalseMode from 'components/modes/TrueFalseMode.vue'
import InputMode from 'components/modes/InputMode.vue'
import OptionsMode from 'components/modes/OptionsMode.vue'
import MultipleMode from 'components/modes/MultipleMode.vue'
import MatchMode from 'components/modes/MatchMode.vue'
import ShuffleMode from 'components/modes/ShuffleMode.vue'

const route = useRoute()
const languagesStore = useLanguagesStore()
const dictionaryStore = useDictionaryStore()
const historyStore = useHistoryStore()

const components = {
  TrueFalseMode,
  InputMode,
  OptionsMode,
  MultipleMode,
  MatchMode,
  ShuffleMode,
}

const dictionaryOfTopic = ref<IDictionary>([])
const step = ref(1)
const language = ref('')
const mode = ref('')
const submitted = ref(false)

const languageStepTitle = computed(() => {
  let title = 'Выбрать язык'

  if (language.value) {
    title += ` (${language.value})`
  }

  return title
})

/** Возвращает список доступных языков для теста */
const languagesOptions = computed(() =>
  languagesStore.map(getLanguages(dictionaryOfTopic.value))
)

/** Возвращает список доступных режимов для запуска теста */
const modesOptions = [
  { label: 'Да и нет', componentName: 'TrueFalseMode' },
  { label: 'Письмо', componentName: 'InputMode' },
  { label: 'С вариантами ответа', componentName: 'OptionsMode' },
  {
    label: 'С множественными вариантами ответа',
    componentName: 'MultipleMode',
  },
  { label: 'Соответствие', componentName: 'MatchMode' },
  { label: 'Тасование', componentName: 'ShuffleMode' },
]

const dictionaryOfLanguage = computed<IDictionary>(() =>
  extractDictionaryByLanguage(dictionaryOfTopic.value, language.value)
)

/** Возвращает состояние кнопки: включена или выключена */
const isSubmitButtonDisabled = computed<boolean>(() => {
  return !(
    dictionaryOfLanguage.value.length > 0 &&
    Boolean(language.value) &&
    Boolean(mode.value)
  )
})

/** Возвращает на первый шаг */
function goBack() {
  language.value = ''
  step.value = 1
}

function onSubmit() {
  step.value = 3
  submitted.value = true
}

async function onFinish(correctAnswersNumber: number, total: number) {
  /** Запись истории */
  await historyStore.load()
  historyStore.addHistory({
    correctAnswersNumber,
    wrongAnswersNumber: total - correctAnswersNumber,
    date: new Date(),
    mode: mode.value,
    topic: dictionaryOfTopic.value[0].topic,
  })
  await historyStore.save()

  goBack()
  submitted.value = false
  dictionaryOfTopic.value = removeReactivity(
    dictionaryStore.extractDictionaryByTopic(<string>route.params.id)
  )
}

/** Переходит на второй шаг, если выбран язык */
watch(language, (val) => {
  if (val) step.value = 2
})

watch(
  () => route.params.id,
  async () => {
    await dictionaryStore.load()
    dictionaryOfTopic.value = removeReactivity(
      dictionaryStore.extractDictionaryByTopic(<string>route.params.id)
    )
  },
  { immediate: true }
)
</script>
