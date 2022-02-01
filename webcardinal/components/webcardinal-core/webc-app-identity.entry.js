import { r as registerInstance, e as createEvent, h, f as Host } from './index-30eb7fef.js';
import { ae as promisifyEventEmit } from './index-0e9697d2.js';

const defaultWebcAppIdentityCss = ":host{display:grid;row-gap:var(--row-gap);place-content:center;justify-content:stretch}:host a{color:var(--color);text-decoration:none}:host>img{border-radius:var(--avatar-radius)}:host>.name{font-size:var(--name-font-size)}:host>.email{font-size:var(--email-font-size)}:host(.has-avatar){grid-template-columns:var(--avatar-width) 1fr;column-gap:var(--column-gap)}:host(.has-avatar)>img{width:100%;grid-column:1/2;grid-row:1/3;align-self:center}:host(.has-avatar)>.email,:host(.has-avatar)>.name{grid-column:2/3}:host(.has-avatar)>.name{align-self:end}";

const WebcAppIdentity = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.getIdentityConfigEvent = createEvent(this, "webcardinal:config:getIdentity", 7);
  }
  async componentWillLoad() {
    try {
      const identity = await promisifyEventEmit(this.getIdentityConfigEvent);
      this.avatar = identity.avatar;
      this.email = identity.email;
      this.name = identity.name;
    }
    catch (error) {
      console.error(error);
    }
  }
  render() {
    const attributes = {
      class: {
        'has-avatar': !!this.avatar,
      },
    };
    return (h(Host, Object.assign({}, attributes), this.avatar ? h("img", { src: this.avatar, alt: this.name }) : null, h("a", { href: "/", class: "name" }, this.name), h("a", { href: `mailto:${this.email}`, class: "email" }, this.email)));
  }
};
WebcAppIdentity.style = {
  default: defaultWebcAppIdentityCss
};

export { WebcAppIdentity as webc_app_identity };
