const {Controller} = WebCardinal.controllers;
const WORKER_SCRIPT_PATH = "webcardinal/extended/cardinal-barcode/worker/scan-worker-old-zxing.js";

export default class SimpleController extends Controller {
	constructor(...props) {
		super(...props);

		this.setup();
	}

	setup = async () => {
		let cameraIsOn = await this.connectCamera();

		if(cameraIsOn){
			this.scanning();
		}
	}

	scanning = async () => {
		let result;
		while(!result){
			let frame = this.captureFrame();
			let {width, height} =  this.element.querySelector("#userFeedback").srcObject.getVideoTracks()[0].getConstraints();
			this.debugFrame(frame);

			//frame = this.grabPhoto();

			result = await this.decode(frame);
			//console.log("Decoding finished", result, new Date().getTime());
		}

		if(result){
			console.log("Got:", result);
			alert(`Got your code ${JSON.stringify(result)}`);
		}else{
			alert(`Trouble in paradise!`);
		}
		this.scanning();
	}

	debugFrame = (frame) =>{
		const debug = this.element.querySelector("#debug");
		const ctx = debug.getContext("2d");

		ctx.putImageData(frame, 0, 0);
		ctx.lineWidth = 10;
		let size = 400;
		ctx.strokeRect((1920-size)/2, (1080-size)/2, size, size);
	}

	toGrayscaleBuffer = (imageData, width, height) => {
		const greyScaleImageData = new Uint8ClampedArray(width * height);
		for (let e = 0, r = 0, i = imageData.length; e < i; e += 4, r++) {
			let i;
			if (0 === imageData[e + 3])
				i = 255;
			else {
				i = 306 * imageData[e] + 601 * imageData[e + 1] + 117 * imageData[e + 2] + 512 >> 10
			}
			greyScaleImageData[r] = i
		}
		return greyScaleImageData;
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
						//
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
				constraints.video.width = 1920;
				constraints.video.height = 1080;

				await track.applyConstraints(constraints.video);
				//track.stop();
				//stream = await navigator.mediaDevices.getUserMedia(constraints);
			} catch (error) {
				console.log("Caught an error during camera connection", error);
				return false;
			}

			let video = this.querySelector("#userFeedback");
			video.addEventListener("loadeddata", (...args)=>{
				console.log(args);
				resolve(true);
			});
			video.addEventListener("error", reject);

			video.srcObject = stream;
		});
	}

	sharpen = (ctx, w, h, mix) => {
		var x, sx, sy, r, g, b, a, dstOff, srcOff, wt, cx, cy, scy, scx,
			weights = [0, -1, 0, -1, 5, -1, 0, -1, 0],
			katet = Math.round(Math.sqrt(weights.length)),
			half = (katet * 0.5) | 0,
			dstData = ctx.createImageData(w, h),
			dstBuff = dstData.data,
			srcBuff = ctx.getImageData(0, 0, w, h).data,
			y = h;

		while (y--) {
			x = w;
			while (x--) {
				sy = y;
				sx = x;
				dstOff = (y * w + x) * 4;
				r = 0;
				g = 0;
				b = 0;
				a = 0;

				for (cy = 0; cy < katet; cy++) {
					for (cx = 0; cx < katet; cx++) {
						scy = sy + cy - half;
						scx = sx + cx - half;

						if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
							srcOff = (scy * w + scx) * 4;
							wt = weights[cy * katet + cx];

							r += srcBuff[srcOff] * wt;
							g += srcBuff[srcOff + 1] * wt;
							b += srcBuff[srcOff + 2] * wt;
							a += srcBuff[srcOff + 3] * wt;
						}
					}
				}

				dstBuff[dstOff] = r * mix + srcBuff[dstOff] * (1 - mix);
				dstBuff[dstOff + 1] = g * mix + srcBuff[dstOff + 1] * (1 - mix);
				dstBuff[dstOff + 2] = b * mix + srcBuff[dstOff + 2] * (1 - mix);
				dstBuff[dstOff + 3] = srcBuff[dstOff + 3];
			}
		}

		ctx.putImageData(dstData, 0, 0);
	}

	captureFrame = () =>{
		let canvas = this.element.querySelector("#scene");
		let context = canvas.getContext("2d");

		let video = this.element.querySelector("#userFeedback");

		let {width, height} = video.srcObject.getVideoTracks()[0].getConstraints();
		//let width = video.videoWidth;
		//let height = video.videoHeight;
		canvas.width = width;
		canvas.height = height;
		//context.filter = 'brightness(1.75) contrast(1) grayscale(1)';
		//context.filter = 'grayscale(1) contrast(1)';
		context.drawImage(video, 0, 0, width, height);
		//this.sharpen(context, width, height,  0.9);

		context.imageSmoothingEnabled = false;
		let frameAsImageData = context.getImageData(0, 0, width, height);

		return frameAsImageData;
	}

	grabFrame = () => {
		let video = this.element.querySelector("#userFeedback");

		const track = video.srcObject.getVideoTracks()[0];
		const imageCapture = new ImageCapture(track);

		return imageCapture.grabFrame();
	}

	grabPhoto = () => {
		let canvas = this.element.querySelector("#scene");
		let context = canvas.getContext("2d");

		let video = this.element.querySelector("#userFeedback");

		let {width, height} = video.srcObject.getVideoTracks()[0].getConstraints();
		//let width = video.videoWidth;
		//let height = video.videoHeight;
		canvas.width = width;
		canvas.height = height;
		//context.filter = 'brightness(1.75) contrast(1) grayscale(1)';
		context.filter = 'grayscale(1)';
		context.drawImage(video, 0, 0, width, height);
		//this.sharpen(context, width, height,  0.9);

		context.imageSmoothingEnabled = false;
		let frameAsBase64 = canvas.toDataURL("image/png");

		return frameAsBase64;
	}
}