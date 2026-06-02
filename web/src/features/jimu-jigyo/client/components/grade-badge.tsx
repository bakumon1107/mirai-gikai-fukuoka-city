"use client";

import type { Grade } from "../../shared/types/jimu-jigyo";

type Props = {
  grade: Grade;
  score?: number;
  size?: "sm" | "md" | "lg";
};

const gradeStyles: Record<Grade, { bg: string; text: string; border: string }> =
  {
    A: { bg: "bg-grade-a-bg", text: "text-grade-a", border: "border-grade-a" },
    B: { bg: "bg-grade-b-bg", text: "text-grade-b", border: "border-grade-b" },
    C: { bg: "bg-grade-c-bg", text: "text-grade-c", border: "border-grade-c" },
    D: { bg: "bg-grade-d-bg", text: "text-grade-d", border: "border-grade-d" },
  };

const sizeStyles = {
  sm: "w-8 h-8 text-sm",
  md: "w-12 h-12 text-base",
  lg: "w-16 h-16 text-xl",
};

export function GradeBadge({ grade, score, size = "md" }: Props) {
  const styles = gradeStyles[grade];
  return (
    <div
      className={`
        ${sizeStyles[size]} ${styles.bg} ${styles.text} ${styles.border}
        rounded-full border-2 flex flex-col items-center justify-center font-bold shrink-0
      `}
    >
      <span>{grade}</span>
      {score !== undefined && size === "lg" && (
        <span className="text-xs font-normal">{score}点</span>
      )}
    </div>
  );
}

export function gradeBorderColor(grade: Grade): string {
  return {
    A: "border-grade-a",
    B: "border-grade-b",
    C: "border-grade-c",
    D: "border-grade-d",
  }[grade];
}
