export interface ServiceConf {
  uid:        string;
  course_id:  number;
  service_id: string;
  conf:       any;
  link:       string;
  enabled:    boolean;
  order:      number;
}

export interface CustomizeService {
  title: string;
  link: string;
  order: number;
  enabled: boolean;
  source?: CustomizeService;
  inEdit?: boolean;
}
