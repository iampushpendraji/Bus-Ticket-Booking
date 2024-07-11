/**
 * 
 * @name - get_current_UTC_time
 * @desc - It will return current UTC time
 * 
 */


function get_current_UTC_time() {
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
 * @name - check_all_required_keys_data
 * @desc - 
 * - It will check whether all {data} has all the require keys and it should not be empty as well
 * - It will return status and the keys which are missing or data is not there
 * 
 */


function check_all_required_keys_data(data: any, required_keys: string[]): { status: boolean, not_exists_keys: string[], not_exists_value: string[] } {
    let not_exists_keys: string[] = [], not_exists_value: string[] = [];
    required_keys.map((p: string) => {
        if(!data.hasOwnProperty(p)) not_exists_keys.push(p);     // If kes does not exists in object itself then we will put it in {notExistsKeys}
        if(!data[p]) not_exists_value.push(p);     // If key does not have any data then we will put it in {notExistsValue}
    });
    if(not_exists_keys.length > 0 || not_exists_value.length > 0) return { status: false, not_exists_keys: not_exists_keys, not_exists_value: not_exists_value};
    else return { status: true, not_exists_keys: [], not_exists_value: []};
}

export { get_current_UTC_time, check_all_required_keys_data };