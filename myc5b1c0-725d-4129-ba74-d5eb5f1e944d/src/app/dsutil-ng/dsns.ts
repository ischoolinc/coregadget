import { DSAHttpClient } from "./dsa_http_client";

const localMap = new Map<string, string>();

export const DSNS = 'https://dsns.ischool.com.tw';

/** 註冊本地端 DSNS */
export function registerLocal(dsns: string, url: string) {
    localMap.set(dsns, url);
}

export async function resolveDSNS(dsns: string) {

    // 如果本地端有註冊就直接回傳。
    if (localMap.has(dsns)) { return localMap.get(dsns); }

    const rsp = await DSAHttpClient.get(`${DSNS}/${dsns}?noredirect`);

    if(rsp.body!.indexOf('Exception') >= 0) {
        throw new Error(`DSNS Not Found(${dsns}).`);
    }

    return rsp.body!.replace('?noredirect', '');
}
