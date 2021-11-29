// Path: pages/manual-tests/webc-component/1/Controller.js

const { WebcIonicController } = WebCardinal.controllers;

const IOS_USE_FRAMES = 'dev-options:ios-use-frames';

class TestController extends WebcIonicController {
    constructor(...props) {
        super(...props);

        this.model = {
            devOptions: {
                areEnabled: undefined,
                useFrames: {
                    value: false
                }
            }
        }

        this.onTagClick('dev-options:ios-use-frames', this.iosUseFramesHandler);

        this.set();
    }

    async getDeveloperOptions() {
        try {
            const file = await fetch('webcardinal.json')
            const data = await file.json();
            if (!data.leaflet || !data.leaflet.devOptions) {
                return [false];
            }
            let isAtLeastOne = false;
            const options = data.leaflet.devOptions;
            const disabled = options.disabled || [];
            delete options.disabled;
            const keys = Object.keys(options).filter(key => key !== 'disabled');
            for (const key of keys) {
                if (disabled.includes(key)) {
                    delete options[key];
                    continue;
                }
                if (options[key]) {
                    isAtLeastOne = true;
                    break;
                }
            }
            if (!isAtLeastOne) {
                return [false];
            }
            return [true, options]
        } catch (error) {
            console.log(error)
            return [false];
        }
    }

    setDeveloperOptions = async () => {
        const [isDevConfigEnabled, options] = await this.getDeveloperOptions();
        this.model.devOptions.areEnabled = isDevConfigEnabled;
        if (!isDevConfigEnabled) {
            return;
        }
        this.model.devOptions.useFrames.value = options.useFrames || localStorage.getItem(IOS_USE_FRAMES) === 'true';
    }

    iosUseFramesHandler = (model) => {
        if (!this.model.devOptions.areEnabled) {
            return;
        }

        this.model.devOptions.useFrames.value = !model.devOptions.useFrames.value;
        if (this.model.devOptions.useFrames.value) {
            localStorage.setItem(IOS_USE_FRAMES, `${this.model.devOptions.useFrames.value}`);
        } else {
            localStorage.removeItem(IOS_USE_FRAMES);
        }
    }
}

export default TestController;