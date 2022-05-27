import { RouteRecordRaw } from 'vue-router'
import MainLayout from 'layouts/MainLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'topics',
        component: () => import('pages/IndexPage.vue'),
      },
    ],
  },
  {
    path: '/dictionary',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'dictionary',
        component: () => import('pages/DictionaryPage.vue'),
      },
      {
        path: 'edit/:id',
        name: 'dictionaryEdit',
        component: () => import('pages/DictionaryEditPage.vue'),
      },
    ],
  },
  {
    path: '/topics',
    component: MainLayout,
    children: [
      {
        path: ':id',
        name: 'topicView',
        component: () => import('pages/TopicViewPage.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
