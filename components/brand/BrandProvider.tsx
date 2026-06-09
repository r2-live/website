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
import {
  BAND_TRANSITION_MS,
  getTransitionDirection,
  type BrandTransitionDirection,
} from "@/lib/brand-transition";
import type { BrandSlug } from "@/lib/types";

interface BrandContextValue {
  activeBrand: BrandSlug;
  setActiveBrand: (brand: BrandSlug) => void;
  isSweeping: boolean;
  transitionDirection: BrandTransitionDirection;
  navVisible: boolean;
  setNavVisible: (visible: boolean) => void;
}

const BrandContext = createContext<BrandContextValue | null>(null);

function readBrandFromLocation(): BrandSlug | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("band");
  if (value === "r2-live" || value === "katg") return value;
  return null;
}

function resolveInitialBrand(initialBrand: BrandSlug) {
  return readBrandFromLocation() ?? initialBrand;
}

export function BrandProvider({
  children,
  initialBrand = "r2-live",
}: {
  children: ReactNode;
  initialBrand?: BrandSlug;
}) {
  const router = useRouter();
  const [activeBrand, setActiveBrandState] = useState<BrandSlug>(() =>
    resolveInitialBrand(initialBrand),
  );
  const [isSweeping, setIsSweeping] = useState(false);
  const [transitionDirection, setTransitionDirection] =
    useState<BrandTransitionDirection>(() =>
      getTransitionDirection(resolveInitialBrand(initialBrand)),
    );
  const [navVisible, setNavVisible] = useState(true);
  const previousBrandRef = useRef<BrandSlug>(
    resolveInitialBrand(initialBrand),
  );
  const activeBrandRef = useRef<BrandSlug>(resolveInitialBrand(initialBrand));

  useEffect(() => {
    if (previousBrandRef.current === activeBrand) return;

    previousBrandRef.current = activeBrand;

    const sweepTimer = window.setTimeout(
      () => setIsSweeping(false),
      BAND_TRANSITION_MS,
    );

    const url = new URL(window.location.href);
    url.searchParams.set("band", activeBrand);
    startTransition(() => {
      router.replace(`${url.pathname}${url.search}`, { scroll: false });
    });

    return () => window.clearTimeout(sweepTimer);
  }, [activeBrand, router]);

  const setActiveBrand = useCallback((brand: BrandSlug) => {
    if (activeBrandRef.current === brand) return;
    activeBrandRef.current = brand;
    setTransitionDirection(getTransitionDirection(brand));
    setIsSweeping(true);
    setActiveBrandState(brand);
  }, []);

  const value = useMemo(
    () => ({
      activeBrand,
      setActiveBrand,
      isSweeping,
      transitionDirection,
      navVisible,
      setNavVisible,
    }),
    [
      activeBrand,
      isSweeping,
      transitionDirection,
      navVisible,
      setActiveBrand,
    ],
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
