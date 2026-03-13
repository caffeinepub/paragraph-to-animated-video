import { ScrollArea } from "@/components/ui/scroll-area";
import { List } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

interface SceneListProps {
  scenes: string[];
  currentScene: number;
  onSelectScene: (index: number) => void;
}

export function SceneList({
  scenes,
  currentScene,
  onSelectScene,
}: SceneListProps) {
  const activeRef = useRef<HTMLButtonElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: activeRef is a stable ref
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [currentScene]);

  return (
    <aside className="w-full lg:w-72 xl:w-80 border-t lg:border-t-0 lg:border-l border-border/40 flex flex-col bg-card shrink-0">
      <div className="px-4 py-3 border-b border-border/40 flex items-center gap-2">
        <List className="w-4 h-4 text-muted-foreground" />
        <span className="font-body text-sm font-semibold text-foreground">
          Scenes
        </span>
        <span className="ml-auto text-xs font-mono text-muted-foreground">
          {scenes.length} total
        </span>
      </div>

      <ScrollArea className="flex-1 h-[200px] lg:h-auto">
        <div className="p-3 space-y-2">
          {scenes.map((scene, i) => {
            const isActive = i === currentScene;
            const ocid = `scene.item.${i + 1}` as const;
            const stableKey = `scene-${i}-${scene.slice(0, 20)}`;
            return (
              <motion.button
                key={stableKey}
                ref={isActive ? activeRef : undefined}
                data-ocid={ocid}
                type="button"
                onClick={() => onSelectScene(i)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left rounded-lg p-3 transition-all duration-200 group ${
                  isActive
                    ? "bg-primary/15 border border-primary/40 shadow-sm"
                    : "bg-muted/40 border border-transparent hover:bg-muted/80 hover:border-border/60"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`font-mono text-xs shrink-0 mt-0.5 ${
                      isActive
                        ? "text-primary font-bold"
                        : "text-muted-foreground/60"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p
                    className={`font-body text-xs leading-relaxed line-clamp-3 ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {scene}
                  </p>
                </div>
                {isActive && (
                  <div className="mt-1.5 h-0.5 bg-primary/50 rounded-full" />
                )}
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
