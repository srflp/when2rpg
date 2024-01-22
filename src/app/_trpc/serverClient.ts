import { appRouter } from "@/server";
import { httpBatchLink } from "@trpc/client";
import { getApiUrl } from "./url";

export const serverClient = appRouter.createCaller({
  links: [
    httpBatchLink({
      url: getApiUrl(),
    }),
  ],
});
