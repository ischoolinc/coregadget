import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { BasicService, SportService } from '../service';
import { Player, SportEvent, LoginAccount } from '../data';
import { ConfirmDialogComponent } from './../shared';

import * as moment from 'moment';
import { PlayerPickerDialogComponent } from '../shared/player-picker-dialog.component';
import { PlayerPickerData } from '../shared/player-picker';

@Component({
  selector: 'app-apply-single',
  templateUrl: './apply-single.component.html',
  styles: []
})
export class ApplySingleComponent implements OnInit {

  loading: boolean;
  errorMsg: string;
  eventId: string;
  myInfo: LoginAccount;
  isSaving = false;

  players: Player[] = [];
  sportEvent: SportEvent;

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
      this.sportSrv.getEventPlayers(this.eventId)
    ];

    const data = await Promise.all(ary);

    // 取得系統時間
    const serverTimestamp = moment(data[0]).format('YYYY-MM-DD');
    this.players = data[1];

    // 報名期間
    this.isRegPeriod = (moment(serverTimestamp) >= moment(this.sportEvent.reg_start_date) &&
      moment(serverTimestamp) <= moment(this.sportEvent.reg_end_date));

    // 抽籤期間
    this.isDrawLotPeriod = (this.sportEvent.is_draw_lots === 't') ?
      (moment(serverTimestamp) >= moment(this.sportEvent.draw_lots_start_date) &&
      moment(serverTimestamp) <= moment(this.sportEvent.draw_lots_end_date))
      : false;

    // 確認是否已報名、我填單的隊伍系統編號
    for (const player of this.players) {
      player.isCanModify = false;  // 可以編輯
      player.isCanDrawLot = false; // 可以抽籤

      if (player.is_myself === 't') {
        // 我已報名
        isRegistered = true;

        // 是否可抽籤
        // 1. 團體賽。我是隊長。
        // 2. 個人賽+體育股長報名。我是參賽者。
        // 3. 個人賽+非體育股長報名。我是填單人。
        if (this.sportEvent.is_draw_lots === 't') {
          if (this.sportEvent.is_team === 't') {
            if (player.is_team_leader === 't') player.isCanDrawLot = true;
          } else {
            if (this.sportEvent.athletic_only === 't') {
              player.isCanDrawLot = true;
            } else {
              if (player.created_by === this.myInfo.sa_login_name) player.isCanDrawLot = true;
            }
          }
        }
        // 我是填單人，我可以編輯
        if (player.created_by === this.myInfo.sa_login_name) player.isCanModify = true;
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
   * 詢問是否要報名，並報名
   */
  openReg() {
    // 全校報名-自己
    // 體育股長-選擇同班同學
    // 特定人員-選擇全校人員
    if (this.sportEvent.is_reg_all === 't') {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '250px',
        data: { title: '報名', body: '您確定要報名嗎？' }
      });

      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          try {
            if (this.isSaving) return;

            this.isSaving = true;

            const player = [{
              ref_student_id: this.myInfo.id,
              is_team_leader: true,
            }];

            await this.sportSrv.setJoin(this.eventId, player);

            this.getRegData();

          } catch (error) {
            this.openSnackBar('報名失敗！', '');
          } finally {
            this.isSaving = false;
          }
        }
      });
    } else {
      const dialogRef = this.dialog.open(PlayerPickerDialogComponent, {
        width: '80%',
        data: {
          sportEvent: this.sportEvent,
          players: [],
          options: {
            needTeamName: false,
            needTeamLeader: false, // 個人賽不需隊長
            source: (this.sportEvent.athletic_only === 't' ? 'classmate' : 'student'), // 體育股長限選同班同學
            registerNeedJoin: false,
            registerForceTeamLeader: false,
          },
        } as PlayerPickerData,
      });

      dialogRef.afterClosed().subscribe(async result => {
        if (result) this.getRegData();
      });
    }
  }

  /**
   * 詢問是否要抽籤，並抽籤
   */
  async onDrawLotClick(player) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { title: '抽籤', body: '您確定要抽籤嗎？' }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          if (this.isSaving) return;

          this.isSaving = true;
          await this.sportSrv.setLotNo(this.eventId, player.uid);
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
   * @param player 選手
   */
  async removeJoin(player) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { title: '取消報名', body: '您確定要取消報名嗎？' }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          if (this.isSaving) return;

          this.isSaving = true;
          await this.sportSrv.removeJoin(this.eventId, player.uid);
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
