const { Controller } = WebCardinal.controllers;
const { DataSource } = WebCardinal.dataSources;

class RWDataSource extends DataSource {
    constructor(...props) {
        super(...props);

        this.setRecordsNumber(9 * 9 + 2);
        this.setPageSize(9);
    }

    /**
     * @override
     */
    async getPageDataAsync(startOffset, dataLengthForCurrentPage) {
        return [...Array(dataLengthForCurrentPage).keys()].map(index => {
            const id = startOffset + index;

            return {
                image: {
                    source: `https://www.gravatar.com/avatar/${id}?d=robohash`
                },
                name: `Robo #${id}`,
                role: 'Role'
            }
        });
    }
}

export default class extends Controller {
    constructor(...props) {
        super(...props);

        this.model = {
            dataSource: new RWDataSource()
        }
    }
}