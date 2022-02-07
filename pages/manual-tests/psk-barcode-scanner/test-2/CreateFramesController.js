const { Controller } = WebCardinal.controllers;

async function timeout(time) {
    return new Promise(resolve => setTimeout(() => resolve(), time));
}

export default class _ extends Controller {
    constructor(...props) {
        super(...props);

        this.onTagClick('store-frames', async () => {
            const videoElement = this.querySelector('video');
            const frames = await this.recordFrames(videoElement, 20, 10);
            this.downloadJSON(frames, 'frames.json');
        });
    }

    async recordFrames(
        videoElement,
        duration = videoElement.duration,
        frameRate = 1,
        frames = [],
        shouldStartPlaying = true
    ) {
        if (duration <= 0) {
            videoElement.pause();
            return frames;
        }

        if (shouldStartPlaying) {
            frameRate = 1 / frameRate;
            videoElement.play();
            shouldStartPlaying = false;
        }

        frames.push(this.getFrame(videoElement));

        await timeout(frameRate * 1000);

        return await this.recordFrames(videoElement, duration - frameRate, frameRate, frames, shouldStartPlaying);
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