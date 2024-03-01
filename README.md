# zip-file-picker

A zip file picker that can extract the file and can download each file individually. Made with ReactJS and Axios for frontend, Node.js and Express for backend.

# Instructions for starting the UI

`yarn install` or `npm install` in the file-picker-ui directory to install the necessary dependencies.
`npm start` to start the UI local port.

# Instruction for starting the API

`npm install` in the file-picker-api directory to install the necessary dependencies.
`node index.js` to start the server at port 4000

# Feedbacks from this code challenge

Given the time frame, I unfortunately haven't implemented the Pause/Resume functionality for the extraction of zip files. Given more time to implement it in this project,
I would have implemented the pause/resume functionality by breaking down the extraction process into smaller chunks and do it asynchronously. One problem that I would be facing in that approach would be properly combining each chunk into a proper zip to be used with Adm-Zip as to not throw zip decoding error. For now, I lacked the time to find the solution for that problem yet.
