'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { TriangleAlert } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <section
      className="relative min-h-dvh flex items-center justify-center overflow-hidden px-6"
      aria-live="polite"
    >

      {/* Subtle radial glow background */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-1/3 left-1/2 -translate-x-1/2 size-[80vmax] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(closest-side, color-mix(in oklch, var(--destructive) 18%, transparent), transparent 70%)' }} />
        <div className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 size-[75vmax] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(closest-side, color-mix(in oklch, var(--chart-3) 18%, transparent), transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-2xl text-center"
      >
        {/* Orbital indicator */}
        <div className="relative mx-auto mb-8 flex size-40 items-center justify-center">
          {/* Outer orbit */}
          <motion.div
            className="absolute inset-0 rounded-full border border-rose-500/25"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
          >
            <span className="absolute left-1/2 top-0 -translate-x-1/2 size-2 rounded-full bg-rose-500" />
          </motion.div>
          {/* Inner orbit */}
          <motion.div
            className="absolute inset-5 rounded-full border border-sky-400/25"
            animate={{ rotate: -360 }}
            transition={{ duration: 14, ease: 'linear', repeat: Infinity }}
          >
            <span className="absolute left-0 top-1/2 -translate-y-1/2 size-2 rounded-full bg-sky-400" />
          </motion.div>

          {/* Warning icon */}
          <div className="relative z-10 size-16 rounded-2xl bg-background/70 shadow-xs ring-1 ring-border/60 backdrop-blur flex items-center justify-center text-rose-600 dark:text-rose-400">
            <motion.span
              aria-hidden
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <TriangleAlert className="size-8" />
            </motion.span>
          </div>
        </div>

        {/* Glitchy headline */}
        <div className="relative inline-block">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Something went wrong
          </h1>
          <motion.span
            className="pointer-events-none absolute inset-0 -z-10 select-none text-3xl font-semibold tracking-tight md:text-4xl text-rose-500/30"
            aria-hidden
            animate={{ x: [0, 2, -2, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            Something went wrong
          </motion.span>
        </div>

        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          An unexpected error occurred. Try again or head back home.
        </p>

        {error?.message && (
          <p className="mt-3 text-xs text-muted-foreground/80 wrap-break-word">
            {error.message}
          </p>
        )}
        {error?.digest && (
          <p className="mt-1 text-[11px] text-muted-foreground/70">
            Error ID: <code className="font-mono">{error.digest}</code>
          </p>
        )}

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={() => reset()} className="px-5">
              Try again
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" asChild className="px-5">
              <Link href="/">Go home</Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
