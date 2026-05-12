import { auth } from "@optim/auth";
import { toNextJsHandler } from "better-auth/next-js";
// import { NextRequest } from "next/server";

const handlers = toNextJsHandler(auth);

export const { GET, POST } = toNextJsHandler(auth);
