const fs = require("fs");
const path = require("path");

const ACCEPTED_FORMATS = ["png", "jpg", "jpeg", "gif"];
const SCAN_PATH = "./codes/submitted/Redmi";

fs.readdir(SCAN_PATH, (error, filenames) => {
  if (error) {
    console.error(error);
    return;
  }

  const files = filenames.filter((filename) => {
    const format = filename.split(".").pop();
    return ACCEPTED_FORMATS.includes(format);
  });

  const output = files.map((file) => path.join(SCAN_PATH, file));
  console.log(output);
});
