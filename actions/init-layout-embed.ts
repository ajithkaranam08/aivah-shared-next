"use server";

import { QueryClient, dehydrate } from "@tanstack/react-query";

import { avatarQueryOptions } from "@/services/avatar/server-query";
import { knowledgeBaseQueryOptions } from "@/services/conversation/server-query";
import { validateQueryOptions } from "@/services/validate/server-query";

export const initLayoutEmbed = async (
  embedId: string,
  options?: { validationQuery: { enableScene: number } }
) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    validateQueryOptions(embedId, options?.validationQuery)
  );

  const validateData = queryClient.getQueryData(
    validateQueryOptions(embedId, options?.validationQuery).queryKey
  );
  if (!validateData) {
    return dehydrate(queryClient);
  }

  if (validateData?.details.avatarId) {
    await queryClient.prefetchQuery(
      avatarQueryOptions(
        validateData.details.avatarId,
        validateData.details.token
      )
    );
  }

  if (validateData?.details.uuid) {
    await queryClient.prefetchQuery(
      knowledgeBaseQueryOptions(
        validateData?.details.uuid,
        validateData?.details.token
      )
    );
  }
  const dehydratedState = dehydrate(queryClient);
  return dehydratedState;
};
