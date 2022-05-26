<template>
  <q-page padding>
    <q-select
      class="q-mb-sm"
      label="Тема"
      v-model="topicFilter"
      :options="topics"
      clearable
      outlined
      dense
    />
    <q-select
      class="q-mb-sm"
      label="Язык"
      option-value="code"
      v-model="languageFilter"
      :options="availableLanguages"
      clearable
      emit-value
      map-options
      outlined
      dense
    />
    <DictionaryTable
      class="q-mb-sm"
      :dictionary="dictionary"
      :topic="topicFilter"
      :language="languageFilter"
    />
    <q-card>
      <q-card-section class="q-pb-none">
        <div class="text-h6">Добавить слово</div>
      </q-card-section>
      <q-card-section>
        <DictionaryForm @submit="onSubmit" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import DictionaryTable from 'components/dictionary/DictionaryTable.vue'
import DictionaryForm from 'components/dictionary/DictionaryForm.vue'
import { IDictionary, IDictionaryItem } from 'src/types/IDictionary'
import { useDictionaryStore } from 'stores/dictionary'
import { useLanguagesStore } from 'stores/languages'
import { uniq } from 'lodash'

const languagesStore = useLanguagesStore()
const dictionaryStore = useDictionaryStore()
dictionaryStore.load()

const topicFilter = ref('')
const languageFilter = ref('')
const availableLanguages = languagesStore.languages

const dictionary = computed<IDictionary>(() => dictionaryStore.dictionary)
const topics = computed(() =>
  dictionary.value.reduce(
    (uniqueTopics: string[], dictionaryItem: IDictionaryItem) => {
      uniqueTopics.push(dictionaryItem.topic)
      return uniq(uniqueTopics)
    },
    []
  )
)

function onSubmit(dictionaryItem: IDictionaryItem) {
  dictionaryStore.addDictionaryItem(dictionaryItem)
  dictionaryStore.save()
}
</script>
