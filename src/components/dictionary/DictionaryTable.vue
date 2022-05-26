<template>
  <q-table
    row-key="id"
    separator="cell"
    :columns="columns"
    :rows="rows"
    :pagination="{ rowsPerPage: 15 }"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { IDictionary, ILanguage } from 'src/types/IDictionary'

const props = defineProps<{ dictionary: IDictionary }>()

const columns = [
  { name: 'word', field: 'word', label: 'Слово', align: 'left' },
  {
    name: 'translations',
    field: 'translations',
    label: 'Переводы',
    align: 'left',
    format: (val: string[]) => val.join(', '),
  },
  {
    name: 'topic',
    field: 'topic',
    label: 'Тема',
    align: 'left',
  },
  {
    name: 'language',
    field: 'language',
    label: 'Язык',
    align: 'left',
    format: (val: ILanguage) => val.label,
  },
]

const rows = computed(() => JSON.parse(JSON.stringify(props.dictionary)))
</script>
