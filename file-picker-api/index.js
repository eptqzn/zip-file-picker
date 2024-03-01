const express = require("express")
const cors = require("cors")
const multer = require("multer")
const AdmZip = require("adm-zip")
const path = require("path")

const app = express()
const PORT = 4000

app.use(cors())

const storage = multer.memoryStorage()
const upload = multer({ storage })

app.post("/extract", upload.single("zipFile"), (req, res) => {
  try {
    const zip = new AdmZip(req.file.buffer)
    const processedFiles = extractFilesFromZip(zip)

    res.json({ success: true, files: processedFiles })
  } catch (error) {
    console.error(error)
    res.json({ success: false, files: [] })
  }
})

function extractFilesFromZip(zip) {
  const zipEntries = zip.getEntries()
  return zipEntries
    .filter((zipEntry) => !zipEntry.isDirectory)
    .map((zipEntry) => ({
      name: path.basename(zipEntry.entryName),
      content: zipEntry.getData().toString("base64"),
    }))
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
