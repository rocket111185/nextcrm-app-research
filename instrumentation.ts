import { registerOTel } from "@vercel/otel";
import type { Instrumentation } from "next";

const serviceName = process.env.OTEL_SERVICE_NAME || "nextcrm-app";

export function register() {
  registerOTel({
    serviceName,
  });

  if (process.env.NEXT_RUNTIME === "nodejs") {
    void import("@/lib/logger").then(({ logger }) => {
      logger.info({ serviceName }, "OpenTelemetry instrumentation registered");
    });
  }
}

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context
) => {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const { logger } = await import("@/lib/logger");

  logger.error(
    {
      err: error,
      request: {
        method: request.method,
        path: request.path,
      },
      route: {
        path: context.routePath,
        routerKind: context.routerKind,
        routeType: context.routeType,
        renderSource: context.renderSource,
        revalidateReason: context.revalidateReason,
      },
    },
    "Unhandled request error"
  );
};
