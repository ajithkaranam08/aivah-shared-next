import { DependencyList, useEffect, useRef, useState } from "react";

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement | null>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
  scrollThreshold?: number; // default = 200px
};

export const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
  scrollThreshold = 150,
}: ChatScrollProps) => {
  const [initialized, setInitialized] = useState(false);
  const [isBottom, setIsBottom] = useState(true);

  // Handle infinite scroll (load more when top reached)
  useEffect(() => {
    const container = chatRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }

      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - scrollThreshold
      ) {
        setIsBottom(true);
      } else {
        setIsBottom(false);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [chatRef, shouldLoadMore, loadMore, scrollThreshold]);

  // Auto-scroll when new messages appear
  useEffect(() => {
    const bottomDiv = bottomRef.current;
    const container = chatRef.current;
    const shouldAutoScroll = () => {
      if (!initialized && bottomDiv) {
        setInitialized(true);
        return true;
      }

      if (!container) {
        return false;
      }

      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;

      return distanceFromBottom <= scrollThreshold;
    };

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [count, chatRef, bottomRef, initialized, scrollThreshold]);

  return { isBottom };
};

/**
 * Automatically scrolls to bottom whenever dependencies (like messages) change.
 *
 * @param deps Array of dependencies that should trigger scroll (e.g. [messages])
 * @param options { smooth?: boolean } Whether to animate scroll smoothly
 * @returns scrollRef - Attach this ref to your scroll container
 */
export function useAutoScroll<T extends HTMLElement>(
  deps: DependencyList,
  options?: { smooth?: boolean }
) {
  const scrollRef = useRef<T | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const shouldSmooth = options?.smooth ?? true;

    // Scroll to the bottom
    el.scrollTo({
      top: el.scrollHeight,
      behavior: shouldSmooth ? "smooth" : "auto",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps); // run whenever deps change

  return scrollRef;
}
