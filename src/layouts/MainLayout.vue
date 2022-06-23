<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Словарик </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item
          v-for="drawerItem in drawerItems"
          :key="drawerItem.icon"
          :to="drawerItem.to"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon :name="drawerItem.icon" />
          </q-item-section>

          <q-item-section> {{ drawerItem.label }} </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { IDrawerItem } from 'src/types/IDrawerItem'

const drawerItems = ref<IDrawerItem[]>([
  {
    label: 'Темы',
    icon: 'library_books',
    to: { name: 'topics' },
  },
  {
    label: 'Словарь',
    icon: 'translate',
    to: { name: 'dictionary' },
  },
  {
    label: 'Импорт',
    icon: 'file_upload',
    to: { name: 'import' },
  },
  {
    label: 'Экспорт',
    icon: 'file_download',
    to: { name: 'export' },
  },
  {
    label: 'История',
    icon: 'history',
    to: { name: 'history' },
  },
])

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
