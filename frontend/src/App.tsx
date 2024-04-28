import { useState } from 'react'
import './App.css'
import { uploadFile } from './service/upload'
import { Toaster, toast } from 'sonner'
import { type Data } from './type'

const APP_STATUS = {
  IDLE: 'idle',
  ERROR: 'error',
  READY_UPLOAD: 'ready_upload',
  UPLOADING: 'uploading',
  READY_USAGE: 'ready_usage'
} as const

type AppStatusType = typeof APP_STATUS[keyof typeof APP_STATUS]

const BUTTON_TEXT = {
  [APP_STATUS.READY_UPLOAD]: 'Subir Archivo',
  [APP_STATUS.UPLOADING]: 'Subiendo ...'
} as const

function App () {
  const [appStatus, setAppStatus] = useState<AppStatusType>(APP_STATUS.IDLE)
  const [file, setFile] = useState<File | null>(null)
  const [data, setData] = useState<Data>([])
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? []
    if (file) {
      setFile(file)
      setAppStatus(APP_STATUS.READY_UPLOAD)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (appStatus !== APP_STATUS.READY_UPLOAD || !file) {
      return
    }
    setAppStatus(APP_STATUS.UPLOADING)
    const [error, NewData] = await uploadFile(file)

    console.log(NewData)
    if (error) {
      setAppStatus(APP_STATUS.ERROR)
      toast.error('Ha ocurrido un erro')
      return
    }

    setAppStatus(APP_STATUS.READY_USAGE)
    if (NewData) setData(NewData)
    toast.success('Archivo Subido Correctamente')
  }

  const showButton = appStatus === APP_STATUS.READY_UPLOAD || appStatus === APP_STATUS.UPLOADING
  return (
    <>
      <Toaster />
      <h4>Challange: Upload CSV + Search</h4>
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            <input
              disabled={appStatus === APP_STATUS.UPLOADING}
              onChange={handleInputChange}
              name='file'
              type="file"
              accept='.csv' />
          </label>
          {
            showButton &&
            (
              <button disabled={appStatus === APP_STATUS.UPLOADING}>
                {BUTTON_TEXT[appStatus]}
              </button>
            )
          }
        </form>
      </div>
    </>
  )
}

export default App
