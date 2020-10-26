import { authRequest } from "@/utils/request";

export async function getAdminMenu(params = []) {
  return authRequest("/api/admin/admin_menu", {
    method: "get",
    params,
  });
}
