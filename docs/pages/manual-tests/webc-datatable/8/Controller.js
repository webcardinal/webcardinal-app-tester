// Path: pages/manual-tests/webc-datatable/8/Controller.js

const { Controller } = WebCardinal.controllers;
const { DataSource } = WebCardinal.dataSources;

const timeout = (time) => new Promise((resolve) => setTimeout(resolve, time));

class ContactsDataSource extends DataSource {
  constructor(...props) {
    super(...props);

    // The height of datatable is computed base on pageSize (height of all items that are rendered)
    // default value is 30
    this.setPageSize(32);

    // Without knowing the records count datasource will try to fetch data infinitely
    this.setRecordsNumber(67);

    console.log(this.model);
  }

  /**
   * @override
   */
  async getPageDataAsync(startOffset, dataLengthForCurrentPage) {
    await timeout(2500);

    return [...Array(dataLengthForCurrentPage).keys()].map(index => {
      const id = startOffset + index;

      return {
        image: {
          source: `https://www.gravatar.com/avatar/${id}?d=identicon`
        },
        name: `John Doe #${id}`,
      }
    });
  }
}

export default class _ extends Controller {
  constructor(...props) {
    super(...props);
    this.model = {
      dataSource: new ContactsDataSource({
        useInfiniteScroll: true,
      }),
    };
  }
}
