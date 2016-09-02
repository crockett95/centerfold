import { IFrameOptions } from './i-frame-options';
import emptyDocument from './templates/empty.html';

export default class Frame {
  private options: IFrameOptions;
  private element: HTMLIFrameElement;

  private get height(): number {
    return this.options.height != null ? this.options.height : 2000;
  }

  private get width(): number {
    return this.options.width != null ? this.options.width : 2000;
  }

  constructor(container: Element);
  constructor(container: Element, callback: (frame: Frame) => Promise<{}>);
  constructor(
    container: Element,
    options: IFrameOptions,
    callback: (frame: Frame) => void
  );
  constructor(
    private container: Element,
    options: any = {},
    callback?: (frame: Frame) => void
  ) {
    if (typeof options === 'function') {
      callback = options;
      options = {}
    }

    this.options = options;

    this.initFrame().then(callback);
  }

  private initFrame(): Promise<Frame> {
    let iframe = document.createElement('iframe');
    iframe.setAttribute('height', this.height.toString());
    iframe.setAttribute('width', this.width.toString());
    iframe.setAttribute('frameborder', '0');

    this.element = iframe;

    let promise = new Promise((resolve, reject) => {
      this.setIframeContent();
      resolve();
    });

    return promise;
  }

  private setIframeContent(): void {
    if (this.options.src != null) {
      this.element.setAttribute('src', this.options.src);
    } else {
      let html = emptyDocument;

      this.element.contentWindow.document.open();
      this.element.contentWindow.document.write(html);

      this.element.contentWindow.document.body.innerHTML =
        this.options.html || '';
      this.element.contentWindow.document.close();
    }
  }
}
