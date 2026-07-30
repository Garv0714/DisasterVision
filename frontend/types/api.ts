export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

export interface RootResponse {
  project: string;
  status: string;
}
