import { PlanRec } from "../data";

export class GetAllPlans {
    static readonly type = '[plan] get all plans';
    constructor() {}
}

export class SetCurPlanList {
    static readonly type = '[plan] set current plan list';
    constructor(public year: string) {}
}

export class SetCurPlan {
    static readonly type = '[plan] set current plan';
    constructor(public plan: PlanRec) {}
}

export class SetPlanName {
    static readonly type = '[plan] set plan name';
    constructor(public id: number, public name: string) {}
}

export class SetPlanContent {
    static readonly type = '[plan] set plan content';
    constructor(public id: number, public content: string) {}
}

export class SetPlanGroupCode {
    static readonly type = '[plan] set plan group_code';
    constructor(public id: number, public code: string, public content: string) {}
}

export class NewPlan {
    static readonly type = '[plan] new plan';
    constructor(public name: string, public content: string) {}
}

export class RemovePlan {
    static readonly type = '[plan] remove plan';
    constructor(public id: number) {}
}
