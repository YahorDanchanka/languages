<template>
  <q-form @submit="onSubmit">
    <q-input
      class="q-mb-sm"
      label="Слово"
      v-model.trim="word"
      :rules="wordRules"
      hide-bottom-space
      outlined
      dense
    />
    <q-input
      class="q-mb-sm"
      label="Переводы"
      hint="Через запятую"
      v-model.trim="translations"
      :rules="translationsRules"
      hide-bottom-space
      outlined
      dense
    />
    <q-select
      class="q-mb-sm"
      label="Язык"
      option-value="code"
      v-model="language"
      :options="availableLanguages"
      :rules="languageRules"
      emit-value
      map-options
      outlined
      dense
      hide-bottom-space
    />
    <q-input
      class="q-mb-sm"
      label="Тема"
      v-model.trim="topic"
      :rules="topicRules"
      hide-bottom-space
      outlined
      dense
    />
    <q-btn
      v-if="dictionaryItem"
      type="submit"
      class="full-width"
      color="primary"
      icon="done"
      label="Сохранить"
    />
    <q-btn
      v-else
      type="submit"
      class="full-width"
      color="primary"
      icon="add"
      label="Добавить"
    />
  </q-form>
</template>

<script lang="ts" setup>
import { computed, defineProps, ref } from 'vue'
import { uid } from 'quasar'
import { useLanguagesStore } from 'stores/languages'
import { IDictionaryItem } from 'src/types/IDictionary'

const languagesStore = useLanguagesStore()
const props = defineProps<{ dictionaryItem?: IDictionaryItem }>()
const emit = defineEmits(['submit'])

const word = ref(props.dictionaryItem?.word || '')
const translations = ref(props.dictionaryItem?.translations.join(', ') || '')
const language = ref(props.dictionaryItem?.languageCode || '')
const topic = ref(props.dictionaryItem?.topic || '')
const availableLanguages = languagesStore.languages

const wordRules = computed(() => [
  (val: string) => (val && val.length > 0) || 'Необходимо заполнить «Слово».',
])

const translationsRules = computed(() => [
  (val: string) =>
    (val && val.length > 0) || 'Необходимо заполнить «Переводы».',
])

const languageRules = computed(() => [
  (val: string) => (val && val.length > 0) || 'Необходимо заполнить «Язык».',
])

const topicRules = computed(() => [
  (val: string) => (val && val.length > 0) || 'Необходимо заполнить «Тема».',
])

function onSubmit() {
  const foundLanguage = languagesStore.findLanguageByCode(language.value)

  if (!foundLanguage) {
    alert('Выбранный язык не найден.')
    return
  }

  const dictionaryItem: IDictionaryItem = {
    id: props.dictionaryItem?.id || uid(),
    languageCode: foundLanguage.code,
    topic: topic.value,
    word: word.value,
    translations: translations.value
      .split(',')
      .map((translation) => translation.trim()),
  }

  emit('submit', dictionaryItem)
}
</script>
