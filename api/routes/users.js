import express from "express";
import { updateUser, deleteUser, getUser, getUsers} from "../controllers/user.js";
import { verifyToken } from "../utils/verifyToken.js";



const router = express.Router();

router.get("/checkauthentication", verifyToken, (req,res,next)=>{
    res.send("hello user, you are logged in")
})

//UPDATE
router.put("/:id", updateUser);

//DELETE
router.put("/:id", deleteUser);

//GET
router.put("/:id", getUser);

//GET ALL
router.put("/:id", getUsers);


export default router