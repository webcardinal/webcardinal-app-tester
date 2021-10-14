// Path: scripts/controllers/manual/webc-component/Controller.test1.js

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
            const id = index + skipCount + 1;

            const date = new Date(
                Math.floor(Math.random() * 100 + 1821),
                Math.floor(Math.random() * 12 + 1),
                Math.floor(Math.random() * 28)
            );
            const y = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
            const m = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
            const d = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);

            accumulator[index] = {
                id,
                name: `Name ${id}`,
                date: `${d}-${m}-${y}`,
            };
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
    }
}

export default class extends Controller {
    constructor(...props) {
        super(...props);

        this.model = {
            datasource: new PersonsDataSource(),
            randomPage: 4
        };

        const { datasource } = this.model;

        this.onTagClick("random-page", async (model) => {
            this.model.randomPage = mock.getRandomPage() + 1;
            console.log("go to page", model.randomPage);
            await datasource.goToPageByIndex(model.randomPage - 1);
        });

        this.onTagClick("prev-page", () => datasource.goToPreviousPage());

        this.onTagClick("next-page", () => datasource.goToNextPage());
    }
}

