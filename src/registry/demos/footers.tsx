"use client";

// Generated from Design Studio's gallery previews (default props).
import { BlockPreview } from "@/registry/demos/block-preview";
import { FooterAscii } from "@/registry/footers/footer-ascii";
import { FooterDots } from "@/registry/footers/footer-dots";
import { FooterEqualizer } from "@/registry/footers/footer-equalizer";
import { FooterFizz } from "@/registry/footers/footer-fizz";
import { FooterStickers } from "@/registry/footers/footer-stickers";
import { FooterGradient } from "@/registry/footers/footer-gradient";
import { BottomBar, Brand, FooterColumns, FooterRoot, FooterStage } from "@/registry/footers/footer-kit";
import { FooterMotion } from "@/registry/footers/footer-motion";
import { FooterNewsletter } from "@/registry/footers/footer-newsletter";
import { FooterOutline } from "@/registry/footers/footer-outline";
import { FooterScenery } from "@/registry/footers/footer-scenery";
import { FooterTerminal } from "@/registry/footers/footer-terminal";

export function FooterAsciiDemo() {
  const props = { brand: "lumen", tagline: "Quiet tools for loud ideas.", variant: "wordmark", accent: "#f97316", density: 11, animate: true } as const
  return (
    <BlockPreview height={720}>
      <FooterStage>
        <FooterAscii {...props} />
      </FooterStage>
    </BlockPreview>
  )
}

export function FooterDotsDemo() {
  const props = { brand: "lumen", tagline: "Infrastructure that stays out of your way.", mode: "repel", accent: "#6366f1", density: 14, intensity: 130, animate: true } as const
  return (
    <BlockPreview height={720}>
      <FooterStage>
        <FooterDots {...props} />
      </FooterStage>
    </BlockPreview>
  )
}

export function FooterMotionDemo() {
  const props = { brand: "lumen", tagline: "Calm software, shipped on a steady tide.", variant: "waves", accent: "#0ea5e9", intensity: 1, speed: 1, animate: true } as const
  return (
    <BlockPreview height={720}>
      <FooterStage>
        <FooterMotion {...props} />
      </FooterStage>
    </BlockPreview>
  )
}

export function FooterSceneryDemo() {
  const props = { brand: "lumen", signOff: "Made outdoors, shipped indoors.", variant: "hills", time: "auto", accent: "#f59e0b", animate: true } as const
  return (
    <BlockPreview height={720}>
      <FooterStage>
        <FooterScenery {...props} />
      </FooterStage>
    </BlockPreview>
  )
}

export function FooterGradientDemo() {
  const props = { brand: "lumen", tagline: "Light work for heavy problems.", palette: "aurora", accent: "#8b5cf6", intensity: 0.8, grain: true, animate: true } as const
  return (
    <BlockPreview height={720}>
      <FooterStage>
        <FooterGradient {...props} />
      </FooterStage>
    </BlockPreview>
  )
}

export function FooterOutlineDemo() {
  const props = { brand: "lumen", variant: "letters", accent: "#ef4444", stroke: 1.5, showStatus: true, animate: true } as const
  return (
    <BlockPreview height={720}>
      <FooterStage>
        <FooterOutline {...props} />
      </FooterStage>
    </BlockPreview>
  )
}

export function FooterTerminalDemo() {
  const props = { brand: "lumen", variant: "window", accent: "#22c55e", prompt: "~", animate: true } as const
  return (
    <BlockPreview height={720}>
      <FooterStage>
        <FooterTerminal {...props} />
      </FooterStage>
    </BlockPreview>
  )
}

export function FooterNewsletterDemo() {
  const props = { brand: "lumen", headline: "One useful email a month. No fluff.", layout: "split", accent: "#e8590c", noise: 0.5, showBadges: true, showCard: true } as const
  return (
    <BlockPreview height={720}>
      <FooterStage>
        <FooterNewsletter {...props} />
      </FooterStage>
    </BlockPreview>
  )
}

export function FooterKitDemo() {
  const props = { brand: "lumen", accent: "#0f766e", arrows: true } as const
  return (
    <BlockPreview height={520}>
      <FooterStage>
        <FooterRoot accent={String(props.accent)}>
          <div className="mx-auto grid max-w-6xl gap-10 px-6 pt-16 md:grid-cols-[1fr_2fr] md:px-10">
            <Brand brand={String(props.brand)} />
            <FooterColumns arrows={Boolean(props.arrows)} />
          </div>
          <div className="mx-auto max-w-6xl px-6 py-6 md:px-10">
            <BottomBar brand={String(props.brand)} className="mt-12 border-t border-(--ft-line) pt-5" />
          </div>
        </FooterRoot>
      </FooterStage>
    </BlockPreview>
  )
}

export function FooterFizzDemo() {
  const props = { brand: "lumen", tagline: "Refreshingly simple tools.", accent: "#f43f5e", count: 70, animate: true } as const
  return (
    <BlockPreview height={720}>
      <FooterStage>
        <FooterFizz {...props} />
      </FooterStage>
    </BlockPreview>
  )
}

export function FooterStickersDemo() {
  const props = { brand: "lumen", tagline: "Stick around. It gets better.", animate: true } as const
  return (
    <BlockPreview height={720}>
      <FooterStage>
        <FooterStickers {...props} />
      </FooterStage>
    </BlockPreview>
  )
}

export function FooterEqualizerDemo() {
  const props = { brand: "lumen", tagline: "Ship to the rhythm.", accent: "#8b5cf6", bars: 48, animate: true } as const
  return (
    <BlockPreview height={720}>
      <FooterStage>
        <FooterEqualizer {...props} />
      </FooterStage>
    </BlockPreview>
  )
}
