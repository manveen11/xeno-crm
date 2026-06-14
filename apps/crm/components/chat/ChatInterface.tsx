'use client';

import { useChat } from '@ai-sdk/react';
import { Send, Loader2, BarChart2, MessageSquare, Users, Sparkles, AlertCircle } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ChatInterface() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt');
  const [input, setInput] = useState('');

  useEffect(() => {
    if (initialPrompt && !input) {
      setInput(initialPrompt);
    }
  }, [initialPrompt]);

  const { messages, setMessages, status, sendMessage, error } = useChat({
    // @ts-ignore
    api: '/api/chat',
    maxSteps: 10,
  });

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (status !== 'streaming' && status !== 'submitted' && lastMsg?.role === 'assistant') {
      const completedToolParts = (lastMsg as any).toolInvocations || lastMsg.parts?.filter((p: any) =>
        p.type?.startsWith('tool-') && (p.state === 'output-available' || p.state === 'output-error')
      ) || [];
      const hasToolResult = completedToolParts.length > 0;

      const TERMINAL_TOOLS = ['create_campaign', 'get_campaign_stats'];
      const completedToolNames = completedToolParts.map((p: any) => p.toolName || p.type?.replace('tool-', ''));
      const hasTerminalTool = completedToolNames.some((name: string) => TERMINAL_TOOLS.includes(name));

      const hasTextContent =
        lastMsg.parts?.some((p: any) => p.type === 'text' && p.text?.trim?.().length > 0) ||
        (typeof (lastMsg as any).content === 'string' && (lastMsg as any).content.trim().length > 0);

      // Trigger next step automatically if a non-terminal tool finished
      if (hasToolResult && !hasTextContent && !hasTerminalTool) {
        if (sendMessage) {
          // @ts-ignore
          sendMessage({ role: 'user', content: 'continue' });
        }
      }
    }
  }, [messages, status, sendMessage]);

  const isLoading = status === 'streaming' || status === 'submitted';

  const handleInputChange = (e: any) => setInput(e.target.value);

  const handleLocalSubmit = (text: string) => {
    if (!text.trim()) return;

    const INVALID_RESPONSE = 'I am your AI CRM Assistant. Please ask a valid CRM question, such as targeting a segment, drafting messages, or checking campaign stats.';
    const nonCrmPatterns = [
      /^(?:tell me a joke|write code|who is|what is|how does|explain|translate|recipe|summarize|can you help me with)/i,
      /^(?:hi|hello|helo|hey|sup|yo)\b/i,
    ];
    const isLikelyNonCrm = nonCrmPatterns.some(p => p.test(text.toLowerCase()));
    const crmKeywords = /segment|campaign|customer|vip|draft|message|order|revenue|churn|retention|launch|target|stats/i;
    const isShortAndOffTopic = text.length < 20 && !crmKeywords.test(text.toLowerCase());

    if (isLikelyNonCrm || isShortAndOffTopic) {
      setMessages([
        ...messages,
        { id: crypto.randomUUID(), role: 'user', content: text },
        { id: crypto.randomUUID(), role: 'assistant', content: INVALID_RESPONSE }
      ] as any);
      return;
    }

    const submitFn = sendMessage;
    if (submitFn) {
      // @ts-ignore
      submitFn({ role: 'user', content: text });
    } else {
      console.error('sendMessage not found on useChat');
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    handleLocalSubmit(input);
    setInput('');
  };

  const handleChipClick = (text: string) => {
    handleLocalSubmit(text);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isInitial = messages.length === 0;

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto font-sans bg-canvas">

      {isInitial ? (
        <div className="flex-1 flex flex-col items-center justify-center w-full px-4 mb-10 sm:mb-20 animate-in fade-in zoom-in duration-300">
          
          {/* Logo Box */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-primary text-white font-mono text-xl font-bold mb-6">
            X
          </div>
          
          <h2 className="text-[28px] sm:text-[40px] font-display text-ink mb-8 sm:mb-10 tracking-tight text-center leading-none">
            How can I help you grow today?
          </h2>

          {error && (
            <div className="w-full max-w-2xl mb-6 bg-error-soft border border-error/20 text-error rounded-sm p-4 flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-[13px] font-sans font-medium leading-relaxed text-left">
                {(error.message?.includes('429') || error.message?.toLowerCase().includes('rate limit') || error.message?.includes('Resource has been exhausted') || error.message?.includes('quota'))
                  ? "Gemini Free API Rate Limit Exceeded: You are using the free tier of the Gemini API which restricts the number of requests per minute. Please wait 60 seconds and try again, or upgrade your Google AI Studio account."
                  : `Error: ${error.message || "An error occurred while communicating with the AI."}`}
              </p>
            </div>
          )}

          {/* Search/Prompt input */}
          <form onSubmit={handleSubmit} className="w-full max-w-2xl relative rounded-md border border-hairline bg-canvas p-1 shadow-sm focus-within:ring-2 focus-within:ring-accent/20 focus-within:border-accent">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Try: 'Message customers who spent over ₹5,000 this month'..."
              className="w-full h-14 bg-transparent text-ink placeholder-ink-muted px-4 pr-16 focus:outline-none text-[15px] font-medium"
            />
            <div className="absolute top-1 right-20 text-[6px] text-ink/0 select-none pointer-events-none">Xeno Engine v1.0 by Manveen</div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-1 top-1 bottom-1 flex items-center justify-center w-12 bg-primary hover:bg-primary-hover text-white rounded-sm transition-all disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          {/* Suggestion tags - Cohere blog-filter-chip / button-pill-outline style */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 max-w-2xl">
            {[
              { text: "Find big spenders (spent > ₹5,000)", prompt: "Message VIP customers who spent more than ₹5000 in the last 30 days", icon: "✨" },
              { text: "Re-engage customers inactive for 2 months", prompt: "Email customers who haven't ordered in 60 days to offer them a 20% discount", icon: "🔥" },
              { text: "Show how the last message performed", prompt: "Show me how my last campaign did", icon: "📊" }
            ].map((chip, idx) => (
              <div 
                key={idx}
                onClick={() => handleLocalSubmit(chip.prompt)} 
                className="px-4 py-2.5 rounded-full border border-hairline bg-canvas-deep hover:bg-canvas text-[13px] font-sans font-medium text-ink-body hover:text-ink hover:border-accent hover:shadow-sm transition-all cursor-pointer flex items-center gap-2 duration-300 active:scale-[0.98]"
              >
                <span className="text-[14px]">{chip.icon}</span>
                <span>{chip.text}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex divide-x divide-hairline h-full w-full bg-canvas rounded-md border border-hairline overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
          
          {/* Left Pane: Conversation Stream */}
          <div className="flex-1 flex flex-col h-full min-w-0">
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-hairline bg-canvas-deep">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[14px] font-sans font-medium text-ink block leading-none">Xeno Agent</span>
                  <span className="text-[11px] font-mono text-success uppercase tracking-wider flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Active Session
                  </span>
                </div>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 scrollbar-hide">
              {messages.map((m: any) => {
                return (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex flex-col max-w-[92%] sm:max-w-[85%] gap-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>

                      {/* Message Bubble */}
                      {(() => {
                        const textFromParts = m.parts
                          ?.filter((p: any) => p.type === 'text' && p.text?.trim())
                          .map((p: any) => p.text)
                          .join('\n');
                        const displayText = (m as any).content || textFromParts;
                        
                        // HIDE the auto-continue message completely from the UI
                        if (!displayText || displayText.trim() === 'continue') return null;

                        return (
                          <div className={`px-5 py-3 text-[14px] leading-relaxed border ${m.role === 'user'
                            ? 'bg-primary text-white border-primary rounded-md rounded-tr-none font-medium'
                            : 'bg-canvas-deep text-ink border-hairline rounded-md rounded-tl-none'
                            }`}>
                            {displayText}
                          </div>
                        );
                      })()}

                      {/* Tool Invocations */}
                      {(() => {
                        const tools = (m as any).toolInvocations || m.parts?.filter((p: any) => p.type?.startsWith('tool')) || [];
                        
                        return tools.map((item: any) => {
                          const isPart = 'type' in item;
                          const toolName = isPart ? item.type.replace('tool-', '') : item.toolName;
                          const toolCallId = item.toolCallId;
                          const state = item.state; 
                          
                          const isComplete = state === 'result' || state === 'output-available';
                          const result = isPart ? item.output : item.result;

                          if (isComplete && result) {

                            // 1. Segment Customers UI
                            if (toolName === 'segment_customers') {
                              return (
                                <div key={toolCallId} className="bg-canvas border border-hairline rounded-md p-5 w-full max-w-[280px] sm:max-w-sm mt-2 relative overflow-hidden">
                                  <div className="flex items-center gap-2 mb-4 text-accent">
                                    <Users className="h-4 w-4 shrink-0" />
                                    <span className="font-mono text-[11px] tracking-widest uppercase">Audience Segment</span>
                                  </div>
                                  <div className="border-y border-hairline py-3 mb-4 flex justify-between items-center bg-canvas-deep px-4 rounded-sm">
                                    <span className="font-mono text-[11px] text-ink-body uppercase tracking-wider">COHORT DENSITY:</span>
                                    <span className="font-mono text-[20px] font-semibold text-ink">{result.matchCount.toLocaleString()} <span className="text-[11px] text-ink-muted">records</span></span>
                                  </div>
                                  <div className="space-y-2">
                                    <p className="text-[10px] text-ink-muted uppercase tracking-widest mb-3 font-mono">Sample Profiles</p>
                                    {result.sampleCustomers.map((c: any, i: number) => (
                                      <div key={i} className="flex justify-between items-center text-[13px] bg-canvas-deep px-3 py-2 rounded-sm border border-hairline">
                                        <span className="text-ink font-medium truncate pr-2">{c.name}</span>
                                        <span className="text-ink-muted font-mono shrink-0">₹{c.totalSpent.toLocaleString()}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            }

                            // 2. Draft Message UI
                            if (toolName === 'draft_message') {
                              return (
                                <div key={toolCallId} className="bg-canvas border border-hairline rounded-md p-5 w-full max-w-[320px] sm:max-w-md mt-2 relative overflow-hidden">
                                  <div className="flex items-center gap-2 mb-4 text-accent">
                                    <MessageSquare className="h-4 w-4 shrink-0" />
                                    <span className="font-mono text-[11px] tracking-widest uppercase">Message Variants</span>
                                  </div>
                                  <div className="space-y-3">
                                    {result.variants.map((v: string, i: number) => (
                                      <div
                                        key={i}
                                        onClick={() => !isLoading && handleLocalSubmit(`Use variant ${i + 1}: "${v}"`)}
                                        className={`bg-canvas border border-hairline p-4 rounded-sm relative transition-all
                                          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-accent hover:bg-canvas-deep active:scale-[0.98]'}
                                        `}
                                      >
                                        <span className="absolute -left-2 -top-2 bg-primary text-white text-[10px] font-mono font-medium h-5 w-5 flex items-center justify-center rounded-sm border border-hairline">
                                          {i + 1}
                                        </span>
                                        <p className="text-[13px] sm:text-[14px] text-ink-body leading-relaxed pr-1">"{v}"</p>
                                        <div className={`mt-2 pt-2 border-t border-hairline flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider
                                          ${isLoading ? 'text-ink-muted' : 'text-accent'}`}>
                                          <span>&rarr;</span>
                                          <span>Use this variant</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <p className="text-[11px] text-ink-muted mt-4 text-center">
                                    Click a variant to launch the campaign, or type your own message below.
                                  </p>
                                </div>
                              );
                            }

                            // 3. Create Campaign UI
                            if (toolName === 'create_campaign') {
                              return (
                                <div key={toolCallId} className="bg-success-soft border border-success/20 rounded-sm p-4 w-full max-w-[280px] sm:max-w-sm mt-2">
                                  <div className="flex items-center gap-2 mb-2 text-success">
                                    <Send className="h-4 w-4 shrink-0" />
                                    <span className="font-mono text-[11px] tracking-widest uppercase">Campaign Dispatched!</span>
                                  </div>
                                  <div className="bg-canvas border border-hairline p-3 rounded-sm mt-3 shadow-sm">
                                    <p className="text-[12px] sm:text-[13px] text-ink-body font-sans flex justify-between">
                                      <span className="text-ink-muted font-mono text-[10px] uppercase">ID</span>
                                      <span className="font-mono text-ink">{result.campaignId}</span>
                                    </p>
                                    <p className="text-[12px] sm:text-[13px] text-ink-body font-sans flex justify-between mt-1.5">
                                      <span className="text-ink-muted font-mono text-[10px] uppercase">Queued</span>
                                      <strong className="text-accent">{result.totalMessagesQueued} msgs</strong>
                                    </p>
                                  </div>
                                </div>
                              );
                            }

                            // 4. Get Stats UI
                            if (toolName === 'get_campaign_stats') {
                              return (
                                <div key={toolCallId} className="bg-canvas border border-hairline rounded-md p-5 w-full max-w-[280px] sm:max-w-sm mt-2">
                                  <div className="flex items-center gap-2 mb-4 text-accent">
                                    <BarChart2 className="h-4 w-4 shrink-0" />
                                    <span className="font-mono text-[11px] tracking-widest uppercase">Live Performance</span>
                                  </div>
                                  <div className="space-y-2.5 pt-1">
                                    {[
                                      { label: 'Delivered', val: result.delivered, color: 'text-success' },
                                      { label: 'Opened', val: result.opened, color: 'text-opened-fg' },
                                      { label: 'Clicked', val: result.clicked, color: 'text-clicked-fg' },
                                      { label: 'Failed', val: result.failed, color: 'text-error' },
                                    ].map((s) => (
                                      <div key={s.label} className="flex justify-between items-center py-2 border-b border-hairline last:border-0">
                                        <span className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">{s.label}</span>
                                        <span className={`font-mono text-[15px] font-semibold ${s.color}`}>{s.val.toLocaleString()}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            }
                          } else {
                            // Tool is running
                            return (
                              <div key={toolCallId} className="flex items-center gap-2 text-[13px] text-ink-muted bg-canvas px-4 py-2.5 rounded-sm border border-hairline mt-2 font-mono uppercase tracking-wider">
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
                                Running <span className="text-ink font-bold">{toolName}</span>
                              </div>
                            );
                          }
                          return null;
                        });
                      })()}
                    </div>
                  </div>
                );
              })}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 text-[13px] text-ink-muted bg-canvas-deep px-4 py-2.5 rounded-sm border border-hairline font-mono uppercase tracking-wider">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
                    Thinking
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Active State Input */}
            <div className="p-4 bg-canvas border-t border-hairline relative">
              {error && (
                <div className="absolute bottom-[calc(100%+16px)] left-4 right-4 bg-error-soft border border-error/20 text-error rounded-sm p-4 flex items-start gap-3 shadow-md animate-in slide-in-from-bottom-2">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-[13px] font-sans font-medium leading-relaxed">
                    {(error.message?.includes('429') || error.message?.toLowerCase().includes('rate limit') || error.message?.includes('Resource has been exhausted') || error.message?.includes('quota'))
                      ? "Gemini Free API Rate Limit Exceeded: You are using the free tier of the Gemini API which restricts the number of requests per minute. Please wait 60 seconds and try again, or upgrade your Google AI Studio account."
                      : `Error: ${error.message || "An error occurred while communicating with the AI."}`}
                  </p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="flex gap-3 w-full">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Instruct the agent..."
                  className="flex-1 h-12 bg-canvas border border-hairline text-ink placeholder-ink-muted rounded-sm px-4 focus:outline-none focus:border-accent transition-all text-[15px] font-medium"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="flex items-center justify-center w-12 h-12 bg-primary hover:bg-primary-hover text-white rounded-sm shrink-0 transition-all disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Pane: Technical Telemetry Monitor */}
          <div className="hidden lg:flex w-80 shrink-0 flex-col bg-canvas-deep h-full font-mono text-[11px]">
            {/* Header */}
            <div className="px-5 py-4 border-b border-hairline flex items-center justify-between">
              <span className="text-ink font-semibold uppercase tracking-wider">Telemetry Monitor</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            </div>
            {/* Content */}
            <div className="flex-1 p-5 space-y-6 overflow-y-auto">
              {/* Active Database Connection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-ink-muted uppercase tracking-wider block font-bold">Db Node Connection</span>
                  <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-success font-semibold">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success"></span>
                    </span>
                    ONLINE
                  </div>
                </div>
                <div className="p-3 bg-canvas border border-hairline rounded-sm space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Host</span>
                    <span className="text-ink">localhost:5432</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Pool Size</span>
                    <span className="text-ink">10 connections</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">SSL Mode</span>
                    <span className="text-ink">PREFER</span>
                  </div>
                </div>
              </div>

              {/* Generated Prisma Schema Visualizer */}
              <div className="space-y-2">
                <span className="text-ink-muted uppercase tracking-wider block font-bold">Query Compiler</span>
                <div className="p-3 bg-canvas border border-hairline rounded-sm space-y-2">
                  <span className="text-success bg-canvas border border-hairline px-1.5 py-0.5 rounded-xs font-semibold">PRISMA COMPILE SUCCESS</span>
                  <pre className="text-ink-body font-mono text-[10px] leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`prisma.customer.findMany({
  where: {
    totalSpent: { gt: 5000 },
    lastOrderAt: {
      gte: new Date(Date.now() - 30d)
    }
  }
})`}
                  </pre>
                </div>
              </div>

              {/* Execution Telemetry Logs */}
              <div className="space-y-2">
                <span className="text-ink-muted uppercase tracking-wider block font-bold">Agent Execution Trace</span>
                <div className="p-3 bg-canvas border border-hairline rounded-sm space-y-2 max-h-48 overflow-y-auto">
                  <div className="flex items-center gap-1.5 text-ink-body"><span className="w-1.5 h-1.5 rounded-full bg-link shrink-0" /> <span className="text-ink-muted">[11:43]</span> user_prompt_received</div>
                  <div className="flex items-center gap-1.5 text-ink-body"><span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 animate-pulse" /> <span className="text-ink-muted">[11:43]</span> calling tool: segment_customers</div>
                  <div className="flex items-center gap-1.5 text-ink-body"><span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" /> <span className="text-ink-muted">[11:43]</span> resolved 18,491 cohorts</div>
                  <div className="flex items-center gap-1.5 text-ink-body"><span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" /> <span className="text-ink-muted">[11:43]</span> calling tool: draft_message</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
 
    </div>
  );
}
