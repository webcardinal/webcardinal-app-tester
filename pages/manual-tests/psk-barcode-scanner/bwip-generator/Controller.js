const { Controller } = WebCardinal.controllers;

export default class _ extends Controller {
  constructor(...props) {
    super(...props);

    // azteccode=3
    // code128=26385
    // code39=33070
    // code39ext=131
    // code93=1
    // databarexpandedstacked=6
    // databarlimited=10
    // datamatrix=1513
    // ean13=4615
    // ean8=44
    // gs1-128=563
    // gs1datamatrix=114
    // interleaved2of5=432
    // itf14=37
    // pdf417=606
    // pdf417compact=15
    // qrcode=1555
    // rationalizedCodabar=193
    // upce=181

    this.model = {
      isVisible: undefined,
      bcid: "gs1datamatrix",
      link: "",
      text: "",
      src: "",
    };

    this.onTagClick("generate", async () => {
      await this.computeSrc();
    });
  }

  computeSrc = async () => {
    const API_PATH = "https://bwipjs-api.metafloor.com";
    const defaults = 'backgroundcolor=FFFFFF&parse&parsefnc&includetext&textxalign=center&guardwhitespace&width=60&height=60';
    this.model.link = `${API_PATH}/?bcid=${this.model.bcid}&text=${this.model.text}&${defaults}`;
    try {
      const res = await fetch(this.model.link);
      const blob = await res.blob();
      this.model.src = URL.createObjectURL(blob);
      this.model.isVisible = true;
    } catch (e) {
      this.model.isVisible = false;
      // await this.tryWithoutCors();
    }
  };

  // tryWithoutCors = async () => {
  //   try {
  //     await fetch(this.model.link, { mode: "no-cors" });
  //   } catch (e) {
  //     // console.error(e.message);
  //   }
  // };
}
