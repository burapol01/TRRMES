export function setValueMas(dataMas: any, value: any, colname: any) {
  if (value) {
    const valueMas = dataMas.filter((el: any) => el[`${colname}`] == value);
    if (Array.isArray(valueMas)) {
      return valueMas[0];
    }
  }
}