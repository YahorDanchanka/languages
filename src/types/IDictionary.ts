export interface ILanguage {
  code: string
  label: string
}

export type IDictionary = IDictionaryItem[]

export interface IDictionaryItem {
  id: string
  languageCode: string
  topic: string
  word: string
  translations: string[]
}
