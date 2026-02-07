import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Sparkles, Minimize2, Maximize2 } from "lucide-react";
import { TamboProvider } from "@tambo-ai/react";
import { MessageThreadFull } from "../../message-thread-full";
import { tools } from "../tambo/Tools";

export function TamboChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  return (
    <TamboProvider apiKey={import.meta.env.VITE_TAMBO_API_KEY} tools={tools}>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-chatbot shadow-chatbot flex items-center justify-center group chatbot-pulse"
          >
            <MessageCircle className="w-6 h-6 text-primary-foreground" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
              // Use available viewport space but cap at a reasonable pixel height
              height: isMinimized ? 80 : "min(200vh,800px)",
              width: isMinimized ? 90 : "min(90vw,600px)",
            }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-96 bg-card rounded-2xl shadow-large border border-border overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="h-14 px-4 flex items-center justify-between bg-gradient-primary shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-primary-foreground text-sm">
                    Tambo
                  </h3>
                  <p className="text-xs text-primary-foreground/70">
                    AI Assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg hover:bg-primary-foreground/20 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button> */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-primary-foreground/20 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content (message thread occupies the main flexible area) */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col border-t border-border overflow-hidden"
                >
                  {/* Message thread will include its own input and suggestions and should fill available space */}
                  <div className="flex-1 min-h-0">
                    <MessageThreadFull />
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center mt-2 mb-2">
                    Tambo can make mistakes. Verify important actions.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </TamboProvider>
  );
}
