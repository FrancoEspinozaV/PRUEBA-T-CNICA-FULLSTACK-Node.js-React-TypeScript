import { ApiUploadResponse, Data } from '../type.d'

const url = 'http://localhost:3000/api/files'
export async function uploadFile(file: File): Promise<[Error?, Data?]> {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    })

    if (!res.ok)
      return [
        new Error(`Error subiendo el archivo ${res.statusText}`),
        undefined,
      ]

    const json = (await res.json()) as ApiUploadResponse
    return [undefined, json.data]
  } catch (error) {
    if (error instanceof Error) return [error, undefined]
  }
  return [new Error('Error desconocido'), undefined]
}
