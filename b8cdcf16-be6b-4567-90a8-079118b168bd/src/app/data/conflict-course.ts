import { Course } from './course';

/**衝突課程 */
export class ConflictCourse {
  /**課程 */
  course: Course;

  /**相衝突的課程編號清單 */
  conflictCourseIds: string[];

  /**相衝突的課程 */
  conflictCourses: Course[];
}