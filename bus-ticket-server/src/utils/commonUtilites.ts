/**
 * 
 * @name - getCurrentUTCTime
 * @desc - It will return current UTC time
 * 
 */


function getCurrentUTCTime() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = ('0' + (now.getUTCMonth() + 1)).slice(-2);
    const day = ('0' + now.getUTCDate()).slice(-2);
    const hours = ('0' + now.getUTCHours()).slice(-2);
    const minutes = ('0' + now.getUTCMinutes()).slice(-2);
    const seconds = ('0' + now.getUTCSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


/**
 * 
 * @name - checkAllRequiredKeysData
 * @desc - 
 * - It will check whether all {data} has all the require keys and it should not be empty as well
 * - It will return status and the keys which are missing or data is not there
 * 
 */


function checkAllRequiredKeysData(data: any, required_keys: string[]): { status: boolean, not_exists_keys: string[], not_exists_value: string[] } {
    let notExistsKeys: string[] = [], notExistsValue: string[] = [];
    required_keys.map((p: string) => {
        if(!data.hasOwnProperty(p)) notExistsKeys.push(p);     // If kes does not exists in object itself then we will put it in {notExistsKeys}
        if(!data[p]) notExistsValue.push(p);     // If key does not have any data then we will put it in {notExistsValue}
    });
    if(notExistsKeys.length > 0 || notExistsValue.length > 0) return { status: false, not_exists_keys: notExistsKeys, not_exists_value: notExistsValue};
    else return { status: true, not_exists_keys: [], not_exists_value: []};
}

export { getCurrentUTCTime, checkAllRequiredKeysData };