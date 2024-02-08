import express from "express";
import verifyToken from "../../middleware/authMiddleware";

const apiRouter = express.Router();

apiRouter.post('/user', verifyToken,
    (req, res) => {

    return res.json({
        code: 200,
        data: {
            user: ("user" in req) ? req.user : null
        }
    });
})

export default apiRouter;