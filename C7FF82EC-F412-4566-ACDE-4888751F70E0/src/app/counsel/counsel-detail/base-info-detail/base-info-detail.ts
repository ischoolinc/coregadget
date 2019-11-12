import * as node2json from 'nodexml';

export class StudentBaseInfo {
    StudentID: string = "";
    Name: string = "";
    Birthdate: string = "";
    IDNumber: string = "";
    Gender: string = "";
    MailingAddress: string = "";
    PermanentAddress: string = "";
    OtherAddress: string = "";
    PermanentPhone: string = "";
    PhotoUrl: string = "";
    StudentContactPhone: string = "";
    //OtherPhones: string = "";
    OtherPhone1: string = "";
    OtherPhone2: string = "";
    OtherPhone3: string = "";
    SmsPhone: string = "";
    BeforeEnrollment: string = "";
    ContactName: string = "";
    ContactTitle: string = "";
    ContactPhone: string = "";
    ContactMobile: string = "";
    ContactOffice: string = "";
    SecondContactName: string = "";
    SecondContactTitle: string = "";
    SecondContactPhone: string = "";
    SecondContactMobile: string = "";
    SecondContactOffice: string = "";
    ThirdContactName: string = "";
    ThirdContactTitle: string = "";
    ThirdContactPhone: string = "";
    ThirdContactMobile: string = "";
    ThirdContactOffice: string = "";
    // 前籍畢業資訊
    beClassName: string = "";
    beSchool: string = "";
    beSchoolLocation: string = "";
    beSeatNo: string = "";
    beMemo: string = "";
    beGraduateSchoolYear: string = "";

    // 父母監護人資料
    FatherName: string = "";
    FatherNationality: string = "";
    FatherJob: string = "";
    FatherPhone: string = "";
    MotherName: string = "";
    MotherNationality: string = "";
    MotherJob: string = "";
    MotherPhone: string = "";
    CustodianName: string = "";
    CustodianNationality: string = "";
    CustodianRelationship: string = "";
    CustodianJob: string = "";
    CustodianPhone: string = "";

    // 異動資料
    UpdateRecordList: UpdateRecordInfo[] = [];

    // 解析地址,戶籍地址,聯絡地址
    ParseAddressXML(PermanentAddress: string, MailingAddress: string, OtherAddress: string) {
        if (PermanentAddress && PermanentAddress.length > 0)
            this.PermanentAddress = this.ParseAddress([].concat(node2json.xml2obj(PermanentAddress) || []));
        if (MailingAddress && MailingAddress.length > 0)
            this.MailingAddress = this.ParseAddress([].concat(node2json.xml2obj(MailingAddress) || []));
        if (OtherAddress && OtherAddress.length > 0)
            this.OtherAddress = this.ParseAddress([].concat(node2json.xml2obj(OtherAddress) || []));
    }

    // 解析其它電話
    ParseOtherPhonesXML(OtherPhones: string) {
        if (OtherPhones && OtherPhones.length > 0) {
            let op = [].concat(node2json.xml2obj(OtherPhones) || []);
            if (op[0].PhoneList.PhoneNumber[0]) {
                this.OtherPhone1 = op[0].PhoneList.PhoneNumber[0];
            }
            if (op[0].PhoneList.PhoneNumber[1]) {
                this.OtherPhone2 = op[0].PhoneList.PhoneNumber[1];
            }
            if (op[0].PhoneList.PhoneNumber[2]) {
                this.OtherPhone3 = op[0].PhoneList.PhoneNumber[2];
            }
        }
    }
    // 解析前級畢業資訊
    ParseBeforeEnrollmentXML(BeforeEnrollment: string) {
        if (BeforeEnrollment && BeforeEnrollment.length > 0) {
            let beData = [].concat(node2json.xml2obj(BeforeEnrollment) || []);
            if (beData[0].BeforeEnrollment.ClassName) {
                this.beClassName = beData[0].BeforeEnrollment.ClassName;
            }
            if (beData[0].BeforeEnrollment.School) {
                this.beSchool = beData[0].BeforeEnrollment.School;
            }
            if (beData[0].BeforeEnrollment.SchoolLocation) {
                this.beSchoolLocation = beData[0].BeforeEnrollment.SchoolLocation;
            }
            if (beData[0].BeforeEnrollment.SeatNo) {
                this.beSeatNo = beData[0].BeforeEnrollment.SeatNo;
            }
            if (beData[0].BeforeEnrollment.Memo) {
                this.beMemo = beData[0].BeforeEnrollment.Memo;
            }
            if (beData[0].BeforeEnrollment.GraduateSchoolYear) {
                this.beGraduateSchoolYear = beData[0].BeforeEnrollment.GraduateSchoolYear;
            }
        }
    }

    // 解析父母監護人 電話 職業
    ParseFatherMontherCXML(Father: string, Mother: string, Custodian: string) {
        if (Father && Father.length > 0) {
            let fData = [].concat(node2json.xml2obj(Father) || []);
            if (fData[0].FatherOtherInfo.FatherJob)
                this.FatherJob = fData[0].FatherOtherInfo.FatherJob;
            if (fData[0].FatherOtherInfo.Phone)
                this.FatherPhone = fData[0].FatherOtherInfo.Phone;
        }
        if (Mother && Mother.length > 0) {
            let fData = [].concat(node2json.xml2obj(Mother) || []);
            if (fData[0].MotherOtherInfo.MotherJob)
                this.MotherJob = fData[0].MotherOtherInfo.MotherJob;
            if (fData[0].MotherOtherInfo.Phone)
                this.MotherPhone = fData[0].MotherOtherInfo.Phone;
        }
        if (Custodian && Custodian.length > 0) {
            let fData = [].concat(node2json.xml2obj(Custodian) || []);
            if (fData[0].CustodianOtherInfo.Job)
                this.CustodianJob = fData[0].CustodianOtherInfo.Job;
            if (fData[0].CustodianOtherInfo.Phone)
                this.CustodianPhone = fData[0].CustodianOtherInfo.Phone;
        }

    }

    // 解析地址
    ParseAddress(item: any) {
        let value: string = '';
        let ZipCode = "";
        let County = "";
        let Town = "";
        let District = "";
        let Area = "";
        let DetailAddress = "";

        if (item[0].AddressList.Address.ZipCode) {
            ZipCode = item[0].AddressList.Address.ZipCode;
        }
        if (item[0].AddressList.Address.County) {
            County = item[0].AddressList.Address.County;
        }
        if (item[0].AddressList.Address.Town) {
            Town = item[0].AddressList.Address.Town;
        }
        if (item[0].AddressList.Address.District) {
            District = item[0].AddressList.Address.District;
        }
        if (item[0].AddressList.Address.Area) {
            Area = item[0].AddressList.Address.Area;
        }
        if (item[0].AddressList.Address.DetailAddress) {
            DetailAddress = item[0].AddressList.Address.DetailAddress;
        }
        value = ZipCode + " " + County + Town + District + Area + DetailAddress;

        return value;
    }
}

// 異動資料
export class UpdateRecordInfo {

    StudentID: string;
    SchoolYear: number; //學年度
    Semester: number; //學期
    GradeYear: number; // 異動年級
    UpdateDate: string; // 異動日期
    UpdateCode: string; // 異動代碼
    UpdateDesc: string; // 原因及事由
    AdDate: string; // 核准日期
    AdNumber: string; // 核准文號   

}