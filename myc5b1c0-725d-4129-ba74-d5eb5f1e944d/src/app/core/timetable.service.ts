import { Injectable } from '@angular/core';
import { DSAService } from '../dsutil-ng/dsa.service';
import { CourseTimetable } from './data/timetable';
import Day from 'dayjs';

const TeacherContract = 'web3.v1.teacher';
const StudentContract = 'web3.v1.student';

const PG_FORMAT = 'YYYY/MM/DD HH:mm:ss';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {

  constructor(
    private dsa: DSAService,
  ) { }

  public async setTimetable(dsns: string, course: Omit<CourseTimetable, 'uid'>) {
    const contract = await this.dsa.getConnection(dsns, TeacherContract);

    const req = {
      "course": {
        ...course,
        period: course.periods // 會由加 s 變成不加 s 跟 xml 結構有關。
      }
    };

    const rsp = await contract.send('mycourse.setTimetable', req);

    const rspjson = rsp?.toCompactJson();

    return rspjson as { result: { action: string, count: number }[] };
  }

  public async getTimetable(dsns: string, role: string, courseId?: string | number) {
    const usedContract = (role === 'teacher') ? TeacherContract : StudentContract;
    const contract = await this.dsa.getConnection(dsns, usedContract);

    const req = courseId ? { course_id: courseId, } : null;
    const rsp = await contract.send('mycourse.getTimetable', req);

    const courses: CourseTimetable[] = rsp?.toCompactJson()?.course ?? [];

    return ([] as CourseTimetable[]).concat(courses);
  }

  public async getReschedule(dsns: string, role: string, weekOffset?: number) {
    const usedContract = (role === 'teacher') ? TeacherContract : StudentContract;
    const contract = await this.dsa.getConnection(dsns, usedContract);

    const today = Day().add(7 * (weekOffset ?? 0), 'day');
    const start = today.day(0).startOf('day').format(PG_FORMAT);
    const end = today.day(6).endOf('day').format(PG_FORMAT);

    console.log(start, end);
    // 直接從這裡算日期。
    const rsp = await contract.send('mycourse.getReschedule', {
      week_start: start,
      week_end: end
    });

    const courses: CourseTimetable[] = rsp?.toCompactJson()?.course ?? [];

    return ([] as CourseTimetable[]).concat(courses);
  }
}
