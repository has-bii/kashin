import { authMacro } from "../../macros/auth.macro"
import { BankAccountService } from "./service"
import { getAllQuery, deleteQuery, createBody } from "./dto"
import Elysia from "elysia"

export const bankAccountController = new Elysia({ prefix: "/bank-account" })
  .use(authMacro)
  .get("/", async ({ user, query }) => BankAccountService.getAll(user.id, query), { auth: true, query: getAllQuery })
  .post("/", async ({ user, body }) => BankAccountService.create(user.id, body), { auth: true, body: createBody })
  .get("/:id", async ({ user, params }) => BankAccountService.getById(user.id, params.id), { auth: true })
  .delete("/:id", async ({ user, params, query }) => BankAccountService.delete(user.id, params.id, query.deleteTransactions ?? false), { auth: true, query: deleteQuery })
