import React from "react";

import { cn } from "@/lib/utils";

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <main className={cn(`container mx-auto`, className)}>{children}</main>;
};

export default Container;
