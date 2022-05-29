import { cloneDeep, filter, find, findIndex, map, uniq } from 'lodash'
import { IDictionary } from 'src/types/IDictionary'

export const getLanguages = (dictionary: IDictionary) =>
  uniq(map(dictionary, 'languageCode'))

export const getTopics = (dictionary: IDictionary) =>
  uniq(map(dictionary, 'topic'))

export const findDictionaryItemById = (dictionary: IDictionary, id: string) =>
  find(dictionary, ['id', id])

export const importDictionary = (
  storage: IDictionary,
  dictionaryToImport: IDictionary
) => {
  storage = cloneDeep(storage)

  dictionaryToImport.forEach((dictionaryItemToImport) => {
    const duplicateIndex = findIndex(storage, ['id', dictionaryItemToImport.id])

    if (duplicateIndex !== -1) {
      storage[duplicateIndex] = dictionaryItemToImport
      return
    }

    storage.push(dictionaryItemToImport)
  })

  return storage
}

export const extractDictionaryByLanguage = (
  dictionary: IDictionary,
  languageCode: string
) => filter(dictionary, ['languageCode', languageCode])

export const extractDictionaryByTopic = (
  dictionary: IDictionary,
  topic: string
) => filter(dictionary, ['topic', topic])
