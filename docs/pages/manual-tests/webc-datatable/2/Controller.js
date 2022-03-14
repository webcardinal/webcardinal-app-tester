// Path: pages/manual-tests/webc-datatable/2/Controller.js

import mock from './mock.js';

const { Controller } = WebCardinal.controllers;
const { DataSource } = WebCardinal.dataSources;

class PersonDataSource extends DataSource {
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
            datasource: new PersonDataSource(),
            randomPage: 4
        };
        const { datasource } = this.model;

        this.onTagClick("random-page", async (readOnlyModel) => {
            // go to random page
            console.log("go to page", readOnlyModel.randomPage);
            await datasource.goToPageByIndex(readOnlyModel.randomPage - 1);

            // compute a new random page
            this.model.randomPage = mock.getRandomPage() + 1;
        });

        this.onTagClick("prev-page", () => datasource.goToPreviousPage());

        this.onTagClick("next-page", () => datasource.goToNextPage());
    }
}

