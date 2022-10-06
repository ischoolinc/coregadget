/** 
 * https://www.npmjs.com/package/xml-js
 * 
 * This library provides 4 functions: 
 * js2xml(), json2xml(), xml2js(), and xml2json(). 
 * */
const xj = window.xj;

export function toJson(xmlString: string): ElementCompact {
    return xj.xml2js(xmlString, { compact: true });
}

export function toXml(jsonObj: ElementCompact, rootName?: string) {

    if (rootName) {
        const root: any = {};
        root[rootName] = jsonObj;
        return xj.js2xml(root, { compact: true, spaces: 4 });
    } else {
        return xj.js2xml(jsonObj, { compact: true, spaces: 4 });
    }
}
