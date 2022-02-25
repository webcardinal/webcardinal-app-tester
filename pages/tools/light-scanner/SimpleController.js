const {Controller} = WebCardinal.controllers;
const WORKER_SCRIPT_PATH = "webcardinal/extended/cardinal-barcode/worker/scan-worker-old-zxing.js";
const SCAN_AREA_SIZE = 250;

export default class SimpleController extends Controller {
	constructor(...props) {
		super(...props);
		this.canvas = this.element.querySelector("#scene");
		this.context = this.canvas.getContext("2d");
		this.context.imageSmoothingEnabled = false;

		this.setup();
	}

	setup = async () => {
		let cameraIsOn = await this.connectCamera();

		if(cameraIsOn){
			await this.scanning();
		}
	}

	scanning = async () => {
		let result;
		while(!result){
			let frame = this.getDataForScanning();
			//this.debugFrame(frame);

			result = await this.decode(frame);
			//console.log("Decoding finished", result, new Date().getTime());
		}

		if(result){
			console.log("Got:", result);
			//alert(`Got your code ${JSON.stringify(result)}`);
		}else{
			alert(`Trouble in paradise!`);
		}
		await this.scanning();
	}

	getCenterArea = () =>{
		let size = SCAN_AREA_SIZE;
		let {width, height} = this.canvas;
		const points = [(width-size)/2, (height-size)/2, size, size];
		return points;
	}

	debugFrame = (frame) =>{
		const debug = this.element.querySelector("#debug");
		const ctx = debug.getContext("2d");

		ctx.putImageData(frame, 0, 0);
	}

	decode = (imageData) =>{
		let promise = new Promise((resolve, reject)=>{
			if(!this.worker){
				this.worker = new Worker(WORKER_SCRIPT_PATH);
			}

			let waitFor = (message)=>{
				try{
					//verify message
					let result;
					let payload = message.data;
					let messageType = payload.message;
					switch(messageType) {
						case "failed decoding":
							//console.log("got an message with failed decoding status");
							break;
						case "successful decoding":
							result = payload.data.result;
							break;
						default:
							console.log("Caught a strange message");
							result = payload;
					}

					this.worker.removeEventListener("message", waitFor);
					this.worker.removeEventListener("error", errorHandler);
					resolve(result);
				}catch(err){
					console.log(err);
				}
			}

			let errorHandler = (...args)=>{
				this.worker = undefined;
				reject(...args);
			};

			this.worker.addEventListener("message", waitFor);

			this.worker.addEventListener("error", errorHandler);

			this.worker.postMessage({
				message: "start decoding",
				imageData,
				filterId: ""
			});
		});

		return promise;
	}

	connectCamera = async () => {
		return new Promise(async (resolve, reject)=>{
			let stream;
			let constraints = {
				audio: false,
				video: {
					facingMode: "environment"
				},
				advanced: [{focusMode: "continuous"}]
			};

			try {
				stream = await navigator.mediaDevices.getUserMedia(constraints);
				const track = stream.getVideoTracks()[0];
				const capabilities = track.getCapabilities();
				console.log(capabilities);

				constraints.video.height = 1080;
				constraints.video.width = 1920;

				await track.applyConstraints(constraints.video);
				//track.stop();
				//stream = await navigator.mediaDevices.getUserMedia(constraints);
			} catch (error) {
				console.log("Caught an error during camera connection", error);
				return false;
			}

			let video = this.createElement('video', {
				autoplay: true,
				playsinline: true,
				hidden: true
			});
			video.style.position = 'fixed';
			video.style.top = '0px';
			video.style.bottom = '0px';
			video.style.left = '0px'
			video.style.right = '0px'

			video.addEventListener("loadeddata", (...args)=>{
				console.log(args);
				this.canvas.width = video.videoWidth;
				this.canvas.height = video.videoHeight;
				setInterval(this.drawFrame, 30);
				resolve(true);
			});

			video.addEventListener("error", reject);

			this.videoStream = stream;

			/*this.canvas.width = constraints.video.width;
			this.canvas.height = constraints.video.height;*/

			video.srcObject = stream;
		});
	}

	getDataForScanning = () =>{
		let frameAsImageData = this.context.getImageData(...this.getCenterArea());

		return frameAsImageData;
	}

	drawCenterArea = () => {
		const context = this.context;

		context.lineWidth = 3;
		const centerAreaPoints = this.getCenterArea();
		context.strokeRect(...centerAreaPoints);
	}

	drawOverlay = () => {
		let size = SCAN_AREA_SIZE;
		const { width, height } = this.canvas;

		const x = (width - size) / 2;
		const y = (height - size) / 2;

		const backgroundPoints = [
			{ x: width, y: 0 },
			{ x: width, y: height },
			{ x: 0, y: height },
			{ x: 0, y: 0 },
		];

		const holePoints = [
			{ x, y: y + size },
			{ x: x + size, y: y + size },
			{ x: x + size, y },
			{ x, y }
		];

		let context = this.context;
		context.beginPath();

		context.moveTo(backgroundPoints[0].x, backgroundPoints[0].y);
		for (let i = 0; i < 4; i++) {
			context.lineTo(backgroundPoints[i].x, backgroundPoints[i].y);
		}

		context.moveTo(holePoints[0].x, holePoints[0].y);
		for (let i = 0; i < 4; i++) {
			context.lineTo(holePoints[i].x, holePoints[i].y);
		}

		context.closePath();

		context.fillStyle = 'rgba(0, 0, 0, 0.5)'
		context.fill();
	}

	measureTime = () =>{
		if(this.end){
			return;
		}

		if(!this.start){
			this.start = Date.now();
			return;
		}
		this.end = Date.now();
		console.log(this.end-this.start);
		return;
	}

	drawFrame = async () =>{
this.measureTime();
		let context = this.context;

		//context.filter = 'brightness(1.75) contrast(1) grayscale(1)';

		const frame = await this.grabFrameFromStream();

		const { width, height } = this.canvas;

		context.drawImage(frame, 0, 0, width, height);

		this.drawOverlay();

		this.drawCenterArea();
this.measureTime();
	}

	grabFrameFromStream = () => {
		const track = this.videoStream.getVideoTracks()[0];
		const imageCapture = new ImageCapture(track);

		return imageCapture.grabFrame();
	}
}