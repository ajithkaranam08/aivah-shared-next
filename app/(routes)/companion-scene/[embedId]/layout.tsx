import React from "react";

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

import { validateQueryOptions } from "@/services/validate/query";

type Props = {
  children: React.ReactNode;
  params: Promise<{ embedId: string }>;
};

const Companionlayout = async ({ children, params }: Props) => {
  const { embedId } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    validateQueryOptions(embedId, { enableScene: 1 })
  );
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
  );
};

export default Companionlayout;
