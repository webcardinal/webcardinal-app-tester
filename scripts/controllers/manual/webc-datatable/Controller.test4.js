// Path: scripts/controllers/manual/webc-component/Controller.test4.js

const { Controller } = WebCardinal.controllers;
const { DataSource } = WebCardinal.dataSources;

const mock = {
    delay: 0,
    count: 3001,

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
            const number = index + skipCount + 1;
            accumulator[index] = { number, string: `Lorem Ipsum ${number}` };
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
                return mock.getItems(...props);
            },
        };
    },
};

class PersonsDataSource extends DataSource {
    constructor(...props) {
        super(...props);

        this.setPageSize(10);

        this.walletStorage = mock.getWalletStorage();
        this.walletStorage
            .countRecordsAsync()
            .then((recordsNumber) => this.setRecordsNumber(recordsNumber))
            .catch((error) => console.error(error));
    }

    /**
     * @override
     */
    async getPageDataAsync(startOffset, dataLengthForCurrentPage) {
        return await this.walletStorage.filterRecordsAsync(
            startOffset,
            dataLengthForCurrentPage
        );
        return [];
    }
}

export default class extends Controller {
    constructor(...props) {
        super(...props);

        this.model = {
            datasource: new PersonsDataSource(),
        };

        const { datasource } = this.model;

        let lastPageIndex = null;
        let isDeleted = false;

        this.onTagClick('clear-data', async () => {
            if (!isDeleted) {
                lastPageIndex = datasource.getCurrentPageIndex();
                await datasource.clearPageDataAsync();
                isDeleted = true;
            }
        });

        this.onTagClick('restore-data', () => {
            if (isDeleted) {
                datasource.goToPageByIndex(lastPageIndex);
                isDeleted = false;
            }
        });
    }
}

