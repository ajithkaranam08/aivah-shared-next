import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { avatarKeys } from "@/helper/query-keys";

import avatarAPi from "./api";

export const avatarQueryOptions = (id: number, token: string | null) =>
  queryOptions({
    queryKey: avatarKeys.getById(id, token),
    queryFn: () =>
      avatarAPi.getById(id, { headers: { Authorization: `Bearer ${token}` } }),
    enabled: !!token,
  });

export const useAvatarById = (id: number, token: string | null) => {
  return useSuspenseQuery(avatarQueryOptions(id, token));
};
