"use client";

import { useServiceWorker } from "../utils/registerSW";

export default function ServiceWorkerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useServiceWorker();
  return <>{children}</>;
}
