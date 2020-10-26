import { authRequest } from "@/utils/request";

export async function getSettings() {
  return authRequest("/api/admin/settings");
}

export async function setSettings(params) {
  return authRequest("/api/admin/settings", {
    method: "POST",
    data: params,
  });
}
