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