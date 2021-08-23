import { Injectable } from '@angular/core';
import { DSAService } from '../dsutil-ng/dsa.service';
import { Course } from './data/timetable';

const TeacherContract = 'web3.v1.teacher';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {

  constructor(
    private dsa: DSAService,
  ) { }

  public async setTimetable(dsns: string, course: Omit<Course, 'uid'>) {
    const contract = await this.dsa.getConnection(dsns, TeacherContract);

    const req = {
      "course": course
    };
    const rsp = await contract.send('mycourse.setTimetable', req);

    const rspjson = rsp?.toCompactJson();

    return rspjson as { result: { action: string, count: number }[] };
  }

  public async getTimetable(dsns: string, courseId?: string | number) {
    const contract = await this.dsa.getConnection(dsns, TeacherContract);

    const req = courseId ? { course_id: courseId, } : null;
    const rsp = await contract.send('mycourse.getTimetable', req);
   
    const courses: Course[] = rsp?.toCompactJson()?.course ?? [];

    return ([] as Course[]).concat(courses);
  }
}
