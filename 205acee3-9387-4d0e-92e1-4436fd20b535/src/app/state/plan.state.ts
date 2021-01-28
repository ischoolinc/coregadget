import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { PlanRec } from '../data';
import { PlanService } from '../core/plan.service';
import { GetAllPlans, SetCurPlan, SetCurPlanList, SetPlanName, SetPlanContent, NewPlan, RemovePlan, SetPlanGroupCode } from './plan.action';
import { LoadingService } from '../core/loading.service';
import { CourseCodeService, GraduationPlan } from '@1campus/moe-course';

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
        private planSrv: PlanService,
        private loadSrv: LoadingService,
        private courseCodeSrv: CourseCodeService
    ) {}

    @Action(GetAllPlans)
    async getAllPlans(ctx: StateContext<PlanModel>, action: GetAllPlans) {
        this.loadSrv.startLoading();
        const rsp = await this.planSrv.getAllPlans();
        const yearList: string[] = [];
        rsp.plan.forEach((plan: PlanRec) => {
            if (!yearList.find(year => year === plan.school_year)) {
                yearList.push(plan.school_year);
            }
        });
        ctx.patchState({
            planList: [].concat(rsp.plan || []),
            yearList,
            curPlan: {} as PlanRec,
            curPlanList: []
        });
        this.loadSrv.stopLoading();
    }

    @Action(SetCurPlanList)
    async setCurPlanList(ctx: StateContext<PlanModel>, action: SetCurPlanList) {
        this.loadSrv.startLoading();

        let plans = ctx.getState().planList
            .filter(plan => plan.school_year === action.year)
            .sort((a, b) => {
                if (a.name > b.name) {
                    return -1;
                } else {
                    return 1;
                }
            });
        // 檢查與課程代碼的差異
        const checkDiff = plans.map(plan => {
            const gp = GraduationPlan.parse(plan.content);
            let code = new Promise((res, rej) => {res(false);});
            let code1 = new Promise((res, rej) => {res(false);});
            if (plan.moe_group_code) {
                code = this.courseCodeSrv.getCourseCodeTable(plan.moe_group_code).then(v => {
                    return gp.diff(v).filter(data => data.status === 'new').length > 0;
                });
            } 
            if(plan.moe_group_code_1){
                code1 = this.courseCodeSrv.getCourseCodeTable(plan.moe_group_code).then(v => {
                    return gp.diff(v).filter(data => data.status === 'new').length > 0;
                })
            }
            return Promise.all([plan, plan.moe_group_code ? code : false, code1]);
        });

        const planDiffList = await Promise.all(checkDiff);
        const result = planDiffList.map((planRsp) => {
            const [planRec, codeHasChange, code1HasChange] = planRsp;
            return {
                ...planRec,
                different: codeHasChange || code1HasChange
            }
        });

        ctx.patchState({curPlanList: result as PlanRec[]});
        // ctx.patchState({curPlanList: plans});
        
        this.loadSrv.stopLoading();
    }

    @Action(SetCurPlan)
    async setCurPlan(ctx: StateContext<PlanModel>, action: SetCurPlan) {
        this.loadSrv.startLoading();
        ctx.patchState({curPlan: action.plan});
        this.loadSrv.stopLoading();
    }

    @Action(SetPlanName)
    async setPlanName(ctx: StateContext<PlanModel>, action: SetPlanName) {
        this.loadSrv.startLoading();
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
        this.loadSrv.stopLoading();
    }

    @Action(SetPlanContent)
    async setPlanContent(ctx: StateContext<PlanModel>, action: SetPlanContent) {
        // this.loadSrv.startLoading();
        const rsp = await this.planSrv.setPlanContent(action.id, action.content);
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
        // this.loadSrv.stopLoading();
    }

    @Action(NewPlan)
    async newPlan(ctx: StateContext<PlanModel>, action: NewPlan) {
        this.loadSrv.startLoading();
        const { plan } = await this.planSrv.newPlan(action.name, action.content);
        const planMode: PlanModel = ctx.getState();
        const planList: PlanRec[] = planMode.planList.concat(plan);
        const curPlanList: PlanRec[] = [...planMode.curPlanList ?? []];
        const yearList: string[] = [];

        planMode.planList.forEach(plan => {
            if (!yearList.find(year => year === plan.school_year)) {
                yearList.push(plan.school_year);
            }
        });

        if (planMode.curPlanList?.length) {
            if (planMode.curPlanList[0].school_year === plan.school_year) {
                curPlanList.push(plan);
            }
        }

        ctx.setState({
            planList, 
            yearList,
            curPlanList,
            curPlan: planMode.curPlan
        });
        this.loadSrv.stopLoading();
    }

    @Action(RemovePlan)
    async removePlan(ctx: StateContext<PlanModel>, action: RemovePlan) {
        this.loadSrv.startLoading();
        const { plan } = await this.planSrv.removePlan(action.id);
        const planMode: PlanModel = ctx.getState();
        const planList: PlanRec[] = planMode.planList.filter(planRec => !(planRec.id === plan.id));
        let curPlanList: PlanRec[] = [...planMode.curPlanList ?? []];
        const yearList: string[] = [];

        planMode.planList.forEach(plan => {
            if (!yearList.find(year => year === plan.school_year)) {
                yearList.push(plan.school_year);
            }
        });

        curPlanList = curPlanList.filter(planRec => !(planRec.id === plan.id));

        ctx.setState({
            planList, 
            yearList,
            curPlanList,
        });
        this.loadSrv.stopLoading();
    }

    @Action(SetPlanGroupCode)
    async setPlanGroupCode(ctx: StateContext<PlanModel>, action: SetPlanGroupCode) {
        this.loadSrv.startLoading();
        const { plan } = await this.planSrv.setPlanGroupCode(action.id, action.code, action.code1, action.content);

        const planMode = ctx.getState();
        const curPlanList = planMode.curPlanList!.map(data => {
            if (data.id === plan.id) {
                return plan;
            } else {
                return data;
            }
        });
        const planList = planMode.planList.map(data => {
            if (data.id === plan.id) {
                return plan;
            } else {
                return data;
            }
        });

        ctx.patchState({
            curPlan: plan
            , curPlanList
            , planList
        });

        this.loadSrv.stopLoading();
    }
}

export interface PlanModel {
    planList: PlanRec[];
    yearList: string[];
    curPlan?: PlanRec;
    curPlanList?: PlanRec[];
}