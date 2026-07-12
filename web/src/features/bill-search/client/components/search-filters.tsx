"use client";

import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { routes } from "@/lib/routes";
import type { SearchFilterOptions } from "../../shared/types";
import { STATUS_FILTER_OPTIONS } from "../../shared/utils/status-filter";

// Radix Select は空文字の value を許可しないため「指定なし」はこの値で表す
const ALL = "all";

interface SearchFiltersProps {
  options: SearchFilterOptions;
}

export function SearchFilters({ options }: SearchFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const current = {
    q: searchParams.get("q") ?? "",
    session: searchParams.get("session") ?? ALL,
    tag: searchParams.get("tag") ?? ALL,
    status: searchParams.get("status") ?? ALL,
    interview: searchParams.get("interview") === "1",
  };
  const hasActiveFilter =
    current.session !== ALL ||
    current.tag !== ALL ||
    current.status !== ALL ||
    current.interview;

  function applyFilter(
    key: "session" | "tag" | "status" | "interview",
    value: string | boolean
  ) {
    const next = { ...current, [key]: value };
    router.push(
      routes.search(next.q || undefined, {
        session: next.session === ALL ? undefined : next.session,
        tag: next.tag === ALL ? undefined : next.tag,
        status: next.status === ALL ? undefined : next.status,
        interview: next.interview ? "1" : undefined,
      }) as Route
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={current.session}
        onValueChange={(v) => applyFilter("session", v)}
      >
        <SelectTrigger
          className="w-auto min-w-36 bg-white"
          aria-label="国会会期で絞り込み"
        >
          <SelectValue placeholder="国会会期" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>すべての会期</SelectItem>
          {options.sessions.map((session) => (
            <SelectItem key={session.id} value={session.id}>
              {session.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={current.tag} onValueChange={(v) => applyFilter("tag", v)}>
        <SelectTrigger
          className="w-auto min-w-32 bg-white"
          aria-label="カテゴリで絞り込み"
        >
          <SelectValue placeholder="カテゴリ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>すべてのカテゴリ</SelectItem>
          {options.tags.map((tag) => (
            <SelectItem key={tag.id} value={tag.id}>
              {tag.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={current.status}
        onValueChange={(v) => applyFilter("status", v)}
      >
        <SelectTrigger
          className="w-auto min-w-28 bg-white"
          aria-label="ステータスで絞り込み"
        >
          <SelectValue placeholder="ステータス" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>すべての状態</SelectItem>
          {Object.entries(STATUS_FILTER_OPTIONS).map(([value, option]) => (
            <SelectItem key={value} value={value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        type="button"
        variant="outline"
        aria-pressed={current.interview}
        onClick={() => applyFilter("interview", !current.interview)}
        className={
          current.interview
            ? "h-9 px-3 text-xs rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            : "h-9 px-3 text-xs rounded-full text-mirai-text-secondary"
        }
      >
        AIインタビュー受付中
      </Button>

      {hasActiveFilter && (
        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            router.push(routes.search(current.q || undefined) as Route)
          }
          className="h-auto px-2 py-1 text-xs text-mirai-text-secondary"
        >
          絞り込みを解除
        </Button>
      )}
    </div>
  );
}
