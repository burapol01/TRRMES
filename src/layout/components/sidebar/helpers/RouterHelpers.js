export function getCurrentUrl(pathname) {
    return pathname.split(/[?#]/)[0];
}
export function checkIsActive(pathname, url) {
    const current = getCurrentUrl(pathname);
    if (!current || !url) {
        return false;
    }
    if (current === url) {
        return true;
    }
    if (current.indexOf(url) > -1) {
        return true;
    }
    return false;
}
export function checkIsMunuPermis(pathname, url, dataMenu, dataMenuFunc) {
    const current = getCurrentUrl(pathname);
    const menuData = dataMenuFunc?.filter((el) => el.menu_id == dataMenu?.menu_id);
    if (!current || !url) {
        return null;
    }
    if (current === url) {
        return menuData;
    }
    if (current.indexOf(url) > -1) {
        return menuData;
    }
    return false;
}
export function checkMenuPermisctionList(menuFunc) {
    const menu = menuFunc?.filter((el) => el.funct_oth == "LIST");
    return menu;
}
// Function to update a value in a JSON file
export async function checkMenuPermisction(newValue) {
    const newObject = new Object();
    Array.isArray(newValue) && newValue.forEach((item) => {
        if (item.funct_oth == "#") {
            newObject[`${item.func_name}`] = item.func_name;
        }
    });
    return newObject;
}
