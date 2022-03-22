import { MatPaginatorIntl } from "@angular/material/paginator";


export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = '每頁筆數：';
  customPaginatorIntl.previousPageLabel = '上一頁'
  customPaginatorIntl.nextPageLabel = '下一頁'
  return customPaginatorIntl;
}