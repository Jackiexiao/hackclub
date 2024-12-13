import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { userRouter } from "./router/user";
import { profileRouter } from "./router/profile";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  user: userRouter,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
