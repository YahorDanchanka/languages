import { RouteLocationRaw } from 'vue-router'

export interface IDrawerItem {
  label: string
  icon: string
  to: RouteLocationRaw
}
