import { authRequest } from "@/utils/request";

export async function getRoles(params) {
  return authRequest("/api/admin/role", {
    method: "GET",
    params,
  });
}

export async function getRole(id, params) {
  return authRequest(`/api/admin/role/${id}`, {
    method: "GET",
    params,
  });
}

export async function deleteRole(id) {
  return authRequest(`/api/admin/role/${id}`, {
    method: "delete",
  });
}
