

const { Controller } = WebCardinal.controllers;

const TAG = '[FilterApplierController]';
const FILTERS_PATH = '/webcardinal-app-tester/libs/zxing-wrapper/worker/filters.js';

class FilterApplierController extends Controller {
    constructor(...props) {
        super(...props);

        console.log(TAG);

        this.theme = 'dark';
        this.objectURL = '';
        this.script = null;
        this.refs = {
            theme: this.getElementByTag('theme'),
            placeholder: this.getElementByTag("placeholder")
        }

        this.onTagEvent("image.input", "change", async (model, target) => {
            await this.importFilters();

            const [file] = target.files;
            if (!file) {
                return;
            }

            const image = await this.createImage(file)
            const canvases = this.applyFilters(image).flat();

            this.refs.placeholder.innerHTML = "";
            this.refs.placeholder.append(...canvases);
        });

        this.onTagEvent("theme", "click", () => {
            switch (this.theme) {
                case "dark": this.theme = "light"; break;
                default: this.theme = "dark"; break;
            }
            this.setTheme(this.theme);
        });

        this.setTheme();
    }

    static areFiltersImported() {
        if (!window.filters) {
            return false;
        }

        return typeof window.getFilter === 'function';
    }

    async importFilters() {
        if (!FilterApplierController.areFiltersImported()) {
            return new Promise((resolve, reject) => {
                this.script = this.createElement('script', { src: FILTERS_PATH });
                document.head.append(this.script);
                this.script.addEventListener('load', resolve);
                this.script.addEventListener('error', reject);
            })
        }
    }

    /**
     * @param {HTMLImageElement} image
     */
    applyFilters(image) {
        return window.filters.map(filterName => {
            const filterAction = window.getFilter(filterName);
            return this.createCanvas(image, { filterName, filterAction });
        })
    }

    async createImage(file) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = URL.createObjectURL(file);
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', reject);
        });
    }

    createCanvas(image, { filterName, filterAction }) {
        const { width, height } = image;

        const canvas = this.createElement('canvas', { width, height, id: filterName });

        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, width, height);

        const imageData = filterAction({ imageData: context.getImageData(0, 0, width, height) });

        context.putImageData(imageData, 0, 0);

        return [canvas, `Filter: ${filterName}`];
    }

    onDisconnectedCallback() {
        if (this.objectURL) {
            URL.revokeObjectURL(this.objectURL);
        }

        if (this.script) {
            // this.script.remove();
            // delete window.];
            // delete window.getFilter;
        }
    }

    setTheme(theme) {
        this.refs.svgs = {
            moon: this.querySelector('template#moon').content.cloneNode(true),
            sun: this.querySelector('template#sun').content.cloneNode(true),
        };

        switch (theme) {
            case "light": {
                this.refs.theme.dataset.value = 'light';
                this.element.dataset.theme = 'light';
                this.refs.theme.innerHTML = '';
                this.refs.theme.append(this.refs.svgs.moon);
                return;
            }

            default: {
                this.refs.theme.dataset.value = 'dark';
                this.refs.theme.innerHTML = '';
                this.refs.theme.append(this.refs.svgs.sun);
                this.element.dataset.theme = 'dark';
            }
        }
    }
}

export default FilterApplierController