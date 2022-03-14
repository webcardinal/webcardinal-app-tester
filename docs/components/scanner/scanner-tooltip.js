class ScannerTooltip extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.refs = {};
    }

    static get observedAttributes() { return ['badge']; }

    async connectedCallback() {
        this.refs.container = document.createElement('section');
        this.refs.container.part = 'container';

        if (this.count) {
            this.refs.badge = document.createElement('span');
            this.refs.badge.part = 'badge';
            this.refs.badge.append(this.count);
            this.refs.container.append(this.refs.badge);
        }

        this.refs.container.append(document.createElement('slot'))

        this.shadowRoot.append(this.refs.container);
    }

    async disconnectedCallback() {
        this.refs = {};
        this.innerHTML = "";
    }

    get badge() {
        return this.count;
    }

    set badge(count) {
        if (typeof count === 'number') {
            this.count = count;

            if (this.refs.badge) {
                this.refs.badge.innerHTML = "";
                this.refs.badge.append(this.count);
            }
        }
    }

    get data() {
        return this._internal;
    }

    set data(data) {
        this._internal = data;
    }

    triggerAccentShadow() {
        this.classList.add('active');
        setTimeout(() => this.classList.remove('active'), 200);
    }
}

customElements.define('scanner-tooltip', ScannerTooltip);