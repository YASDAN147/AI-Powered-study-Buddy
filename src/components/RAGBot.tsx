import { useState, FormEvent } from "react";
import { StudyNote, NoteChunk } from "../types";
import { Send, Sparkles, Layers, BookOpen, Clock, Lightbulb, AlertTriangle, Maximize2, Minimize2, Download, Check, Copy, X, ChevronLeft, ChevronRight } from "lucide-react";
import { playChimeSound } from "../utils/sound";

export interface ExtractedDiagram {
  type: "svg" | "image";
  value: string; // The raw SVG string OR the image URL / data URI
  alt: string;
  sourceTitle?: string;
}

// Svg diagram viewer designed for rendering high-fidelity interactive vectors
interface SvgDiagramViewerProps {
  svgString: string;
  onMaximize: (svg: string) => void;
  key?: any;
}

function SvgDiagramViewer({ svgString, onMaximize }: SvgDiagramViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(svgString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `biological_diagram_${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="my-4 p-4 bg-slate-950/60 rounded-3xl border border-white/10 shadow-xl overflow-hidden flex flex-col gap-3 group relative text-left">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
          <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 leading-none">High-Precision Study Diagram</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 px-1.5 hover:bg-white/15 rounded text-slate-400 hover:text-white transition flex items-center gap-1 text-[10px] font-bold"
            title="Copy SVG Code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>XML</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="p-1 px-1.5 hover:bg-white/15 rounded text-slate-400 hover:text-white transition flex items-center gap-1 text-[10px] font-bold"
            title="Download Vector Graphic"
          >
            <Download className="w-3 h-3" />
            <span>Save</span>
          </button>
          <button
            type="button"
            onClick={() => onMaximize(svgString)}
            className="p-1 px-1.5 hover:bg-white/15 rounded text-slate-400 hover:text-white transition flex items-center gap-1 text-[10px] font-bold"
            title="Enlarge Graphic"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Zoom</span>
          </button>
        </div>
      </div>

      <div 
        className="w-full text-slate-100 flex items-center justify-center p-3 rounded-2xl bg-slate-900/60 border border-white/5 overflow-x-auto select-none transition group-hover:border-indigo-500/20 max-h-[350px]"
        dangerouslySetInnerHTML={{ __html: svgString }}
      />
    </div>
  );
}

// Full-width interactive image and diagram gallery
interface InteractiveGalleryProps {
  diagrams: ExtractedDiagram[];
  onMaximize: (diagram: ExtractedDiagram) => void;
}

function InteractiveGallery({ diagrams, onMaximize }: InteractiveGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!diagrams || diagrams.length === 0) return null;

  // Bound index safely
  const activeIndex = currentIndex >= diagrams.length ? 0 : currentIndex;
  const current = diagrams[activeIndex];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(current.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    let blob: Blob;
    let filename = `study_diagram_${activeIndex + 1}_${Date.now()}`;
    
    if (current.type === "svg") {
      blob = new Blob([current.value], { type: "image/svg+xml" });
      filename += ".svg";
    } else if (current.value.startsWith("data:")) {
      try {
        const parts = current.value.split(";base64,");
        const contentType = parts[0].split(":")[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        blob = new Blob([uInt8Array], { type: contentType });
        filename += "." + (contentType.split("/")[1] || "png");
      } catch (err) {
        console.error("Failed to decode base64 file", err);
        return;
      }
    } else {
      const link = document.createElement("a");
      link.href = current.value;
      link.target = "_blank";
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % diagrams.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + diagrams.length) % diagrams.length);
  };

  return (
    <div className="my-5 p-5 bg-slate-900/90 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-4 text-left w-full max-w-full">
      {/* Header controls deck */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex flex-col gap-0.5 max-w-[60%]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-widest text-teal-400">
              Interactive Diagram Gallery
            </span>
            <span className="text-[10px] bg-slate-850 text-slate-300 font-bold px-2 py-0.5 rounded-full inline-block shrink-0">
              {activeIndex + 1} of {diagrams.length}
            </span>
          </div>
          {current.sourceTitle && (
            <span className="text-[10px] text-slate-400 italic truncate block">
              Source: {current.sourceTitle}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyCode}
            className="p-1 px-2 bg-white/5 hover:bg-white/15 rounded-lg text-slate-300 hover:text-white transition flex items-center gap-1.5 text-[10px] font-extrabold"
            title="Copy Source Data/XML"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="p-1 px-2 bg-white/5 hover:bg-white/15 rounded-lg text-slate-300 hover:text-white transition flex items-center gap-1.5 text-[10px] font-extrabold"
            title="Download Graphic File"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
          <button
            type="button"
            onClick={() => onMaximize(current)}
            className="p-1 px-2 bg-indigo-650 hover:bg-indigo-600 rounded-lg text-white transition flex items-center gap-1.5 text-[10px] font-extrabold"
            title="Enlarge Interactive Graphic View"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Zoom</span>
          </button>
        </div>
      </div>

      {/* Main active frame viewer box */}
      <div className="relative group bg-slate-950/65 border border-white/5 rounded-2xl flex items-center justify-center p-4 min-h-[260px] max-h-[480px] overflow-hidden transition-all hover:border-teal-400/20">
        
        {/* Navigation arrows if multiple diagrams exist */}
        {diagrams.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 p-2 bg-black/65 hover:bg-indigo-600 border border-white/10 hover:border-indigo-400 rounded-full text-white transition-all shadow-xl z-20"
              aria-label="Previous Diagram"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 p-2 bg-black/65 hover:bg-indigo-600 border border-white/10 hover:border-indigo-400 rounded-full text-white transition-all shadow-xl z-20"
              aria-label="Next Diagram"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Render SVG or regular Image tag wrapper */}
        <div className="w-full flex items-center justify-center select-none overflow-auto max-h-[400px]">
          {current.type === "svg" ? (
            <div 
              className="w-full max-w-full text-slate-100 flex items-center justify-center p-1 bg-transparent overflow-x-auto select-none [&>svg]:w-full [&>svg]:h-auto scale-95 md:scale-100"
              dangerouslySetInnerHTML={{ __html: current.value }}
            />
          ) : (
            <img 
              src={current.value}
              alt={current.alt || "Biology Lesson Diagram"}
              referrerPolicy="no-referrer"
              className="max-w-full h-auto max-h-[380px] rounded-xl object-contain drop-shadow-2xl hover:scale-[1.01] transition duration-300"
            />
          )}
        </div>
      </div>

      {/* Caption overlay information and mini thumb carousel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
        <div className="space-y-0.5 max-w-md text-left">
          <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider">Active Diagram Caption</span>
          <p className="text-xs font-semibold text-slate-100 leading-snug">
            {current.alt || "High-precision structural visual study guide."}
          </p>
        </div>

        {/* Thumbnail circles/index buttons map if multiple */}
        {diagrams.length > 1 && (
          <div className="flex items-center gap-1.5 self-end md:self-auto overflow-x-auto py-1">
            {diagrams.map((diag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-5 h-5 rounded-full border text-[9px] font-black flex items-center justify-center transition-all duration-300 ${
                  activeIndex === idx
                    ? "bg-teal-400 border-teal-300 text-slate-950 scale-110 shadow-lg shadow-teal-400/20"
                    : "bg-slate-800 border-white/10 text-slate-400 hover:border-slate-500 hover:text-white"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Extracts and groups all SVGs, markdown images, HTML img tags, and raw data URIs
export function extractAllDiagrams(content: string, sources?: { chunk: NoteChunk; score: number }[]): {
  cleanedText: string;
  diagrams: ExtractedDiagram[];
} {
  const diagrams: ExtractedDiagram[] = [];
  let cleanedText = content;

  // 1. Extract inline SVG graphics: starting with <svg and ending with </svg>
  const svgRegex = /<svg[\s\S]*?<\/svg>/gi;
  let svgMatch;
  while ((svgMatch = svgRegex.exec(content)) !== null) {
    diagrams.push({
      type: "svg",
      value: svgMatch[0],
      alt: "Interactive Vector Diagram",
      sourceTitle: "AI Generated Concept"
    });
  }
  cleanedText = cleanedText.replace(svgRegex, "");

  // 2. Extract markdown images from response content: ![alt](url or data:uri)
  const mdImgRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+|data:image\/[^)]+)\)/gi;
  let mdImgMatch;
  while ((mdImgMatch = mdImgRegex.exec(content)) !== null) {
    diagrams.push({
      type: "image",
      value: mdImgMatch[2],
      alt: mdImgMatch[1] || "Biology Study Diagram",
      sourceTitle: "Study Resource Illustration"
    });
  }
  cleanedText = cleanedText.replace(mdImgRegex, "");

  // 3. Extract HTML img tags from response: <img src="..." alt="..." />
  const htmlImgRegex = /<img[^>]+src=["'](https?:\/\/[^"'> ]+|data:image\/[^"'> ]+)["'][^>]*>/gi;
  let htmlImgMatch;
  while ((htmlImgMatch = htmlImgRegex.exec(content)) !== null) {
    const altRegexResult = htmlImgMatch[0].match(/alt=["']([^"']+)["']/i);
    const alt = altRegexResult ? altRegexResult[1] : "Reference Illustration";
    diagrams.push({
      type: "image",
      value: htmlImgMatch[1],
      alt,
      sourceTitle: "Reference Diagram"
    });
  }
  cleanedText = cleanedText.replace(htmlImgRegex, "");

  // 4. Extract embedded diagram URLs or data URIs found inside the matching study material (retrievedSources)
  if (sources && sources.length > 0) {
    sources.forEach((src) => {
      const text = src.chunk.text;
      
      // Look for Markdown Image syntax inside textbook/material text
      const srcMdRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+|data:image\/[^)]+)\)/gi;
      let srcMdMatch;
      while ((srcMdMatch = srcMdRegex.exec(text)) !== null) {
        const url = srcMdMatch[2];
        if (!diagrams.some((d) => d.value === url)) {
          diagrams.push({
            type: "image",
            value: url,
            alt: srcMdMatch[1] || "Material Diagram",
            sourceTitle: `From material deck: ${src.chunk.noteTitle}`
          });
        }
      }

      // Also look for HTML img tags inside study material text
      const srcHtmlImgRegex = /<img[^>]+src=["'](https?:\/\/[^"'> ]+|data:image\/[^"'> ]+)["'][^>]*>/gi;
      let srcHtmlImgMatch;
      while ((srcHtmlImgMatch = srcHtmlImgRegex.exec(text)) !== null) {
        const url = srcHtmlImgMatch[1];
        if (!diagrams.some((d) => d.value === url)) {
          const altResult = srcHtmlImgMatch[0].match(/alt=["']([^"']+)["']/i);
          const alt = altResult ? altResult[1] : `Textbook Diagram Reference`;
          diagrams.push({
            type: "image",
            value: url,
            alt,
            sourceTitle: `From text resource: ${src.chunk.noteTitle}`
          });
        }
      }

      // Standalone URLs or large data images inside text chunks
      const p1 = /(https?:\/\/[^\s"',)]+\.(?:png|jpg|jpeg|gif|svg|webp))/gi;
      let m1;
      while ((m1 = p1.exec(text)) !== null) {
        const url = m1[1];
        if (!diagrams.some((d) => d.value === url)) {
          diagrams.push({
            type: "image",
            value: url,
            alt: "Discovered material visualizer",
            sourceTitle: `From textbook: ${src.chunk.noteTitle}`
          });
        }
      }

      const p2 = /(data:image\/[a-zA-Z+-]+;base64,[a-zA-Z0-9+/=]+)/gi;
      let m2;
      while ((m2 = p2.exec(text)) !== null) {
        const uri = m2[1];
        if (!diagrams.some((d) => d.value === uri)) {
          diagrams.push({
            type: "image",
            value: uri,
            alt: "Embedded study diagram",
            sourceTitle: `From material: ${src.chunk.noteTitle}`
          });
        }
      }
    });
  }

  // Final cleaning up of excessive line breaks
  cleanedText = cleanedText.trim();

  return { cleanedText, diagrams };
}

// Inline formatting of headers, paragraphs, bold tags, and bracketed sources
const renderInlineFormatting = (text: string) => {
  const boldParts = text.split(/\*\*([\s\S]*?)\*\*/g);
  return boldParts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index} className="font-extrabold text-white text-glow-sm">{part}</strong>;
    }
    
    const sourceParts = part.split(/(\[Source \d+\])/g);
    return sourceParts.map((subPart, subIndex) => {
      if (subPart.startsWith("[Source") && subPart.endsWith("]")) {
        const sourceNum = subPart.substring(8, subPart.length - 1);
        return (
          <span 
            key={subIndex} 
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 mx-0.5 text-[10px] font-black bg-teal-500/15 border border-teal-500/30 text-teal-300 rounded hover:scale-105 transition duration-200 cursor-help"
            title={`Referencing Source document #${sourceNum}`}
          >
            Source {sourceNum}
          </span>
        );
      }
      return subPart;
    });
  });
};

interface TextRendererProps {
  rawText: string;
  key?: any;
}

function TextRenderer({ rawText }: TextRendererProps) {
  const lines = rawText.split('\n');
  return (
    <div className="space-y-1.5">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-1.5" />;

        if (line.startsWith("### ")) {
          return (
            <h4 key={index} className="text-sm font-black text-indigo-300 uppercase tracking-wide mt-3 mb-1">
              {renderInlineFormatting(line.substring(4))}
            </h4>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h3 key={index} className="text-base font-black text-white tracking-tight mt-4 mb-2 border-b border-white/5 pb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> {renderInlineFormatting(line.substring(3))}
            </h3>
          );
        }
        if (line.startsWith("# ")) {
          return (
            <h2 key={index} className="text-lg font-black text-white tracking-tight mt-4 mb-2 text-glow flex items-center gap-2">
              {renderInlineFormatting(line.substring(2))}
            </h2>
          );
        }

        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={index} className="flex gap-2 items-start pl-1 py-0.5 text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
              <p className="text-sm leading-relaxed flex-1 m-0">
                {renderInlineFormatting(trimmed.substring(2))}
              </p>
            </div>
          );
        }

        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numberedMatch) {
          const number = numberedMatch[1];
          const remaining = numberedMatch[2];
          return (
            <div key={index} className="flex gap-1.5 items-start pl-1 py-0.5 text-slate-200">
              <span className="font-mono text-xs font-black text-indigo-400 mt-0.5 shrink-0">{number}.</span>
              <p className="text-sm leading-relaxed flex-1 m-0">
                {renderInlineFormatting(remaining)}
              </p>
            </div>
          );
        }

        return (
          <p key={index} className="text-sm leading-relaxed text-slate-300 my-0.5">
            {renderInlineFormatting(line)}
          </p>
        );
      })}
    </div>
  );
}

// Safely partition raw assistant messages into text or code blocks + parsed SVGs
function parseMessageContent(content: string) {
  const parts: { type: "text" | "svg"; value: string }[] = [];
  let currentIndex = 0;

  while (currentIndex < content.length) {
    const svgStart = content.indexOf("<svg", currentIndex);
    if (svgStart === -1) {
      parts.push({ type: "text", value: content.substring(currentIndex) });
      break;
    }

    if (svgStart > currentIndex) {
      parts.push({ type: "text", value: content.substring(currentIndex, svgStart) });
    }

    const svgEnd = content.indexOf("</svg>", svgStart);
    if (svgEnd === -1) {
      parts.push({ type: "text", value: content.substring(svgStart) });
      break;
    }

    const svgContent = content.substring(svgStart, svgEnd + 6);
    parts.push({ type: "svg", value: svgContent });
    currentIndex = svgEnd + 6;
  }

  return parts;
}

interface RAGBotProps {
  notes: StudyNote[];
  onEarnReward: (xpGained: number, coinsGained: number) => void;
  xp: number;
  activeCompanion?: any;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  retrievedSources?: { chunk: NoteChunk; score: number }[];
}

export default function RAGBot({ notes, onEarnReward, xp, activeCompanion }: RAGBotProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [maxiDiagram, setMaxiDiagram] = useState<ExtractedDiagram | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const welcome = activeCompanion ? 
      `Hello! I am **${activeCompanion.name}**, your equipped Study Companion!\n\n${activeCompanion.description}\n\nSubmit your study notes or questions below. I will rank your text segments using **Retrieval-Augmented Generation (RAG)** to compose custom grounded explanations, cite your materials, and even draw beautiful educational diagrams!\n\n*Feeling tired or distracted? Click **✨ Motivate Me!** in my control sidebar to sync my sensors and get personalized study coaching!*`
      : `Hello! I am your AI Study Companion. \n\nType a question in the field below. If you have active study notes, I will use **Real-Time Retrieval-Augmented Generation (RAG)** to scan your segments, rank matching paragraphs by term significance, and compose a grounded answer citing your specific texts!`;
    return [
      {
        id: "wel-1",
        role: "assistant",
        content: welcome,
      },
    ];
  });

  // Client-side RAG ranking (term frequency similarity engine)
  const performRetrieval = (userPrompt: string): { chunk: NoteChunk; score: number }[] => {
    if (!userPrompt || notes.length === 0) return [];
    
    // Normalize and tokenize search term
    const rawTokens = userPrompt.toLowerCase().replace(/[^a-z0-9\s]/gi, "").split(/\s+/);
    const stopWords = new Set(["the", "and", "for", "with", "this", "that", "from", "your", "what", "how", "why", "who", "where"]);
    const queryTokens = rawTokens.filter((token) => token.length > 2 && !stopWords.has(token));

    if (queryTokens.length === 0) return [];

    const scoredSegments: { chunk: NoteChunk; score: number }[] = [];

    notes.forEach((note) => {
      note.chunks.forEach((chunk) => {
        let textToSearch = chunk.text.toLowerCase();
        let matchScore = 0;
        
        queryTokens.forEach((token) => {
          // Token frequency checking
          let position = textToSearch.indexOf(token);
          let occurrences = 0;
          while (position !== -1) {
            occurrences++;
            position = textToSearch.indexOf(token, position + 1);
          }
          
          if (occurrences > 0) {
            // TF score weighted by token length (longer words carry more semantic meaning)
            matchScore += occurrences * (token.length * 1.5);
            
            // Sentence-match bonus
            if (chunk.noteTitle.toLowerCase().includes(token)) {
              matchScore += 30; // topic correlation bonus
            }
          }
        });

        if (matchScore > 0) {
          scoredSegments.push({
            chunk,
            score: Math.min(Math.round(matchScore), 99) // Limit to double digit score for layout
          });
        }
      });
    });

    // Sort descending by score, return top 3 matches
    return scoredSegments.sort((a, b) => b.score - a.score).slice(0, 3);
  };

  const handleSendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userText = query.trim();
    setQuery("");
    setIsLoading(true);

    // 1. Perform offline-first retrieval index matching!
    const retrieved = performRetrieval(userText);

    // User message entity
    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: userText,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // 2. Relay prompt + top retrieved context chunks to Gemini explain API
      const response = await fetch("/api/gemini/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: userText,
          contextNoteChunks: retrieved.map((r) => r.chunk),
          chatHistory: messages.slice(-4).map((m) => ({ role: m.role, content: m.content })), // maintain short conversational memory
          activeCompanion: activeCompanion,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to receive explanation from the AI agent.");
      }

      const data = await response.json();

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.text,
        retrievedSources: retrieved,
      };

      setMessages((prev) => [...prev, botMessage]);
      onEarnReward(20, 8); // Reward Q&A interaction
    } catch (err: any) {
      setMessages((prev) => [
         ...prev,
         {
           id: `err-${Date.now()}`,
           role: "assistant",
           content: `⚠️ Oops! I couldn't reach the AI tutoring service. Error details: **${err.message || "Unknown offline error."}**. If you are offline, you can still search and review your manual study notes.`,
         },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerAcolyteMotivation = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      playChimeSound("success");
    } catch (_) {}

    const companionName = activeCompanion?.name || "Acolyte Companion";
    const userPromptText = `Please inspire and motivate me right now! Speak to me as my equipped Study Companion (${companionName}).`;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: userPromptText,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("/api/gemini/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: userPromptText,
          contextNoteChunks: [],
          chatHistory: messages.slice(-4).map((m) => ({ role: m.role, content: m.content })),
          activeCompanion: activeCompanion,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to receive motivational response.");
      }

      const data = await response.json();

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.text,
      };

      setMessages((prev) => [...prev, botMessage]);
      onEarnReward(15, 6); // Motivate reward
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `⚠️ Oops! I couldn't reach your acolyte companion. Error detail: ${err.message || "Unknown error."}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentNoteCount = notes.length;
  const chunkLengthTotal = notes.reduce((acc, n) => acc + n.chunks.length, 0);

  return (
    <div id="rag-interface" className="grid grid-cols-1 xl:grid-cols-4 gap-6 p-2 h-full min-h-[850px] w-full">
      {/* Left chat panel - expandable to take up all columns for maximum screen and study size */}
      <div 
        id="chat-column" 
        className={`${
          isChatExpanded ? "xl:col-span-4" : "xl:col-span-3"
        } flex flex-col glass rounded-3xl p-6 shadow-2xl min-h-[820px] transition-all duration-300 relative`}
      >
        {/* Chat window panel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/8 pb-3 mb-4 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Active RAG Study Core</span>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Widescreen / Resizable screen controls requested by the user */}
            <button
              type="button"
              onClick={() => setIsChatExpanded(!isChatExpanded)}
              className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300 active:scale-95 ${
                isChatExpanded 
                  ? "bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200" 
                  : "bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200"
              }`}
              title={isChatExpanded ? "Reduce Chat Window to Standard" : "Expand to Full-Size Chat Bot"}
            >
              {isChatExpanded ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Reduce Screen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full Size Chat</span>
                </>
              )}
            </button>

            <span className="text-[10px] bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              {chunkLengthTotal} Segments Indexed
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-5 pr-2 max-h-[680px] xl:max-h-[780px] text-left">
          {messages.map((m) => {
            // Process content for diagrams (SVG, Markdown raw URLs, data URIs)
            const { cleanedText, diagrams } = extractAllDiagrams(m.content, m.role === "assistant" ? m.retrievedSources : undefined);

            return (
              <div key={m.id} className="space-y-3">
                <div
                  className={`flex gap-3 max-w-[92%] ${
                    m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed w-full ${
                      m.role === "user"
                        ? "bg-indigo-600 text-white font-medium rounded-tr-none shadow-lg shadow-indigo-500/10 ml-auto max-w-[80%]"
                        : "glass border border-white/5 text-slate-100 rounded-tl-none w-full"
                    }`}
                  >
                    {m.role === "user" ? (
                      <span className="whitespace-pre-wrap">{m.content}</span>
                    ) : (
                      <div className="space-y-1">
                        <TextRenderer rawText={cleanedText} />
                        {diagrams.length > 0 && (
                          <InteractiveGallery 
                            diagrams={diagrams} 
                            onMaximize={setMaxiDiagram} 
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>

              {/* RAG sources indicator below AI bot messages */}
              {m.role === "assistant" && m.retrievedSources && m.retrievedSources.length > 0 && (
                <div className="pl-3 pr-10 flex flex-col gap-2">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
                    <Layers className="w-3 h-3 text-teal-500" />
                    <span>Real-Time Citations ({m.retrievedSources.length})</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {m.retrievedSources.map((src, index) => (
                      <div
                        key={index}
                        className="p-2.5 bg-gradient-to-br from-teal-500/5 to-indigo-500/5 border border-teal-500/10 dark:border-teal-500/20 rounded-xl flex flex-col text-left group hover:border-teal-400 transition"
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400 truncate">
                            {src.chunk.noteTitle}
                          </span>
                          <span className="text-[9px] bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold px-1 rounded">
                            {src.score}% Match
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-2 italic">
                          "{src.chunk.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

          {isLoading && (
            <div className="flex items-center gap-2 text-neutral-400 text-xs italic pl-3">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-500" />
              <span>Scanning local segments & formulating response...</span>
            </div>
          )}
        </div>

        {/* Input box */}
        <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-2 glass p-2 rounded-2xl border border-white/10 focus-within:border-indigo-500/30 focus-within:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all duration-300">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              currentNoteCount === 0
                ? "First paste study notes to activate active-RAG tutor..."
                : "Ask anything about your notes (e.g. explain the photoelectric hypothesis...)"
            }
            className="flex-1 bg-transparent border-none focus:outline-none px-2 py-2.5 text-sm font-medium text-slate-200 placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 transition transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-indigo-600/20"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </div>

      {/* Right control panel: RAG parameters and search visualizer (hidden when full size chat format is active) */}
      {!isChatExpanded && (
        <div id="rag-diagnostics" className="flex flex-col gap-4">
          {/* 💖 Acolyte Co-Pilot & Motivator Deck */}
          <div className="glass rounded-3xl p-5 text-left shadow-2xl border border-white/8 relative overflow-hidden group">
            {/* Ambient subtle backdrop glows */}
            <div className="absolute -right-12 -top-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500 pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-28 h-28 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all duration-500 pointer-events-none" />

            <h3 className="text-xs font-black uppercase tracking-widest text-[#a5b4fc] mb-4 flex items-center gap-1.5 z-10 relative">
              <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" /> Active Co-Pilot
            </h3>

            {/* Avatar Orbit container */}
            <div className="flex items-center gap-4 mb-4 z-10 relative">
              <div className="relative shrink-0 select-none flex items-center justify-center">
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-md opacity-60 animate-pulse" />
                <div className="relative bg-slate-950 w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden shadow-xl">
                  {activeCompanion?.image ? (
                    <img 
                      src={activeCompanion.image} 
                      alt={activeCompanion.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-3xl font-mono">
                      {activeCompanion?.id === "acolyte-elrond" ? "🦉" :
                       activeCompanion?.id === "acolyte-vortex" ? "🦅" :
                       activeCompanion?.id === "acolyte-orion" ? "🐺" :
                       activeCompanion?.id === "acolyte-aurora" ? "🦊" :
                       activeCompanion?.id === "acolyte-glitch" ? "🐉" :
                       activeCompanion?.id === "acolyte-specter" ? "🐈‍⬛" :
                       activeCompanion?.id === "acolyte-spark" ? "🦎" : "🤖"}
                    </span>
                  )}
                </div>
                {/* Micro active indicator */}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center shadow-md">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-extrabold text-white truncate">
                  {activeCompanion?.name || "Standard Companion"}
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">
                  Level {Math.floor(xp / 1000) + 1} Acolyte Core
                </p>
              </div>
            </div>

            {/* Description or Dialogue */}
            <p className="text-[11px] text-slate-300 leading-relaxed mb-4 z-10 relative italic">
              "{activeCompanion?.description || "An expert AI co-pilot trained to help you review complex materials, summarize textbooks, and construct recall paths."}"
            </p>

            {/* Interactive Motivation trigger action buttons */}
            <button
              type="button"
              onClick={triggerAcolyteMotivation}
              disabled={isLoading}
              className="w-full relative z-10 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-505 hover:to-pink-505 text-white shadow-xl hover:shadow-indigo-500/20 active:scale-98 disabled:opacity-50 transition transform duration-300"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? "Synthesizing..." : "✨ Motivate Me!"}</span>
            </button>
          </div>

          {/* Statistics and status card */}
          <div className="glass rounded-3xl p-5 text-left shadow-2xl border border-white/8">
            <h3 className="text-sm font-bold text-white text-glow mb-3 flex items-center gap-1.5">
              <Layers className="text-teal-400 w-4 h-4" /> RAG System Mechanics
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Unlike basic search, this app segments your notes into individual **retrieval nodes**. When you prompt, the system scores each node using TF-IDF term weights before sending only relevant references to **Google Gemini** for grounded synthesis.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Active Decks</span>
                <span className="font-bold text-white">{currentNoteCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> Index Mappings</span>
                <span className="font-bold text-emerald-400">{chunkLengthTotal} nodes</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Context Window</span>
                <span className="font-bold text-indigo-400 font-mono text-[11px] bg-indigo-950/35 border border-indigo-500/20 px-2 py-0.5 rounded-full">Auto-Trimmed</span>
              </div>
            </div>
          </div>

          {/* Dynamic visual segment matrix map */}
          <div className="glass bg-gradient-to-b from-indigo-500/5 to-teal-500/5 border border-white/8 rounded-3xl p-5 text-left flex-1 min-h-[180px] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Semantic Cluster Map
              </h4>
            </div>
            <p className="text-[10px] text-neutral-400 leading-relaxed mb-4">
              Live mock representation of the vectors. Nodes light up green when matched during retrieval queries.
            </p>

            {chunkLengthTotal === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl p-4 text-center">
                <AlertTriangle className="w-5 h-5 text-slate-500 mb-2" />
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">No Data Indexed</span>
                <p className="text-[9px] text-slate-500 max-w-[150px] mt-1">Please write active lessons first to populate index block clusters.</p>
              </div>
            ) : (
              <div className="flex-1 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-6 gap-2 max-h-[140px] overflow-y-auto p-1 bg-black/30 rounded-2xl">
                {Array.from({ length: chunkLengthTotal }).map((_, index) => {
                  const isActive = index < 3 && messages.length > 1; // Highlight first 3 nodes on prompt answer
                  return (
                    <div
                      key={index}
                      className={`aspect-square rounded-lg flex items-center justify-center text-[8px] font-bold transition-all duration-500 ${
                        isActive
                          ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30 border-none scale-105"
                          : "bg-white/5 border border-white/5 text-slate-400"
                      }`}
                      title={`Segment ID #${index + 1}`}
                    >
                      N{index + 1}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {maxiDiagram && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 transition-all duration-300">
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <button
              onClick={() => {
                let blob: Blob;
                let filename = `zoomed_diagram_${Date.now()}`;
                
                if (maxiDiagram.type === "svg") {
                  blob = new Blob([maxiDiagram.value], { type: "image/svg+xml" });
                  filename += ".svg";
                } else if (maxiDiagram.value.startsWith("data:")) {
                  try {
                    const parts = maxiDiagram.value.split(";base64,");
                    const contentType = parts[0].split(":")[1];
                    const raw = window.atob(parts[1]);
                    const rawLength = raw.length;
                    const uInt8Array = new Uint8Array(rawLength);
                    for (let i = 0; i < rawLength; ++i) {
                      uInt8Array[i] = raw.charCodeAt(i);
                    }
                    blob = new Blob([uInt8Array], { type: contentType });
                    filename += "." + (contentType.split("/")[1] || "png");
                  } catch (e) {
                    console.error("Failed to decode inline data", e);
                    return;
                  }
                } else {
                  const link = document.createElement("a");
                  link.href = maxiDiagram.value;
                  link.target = "_blank";
                  link.download = filename;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  return;
                }

                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}
              className="p-2.5 bg-slate-900 border border-white/10 hover:border-indigo-500 rounded-xl text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-bold shadow-2xl"
              title="Download high-resolution visual file"
            >
              <Download className="w-4 h-4" /> Save High-Res Diagram
            </button>
            <button
              onClick={() => setMaxiDiagram(null)}
              className="p-2.5 bg-slate-900 border border-white/10 hover:border-red-500 rounded-xl text-slate-400 hover:text-white transition shadow-2xl"
              title="Close Fullscreen View"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="w-full max-w-5xl h-full max-h-[80vh] flex items-center justify-center bg-slate-950 border border-white/5 rounded-3xl p-6 shadow-inner select-none transition-all overflow-auto">
            {maxiDiagram.type === "svg" ? (
              <div 
                className="w-full h-full text-slate-100 flex items-center justify-center svg-max-wrapper [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-[72vh]"
                dangerouslySetInnerHTML={{ __html: maxiDiagram.value }}
              />
            ) : (
              <img 
                src={maxiDiagram.value} 
                alt={maxiDiagram.alt}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[72vh] object-contain rounded-xl select-none"
              />
            )}
          </div>
          <p className="text-xs text-slate-400 mt-4 font-semibold tracking-wide">
            {maxiDiagram.alt || "Interactive study diagram enlarged."} Click Save High-Res Diagram to download.
          </p>
        </div>
      )}
    </div>
  );
}
