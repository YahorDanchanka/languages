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

  return { languages, findLanguageByCode }
})
