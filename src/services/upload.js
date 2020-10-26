import { authRequest } from "@/utils/request";

export async function getUpload() {
  return authRequest("/api/admin/upload", {
    method: "get",
  });
}

export async function updateUpload(params) {
  return authRequest("/api/admin/upload", {
    method: "post",
    data: params,
  });
}
