<template>
  <div class="shuffle__item q-mb-sm">
    <draggable
      item-key="id"
      :modelValue="modelValue.letters"
      @update:modelValue="(newValue) => emit('update:modelValue', newValue)"
      :component-data="{
        class: 'shuffleRow q-gutter-x-sm',
      }"
    >
      <template #item="{ element, index }">
        <div
          class="shuffleRow__letter q-mb-sm"
          :class="{
            'bg-red-6':
              modelValue.isError !== undefined &&
              lowerCase(modelValue.word[index]) !== lowerCase(element),
            'bg-green-6':
              modelValue.isError !== undefined &&
              lowerCase(modelValue.word[index]) === lowerCase(element),
          }"
        >
          {{ lowerCase(element) }}
        </div>
      </template>
    </draggable>
  </div>
</template>

<script lang="ts" setup>
import { lowerCase } from 'lodash'
import { IShuffleDictionaryItem } from 'src/types/IDictionary'
import draggable from 'vuedraggable'

const props = defineProps<{ modelValue: IShuffleDictionaryItem }>()
const emit = defineEmits(['update:modelValue'])
</script>

<style lang="sass" scoped>
.shuffle__item
  border-bottom: 1px dashed $primary

.shuffleRow
  display: flex
  flex-wrap: wrap
  justify-content: center
  font-size: 1rem

.shuffleRow__letter
  width: 40px
  height: 40px
  background-color: $primary
  font-size: 2em
  color: white
  display: flex
  justify-content: center
  align-items: center
</style>
