import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  Minimize2,
  Maximize2,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    content: "Hi! I'm Tambo, your AI assistant. I can help you manage issues, navigate the board, and answer questions about your projects. Try asking me something like \"Show all bugs assigned to me\" or \"Create a new task\".",
    role: 'assistant',
    timestamp: new Date().toISOString(),
  },
];

export function TamboChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        bugs: "I found 1 bug assigned to you: **TAM-4** - Fix message rendering issue on mobile (High priority, In Progress). Would you like me to open it?",
        task: "I can help you create a task! Please provide:\n\n• **Title**: What's the task about?\n• **Priority**: Low, Medium, High, or Critical?\n• **Assignee**: Who should work on it?",
        sprint: "The current sprint (Sprint 24) has **8 issues**:\n\n• 2 Todo\n• 2 In Progress\n• 2 In Review\n• 1 Done\n\n**Sprint Goal**: Complete AI chatbot integration\n**Ends**: February 12, 2024",
        default: "I understand you want to help with that! Here are some things I can do:\n\n• **Search issues**: \"Show all bugs\" or \"Find tasks assigned to Sarah\"\n• **Create issues**: \"Create a new task for login feature\"\n• **Move issues**: \"Move TAM-4 to Done\"\n• **Sprint info**: \"What's pending in this sprint?\"\n\nWhat would you like to do?",
      };

      const lowerInput = inputValue.toLowerCase();
      let response = responses.default;
      
      if (lowerInput.includes('bug')) response = responses.bugs;
      else if (lowerInput.includes('task') || lowerInput.includes('create')) response = responses.task;
      else if (lowerInput.includes('sprint') || lowerInput.includes('pending')) response = responses.sprint;

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
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
              height: isMinimized ? 56 : 600,
            }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
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
                  <p className="text-xs text-primary-foreground/70">AI Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg hover:bg-primary-foreground/20 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-primary-foreground/20 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4"
                >
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-3",
                        message.role === 'user' && "flex-row-reverse"
                      )}
                    >
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarFallback className={cn(
                          message.role === 'assistant' 
                            ? "bg-gradient-primary text-primary-foreground" 
                            : "bg-secondary text-secondary-foreground"
                        )}>
                          {message.role === 'assistant' ? (
                            <Bot className="w-4 h-4" />
                          ) : (
                            'A'
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                          message.role === 'assistant'
                            ? "bg-muted text-foreground rounded-tl-md"
                            : "bg-gradient-primary text-primary-foreground rounded-tr-md"
                        )}
                      >
                        <div 
                          className="whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ 
                            __html: message.content
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\n/g, '<br />') 
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3">
                        <div className="flex gap-1">
                          <motion.span
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                          />
                          <motion.span
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                          />
                          <motion.span
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 border-t border-border shrink-0"
                >
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask Tambo anything..."
                      className="flex-1 bg-muted/50 border-transparent focus:border-primary/20"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!inputValue.trim() || isTyping}
                      size="icon"
                      className="bg-gradient-primary hover:opacity-90 transition-opacity shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center mt-2">
                    Tambo can make mistakes. Verify important actions.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
