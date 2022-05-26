<template>
  <q-table
    row-key="id"
    separator="cell"
    :columns="columns"
    :rows="rows"
    :pagination="{ rowsPerPage: 15 }"
  >
    <template #header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
        <q-th auto-width />
      </q-tr>
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
        <q-td auto-width>
          <q-btn-group push>
            <q-btn
              :to="{ name: 'dictionaryEdit', params: { id: props.row.id } }"
              color="primary"
              icon="edit"
              size="md"
              dense
              push
            />
            <q-btn
              @click="deleteDictionaryItem(props.row.id)"
              color="primary"
              icon="delete"
              size="md"
              dense
              push
            />
          </q-btn-group>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { IDictionary } from 'src/types/IDictionary'
import { useDictionaryStore } from 'stores/dictionary'
import { useLanguagesStore } from 'stores/languages'

const $q = useQuasar()
const languagesStore = useLanguagesStore()
const dictionaryStore = useDictionaryStore()
const props = defineProps<{
  dictionary: IDictionary
  topic?: string
  language?: string
}>()

const columns = [
  {
    name: 'word',
    field: 'word',
    label: 'Слово',
    align: 'left',
    sortable: true,
  },
  {
    name: 'translations',
    field: 'translations',
    label: 'Переводы',
    align: 'left',
    format: (val: string[]) => val.join(', '),
    sortable: true,
  },
  {
    name: 'topic',
    field: 'topic',
    label: 'Тема',
    align: 'left',
    sortable: true,
  },
  {
    name: 'language',
    field: 'languageCode',
    label: 'Язык',
    align: 'left',
    format: (languageCode: string) =>
      languagesStore.findLanguageByCode(languageCode)?.label,
    sortable: true,
    sort: (languageCodeA: string, languageCodeB: string) => {
      const languageALabel =
        languagesStore.findLanguageByCode(languageCodeA)?.label
      const languageBLabel =
        languagesStore.findLanguageByCode(languageCodeB)?.label

      if (languageALabel && languageBLabel) {
        if (languageALabel < languageBLabel) return -1
        if (languageALabel > languageBLabel) return 1
      }

      return 0
    },
  },
]

const rows = computed(() => {
  const typedRows: IDictionary = JSON.parse(JSON.stringify(props.dictionary))

  if (props.topic && props.language) {
    return typedRows.filter(
      (row) => row.topic === props.topic && row.languageCode === props.language
    )
  } else {
    if (props.topic) {
      return typedRows.filter((row) => row.topic === props.topic)
    }

    if (props.language) {
      return typedRows.filter((row) => row.languageCode === props.language)
    }
  }

  return typedRows
})

function deleteDictionaryItem(dictionaryItemId: string) {
  $q.dialog({
    title: 'Подтверждение',
    message: 'Вы точно хотите удалить запись?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    dictionaryStore.removeDictionaryItem(dictionaryItemId)
    dictionaryStore.save()
  })
}
</script>
