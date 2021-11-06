const { Controller } = WebCardinal.controllers;

async function timeout(time) {
    return new Promise(resolve => setTimeout(() => resolve(), time));
}

export default class _ extends Controller {
    constructor(...props) {
        super(...props);

        this.onTagClick('store-frames', async () => {
            const videoElement = this.querySelector('video');
            const frames = await this.recordFrames(videoElement);
            this.downloadJSON(frames, 'frames.json');
        });
    }

    async recordFrames(
        videoElement,
        frameRate = 1,
        duration = videoElement.duration,
        frames = []
    ) {
        if (duration <= 0) {
            return frames;
        }

        if (duration === videoElement.duration) {
            videoElement.play();
        }

        frames.push(this.getFrame(videoElement));
        await timeout(frameRate * 1000);
        return await this.recordFrames(videoElement, frameRate, duration - frameRate, frames);
    }

    getFrame(videoElement, quality = 0.5) {
        const video = {
            width: videoElement.videoWidth,
            height: videoElement.videoHeight
        };
        const canvas = this.createElement('canvas', {
            width: video.width,
            height: video.height
        });
        const context = canvas.getContext('2d');
        context.drawImage(videoElement, 0, 0, video.width, video.height);

        return canvas.toDataURL('image/jpeg', quality);
    }

    downloadJSON(object, name){
        const a = this.createElement('a', {
            href: `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(object))}`,
            download: name,
        });
        a.style.display = 'none';
        document.body.append(a);
        a.click();
        a.remove();
    }
}