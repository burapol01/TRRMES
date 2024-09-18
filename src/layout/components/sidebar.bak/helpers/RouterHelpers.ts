import { MenuFunc } from "../../../../../types/user"

export function getCurrentUrl(pathname:string) {
  return pathname.split(/[?#]/)[0]
}

export function checkIsActive(pathname:string, url:string) {
  const current = getCurrentUrl(pathname)
  if (!current || !url) {
    return false
  }

  if (current === url) {
    return true
  }

  if (current.indexOf(url) > -1) {
    return true
  }

  return false
}

export function checkIsMunuPermis(pathname: string, url: string, dataMenu:any, dataMenuFunc: any) {
  const current = getCurrentUrl(pathname)
  const menuData = dataMenuFunc?.filter((el: any) => el.menu_id == dataMenu?.menu_id);

  if (!current || !url) {
    return null
  }

  if (current === url) {
    return menuData
  }

  if (current.indexOf(url) > -1) {
    return menuData
  }

  return false
}


export function checkMenuPermisctionList(menuFunc: MenuFunc[]) {


  const menu = menuFunc?.filter(
    (el: any) => el.funct_oth == "LIST"
  );
  // Translate func_name values using the translationMap
  // const translatedMenu = menu.map((item: any) => {
  //   const translatedFuncName = menu_th[`MENUFUNC.${item.func_name}`];
  //   if (translatedFuncName) {
  //     return { ...item, func_name_th: translatedFuncName };
  //   }
  //   return item;
  // });
  // return translatedMenu;
  return menu;
}

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
interface JsonArray extends Array<JsonValue> { }
// Function to update a value in a JSON file
export async function checkMenuPermisction(newValue: JsonValue): Promise<void> {

  const newObject: any = new Object();
  Array.isArray(newValue) && newValue.forEach((item: any) => {
    if (item.funct_oth == "#") {
      newObject[`${item.func_name}`] = item.display_name
    }
  })
  console.log(newObject,'newObjectnewObject');
  
  return newObject
}