const { Controller } = WebCardinal.controllers;

export default class DataForController extends Controller {
  constructor(...props) {
    super(...props);

    this.model = {
      arrayOfStrings: ["This", "is", "an", "array", "of", 11, "items", "!", "It's", true, '.'],
      arrayOfObjects: [
        { age: 43, name: "John",  role: "my father" },
        { age: 40, name: "Amy",   role: "my mother" },
        { age: 10,  name: "Johny", role: "me" },
      ],
    };
  }
}
