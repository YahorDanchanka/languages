import { filter, find, map, uniq } from 'lodash'
import { IDictionary } from 'src/types/IDictionary'

export const getLanguages = (dictionary: IDictionary) =>
  uniq(map(dictionary, 'languageCode'))

export const getTopics = (dictionary: IDictionary) =>
  uniq(map(dictionary, 'topic'))

export const findDictionaryItemById = (dictionary: IDictionary, id: string) =>
  find(dictionary, ['id', id])

export const extractDictionaryByLanguage = (
  dictionary: IDictionary,
  languageCode: string
) => filter(dictionary, ['languageCode', languageCode])

export const extractDictionaryByTopic = (
  dictionary: IDictionary,
  topic: string
) => filter(dictionary, ['topic', topic])
