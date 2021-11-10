// Path: pages/manual-tests/webc-datatable/4/Controller.js

import mock from '../2/mock.js';

const { Controller } = WebCardinal.controllers;
const { DataSource } = WebCardinal.dataSources;

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

