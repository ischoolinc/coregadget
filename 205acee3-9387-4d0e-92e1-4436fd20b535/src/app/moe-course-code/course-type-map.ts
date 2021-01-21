import { Required, RequiredBy } from './graduation-plan/common';

/** 課程類別對應課程規劃的分類。
 * https://3.basecamp.com/4399967/buckets/15765350/todos/3168819285
*/
export const CourseTypeMap = new Map<string | undefined, { required: Required, requiredBy: RequiredBy }>([
  ['1', { requiredBy: '部訂', required: '必修' }],
  ['2', { requiredBy: '校訂', required: '必修' }],
  ['3', { requiredBy: '校訂', required: '選修' }],
  ['4', { requiredBy: '校訂', required: '選修' }],
  ['5', { requiredBy: '校訂', required: '選修' }],
  ['6', { requiredBy: '校訂', required: '選修' }],
  ['7', { requiredBy: '校訂', required: '選修' }],
  ['8', { requiredBy: '校訂', required: '選修' }],
  ['9', { requiredBy: '校訂', required: '選修' }],
  ['A', { requiredBy: '校訂', required: '選修' }],
  ['B', { requiredBy: '校訂', required: '選修' }],
  ['C', { requiredBy: '校訂', required: '選修' }],
  ['D', { requiredBy: '校訂', required: '選修' }],
  ['E', { requiredBy: '校訂', required: '選修' }],
  ['F', { requiredBy: '校訂', required: '選修' }],
  [undefined, { requiredBy: '校訂', required: '選修' }],
]);
