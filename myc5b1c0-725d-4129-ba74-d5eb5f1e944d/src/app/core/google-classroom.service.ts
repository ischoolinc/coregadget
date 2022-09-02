import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { map } from 'rxjs/operators';
import { ConnectedServiceType } from './connected-setting.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleClassroomService {

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
  }

  public async getCourses(dsns: string, serviceType: ConnectedServiceType, userId: string, courseStates = 'ACTIVE') {
    return this.http.get<GoogleClassroomCourse[]>(`${this.config.API_BASE}/google_classroom/courses?dsns=${dsns}&service_type=${serviceType}&userId=${userId}&courseStates=${courseStates}`)
    .pipe(
      map(v => (v as any).courses)
    )
    .toPromise();
  }

  public async getCourse(dsns: string, serviceType: ConnectedServiceType, courseId: string) {
    return this.http.get<GoogleClassroomCourse>(`${this.config.API_BASE}/google_classroom/courses/${courseId}?dsns=${dsns}&service_type=${serviceType}`).toPromise();
  }

  public async createCourse(dsns: string, serviceType: ConnectedServiceType, course: GoogleClassroomCourseBase) {
    return this.http.post<GoogleClassroomCourse>(`${this.config.API_BASE}/google_classroom/courses?dsns=${dsns}&service_type=${serviceType}`, {
      course
    }).toPromise();
  }

  public async updateCourse(dsns: string, serviceType: ConnectedServiceType, courseId: string, course: any) {
    return this.http.put(`${this.config.API_BASE}/google_classroom/courses/${courseId}?dsns=${dsns}&service_type=${serviceType}`, {
      course
    }).toPromise();
  }

  public async patchCourse(dsns: string, serviceType: ConnectedServiceType, courseId: string, course: any) {
    return this.http.patch<GoogleClassroomCourse>(`${this.config.API_BASE}/google_classroom/courses/${courseId}?dsns=${dsns}&service_type=${serviceType}`, {
      course
    }).toPromise();
  }

  public async delCourse(dsns: string, serviceType: ConnectedServiceType, courseId: string) {
    return this.http.delete(`${this.config.API_BASE}/google_classroom/courses/${courseId}?dsns=${dsns}&service_type=${serviceType}`).toPromise();
  }

  public async getStudents(dsns: string, serviceType: ConnectedServiceType, courseId: string) {
    return this.http.get(`${this.config.API_BASE}/google_classroom/courses/${courseId}/students?dsns=${dsns}&service_type=${serviceType}`).toPromise();
  }

  public async getStudent(dsns: string, serviceType: ConnectedServiceType, courseId: string, userId: string) {
    return this.http.get(`${this.config.API_BASE}/google_classroom/courses/${courseId}/students/${userId}?dsns=${dsns}&service_type=${serviceType}`).toPromise();
  }

  public async createStudent(dsns: string, serviceType: ConnectedServiceType, courseId: string, userId: string) {
    return this.http.post(`${this.config.API_BASE}/google_classroom/courses/${courseId}/students?dsns=${dsns}&service_type=${serviceType}`, {
      userId
    }).toPromise();
  }

  public async delStudent(dsns: string, serviceType: ConnectedServiceType, courseId: string, userId: string) {
    return this.http.delete(`${this.config.API_BASE}/google_classroom/courses/${courseId}/students/${userId}?dsns=${dsns}&service_type=${serviceType}`).toPromise();
  }

  public async getTeachers(dsns: string, serviceType: ConnectedServiceType, courseId: string) {
    return this.http.get(`${this.config.API_BASE}/google_classroom/courses/${courseId}/teachers?dsns=${dsns}&service_type=${serviceType}`).toPromise();
  }

  public async getTeacher(dsns: string, serviceType: ConnectedServiceType, courseId: string, userId: string) {
    return this.http.get(`${this.config.API_BASE}/google_classroom/courses/${courseId}/teachers/${userId}?dsns=${dsns}&service_type=${serviceType}`).toPromise();
  }

  public async createTeacher(dsns: string, serviceType: ConnectedServiceType, courseId: string, userId: string) {
    return this.http.post(`${this.config.API_BASE}/google_classroom/courses/${courseId}/teachers?dsns=${dsns}&service_type=${serviceType}`, {
      userId
    }).toPromise();
  }

  public async delTeacher(dsns: string, serviceType: ConnectedServiceType, courseId: string, userId: string) {
    return this.http.delete(`${this.config.API_BASE}/google_classroom/courses/${courseId}/teachers/delete/${userId}?dsns=${dsns}&service_type=${serviceType}`).toPromise();
  }

  public async getInvitations(dsns: string, serviceType: ConnectedServiceType, ) {
    return this.http.get(`${this.config.API_BASE}/google_classroom/invitations?dsns=${dsns}&service_type=${serviceType}`).toPromise();
  }

  public async getInvitation(dsns: string, serviceType: ConnectedServiceType, invitationId: string) {
    return this.http.get(`${this.config.API_BASE}/google_classroom/invitations/${invitationId}?dsns=${dsns}&service_type=${serviceType}`).toPromise();
  }

  public async createInvitation(dsns: string, serviceType: ConnectedServiceType, invitation: any) {
    return this.http.post(`${this.config.API_BASE}/google_classroom/invitations?dsns=${dsns}&service_type=${serviceType}`, {
      invitation
    }).toPromise();
  }

  public async delInvitation(dsns: string, serviceType: ConnectedServiceType, invitationId: string) {
    return this.http.delete(`${this.config.API_BASE}/google_classroom/invitations/${invitationId}?dsns=${dsns}&service_type=${serviceType}`).toPromise();
  }

  public async acceptInvitation(dsns: string, serviceType: ConnectedServiceType, invitationId: string) {
    return this.http.post(`${this.config.API_BASE}/google_classroom/invitations/${invitationId}/accept?dsns=${dsns}&service_type=${serviceType}`, {}).toPromise();
  }

  public async getCourseAlias(dsns: string, serviceType: ConnectedServiceType, courseId: string) {
    return this.http.get<{ aliases: { alias: string[] }}>(`${this.config.API_BASE}/google_classroom/courses/${courseId}/aliases?dsns=${dsns}&service_type=${serviceType}`).toPromise();
  }

  public async setCourseAlias(dsns: string, serviceType: ConnectedServiceType, courseId: string, alias: string) {
    return this.http.post(`${this.config.API_BASE}/google_classroom/courses/${courseId}/aliases?dsns=${dsns}&service_type=${serviceType}`, {
      alias
    }).toPromise();
  }

  public async delCourseAlias(dsns: string, serviceType: ConnectedServiceType, courseId: string, alias: string) {
    return this.http.delete(`${this.config.API_BASE}/google_classroom/courses/${courseId}/aliases/${alias}?dsns=${dsns}&service_type=${serviceType}`).toPromise();
  }

  public getGoogleSigninChooserUrl(url: string = '') {
    const finalUrl = `https://accounts.google.com/ServiceLogin/signinchooser?service=accountsettings&continue=${url}`;
    // console.log(finalUrl);
    return finalUrl;
  }
}

export type GoogleCourseState = 'COURSE_STATE_UNSPECIFIED' | 'ACTIVE' | 'ARCHIVED' | 'PROVISIONED' | 'DECLINED' | 'SUSPENDE';
export type GoogleCourseRole = 'COURSE_ROLE_UNSPECIFIED' | 'STUDENT' | 'TEACHER' | 'OWNER';

export class GoogleClassroomCourseBase {
  id: string = '';
  name: string = '';
  ownerId: string = '';
  section?: string;
  descriptionHeading?: string;
  description?: string;
  room?: string;
  courseState?: GoogleCourseState;
}

export class GoogleClassroomCourse extends GoogleClassroomCourseBase {
  creationTime: string = '';
  updateTime: string = '';
  enrollmentCode: string = '';
  alternateLink: string = '';
  teacherGroupEmail: string = '';
  courseGroupEmail: string = '';
  teacherFolder: any;
  courseMaterialSets?: any[];
  guardiansEnabled: boolean = false;
  calendarId: string = '';
}

export interface GoogleClassroomInvitation {
  id: string;
  userId: string;
  courseId: string;
  role: GoogleCourseRole;
}

export type ErrorWithGC = {
  error: {
    message: string;
    errors: {
      message: string;
      domain: string;
      reason: string;
    }[];
    status: string;
  }
}
