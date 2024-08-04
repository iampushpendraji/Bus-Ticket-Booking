import { ApiResult } from "../../common/interfaces/common-interface";


interface AuthCookie {
    user_id: number,
    user_type: string,
    refresh_token: string,
    access_token: string
}


interface SignInResponse extends ApiResult {
    data: AuthCookie
}


interface VoidResult204 extends ApiResult {
    data: {}
}


interface VerifyForgetPasswordOtp extends ApiResult {
    data: {
        forgot_pass_secret: string
    }
}


interface SignInUser {
    user_email: string,
    password: string
}


interface SignUpUser {
    user_first_name: string,
    user_type: string,
    user_last_name: string,
    user_email: string,
    user_phone: string,
    password: string
}


export { AuthCookie, SignInResponse, VoidResult204, VerifyForgetPasswordOtp, SignInUser, SignUpUser };