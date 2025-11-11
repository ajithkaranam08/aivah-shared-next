import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { conversationKeys } from "@/helper/query-keys";

import conversationAPi from "./api";

export const knowledgeBaseQueryOptions = (
  sessionUUID: string,
  token: string | null
) => {
  return queryOptions({
    queryKey: conversationKeys.knowledgeBase(sessionUUID),
    queryFn: () =>
      conversationAPi.knowledgeBase({
        headers: { Authorization: `Bearer ${token}` },
      }),
    enabled: !!token,
  });
};

export const useKnowledgeBase = (sessionUUID: string, token: string | null) => {
  return useSuspenseQuery(knowledgeBaseQueryOptions(sessionUUID, token));
};
