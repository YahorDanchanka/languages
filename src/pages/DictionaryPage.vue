<template>
  <q-page padding>
    <DictionaryTable class="q-mb-sm" :dictionary="dictionary" filters editing />
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
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { uniq } from 'lodash'
import { IDictionary, IDictionaryItem } from 'src/types/IDictionary'
import { useDictionaryStore } from 'stores/dictionary'
import DictionaryTable from 'components/dictionary/DictionaryTable.vue'
import DictionaryForm from 'components/dictionary/DictionaryForm.vue'

const $q = useQuasar()
const dictionaryStore = useDictionaryStore()
dictionaryStore.load()

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
  $q.notify({ type: 'positive', message: 'Слово добавлено', timeout: 500 })
}
</script>
