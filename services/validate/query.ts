import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import validateApi from "./api";

export const validateKeys = {
  all: ["validate"] as const,
  validateuuid: (id: string, params?: object) => ["uuid", id, params] as const,
};

export const validateQueryOptions = (
  id: string,
  params?: { enableScene: number }
) =>
  queryOptions({
    queryKey: validateKeys.validateuuid(id, params),
    queryFn: () => validateApi.uuid(id, params, { revalidate: false }),
  });

export const useValidateUUID = (
  id: string,
  params?: { enableScene: number }
) => {
  return useSuspenseQuery(validateQueryOptions(id, params));
};
