import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { PlanRec } from '../data';
import { PlanService } from '../core/plan.service';
import { GetAllPlans, SetCurPlan, SetCurPlanList, SetPlanName } from './plan.action';

@State({
    name: 'plan',
    defaults: {
        planList: [],
        yearList: [],
        curPlan: undefined,
        curPlanList: []
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
            // curSchoolYear: ''
        });
    }

    @Action(SetCurPlanList)
    setCurPlanList(ctx: StateContext<PlanModel>, action: SetCurPlanList) {
        ctx.patchState({curPlanList: ctx.getState().planList.filter(plan => plan.school_year === action.year)});
    }

    @Action(SetCurPlan)
    async setCurPlan(ctx: StateContext<PlanModel>, action: SetCurPlan) {
        ctx.patchState({curPlan: action.plan});
    }

    @Action(SetPlanName)
    async setPlanName(ctx: StateContext<PlanModel>, action: SetPlanName) {
        const rsp = await this.planSrv.setPlanName(action.id, action.name);
        const planMode = ctx.getState();
        const plans = planMode.planList.map(plan => {
            if (plan.id === rsp.plan.id) {
                return rsp.plan;
            }
            return plan;
        });
        const curPlans = planMode.curPlanList?.map(plan => {
            if (plan.id === rsp.plan.id) {
                return rsp.plan;
            }
            return plan;
        });

        ctx.patchState({
            curPlan: rsp.plan,
            curPlanList: curPlans,
            planList: plans
        });
    }

}

export interface PlanModel {
    planList: PlanRec[];
    yearList: string[];
    curPlan?: PlanRec;
    curPlanList?: PlanRec[];
}