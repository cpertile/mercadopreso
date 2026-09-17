import { useSyncExternalStore } from "react";
import { useShop } from "./store";

export function useShopHydrated() {
  return useSyncExternalStore(
    (onStoreChange) => useShop.persist.onFinishHydration(onStoreChange),
    () => useShop.persist.hasHydrated(),
    () => false,
  );
}
