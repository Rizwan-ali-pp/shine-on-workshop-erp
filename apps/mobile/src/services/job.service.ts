import api from "@/lib/api";
import { Job, JobPaginatedResponse, JobParams, JobStatus } from "@/types/job";

export async function getJobs(params?: JobParams): Promise<JobPaginatedResponse> {
  const { data } = await api.get("/jobs", { params });
  return data;
}

export async function getJob(id: string): Promise<Job> {
  const { data } = await api.get(`/jobs/${id}`);
  return data;
}

export async function createJob(jobData: {
  customerName: string;
  customerPhone: string;
  vehicleRegistration: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  estimatedTotal: number;
  advanceAmount: number;
  notes?: string;
  services: { serviceId: string; quotedPrice: number; notes?: string }[];
}): Promise<Job> {
  const { data } = await api.post("/jobs", jobData);
  return data;
}

export async function updateJobStatus({
  id,
  status,
}: {
  id: string;
  status: JobStatus;
}): Promise<Job> {
  const { data } = await api.patch(`/jobs/${id}`, { status });
  return data;
}
