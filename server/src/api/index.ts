import express from "express";
import verifyToken from "../middleware/authMiddleware";

const apiRouter = express.Router();

apiRouter.post('/user', verifyToken,
    (req, res) => {

    res.json({
        code: 200,
        data: {}
    });
})

export default apiRouter;