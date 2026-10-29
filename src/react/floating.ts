import { useEffect, useState } from "react";

/** true после монтирования на клиенте: порталы в body нельзя рендерить на сервере. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
