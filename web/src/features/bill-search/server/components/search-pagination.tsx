import "server-only";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { routes } from "@/lib/routes";
import type { SearchFilterParams } from "../../shared/types";
import { buildPageItems } from "../../shared/utils/pagination";

interface SearchPaginationProps {
  page: number;
  pageCount: number;
  query: string;
  filters: SearchFilterParams;
}

/** 検索結果のページ送りナビ（URLベース・サーバーコンポーネント） */
export function SearchPagination({
  page,
  pageCount,
  query,
  filters,
}: SearchPaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  const hrefFor = (p: number) =>
    routes.search(query || undefined, { ...filters, page: p }) as Route;

  const linkClass =
    "flex items-center justify-center min-w-9 h-9 px-2 rounded-md text-sm text-mirai-text-secondary hover:bg-mirai-surface transition-colors";
  const currentClass =
    "flex items-center justify-center min-w-9 h-9 px-2 rounded-md text-sm bg-primary text-primary-foreground font-medium";

  return (
    <nav
      className="flex items-center justify-center gap-1 pt-4"
      aria-label="検索結果のページ送り"
    >
      {page > 1 && (
        <Link
          href={hrefFor(page - 1)}
          className={linkClass}
          aria-label="前のページ"
        >
          <ChevronLeft className="size-4" />
        </Link>
      )}
      {buildPageItems(page, pageCount).map((item, index) =>
        item === "ellipsis" ? (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: 省略記号は位置以外に識別子を持たない
            key={`ellipsis-${index}`}
            className="px-1 text-mirai-text-muted"
            aria-hidden="true"
          >
            …
          </span>
        ) : item === page ? (
          <span key={item} className={currentClass} aria-current="page">
            {item}
          </span>
        ) : (
          <Link key={item} href={hrefFor(item)} className={linkClass}>
            {item}
          </Link>
        )
      )}
      {page < pageCount && (
        <Link
          href={hrefFor(page + 1)}
          className={linkClass}
          aria-label="次のページ"
        >
          <ChevronRight className="size-4" />
        </Link>
      )}
    </nav>
  );
}
