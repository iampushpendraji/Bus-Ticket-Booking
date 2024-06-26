import { Router } from 'express';;
import { register, login, accessTokenFromRefreshToken, logout } from '../controller/user.controller';


const router = Router();


router.route('/register').post(register);
router.route('/login').post(login);
router.route('/accessTokenFromRefreshToken').get(accessTokenFromRefreshToken);
router.route('/logout').post(logout);


export default router;