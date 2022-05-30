<template>
  <q-page padding>
    <q-input
      class="q-mb-sm"
      label="Название темы"
      v-model="searchQuery"
      outlined
      dense
    />
    <TopicCard
      class="q-mb-sm"
      v-for="topic in topics"
      :key="topic"
      :name="topic"
    />
  </q-page>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { filter } from 'lodash'
import { useDictionaryStore } from 'stores/dictionary'
import TopicCard from 'components/dictionary/TopicCard.vue'

const dictionaryStore = useDictionaryStore()
dictionaryStore.load()

const searchQuery = ref('')

const topics = computed<string[]>(() =>
  filter(
    dictionaryStore.topics,
    (topic) =>
      topic
        .toLowerCase()
        .trim()
        .indexOf(searchQuery.value.toLowerCase().trim()) !== -1
  )
)
</script>
