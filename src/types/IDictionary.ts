export interface ILanguage {
  code: string
  label: string
}

export type IDictionary = IDictionaryItem[]
export type IAnswerDictionary = IAnswerDictionaryItem[]
export type IInputDictionary = IInputDictionaryItem[]

export interface IDictionaryItem {
  id: string
  languageCode: string
  topic: string
  word: string
  translations: string[]
}

export interface IAnswerDictionaryItem extends IDictionaryItem {
  translation?: string
  answer?: boolean
  isError?: boolean
}

export interface IInputDictionaryItem extends IDictionaryItem {
  answer?: string
  isError?: boolean
}
