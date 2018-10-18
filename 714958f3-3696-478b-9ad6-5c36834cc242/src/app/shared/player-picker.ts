import { SportEvent, Player, Team } from '../data';

export interface SelectedPlayer {
    ref_student_id: string;
    name: string;
    seat_no: string;
    class_name: string;
    is_team_leader: boolean;
    forceJoin: boolean;
    forceTeamLeader: boolean;
};

export interface PlayerPickerData {
    // 競賽項目
    sportEvent: SportEvent;

    // 團體賽隊伍
    team?: Team;

    // 個人賽選手
    players?: Player[];

    // 選項
    options: PlayerPickerOptions;
}

export interface PlayerPickerOptions {
    // 需要隊名
    needTeamName: boolean;

    // 需要隊長
    needTeamLeader: boolean;

    // 資料來源：同班同學 或 全校同學
    source: 'classmate' | 'student';

    // 填寫人需參賽，但不一定要成為隊長
    registerNeedJoin: boolean;

    // 強制填寫人參賽，且成為隊長
    registerForceTeamLeader: boolean;
}