import { Router } from 'express';;
import { register } from '../controller/user.controller';


const router = Router();


router.route('/register').post(register);


export default router;