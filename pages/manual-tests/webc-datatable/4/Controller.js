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
        console.log('fetching data...');
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

        this.onTagClick('data.clear', async () => {
            await datasource.clearPageDataAsync();
        });

        this.onTagClick('data.restore', async () => {
            await datasource.forceUpdate();
        });

        this.onTagClick('loading.start', async () => {
            await datasource.forceLoading();
        });

        this.onTagClick('loading.end', async () => {
            await datasource.forceUpdate(false);
        });
    }
}

