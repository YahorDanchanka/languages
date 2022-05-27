import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { IDictionary, IDictionaryItem } from 'src/types/IDictionary'
import { fileExists, readFile, writeData } from 'src/services/FileService'
import {
  extractDictionaryByTopic,
  findDictionaryItemById,
  getTopics,
} from 'src/services/DictionaryService'

export const useDictionaryStore = defineStore('dictionary', () => {
  const dictionary = ref<IDictionary>([])
  const loading = ref(false)

  const storeName = computed(() => 'dictionary.json')
  const topics = computed(() => getTopics(dictionary.value))

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

  function removeDictionaryItem(dictionaryItemId: string) {
    dictionary.value = dictionary.value.filter(
      (dictionaryItem: IDictionaryItem) =>
        dictionaryItem.id !== dictionaryItemId
    )
  }

  function updateDictionaryItem(dictionaryItemToUpdate: IDictionaryItem) {
    dictionary.value = dictionary.value.map((dictionaryItem: IDictionaryItem) =>
      dictionaryItem.id === dictionaryItemToUpdate.id
        ? dictionaryItemToUpdate
        : dictionaryItem
    )
  }

  return {
    dictionary,
    loading,
    topics,
    load,
    save,
    addDictionaryItem,
    removeDictionaryItem,
    updateDictionaryItem,
    findDictionaryItemById: (id: string) =>
      findDictionaryItemById(dictionary.value, id),
    extractDictionaryByTopic: (topic: string) =>
      extractDictionaryByTopic(dictionary.value, topic),
  }
})
