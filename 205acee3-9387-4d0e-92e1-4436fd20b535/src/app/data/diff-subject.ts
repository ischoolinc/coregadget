export interface DiffSubjectRec {
    // new
    status: string;
    credits: number[];
    creditsToString: string;
    domain: string;
    entry: string;
    required: string;
    requiredBy: string;
    subjectName: string;
    // change
    newCredits?: string[];
    newDomain?: string;
    newEntry?: string;
}

export interface DiffSubjectExRec extends DiffSubjectRec {
    selected: boolean;
}