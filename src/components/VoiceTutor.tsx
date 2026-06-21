import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Sparkles, RefreshCw, VolumeX, Flame, Send, Keyboard } from "lucide-react";

interface VoiceTutorProps {
  onEarnReward: (xpGained: number, coinsGained: number) => void;
  activeCompanion?: any;
}

export default function VoiceTutor({ onEarnReward, activeCompanion }: VoiceTutorProps) {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [tutorState, setTutorState] = useState<"idle" | "listening" | "thinking" | "speaking" | "sleeping">("idle");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("Hello! Plug in your microphone and say 'Explain photosynthesis' or any topic. I'm here to tutor you verbally!");
  const [voiceSpeed, setVoiceSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [typedQuery, setTypedQuery] = useState("");

  // Web Speech references
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // 1. Initialize speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setTutorState("listening");
        setTranscript("Listening... speak now!");
      };

      rec.onresult = async (event: any) => {
        const resultText = event.results[0][0].transcript;
        setTranscript(resultText);
        setTutorState("thinking");
        
        // Deliver statement to server for feedback
        try {
          const aiResponse = await getVoiceTutoring(resultText);
          setResponse(aiResponse);
          speakResponse(aiResponse);
        } catch (e) {
          const fallback = "Tutoring service is currently synthesizing, but we hit a glitch. Let me try again!";
          setResponse(fallback);
          speakResponse(fallback);
        }
      };

      rec.onerror = (e: any) => {
        console.error("Speech Recognition Error:", e);
        setTutorState("idle");
        if (e.error === "not-allowed") {
          setTranscript("Access to microphone was denied. Check permissions inside of prompt.");
        } else {
          setTranscript("Didn't hear anything... toggle microphone to try again.");
        }
      };

      rec.onend = () => {
        // Only return to idle if we aren't currently transitioning to another state
        setTutorState((curr) => (curr === "listening" ? "idle" : curr));
      };

      recognitionRef.current = rec;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      stopSpeaking();
    };
  }, []);

  const getVoiceTutoring = async (query: string): Promise<string> => {
    try {
      const response = await fetch("/api/gemini/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: query,
          isVoice: true,
          activeCompanion: activeCompanion,
        }),
      });

      if (!response.ok) {
        throw new Error("Voice service error");
      }

      const data = await response.json();
      return data.text || "I was unable to formulate a conversational tutoring explanation. Try again!";
    } catch (e) {
      return "I might be offline or having difficulty connecting to my AI core, but here's a brief reminder: consistency brings learning mastery!";
    }
  };

  const speakResponse = (text: string) => {
    if (!synthRef.current || isMuted) {
      setTutorState("idle");
      return;
    }

    stopSpeaking();

    // Split text into readable conversational chunks
    const cleanText = text.replace(/[*#_`]/gi, ""); // Clean markdown symbols

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = voiceSpeed;
    utterance.lang = "en-US"; // Guarantee English base language
    
    // Choose a nice clear voice safely with prioritized parenthesized grouping
    const voices = synthRef.current.getVoices() || [];
    const naturalVoice = voices.find(v => 
      v.lang.startsWith("en") && 
      (v.name.includes("Google") || 
       v.name.includes("Natural") || 
       v.name.includes("Samantha") || 
       v.name.includes("Daniel") || 
       v.name.includes("Zira") ||
       v.name.includes("David") ||
       v.name.includes("Mark"))
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      setTutorState("speaking");
    };

    utterance.onend = () => {
      setTutorState("idle");
      onEarnReward(15, 6); // Speech completion reward
    };

    utterance.onerror = () => {
      setTutorState("idle");
    };

    activeUtteranceRef.current = utterance;
    
    // Resume speech synthesis to fix stuck-queue browser bugs
    if (synthRef.current.paused) {
      synthRef.current.resume();
    }
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setTutorState("idle");
  };

  const handleSendTypedQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedQuery.trim()) return;

    const query = typedQuery.trim();
    setTypedQuery("");
    
    stopSpeaking();
    setTranscript(query);
    setTutorState("thinking");

    try {
      const aiResponse = await getVoiceTutoring(query);
      setResponse(aiResponse);
      speakResponse(aiResponse);
    } catch (e) {
      const fallback = "Tutoring service is currently synthesizing, but we hit a glitch. Let me try again!";
      setResponse(fallback);
      speakResponse(fallback);
    }
  };

  const toggleMicSession = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition isn't supported inside this browser. Try Chrome, Brave or Edge.");
      return;
    }

    stopSpeaking();

    if (tutorState === "listening") {
      recognitionRef.current.stop();
      setTutorState("idle");
    } else {
      try {
        setIsSessionActive(true);
        recognitionRef.current.start();
      } catch (e) {
        console.error("Mic start mismatch:", e);
      }
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      speakResponse(response);
    } else {
      setIsMuted(true);
      stopSpeaking();
      setTutorState("idle");
    }
  };

  // Visual orbit settings depending on dynamic states
  const getOrbitStyles = () => {
    switch (tutorState) {
      case "listening":
        return {
          shadow: "shadow-[0_0_50px_rgba(16,185,129,0.3)] border-emerald-500",
          core: "bg-emerald-500 scale-110",
          waves: "border-emerald-400 opacity-60 scale-125 animate-ping",
          subtext: "Microphone Active - Speak clearly...",
        };
      case "thinking":
        return {
          shadow: "shadow-[0_0_50px_rgba(245,158,11,0.3)] border-amber-500",
          core: "bg-amber-500 animate-pulse scale-100",
          waves: "border-amber-400 opacity-30 animate-spin border-dashed",
          subtext: "AI Tutor is formulating your query...",
        };
      case "speaking":
        return {
          shadow: "shadow-[0_0_50px_rgba(99,102,241,0.3)] border-indigo-500",
          core: "bg-indigo-500 scale-105",
          waves: "border-indigo-400 opacity-50 scale-110 duration-200 animate-bounce",
          subtext: "Tutor is lecturing...",
        };
      case "sleeping":
        return {
          shadow: "shadow-[0_0_30px_rgba(239,68,68,0.1)] border-rose-950",
          core: "bg-rose-950 scale-90 opacity-40",
          waves: "border-rose-900 opacity-10",
          subtext: "Voice tutor in snooze mode.",
        };
      case "idle":
      default:
        return {
          shadow: "shadow-[0_0_40px_rgba(168,85,247,0.15)] border-purple-500/50",
          core: "bg-purple-500",
          waves: "border-purple-300 dark:border-purple-800 opacity-40 scale-100",
          subtext: "Ready for conversation.",
        };
    }
  };

  const orbit = getOrbitStyles();
  const equippedCompanion = activeCompanion?.name || "Classic Robo-Buddy";

  return (
    <div id="voice-tutor-workspace" className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-2 min-h-[500px]">
      {/* Visual audio sphere & orbit container */}
      <div className="lg:col-span-2 glass border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-between text-center relative shadow-2xl min-h-[460px]">
        {/* Tutor title bars */}
        <div className="w-full flex items-center justify-between border-b border-white/8 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Speech Classroom</span>
          </div>
          <span className="text-[10px] bg-purple-950/40 border border-purple-500/20 text-purple-300 px-2.5 py-1 rounded-full font-semibold">
             Vocal Companion: {equippedCompanion}
          </span>
        </div>

        {/* Orbit sphere element */}
        <div className="flex-1 flex flex-col items-center justify-center py-6">
          <div className="relative flex items-center justify-center w-52 h-52">
            {/* Pulsing outside outer wave */}
            <div className={`absolute inset-0 rounded-full border-2 transition-all duration-700 ${orbit.waves}`}></div>
            
            {/* Secondary intermediate circle */}
            <div className="absolute inset-4 rounded-full border border-white/5 animate-pulse duration-1000"></div>

            {/* Glowing core sphere */}
            <div
              onClick={toggleMicSession}
              className={`w-28 h-28 rounded-full border-4 flex items-center justify-center cursor-pointer transition-all duration-500 shadow-xl ${orbit.shadow} ${orbit.core}`}
            >
              {tutorState === "listening" ? (
                <Mic className="w-10 h-10 text-white animate-pulse" />
              ) : tutorState === "thinking" ? (
                <RefreshCw className="w-10 h-10 text-white animate-spin" />
              ) : (
                <Volume2 className="w-10 h-10 text-white" />
              )}
            </div>
          </div>

          <div className="mt-8 space-y-1">
            <h3 className="text-base font-bold text-white capitalize text-glow">
              {tutorState === "listening" ? "Listening..." : tutorState === "thinking" ? "Studying prompt..." : tutorState === "speaking" ? "Speaking..." : "Vocal Tutor Idle"}
            </h3>
            <p className="text-xs text-slate-400 font-medium">{orbit.subtext}</p>
          </div>
        </div>

        {/* Vocal action board */}
        <div className="w-full glass rounded-2xl p-4 border border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMicSession}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                tutorState === "listening"
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white"
              }`}
            >
              {tutorState === "listening" ? (
                <>
                  <MicOff className="w-4 h-4" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Talk to Buddy (+15 XP)
                </>
              )}
            </button>

            <button
              onClick={handleToggleMute}
              className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-white/10 transition"
              title={isMuted ? "Unmute vocal synthesis" : "Silence verbal speech synthesis"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Voice Speed:</span>
              <div className="flex items-center gap-1">
                {[0.8, 1.0, 1.3].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setVoiceSpeed(speed)}
                    className={`py-1 px-2.5 text-[10px] font-bold rounded-lg border transition ${
                      voiceSpeed === speed
                        ? "bg-indigo-500/15 border border-indigo-500/30 text-indigo-300"
                        : "border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {speed === 1.0 ? "Normal" : speed === 0.8 ? "Slow" : "Fast"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Speech script logs and diagnostic panel */}
      <div id="verbal-dashboard" className="flex flex-col gap-4">
        {/* Interactive Speech transcript card */}
        <div className="glass border border-white/8 rounded-3xl p-5 shadow-2xl flex flex-col h-full divide-y divide-white/5 space-y-4">
          <div className="text-left space-y-3 pb-3">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Your Speech</span>
            <p className="text-xs font-semibold text-white min-h-[30px] italic">
              {transcript ? `"${transcript}"` : "Say anything to initiate speech tutoring logic..."}
            </p>

            {/* Elegant fall-back keyboard input for IFrame Sandbox environments */}
            <form onSubmit={handleSendTypedQuery} className="relative flex items-center mt-2">
              <input
                type="text"
                value={typedQuery}
                onChange={(e) => setTypedQuery(e.target.value)}
                placeholder="Or type & study here (e.g. Mitosis)..."
                className="w-full bg-slate-950/65 border border-white/10 rounded-xl px-3 py-2 pl-9 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
              />
              <Keyboard className="absolute left-3 w-3.5 h-3.5 text-slate-500" />
              <button
                type="submit"
                disabled={!typedQuery.trim() || tutorState === "thinking"}
                className="absolute right-1.5 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-30"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>

          <div className="text-left pt-4 flex-1 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Buddy's Response</span>
              <p className="text-xs leading-relaxed text-slate-300 min-h-[120px] max-h-[180px] overflow-y-auto">
                {response}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-440 leading-relaxed">
              <FlashTip />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const FlashTip = () => {
  const tips = [
    "Tip: Speed up teaching by setting voice speed to 'Fast' during swift active reviews.",
    "Tip: If transcription fails, speak close to your microphone or check site browser permission locks.",
    "Tip: Say 'Tell me a biology joke' for a lighthearted study intermission!",
    "Tip: Vocalizing complex concepts forces your brain to build chunked memory patterns."
  ];

  const [activeTip, setActiveTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTip((prev) => (prev + 1) % tips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="flex items-start gap-1.5 text-left text-[10px] font-medium text-neutral-400">
      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
      <span>{tips[activeTip]}</span>
    </span>
  );
};
