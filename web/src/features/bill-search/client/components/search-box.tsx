"use client";

import { Search } from "lucide-react";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { routes } from "@/lib/routes";
import { SUGGESTED_KEYWORDS } from "../../shared/constants";

export function SearchBox() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") ?? "";

  function navigate(q: string) {
    const trimmed = q.trim();
    // キーワード変更時も選択中の絞り込み条件は維持する
    router.push(
      routes.search(trimmed || undefined, {
        session: searchParams.get("session") ?? undefined,
        tag: searchParams.get("tag") ?? undefined,
        status: searchParams.get("status") ?? undefined,
      }) as Route
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = new FormData(e.currentTarget).get("q");
    navigate(typeof value === "string" ? value : "");
  }

  return (
    <div className="flex flex-col gap-3">
      <form key={query} onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-mirai-text-muted" />
        <Input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="キーワードを入力..."
          aria-label="議案を検索"
          className="pl-9 h-11 text-base bg-white"
        />
      </form>
      {!query && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_KEYWORDS.map((kw) => (
            <Button
              key={kw}
              type="button"
              variant="outline"
              onClick={() => navigate(kw)}
              className="h-auto px-3 py-1 text-xs font-normal rounded-full text-mirai-text-secondary"
            >
              {kw}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
