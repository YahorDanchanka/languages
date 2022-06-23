<template>
  <q-page padding>
    <q-table ref="table" title="История" :rows="histories" :columns="columns" />
  </q-page>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useHistoryStore } from 'stores/history'
import { QTable } from 'quasar'

const historyStore = useHistoryStore()
historyStore.load()

const table = ref<QTable>()

const columns = [
  {
    name: 'topic',
    field: 'topic',
    label: 'Тема',
    align: 'left',
    sortable: true,
  },
  {
    name: 'mode',
    field: 'mode',
    label: 'Вид теста',
    align: 'left',
    sortable: true,
    format: (mode: string) => {
      const modesOptions = [
        { label: 'Да и нет', componentName: 'TrueFalseMode' },
        { label: 'Письмо', componentName: 'InputMode' },
        { label: 'С вариантами ответа', componentName: 'OptionsMode' },
        {
          label: 'С множественными вариантами ответа',
          componentName: 'MultipleMode',
        },
        { label: 'Соответствие', componentName: 'MatchMode' },
        { label: 'Тасование', componentName: 'ShuffleMode' },
      ]

      return modesOptions.find(
        (modeOption) => modeOption.componentName === mode
      )?.label
    },
  },
  {
    name: 'correctAnswersNumber',
    field: 'correctAnswersNumber',
    label: 'Верных ответов',
    align: 'left',
    sortable: true,
  },
  {
    name: 'wrongAnswersNumber',
    field: 'wrongAnswersNumber',
    label: 'Неверных ответов',
    align: 'left',
    sortable: true,
  },
  {
    name: 'date',
    field: 'date',
    label: 'Дата',
    align: 'left',
    sortable: true,
    format: (date: string) => new Date(date).toLocaleString('ru-RU'),
    sortOrder: 'da',
  },
]

const histories = computed(() => historyStore.histories)

onMounted(() => {
  table.value?.sort('date')
})
</script>
