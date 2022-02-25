const {Controller} = WebCardinal.controllers;
import Scanner from "./../../../webcardinal/extended/cardinal-barcode/multi-format-scanner/scanner.js";

export default class SimpleController extends Controller {
	constructor(...props) {
		super(...props);
		try{
			this.runScanner();
		}catch(err){
			console.log(err);
		}
	}

	runScanner = async ()=>{
		let scanner = new Scanner(this.element);
		if(scanner.setup()){
			while (true) {
				let result = await scanner.scan();
				if (result) {
					console.log("Got:", result);
					//alert(`Got your code ${JSON.stringify(result)}`);
				}
			}
		}
	}
}