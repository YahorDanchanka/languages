<template>
  <q-page padding>
    <q-input
      class="q-mb-sm"
      label="Название темы"
      v-model="searchQuery"
      outlined
      dense
    />
    <q-banner
      v-show="!loading && topics.length === 0"
      class="bg-primary text-white q-mb-sm"
    >
      <template v-slot:avatar>
        <q-icon name="priority_high" />
      </template>
      Темы не найдены
    </q-banner>
    <TopicCard
      class="q-mb-sm"
      v-for="topic in topics"
      :key="topic"
      :name="topic"
    />
  </q-page>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { filter } from 'lodash'
import { useDictionaryStore } from 'stores/dictionary'
import TopicCard from 'components/dictionary/TopicCard.vue'

const dictionaryStore = useDictionaryStore()

const searchQuery = ref('')

const loading = computed(() => dictionaryStore.loading)
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

onMounted(async () => {
  await dictionaryStore.load()
})
</script>
