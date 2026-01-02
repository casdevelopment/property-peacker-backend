import { Router } from 'express';

import authorize from "../middlewares/auth.middleware.js";
import { getUser, getUsers, updateUser } from '../controllers/user.controller.js'

const userRouter = Router();

userRouter.get('/', authorize, getUsers);

userRouter.get('/:id', getUser);

// userRouter.post('/', (req, res) => res.send({ title: 'CREATE new user' }));

//userRouter.put('/update/:id', updateUser);

//userRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE user' }));

export default userRouter;