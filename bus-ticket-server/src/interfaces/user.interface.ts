interface UserType {
    user_first_name: string,
    user_type: string,
    user_last_name: string,
    user_email: string,
    user_phone: string,
    password: string,
    created_on?: number,
    updated_on?: number,
    is_active?: 0 | 1
}

interface TokenUserDetail { 
    user_id: number, 
    user_type: string 
}

export { UserType, TokenUserDetail }