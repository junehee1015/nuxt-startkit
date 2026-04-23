export const useLogout = () => {
  const { logout: excuteLogout } = useAuthStore()
  const pending = ref(false)

  const logout = async () => {
    pending.value = true

    try {
      await excuteLogout()
    } finally {
      pending.value = false
    }
  }

  return {
    logout,
    pending
  }
}
