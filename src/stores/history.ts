import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { IHistories, IHistory } from 'src/types/IHistory'
import { fileExists, readFile, writeData } from 'src/services/FileService'

export const useHistoryStore = defineStore('history', () => {
  const histories = ref<IHistories>([])
  const loading = ref(false)

  const storeName = computed(() => 'history.json')

  async function load() {
    loading.value = true
    const exists = await fileExists(storeName.value)

    if (!exists) {
      await writeData(storeName.value, [])
    }

    histories.value = await readFile(storeName.value)
    loading.value = false
  }

  async function save() {
    loading.value = true
    await writeData(storeName.value, histories.value)
    loading.value = false
  }

  function addHistory(history: IHistory) {
    histories.value.push(history)
  }

  return {
    histories,
    loading,
    load,
    save,
    addHistory,
  }
})
