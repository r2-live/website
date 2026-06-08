"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { BrandSlug } from "@/lib/types";

interface BrandContextValue {
  activeBrand: BrandSlug;
  setActiveBrand: (brand: BrandSlug) => void;
  isSweeping: boolean;
  navVisible: boolean;
  setNavVisible: (visible: boolean) => void;
}

const BrandContext = createContext<BrandContextValue | null>(null);

function parseBrandFromSearch(search: string): BrandSlug | null {
  const value = new URLSearchParams(search).get("band");
  if (value === "r2-live" || value === "katg") return value;
  return null;
}

export function BrandProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [activeBrand, setActiveBrandState] = useState<BrandSlug>("r2-live");
  const [isSweeping, setIsSweeping] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const previousBrandRef = useRef<BrandSlug | null>(null);

  useEffect(() => {
    const initial =
      parseBrandFromSearch(window.location.search) ?? "r2-live";
    setActiveBrandState(initial);
    previousBrandRef.current = initial;
  }, []);

  useEffect(() => {
    if (previousBrandRef.current === null) return;
    if (previousBrandRef.current === activeBrand) return;

    previousBrandRef.current = activeBrand;

    setIsSweeping(true);
    const sweepTimer = window.setTimeout(() => setIsSweeping(false), 650);

    const url = new URL(window.location.href);
    url.searchParams.set("band", activeBrand);
    startTransition(() => {
      router.replace(`${url.pathname}${url.search}`, { scroll: false });
    });

    return () => window.clearTimeout(sweepTimer);
  }, [activeBrand, router]);

  const setActiveBrand = useCallback((brand: BrandSlug) => {
    setActiveBrandState((current) => (current === brand ? current : brand));
  }, []);

  const value = useMemo(
    () => ({
      activeBrand,
      setActiveBrand,
      isSweeping,
      navVisible,
      setNavVisible,
    }),
    [activeBrand, isSweeping, navVisible, setActiveBrand],
  );

  return (
    <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error("useBrand must be used within BrandProvider");
  }
  return context;
}
