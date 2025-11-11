import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { validateKeys } from "@/helper/query-keys";

import validateApi from "./api";

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
