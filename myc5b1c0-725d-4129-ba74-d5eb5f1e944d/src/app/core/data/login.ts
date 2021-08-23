export interface SelectedContext {
    dsns: string;
    role: string;
    id:   number;
}

export interface MyInfo {
    name:        string;
    account:     string;
    language:    string;
    isTeacher:   boolean;
    isStudent:   boolean;
    isParent:    boolean;
    teacherId:   number;
    studentId:   number;
    child:       any[];
    application: Application[];
}

export interface Application {
    ap_name: string;
    name:    string;
}