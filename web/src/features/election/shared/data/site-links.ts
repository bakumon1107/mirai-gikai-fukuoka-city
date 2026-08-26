export type SiteLink = {
  label: string;
  description: string;
  href: string;
};

/**
 * 争点の背景を読むための、既存の議会データへの導線。
 * 一般質問は最新会期を動的に解決するため、slug を受け取る。
 */
export function buildSiteLinks(questionsSlug: string | null): SiteLink[] {
  const links: SiteLink[] = [
    {
      label: "委員会",
      description: "各委員会の質疑・答弁のまとめ",
      href: "/committees",
    },
  ];

  if (questionsSlug) {
    links.push({
      label: "一般質問",
      description: "議員が市長・局長に直接質問した内容",
      href: `/sessions/${questionsSlug}/questions`,
    });
  }

  links.push(
    {
      label: "議案",
      description: "定例会ごとに上程された議案の解説",
      href: "/sessions",
    },
    {
      label: "市長記者会見",
      description: "会見でのやりとりを回ごとに整理",
      href: "/press-conferences",
    },
    {
      label: "予算",
      description: "各局の重点施策と財政の状況",
      href: "/budget",
    },
    {
      label: "事務事業評価",
      description: "事業のKPI・予算・効率の推移",
      href: "/jimu-jigyo/r6",
    }
  );

  return links;
}
