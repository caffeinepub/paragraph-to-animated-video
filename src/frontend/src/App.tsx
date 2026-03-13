import { InputPage } from "@/components/InputPage";
import { VideoPlayer } from "@/components/VideoPlayer";
import { splitIntoScenes } from "@/utils/sceneSplitter";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type View = "input" | "player";

export default function App() {
  const [view, setView] = useState<View>("input");
  const [scenes, setScenes] = useState<string[]>([]);
  const [title, setTitle] = useState("Untitled");

  const handleGenerate = (text: string, videoTitle: string) => {
    const generated = splitIntoScenes(text);
    setScenes(generated);
    setTitle(videoTitle);
    setView("player");
  };

  const handleBack = () => {
    setView("input");
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {view === "input" ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
          >
            <InputPage onGenerate={handleGenerate} />
          </motion.div>
        ) : (
          <motion.div
            key="player"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <VideoPlayer scenes={scenes} title={title} onBack={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
