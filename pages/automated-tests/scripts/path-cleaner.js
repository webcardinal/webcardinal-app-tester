const readline = require("readline");
const { exec } = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const LEGENDA = `
Legenda:
  "all" or ""
  "webcardinal-core" or "1"
  "cardinal-barcode" or "2"
`

rl.question(`[WebCardinal] What library of components?${LEGENDA}`, (answer) => {
  answer = answer.trim().toLowerCase();

  const testCallback = (err, stdout, stderr) => {
    if (err) {
      console.error(err.message);
    }

    if (stderr) {
      console.error(stderr);
    }

    console.log(stdout);
    rl.close();
  };

  switch (answer) {
    case "cardinal-barcode":
    case "2":
      exec(
        `node node_modules/octopus/scripts/run test-cardinal-barcode devmode`,
        testCallback
      );
      return;
    default:
      rl.close();
  }
});
