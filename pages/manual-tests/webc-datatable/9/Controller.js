// Path: pages/manual-tests/webc-datatable/9/Controller.js

import mock from './mock.js';

const { Controller } = WebCardinal.controllers;
const { DataSource } = WebCardinal.dataSources;

class WrapperDataSource extends DataSource {
    constructor(...props) {
        super(...props);

        this.setPageSize(10);

        this.walletStorage = mock.getWalletStorage();
        this.walletStorage
            .countRecordsAsync()
            .then((recordsNumber) => this.setRecordsNumber(recordsNumber))
            .catch((error) => console.error(error));

        console.log(this.model);

        this.model.noOfColumns = 3;
        this.model.headerItems = [{ name: 'Computing your header...' }];

        this.model.onChange('noOfColumns', async () => {
            await this.setPageSize(2 * this.model.noOfColumns);
            await this.forceUpdate();
            const dataSource = this.getElement();
            dataSource.style.setProperty('--no-of-columns', this.model.noOfColumns);
        })
    }

    /**
     * @override
     */
     getPageDataAsync = async (startOffset, dataLengthForCurrentPage) => {
        const data = await this.walletStorage.filterRecordsAsync(
            startOffset,
            dataLengthForCurrentPage
        );

        this.model.headerItems = [];
        this.model.footerItems = [];
        for (let i = 1; i <= this.model.noOfColumns; i++) {
            this.model.headerItems.push({ name: `Heading ${i}` });
            this.model.footerItems.push({ name: `Footer ${i}` })
        }

        return data;
    }
}

export default class extends Controller {
    constructor(...props) {
        super(...props);

        this.model = {
            datasource: new WrapperDataSource(),
        };
        const { datasource } = this.model;

        this.onTagClick("prev-page", () => datasource.goToPreviousPage());

        this.onTagClick("next-page", () => datasource.goToNextPage());
    }
}

