import { ParticleOverlay } from "@/components/ParticleOverlay";
import { SceneList } from "@/components/SceneList";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sceneDuration } from "@/utils/sceneSplitter";
import {
  ChevronLeft,
  Film,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const ANIMATION_STYLES = [
  "fade-in",
  "slide-up",
  "zoom-in",
  "typewriter",
  "slide-right",
] as const;
type AnimStyle = (typeof ANIMATION_STYLES)[number];

const BG_ANIMATIONS = [
  "bgShift0",
  "bgShift1",
  "bgShift2",
  "bgShift3",
  "bgShift4",
  "bgShift5",
] as const;

interface VideoPlayerProps {
  scenes: string[];
  title: string;
  onBack: () => void;
}

function getAnimClass(style: AnimStyle): string {
  switch (style) {
    case "fade-in":
      return "anim-fade-in";
    case "slide-up":
      return "anim-slide-up";
    case "zoom-in":
      return "anim-zoom-in";
    case "slide-right":
      return "anim-slide-right";
    case "typewriter":
      return "anim-fade-in";
  }
}

function getSceneFontSize(text: string): string {
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words <= 5) return "clamp(2.5rem, 6vw, 5rem)";
  if (words <= 10) return "clamp(2rem, 4.5vw, 3.8rem)";
  if (words <= 16) return "clamp(1.6rem, 3.5vw, 3rem)";
  return "clamp(1.3rem, 2.8vw, 2.4rem)";
}

function TypewriterText({
  text,
  onDone,
}: { text: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;
    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
        onDone?.();
      }
    }, 35);
    return () => clearInterval(interval);
  }, [text, onDone]);

  return <span className="typewriter-cursor">{displayed}</span>;
}

export function VideoPlayer({ scenes, title, onBack }: VideoPlayerProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
  }, []);

  const goToScene = useCallback(
    (index: number) => {
      if (index < 0 || index >= scenes.length) return;
      clearTimers();
      setCurrentScene(index);
      setProgress(0);
      setAnimKey((k) => k + 1);
    },
    [scenes.length, clearTimers],
  );

  const advanceScene = useCallback(() => {
    setCurrentScene((prev) => {
      if (prev + 1 >= scenes.length) {
        setIsPlaying(false);
        return prev;
      }
      setProgress(0);
      setAnimKey((k) => k + 1);
      return prev + 1;
    });
  }, [scenes.length]);

  useEffect(() => {
    clearTimers();
    if (!isPlaying) return;

    const text = scenes[currentScene] ?? "";
    const dur = sceneDuration(text, speed);
    durationRef.current = dur;
    startTimeRef.current = Date.now();

    timerRef.current = setTimeout(advanceScene, dur);

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setProgress(Math.min((elapsed / dur) * 100, 100));
    }, 50);

    return clearTimers;
  }, [currentScene, isPlaying, speed, scenes, advanceScene, clearTimers]);

  const handlePlayPause = () => {
    setIsPlaying((p) => !p);
  };

  const handleRestart = () => {
    setIsPlaying(true);
    goToScene(0);
    setTimeout(() => setIsPlaying(true), 0);
  };

  const sceneText = scenes[currentScene] ?? "";
  const animStyle = ANIMATION_STYLES[currentScene % ANIMATION_STYLES.length];
  const bgAnim = BG_ANIMATIONS[currentScene % BG_ANIMATIONS.length];
  const isTypewriter = animStyle === "typewriter";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border/40 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-1.5 text-muted-foreground hover:text-foreground font-body text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="h-4 w-px bg-border/40" />
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-primary" />
            <span className="font-display font-semibold text-sm text-foreground truncate max-w-[200px]">
              {title}
            </span>
          </div>
        </div>
        <span className="text-xs font-body text-muted-foreground">
          Scene {currentScene + 1} / {scenes.length}
        </span>
      </header>

      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Main Player */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Video Canvas */}
          <div
            data-ocid="player.canvas_target"
            className="relative letterbox overflow-hidden flex-1 min-h-[300px]"
            style={{
              animation: `${bgAnim} 8s ease-in-out infinite`,
            }}
          >
            <div className="grain-overlay" aria-hidden="true" />
            <ParticleOverlay />

            {/* Progress bar */}
            <div className="absolute top-6 left-8 right-8 z-20">
              <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary progress-bar-glow transition-none rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {/* Scene dots */}
              <div className="flex gap-1 mt-2 flex-wrap">
                {scenes.map((scene, i) => {
                  const dotKey = `dot-${i}-${scene.slice(0, 8)}`;
                  return (
                    <button
                      key={dotKey}
                      type="button"
                      onClick={() => {
                        goToScene(i);
                        setIsPlaying(true);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentScene
                          ? "bg-primary w-6"
                          : i < currentScene
                            ? "bg-primary/40 w-1.5"
                            : "bg-white/20 w-1.5"
                      }`}
                      aria-label={`Jump to scene ${i + 1}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Scene text */}
            <div className="absolute inset-0 flex items-center justify-center z-20 px-12 py-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentScene}-${animKey}`}
                  className={`text-center max-w-4xl ${getAnimClass(animStyle)}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <p
                    className="font-display font-bold text-white leading-tight tracking-tight"
                    style={{ fontSize: getSceneFontSize(sceneText) }}
                  >
                    {isTypewriter ? (
                      <TypewriterText
                        key={`${currentScene}-${animKey}`}
                        text={sceneText}
                      />
                    ) : (
                      sceneText
                    )}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Scene number badge */}
            <div className="absolute bottom-8 right-8 z-20">
              <span className="font-mono text-xs text-white/40">
                {String(currentScene + 1).padStart(2, "0")} /{" "}
                {String(scenes.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-card border-t border-border/40 px-6 py-4 shrink-0">
            <div className="flex items-center justify-between gap-4">
              {/* Left: prev/play/next/restart */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    goToScene(currentScene - 1);
                    setIsPlaying(true);
                  }}
                  disabled={currentScene === 0}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Previous scene"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>

                <Button
                  data-ocid="player.toggle"
                  variant="default"
                  size="icon"
                  onClick={handlePlayPause}
                  className="w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-glow"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    goToScene(currentScene + 1);
                    setIsPlaying(true);
                  }}
                  disabled={currentScene === scenes.length - 1}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Next scene"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>

                <Button
                  data-ocid="player.button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRestart}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Restart"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* Center: title */}
              <div className="hidden md:block flex-1 text-center">
                <span className="font-body text-sm text-muted-foreground truncate">
                  {sceneText.slice(0, 60)}
                  {sceneText.length > 60 ? "..." : ""}
                </span>
              </div>

              {/* Right: speed */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-body text-muted-foreground hidden sm:block">
                  Speed
                </span>
                <Select
                  value={String(speed)}
                  onValueChange={(v) => setSpeed(Number(v))}
                >
                  <SelectTrigger
                    data-ocid="controls.select"
                    className="w-20 h-8 font-body text-sm bg-muted border-border/40"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5×</SelectItem>
                    <SelectItem value="1">1×</SelectItem>
                    <SelectItem value="1.5">1.5×</SelectItem>
                    <SelectItem value="2">2×</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Scene List Sidebar */}
        <SceneList
          scenes={scenes}
          currentScene={currentScene}
          onSelectScene={(i) => {
            goToScene(i);
            setIsPlaying(true);
          }}
        />
      </div>
    </div>
  );
}
