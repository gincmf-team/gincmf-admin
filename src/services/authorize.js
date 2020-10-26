import { authRequest } from "@/utils/request";

export async function getAuthorizes(params) {
  return authRequest(`/api/admin/authorize`, {
    method: "get",
    params,
  });
}

export async function getAuthorize(id, params) {
  return authRequest(`/api/admin/authorize/${id}`, {
    method: "get",
    params,
  });
}
