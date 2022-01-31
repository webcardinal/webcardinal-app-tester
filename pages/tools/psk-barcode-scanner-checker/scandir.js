const fs = require("fs");

fs.readdir('./tmp', (err, filenames) => {
    const inputs = filenames.filter(filename => filename.endsWith('png') || filename.endsWith('jpg'))
    console.log(inputs);
});