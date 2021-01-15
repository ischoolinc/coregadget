import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { PlanRec } from '../data';
import { PlanService } from '../core/plan.service';
import { GetAllPlans, SetCurPlan, SetCurSchoolYear } from './plan.action';

@State({
    name: 'plan',
    defaults: {
        planList: [],
        yearList: [],
        curPlan: {} as PlanRec,
        curSchoolYear: ''
    } as PlanModel
})
@Injectable()
export class PlanState {

    constructor(
        private planSrv: PlanService
    ) {}

    @Action(GetAllPlans)
    async getAllPlans(ctx: StateContext<PlanModel>, action: GetAllPlans) {
        const rsp = await this.planSrv.getAllPlans();
        const yearList: string[] = [];
        rsp.plan.forEach((plan: PlanRec) => {
            if (!yearList.find(year => year === plan.school_year)) {
                yearList.push(plan.school_year);
            }
        });
        ctx.setState({
            planList: [].concat(rsp.plan || []),
            yearList,
            curPlan: {} as PlanRec,
            curSchoolYear: ''
        });
    }


    @Action(SetCurPlan)
    async getPlansByYear(ctx: StateContext<PlanModel>, action: SetCurPlan) {
        ctx.patchState({curPlan: action.plan});
    }

    @Action(SetCurSchoolYear)
    setCurSchoolYear(ctx: StateContext<PlanModel>, action: SetCurSchoolYear) {
        ctx.patchState({curSchoolYear: action.schoolYear});
    }

}

export interface PlanModel {
    planList: PlanRec[];
    yearList: string[];
    curPlan: PlanRec;
    curSchoolYear: string;
}