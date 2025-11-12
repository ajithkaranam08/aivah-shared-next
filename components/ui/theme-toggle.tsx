"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button, buttonVariants } from "@/components/ui/button";
import useMount from "@/hooks/use-mount";
import { VariantProps } from "class-variance-authority";

type ModeToggleBtnProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

export function ModeToggleBtn(props: ModeToggleBtnProps) {
  const isMounted = useMount();
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      {...props}
    >
      {isMounted && theme === "dark" ? (
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      )}
    </Button>
  );
}
