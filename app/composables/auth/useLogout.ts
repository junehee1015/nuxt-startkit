export const useLogout = () => {
  const { $logout } = useNuxtApp()
  const pending = ref(false)

  const logout = async () => {
    pending.value = true

    try {
      await $logout()
    } finally {
      pending.value = false
    }
  }

  return {
    logout,
    pending
  }
}
