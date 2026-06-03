import Link from "next/link";

export default function JimuJigyoNotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
      <p className="text-4xl font-bold text-mirai-text-muted">404</p>
      <h1 className="text-xl font-bold text-mirai-text">
        事業が見つかりませんでした
      </h1>
      <p className="text-sm text-mirai-text-secondary">
        URLが正しくないか、データが存在しない可能性があります。
      </p>
      <Link
        href="/jimu-jigyo"
        className="inline-block mt-4 text-sm text-grade-b underline"
      >
        ← 事務事業評価トップに戻る
      </Link>
    </div>
  );
}
