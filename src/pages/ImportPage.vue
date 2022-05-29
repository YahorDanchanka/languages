<template>
  <q-page padding>
    <q-form v-if="loadedDictionary.length === 0" @submit="onSubmit">
      <q-file
        class="q-mb-sm"
        label="Файл"
        v-model="uploadedFile"
        :rules="[
          (val: File) => (val) || 'Необходимо заполнить «Файл».',
          (val: File) => (val.type === 'application/json') || 'Разрешены только файлы с такими расширениями: json.',
        ]"
        hide-bottom-space
        outlined
        dense
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>
      <q-btn type="submit" class="full-width" color="primary"
        >Просмотреть</q-btn
      >
    </q-form>
    <template v-else>
      <DictionaryTable
        class="q-mb-sm"
        :dictionary="loadedDictionary"
        v-model:selected="selectedDictionary"
        filters
      />
      <q-btn
        class="full-width q-mb-md"
        color="primary"
        label="Импортировать"
        @click="importDictionary"
        :disable="selectedDictionary.length === 0"
      />
    </template>
  </q-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDictionaryStore } from 'stores/dictionary'
import { IDictionary } from 'src/types/IDictionary'
import DictionaryTable from 'components/dictionary/DictionaryTable.vue'

const router = useRouter()

const dictionaryStore = useDictionaryStore()

const uploadedFile = ref<File>()
const loadedDictionary = ref<IDictionary>([])
const selectedDictionary = ref<IDictionary>([])

function onSubmit() {
  if (!uploadedFile.value) return

  const reader = new FileReader()
  reader.readAsText(uploadedFile.value)

  reader.onload = function () {
    loadedDictionary.value =
      typeof reader.result === 'string' ? JSON.parse(reader.result) : []
  }
}

async function importDictionary() {
  dictionaryStore.importDictionary(selectedDictionary.value)
  await dictionaryStore.save()
  await router.push({ name: 'topics' })
}
</script>
