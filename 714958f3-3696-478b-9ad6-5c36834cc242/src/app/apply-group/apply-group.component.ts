import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { BasicService, SportService } from '../service';
import { Team, SportEvent, LoginAccount } from '../data';
import { ConfirmDialogComponent } from './../shared';

import * as moment from 'moment';
import { PlayerPickerDialogComponent } from '../shared/player-picker-dialog.component';
import { PlayerPickerData } from '../shared/player-picker';

@Component({
  selector: 'app-apply-group',
  templateUrl: './apply-group.component.html',
  styles: []
})
export class ApplyGroupComponent implements OnInit {

  loading: boolean;
  errorMsg: string;
  eventId: string;
  myInfo: LoginAccount;
  isSaving = false;

  teams: Team[] = [];
  sportEvent: SportEvent;
  memberCountText: string;

  isRegPeriod = false; // 在報名期間
  isDrawLotPeriod = false; // 在抽籤期間
  isCanReg = false; // 可以報名

  constructor(
    private basicSrv: BasicService,
    private sportSrv: SportService,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public dialog: MatDialog) {
      this.route.paramMap.subscribe(params => {
        this.eventId = params.get('event_id');
        this.sportEvent = this.sportSrv.getActionEventById(this.eventId);
        this.myInfo = this.sportSrv.myInfo;
        this.memberCountText = (this.sportEvent.min_member_count !== this.sportEvent.max_member_count) ?
          `${this.sportEvent.min_member_count} ~ ${this.sportEvent.max_member_count}`
          :
          `${this.sportEvent.min_member_count}`
      });
  }

  ngOnInit() {
    if (!this.sportEvent.uid) {
      this.errorMsg = '編號不正確！';
    } else {
      try {
        this.loading = true;
        this.getRegData();
      } catch (err) {
        console.log(err);
        this.openSnackBar('發生錯誤！', '');
      } finally {
        this.loading = false;
      }
    }
  }

  // 取得比賽項目，並確認時間及狀態
  async getRegData() {
    let isRegistered = false; // 是否已報名

    const ary = [
      this.basicSrv.getDate(),
      this.sportSrv.getEventTeams(this.eventId)
    ];

    const data = await Promise.all(ary);

    // 取得系統時間
    const serverTimestamp = moment(data[0]).format('YYYY-MM-DD');
    this.teams = data[1];

    // 報名期間
    this.isRegPeriod = (moment(serverTimestamp) >= moment(this.sportEvent.reg_start_date) &&
      moment(serverTimestamp) <= moment(this.sportEvent.reg_end_date));

    // 抽籤期間
    this.isDrawLotPeriod = (this.sportEvent.is_draw_lots === 't') ?
      (moment(serverTimestamp) >= moment(this.sportEvent.draw_lots_start_date) &&
      moment(serverTimestamp) <= moment(this.sportEvent.draw_lots_end_date))
      : false;

    // 確認是否已報名、我擔任隊長的系統編號，我填單的隊伍系統編號
    for (const team of this.teams) {
      team.isCanModify = false;  // 可以編輯
      team.isCanDrawLot = false; // 可以抽籤

      for (const item of team.players) {
        if (item.is_myself === 't') {
          // 我已報名
          isRegistered = true;

          // 是否可抽籤
          // 1. 團體賽。我是隊長。
          // 2. 個人賽+體育股長報名。我是參賽者。
          // 3. 個人賽+非體育股長報名。我是填單人。
          if (this.sportEvent.is_draw_lots === 't') {
            if (this.sportEvent.is_team === 't') {
              if (item.is_team_leader === 't') team.isCanDrawLot = true;
            } else {
              if (this.sportEvent.athletic_only === 't') {
                team.isCanDrawLot = true;
              } else {
                if (team.created_by === this.myInfo.sa_login_name) team.isCanDrawLot = true;
              }
            }
          }
        }

        // 我是填單人，我可以編輯
        if (team.created_by === this.myInfo.sa_login_name) team.isCanModify = true;
      }
    }

    // 是否可報名
    // 1. 限體育股長。我是體育股長 + 符合年級限制
    // 2. 限特定人員。我是特定人員
    // 3. 全校報名。符合年級、性別限制、且尚未報名
    if (this.sportEvent.athletic_only === 't') {
      this.isCanReg = (this.myInfo.is_sports_chief === 't'
        && (
          this.sportEvent.group_types_grade ?
          this.sportEvent.group_types_grade === this.myInfo.grade_year : true));
    } else if (this.sportEvent.is_reg_limit === 't') {
      this.isCanReg = (this.sportEvent.is_registration === 't');
    } else {
      this.isCanReg = (!isRegistered
        && (this.sportEvent.group_types_gender ?
          this.sportEvent.group_types_gender === this.myInfo.gender : true)
        && (this.sportEvent.group_types_grade ?
          this.sportEvent.group_types_grade === this.myInfo.grade_year : true)
      );
    }
  }

  /**
   * 詢問是否要抽籤，並抽籤
   */
  async onDrawLotClick(team) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { title: '抽籤', body: '您確定要抽籤嗎？' }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          if (this.isSaving) return;

          this.isSaving = true;
          await this.sportSrv.setLotNo(this.eventId, team.uid);
          this.getRegData();
        } catch (error) {
          this.openSnackBar(error, '');
        } finally {
          this.isSaving = false;
        }
      }
    });
  }

  /**
   * 取消報名
   * @param team 隊伍
   */
  async removeJoin(team) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { title: '取消報名', body: '您確定要取消報名嗎？' }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          if (this.isSaving) return;

          this.isSaving = true;
          await this.sportSrv.removeJoin(this.eventId, team.uid);
          this.getRegData();
        } catch (error) {
          this.openSnackBar(error, '');
        } finally {
          this.isSaving = false;
        }
      }
    });
  }

  /**
   * 編輯隊伍
   * @param team
   */
  openReg(team) {
    const dialogRef = this.dialog.open(PlayerPickerDialogComponent, {
      width: '80%',
      data: {
        sportEvent: this.sportEvent,
        team: team,
        options: {
          needTeamName: true,
          needTeamLeader: (this.sportEvent.is_sport_meet === 't' ? false : true), // 運動會不需隊長
          source: (this.sportEvent.athletic_only === 't' ? 'classmate' : 'student'), // 體育股長限選同班同學
          registerNeedJoin: (this.sportEvent.is_reg_all === 't'), // 全校報名時，填寫人需參賽
          registerForceTeamLeader: (this.sportEvent.is_reg_all === 't'), // 全校報名時，填寫人強制成為隊長
        },
      } as PlayerPickerData,
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) this.getRegData();
    });
  }

  /**
   * 頁面下方的 SnackBar
   * @param message 訊息文字
   * @param action 按鈕文字
   */
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

}
