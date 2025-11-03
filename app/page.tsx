'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import Container from '@/components/ui/container'
import { Bot, Zap, ShieldCheck, MessageSquare, Headphones, Globe } from 'lucide-react'

export default function Home() {
  return (
    <main className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background accents */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-1/3 left-1/2 size-[90vmax] -translate-x-1/2 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(closest-side, color-mix(in oklch, var(--chart-2) 16%, transparent), transparent 70%)' }} />
          <div className="absolute -bottom-1/2 left-1/3 size-[70vmax] -translate-x-1/2 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(closest-side, color-mix(in oklch, var(--chart-4) 16%, transparent), transparent 70%)' }} />
        </div>

        <Container className="relative flex min-h-[78svh] flex-col items-center justify-center py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground backdrop-blur bg-background/70"
            >
              <Zap className="size-3.5 text-yellow-500" /> Real‑time AI companions
            </motion.span>

            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight md:text-6xl">
              Build delightful AI experiences that talk, see, and understand
            </h1>
            <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
              Create multimodal companions with voice, vision, and memory. Deploy anywhere, integrate easily, and scale with confidence.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild className="px-6">
                  <Link href="https://app.aivah.ai/">Get started</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" asChild className="px-6">
                  <Link href="#learn-more">Learn more</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Floating orbs */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute right-16 top-28 hidden size-20 rounded-full bg-foreground/5 blur-md md:block"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-20 bottom-24 hidden size-24 rounded-full bg-foreground/5 blur-md md:block"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
        </Container>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24 container mx-auto md:px-24 px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Everything you need to ship fast</h2>
          <p className="mt-3 text-muted-foreground">Modern building blocks for real‑time, multimodal AI experiences.</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group rounded-xl border bg-card p-5 shadow-sm ring-1 ring-border/50 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 flex size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-medium">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="learn-more" className="relative overflow-hidden py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
          <div className="absolute left-1/2 top-1/2 size-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(closest-side, color-mix(in oklch, var(--primary) 18%, transparent), transparent 70%)' }} />
        </div>
        <Container className="text-center">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold md:text-3xl"
          >
            Ready to build your companion?
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-3 max-w-xl text-muted-foreground"
          >
            Start from a clean foundation with real‑time socket integration, typed APIs, and modern UI primitives.
          </motion.p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button asChild className="px-6">
                <Link href="https://app.aivah.ai/">Get started</Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" asChild className="px-6">
                <Link href="/">Back to top</Link>
              </Button>
            </motion.div>
          </div>
        </Container>
      </section>
    </main>
  )
}

const features = [
  {
    title: 'Multimodal by default',
    desc: 'Voice, text, and vision support with smooth fallbacks.',
    icon: <Bot className="size-4" />,
  },
  {
    title: 'Real‑time streaming',
    desc: 'Low‑latency socket layer for lifelike interactions.',
    icon: <MessageSquare className="size-4" />,
  },
  {
    title: 'Global reach',
    desc: 'Deploy anywhere and connect from any device.',
    icon: <Globe className="size-4" />,
  },
  {
    title: 'Production‑grade security',
    desc: 'Built with safe defaults and hardened primitives.',
    icon: <ShieldCheck className="size-4" />,
  },
  {
    title: 'Natural voice I/O',
    desc: 'Hands‑free experiences with microphone & audio output.',
    icon: <Headphones className="size-4" />,
  },
  {
    title: 'Fast by design',
    desc: 'Optimized rendering and caching for snappy UX.',
    icon: <Zap className="size-4" />,
  },
]
