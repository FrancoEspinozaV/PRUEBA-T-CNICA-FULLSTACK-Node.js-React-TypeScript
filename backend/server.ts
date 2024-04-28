import express from 'express'
import cors from 'cors'
import multer from 'multer'
import csvToJson from 'convert-csv-to-json'

const app = express()
const port = process.env.PORT ?? 3000

const storage = multer.memoryStorage()
const upload = multer({ storage })
let userData: Array<Record<string, string>> = []

app.use(cors())

app.post('/api/files', upload.single('file'), async (req, res) => {
  const { file } = req
  if (!file) {
    return res.status(500).json({ message: 'El archivo es requerido' })
  }

  if (file.mimetype !== 'text/csv') {
    return res.status(500).json({ message: 'El archivo debe ser CSV' })
  }
  let json: Array<Record<string, string>> = []

  try {
    const csv = Buffer.from(file.buffer).toString('utf-8')
    json = csvToJson.fieldDelimiter(',').csvStringToJson(csv)
  } catch (error) {
    return res.status(500).json({ message: 'Error al transformar el archivo' })
  }
  userData = json
  res
    .status(200)
    .json({ data: json, message: 'El archivo se cargo correctamente' })
})

app.get('/api/users', (req, res) => {
  const { q } = req.query
  if (!q) {
    return res
      .status(500)
      .json({ message: 'Falta el parametro `q` es requerido' })
  }

  const search = q.toString().toLocaleLowerCase()

  const filteredDate = userData.filter((row) => {
    return Object.values(row).some((value) =>
      value.toLocaleLowerCase().includes(search)
    )
  })

  return res.status(200).json({ data: filteredDate })
})

app.listen(port, () => console.log(`escuchando en http://localhost:${port}`))
