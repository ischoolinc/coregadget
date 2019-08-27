export interface InstallStatusInfo {
  Teachers: TeacherInstallStatusInfo;
  Students: StudentInstallStatusInfo;
  Parents: ParentInstallStatusInfo;
}

interface TeacherInstallStatusInfo {
  Teacher: InstallVisitStatus[];
}

interface StudentInstallStatusInfo {
  Student: InstallVisitStatus[];
}

interface ParentInstallStatusInfo {
  Parent: InstallVisitStatus[];
}

export class InstallVisitStatus {
  Id: string;
  FirstVisit: string;
  LastVisit: string;
}
