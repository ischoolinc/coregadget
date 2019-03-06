import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormControl } from '@angular/forms';
import { QueryFormComponent } from '../../render';

@Component({
  selector: 'app-query-form-demo',
  templateUrl: './query-form-demo.component.html',
  styleUrls: ['./query-form-demo.component.css']
})
export class QueryFormDemoComponent implements OnInit {

  data1 = demo1;

  data2 = demo2;

  data3 = demo3;

  data4 = demo4;

  data5 = demo5;

  dataControl = [
    new FormControl(this.data1),
    new FormControl(this.data2),
    new FormControl(this.data3),
    new FormControl(this.data4),
    new FormControl(this.data5)
  ];

  fulldataGroup: FormControl[] = [];

  _disabled = false;

  _debug = false;

  constructor() { }

  @ViewChildren('query') query: QueryList<QueryFormComponent>;

  _new_value = {};

  ngOnInit() {
    this.dataControl[0].valueChanges.subscribe(v => {
      this._new_value = v;
    });
  }

  toggleDisabled() {
    if (this._disabled) {
      this.dataControl.forEach(v => v.enable());
    } else {
      this.dataControl.forEach(v => v.disable());
    }

    this._disabled = !this._disabled;
  }

  toggleDebug() {
    this._debug = !this._debug;
  }

  resetValues() {
    for (const q of this.query.toArray()) {
      q.resetValues();
    }
  }
}

const demo1 = [
  {
    "QuestionCode": "Q10000003",
    "Type": "單選",
    "Require": false,
    "RequireLink": "10000038",
    "Text": "",
    "Option": [
      {
        "AnswerID": 3,
        "OptionCode": "10000004",
        "OptionText": "台灣地區，縣市：%TEXT2%",
        "AnswerValue": "",
        "AnswerMatrix": ["", "新竹縣"],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 2,
        "OptionCode": "10000003",
        "OptionText": "其他：%TEXT2%",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 999,
        "OptionCode": "100000031",
        "OptionText": "神奇的：%TEXT2%, %TEXT3%",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      }
    ]
  }
];

const demo2 = [
  {
    "QuestionCode": "Q10000017",
    "Type": "單選",
    "Require": false,
    "RequireLink": "10000013",
    "Text": "領有身心障礙手冊",
    "Option": [
      {
        "AnswerID": 36,
        "OptionCode": "10000037",
        "OptionText": "否",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 37,
        "OptionCode": "10000038",
        "OptionText": "是",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      }
    ]
  },
  {
    "QuestionCode": "Q10000018",
    "Type": "填答",
    "Require": true,
    "RequireLink": "",
    "Text": "身心障礙等級",
    "Option": [
      {
        "AnswerID": 38,
        "OptionCode": "10000039",
        "OptionText": "%TEXT2%",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      }
    ]
  },
  {
    "QuestionCode": "Q10000019",
    "Type": "填答",
    "Require": false,
    "RequireLink": "10000058",
    "Text": "鑑定日期",
    "Option": [
      {
        "AnswerID": 39,
        "OptionCode": "10000040",
        "OptionText": "%TEXT2%",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      }
    ]
  },
  {
    "QuestionCode": "Q10000020",
    "Type": "填答",
    "Require": false,
    "RequireLink": "",
    "Text": "鑑定文號",
    "Option": [
      {
        "AnswerID": 40,
        "OptionCode": "10000041",
        "OptionText": "%TEXT3%",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      }
    ]
  },
  {
    "QuestionCode": "Q10000021",
    "Type": "填答",
    "Require": false,
    "RequireLink": "",
    "Text": "身心障礙類別",
    "Option": [
      {
        "AnswerID": 41,
        "OptionCode": "10000042",
        "OptionText": "%TEXT3%",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      }
    ]
  }
];

const demo3 = [
  {
    "QuestionCode": "Q10000026",
    "Type": "單選",
    "Require": true,
    "RequireLink": "",
    "Text": "原住民血統",
    "Option": [
      {
        "AnswerID": 56,
        "OptionCode": "10000057",
        "OptionText": "否",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 57,
        "OptionCode": "10000058",
        "OptionText": "是",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      }
    ]
  },
  {
    "QuestionCode": "Q10000027",
    "Type": "複選",
    "Require": true,
    "RequireLink": "",
    "Text": "原住民親屬稱謂",
    "Option": [
      {
        "AnswerID": 58,
        "OptionCode": "10000059",
        "OptionText": "父",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 59,
        "OptionCode": "10000060",
        "OptionText": "母",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      }
    ]
  },
  {
    "QuestionCode": "Q10000028",
    "Type": "填答",
    "Require": false,
    "RequireLink": "",
    "Text": "原住民族別",
    "Option": [
      {
        "AnswerID": 60,
        "OptionCode": "10000061",
        "OptionText": "%TEXT2%",
        "AnswerValue": "",
        "AnswerMatrix": ["神人"],
        "AnswerChecked": false,
        "AnswerComplete": false
      }
    ]
  }
];

const demo4 = [
  {
    "QuestionCode": "Q10000011",
    "Type": "複選",
    "Require": true,
    "RequireLink": "",
    "Text": "",
    "Option": [
      {
        "AnswerID": 12,
        "OptionCode": "10000013",
        "OptionText": "邊疆生（蒙疆生）",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 13,
        "OptionCode": "10000014",
        "OptionText": "大陸來台依親者",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 14,
        "OptionCode": "10000015",
        "OptionText": "多胞胎",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 15,
        "OptionCode": "10000016",
        "OptionText": "港澳生",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 16,
        "OptionCode": "10000017",
        "OptionText": "功勳子女",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 17,
        "OptionCode": "10000018",
        "OptionText": "海外僑生（回國僑生）國籍：%TEXT2%",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 18,
        "OptionCode": "10000019",
        "OptionText": "教職員子女",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 19,
        "OptionCode": "10000020",
        "OptionText": "境外優季科學技術人才子女",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 20,
        "OptionCode": "10000021",
        "OptionText": "派外人員子女",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 21,
        "OptionCode": "10000022",
        "OptionText": "清寒證明",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 22,
        "OptionCode": "10000023",
        "OptionText": "退伍軍人子女",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 23,
        "OptionCode": "10000024",
        "OptionText": "外籍生",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 24,
        "OptionCode": "10000025",
        "OptionText": "現役軍人子女",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 25,
        "OptionCode": "10000026",
        "OptionText": "新住民子女（家長其中一方為外籍者）",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 26,
        "OptionCode": "10000027",
        "OptionText": "顏面傷殘",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 27,
        "OptionCode": "10000028",
        "OptionText": "一般生",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 28,
        "OptionCode": "10000029",
        "OptionText": "原住民，族別：%TEXT2%",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 29,
        "OptionCode": "10000030",
        "OptionText": "資優生",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      },
      {
        "AnswerID": 28,
        "OptionCode": "10000029-1",
        "OptionText": "夢戰陣營：%TEXT2%，等級：%TEXT%，綜合戰力：%TEXT%",
        "AnswerValue": "",
        "AnswerMatrix": ["", "公主聯盟", "", "60", "", "56000"],
        "AnswerChecked": false,
        "AnswerComplete": false
      }
    ]
  }
];

const demo5 = [
  {
    "QuestionCode": "Q10000021.1",
    "Type": "填答",
    "Require": false,
    "RequireLink": "",
    "Text": "",
    "Option": [
      {
        "AnswerID": 41.1,
        "OptionCode": "10000042.1",
        "OptionText": "%TEXTAREA%",
        "AnswerValue": "",
        "AnswerMatrix": [],
        "AnswerChecked": false,
        "AnswerComplete": false
      }
    ]
  }
];
