<template>
  <q-card @click="redirect">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">{{ name }}</div>
    </q-card-section>

    <q-separator />

    <q-card-actions vertical>
      <q-btn color="primary" flat> Перейти </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{ name: string }>()

/** Перенаправляет на страницу запуска теста */
function redirect() {
  router.push({ name: 'topicView', params: { id: props.name } })
}
</script>
