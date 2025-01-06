export function setValueMas(dataMas: any, value: any, colname: any) {
  //console.log(dataMas,'dataMas');
  
  if (value) {
    const valueMas = dataMas?.filter((el: any) => el[`${colname}`] == value);
    if (Array.isArray(valueMas)) {
      return valueMas[0];
    }
  }
}

export function setValueList(dataMas: any, value: any, colname: any) {

  //console.log(dataMas,"dataMas");
  
  if (dataMas) {
    const valueMas = dataMas.filter((el: any) => el[`${colname}`] == value);
    if (Array.isArray(valueMas)) {
      return valueMas;
    }
  }
}