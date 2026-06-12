import "server-only";
import { cache } from "react";
import { findLatestSessionWithBudget } from "../repositories/budget-repository";

export const getLatestBudgetSession = cache(
  async (): Promise<{ id: string; slug: string | null } | null> => {
    return findLatestSessionWithBudget();
  }
);
