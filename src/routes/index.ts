import express, { Router } from "express";
import {
  createAccount,
  fundAccount,
  getAccount,
  login,
  signup,
  withdrawFromAccount,
} from "../controllers";
import {
  fundAccountSchemas,
  loginSchemas,
  signUpSchemas,
  withdrawFromAccountSchemas,
} from "../validationSchemas";

import { wrapController } from "../helpers";
import { ensureAuthenticated } from "../middleware/ensureAunthenticated";

const router: Router = express.Router();

router.post("/signup", wrapController(signup, signUpSchemas));
router.post("/login", wrapController(login, loginSchemas));

router.use("/", ensureAuthenticated);

router
  .route("/wallet")
  .post(wrapController(createAccount))
  .get(wrapController(getAccount));

router.post("/wallet/fund", wrapController(fundAccount, fundAccountSchemas));
router.post("/wallet/transfer", wrapController(login, loginSchemas));
router.post(
  "/wallet/withdraw",
  wrapController(withdrawFromAccount, withdrawFromAccountSchemas)
);

router.get("/transactions", wrapController(login, loginSchemas));

export default router;
