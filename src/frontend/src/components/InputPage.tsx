import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, Film, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const SAMPLE_TEXT =
  "The universe began with an unfathomable explosion of energy and light, 13.8 billion years ago. In that first fraction of a second, all the matter and forces we know today were born from a single, impossibly dense point. Gravity pulled hydrogen clouds together, igniting the first stars, which burned brilliantly before collapsing into black holes and supernovae. Those explosions scattered heavy elements — carbon, oxygen, iron — across the cosmos, seeding galaxies with the raw material of future worlds. Over billions of years, our solar system condensed from one such cloud of gas and dust, the Sun blazing to life at its center. Earth formed as a restless, volcanic world, slowly cooling, its oceans filling from cometary ice. Life emerged in those ancient seas, first as single cells, then blossoming into extraordinary complexity over eons. Continents drifted, ice ages came and went, and one small branch of mammals learned to walk upright, to speak, and to wonder at the stars above.";

interface InputPageProps {
  onGenerate: (text: string, title: string) => void;
}

export function InputPage({ onGenerate }: InputPageProps) {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");

  const handleGenerate = () => {
    const finalText = text.trim() || SAMPLE_TEXT;
    const finalTitle = title.trim() || "Untitled";
    onGenerate(finalText, finalTitle);
  };

  const loadSample = () => {
    setText(SAMPLE_TEXT);
    setTitle("The Story of the Universe");
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <img
            src="/assets/generated/logo-cinematic-transparent.dim_120x120.png"
            alt="CineText logo"
            className="w-8 h-8"
          />
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Cine<span className="text-primary">Text</span>
          </span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl w-full"
        >
          {/* Title */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-body mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Text to Animated Video
            </motion.div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-tight mb-4">
              Turn words into
              <br />
              <span className="text-primary italic">cinema</span>
            </h1>
            <p className="text-muted-foreground font-body text-lg max-w-xl mx-auto">
              Paste any paragraph and watch it transform into a dramatic,
              scene-by-scene animated video experience.
            </p>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="space-y-4"
          >
            {/* Title field */}
            <div className="space-y-1.5">
              <Label
                htmlFor="video-title"
                className="font-body text-sm text-muted-foreground"
              >
                Video Title{" "}
                <span className="text-muted-foreground/50">(optional)</span>
              </Label>
              <Input
                id="video-title"
                placeholder="e.g. The Rise of AI"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-card border-border/60 font-body text-foreground placeholder:text-muted-foreground/40 h-11 focus:border-primary/60 transition-colors"
              />
            </div>

            {/* Main textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="paragraph-input"
                  className="font-body text-sm text-muted-foreground"
                >
                  Your Text
                </Label>
                <button
                  type="button"
                  onClick={loadSample}
                  className="text-xs text-primary/70 hover:text-primary font-body transition-colors"
                >
                  Load sample →
                </button>
              </div>
              <Textarea
                id="paragraph-input"
                data-ocid="input.textarea"
                placeholder="Paste your paragraph here... The universe began with an unfathomable explosion..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={10}
                className="bg-card border-border/60 font-body text-foreground placeholder:text-muted-foreground/30 resize-none text-base leading-relaxed focus:border-primary/60 transition-colors"
              />
              {wordCount > 0 && (
                <p className="text-xs text-muted-foreground/60 font-body text-right">
                  {wordCount} words · ~{Math.ceil(wordCount / 10)} scenes
                  estimated
                </p>
              )}
            </div>

            {/* Generate button */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                data-ocid="input.primary_button"
                onClick={handleGenerate}
                size="lg"
                className="w-full h-14 text-base font-body font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow transition-all duration-300 gap-2"
              >
                <Film className="w-5 h-5" />
                Generate Animated Video
                <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-4 px-6 text-center">
        <p className="text-xs text-muted-foreground/50 font-body">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary/60 hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
