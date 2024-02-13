import apiRouter from "./index";
import verifyToken from "../../middleware/authMiddleware";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

