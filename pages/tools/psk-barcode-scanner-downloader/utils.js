async function timeout(time) {
    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            resolve();
            clearTimeout(timeout);
        }, time);
    });
}

export { timeout }