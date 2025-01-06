type DataObject = any;
 
export function checkValidate(data: DataObject, columnMulti: any): DataObject {
    return Object.entries(data)
        .filter(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                // Filter nested objects
                const filteredNested = checkValidate(value, columnMulti);
                return Object.keys(filteredNested).length > 0; // Keep if nested object has any true values
            }
            return key
        })
        .reduce((acc: DataObject, [key, value]) => {
            if (typeof value === 'object' && value !== null) {
                acc[key] = columnMulti.includes(key) ? !value : checkValidate(value, columnMulti); // Recursively filter nested objects
            } else {
                acc[key] = !value;
            }
            return acc;
        }, {});
}
 
export function isCheckValidateAll(data: DataObject): DataObject {
    return Object.entries(data)
        .filter(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                // Filter nested objects
                const filteredNested = isCheckValidateAll(value);
                return Object.keys(filteredNested).length > 0; // Keep if nested object has any true values
            }
            return value === true;
        })
        .reduce((acc: DataObject, [key, value]) => {
            if (typeof value === 'object' && value !== null) {
                acc[key] = isCheckValidateAll(value); // Recursively filter nested objects
            } else {
                acc[key] = value;
            }
            return acc;
        }, {});
}