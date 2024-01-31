import {Router} from "express";
import {loginUser, logoutUser, refreshAccessToken, registerUser} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    //uploading files to local storage using multer
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)

//secured Routes

router.route("/logout").post(verifyJWT, logoutUser) //we are adding verifyJWT middleware to delete accessTokens and verify refreshToken
router.route("/refresh-token").post(refreshAccessToken)

export default router;
