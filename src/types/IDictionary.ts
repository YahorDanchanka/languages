export interface ILanguage {
  code: string
  label: string
}

export type IDictionary = IDictionaryItem[]

export interface IDictionaryItem {
  id: string
  language: ILanguage
  topic: string
  word: string
  translations: string[]
}
