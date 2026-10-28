import type { Debate, DebateStatement } from "../types";

/**
 * 候補者IDを持つ要素を、ページ全体の並び（表明順・届出順）にそろえる。
 *
 * 討論会での発言順は問いごとに違い、順番そのものに意味を読まれやすい。
 * 特設ページのほかの場所と同じ並びに固定する。同じ人の発言が複数あるときは
 * 元の順（発言順）を保つ。並びにない ID は末尾に回す。
 */
export function sortByCandidateOrder<T extends { candidateId: string }>(
  items: readonly T[],
  candidateOrder: readonly string[]
): T[] {
  const rank = (id: string) => {
    const index = candidateOrder.indexOf(id);
    return index === -1 ? candidateOrder.length : index;
  };
  return items
    .map((item, index) => ({ item, index }))
    .sort(
      (a, b) =>
        rank(a.item.candidateId) - rank(b.item.candidateId) || a.index - b.index
    )
    .map(({ item }) => item);
}

/** ?candidate= の値を、出演者の ID のときだけ受け付ける */
export function parseDebateCandidate(
  value: string | undefined,
  participantIds: readonly string[]
): string | null {
  if (!value) {
    return null;
  }
  return participantIds.includes(value) ? value : null;
}

export type DebateStatementRole = "問題提起" | "回答" | "まとめ" | "追加の問い";

export type CandidateDebateStatement = {
  /** 討論会のどのコーナーか（「高島市政の評価」「問い03 家賃の高騰」など） */
  section: string;
  role: DebateStatementRole | "フリップ" | "メッセージ";
  statement: DebateStatement;
};

/**
 * ひとりの候補者の発言を、討論会での順に集める。
 * 候補者ページからの導線で「この人が何を話したか」を通しで読むために使う。
 */
export function collectCandidateStatements(
  debate: Debate,
  candidateId: string
): CandidateDebateStatement[] {
  const result: CandidateDebateStatement[] = [];
  const pick = (
    section: string,
    role: CandidateDebateStatement["role"],
    statements: readonly DebateStatement[]
  ) => {
    for (const statement of statements) {
      if (statement.candidateId === candidateId) {
        result.push({ section, role, statement });
      }
    }
  };

  const takashima = debate.takashima.answers.find(
    (answer) => answer.candidateId === candidateId
  );
  if (takashima) {
    result.push({
      section: "高島市政の評価",
      role: "フリップ",
      statement: {
        candidateId,
        time: takashima.time,
        text: `継続する点：${takashima.keep}／変更する点：${takashima.change}`,
      },
    });
    if (takashima.followUp) {
      result.push({
        section: "高島市政の評価",
        role: "回答",
        statement: { candidateId, ...takashima.followUp },
      });
    }
  }

  for (const question of debate.questions) {
    const section = `問い${question.no} ${question.title}`;
    pick(section, "問題提起", question.proposals);
    pick(section, "回答", question.answers);
    pick(section, "まとめ", question.closings);
    for (const followUp of question.followUps) {
      pick(`${section}（${followUp.title}）`, "追加の問い", followUp.answers);
    }
  }

  pick("メッセージ", "メッセージ", debate.messages.answers);
  return result;
}

/** 討論会のデータに含まれる候補者IDをすべて集める（データの検証用） */
export function collectDebateCandidateIds(debate: Debate): string[] {
  const ids = new Set<string>(debate.participantIds);
  const add = (statements: readonly DebateStatement[]) => {
    for (const statement of statements) {
      ids.add(statement.candidateId);
    }
  };
  for (const answer of debate.takashima.answers) {
    ids.add(answer.candidateId);
  }
  for (const question of debate.questions) {
    for (const id of question.proposerIds) {
      ids.add(id);
    }
    add(question.proposals);
    add(question.answers);
    add(question.closings);
    for (const followUp of question.followUps) {
      add(followUp.answers);
    }
  }
  add(debate.messages.answers);
  return [...ids];
}

/** 討論会のデータに含まれる再生位置をすべて集める（データの検証用） */
export function collectDebateTimes(debate: Debate): string[] {
  const times: string[] = [debate.takashima.time, debate.messages.time];
  if (debate.moderatorPolicy) {
    times.push(debate.moderatorPolicy.time);
  }
  for (const segment of debate.segments) {
    times.push(segment.time);
  }
  for (const answer of debate.takashima.answers) {
    times.push(answer.time);
    if (answer.followUp) {
      times.push(answer.followUp.time);
    }
  }
  const add = (statements: readonly DebateStatement[]) => {
    for (const statement of statements) {
      times.push(statement.time);
    }
  };
  for (const question of debate.questions) {
    times.push(question.time);
    add(question.proposals);
    add(question.answers);
    add(question.closings);
    for (const followUp of question.followUps) {
      times.push(followUp.time);
      add(followUp.answers);
    }
  }
  add(debate.messages.answers);
  return times;
}
