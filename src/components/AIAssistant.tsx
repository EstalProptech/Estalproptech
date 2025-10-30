import { useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface Message {
  id: number;
  text: string;
  isAI: boolean;
  timestamp: string;
}

const aiSuggestions = [
  "Show maintenance cost trend for this quarter",
  "List top 5 revenue-generating properties",
  "What's the predicted revenue for next month?",
  "Which properties need maintenance?",
  "Analyze occupancy trends"
];

const aiResponses: { [key: string]: string } = {
  "top": "Based on Q4 2025 data, your top 5 revenue-generating properties are:\n1. Skyline Tower Unit 402 - 85K SAR/month\n2. Garden Villa 12 - 120K SAR/month\n3. Riverside Apartments - 62.5K SAR/month\n4. Downtown Loft 8B - 48K SAR/month\n5. Al-Narjis Complex - 95K SAR/month\n\nTotal revenue from top 5: 410.5K SAR/month",
  "cost": "Maintenance Cost Trend Analysis (Q4 2025):\n• October: 45K SAR\n• November: 52K SAR (+15.5%)\n• December (Projected): 56K SAR (+8%)\n\nBreakdown:\n- HVAC Maintenance: 35%\n- Plumbing: 25%\n- Electrical: 20%\n- General Repairs: 20%\n\n⚠️ Trend shows 8% increase next month. Consider preventive maintenance scheduling.",
  "predicted": "AI Prediction for November 2025:\n• Expected Revenue: 1.35M SAR (+8.2%)\n• Occupancy Rate: 94% (+2%)\n• Confidence: 87%\n\nFactors: Seasonal demand increase, 3 new leases pending.",
  "maintenance": "Currently, 8 properties require attention:\n• High Priority: Garden View #105 (HVAC)\n• Medium: 5 routine inspections due\n• Low: 2 minor repairs\n\nRecommended: Schedule HVAC repair within 48h.",
  "occupancy": "Occupancy Trend Analysis:\n• Current: 92%\n• 3-month avg: 89% ↑\n• Peak season approaching\n• Al-Narjis district: 96% (highest)\n\nSuggestion: Optimize pricing in high-demand areas."
};

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your PropTech AI Assistant. I can help you analyze properties, predict trends, and optimize your portfolio. How can I assist you today?",
      isAI: true,
      timestamp: "Just now"
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isAI: false,
      timestamp: "Just now"
    };

    setMessages([...messages, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      let responseText = "I understand you're asking about that. Let me analyze the data...";
      
      const lowerInput = inputValue.toLowerCase();
      if (lowerInput.includes("top") || lowerInput.includes("perform") || lowerInput.includes("revenue-generating")) {
        responseText = aiResponses["top"];
      } else if (lowerInput.includes("cost") || lowerInput.includes("quarter")) {
        responseText = aiResponses["cost"];
      } else if (lowerInput.includes("predict") || lowerInput.includes("revenue")) {
        responseText = aiResponses["predicted"];
      } else if (lowerInput.includes("maintenance") && !lowerInput.includes("cost")) {
        responseText = aiResponses["maintenance"];
      } else if (lowerInput.includes("occupancy") || lowerInput.includes("trend")) {
        responseText = aiResponses["occupancy"];
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        text: responseText,
        isAI: true,
        timestamp: "Just now"
      };

      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInputValue("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 z-50"
          >
            <Card className="rounded-2xl shadow-2xl border-border overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary to-secondary p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Sparkles className="w-5 h-5" />
                    PropTech AI Assistant
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 rounded-xl"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {/* Messages */}
                <div className="h-96 overflow-y-auto space-y-3 pr-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 ${!message.isAI ? 'flex-row-reverse' : ''}`}
                    >
                      {message.isAI && (
                        <Avatar className="w-8 h-8 bg-gradient-to-br from-primary to-secondary">
                          <AvatarFallback className="bg-transparent text-white text-xs">
                            AI
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] p-3 rounded-xl whitespace-pre-line ${
                          message.isAI
                            ? 'bg-muted text-foreground'
                            : 'bg-primary text-white ml-auto'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Suggestions */}
                {messages.length === 1 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Try asking:</p>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.map((suggestion, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="rounded-lg text-xs"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask me anything..."
                    className="rounded-xl"
                  />
                  <Button onClick={handleSend} className="rounded-xl" size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full shadow-2xl bg-gradient-to-r from-primary to-secondary hover:shadow-primary/50"
          size="icon"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </Button>
        {!isOpen && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}
      </motion.div>
    </>
  );
}
