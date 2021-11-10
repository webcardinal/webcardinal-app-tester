// Path: pages/manual-tests/webc-datatable/1/Controller.js

const { Controller } = WebCardinal.controllers;
const { DataSource } = WebCardinal.dataSources;

const db = {
    fetchData(start, length) {
        return [...Array(length).keys()];
    }
}

class TestDataSource extends DataSource {
    constructor(...props) {
        super(...props);
    }

    /**
     * @override
     */
    async getPageDataAsync(startOffset, dataLengthForCurrentPage) {
        // mock
        console.log({ startOffset, dataLengthForCurrentPage });
        const data = db.fetchData(startOffset, dataLengthForCurrentPage);

        return data.map(index => ({
            number: startOffset + index + 1,
            text: `Text ${index}`
        }));
    }
}

class TestController extends Controller {
    constructor(...props) {
        super(...props);

        this.model = {
            testDataSource: new TestDataSource()
        }
    }
}

export default TestController;