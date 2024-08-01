import { Router } from 'express';
import { register, sign_in, access_token_from_refresh_token, sign_out, sign_out_all, forget_password, verify_forget_password_otp } from '../controller/user.controller';


const router = Router();


router.route('/register').post(register);
router.route('/sign_in').post(sign_in);
router.route('/access_token_from_refresh_token').get(access_token_from_refresh_token);
router.route('/sign_out').post(sign_out);
router.route('/sign_out_all').post(sign_out_all);
router.route('/forget_password').get(forget_password);
router.route('/verify_forget_password_otp').get(verify_forget_password_otp);


export default router;