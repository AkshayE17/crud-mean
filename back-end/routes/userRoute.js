import express from 'express'
import upload from '../config/multerConfig.js';
import userController from '../controller/userController.js';
import verifyToken from '../middlewares/verifyToken.js';

const userRoute =express();

userRoute.post('/register', upload.single('photo'), userController.userRegister);
userRoute.post('/login', userController.userLogin);
userRoute.post('/adminlogin', userController.adminLogin);
userRoute.get('/users', userController.getUser);
userRoute.put('/update/:id',upload.single('photo'), userController.updateUser);
userRoute.get('/search', verifyToken, userController.searchUser); // Search users by term
userRoute.delete('/users/:id', userController.deleteUser);

export default userRoute;