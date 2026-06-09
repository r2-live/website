"use client";

import { useEffect } from "react";

const MEMBER_CARD_R2_SCALE = 1.15;
const MEMBER_CARD_R2_MAX_REM = 15;

function syncMemberCardSizes() {
  const katgCard = document.querySelector<HTMLElement>(".members-grid--katg > *");
  const r2Grids = document.querySelectorAll<HTMLElement>(".members-grid--r2-live");

  if (!katgCard || r2Grids.length === 0) {
    r2Grids.forEach((grid) => {
      grid.style.removeProperty("--member-card-width-r2-effective");
    });
    return;
  }

  const katgWidth = katgCard.getBoundingClientRect().width;
  if (katgWidth <= 0) return;

  const rootFontSize =
    parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const r2Width = Math.min(
    Math.round(katgWidth * MEMBER_CARD_R2_SCALE),
    Math.round(MEMBER_CARD_R2_MAX_REM * rootFontSize),
  );
  const effectiveWidth = `${r2Width}px`;

  r2Grids.forEach((grid) => {
    grid.style.setProperty("--member-card-width-r2-effective", effectiveWidth);
  });
}

function syncSectionHeights() {
  const groups = new Map<string, HTMLElement[]>();

  document.querySelectorAll<HTMLElement>("[data-sync-section]").forEach((el) => {
    const key = el.dataset.syncSection;
    if (!key) return;
    const list = groups.get(key) ?? [];
    list.push(el);
    groups.set(key, list);
  });

  groups.forEach((elements) => {
    elements.forEach((el) => {
      el.style.minHeight = "";
    });

    const maxHeight = Math.max(
      ...elements.map((el) => el.getBoundingClientRect().height),
      0,
    );

    const minHeight = `${Math.ceil(maxHeight)}px`;
    elements.forEach((el) => {
      if (el.style.minHeight !== minHeight) {
        el.style.minHeight = minHeight;
      }
    });
  });
}

function syncBandSections() {
  syncMemberCardSizes();
  syncSectionHeights();
}

export function BandSectionHeightSync() {
  useEffect(() => {
    syncBandSections();
    document.fonts?.ready.then(syncBandSections).catch(() => undefined);

    const observer = new ResizeObserver(syncBandSections);
    document
      .querySelectorAll<HTMLElement>("[data-sync-section]")
      .forEach((el) => observer.observe(el));
    document
      .querySelectorAll<HTMLElement>(".members-grid--katg > *, .members-grid--r2-live > *")
      .forEach((el) => observer.observe(el));

    window.addEventListener("resize", syncBandSections);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncBandSections);
    };
  }, []);

  return null;
}
