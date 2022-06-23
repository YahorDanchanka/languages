export type IHistories = IHistory[]

export interface IHistory {
  correctAnswersNumber: number
  wrongAnswersNumber: number
  date: Date
  mode: string
  topic: string
}
