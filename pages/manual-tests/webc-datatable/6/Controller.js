// Path: pages/manual-tests/webc-datatable/7/Controller.js

const { Controller } = WebCardinal.controllers;
const { DataSource } = WebCardinal.dataSources;

const timeout = (time) => new Promise((resolve) => setTimeout(resolve, time));

const db = {
  async fetchData(start, length) {
    await timeout(2000);
    return [...Array(length).keys()];
  },
};

class InfinitScrollDataSource extends DataSource {
  constructor(...props) {
    super(...props);

    // The height of datatable is computed base on pageSize (height of all items that are rendered)
    // default value is 30
    this.setPageSize(15);

    // Without knowing the records count datasource will try to fetch data infinitely
    this.setRecordsNumber(67);

    // Specific data only for your custom DataSource
    this.currentbucketNumber = 0;
  }

  /**
   * @override
   */
  async getPageDataAsync(startOffset, dataLengthForCurrentPage) {
    const data = await db.fetchData(startOffset, dataLengthForCurrentPage);
    this.currentbucketNumber++;
    return data.map((index) => ({
      lineNumber: startOffset + index + 1,
      bucketNumber: this.currentbucketNumber,
      dataNumber: index + 1,
      dataString: `Current data ${this.currentbucketNumber}.${startOffset + index + 1}.${index + 1}`,
    }));
  }
}

export default class InfinitScrollController extends Controller {
  constructor(...props) {
    super(...props);
    this.model = {
      infinitScrollDataSource: new InfinitScrollDataSource({
        useInfiniteScroll: true,
      }),
    };
  }
}
