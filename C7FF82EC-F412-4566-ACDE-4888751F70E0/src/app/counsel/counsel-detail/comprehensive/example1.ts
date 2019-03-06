export default [
  {
    "Subject": "本人概況",
    "QuestionGroup": {
      "Group": "基本資料",
      "QuestionQuery": [
        {
          "Query": "出生地",
          "QuestionText": {
            "QuestionCode": "Q10000003",
            "Text": "",
            "Type": "單選",
            "Require": "true",
            "RequireLink": "",
            "Option": [
              {
                "AnswerID": "2503377",
                "OptionCode": "10000003",
                "OptionText": "其他：%TEXT2%",
                "AnswerChecked": "true",
                "AnswerComplete": "true",
                "AnswerMatrix": "[\"其他：\",\"TEST\"]",
                "AnswerValue": "其他：TEST"
              },
              {
                "AnswerID": "2503378",
                "OptionCode": "10000004",
                "OptionText": "台灣地區，縣市：%TEXT2%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            ]
          }
        },
        {
          "Query": "學前教育",
          "QuestionText": {
            "QuestionCode": "Q10000004",
            "Text": "",
            "Type": "單選",
            "Require": "true",
            "RequireLink": "",
            "Option": [
              {
                "AnswerID": "2503379",
                "OptionCode": "10000005",
                "OptionText": "曾就讀幼兒園",
                "AnswerChecked": "false",
                "AnswerComplete": "true",
                "AnswerMatrix": "[\"曾就讀幼兒園\"]",
                "AnswerValue": "曾就讀幼兒園"
              },
              {
                "AnswerID": "2503380",
                "OptionCode": "10000006",
                "OptionText": "未曾就讀幼兒園",
                "AnswerChecked": "true",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            ]
          }
        },
        {
          "Query": "學生國籍",
          "QuestionText": [
            {
              "QuestionCode": "Q10000005",
              "Text": "國籍",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503381",
                "OptionCode": "10000007",
                "OptionText": "%TEXT2%",
                "AnswerChecked": "false",
                "AnswerComplete": "true",
                "AnswerMatrix": "加拿大",
                "AnswerValue": "加拿大"
              }
            },
            {
              "QuestionCode": "Q10000006",
              "Text": "護照名",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503382",
                "OptionCode": "10000008",
                "OptionText": "%TEXT4%",
                "AnswerChecked": "false",
                "AnswerComplete": "true",
                "AnswerMatrix": "12221",
                "AnswerValue": "12221"
              }
            }
          ]
        },
        {
          "Query": "學生國籍二",
          "QuestionText": [
            {
              "QuestionCode": "Q10000007",
              "Text": "國籍",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503383",
                "OptionCode": "10000009",
                "OptionText": "%TEXT2%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "",
                "AnswerValue": ""
              }
            },
            {
              "QuestionCode": "Q10000008",
              "Text": "護照名",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503384",
                "OptionCode": "10000010",
                "OptionText": "%TEXT4%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "",
                "AnswerValue": ""
              }
            }
          ]
        },
        {
          "Query": "學生國籍三",
          "QuestionText": [
            {
              "QuestionCode": "Q10000009",
              "Text": "國籍",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503385",
                "OptionCode": "10000011",
                "OptionText": "%TEXT2%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "",
                "AnswerValue": ""
              }
            },
            {
              "QuestionCode": "Q10000010",
              "Text": "護照名",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503386",
                "OptionCode": "10000012",
                "OptionText": "%TEXT4%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "",
                "AnswerValue": ""
              }
            }
          ]
        },
        {
          "Query": "學生身分",
          "QuestionText": {
            "QuestionCode": "Q10000011",
            "Text": "",
            "Type": "複選",
            "Require": "true",
            "RequireLink": "",
            "Option": [
              {
                "AnswerID": "2503387",
                "OptionCode": "10000013",
                "OptionText": "邊疆生（蒙疆生）",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503388",
                "OptionCode": "10000014",
                "OptionText": "大陸來台依親者",
                "AnswerChecked": "true",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503389",
                "OptionCode": "10000015",
                "OptionText": "多胞胎",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503390",
                "OptionCode": "10000016",
                "OptionText": "港澳生",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503391",
                "OptionCode": "10000017",
                "OptionText": "功勳子女",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503392",
                "OptionCode": "10000018",
                "OptionText": "海外僑生（回國僑生）國籍：%TEXT2%",
                "AnswerChecked": "true",
                "AnswerComplete": "true",
                "AnswerMatrix": "[\"海外僑生（回國僑生）國籍：\",\"加拿大\"]",
                "AnswerValue": "海外僑生（回國僑生）國籍：加拿大"
              },
              {
                "AnswerID": "2503393",
                "OptionCode": "10000019",
                "OptionText": "教職員子女",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503394",
                "OptionCode": "10000020",
                "OptionText": "境外優季科學技術人才子女",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503395",
                "OptionCode": "10000021",
                "OptionText": "派外人員子女",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503396",
                "OptionCode": "10000022",
                "OptionText": "清寒證明",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503397",
                "OptionCode": "10000023",
                "OptionText": "退伍軍人子女",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503398",
                "OptionCode": "10000024",
                "OptionText": "外籍生",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503399",
                "OptionCode": "10000025",
                "OptionText": "現役軍人子女",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503400",
                "OptionCode": "10000026",
                "OptionText": "新住民子女（家長其中一方為外籍者）",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503401",
                "OptionCode": "10000027",
                "OptionText": "顏面傷殘",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503402",
                "OptionCode": "10000028",
                "OptionText": "一般生",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503403",
                "OptionCode": "10000029",
                "OptionText": "原住民",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503404",
                "OptionCode": "10000030",
                "OptionText": "資優生",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            ]
          }
        },
        {
          "Query": "家人身心障礙",
          "QuestionText": [
            {
              "QuestionCode": "Q10000012",
              "Text": "領有身心障礙手冊",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503405",
                  "OptionCode": "10000031",
                  "OptionText": "否",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503406",
                  "OptionCode": "10000032",
                  "OptionText": "是",
                  "AnswerChecked": "true",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            },
            {
              "QuestionCode": "Q10000013",
              "Text": "身心障礙等級",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "10000032",
              "Option": {
                "AnswerID": "2503407",
                "OptionCode": "10000033",
                "OptionText": "%TEXT2%",
                "AnswerChecked": "false",
                "AnswerComplete": "true",
                "AnswerMatrix": "輕度",
                "AnswerValue": "輕度"
              }
            },
            {
              "QuestionCode": "Q10000014",
              "Text": "鑑定日期",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "10000032",
              "Option": {
                "AnswerID": "2503408",
                "OptionCode": "10000034",
                "OptionText": "%TEXT2%",
                "AnswerChecked": "false",
                "AnswerComplete": "true",
                "AnswerMatrix": "1972/1/20",
                "AnswerValue": "1972/1/20"
              }
            },
            {
              "QuestionCode": "Q10000015",
              "Text": "鑑定文號",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "10000032",
              "Option": {
                "AnswerID": "2503409",
                "OptionCode": "10000035",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "true",
                "AnswerMatrix": "C777777",
                "AnswerValue": "C777777"
              }
            },
            {
              "QuestionCode": "Q10000016",
              "Text": "身心障礙類別",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "10000032",
              "Option": {
                "AnswerID": "2503410",
                "OptionCode": "10000036",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "true",
                "AnswerMatrix": "視覺",
                "AnswerValue": "視覺"
              }
            }
          ]
        },
        {
          "Query": "學生身心障礙",
          "QuestionText": [
            {
              "QuestionCode": "Q10000017",
              "Text": "領有身心障礙手冊",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "10000098",
              "Option": [
                {
                  "AnswerID": "2503411",
                  "OptionCode": "10000037",
                  "OptionText": "否",
                  "AnswerChecked": "true",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503412",
                  "OptionCode": "10000038",
                  "OptionText": "是",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            },
            {
              "QuestionCode": "Q10000018",
              "Text": "身心障礙等級",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "10000038",
              "Option": {
                "AnswerID": "2503413",
                "OptionCode": "10000039",
                "OptionText": "%TEXT2%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "",
                "AnswerValue": ""
              }
            },
            {
              "QuestionCode": "Q10000019",
              "Text": "鑑定日期",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "10000038",
              "Option": {
                "AnswerID": "2503414",
                "OptionCode": "10000040",
                "OptionText": "%TEXT2%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "",
                "AnswerValue": ""
              }
            },
            {
              "QuestionCode": "Q10000020",
              "Text": "鑑定文號",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "10000038",
              "Option": {
                "AnswerID": "2503415",
                "OptionCode": "10000041",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "",
                "AnswerValue": ""
              }
            },
            {
              "QuestionCode": "Q10000021",
              "Text": "身心障礙類別",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "10000038",
              "Option": {
                "AnswerID": "2503416",
                "OptionCode": "10000042",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "",
                "AnswerValue": ""
              }
            }
          ]
        },
        {
          "Query": "身高體重",
          "QuestionText": [
            {
              "QuestionCode": "Q10000022",
              "Text": "身高",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503417",
                "OptionCode": "10000043",
                "OptionText": "%TEXT1%",
                "AnswerChecked": "false",
                "AnswerComplete": "true",
                "AnswerMatrix": "90",
                "AnswerValue": "90"
              }
            },
            {
              "QuestionCode": "Q10000023",
              "Text": "體重",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503418",
                "OptionCode": "10000044",
                "OptionText": "%TEXT1%",
                "AnswerChecked": "false",
                "AnswerComplete": "true",
                "AnswerMatrix": "12",
                "AnswerValue": "12"
              }
            }
          ]
        },
        {
          "Query": "血型",
          "QuestionText": {
            "QuestionCode": "Q10000024",
            "Text": "",
            "Type": "單選",
            "Require": "true",
            "RequireLink": "",
            "Option": [
              {
                "AnswerID": "2503419",
                "OptionCode": "10000045",
                "OptionText": "O",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503420",
                "OptionCode": "10000046",
                "OptionText": "A",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503421",
                "OptionCode": "10000047",
                "OptionText": "AB",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503422",
                "OptionCode": "10000048",
                "OptionText": "B",
                "AnswerChecked": "true",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503423",
                "OptionCode": "10000049",
                "OptionText": "其他%TEXT1%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            ]
          }
        },
        {
          "Query": "宗教",
          "QuestionText": {
            "QuestionCode": "Q10000025",
            "Text": "",
            "Type": "單選",
            "Require": "true",
            "RequireLink": "",
            "Option": [
              {
                "AnswerID": "2503424",
                "OptionCode": "10000050",
                "OptionText": "道教",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503425",
                "OptionCode": "10000051",
                "OptionText": "佛教",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503426",
                "OptionCode": "10000052",
                "OptionText": "回教",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503427",
                "OptionCode": "10000053",
                "OptionText": "基督教",
                "AnswerChecked": "true",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503428",
                "OptionCode": "10000054",
                "OptionText": "其他%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503429",
                "OptionCode": "10000055",
                "OptionText": "天主教",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503430",
                "OptionCode": "10000056",
                "OptionText": "無",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            ]
          }
        },
        {
          "Query": "原住民",
          "QuestionText": [
            {
              "QuestionCode": "Q10000026",
              "Text": "原住民血統",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "10000029",
              "Option": [
                {
                  "AnswerID": "2503431",
                  "OptionCode": "10000057",
                  "OptionText": "否",
                  "AnswerChecked": "true",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503432",
                  "OptionCode": "10000058",
                  "OptionText": "是",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            },
            {
              "QuestionCode": "Q10000027",
              "Text": "原住民親屬稱謂",
              "Type": "複選",
              "Require": "true",
              "RequireLink": "10000058",
              "Option": [
                {
                  "AnswerID": "2503433",
                  "OptionCode": "10000059",
                  "OptionText": "父",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503434",
                  "OptionCode": "10000060",
                  "OptionText": "母",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            },
            {
              "QuestionCode": "Q10000028",
              "Text": "原住民族別",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "10000058",
              "Option": {
                "AnswerID": "2503435",
                "OptionCode": "10000061",
                "OptionText": "%TEXT2%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          ]
        }
      ]
    }
  },
  {
    "Subject": "緊急聯絡資料",
    "QuestionGroup": [
      {
        "Group": "緊急聯絡人",
        "QuestionQuery": [
          {
            "Query": "順位1",
            "QuestionText": [
              {
                "QuestionCode": "Q10000029",
                "Text": "姓名",
                "Type": "填答",
                "Require": "true",
                "RequireLink": "",
                "Option": {
                  "AnswerID": "2503436",
                  "OptionCode": "10000062",
                  "OptionText": "%TEXT3%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "",
                  "AnswerValue": ""
                }
              },
              {
                "QuestionCode": "Q10000030",
                "Text": "電話(H)",
                "Type": "填答",
                "Require": "true",
                "RequireLink": "",
                "Option": {
                  "AnswerID": "2503437",
                  "OptionCode": "10000063",
                  "OptionText": "%TEXT3%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "",
                  "AnswerValue": ""
                }
              },
              {
                "QuestionCode": "Q10000031",
                "Text": "電話(M)",
                "Type": "填答",
                "Require": "true",
                "RequireLink": "",
                "Option": {
                  "AnswerID": "2503438",
                  "OptionCode": "10000064",
                  "OptionText": "%TEXT3%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "",
                  "AnswerValue": ""
                }
              },
              {
                "QuestionCode": "Q10000032",
                "Text": "電話(O)",
                "Type": "填答",
                "Require": "true",
                "RequireLink": "",
                "Option": {
                  "AnswerID": "2503439",
                  "OptionCode": "10000065",
                  "OptionText": "%TEXT3%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "",
                  "AnswerValue": ""
                }
              }
            ]
          },
          {
            "Query": "順位2",
            "QuestionText": [
              {
                "QuestionCode": "Q10000033",
                "Text": "姓名",
                "Type": "填答",
                "Require": "true",
                "RequireLink": "",
                "Option": {
                  "AnswerID": "2503440",
                  "OptionCode": "10000066",
                  "OptionText": "%TEXT3%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "",
                  "AnswerValue": ""
                }
              },
              {
                "QuestionCode": "Q10000034",
                "Text": "電話(H)",
                "Type": "填答",
                "Require": "true",
                "RequireLink": "",
                "Option": {
                  "AnswerID": "2503441",
                  "OptionCode": "10000067",
                  "OptionText": "%TEXT3%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "",
                  "AnswerValue": ""
                }
              },
              {
                "QuestionCode": "Q10000035",
                "Text": "電話(M)",
                "Type": "填答",
                "Require": "true",
                "RequireLink": "",
                "Option": {
                  "AnswerID": "2503442",
                  "OptionCode": "10000068",
                  "OptionText": "%TEXT3%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "",
                  "AnswerValue": ""
                }
              },
              {
                "QuestionCode": "Q10000036",
                "Text": "電話(O)",
                "Type": "填答",
                "Require": "true",
                "RequireLink": "",
                "Option": {
                  "AnswerID": "2503443",
                  "OptionCode": "10000069",
                  "OptionText": "%TEXT3%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "",
                  "AnswerValue": ""
                }
              }
            ]
          },
          {
            "Query": "順位3",
            "QuestionText": [
              {
                "QuestionCode": "Q10000037",
                "Text": "姓名",
                "Type": "填答",
                "Require": "true",
                "RequireLink": "",
                "Option": {
                  "AnswerID": "2503444",
                  "OptionCode": "10000070",
                  "OptionText": "%TEXT3%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "",
                  "AnswerValue": ""
                }
              },
              {
                "QuestionCode": "Q10000038",
                "Text": "電話(H)",
                "Type": "填答",
                "Require": "true",
                "RequireLink": "",
                "Option": {
                  "AnswerID": "2503445",
                  "OptionCode": "10000071",
                  "OptionText": "%TEXT3%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "",
                  "AnswerValue": ""
                }
              },
              {
                "QuestionCode": "Q10000039",
                "Text": "電話(M)",
                "Type": "填答",
                "Require": "true",
                "RequireLink": "",
                "Option": {
                  "AnswerID": "2503446",
                  "OptionCode": "10000072",
                  "OptionText": "%TEXT3%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "",
                  "AnswerValue": ""
                }
              },
              {
                "QuestionCode": "Q10000040",
                "Text": "電話(O)",
                "Type": "填答",
                "Require": "true",
                "RequireLink": "",
                "Option": {
                  "AnswerID": "2503447",
                  "OptionCode": "10000073",
                  "OptionText": "%TEXT3%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "",
                  "AnswerValue": ""
                }
              }
            ]
          }
        ]
      },
      {
        "Group": "就醫資訊",
        "QuestionQuery": {
          "Query": "就醫資訊",
          "QuestionText": [
            {
              "QuestionCode": "Q10000041",
              "Text": "健保",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503448",
                  "OptionCode": "10000074",
                  "OptionText": "有",
                  "AnswerChecked": "true",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503449",
                  "OptionCode": "10000075",
                  "OptionText": "無",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            },
            {
              "QuestionCode": "Q10000042",
              "Text": "緊急送醫醫院",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503450",
                "OptionCode": "10000076",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "true",
                "AnswerMatrix": "台大",
                "AnswerValue": "台大"
              }
            }
          ]
        }
      }
    ]
  },
  {
    "Subject": "健康狀況",
    "QuestionGroup": [
      {
        "Group": "病史",
        "QuestionQuery": [
          {
            "Query": "生理概況",
            "QuestionText": {
              "QuestionCode": "Q10000043",
              "Text": "",
              "Type": "複選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503451",
                  "OptionCode": "10000096",
                  "OptionText": "多重障礙",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503452",
                  "OptionCode": "10000097",
                  "OptionText": "近視",
                  "AnswerChecked": "true",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503453",
                  "OptionCode": "10000098",
                  "OptionText": "領有身心障礙手冊",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503454",
                  "OptionCode": "10000099",
                  "OptionText": "其他%TEXT3%",
                  "AnswerChecked": "true",
                  "AnswerComplete": "true",
                  "AnswerMatrix": "[\"其他\",\"氣喘\"]",
                  "AnswerValue": "其他氣喘"
                },
                {
                  "AnswerID": "2503455",
                  "OptionCode": "10000100",
                  "OptionText": "其他視覺障礙",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503456",
                  "OptionCode": "10000101",
                  "OptionText": "聽覺障礙",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503457",
                  "OptionCode": "10000102",
                  "OptionText": "無",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503458",
                  "OptionCode": "10000103",
                  "OptionText": "肢體障礙",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503459",
                  "OptionCode": "10000104",
                  "OptionText": "智能不足",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503460",
                  "OptionCode": "10000105",
                  "OptionText": "自閉症",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "曾患特殊疾病",
            "QuestionText": {
              "QuestionCode": "Q10000044",
              "Text": "",
              "Type": "複選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503461",
                  "OptionCode": "10000080",
                  "OptionText": "癌症",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503462",
                  "OptionCode": "10000081",
                  "OptionText": "蠶豆症",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503463",
                  "OptionCode": "10000082",
                  "OptionText": "到目前為止身體狀況一切正常",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503464",
                  "OptionCode": "10000083",
                  "OptionText": "癲癇",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503465",
                  "OptionCode": "10000084",
                  "OptionText": "肺結核",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503466",
                  "OptionCode": "10000085",
                  "OptionText": "過敏症",
                  "AnswerChecked": "true",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503467",
                  "OptionCode": "10000086",
                  "OptionText": "腦炎",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503468",
                  "OptionCode": "10000087",
                  "OptionText": "其他%TEXT3%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503469",
                  "OptionCode": "10000088",
                  "OptionText": "氣喘",
                  "AnswerChecked": "true",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503470",
                  "OptionCode": "10000089",
                  "OptionText": "熱痙攣",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503471",
                  "OptionCode": "10000090",
                  "OptionText": "腎臟病",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503472",
                  "OptionCode": "10000091",
                  "OptionText": "糖尿病",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503473",
                  "OptionCode": "10000092",
                  "OptionText": "小兒麻痺",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503474",
                  "OptionCode": "10000093",
                  "OptionText": "心臟病",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503475",
                  "OptionCode": "10000094",
                  "OptionText": "血友病",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503476",
                  "OptionCode": "10000095",
                  "OptionText": "重大手術",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "病史目前情況",
            "QuestionText": {
              "QuestionCode": "Q10000045",
              "Text": "",
              "Type": "單選",
              "Require": "false",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503477",
                  "OptionCode": "10000077",
                  "OptionText": "未痊癒，但目前不需治療",
                  "AnswerChecked": "true",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503478",
                  "OptionCode": "10000078",
                  "OptionText": "已痊癒",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503479",
                  "OptionCode": "10000079",
                  "OptionText": "正接受治療",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          }
        ]
      },
      {
        "Group": "過敏狀況",
        "QuestionQuery": [
          {
            "Query": "過敏（例如：呼吸窘迫、休克、全身性蕁麻疹）",
            "QuestionText": {
              "QuestionCode": "Q10000046",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "10000085",
              "Option": [
                {
                  "AnswerID": "2503480",
                  "OptionCode": "10000106",
                  "OptionText": "有",
                  "AnswerChecked": "true",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503481",
                  "OptionCode": "10000107",
                  "OptionText": "無",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "目前用藥情形",
            "QuestionText": {
              "QuestionCode": "Q10000047",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "10000106",
              "Option": {
                "AnswerID": "2503482",
                "OptionCode": "10000108",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "true",
                "AnswerMatrix": "發病時才使用",
                "AnswerValue": "發病時才使用"
              }
            }
          },
          {
            "Query": "請說明會造成過敏反應的物質是",
            "QuestionText": {
              "QuestionCode": "Q10000048",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "10000106",
              "Option": {
                "AnswerID": "2503483",
                "OptionCode": "10000109",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "上述疾病最近一次發病日期",
            "QuestionText": {
              "QuestionCode": "Q10000049",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "10000106",
              "Option": {
                "AnswerID": "2503484",
                "OptionCode": "10000110",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "診斷醫院",
            "QuestionText": {
              "QuestionCode": "Q10000050",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "10000106",
              "Option": {
                "AnswerID": "2503485",
                "OptionCode": "10000111",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "",
                "AnswerValue": ""
              }
            }
          }
        ]
      },
      {
        "Group": "日常活動",
        "QuestionQuery": [
          {
            "Query": "活動需限制，如體育課，原因",
            "QuestionText": {
              "QuestionCode": "Q10000051",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503486",
                "OptionCode": "10000112",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "日常生活活動正常",
            "QuestionText": {
              "QuestionCode": "Q10000052",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503487",
                  "OptionCode": "10000113",
                  "OptionText": "否",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503488",
                  "OptionCode": "10000114",
                  "OptionText": "是",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "特殊疾病緊急處理方式",
            "QuestionText": {
              "QuestionCode": "Q10000053",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503489",
                "OptionCode": "10000115",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "無法正常活動原因",
            "QuestionText": {
              "QuestionCode": "Q10000054",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "10000113",
              "Option": {
                "AnswerID": "2503490",
                "OptionCode": "10000116",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          }
        ]
      }
    ]
  },
  {
    "Subject": "家庭狀況",
    "QuestionGroup": [
      {
        "Group": "家庭生活狀況",
        "QuestionQuery": [
          {
            "Query": "單親",
            "QuestionText": {
              "QuestionCode": "Q10000055",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503491",
                  "OptionCode": "10000117",
                  "OptionText": "否",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503492",
                  "OptionCode": "10000118",
                  "OptionText": "是",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "父母離婚",
            "QuestionText": {
              "QuestionCode": "Q10000059",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503493",
                  "OptionCode": "10000131",
                  "OptionText": "否",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503494",
                  "OptionCode": "10000132",
                  "OptionText": "是，從父",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503495",
                  "OptionCode": "10000133",
                  "OptionText": "是，從母",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503496",
                  "OptionCode": "10000134",
                  "OptionText": "是，其他%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "父母是否為大陸配偶",
            "QuestionText": {
              "QuestionCode": "Q10000060",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503497",
                  "OptionCode": "10000135",
                  "OptionText": "父，省份%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503498",
                  "OptionCode": "10000136",
                  "OptionText": "父母皆否",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503499",
                  "OptionCode": "10000137",
                  "OptionText": "母，省份%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "父母是否為外籍配偶",
            "QuestionText": {
              "QuestionCode": "Q10000061",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503500",
                  "OptionCode": "10000138",
                  "OptionText": "父，國籍%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503501",
                  "OptionCode": "10000139",
                  "OptionText": "父母皆否",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503502",
                  "OptionCode": "10000140",
                  "OptionText": "母，國籍%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "父母是否為原住民",
            "QuestionText": {
              "QuestionCode": "Q10000062",
              "Text": "",
              "Type": "複選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503503",
                  "OptionCode": "10000141",
                  "OptionText": "父，平地，族別%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503504",
                  "OptionCode": "10000142",
                  "OptionText": "父，山地，族別%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503505",
                  "OptionCode": "10000143",
                  "OptionText": "父母皆否",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503506",
                  "OptionCode": "10000144",
                  "OptionText": "母，平地，族別%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503507",
                  "OptionCode": "10000145",
                  "OptionText": "母，山地，族別%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "父親管教方式",
            "QuestionText": {
              "QuestionCode": "Q10000064",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503508",
                  "OptionCode": "10000148",
                  "OptionText": "放任式",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503509",
                  "OptionCode": "10000149",
                  "OptionText": "民主式",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503510",
                  "OptionCode": "10000150",
                  "OptionText": "權威式",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "隔代教養",
            "QuestionText": {
              "QuestionCode": "Q10000065",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503511",
                  "OptionCode": "10000151",
                  "OptionText": "否",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503512",
                  "OptionCode": "10000152",
                  "OptionText": "是",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "寄親",
            "QuestionText": {
              "QuestionCode": "Q10000066",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503513",
                  "OptionCode": "10000153",
                  "OptionText": "否",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503514",
                  "OptionCode": "10000154",
                  "OptionText": "是",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "家庭關係",
            "QuestionText": {
              "QuestionCode": "Q10000067",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503515",
                  "OptionCode": "10000155",
                  "OptionText": "其他，%Text2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503516",
                  "OptionCode": "10000156",
                  "OptionText": "與(外)父母較親近",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503517",
                  "OptionCode": "10000157",
                  "OptionText": "與父親較親近",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503518",
                  "OptionCode": "10000158",
                  "OptionText": "與母親較親近",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503519",
                  "OptionCode": "10000159",
                  "OptionText": "與兄弟姊妹較親近",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "家庭管教",
            "QuestionText": {
              "QuestionCode": "Q10000068",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503520",
                  "OptionCode": "10000160",
                  "OptionText": "(外)祖父為主",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503521",
                  "OptionCode": "10000161",
                  "OptionText": "(外)祖母為主",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503522",
                  "OptionCode": "10000162",
                  "OptionText": "父親為主",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503523",
                  "OptionCode": "10000163",
                  "OptionText": "寄養家庭",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503524",
                  "OptionCode": "10000164",
                  "OptionText": "母親為主",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503525",
                  "OptionCode": "10000165",
                  "OptionText": "其他，%Text2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "家庭氣氛",
            "QuestionText": {
              "QuestionCode": "Q10000069",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503526",
                  "OptionCode": "10000166",
                  "OptionText": "不和諧",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503527",
                  "OptionCode": "10000167",
                  "OptionText": "和諧",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503528",
                  "OptionCode": "10000168",
                  "OptionText": "很不和諧",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503529",
                  "OptionCode": "10000169",
                  "OptionText": "很和諧",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503530",
                  "OptionCode": "10000170",
                  "OptionText": "普通",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "母親管教方式",
            "QuestionText": {
              "QuestionCode": "Q10000071",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503531",
                  "OptionCode": "10000173",
                  "OptionText": "放任式",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503532",
                  "OptionCode": "10000174",
                  "OptionText": "民主式",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503533",
                  "OptionCode": "10000175",
                  "OptionText": "權威式",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "親子年齡差距45歲以上",
            "QuestionText": {
              "QuestionCode": "Q10000072",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503534",
                  "OptionCode": "10000176",
                  "OptionText": "否",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503535",
                  "OptionCode": "10000177",
                  "OptionText": "是，與父相差%TEXT1%歲與母相差_%TEXT1%歲",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "習慣語言",
            "QuestionText": {
              "QuestionCode": "Q10000073",
              "Text": "",
              "Type": "複選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503536",
                  "OptionCode": "10000178",
                  "OptionText": "國語",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503537",
                  "OptionCode": "10000179",
                  "OptionText": "客家語",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503538",
                  "OptionCode": "10000180",
                  "OptionText": "其他語言%Text2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503539",
                  "OptionCode": "10000181",
                  "OptionText": "台語",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503540",
                  "OptionCode": "10000182",
                  "OptionText": "英語",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503541",
                  "OptionCode": "10000183",
                  "OptionText": "原住民%Text2%族語系",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          }
        ]
      },
      {
        "Group": "監護人",
        "QuestionQuery": [
          {
            "Query": "監護人出生年",
            "QuestionText": {
              "QuestionCode": "Q10000074",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503542",
                "OptionCode": "10000184",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "監護人地址",
            "QuestionText": {
              "QuestionCode": "Q10000075",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503543",
                "OptionCode": "10000185",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "監護人電話",
            "QuestionText": {
              "QuestionCode": "Q10000076",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503544",
                "OptionCode": "10000186",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "監護人工作機構（服務單位）",
            "QuestionText": {
              "QuestionCode": "Q10000077",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503545",
                "OptionCode": "10000188",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "監護人公司電話",
            "QuestionText": {
              "QuestionCode": "Q10000078",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503546",
                "OptionCode": "10000189",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "監護人關係",
            "QuestionText": {
              "QuestionCode": "Q10000079",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503547",
                "OptionCode": "10000190",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "監護人國籍",
            "QuestionText": {
              "QuestionCode": "Q10000080",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503548",
                "OptionCode": "10000191",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "監護人教育程度",
            "QuestionText": {
              "QuestionCode": "Q10000081",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503549",
                  "OptionCode": "10000192",
                  "OptionText": "博士",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503550",
                  "OptionCode": "10000193",
                  "OptionText": "不識字",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503551",
                  "OptionCode": "10000194",
                  "OptionText": "初中（職）",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503552",
                  "OptionCode": "10000195",
                  "OptionText": "高中（職）",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503553",
                  "OptionCode": "10000196",
                  "OptionText": "其他%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503554",
                  "OptionCode": "10000197",
                  "OptionText": "識字（未就學）",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503555",
                  "OptionCode": "10000198",
                  "OptionText": "碩士",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503556",
                  "OptionCode": "10000199",
                  "OptionText": "小學",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503557",
                  "OptionCode": "10000200",
                  "OptionText": "學士",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503558",
                  "OptionCode": "10000201",
                  "OptionText": "專科",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "監護人僑居地",
            "QuestionText": {
              "QuestionCode": "Q10000082",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503559",
                "OptionCode": "10000202",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "監護人通訊地址（通訊處）",
            "QuestionText": {
              "QuestionCode": "Q10000083",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503560",
                "OptionCode": "10000203",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "監護人現國籍",
            "QuestionText": {
              "QuestionCode": "Q10000084",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503561",
                "OptionCode": "10000204",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "監護人行動電話",
            "QuestionText": {
              "QuestionCode": "Q10000085",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503562",
                "OptionCode": "10000205",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "監護人姓名",
            "QuestionText": {
              "QuestionCode": "Q10000086",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503563",
                "OptionCode": "10000206",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "監護人性別",
            "QuestionText": {
              "QuestionCode": "Q10000087",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503564",
                "OptionCode": "10000207",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "監護人證號（身分證號/居留證號）",
            "QuestionText": {
              "QuestionCode": "Q10000088",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503565",
                "OptionCode": "10000208",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "監護人職稱",
            "QuestionText": {
              "QuestionCode": "Q10000089",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503566",
                "OptionCode": "10000209",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "監護人職業",
            "QuestionText": {
              "QuestionCode": "Q10000090",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503567",
                "OptionCode": "10000210",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "監護人e-mail",
            "QuestionText": {
              "QuestionCode": "Q10000091",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503568",
                "OptionCode": "10000211",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          }
        ]
      },
      {
        "Group": "經濟",
        "QuestionQuery": [
          {
            "Query": "家庭經濟狀況",
            "QuestionText": {
              "QuestionCode": "Q10000093",
              "Text": "",
              "Type": "複選",
              "Require": "true",
              "RequireLink": "10000022",
              "Option": [
                {
                  "AnswerID": "2503569",
                  "OptionCode": "10000214",
                  "OptionText": "曾申請過其他社會補助金",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503570",
                  "OptionCode": "10000215",
                  "OptionText": "曾申請學校清寒助學金",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503571",
                  "OptionCode": "10000216",
                  "OptionText": "領有中低收入戶證明",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503572",
                  "OptionCode": "10000217",
                  "OptionText": "貧困未領任何補助",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503573",
                  "OptionCode": "10000218",
                  "OptionText": "足以自給依食無缺",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "每星期零用錢（元）",
            "QuestionText": {
              "QuestionCode": "Q10000095",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503574",
                "OptionCode": "10000224",
                "OptionText": "%TEXT2%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "雙親單薪家庭",
            "QuestionText": {
              "QuestionCode": "Q10000096",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503575",
                  "OptionCode": "10000225",
                  "OptionText": "否",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503576",
                  "OptionCode": "10000226",
                  "OptionText": "是",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "雙薪家庭",
            "QuestionText": {
              "QuestionCode": "Q10000097",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503577",
                  "OptionCode": "10000227",
                  "OptionText": "否",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503578",
                  "OptionCode": "10000228",
                  "OptionText": "是",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "我覺得是否足夠",
            "QuestionText": {
              "QuestionCode": "Q10000098",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "10000224",
              "Option": [
                {
                  "AnswerID": "2503579",
                  "OptionCode": "10000229",
                  "OptionText": "不足",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503580",
                  "OptionCode": "10000230",
                  "OptionText": "剛好",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503581",
                  "OptionCode": "10000231",
                  "OptionText": "足夠",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          }
        ]
      },
      {
        "Group": "居住情形",
        "QuestionQuery": [
          {
            "Query": "本人住宿（住宿狀況）",
            "QuestionText": {
              "QuestionCode": "Q10000099",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503582",
                  "OptionCode": "10000232",
                  "OptionText": "寄居%TEXT2%家裡",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503583",
                  "OptionCode": "10000233",
                  "OptionText": "其他%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503584",
                  "OptionCode": "10000234",
                  "OptionText": "在家裡（學區內）",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503585",
                  "OptionCode": "10000235",
                  "OptionText": "在家裡（學區外）",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503586",
                  "OptionCode": "10000236",
                  "OptionText": "在外賃屋",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503587",
                  "OptionCode": "10000237",
                  "OptionText": "住校",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "單（寄）親或隔代教養原因",
            "QuestionText": {
              "QuestionCode": "Q10000100",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503588",
                  "OptionCode": "10000238",
                  "OptionText": "父母分居",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503589",
                  "OptionCode": "10000239",
                  "OptionText": "父母工作忙",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503590",
                  "OptionCode": "10000240",
                  "OptionText": "父母離婚",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503591",
                  "OptionCode": "10000241",
                  "OptionText": "父母雙亡",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503592",
                  "OptionCode": "10000242",
                  "OptionText": "父亡",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503593",
                  "OptionCode": "10000243",
                  "OptionText": "母亡",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503594",
                  "OptionCode": "10000244",
                  "OptionText": "其他%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "隔代教養單（寄）親家庭與同住者的關係",
            "QuestionText": {
              "QuestionCode": "Q10000101",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503595",
                  "OptionCode": "10000245",
                  "OptionText": "父",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503596",
                  "OptionCode": "10000246",
                  "OptionText": "母",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503597",
                  "OptionCode": "10000247",
                  "OptionText": "其他%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503598",
                  "OptionCode": "10000248",
                  "OptionText": "親戚%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503599",
                  "OptionCode": "10000249",
                  "OptionText": "外祖父",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503600",
                  "OptionCode": "10000250",
                  "OptionText": "外祖母",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503601",
                  "OptionCode": "10000251",
                  "OptionText": "祖父",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503602",
                  "OptionCode": "10000252",
                  "OptionText": "祖母",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "寄親住所",
            "QuestionText": {
              "QuestionCode": "Q10000102",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503603",
                  "OptionCode": "10000253",
                  "OptionText": "教養機構，名稱%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503604",
                  "OptionCode": "10000254",
                  "OptionText": "親友家，地址%TEXT5%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "居住地址",
            "QuestionText": {
              "QuestionCode": "Q10000103",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503605",
                "OptionCode": "10000255",
                "OptionText": "%TEXT5%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "居住環境",
            "QuestionText": {
              "QuestionCode": "Q10000104",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503606",
                  "OptionCode": "10000256",
                  "OptionText": "工礦區",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503607",
                  "OptionCode": "10000257",
                  "OptionText": "混和（住商工區）",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503608",
                  "OptionCode": "10000258",
                  "OptionText": "軍眷區",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503609",
                  "OptionCode": "10000259",
                  "OptionText": "農村",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503610",
                  "OptionCode": "10000260",
                  "OptionText": "山地",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503611",
                  "OptionCode": "10000261",
                  "OptionText": "商業區",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503612",
                  "OptionCode": "10000262",
                  "OptionText": "漁村",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503613",
                  "OptionCode": "10000263",
                  "OptionText": "住宅區",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          }
        ]
      },
      {
        "Group": "兄弟姊妹",
        "QuestionQuery": [
          {
            "Query": "家中排程",
            "QuestionText": {
              "QuestionCode": "Q10000105",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503614",
                "OptionCode": "10000264",
                "OptionText": "%TEXT1%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "我是獨生子(女)",
            "QuestionText": {
              "QuestionCode": "Q10000106",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503615",
                  "OptionCode": "10000265",
                  "OptionText": "否",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503616",
                  "OptionCode": "10000266",
                  "OptionText": "是",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "兄弟姊妹1_備註",
            "QuestionText": {
              "QuestionCode": "Q10000107",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503617",
                "OptionCode": "10000267",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹1_畢業/就讀學校",
            "QuestionText": {
              "QuestionCode": "Q10000108",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503618",
                "OptionCode": "10000268",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹1_稱謂",
            "QuestionText": {
              "QuestionCode": "Q10000109",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503619",
                "OptionCode": "10000269",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹1_出生年",
            "QuestionText": {
              "QuestionCode": "Q10000110",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503620",
                "OptionCode": "10000270",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹1_姓名",
            "QuestionText": {
              "QuestionCode": "Q10000111",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "10000265",
              "Option": {
                "AnswerID": "2503621",
                "OptionCode": "10000271",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹10_備註",
            "QuestionText": {
              "QuestionCode": "Q10000112",
              "Text": "",
              "Type": "單選",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503622",
                "OptionCode": "10000272",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹10_畢業/就讀學校",
            "QuestionText": {
              "QuestionCode": "Q10000113",
              "Text": "",
              "Type": "單選",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503623",
                "OptionCode": "10000273",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹10_稱謂",
            "QuestionText": {
              "QuestionCode": "Q10000114",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503624",
                "OptionCode": "10000274",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹10_出生年",
            "QuestionText": {
              "QuestionCode": "Q10000115",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503625",
                "OptionCode": "10000275",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹10_姓名",
            "QuestionText": {
              "QuestionCode": "Q10000116",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503626",
                "OptionCode": "10000276",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹2_備註",
            "QuestionText": {
              "QuestionCode": "Q10000117",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503627",
                "OptionCode": "10000277",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹2_畢業/就讀學校",
            "QuestionText": {
              "QuestionCode": "Q10000118",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503628",
                "OptionCode": "10000278",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹2_稱謂",
            "QuestionText": {
              "QuestionCode": "Q10000119",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503629",
                "OptionCode": "10000279",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹2_出生年",
            "QuestionText": {
              "QuestionCode": "Q10000120",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503630",
                "OptionCode": "10000280",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹2_姓名",
            "QuestionText": {
              "QuestionCode": "Q10000121",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503631",
                "OptionCode": "10000281",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹3_備註",
            "QuestionText": {
              "QuestionCode": "Q10000122",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503632",
                "OptionCode": "10000282",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹3_畢業/就讀學校",
            "QuestionText": {
              "QuestionCode": "Q10000123",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503633",
                "OptionCode": "10000283",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹3_稱謂",
            "QuestionText": {
              "QuestionCode": "Q10000124",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503634",
                "OptionCode": "10000284",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹3_出生年",
            "QuestionText": {
              "QuestionCode": "Q10000125",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503635",
                "OptionCode": "10000285",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹3_姓名",
            "QuestionText": {
              "QuestionCode": "Q10000126",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503636",
                "OptionCode": "10000286",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹4_備註",
            "QuestionText": {
              "QuestionCode": "Q10000127",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503637",
                "OptionCode": "10000287",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹4_畢業/就讀學校",
            "QuestionText": {
              "QuestionCode": "Q10000128",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503638",
                "OptionCode": "10000288",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹4_稱謂",
            "QuestionText": {
              "QuestionCode": "Q10000129",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503639",
                "OptionCode": "10000289",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹4_出生年",
            "QuestionText": {
              "QuestionCode": "Q10000130",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503640",
                "OptionCode": "10000290",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹4_姓名",
            "QuestionText": {
              "QuestionCode": "Q10000131",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503641",
                "OptionCode": "10000291",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹5_備註",
            "QuestionText": {
              "QuestionCode": "Q10000132",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503642",
                "OptionCode": "10000292",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹5_畢業/就讀學校",
            "QuestionText": {
              "QuestionCode": "Q10000133",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503643",
                "OptionCode": "10000293",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹5_稱謂",
            "QuestionText": {
              "QuestionCode": "Q10000134",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503644",
                "OptionCode": "10000294",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹5_出生年",
            "QuestionText": {
              "QuestionCode": "Q10000135",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503645",
                "OptionCode": "10000295",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹5_姓名",
            "QuestionText": {
              "QuestionCode": "Q10000136",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503646",
                "OptionCode": "10000296",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹6_備註",
            "QuestionText": {
              "QuestionCode": "Q10000137",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503647",
                "OptionCode": "10000297",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹6_畢業/就讀學校",
            "QuestionText": {
              "QuestionCode": "Q10000138",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503648",
                "OptionCode": "10000298",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹6_稱謂",
            "QuestionText": {
              "QuestionCode": "Q10000139",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503649",
                "OptionCode": "10000299",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹6_出生年",
            "QuestionText": {
              "QuestionCode": "Q10000140",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503650",
                "OptionCode": "10000300",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹6_姓名",
            "QuestionText": {
              "QuestionCode": "Q10000141",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503651",
                "OptionCode": "10000301",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹7_備註",
            "QuestionText": {
              "QuestionCode": "Q10000142",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503652",
                "OptionCode": "10000302",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹7_畢業/就讀學校",
            "QuestionText": {
              "QuestionCode": "Q10000143",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503653",
                "OptionCode": "10000303",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹7_稱謂",
            "QuestionText": {
              "QuestionCode": "Q10000144",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503654",
                "OptionCode": "10000304",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹7_出生年",
            "QuestionText": {
              "QuestionCode": "Q10000145",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503655",
                "OptionCode": "10000305",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹7_姓名",
            "QuestionText": {
              "QuestionCode": "Q10000146",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503656",
                "OptionCode": "10000306",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹8_備註",
            "QuestionText": {
              "QuestionCode": "Q10000147",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503657",
                "OptionCode": "10000307",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹8_畢業/就讀學校",
            "QuestionText": {
              "QuestionCode": "Q10000148",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503658",
                "OptionCode": "10000308",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹8_稱謂",
            "QuestionText": {
              "QuestionCode": "Q10000149",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503659",
                "OptionCode": "10000309",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹8_出生年",
            "QuestionText": {
              "QuestionCode": "Q10000150",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503660",
                "OptionCode": "10000310",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹8_姓名",
            "QuestionText": {
              "QuestionCode": "Q10000151",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503661",
                "OptionCode": "10000311",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹9_備註",
            "QuestionText": {
              "QuestionCode": "Q10000152",
              "Text": "",
              "Type": "單選",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503662",
                "OptionCode": "10000312",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹9_畢業/就讀學校",
            "QuestionText": {
              "QuestionCode": "Q10000153",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503663",
                "OptionCode": "10000313",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹9_稱謂",
            "QuestionText": {
              "QuestionCode": "Q10000154",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503664",
                "OptionCode": "10000314",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹9_出生年",
            "QuestionText": {
              "QuestionCode": "Q10000155",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503665",
                "OptionCode": "10000315",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "兄弟姊妹9_姓名",
            "QuestionText": {
              "QuestionCode": "Q10000156",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503666",
                "OptionCode": "10000316",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          }
        ]
      },
      {
        "Group": "直系血親",
        "QuestionQuery": [
          {
            "Query": "父_備註",
            "QuestionText": {
              "QuestionCode": "Q10000175",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503667",
                  "OptionCode": "10000355",
                  "OptionText": "繼父",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503668",
                  "OptionCode": "10000356",
                  "OptionText": "生父",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503669",
                  "OptionCode": "10000357",
                  "OptionText": "養父",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "父_出生年",
            "QuestionText": {
              "QuestionCode": "Q10000176",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503670",
                "OptionCode": "10000358",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "父_存歿",
            "QuestionText": {
              "QuestionCode": "Q10000177",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503671",
                  "OptionCode": "10000359",
                  "OptionText": "存",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503672",
                  "OptionCode": "10000360",
                  "OptionText": "歿",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "父_電話",
            "QuestionText": {
              "QuestionCode": "Q10000178",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503673",
                "OptionCode": "10000361",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "父_工作機構（服務單位）",
            "QuestionText": {
              "QuestionCode": "Q10000179",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503674",
                "OptionCode": "10000362",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "父_公司電話",
            "QuestionText": {
              "QuestionCode": "Q10000180",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503675",
                "OptionCode": "10000363",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "父_教育程度",
            "QuestionText": {
              "QuestionCode": "Q10000181",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503676",
                  "OptionCode": "10000364",
                  "OptionText": "博士",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503677",
                  "OptionCode": "10000365",
                  "OptionText": "不識字",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503678",
                  "OptionCode": "10000366",
                  "OptionText": "初中（職）",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503679",
                  "OptionCode": "10000367",
                  "OptionText": "高中（職）",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503680",
                  "OptionCode": "10000368",
                  "OptionText": "其他%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503681",
                  "OptionCode": "10000369",
                  "OptionText": "識字（未就學）",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503682",
                  "OptionCode": "10000370",
                  "OptionText": "碩士",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503683",
                  "OptionCode": "10000371",
                  "OptionText": "小學",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503684",
                  "OptionCode": "10000372",
                  "OptionText": "學士",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503685",
                  "OptionCode": "10000373",
                  "OptionText": "專科",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "父_僑居地",
            "QuestionText": {
              "QuestionCode": "Q10000182",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503686",
                "OptionCode": "10000374",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "父_是否為華僑",
            "QuestionText": {
              "QuestionCode": "Q10000183",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503687",
                  "OptionCode": "10000375",
                  "OptionText": "否",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503688",
                  "OptionCode": "10000376",
                  "OptionText": "是，僑居地%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "父_是否為身心障礙者",
            "QuestionText": {
              "QuestionCode": "Q10000184",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503689",
                  "OptionCode": "10000377",
                  "OptionText": "否",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503690",
                  "OptionCode": "10000378",
                  "OptionText": "是，身障類別%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "父_是否為新住民",
            "QuestionText": {
              "QuestionCode": "Q10000185",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503691",
                  "OptionCode": "10000379",
                  "OptionText": "否",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503692",
                  "OptionCode": "10000380",
                  "OptionText": "是，國籍%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "父_是否為原住民",
            "QuestionText": {
              "QuestionCode": "Q10000186",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503693",
                  "OptionCode": "10000381",
                  "OptionText": "否",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503694",
                  "OptionCode": "10000382",
                  "OptionText": "是，族別%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "父_現國籍",
            "QuestionText": {
              "QuestionCode": "Q10000187",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503695",
                "OptionCode": "10000383",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "父_行動電話",
            "QuestionText": {
              "QuestionCode": "Q10000188",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503696",
                "OptionCode": "10000384",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "父_姓名",
            "QuestionText": {
              "QuestionCode": "Q10000189",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503697",
                "OptionCode": "10000385",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "父_原國籍",
            "QuestionText": {
              "QuestionCode": "Q10000190",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503698",
                "OptionCode": "10000386",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "父_證號（身分證號/居留證號）",
            "QuestionText": {
              "QuestionCode": "Q10000191",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503699",
                "OptionCode": "10000387",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "父_職稱",
            "QuestionText": {
              "QuestionCode": "Q10000192",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503700",
                "OptionCode": "10000388",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "父_職業",
            "QuestionText": {
              "QuestionCode": "Q10000193",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503701",
                "OptionCode": "10000389",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "父_e-mail",
            "QuestionText": {
              "QuestionCode": "Q10000194",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503702",
                "OptionCode": "10000390",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "母_備註",
            "QuestionText": {
              "QuestionCode": "Q10000195",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503703",
                  "OptionCode": "10000391",
                  "OptionText": "繼母",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503704",
                  "OptionCode": "10000392",
                  "OptionText": "生母",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503705",
                  "OptionCode": "10000393",
                  "OptionText": "養母",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "母_出生年",
            "QuestionText": {
              "QuestionCode": "Q10000196",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503706",
                "OptionCode": "10000394",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "母_存歿",
            "QuestionText": {
              "QuestionCode": "Q10000197",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503707",
                  "OptionCode": "10000395",
                  "OptionText": "存",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503708",
                  "OptionCode": "10000396",
                  "OptionText": "歿",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "母_電話",
            "QuestionText": {
              "QuestionCode": "Q10000198",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503709",
                "OptionCode": "10000397",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "母_工作機構（服務單位）",
            "QuestionText": {
              "QuestionCode": "Q10000199",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503710",
                "OptionCode": "10000398",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "母_公司電話",
            "QuestionText": {
              "QuestionCode": "Q10000200",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503711",
                "OptionCode": "10000399",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "母_教育程度",
            "QuestionText": {
              "QuestionCode": "Q10000201",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503712",
                  "OptionCode": "10000400",
                  "OptionText": "博士",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503713",
                  "OptionCode": "10000401",
                  "OptionText": "不識字",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503714",
                  "OptionCode": "10000402",
                  "OptionText": "初中（職）",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503715",
                  "OptionCode": "10000403",
                  "OptionText": "高中（職）",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503716",
                  "OptionCode": "10000404",
                  "OptionText": "其他%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503717",
                  "OptionCode": "10000405",
                  "OptionText": "識字（未就學）",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503718",
                  "OptionCode": "10000406",
                  "OptionText": "碩士",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503719",
                  "OptionCode": "10000407",
                  "OptionText": "小學",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503720",
                  "OptionCode": "10000408",
                  "OptionText": "學士",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503721",
                  "OptionCode": "10000409",
                  "OptionText": "專科",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "母_僑居地",
            "QuestionText": {
              "QuestionCode": "Q10000202",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503722",
                "OptionCode": "10000410",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "母_是否為華僑",
            "QuestionText": {
              "QuestionCode": "Q10000203",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503723",
                  "OptionCode": "10000411",
                  "OptionText": "否",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503724",
                  "OptionCode": "10000412",
                  "OptionText": "是，僑居地%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "母_是否為身心障礙者",
            "QuestionText": {
              "QuestionCode": "Q10000204",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503725",
                  "OptionCode": "10000413",
                  "OptionText": "否",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503726",
                  "OptionCode": "10000414",
                  "OptionText": "是，身障類別%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "母_是否為新住民",
            "QuestionText": {
              "QuestionCode": "Q10000205",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503727",
                  "OptionCode": "10000415",
                  "OptionText": "否",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503728",
                  "OptionCode": "10000416",
                  "OptionText": "是，國籍%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "母_是否為原住民",
            "QuestionText": {
              "QuestionCode": "Q10000206",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503729",
                  "OptionCode": "10000417",
                  "OptionText": "否",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503730",
                  "OptionCode": "10000418",
                  "OptionText": "是，族別%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "母_現國籍",
            "QuestionText": {
              "QuestionCode": "Q10000207",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503731",
                "OptionCode": "10000419",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "母_行動電話",
            "QuestionText": {
              "QuestionCode": "Q10000208",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503732",
                "OptionCode": "10000420",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "母_姓名",
            "QuestionText": {
              "QuestionCode": "Q10000209",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503733",
                "OptionCode": "10000421",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "母_原國籍",
            "QuestionText": {
              "QuestionCode": "Q10000210",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503734",
                "OptionCode": "10000422",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "母_證號（身分證號/居留證號）",
            "QuestionText": {
              "QuestionCode": "Q10000211",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503735",
                "OptionCode": "10000423",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "母_職稱",
            "QuestionText": {
              "QuestionCode": "Q10000212",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503736",
                "OptionCode": "10000424",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "母_職業",
            "QuestionText": {
              "QuestionCode": "Q10000213",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503737",
                "OptionCode": "10000425",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "母_e-mail",
            "QuestionText": {
              "QuestionCode": "Q10000214",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503738",
                "OptionCode": "10000426",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "祖父_出生年",
            "QuestionText": {
              "QuestionCode": "Q10000215",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503739",
                "OptionCode": "10000427",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "祖父_存歿",
            "QuestionText": {
              "QuestionCode": "Q10000216",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503740",
                  "OptionCode": "10000428",
                  "OptionText": "存",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503741",
                  "OptionCode": "10000429",
                  "OptionText": "歿",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "祖父_電話",
            "QuestionText": {
              "QuestionCode": "Q10000217",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503742",
                "OptionCode": "10000430",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "祖父_工作機構（服務單位）",
            "QuestionText": {
              "QuestionCode": "Q10000218",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503743",
                "OptionCode": "10000431",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "祖父_教育程度",
            "QuestionText": {
              "QuestionCode": "Q10000219",
              "Text": "",
              "Type": "單選",
              "Require": "false",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503744",
                  "OptionCode": "10000432",
                  "OptionText": "博士",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503745",
                  "OptionCode": "10000433",
                  "OptionText": "不識字",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503746",
                  "OptionCode": "10000434",
                  "OptionText": "初中（職）",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503747",
                  "OptionCode": "10000435",
                  "OptionText": "高中（職）",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503748",
                  "OptionCode": "10000436",
                  "OptionText": "其他%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503749",
                  "OptionCode": "10000437",
                  "OptionText": "識字（未就學）",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503750",
                  "OptionCode": "10000438",
                  "OptionText": "碩士",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503751",
                  "OptionCode": "10000439",
                  "OptionText": "小學",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503752",
                  "OptionCode": "10000440",
                  "OptionText": "學士",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503753",
                  "OptionCode": "10000441",
                  "OptionText": "專科",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "祖父_姓名",
            "QuestionText": {
              "QuestionCode": "Q10000220",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503754",
                "OptionCode": "10000442",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "祖父_原國籍",
            "QuestionText": {
              "QuestionCode": "Q10000221",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503755",
                "OptionCode": "10000443",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "祖父_職稱",
            "QuestionText": {
              "QuestionCode": "Q10000222",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503756",
                "OptionCode": "10000444",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "祖父_職業",
            "QuestionText": {
              "QuestionCode": "Q10000223",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503757",
                "OptionCode": "10000445",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "祖母_出生年",
            "QuestionText": {
              "QuestionCode": "Q10000224",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503758",
                "OptionCode": "10000446",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "祖母_存歿",
            "QuestionText": {
              "QuestionCode": "Q10000225",
              "Text": "",
              "Type": "單選",
              "Require": "true",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503759",
                  "OptionCode": "10000447",
                  "OptionText": "存",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503760",
                  "OptionCode": "10000448",
                  "OptionText": "歿",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "祖母_電話",
            "QuestionText": {
              "QuestionCode": "Q10000226",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503761",
                "OptionCode": "10000449",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "祖母_工作機構（服務單位）",
            "QuestionText": {
              "QuestionCode": "Q10000227",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503762",
                "OptionCode": "10000450",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "祖母_教育程度",
            "QuestionText": {
              "QuestionCode": "Q10000228",
              "Text": "",
              "Type": "單選",
              "Require": "false",
              "RequireLink": "",
              "Option": [
                {
                  "AnswerID": "2503763",
                  "OptionCode": "10000451",
                  "OptionText": "博士",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503764",
                  "OptionCode": "10000452",
                  "OptionText": "不識字",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503765",
                  "OptionCode": "10000453",
                  "OptionText": "初中（職）",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503766",
                  "OptionCode": "10000454",
                  "OptionText": "高中（職）",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503767",
                  "OptionCode": "10000455",
                  "OptionText": "其他%TEXT2%",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503768",
                  "OptionCode": "10000456",
                  "OptionText": "識字（未就學）",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503769",
                  "OptionCode": "10000457",
                  "OptionText": "碩士",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503770",
                  "OptionCode": "10000458",
                  "OptionText": "小學",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503771",
                  "OptionCode": "10000459",
                  "OptionText": "學士",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                },
                {
                  "AnswerID": "2503772",
                  "OptionCode": "10000460",
                  "OptionText": "專科",
                  "AnswerChecked": "false",
                  "AnswerComplete": "false",
                  "AnswerMatrix": "[]",
                  "AnswerValue": ""
                }
              ]
            }
          },
          {
            "Query": "祖母_姓名",
            "QuestionText": {
              "QuestionCode": "Q10000229",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503773",
                "OptionCode": "10000461",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "祖母_原國籍",
            "QuestionText": {
              "QuestionCode": "Q10000230",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503774",
                "OptionCode": "10000462",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "祖母_職稱",
            "QuestionText": {
              "QuestionCode": "Q10000231",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503775",
                "OptionCode": "10000463",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "祖母_職業",
            "QuestionText": {
              "QuestionCode": "Q10000232",
              "Text": "",
              "Type": "填答",
              "Require": "false",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503776",
                "OptionCode": "10000464",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          }
        ]
      },
      {
        "Group": "主要照顧者",
        "QuestionQuery": [
          {
            "Query": "主要照顧者稱謂",
            "QuestionText": {
              "QuestionCode": "Q10000233",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503777",
                "OptionCode": "10000465",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "主要照顧者地址",
            "QuestionText": {
              "QuestionCode": "Q10000234",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503778",
                "OptionCode": "10000466",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "主要照顧者電話",
            "QuestionText": {
              "QuestionCode": "Q10000235",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503779",
                "OptionCode": "10000467",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "主要照顧者行動電話",
            "QuestionText": {
              "QuestionCode": "Q10000236",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503780",
                "OptionCode": "10000468",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "主要照顧者姓名",
            "QuestionText": {
              "QuestionCode": "Q10000237",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503781",
                "OptionCode": "10000469",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "主要照顧者性別",
            "QuestionText": {
              "QuestionCode": "Q10000238",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503782",
                "OptionCode": "10000470",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "主要照顧者職稱",
            "QuestionText": {
              "QuestionCode": "Q10000239",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503783",
                "OptionCode": "10000471",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "主要照顧者職業",
            "QuestionText": {
              "QuestionCode": "Q10000240",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503784",
                "OptionCode": "10000472",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          },
          {
            "Query": "主要照顧者e-mail",
            "QuestionText": {
              "QuestionCode": "Q10000241",
              "Text": "",
              "Type": "填答",
              "Require": "true",
              "RequireLink": "",
              "Option": {
                "AnswerID": "2503785",
                "OptionCode": "10000473",
                "OptionText": "%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            }
          }
        ]
      }
    ]
  },
  {
    "Subject": "學習狀況",
    "QuestionGroup": {
      "Group": "幹部記錄",
      "QuestionQuery": [
        {
          "Query": "班級幹部",
          "QuestionText": {
            "QuestionCode": "Q10000255",
            "Text": "",
            "Type": "填答",
            "Require": "true",
            "RequireLink": "",
            "Option": {
              "AnswerID": "2503786",
              "OptionCode": "10000501",
              "OptionText": "%TEXT3%",
              "AnswerChecked": "false",
              "AnswerComplete": "false",
              "AnswerMatrix": "[]",
              "AnswerValue": ""
            }
          }
        },
        {
          "Query": "社團幹部",
          "QuestionText": {
            "QuestionCode": "Q10000256",
            "Text": "",
            "Type": "填答",
            "Require": "true",
            "RequireLink": "",
            "Option": {
              "AnswerID": "2503787",
              "OptionCode": "10000502",
              "OptionText": "%TEXT3%",
              "AnswerChecked": "false",
              "AnswerComplete": "false",
              "AnswerMatrix": "[]",
              "AnswerValue": ""
            }
          }
        },
        {
          "Query": "學校幹部",
          "QuestionText": {
            "QuestionCode": "Q10000257",
            "Text": "",
            "Type": "填答",
            "Require": "true",
            "RequireLink": "",
            "Option": {
              "AnswerID": "2503788",
              "OptionCode": "10000503",
              "OptionText": "%TEXT3%",
              "AnswerChecked": "false",
              "AnswerComplete": "false",
              "AnswerMatrix": "[]",
              "AnswerValue": ""
            }
          }
        }
      ]
    }
  },
  {
    "Subject": "自我描述",
    "QuestionGroup": {
      "Group": "生活適應",
      "QuestionQuery": [
        {
          "Query": "不良習慣",
          "QuestionText": {
            "QuestionCode": "Q10000271",
            "Text": "",
            "Type": "複選",
            "Require": "true",
            "RequireLink": "",
            "Option": [
              {
                "AnswerID": "2503789",
                "OptionCode": "10000563",
                "OptionText": "愛發怪聲",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503790",
                "OptionCode": "10000564",
                "OptionText": "沉迷不良書刊",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503791",
                "OptionCode": "10000565",
                "OptionText": "吃吃",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503792",
                "OptionCode": "10000566",
                "OptionText": "吮拇指咬指甲",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503793",
                "OptionCode": "10000567",
                "OptionText": "無",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503794",
                "OptionCode": "10000568",
                "OptionText": "吸毒",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503795",
                "OptionCode": "10000569",
                "OptionText": "吸煙",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503796",
                "OptionCode": "10000570",
                "OptionText": "作弄他人",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            ]
          }
        },
        {
          "Query": "內向行為",
          "QuestionText": {
            "QuestionCode": "Q10000272",
            "Text": "",
            "Type": "複選",
            "Require": "true",
            "RequireLink": "",
            "Option": [
              {
                "AnswerID": "2503797",
                "OptionCode": "10000571",
                "OptionText": "多愁善感",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503798",
                "OptionCode": "10000572",
                "OptionText": "過分依賴",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503799",
                "OptionCode": "10000573",
                "OptionText": "過份沉默",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503800",
                "OptionCode": "10000574",
                "OptionText": "謹慎",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503801",
                "OptionCode": "10000575",
                "OptionText": "情緒穩定",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503802",
                "OptionCode": "10000576",
                "OptionText": "畏縮",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503803",
                "OptionCode": "10000577",
                "OptionText": "文靜",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503804",
                "OptionCode": "10000578",
                "OptionText": "自信",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            ]
          }
        },
        {
          "Query": "人際關係",
          "QuestionText": {
            "QuestionCode": "Q10000273",
            "Text": "",
            "Type": "複選",
            "Require": "true",
            "RequireLink": "",
            "Option": [
              {
                "AnswerID": "2503805",
                "OptionCode": "10000579",
                "OptionText": "多疑善妒",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503806",
                "OptionCode": "10000580",
                "OptionText": "好爭吵",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503807",
                "OptionCode": "10000581",
                "OptionText": "合群",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503808",
                "OptionCode": "10000582",
                "OptionText": "和氣",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503809",
                "OptionCode": "10000583",
                "OptionText": "活潑",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503810",
                "OptionCode": "10000584",
                "OptionText": "冷漠",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503811",
                "OptionCode": "10000585",
                "OptionText": "信賴他人",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503812",
                "OptionCode": "10000586",
                "OptionText": "自我中心",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            ]
          }
        },
        {
          "Query": "外向行為",
          "QuestionText": {
            "QuestionCode": "Q10000274",
            "Text": "",
            "Type": "複選",
            "Require": "true",
            "RequireLink": "",
            "Option": [
              {
                "AnswerID": "2503813",
                "OptionCode": "10000587",
                "OptionText": "愛唱反調",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503814",
                "OptionCode": "10000588",
                "OptionText": "常講粗話",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503815",
                "OptionCode": "10000589",
                "OptionText": "好遊蕩",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503816",
                "OptionCode": "10000590",
                "OptionText": "健談",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503817",
                "OptionCode": "10000591",
                "OptionText": "慷慨",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503818",
                "OptionCode": "10000592",
                "OptionText": "領導力強",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503819",
                "OptionCode": "10000593",
                "OptionText": "熱心公務",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503820",
                "OptionCode": "10000594",
                "OptionText": "欣負同學",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            ]
          }
        },
        {
          "Query": "學習行為",
          "QuestionText": {
            "QuestionCode": "Q10000275",
            "Text": "",
            "Type": "複選",
            "Require": "true",
            "RequireLink": "",
            "Option": [
              {
                "AnswerID": "2503821",
                "OptionCode": "10000595",
                "OptionText": "半途而廢",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503822",
                "OptionCode": "10000596",
                "OptionText": "被動馬虎",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503823",
                "OptionCode": "10000597",
                "OptionText": "分心",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503824",
                "OptionCode": "10000598",
                "OptionText": "積極努力",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503825",
                "OptionCode": "10000599",
                "OptionText": "偏愛或偏惡某些功課",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503826",
                "OptionCode": "10000600",
                "OptionText": "深思好問",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503827",
                "OptionCode": "10000601",
                "OptionText": "有恆心",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503828",
                "OptionCode": "10000602",
                "OptionText": "專心",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            ]
          }
        },
        {
          "Query": "焦慮症狀",
          "QuestionText": {
            "QuestionCode": "Q10000341",
            "Text": "",
            "Type": "複選",
            "Require": "true",
            "RequireLink": "",
            "Option": [
              {
                "AnswerID": "2503829",
                "OptionCode": "10000696",
                "OptionText": "表情緊張",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503830",
                "OptionCode": "10000697",
                "OptionText": "不停玩弄東西",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503831",
                "OptionCode": "10000698",
                "OptionText": "肚子痛",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503832",
                "OptionCode": "10000699",
                "OptionText": "發抖",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503833",
                "OptionCode": "10000700",
                "OptionText": "其他，%TEXT3%",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503834",
                "OptionCode": "10000701",
                "OptionText": "頭痛",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503835",
                "OptionCode": "10000702",
                "OptionText": "無",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503836",
                "OptionCode": "10000703",
                "OptionText": "胸痛",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              },
              {
                "AnswerID": "2503837",
                "OptionCode": "10000704",
                "OptionText": "坐立不安",
                "AnswerChecked": "false",
                "AnswerComplete": "false",
                "AnswerMatrix": "[]",
                "AnswerValue": ""
              }
            ]
          }
        }
      ]
    }
  }
];
