import { Button, Input } from "@mui/material"

const File = ({
  fileName,
  renameMap,
  renameFile,
  confirmRename,
  copyToggle,
  copyMap,
  downloadFile,
  fileContent,
  copyFile,
}) => (
  <li key={fileName} className="file-item">
    <div className="file-info">
      <span>{fileName}</span>
      <div className="rename-container">
        <Input
          type="text"
          placeholder="Rename File"
          value={renameMap[fileName] || ""}
          onChange={(e) => renameFile(fileName, e.target.value)}
        />
        {renameMap[fileName] && (
          <Button onClick={() => confirmRename(fileName)}>OK</Button>
        )}{" "}
      </div>
    </div>
    <div className="file-actions">
      <Button
        className="action-button"
        onClick={() => downloadFile(fileName, fileContent)}
      >
        Download
      </Button>
      <Button className="action-button" onClick={() => copyToggle(fileName)}>
        {copyMap[fileName] ? "Cancel Copy" : "Copy"}
      </Button>
      {copyMap[fileName] && (
        <Button
          className="action-button"
          onClick={() => copyFile(fileName, fileContent)}
        >
          Copy File
        </Button>
      )}
    </div>
  </li>
)

export default File
