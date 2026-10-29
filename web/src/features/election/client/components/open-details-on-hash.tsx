"use client";

import { useEffect } from "react";

/**
 * URL の #id が閉じた <details> を指していたら開く。
 * ほかのページから討論会ページの「問い」へ直接飛んできたとき、見出しだけでなく回答まで見えるようにする。
 */
export function OpenDetailsOnHash() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) {
        return;
      }
      const element = document.getElementById(id);
      if (element instanceof HTMLDetailsElement && !element.open) {
        element.open = true;
        element.scrollIntoView({ block: "start" });
      }
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);

  return null;
}
