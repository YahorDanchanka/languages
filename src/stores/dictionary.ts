import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { IDictionary, IDictionaryItem } from 'src/types/IDictionary'
import { fileExists, readFile, writeData } from 'src/services/FileService'

export const useDictionaryStore = defineStore('dictionary', () => {
  const dictionary = ref<IDictionary>([])
  const loading = ref(false)
  const storeName = computed(() => 'dictionary.json')

  /** Загружает словарь из файла */
  async function load() {
    loading.value = true
    const exists = await fileExists(storeName.value)

    if (!exists) {
      await writeData(storeName.value, [])
    }

    dictionary.value = await readFile(storeName.value)
    loading.value = false
  }

  /**
   * Сохраняет словарь в файл
   * Предупреждение: Сохраняет текущее состояние, что означает, что файл перезаписывается,
   * не сохраняя прежнего состояния
   */
  async function save() {
    loading.value = true
    await writeData(storeName.value, dictionary.value)
    loading.value = false
  }

  function addDictionaryItem(dictionaryItem: IDictionaryItem) {
    dictionary.value.push(dictionaryItem)
  }

  return {
    dictionary,
    load,
    save,
    addDictionaryItem,
  }
})
