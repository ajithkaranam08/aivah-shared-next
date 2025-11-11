import React from "react";

import {
  HydrationBoundary,
} from "@tanstack/react-query";

import Container from "@/components/ui/container";
import { initLayoutEmbed } from "@/actions/init-layout-embed";

type Props = {
  children: React.ReactNode;
  params: Promise<{ embedId: string }>;
};

const Companionlayout = async ({ children, params }: Props) => {
  const { embedId } = await params;
  const dehydratedState = await initLayoutEmbed(embedId);

  return (
    <Container className="h-full p-2 lg:p-20">
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
    </Container>
  );
};

export default Companionlayout;
