export  class  mapping {
 ServiceItemsMapping  = new Map<string ,string>([
    ['團體輔導','1'],
    ['入班輔導','2'],
    ['家長諮詢','3'],
    ['教師諮詢','4'],
    ['個案會議','5'],
    ['心理測驗','6'],
    ['安心服務','7'],
    ['家庭處遇','8'],
    ['資源連結','9'],
    ['系統會談','10'],
    ['學生諮詢','11'],
    ['臨案協處','12'],
    ['方案計畫','13'],
    ['各項宣講','14'],
    ['危機處理','15'],
    ['轉銜輔導','16'],
    ['其他','17']
])


/**  學生身分*/
   StudentStatusMaps = new Map<string ,string>
([
['以下皆非','0'],
['智能障礙','1'],
['視覺障礙','2'],
['聽覺障礙','3'],
['語言障礙','4'],
['肢體障礙','5'],
['腦性麻痺','6'],
['身體病弱','7'],
['情緒行為障礙','8'],
['學習障礙','9'],
['多重障礙','10'],
['自閉症','11'],
['發展遲緩','12'],
['其他障礙','13']
])


/** 教師身分 */
     ReportTeacherRole = new Map<string ,string>
([
    ['專任輔導教師','1'],
['兼任輔導教師','2'],
['合聘專任輔導教師-主聘學校','3'],
['合聘專任輔導教師-從聘學校','4']
])


/** 服務對象 */
   ServiceTargetMaps = new Map<string ,string>
([
['一年級','1'],
['二年級','2'],
['三年級','3'],
['四年級','4'],
['五年級','5'],
['六年級','6'],
['七年級','7'],
['八年級','8'],
['九年級','9'],
['高一','10'],
['高二','11'],
['高三','12'],
['教職員','13'],
['家長','14'],
['專業人員','15']
])


/** 個案來源 多選 */
   CaseSourcesMapping  =new Map<string ,string>(
   [
    ['學生主動求助','1'],
    ['家長轉介','2'],
    ['教師轉介（含教職員工）','3'],
    ['同儕轉介','4'],
    ['輔導老師約談','5'],
    ['線上預約管道（僅限高中階段）','6'],
    ['其他','7'],
   ]
)
}