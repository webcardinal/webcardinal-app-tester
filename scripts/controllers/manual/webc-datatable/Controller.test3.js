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
            value: Math.floor(Math.random() * 100) + 1,
            label: `Input no. ${startOffset + index + 1}`,
            type: 'number',
        }));
    }
}

export default class extends Controller {
    constructor(...props) {
        super(...props);

        this.model = {
            test: {
                value: Math.floor(Math.random() * 100) + 1,
                label: 'Test',
                type: 'number'
            },
            dataSource: new CustomDataSource({ pageSize: 3, recordsNumber: 700 }),
        }
    }
}