export interface ConfirmOptions {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'primary' | 'danger'
  hideCancel?: boolean
}

let resolvePromise: ((value: boolean) => void) | null = null

export const useConfirmState = () => {
  const isOpen = useState<boolean>('confirm-is-open', () => false)
  const options = useState<ConfirmOptions>('confirm-options', () => ({
    title: '',
    confirmText: '확인',
    cancelText: '취소',
    variant: 'primary',
    hideCancel: false
  }))

  const handleConfirm = () => {
    isOpen.value = false
    if (resolvePromise) resolvePromise(true)
  }

  const handleCancel = () => {
    isOpen.value = false
    if (resolvePromise) resolvePromise(false)
  }

  return { isOpen, options, handleConfirm, handleCancel }
}

export const useConfirm = (userOptions: ConfirmOptions): Promise<boolean> => {
  if (!import.meta.client) return Promise.resolve(false)

  const { isOpen, options } = useConfirmState()

  options.value = {
    confirmText: '확인',
    cancelText: '취소',
    variant: 'primary',
    hideCancel: false,
    ...userOptions
  }

  isOpen.value = true

  return new Promise((resolve) => {
    resolvePromise = resolve
  })
}
