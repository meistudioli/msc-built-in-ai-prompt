import { _wcl } from './common-lib.js';
import { _wccss } from './common-css.js';

const defaults = {};
const booleanAttrs = []; // booleanAttrs default should be false
const objectAttrs = [];
const custumEvents = {
  ready: 'msc-built-in-ai-prompt-ready',
  progress: 'msc-built-in-ai-prompt-download-progress',
  contextoverflow: 'msc-built-in-ai-prompt-contextoverflow'
};
const supported = !!window.LanguageModel;

const template = document.createElement('template');
template.innerHTML = `
<style>
${_wccss}

:host {
  --display: none;

  position: relative;
  inline-size: fit-content;
  display: var(--display);
}

:host(:not([data-status=unsupported],[data-status=available],[data-status=unavailable])) {
  --display: block;
}

.main {
  inline-size: fit-content;
  block-size: fit-content;
}
</style>

<div class="main" ontouchstart="">
  <slot></slot>
</div>
`;

export class MscBuiltInAiPrompt extends HTMLElement {
  #data;
  #nodes;
  #config;

  constructor(config) {
    super();

    // template
    this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // data
    this.#data = {
      controller: '',
      session: ''
    };

    // nodes
    this.#nodes = {
      slot: this.shadowRoot.querySelector('slot')
    };

    // config
    this.#config = {
      ...defaults,
      ...config // new MscBuiltInAiPrompt(config)
    };

    // evts
    this._onClick = this._onClick.bind(this);
  }

  async connectedCallback() {
   const { config, error } = await _wcl.getWCConfig(this);

    if (error) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${error}`);
      this.remove();
      return;
    } else {
      this.#config = {
        ...this.#config,
        ...config
      };
    }

    // upgradeProperty
    Object.keys(defaults).forEach((key) => this.#upgradeProperty(key));

    // evts
    this.#data.controller = new AbortController();
    const signal = this.#data.controller.signal;
    this.#nodes.slot.addEventListener('click', this._onClick, { signal });
  
    // init
    await this.#statusCheck();
    if (this.status === 'available') {
      this.#fireEvent(custumEvents.ready);
    }
  }

  disconnectedCallback() {
    if (this.#data?.controller) {
      this.#data.controller.abort();
    }
  }

  static get observedAttributes() {
    return Object.keys(defaults); // MscBuiltInAiPrompt.observedAttributes
  }

  static get supportedEvents() {
    return Object.keys(custumEvents).map(
      (key) => {
        return custumEvents[key];
      }
    );
  }

  #upgradeProperty(prop) {
    let value;

    if (MscBuiltInAiPrompt.observedAttributes.includes(prop)) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        value = this[prop];
        delete this[prop];
      } else {
        if (booleanAttrs.includes(prop)) {
          value = (this.hasAttribute(prop) || this.#config[prop]) ? true : false;
        } else if (objectAttrs.includes(prop)) {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : JSON.stringify(this.#config[prop]);
        } else {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : this.#config[prop];
        }
      }

      this[prop] = value;
    }
  }

  async #statusCheck() {
    this.#config.status = !supported
      ? 'unsupported'
      : await window.LanguageModel.availability();

    this.dataset.status = this.#config.status;
  }

  get status() {
    return this.#config.status;
  }

  get inputUsage() {
    console.warn(`Removed in Chrome 147.0.7699.3 and later.`);
    return this.#data.session?.inputUsage || this.#data.session?.contextUsage;
  }

  get inputQuota() {
    console.warn(`Removed in Chrome 147.0.7699.3 and later.`);
    return this.#data.session?.inputQuota || this.#data.session?.contextWindow;
  }

  get contextUsage() {
    return this.#data.session?.contextUsage;
  }

  get contextWindow() {
    return this.#data.session?.contextWindow;
  }

  #fireEvent(evtName, detail) {
    this.dispatchEvent(new CustomEvent(evtName,
      {
        bubbles: true,
        composed: true,
        ...(detail && { detail })
      }
    ));
  }

  async #progress(evt) {
    const { loaded, total = 1 } = evt;
    const progress = Math.floor((loaded / total) * 100);

    if (progress === 100) {
      this.toggleAttribute('data-progress', false);
      await this.#statusCheck();
      this.#fireEvent(custumEvents.ready);
    } else {
      this.dataset.status = 'downloading';
      this.dataset.progress = progress;
      this.#fireEvent(custumEvents.progress, { progress });
    }
  }

  async _onClick() {
    if (['unavailable', 'unsupported'].includes(this.status)) {
      throw new Error(`Current browser doesn't support Built-in AI.`);
    }

    await this.#statusCheck();

    if (this.status === 'downloadable') {
      await this.create();
    }
  }

  destroy() {
    this.#data.session?.destroy?.();
  }

  async params() {
    if (['unavailable', 'unsupported'].includes(this.status)) {
      throw new Error(`Current browser doesn't support Built-in AI.`);
    }

    console.warn(`Removed in Chrome 147.0.7699.3 and later.`);

    return await window.LanguageModel?.params?.();
  }

  async measureInputUsage(content) {
    if (['unavailable', 'unsupported'].includes(this.status)) {
      throw new Error(`Current browser doesn't support Built-in AI.`);
    }

    console.warn(`Removed in Chrome 147.0.7699.3 and later.`);

    const session = await window.LanguageModel.create();
    // const count = await session.measureInputUsage(content);
    const count = session.measureInputUsage
      ? await session.measureInputUsage(content)
      : await session.measureContextUsage(content);
    session.destroy();

    return count;
  }

  async measureContextUsage(content) {
    if (['unavailable', 'unsupported'].includes(this.status)) {
      throw new Error(`Current browser doesn't support Built-in AI.`);
    }

    const session = await window.LanguageModel.create();
    const count = await session.measureContextUsage(content);
    session.destroy();

    return count;
  }

  async create(params = {}) {
    if (['unavailable', 'unsupported'].includes(this.status)) {
      throw new Error(`Current browser doesn't support Built-in AI.`);
    }

    const { multimodal, ...others } = params;

    this.destroy();

    const session = await window.LanguageModel.create({
      ...others,
      monitor: (m) => {
        m.addEventListener('downloadprogress', (evt) => {
          this.#progress(evt);
        });
      },
    });

    session.onquotaoverflow = session.oncontextoverflow = () => {
      this.#fireEvent(custumEvents.contextoverflow);
    };

    // multimodal
    if (multimodal && session.append) {
      await session.append(multimodal);
    }

    this.#data.session = session;
  }

  async prompt(data, option = {}) {
    if (['unavailable', 'unsupported'].includes(this.status)) {
      throw new Error(`Current browser doesn't support Built-in AI.`);
    }

    if (!this.#data.session?.prompt) {
      await this.create();
    }

    return this.#data.session.prompt(data, option);
  }

  async promptStreaming(data, option = {}) {
    if (['unavailable', 'unsupported'].includes(this.status)) {
      throw new Error(`Current browser doesn't support Built-in AI.`);
    }

    if (!this.#data.session?.promptStreaming) {
      await this.create();
    }

    return this.#data.session.promptStreaming(data, option);
  }
}

// define web component
const S = _wcl.supports();
const T = _wcl.classToTagName('MscBuiltInAiPrompt');
if (S.customElements && S.shadowDOM && S.template && !window.customElements.get(T)) {
  window.customElements.define(_wcl.classToTagName('MscBuiltInAiPrompt'), MscBuiltInAiPrompt);
}