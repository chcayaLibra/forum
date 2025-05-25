import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import history from 'connect-history-api-fallback'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
console.log(__filename)

const app = express()
app.use(history())

app.use(express.static(path.join(__dirname, 'dist')))

app.listen(8080, () => {
  console.log(`Server is running on http://localhost:8080`)
})
