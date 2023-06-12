const express=require('express');
const router=express.Router();

const userController=require('../controllers/user_controller');



router.get('/profile',userController.profile);

router.get('/dashboard',userController.dashboard);

router.get('/signin',userController.signin);

router.get('/signup',userController.signup);


router.post('/create',userController.create);






module.exports=router;