<template>
  Topic view page
  {{ dictionaryOfTopic }}
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { IDictionary } from 'src/types/IDictionary'
import { extractDictionaryByTopic } from 'src/services/DictionaryService'
import { useDictionaryStore } from 'stores/dictionary'

const route = useRoute()
const dictionaryStore = useDictionaryStore()

const dictionaryOfTopic = ref<IDictionary>([])

watch(
  () => route.params.id,
  async () => {
    await dictionaryStore.load()
    dictionaryOfTopic.value = extractDictionaryByTopic(
      dictionaryStore.dictionary,
      <string>route.params.id
    )
  },
  { immediate: true }
)
</script>
