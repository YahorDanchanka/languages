import { defineStore } from 'pinia'
import { computed } from 'vue'
import { ILanguage } from 'src/types/IDictionary'

export const useLanguagesStore = defineStore('languages', () => {
  const languages = computed<ILanguage[]>(() => [
    { code: 'en', label: 'Английский' },
    { code: 'fr', label: 'Французский' },
    { code: 'de', label: 'Немецкий' },
  ])

  function findLanguageByCode(code: string): ILanguage | undefined {
    return languages.value.find((language: ILanguage) => language.code === code)
  }

  /**
   * Принимает список языковых кодов
   * Символьный код языка возвращается в объектом виде
   *
   * Input: ['en', 'fr']
   * Output: [{ code: 'en', label: 'Английский' }, { code: 'fr', label: 'Французский' }]
   */
  function map(list: string[]) {
    return list.map((languageCode) => findLanguageByCode(languageCode))
  }

  return { languages, findLanguageByCode, map }
})
