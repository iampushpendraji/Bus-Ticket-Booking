export interface ApiResult {
    statusCode: number,
    data: any,
    message: string,
    success: boolean
}


export interface NotificationData {
    notificationType: string,
    notificationMessage: string
}