import { Router } from 'express';;
import { register, login, access_token_from_refresh_token, logout, logout_all } from '../controller/user.controller';


const router = Router();


router.route('/register').post(register);
router.route('/login').post(login);
router.route('/access_token_from_refresh_token').get(access_token_from_refresh_token);
router.route('/logout').post(logout);
router.route('/logout_all').post(logout_all);


export default router;