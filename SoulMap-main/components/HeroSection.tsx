export function HeroSection() {
  return (
    <div className="relative w-full border-b border-border/50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(38_65%_60%/0.08),transparent_50%)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center px-4 py-24 md:py-32">
        <div className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-2 mb-8 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(38_65%_60%)]" />
          <span className="text-xs font-semibold text-primary/90 tracking-wider uppercase">
            AI-Powered Visual Timeline
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight gradient-text">
          Welcome to SoulMap
        </h1>

        <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto mb-6 leading-relaxed font-light">
          Visualize the moments that shape your soul
        </p>

        <p className="text-sm text-muted-foreground/60 max-w-xl mx-auto">
          Powered by DALL-E 3 to create high-quality visual representations of your life's moments
        </p>

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>
    </div>
  );
}
