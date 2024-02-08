import jwt, {JwtPayload} from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config({ path: './.env' });

export default function verifyToken(req, res, next) {
    let token = req.header('Authorization');
    console.log({token});

    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        token = token.split(" ")[1];
        const decoded : JwtPayload | any = jwt.verify(token, `${process.env.JWT_SECRET}`);
        console.log({decoded});
        req.user = {
            id: decoded.id,
            email: decoded.email,
            name: "nameDNV"
        };
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

