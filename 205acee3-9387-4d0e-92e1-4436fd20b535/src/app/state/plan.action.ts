import { PlanRec } from "../data";

export class GetAllPlans {
    static readonly type = '[plan] get all plans';
    constructor() {}
}

export class SetCurPlan {
    static readonly type = '[plan] set current plan';
    constructor(public plan: PlanRec) {}
}