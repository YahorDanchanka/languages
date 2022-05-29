<template>
  <q-page padding>
    <DictionaryTable
      class="q-mb-sm"
      v-model:selected="selectedTests"
      :dictionary="dictionary"
      filters
    />
    <q-form @submit="onSubmit">
      <q-input
        class="q-mb-sm"
        label="Название файла"
        v-model="filename"
        :rules="[
          (val) =>
            (val && val.length > 0) || 'Необходимо заполнить «Название файла».',
          (val) =>
            /^[a-zа-я0-9]+$/i.test(val) ||
            '«Название файла» может содержать только буквы и цифры.',
        ]"
        hide-bottom-space
        outlined
        dense
      />
      <q-btn
        type="submit"
        class="q-mb-md full-width"
        color="primary"
        label="Экспортировать"
        :disable="selectedTests.length === 0"
      />
    </q-form>
  </q-page>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useDictionaryStore } from 'stores/dictionary'
import { IDictionary } from 'src/types/IDictionary'
import DictionaryTable from 'components/dictionary/DictionaryTable.vue'
import { writeData } from 'src/services/FileService'

const dictionaryStore = useDictionaryStore()
dictionaryStore.load()

const selectedTests = ref<IDictionary>([])
const filename = ref('')

const dictionary = computed<IDictionary>(() => dictionaryStore.dictionary)

async function onSubmit() {
  try {
    await writeData(`${filename.value}.json`, selectedTests.value)
    alert('Файл успешно сохранен в папке «Документы».')
  } catch (error) {}
}
</script>
