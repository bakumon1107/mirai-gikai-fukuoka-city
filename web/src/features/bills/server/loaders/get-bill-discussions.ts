import "server-only";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { findDiscussionsByBillId } from "../repositories/bill-repository";

export type BillDiscussion = Awaited<
  ReturnType<typeof findDiscussionsByBillId>
>[number];

export const getBillDiscussions = unstable_cache(
  async (billId: string): Promise<BillDiscussion[]> => {
    return findDiscussionsByBillId(billId);
  },
  ["bill-discussions"],
  {
    revalidate: 600,
    tags: [CACHE_TAGS.BILLS],
  }
);
