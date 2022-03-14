// Src: pages/manual-tests/webc-datatable/1/Controller.js

const { WebcController } = WebCardinal.controllers;
const { DataSource } = WebCardinal.dataSources;

const db = {
  fetchData(start, length) {
    return [...Array(length).keys()];
  },
};

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

    return data.map((index) => ({
      number: startOffset + index + 1,
      text: `Text ${index + 1}`,
    }));
  }
}

class TestController extends WebcController {
  constructor(...props) {
    super(...props);

    this.model = {
      /**
       * Options for DataSource
       * @param {object} [options]
       * @param {number | undefined} [options.recordsNumber]
       * @param {number} [options.pageSize=20]
       * @param {number} [options.pageSizeDelta=2]
       * @param {boolean} [options.useOptimisticMode=false]
       * @param {boolean} [options.useInfiniteScroll=false]
       *
       * @ref: https://github.com/webcardinal/webcardinal-core/blob/master/base/dataSources/DataSource.js#L6
       */
      testDataSource: new TestDataSource(),
    };

    this.onTagClick("view", (model) => {
      const { number, text } = model;
      this.showModal(text, `Number #${number}`);
    });
  }
}

export default TestController;
