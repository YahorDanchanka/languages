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
import { IDictionary, ILanguage } from 'src/types/IDictionary'
import { useDictionaryStore } from 'stores/dictionary'

const $q = useQuasar()
const dictionaryStore = useDictionaryStore()
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
