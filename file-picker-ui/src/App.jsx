import React, { useState, useRef } from "react"
import axios from "axios"
import File from "./components/File/File"
import {
  Button,
  CircularProgress,
  Grid,
  Pagination,
  Paper,
  Typography,
} from "@mui/material"
import Base64ToBlob from "./utils/Base64ToBlob/Base64ToBlob"

const App = () => {
  const [zipFile, setZipFile] = useState(null)
  const [fileList, setFileList] = useState([])
  const [isExtracting, setIsExtracting] = useState(false)
  const [renameMap, setRenameMap] = useState({})
  const [copyMap, setCopyMap] = useState({})
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const zipFileInputRef = useRef()
  const ITEMS_PER_PAGE = 5
  const SERVER_URL = "http://localhost:4000/extract"

  const handleZipFileChange = (e) => {
    setZipFile(e.target.files[0])
    setFileList([])
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const selectZipFile = () => {
    zipFileInputRef.current.click()
  }

  const startExtraction = async () => {
    if (!zipFile) {
      alert("Please select a zip file and destination directory.")
      return
    }

    setIsExtracting(true)

    const formData = new FormData()
    formData.append("zipFile", zipFile)

    try {
      const response = await axios.post(SERVER_URL, formData, {
        onUploadProgress: (uploadProgressEvent) => {
          const progress = Math.round(
            (uploadProgressEvent.loaded / uploadProgressEvent.total) * 100
          )
          setUploadProgress(progress)
        },
      })

      if (response.data.success) {
        setFileList(response.data.files)
        setRenameMap({})
        setCopyMap({})
      } else {
        alert("Error extracting files.")
      }
    } catch (error) {
      alert("Error extracting files.")
    } finally {
      setIsExtracting(false)
      setUploadProgress(0)
    }
  }

  const renameFile = (fileName, newName) => {
    const InvalidFileNamePattern = /^[^.]+$/
    const isValidFileName = InvalidFileNamePattern.test(newName)

    if (!isValidFileName) {
      alert("File name cannot contain dots.")
      setRenameMap("")
      return
    }

    setRenameMap((prevMap) => ({
      ...prevMap,
      [fileName]: newName,
    }))
  }

  const confirmRename = (fileName) => {
    const originalFileName = fileName
    const newName = renameMap[fileName] || fileName

    setFileList((prevList) =>
      prevList.map((file) => {
        if (file.name === originalFileName) {
          const [name, extension] = originalFileName.split(".")
          const newFileName = newName + (extension ? `.${extension}` : "")
          return {
            ...file,
            name: newFileName,
          }
        }
        return file
      })
    )

    setRenameMap((prevMap) => ({
      ...prevMap,
      [fileName]: "",
    }))
  }

  const downloadFile = async (fileName, fileContent) => {
    try {
      const renamedFileName = renameMap[fileName] || fileName
      const directoryHandle = await window.showDirectoryPicker()
      const fileHandle = await directoryHandle.getFileHandle(renamedFileName, {
        create: true,
      })
      const writable = await fileHandle.createWritable()

      const blob = Base64ToBlob(fileContent)
      await writable.write(blob)
      await writable.close()

      alert(
        `File "${renamedFileName}" saved successfully in ${directoryHandle.name}`
      )
    } catch (error) {
      alert("Error saving file. Please try again.")
    }
  }

  const copyFile = async (fileName, fileContent) => {
    try {
      const copiedFileName = `Copy_of_${fileName}`
      const directoryHandle = await window.showDirectoryPicker()
      const fileHandle = await directoryHandle.getFileHandle(copiedFileName, {
        create: true,
      })
      const writable = await fileHandle.createWritable()

      const blob = Base64ToBlob(fileContent)
      await writable.write(blob)
      await writable.close()

      alert(
        `Copy of "${fileName}" saved successfully in ${directoryHandle.name}`
      )
    } catch (error) {
      alert("Error copying file. Please try again.")
    }
  }

  const copyToggle = (fileName) => {
    setCopyMap((prevMap) => ({
      ...prevMap,
      [fileName]: !prevMap[fileName],
    }))
  }

  const totalPages = Math.ceil(fileList.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const displayedFiles = fileList.slice(startIndex, endIndex)

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f2f4f5",
      }}
    >
      <Paper elevation={4} sx={{ padding: "10px" }}>
        <Typography variant="h4" textAlign="center" pb={1}>
          Zip File Picker
        </Typography>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item>
            <input
              ref={zipFileInputRef}
              type="file"
              accept=".zip"
              style={{ display: "none" }}
              onChange={handleZipFileChange}
            />
            <Button variant="outlined" onClick={selectZipFile}>
              Select Zip File
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={startExtraction}
              variant={isExtracting ? "disabled" : "outlined"}
            >
              {isExtracting ? "Extracting..." : "Extract"}
            </Button>
          </Grid>
          {isExtracting && (
            <Grid item>
              <CircularProgress
                variant="determinate"
                value={uploadProgress}
                sx={{ width: "30px", height: "30px" }}
              />
              <Typography>{`${uploadProgress}%`}</Typography>
            </Grid>
          )}
        </Grid>

        <ul>
          {displayedFiles.map((file) => (
            <File
              key={file.name}
              fileName={file.name}
              renameMap={renameMap}
              renameFile={renameFile}
              confirmRename={confirmRename}
              copyToggle={copyToggle}
              copyMap={copyMap}
              downloadFile={downloadFile}
              fileContent={file.content}
              copyFile={copyFile}
            />
          ))}
        </ul>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => handlePageChange(value)}
        />
      </Paper>
    </div>
  )
}

export default App
