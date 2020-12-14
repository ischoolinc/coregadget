import { GadgetService, Contract } from './gadget.service';
import { Injectable } from '@angular/core';

interface PeriodListResponse {
  GetPeriodListResponse: {
    Period: {
      Aggregated: string;
      Name: string;
      Sort: string;
      Type: string;
    }[]
  }
}
interface AbsenceListResponse {
  AbsenceMappingTableResponse: {
    Name: string;
    Absence: {
      Abbreviation: string;
      HotKey: string;
      Name: string;
      NoAbsence: string;
    }[];
  }
}
interface ClassListResponse {
  ClassList: {
    Class: {
      ClassID: string;
      ClassName: string;
    }[];
  }
}
@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private gadget: GadgetService) {
  }
  // 取得節次對照表
  async getPeriodMappingTable() {
    const contract = await this.gadget.getContract('ta');
    const result: PeriodListResponse = await contract.send('TeacherAccess.GetPeriodMappingTable', {
        Content: {
          Field: {
              Content: {}
          }
        }
      }
    );
    console.log(result);
  }
  // 取得缺曠對照表
  async getAbsenceMappingTable() {
    const contract = await this.gadget.getContract('ta');
    const result: AbsenceListResponse = await contract.send('TeacherAccess.GetAbsenceMappingTable', {
        Content: {
            Field: {
                All: {}
            }
        }
      }
    );
    console.log(result);
  }
  // 取得班級列表
  async getMyClasses() {
    const contract = await this.gadget.getContract('ta');
    const result: ClassListResponse = await contract.send('TeacherAccess.GetMyClasses', {
        Content: {
            Field: {
                ClassID: {},
                ClassName: {}
            },
            Order: {
                ClassName:{}
            }
        }
      }
    );
    console.log(result);

  }
}
