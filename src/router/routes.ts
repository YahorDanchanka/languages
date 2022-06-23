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
    path: '/export',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'export',
        component: () => import('pages/ExportPage.vue'),
      },
    ],
  },
  {
    path: '/import',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'import',
        component: () => import('pages/ImportPage.vue'),
      },
    ],
  },
  {
    path: '/history',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'history',
        component: () => import('pages/HistoryPage.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
