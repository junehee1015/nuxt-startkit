<script setup lang="ts">
import { parseDate, getLocalTimeZone } from '@internationalized/date'

export type DatePickerModel = string | { start: string, end: string } | null

const props = withDefaults(defineProps<{
  range?: boolean
  placeholder?: string
}>(), {
  range: false,
  placeholder: '날짜를 선택하세요'
})

const modelValue = defineModel<DatePickerModel>({
  default: null
})

const dayjs = useDayjs()
const isPopoverOpen = ref(false)

const displayLabel = computed(() => {
  if (!modelValue.value) return props.placeholder

  if (props.range) {
    const rangeVal = modelValue.value as { start: string, end: string }
    if (!rangeVal.start && !rangeVal.end) return props.placeholder
    return `${rangeVal.start || '?'} ~ ${rangeVal.end || '?'}`
  }

  return modelValue.value as string
})

const calendarModel = computed(() => {
  if (!modelValue.value) return undefined

  if (props.range) {
    const rangeVal = modelValue.value as { start: string, end: string }
    return {
      start: rangeVal.start ? parseDate(rangeVal.start) : undefined,
      end: rangeVal.end ? parseDate(rangeVal.end) : undefined
    }
  }

  return parseDate(modelValue.value as string)
})

const onDateSelect = (newVal: unknown) => {
  if (!newVal) {
    modelValue.value = null
    return
  }

  if (props.range) {
    const rangeVal = newVal as { start?: { toDate: (tz: string) => Date }, end?: { toDate: (tz: string) => Date } }

    modelValue.value = {
      start: rangeVal.start ? dayjs(rangeVal.start.toDate(getLocalTimeZone())).format('YYYY-MM-DD') : '',
      end: rangeVal.end ? rangeVal.end.toDate(getLocalTimeZone()) ? dayjs(rangeVal.end.toDate(getLocalTimeZone())).format('YYYY-MM-DD') : '' : ''
    } as unknown as DatePickerModel
  } else {
    const dateVal = newVal as { toDate: (tz: string) => Date }
    modelValue.value = dayjs(dateVal.toDate(getLocalTimeZone())).format('YYYY-MM-DD')
    isPopoverOpen.value = false
  }
}
</script>

<template>
  <UPopover
    v-model:open="isPopoverOpen"
    :popper="{ placement: 'bottom-start' }"
  >
    <UButton
      color="neutral"
      variant="outline"
      icon="i-lucide-calendar"
      class="w-full justify-start text-left font-normal"
    >
      <span :class="!modelValue ? 'text-gray-500' : 'text-gray-900'">
        {{ displayLabel }}
      </span>
    </UButton>

    <template #content>
      <div class="p-4">
        <UCalendar
          :model-value="(calendarModel as never)"
          :range="props.range"
          @update:model-value="onDateSelect"
        />
      </div>
    </template>
  </UPopover>
</template>
