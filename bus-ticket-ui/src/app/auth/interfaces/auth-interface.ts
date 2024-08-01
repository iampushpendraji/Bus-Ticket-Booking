import { ApiResult } from "../../common/interfaces/common-interface";


export interface AuthCookie {
    user_id: number,
    user_type: string,
    refresh_token: string,
    access_token: string
}


export interface SignInResponse extends ApiResult {
    data: AuthCookie
}


export interface SignInUser {
    user_email: string,
    password: string
}