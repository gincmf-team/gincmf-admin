import { request } from "@/utils/request";

export async function getCaptcha(params = []) {
  return request("/api/sms_code", {
    method: "POST",
    data: params,
  });
}
