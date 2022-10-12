/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare const gadget: any;
declare const $: any;
declare const xml2json: any;
declare const dsutil: any;
declare const parseXml: any;

/** 以下為 xml-js 的定議(dsutil 用到)。 */
declare interface Window {
  xj: any;
}
declare interface ElementCompact {
    [key: string]: any
}

declare interface Element {
}

