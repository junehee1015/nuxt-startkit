<script setup lang="ts">
const { isOpen, options, handleConfirm, handleCancel } = useConfirmState()
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :dismissible="false"
    :title="options.title"
    :description="options.description"
  >
    <template
      v-if="!options.description"
      #description
    >
      <span class="sr-only">추가 설명이 없습니다.</span>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-3">
        <UButton
          v-if="!options.hideCancel"
          color="neutral"
          variant="ghost"
          @click="handleCancel"
        >
          {{ options.cancelText }}
        </UButton>

        <UButton
          :color="options.variant === 'danger' ? 'error' : 'primary'"
          @click="handleConfirm"
        >
          {{ options.confirmText }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
