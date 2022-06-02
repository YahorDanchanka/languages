<template>
  <div class="matchMode">
    <q-banner v-show="!isFinished" class="bg-primary text-white q-mb-sm">
      <template v-slot:avatar>
        <q-icon name="priority_high" />
      </template>
      Расположите слова и переводы в правильном порядке
    </q-banner>
    <div class="row q-gutter-md q-mb-sm">
      <div class="col">
        <span v-show="!isFinished">Слова:</span>
        <draggable
          item-key="id"
          v-model="dictionary"
          :component-data="{
            class: 'q-list q-list--separator q-list--bordered',
          }"
        >
          <template #item="{ element }">
            <q-item
              :class="{
                'bg-red-6': element.isError === true,
                'bg-green-6': element.isError === false,
                'text-white': element.isError || element.isError === false,
              }"
            >
              <q-item-section>
                {{ upperFirst(element.word) }}
                <q-item-label class="text-white" v-if="element.isError" caption>
                  <q-icon name="close" />
                  {{ upperFirst(element.answer) }}
                  <q-icon name="done" />
                  {{ upperFirst(element.rightAnswer) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </draggable>
      </div>
      <div v-show="!isFinished" class="col">
        Переводы:
        <draggable
          item-key="id"
          v-model="translations"
          :component-data="{
            class: 'q-list q-list--separator q-list--bordered',
          }"
        >
          <template #item="{ element }">
            <q-item>
              <q-item-section>
                {{ upperFirst(element) }}
              </q-item-section>
            </q-item>
          </template>
        </draggable>
      </div>
    </div>
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
import { map, sample, shuffle, find, upperFirst } from 'lodash'
import {
  IDictionary,
  IMatchDictionaryItem,
  IMatchDictionary,
} from 'src/types/IDictionary'
import draggable from 'vuedraggable'

const props = defineProps<{ tasks: IDictionary }>()
const emit = defineEmits(['finish'])

const dictionary = ref<IMatchDictionary>(shuffle(props.tasks))
const translations = ref(
  shuffle(
    map(
      props.tasks,
      (dictionaryItem) => <string>sample(dictionaryItem.translations)
    )
  )
)
const errors = ref<IDictionary>([])
const isFinished = ref(false)

const correctAnswersCount = computed(
  () => dictionary.value.length - errors.value.length
)
const correctAnswersPercent = computed(
  () => 1 - errors.value.length / dictionary.value.length
)

function checkAnswers() {
  const errorsList: IDictionary = []

  dictionary.value.forEach((dictionaryItem: IMatchDictionaryItem, i) => {
    const translation = translations.value[i]

    if (!dictionaryItem.translations.includes(translation)) {
      dictionaryItem.isError = true
      dictionaryItem.answer = translation
      dictionaryItem.rightAnswer = find(
        translations.value,
        (searchedTranslation) =>
          dictionaryItem.translations.includes(searchedTranslation)
      )
      errorsList.push(dictionaryItem)
      return
    }

    dictionaryItem.isError = false
  })

  errors.value = errorsList
  isFinished.value = true
}
</script>
