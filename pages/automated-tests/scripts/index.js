const { run: runPathClean } = require("./path-cleaner")

async function main() {
    try {
        await runPathClean();
    } catch (error) {
        console.error('[WebCardinal] [testing-workflow] ', error)
    }
}

main()
