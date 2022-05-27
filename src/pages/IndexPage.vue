<template>
  <q-page padding>
    <TopicCard
      class="q-mb-sm"
      v-for="topic in topics"
      :key="topic"
      :name="topic"
    />
  </q-page>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useDictionaryStore } from 'stores/dictionary'
import TopicCard from 'components/dictionary/TopicCard.vue'

const dictionaryStore = useDictionaryStore()
dictionaryStore.load()

const topics = computed<string[]>(() => dictionaryStore.topics)
</script>
