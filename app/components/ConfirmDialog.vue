<script setup lang="ts">
const { isOpen, options, handleConfirm, handleCancel } = useConfirmState()
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :dismissible="false"
  >
    <template #content>
      <UCard class="ring-0 divide-y divide-gray-100">
        <template #header>
          <h3 class="text-lg font-semibold leading-6 text-gray-900">
            {{ options.title }}
          </h3>
        </template>

        <p
          v-if="options.description"
          class="text-sm text-gray-500"
        >
          {{ options.description }}
        </p>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
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
      </UCard>
    </template>
  </UModal>
</template>
