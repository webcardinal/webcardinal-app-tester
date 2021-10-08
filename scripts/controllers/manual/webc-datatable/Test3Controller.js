// Path: scripts/controllers/manual/webc-datatable/Test3Controller.js

const { Controller } = WebCardinal.controllers;
const { DataSource } = WebCardinal.dataSources;

class CustomDataSource extends DataSource {
    constructor(...props) {
        super(...props);
    }

    /**
     * @override
     */
    async getPageDataAsync(startOffset, dataLengthForCurrentPage) {
        return [...Array(dataLengthForCurrentPage).keys()].map(index => ({
            number: Math.floor(Math.random() * 100) + 1,
            label: `Input no. ${index}`
        }));
    }
}

export default class extends Controller {
    constructor(...props) {
        super(...props);

        this.model = {
            dataSource: new CustomDataSource({ pageSize: 0 }),
            test: {
                type: 'number',
                value: Math.floor(Math.random() * 100) + 1,
                label: 'Test'
            }
        }
    }
}