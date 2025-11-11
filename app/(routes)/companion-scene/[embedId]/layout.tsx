import React from "react";

import {
  HydrationBoundary,
} from "@tanstack/react-query";

import { initLayoutEmbed } from "@/actions/init-layout-embed";

type Props = {
  children: React.ReactNode;
  params: Promise<{ embedId: string }>;
};

const Companionlayout = async ({ children, params }: Props) => {
  const { embedId } = await params;
  const dehydratedState = await initLayoutEmbed(embedId, { validationQuery: { enableScene: 1 } });

  return (
    <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
  );
};

export default Companionlayout;
