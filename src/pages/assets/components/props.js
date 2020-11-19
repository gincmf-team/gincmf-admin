export function uploadProps(type,onChange) {
    let token = localStorage.getItem("token");
    if (token) {
      token = JSON.parse(token);
    }
    return {
        name: "file[]",
        multiple: true,
        action: "/api/admin/assets",
        data: { type },
        headers: {
            Authorization: `Bearer ${token.access_token}`,
        },
        onChange(info) {
            window.console.log(info);
            if (info.file.status === "done") {
                if (onChange) {
                    onChange()
                }
            }
        },
    }

};