<template>
  <q-page padding>
    <DictionaryForm
      v-if="dictionaryItem"
      @submit="onSubmit"
      :dictionary-item="dictionaryItem"
    />
  </q-page>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDictionaryStore } from 'stores/dictionary'
import { IDictionaryItem } from 'src/types/IDictionary'
import DictionaryForm from 'components/dictionary/DictionaryForm.vue'

const store = useDictionaryStore()
const router = useRouter()
const route = useRoute()

const dictionaryItem = ref<IDictionaryItem>()

async function onSubmit(dictionaryItem: IDictionaryItem) {
  store.updateDictionaryItem(dictionaryItem)
  await store.save()
  await router.push({ name: 'dictionary' })
}

watch(
  () => route.params,
  async () => {
    await store.load()
    dictionaryItem.value = store.findDictionaryItemById(<string>route.params.id)
  },
  { immediate: true }
)
</script>
