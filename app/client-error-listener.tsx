"use client";

import { useEffect } from "react";
import { createClientLogger } from "@/app/client-logger";

const logger = createClientLogger({ module: "app.client-error-listener" });

export function ClientErrorListener() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      logger.error(
        {
          err: event.error ?? {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
        },
        "Unhandled client error"
      );
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logger.error(
        {
          err: event.reason,
        },
        "Unhandled client promise rejection"
      );
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}
