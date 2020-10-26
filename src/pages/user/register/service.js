import { request } from "@/utils/request";

export async function register(params = []) {
  return request("/api/tenant/register", {
    method: "POST",
    data: params,
  });
}
