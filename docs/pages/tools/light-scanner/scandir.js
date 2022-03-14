const ACCEPTED_FORMATS = ["png", "jpg", "jpeg", "gif"];
const SCAN_PATH = "./codes";

const { join } = require('path');
const { readdir, writeFile } = require('fs').promises;

async function getCodes(dir) {
  const dirs = await readdir(dir, { withFileTypes: true });

  const files = await Promise.all(dirs.map(dirent => {
    const path = join(dir, dirent.name);

    if (dirent.name === 'unused') {
      return;
    }

    if (dirent.isDirectory()) {
      return getCodes(path);
    }

    const ext = path.split('.').pop();
    if (!ACCEPTED_FORMATS.includes(ext)) {
      return;
    }

    return path;
  }))

  return files.filter(Boolean).flat();
}

(async () => {
  const codes = await getCodes(SCAN_PATH);
  await writeFile('./index.generated.js', `export default ${JSON.stringify(codes, null, 2)}`)
})()