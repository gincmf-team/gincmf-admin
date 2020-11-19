import { authRequest } from "@/utils/request";

export async function getPortalCategorys(params) {
    return authRequest("/api/admin/v1/portal/category", {
        method: "GET",
        params,
    });
}

export async function getPortalCategory(id,params) {
    return authRequest(`/api/admin/v1/portal/category/${id}`, {
        method: "GET",
        params,
    });
}

export async function getPortalCategoryList(params) {
    return authRequest("/api/admin/v1/portal/category_list", {
        method: "GET",
        params,
    });
}

export async function addPortalCategory(params) {
    return authRequest("/api/admin/v1/portal/category", {
        method: "POST",
        data:params,
    });
}

export async function updatePortalCategory(id,params) {
    return authRequest(`/api/admin/v1/portal/category/${id}`, {
        method: "POST",
        data:params,
    });
}

export async function deletePortalCategory(id,params) {
    return authRequest(`/api/admin/v1/portal/category/${id}`, {
        method: "DELETE",
        data:params,
    });
}

