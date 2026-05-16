"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { PressConference } from "../../shared/types";
import { PressConferenceNoticeBanner } from "./press-conference-notice-banner";

type Props = {
  pressConferences: PressConference[];
};

export function PressConferenceArchiveSection({ pressConferences }: Props) {
  if (pressConferences.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      {/* Archive ヘッダー */}
      <div className="flex flex-col gap-1">
        <h2>
          <Image
            src="/icons/archive-typography.svg"
            alt="Archive"
            width={156}
            height={36}
            priority
          />
        </h2>
        <p className="text-sm font-bold text-primary-accent">市長記者会見</p>
      </div>

      {/* セクションタイトル（一覧リンク） */}
      <div className="flex flex-col gap-1.5">
        <Link href="/press-conferences" className="group">
          <h3 className="text-[22px] font-bold text-black leading-[1.48] flex items-center gap-1.5">
            市長定例記者会見一覧
            <span className="text-sm font-normal text-mirai-text-muted">
              {pressConferences.length}件
            </span>
            <ChevronRight className="h-6 w-6 text-gray-600 group-hover:translate-x-0.5 transition-transform" />
          </h3>
        </Link>
        <p className="text-xs font-medium text-mirai-text">
          高島市長が記者の皆さんと直接やりとりした内容をわかりやすくお届けします
        </p>
      </div>

      {/* 最新の記者会見カード */}
      <div className="flex flex-col gap-3">
        {pressConferences.slice(0, 3).map((pc) => (
          <PressConferenceNoticeBanner key={pc.id} pressConference={pc} />
        ))}
      </div>

      {/* 一覧へのリンク */}
      {pressConferences.length > 3 && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            asChild
            className="w-[214px] h-12 text-base font-bold border-mirai-text rounded-full hover:bg-gray-50 bg-white"
          >
            <Link href="/press-conferences">もっと読む</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
