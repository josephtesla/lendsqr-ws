import express, { Router } from "express";
import { login, signup } from "../controllers";
import { loginSchemas, signUpSchemas } from "../validationSchemas";

import { wrapController } from "../helpers";
import { ensureAuthenticated } from "../middleware/ensureAunthenticated";

const router: Router = express.Router();

router.post("/signup", wrapController(signup, signUpSchemas));
router.post("/login", wrapController(login, loginSchemas));

router.use("/", ensureAuthenticated);

export default router;
