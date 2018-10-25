import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatDialogRef } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable, of, from } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged, switchMap, catchError, tap } from 'rxjs/operators';
import { BasicService, SportService } from '../service';
import { Student } from '../data';
import { SelectedPlayer, PlayerPickerData } from './player-picker';

@Component({
  selector: 'app-player-picker-dialog',
  templateUrl: './player-picker-dialog.component.html',
  styles: [`
    .full-width {
      width: 100%;
    }
  `]
})

export class PlayerPickerDialogComponent implements OnInit {

  loading = false;
  saving = false;

  teamName: string;
  players: Map<string, SelectedPlayer> = new Map();
  gender: string;
  grade: string;
  min_member_count = 0;
  max_member_count = 0;
  memberCountText = '';
  registerForceTeamLeader = false;

  myControl = new FormControl();
  options: SelectedPlayer[] = [];
  filteredOptions: Observable<SelectedPlayer[]>;
  inputPlaceholder = '';

  @ViewChild('memberInput') memberInput: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<PlayerPickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PlayerPickerData,
    private basicSrv: BasicService,
    private sportSrv: SportService,
  ) {
    this.registerForceTeamLeader = this.data.options.registerForceTeamLeader;
    this.gender = this.data.sportEvent.group_types_gender;
    this.grade = this.data.sportEvent.group_types_grade;
    this.min_member_count = +this.data.sportEvent.min_member_count;
    this.max_member_count = +this.data.sportEvent.max_member_count;

    this.memberCountText = (this.min_member_count !== this.max_member_count) ?
      `${this.min_member_count} ~ ${this.max_member_count}`
      :
      `${this.min_member_count}`

    this.inputPlaceholder = (this.data.options.source === 'classmate') ?
      '隊員名單，請輸入同班同學座號...'
      :
      '隊員名單，請輸入姓名關鍵字...';


    if (this.data.team) this.teamName = this.data.team.name;

    const players = (this.data.team ? this.data.team.players : this.data.players) || [];
    for (const item of players) {
      this.players.set(item.ref_student_id, {
        ref_student_id: item.ref_student_id,
        name: item.name,
        seat_no: item.seat_no,
        class_name: item.class_name,
        is_team_leader: (item.is_team_leader === 't'),
        forceJoin: false,
        forceTeamLeader: false,
      });
    }

    // 填寫人需參賽，但不一定要成為隊長
    if (this.data.options.registerNeedJoin) {
      const myInfo = this.sportSrv.myInfo;
      if (!this.players.has(myInfo.id)) {
        this.players.set(myInfo.id, {
          ref_student_id: myInfo.id,
          name: myInfo.name,
          seat_no: myInfo.seat_no,
          class_name: myInfo.class_name,
          is_team_leader: false,
          forceJoin: true,
          forceTeamLeader: false,
        });
      }
    }

    // 強制填寫人參賽，且成為隊長
    if (this.data.options.registerForceTeamLeader) {
      const myInfo = this.sportSrv.myInfo;
      if (!this.players.has(myInfo.id)) {
        this.players.set(myInfo.id, {
          ref_student_id: myInfo.id,
          name: myInfo.name,
          seat_no: myInfo.seat_no,
          class_name: myInfo.class_name,
          is_team_leader: true,
          forceJoin: true,
          forceTeamLeader: true,
        });
      } else {
        const player = this.players.get(myInfo.id);
        player.is_team_leader = true;
        player.forceJoin = true;
        player.forceTeamLeader = true;
      }
    }

    this.toggleMemberInput();
  }

  ngOnInit() {
    try {
      this.loading = true;

      // autocomplete
      if (this.data.options.source === 'classmate') {
        // 同班同學，只取一次資料後，以 filter 方式
        this.getClassmate();
        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(null),
            debounceTime(300),
            distinctUntilChanged(),
            // tap(console.log),
            map((term) => this._filter(term))
          );
      } else {
        // 全校學生，每次呼叫 API 向資料庫取資料後
        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(null),
            debounceTime(300),
            distinctUntilChanged(),
            // tap(console.log),
            switchMap(term => {
              if (term) {
                return from(this.getStudentList(term));
              } else {
                return of([]);
              }
            }),
            catchError(error => {
              return of([]);
            })
          );
      }

    } catch (err) {
      console.log(err);
      this.basicSrv.openSnackBar('發生錯誤！');
    } finally {
      this.loading = false;
    }

  }

  /**
   * 取得同班同學
   */
  async getClassmate() {
    const rsp = await this.sportSrv.getMyClassmate(this.gender);
    this.options = rsp.map((item: Student) => {
      return {
        ref_student_id: item.id,
        name: item.name,
        seat_no: item.seat_no,
        class_name: item.class_name,
        is_team_leader: false,
        forceJoin: false,
        forceTeamLeader: false,
      }
    });
  }

  /**
   * 依學生姓名取得學生清單
   */
  async getStudentList(keyword) {
    const rsp = await this.sportSrv.searchStudents(keyword, this.grade, this.gender);
    const options = rsp.map((item: Student) => {
      return {
        ref_student_id: item.id,
        name: item.name,
        seat_no: item.seat_no,
        class_name: item.class_name,
        is_team_leader: false,
        forceJoin: false,
        forceTeamLeader: false,
      }
    });
    return options;
  }


  /**
   * 選擇選手
   */
  selectedFn(event: MatAutocompleteSelectedEvent): void {
    if (!this.players.has(event.option.value.ref_student_id)) {
      this.players.set(event.option.value.ref_student_id, event.option.value);
    }
    this.memberInput.nativeElement.value = '';
    this.memberInput.nativeElement.blur();
    this.myControl.setValue(null);
    this.toggleMemberInput();
  }

  /**
   * 移除選手
   * @param member 選手
   */
  removePlayer(member: SelectedPlayer) {
    this.players.delete(member.ref_student_id);
    this.toggleMemberInput();
  }

  /**
   * 切換 autocomplete (依人數限制)
   */
  toggleMemberInput() {
    if (this.players.size >= this.max_member_count) {
      this.myControl.disable();
    } else {
      this.myControl.enable();
    }
  }

  /**
   * 設定隊長
   * @param member 選手
   */
  setLeader(member: SelectedPlayer) {
    this.players.forEach(item => {
      item.is_team_leader = (member.ref_student_id === item.ref_student_id ? !item.is_team_leader : false);
    });
  }

  /**
   * 儲存報名
   */
  async save() {

    if (this.players.size < this.min_member_count) {
      this.basicSrv.openSnackBar(`人數：${this.players.size}，低於限制人數 ${this.memberCountText}`); return;
    }
    if (this.players.size > this.max_member_count) {
      this.basicSrv.openSnackBar(`人數：${this.players.size}，高於限制人數 ${this.memberCountText}`); return;
    }

    if (this.data.options.needTeamName && !this.teamName) {
      this.basicSrv.openSnackBar('需填寫隊伍名稱！'); return;
    }
    if (this.data.options.needTeamLeader) {
      let hasTeamLeader = false;
      this.players.forEach(item => { if (item.is_team_leader) hasTeamLeader = true; });
      if (!hasTeamLeader) {
        this.basicSrv.openSnackBar('請選擇隊長！'); return;
      }
    }

    if (this.saving) return;

    this.saving = true;

    try {
      const rsp = await this.sportSrv.setJoin(
        this.data.sportEvent.uid,
        [ ...this.players.values()],
        this.teamName,
        (this.data.team) ? this.data.team.uid : null
      );
      // console.log(rsp);
      if (rsp.Info === 'success') {
        this.dialogRef.close(true);
      } else {
        rsp.Data = [].concat(rsp.Data || []);
        const detial = rsp.Data.map(item => `${item.name}`);
        this.basicSrv.openSnackBar(`${rsp.Msg} ${detial.join(',')}`);
      }

    } catch (error) {
      this.basicSrv.openSnackBar(error || '儲存失敗！');
    } finally {
      this.saving = false;
    }

  }

  /**
   * 篩選 autocomplete
   * @param data input 輸入框的物件。可能是字串、可能是 player、可能是空值
   */
  private _filter(data: string | any | null): SelectedPlayer[] {
    if (!data) return this.options;
    if (data.ref_student_id) return [data];

    // 字串篩選
    const filterValue = data.toLowerCase();
    return this.options.filter(option => option.seat_no.toLowerCase().indexOf(filterValue) === 0);
  }
}
