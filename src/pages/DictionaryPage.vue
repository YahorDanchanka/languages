<template>
  <q-page padding>
    <DictionaryTable class="q-mb-sm" :dictionary="dictionary" />
    <q-card>
      <q-card-section class="q-pb-none">
        <div class="text-h6">Добавить слово</div>
      </q-card-section>
      <q-card-section>
        <DictionaryAddForm @submit="onSubmit" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import DictionaryTable from 'components/dictionary/DictionaryTable.vue'
import DictionaryAddForm from 'components/dictionary/DictionaryAddForm.vue'
import { IDictionary, IDictionaryItem } from 'src/types/IDictionary'
import { useDictionaryStore } from 'stores/dictionary'

const dictionaryStore = useDictionaryStore()
dictionaryStore.load()

const dictionary = computed<IDictionary>(() => dictionaryStore.dictionary)

function onSubmit(dictionaryItem: IDictionaryItem) {
  dictionaryStore.addDictionaryItem(dictionaryItem)
  dictionaryStore.save()
}
</script>
