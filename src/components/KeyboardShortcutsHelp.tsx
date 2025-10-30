import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Keyboard, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const shortcuts = [
  { keys: ['Alt', '1-9'], description: 'Quick jump to page (1=Dashboard, 2=Properties...)' },
  { keys: ['Alt', 'H'], description: 'Go to Dashboard (Home)' },
  { keys: ['Alt', '→/↓'], description: 'Navigate to next page' },
  { keys: ['Alt', '←/↑'], description: 'Navigate to previous page' },
];

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShownTip, setHasShownTip] = useState(false);

  useEffect(() => {
    // Show tip on first visit
    const tipShown = localStorage.getItem('estal_keyboard_tip_shown');
    if (!tipShown) {
      setTimeout(() => {
        setHasShownTip(true);
        localStorage.setItem('estal_keyboard_tip_shown', 'true');
      }, 3000); // Show after 3 seconds

      setTimeout(() => {
        setHasShownTip(false);
      }, 8000); // Hide after 8 seconds
    }

    // Listen for ? key to toggle help
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === '?') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Floating tip */}
      <AnimatePresence>
        {hasShownTip && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <Card className="rounded-[20px] shadow-2xl border-primary/30 max-w-xs">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Keyboard className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm mb-2">
                    <strong>Pro Tip:</strong> Press <Badge variant="outline" className="mx-1">?</Badge> to see keyboard shortcuts
                  </p>
                </div>
                <button
                  onClick={() => setHasShownTip(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shortcuts modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <Card className="rounded-[20px] shadow-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Keyboard className="w-5 h-5 text-primary" />
                      Keyboard Shortcuts
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="rounded-[12px]"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {shortcuts.map((shortcut, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between gap-4 p-3 rounded-[12px] bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {shortcut.keys.map((key, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="rounded-lg font-mono text-xs px-2"
                          >
                            {key}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground flex-1 text-right">
                        {shortcut.description}
                      </p>
                    </motion.div>
                  ))}

                  <div className="pt-4 mt-4 border-t border-border">
                    <p className="text-xs text-center text-muted-foreground">
                      Press <Badge variant="outline" className="mx-1">?</Badge> again to close
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
