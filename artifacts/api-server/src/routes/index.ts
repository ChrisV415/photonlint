import { Router, type IRouter } from "express";
import healthRouter from "./health";
import foundriesRouter from "./foundries";
import drcRouter from "./drc";
import termsRouter from "./terms";
import authRouter from "./auth";
import apiKeysRouter from "./api-keys";

const router: IRouter = Router();

router.use(authRouter);
router.use(healthRouter);
router.use(foundriesRouter);
router.use(termsRouter);
router.use(apiKeysRouter);
router.use(drcRouter);

export default router;
