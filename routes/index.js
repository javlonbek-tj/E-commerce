import { Router } from "express";
import brandRouter from "./brand.routes.js";
import typeRouter from "./type.routes.js";
import userRouter from "./user.routes.js";

const router = Router();

router.use("/brands", brandRouter);
router.use("/types", typeRouter);
router.use("/users", userRouter);

export default router;
