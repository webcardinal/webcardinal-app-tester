const { DataSource } = WebCardinal.dataSources;
const { Controller } = WebCardinal.controllers;
const timeout = (time) => new Promise((resolve) => setTimeout(resolve, time));

async function generateMessageArray() {
  var arr = []

  for (let i = 0; i < 1000; i++) {
    const timestamp = Date.now();
    const val = `Message ${i + 1}`;

    arr.push({
      text: val,
      myMessage: Math.random() < 0.5 ? true : false,
      time: new Date(timestamp).toLocaleTimeString('ro-RO')
    })
    await timeout(10);
  }
  return arr;
}
const db = {
  async fetchData(start, length) {
    console.log(start, length)

    if (!this.messages) {
      this.messages = await generateMessageArray();
    }
    await timeout(2000);
    const toReturn = this.messages.slice(this.messages.length - start - length,this.messages.length - start).sort((a, b) => { return b.time - a.time });
    return toReturn
  }
};

class InfinitScrollDataSource extends DataSource {
  constructor(...props) {
    super(...props);

    // The height of datatable is computed base on pageSize (height of all items that are rendered)
    // default value is 30
    this.setPageSize(15);

    // Without knowing the records count datasource will try to fetch data infinitely

    // Specific data only for your custom DataSource
    this.currentbucketNumber = -1;
  }

  /**
   * @override
   */
  async getPageDataAsync(startOffset, dataLengthForCurrentPage) {
    const data = await db.fetchData(startOffset, dataLengthForCurrentPage);
    this.currentbucketNumber++;
    return data;
  }

}

export default class InfinitScrollController extends Controller {
  constructor(...props) {
    super(...props);
    this.model = {
      infinitScrollDataSource: new InfinitScrollDataSource({
        useInfiniteScroll: true,
        infiniteScrollPosition: 'top',
      }),
    };
  }
}