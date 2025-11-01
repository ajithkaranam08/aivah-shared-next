import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import validateApi from './api'

export const validateKeys = {
    all: ['validate'] as const,
    validateuuid: (id: string) => ['uuid', id] as const,
}

export const validateQueryOptions = (id: string) =>
    queryOptions({
        queryKey: validateKeys.validateuuid(id),
        queryFn: () => validateApi.uuid(id, { revalidate: false }),
    })

export const useValidateUUID = (id: string) => {
    return useSuspenseQuery(validateQueryOptions(id));
}