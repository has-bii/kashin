import { BankService } from "./service"
import Elysia from "elysia"

export const bankController = new Elysia({ prefix: "/bank" })
  .get("/", () => BankService.getAll())
