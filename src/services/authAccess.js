import { authRequest } from "@/utils/request";

export async function getData(id, params) {
  return authRequest(`/api/admin/auth_access/${id}`, {
    method: "GET",
    params,
  });
}

export async function addData(params) {
  return authRequest("/api/admin/auth_access", {
    method: "POST",
    data: params,
  });
}

export async function editData(id, params) {
  return authRequest(`/api/admin/auth_access/${id}`, {
    method: "POST",
    data: params,
  });
}
