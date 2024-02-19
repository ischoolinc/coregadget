/* eslint-disable @typescript-eslint/no-explicit-any */
interface Gadget {
    autofit(element: HTMLElement): void;
    backToMenu(killstatus?: boolean): void;
    connect(accesspoint: string, account: string, password: string): Promise<any>; // 假設 connect 方法返回 Promise，您可以根據實際情況進行調整
    getApplication(): any; // 返回類型根據實際情況調整
    getContract(contractName: string): any; // 同上
    getGroupGadgets(): any[]; // 假設它返回 gadget 陣列
    getLanguage(): string;
    getPreference(callBack: (pref: any) => void): void;
    getSize(): { width: number; height: number };
    getUserInfo(): any; // 返回類型根據實際情況調整
    onBookmarkChanged(callBack: (bookmark: any) => void): void;
    onLanguageChanged(callBack: (language: string) => void): void;
    onLeave(callBack: () => void): void;
    onSizeChanged(callBack: (size: { width: number; height: number }) => void): void;
    params: { system_position: string; system_type: string };
    setBookmark(bookmark: any): void;
    setExterior(conf: any): void; // 參數類型根據實際情況調整
    setPreference(obj: any): void;
}
  
  declare const gadget: Gadget;