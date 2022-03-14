const { WebcIonicController } = WebCardinal.controllers;

export default class extends WebcIonicController {
  constructor(...props) {
    super(...props);

    this.model.pageNumbers = {
      start: 1,
      end: this.model.dataSource.getLastPageIndex(),
    };

    this.model.pageNumbers.current = this.model.pageNumbers.start;

    this.model.onChange("pageNumbers.current", async () => {
      await this.model.dataSource.goToPageByIndex(this.model.pageNumbers.current - 1);
    });

    this.model.addExpression("isPrevDisabled", () => {
      return this.model.pageNumbers.current === this.model.pageNumbers.start;
    }, "pageNumbers.current");

    this.model.addExpression("isNextDisabled", () => {
      return this.model.pageNumbers.current === this.model.pageNumbers.end;
    }, "pageNumbers.current");

    this.onTagClick("prev", async () => {
      this.model.pageNumbers.current--;
    });

    this.onTagClick("next", async () => {
      this.model.pageNumbers.current++;
    });
  }

  onReady() {
    this.model.pageNumbers.end = this.model.dataSource.getLastPageIndex();

    const range = this.querySelector("ion-range");
    range.min = this.model.pageNumbers.start;
    range.max = this.model.pageNumbers.end;
  }
}
