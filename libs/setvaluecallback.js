export function setValueMas(dataMas, value, colname) {
    //console.log(dataMas,'dataMas');
    if (value) {
        const valueMas = dataMas.filter((el) => el[`${colname}`] == value);
        if (Array.isArray(valueMas)) {
            return valueMas[0];
        }
    }
}
export function setValueList(dataMas, value, colname) {
    //console.log(dataMas,"dataMas");
    if (dataMas) {
        const valueMas = dataMas.filter((el) => el[`${colname}`] == value);
        if (Array.isArray(valueMas)) {
            return valueMas;
        }
    }
}
