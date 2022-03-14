const mock = {
    delay: 200,
    count: 26,

    sleep: async (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },

    shuffle: (array) => {
        let currentIndex = array.length;
        let randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }
        return array;
    },

    getRandomPage: () => {
        const min = 0;
        const max = Math.ceil(mock.count / 20);
        return Math.floor(Math.random() * (max - min) + min);
    },

    getItems: (skipCount, count) => {
        return Array.from(Array(count)).reduce((accumulator, _, index) => {
            const id = index + skipCount;

            accumulator[index] = { id: String.fromCharCode(97 + id) };

            return accumulator;
        }, []);
    },

    getWalletStorage: () => {
        return {
            countRecordsAsync: async () => {
                await mock.sleep(mock.delay);
                return mock.count;
            },

            filterRecordsAsync: async (...props) => {
                await mock.sleep(mock.delay);
                return mock.getItems(...props, );
            },
        };
    },
};

export default mock;