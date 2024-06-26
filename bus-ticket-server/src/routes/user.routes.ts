import { Router } from 'express';;
import { register, login, accessTokenFromRefreshToken } from '../controller/user.controller';


const router = Router();


router.route('/register').post(register);
router.route('/login').post(login);
router.route('/accessTokenFromRefreshToken').get(accessTokenFromRefreshToken);


export default router;