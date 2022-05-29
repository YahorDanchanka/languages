<template>
  <div>
    <div v-if="filters" class="filters">
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
    </div>
    <q-table
      row-key="id"
      separator="cell"
      :columns="columns"
      :rows="rows"
      :pagination="{ rowsPerPage: 15 }"
      :selection="selected ? 'multiple' : 'none'"
      :selected="selected"
      @update:selected="(newValue) => emit('update:selected', newValue)"
    >
      <template #header="props">
        <q-tr :props="props">
          <q-th v-if="selected">
            <q-checkbox v-model="props.selected" />
          </q-th>
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th v-if="editing" auto-width />
        </q-tr>
      </template>
      <template #body="props">
        <q-tr :props="props">
          <q-td v-if="selected">
            <q-checkbox v-model="props.selected" />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
          <q-td v-if="editing" auto-width>
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
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { IDictionary } from 'src/types/IDictionary'
import { useDictionaryStore } from 'stores/dictionary'
import { useLanguagesStore } from 'stores/languages'
import { getLanguages, getTopics } from 'src/services/DictionaryService'

const $q = useQuasar()
const languagesStore = useLanguagesStore()
const dictionaryStore = useDictionaryStore()
const emit = defineEmits(['update:selected'])
const props = defineProps<{
  dictionary: IDictionary
  selected?: IDictionary
  filters?: boolean
  editing?: boolean
}>()

const topicFilter = ref('')
const languageFilter = ref('')

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

  if (topicFilter.value && languageFilter.value) {
    return typedRows.filter(
      (row) =>
        row.topic === topicFilter.value &&
        row.languageCode === languageFilter.value
    )
  } else {
    if (topicFilter.value) {
      return typedRows.filter((row) => row.topic === topicFilter.value)
    }

    if (languageFilter.value) {
      return typedRows.filter(
        (row) => row.languageCode === languageFilter.value
      )
    }
  }

  return typedRows
})

const topics = computed(() => getTopics(props.dictionary))
const availableLanguages = computed(() =>
  languagesStore.map(getLanguages(props.dictionary))
)

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
