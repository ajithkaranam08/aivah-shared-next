import React from "react";

import Container from "@/components/ui/container";

const Mainlayout = ({ children }: { children: React.ReactNode }) => {
  return <Container className="h-full p-2 lg:p-20">{children}</Container>;
};

export default Mainlayout;
