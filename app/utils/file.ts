/**
 * Blob 데이터 파일 다운로드
 */
export const downloadBlob = (blob: Blob, fileName: string) => {
  // 브라우저 환경에서만 실행되도록 보장
  if (!import.meta.client) return

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()

  link.remove()
  window.URL.revokeObjectURL(url)
}
