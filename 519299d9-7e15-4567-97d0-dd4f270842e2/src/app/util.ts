
export class Util {

  /**
   * 去除 html tag。
   * @param htmlstr html 字串。
   */
  public static trimHtml(htmlstr: string) {

    if (!htmlstr) { return '' };

    const div = document.createElement("div");
    div.innerHTML = htmlstr;
    return div.textContent || div.innerText || "";
  }
}
