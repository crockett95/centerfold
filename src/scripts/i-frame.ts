import { IFrameOptions } from './i-frame-options';

export interface IFrame {
  constructor(container: Element);
  constructor(container: Element, options: IFrameOptions);
  constructor(container: Element, callback: (frame: IFrame) => void);
  constructor(
    container: Element,
    options: IFrameOptions,
    callback: (frame: IFrame) => void
  );

  reset(): void;

  reload(callback: (frame: IFrame) => void): void;
  remove(): void;
  // get(selector: string): IElement;
  // getAll(selector: string): IElement[];
  // add(html: string): IElement;
}
