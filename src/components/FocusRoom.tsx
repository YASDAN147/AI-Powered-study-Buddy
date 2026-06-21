import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, Sparkles, Plus, Check, Trash2, ShieldAlert, Award, Coffee, Headphones, Compass, Sparkle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FocusRoomProps {
  onEarnReward: (xpGained: number, coinsGained: number) => void;
  companions: any;
}

interface FocusTask {
  id: string;
  text: string;
  completed: boolean;
}

type SoundType = "none" | "alpha" | "theta" | "zen" | "ocean";

export default function FocusRoom({ onEarnReward, companions }: FocusRoomProps) {
  // Timer states
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<"focus" | "break" | "long_break">("focus");
  const [accumulatedMinutes, setAccumulatedMinutes] = useState(0);

  // Soundscape states
  const [selectedSound, setSelectedSound] = useState<SoundType>("none");
  const [volume, setVolume] = useState(0.4);

  // Interactive local task checklist states
  const [tasks, setTasks] = useState<FocusTask[]>([
    { id: "ft-1", text: "Complete one active-recall flashcard deck", completed: false },
    { id: "ft-2", text: "Query RAG bot on tricky paragraphs", completed: false }
  ]);
  const [newTaskText, setNewTaskText] = useState("");

  // Web Audio Context reference hooks
  const audioCtxRef = useRef<AudioContext | null>(null);
  const volumeNodeRef = useRef<GainNode | null>(null);
  const nodesPoolRef = useRef<any[]>([]); // holds oscillators/effects to cease on transition
  const intervalRef = useRef<any>(null);

  const equippedCompanion = companions?.equippedCompanion || "Robo-Companion";

  // Cleanup synthesizer on component unmount
  useEffect(() => {
    return () => {
      stopAllSynthNodes();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Timer Core logic loop
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer expired!
            handleCycleCompletion();
          } else {
            setMinutes((m) => m - 1);
            setSeconds(59);
            // Award incremental small XP (1 XP per minute clocked) safely outside any state updater function context
            setTimeout(() => {
              onEarnReward(1, 0); // Mini incremental XP
            }, 0);
          }
        } else {
          setSeconds((s) => s - 1);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, minutes, seconds]);

  // Adjust volume node on slider change
  useEffect(() => {
    if (volumeNodeRef.current && audioCtxRef.current) {
      volumeNodeRef.current.gain.linearRampToValueAtTime(volume, audioCtxRef.current.currentTime + 0.1);
    }
  }, [volume]);

  // Restart sound when sound type changes
  useEffect(() => {
    if (isActive) {
      startSynthesizer();
    } else {
      stopAllSynthNodes();
    }
  }, [selectedSound, isActive]);

  // Standard preset switcher
  const handleSetPreset = (type: "focus" | "break" | "long_break") => {
    setIsActive(false);
    setSessionType(type);
    if (type === "focus") {
      setMinutes(25);
    } else if (type === "break") {
      setMinutes(5);
    } else {
      setMinutes(15);
    }
    setSeconds(0);
  };

  // Cycle Completion handler
  const handleCycleCompletion = () => {
    setIsActive(false);
    stopAllSynthNodes();

    if (sessionType === "focus") {
      // Award high focus jackpot!
      onEarnReward(50, 20); // +50 XP, +20 Coins
      alert(`🎉 Exceptional stamina, master scholar! You finished your 25-minute focus period and earned +50 XP and +20 Coins! Take a soothing 5-minute break now.`);
      handleSetPreset("break");
    } else {
      alert(`⏱️ Rest period finished! Let's resume active recall study focus.`);
      handleSetPreset("focus");
    }
  };

  // Safe Audio context initializer
  const initAudioCtx = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
      
      const vol = audioCtxRef.current.createGain();
      vol.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
      vol.connect(audioCtxRef.current.destination);
      volumeNodeRef.current = vol;
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  // Stop active modular oscillators
  const stopAllSynthNodes = () => {
    nodesPoolRef.current.forEach((n) => {
      try {
        n.stop();
      } catch (e) {}
    });
    nodesPoolRef.current = [];
  };

  // Synthesize ambient sounds in real-time
  const startSynthesizer = () => {
    stopAllSynthNodes();
    if (selectedSound === "none") return;

    try {
      initAudioCtx();
      const ctx = audioCtxRef.current!;
      const destination = volumeNodeRef.current!;

      if (selectedSound === "alpha") {
        // Binaural beats: 150Hz left speaker, 160Hz right speaker (creating exactly 10Hz Alpha flow in brains)
        const panLeft = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        if (panLeft) panLeft.pan.setValueAtTime(-1, ctx.currentTime);

        const panRight = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        if (panRight) panRight.pan.setValueAtTime(1, ctx.currentTime);

        // Oscillator Left
        const oscL = ctx.createOscillator();
        oscL.type = "sine";
        oscL.frequency.setValueAtTime(150, ctx.currentTime);
        if (panLeft) {
          oscL.connect(panLeft);
          panLeft.connect(destination);
        } else {
          oscL.connect(destination);
        }

        // Oscillator Right
        const oscR = ctx.createOscillator();
        oscR.type = "sine";
        oscR.frequency.setValueAtTime(160, ctx.currentTime);
        if (panRight) {
          oscR.connect(panRight);
          panRight.connect(destination);
        } else {
          oscR.connect(destination);
        }

        oscL.start();
        oscR.start();
        nodesPoolRef.current.push(oscL, oscR);

      } else if (selectedSound === "theta") {
        // Binaural beats: 140Hz left speaker, 146Hz right speaker (producing exactly 6Hz Theta deep consolidation)
        const panLeft = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        if (panLeft) panLeft.pan.setValueAtTime(-0.8, ctx.currentTime);

        const panRight = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        if (panRight) panRight.pan.setValueAtTime(0.8, ctx.currentTime);

        const oscL = ctx.createOscillator();
        oscL.type = "sine";
        oscL.frequency.setValueAtTime(140, ctx.currentTime);
        if (panLeft) {
          oscL.connect(panLeft);
          panLeft.connect(destination);
        } else {
          oscL.connect(destination);
        }

        const oscR = ctx.createOscillator();
        oscR.type = "sine";
        oscR.frequency.setValueAtTime(146, ctx.currentTime);
        if (panRight) {
          oscR.connect(panRight);
          panRight.connect(destination);
        } else {
          oscR.connect(destination);
        }

        oscL.start();
        oscR.start();
        nodesPoolRef.current.push(oscL, oscR);

      } else if (selectedSound === "zen") {
        // Celestial Chord: Multi-layered, retro-harmonized drone
        const frequencies = [110.00, 165.00, 220.00, 330.00]; // A2, E3, A3, E4 chord
        frequencies.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
          
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          
          if (panner) {
            // alternate channels
            panner.pan.setValueAtTime(idx % 2 === 0 ? -0.5 : 0.5, ctx.currentTime);
            osc.connect(panner);
            panner.connect(destination);
          } else {
            osc.connect(destination);
          }

          // Gentle low frequency modulation on detune
          osc.detune.setValueAtTime(idx * 2, ctx.currentTime);
          osc.start();
          nodesPoolRef.current.push(osc);
        });

      } else if (selectedSound === "ocean") {
        // Organic filter sea breeze simulator - generate noise buffer!
        const bufferSize = ctx.sampleRate * 2.5; // 2.5 seconds
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        // Populate white noise
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        // Custom low-pass filter
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(400, ctx.currentTime);
        filter.Q.setValueAtTime(1.5, ctx.currentTime);

        noiseNode.connect(filter);
        filter.connect(destination);

        // Pulses wave LFO cutoff to modulate sea-breeze waves (slow sweep between 180Hz and 580Hz)
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.08, ctx.currentTime); // very slow 12-second sweeps
        
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(220, ctx.currentTime); // scan range

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency); // hook directly to cutoff!

        noiseNode.start();
        lfo.start();
        nodesPoolRef.current.push(noiseNode, lfo);
      }
    } catch (err) {
      console.warn("Unable to synthesis background acoustics:", err);
    }
  };

  // Add Task to local checklist
  const handleAddTask = (e: any) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const task: FocusTask = {
      id: `ft-${Date.now()}`,
      text: newTaskText.trim(),
      completed: false
    };
    setTasks([...tasks, task]);
    setNewTaskText("");
  };

  // Complete task
  const toggleTaskCompleted = (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const nextState = !t.completed;
        if (nextState) {
          // reward direct mini success chime
          onEarnReward(5, 2); 
        }
        return { ...t, completed: nextState };
      }
      return t;
    });
    setTasks(updated);
  };

  // Delete Task
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Styling helper
  const getProgressPercent = () => {
    const totalSecs = sessionType === "focus" ? 25 * 60 : sessionType === "break" ? 5 * 60 : 15 * 60;
    const currentSecs = minutes * 60 + seconds;
    return Math.min(100 - (currentSecs / totalSecs) * 100, 100);
  };

  return (
    <div id="focus-classroom-arena" className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-2 min-h-[500px]">
      
      {/* Visual countdown & Sound simulator panel */}
      <div className="lg:col-span-2 glass border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-between text-center relative shadow-2xl min-h-[460px]">
        {/* Banner header info */}
        <div className="w-full flex items-center justify-between border-b border-white/8 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deep Study Sanctuary</span>
          </div>
          <span className="text-[10px] bg-rose-950/40 border border-rose-500/20 text-rose-300 px-2.5 py-1 rounded-full font-semibold">
            Status: {sessionType === "focus" ? "💪 Intense Focus Loop" : "☕ Mind Resting Break"}
          </span>
        </div>

        {/* Circular Live Wave Progress */}
        <div className="flex-1 flex flex-col items-center justify-center py-4 relative w-full">
          
          {/* Outer visual wave auras */}
          <div className="relative flex items-center justify-center w-56 h-56">
            
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="112"
                cy="112"
                r="92"
                className="stroke-slate-800"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="112"
                cy="112"
                r="92"
                className={`transition-all duration-1000 ${
                  sessionType === "focus" ? "stroke-rose-500" : "stroke-indigo-400"
                }`}
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 92}
                strokeDashoffset={2 * Math.PI * 92 * (1 - getProgressPercent() / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Glowing countdown figures */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-extrabold text-white tracking-widest font-mono text-glow">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1.5">
                {sessionType === "focus" ? "FOCUS PHASE" : "REST SHIFT"}
              </span>
            </div>

            {/* Real-time background pulsing aura particles */}
            {isActive && (
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.15, 0.35, 0.15],
                }}
                transition={{
                  duration: selectedSound === "alpha" ? 3 : selectedSound === "theta" ? 5 : 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`absolute inset-0 -z-10 rounded-full blur-xl ${
                  sessionType === "focus" ? "bg-rose-500/20" : "bg-indigo-500/20"
                }`}
              />
            )}
          </div>

          {/* Quick preset selector buttons */}
          <div className="flex items-center gap-1.5 mt-6 bg-slate-950/60 p-1.5 border border-white/5 rounded-2xl">
            <button
              onClick={() => handleSetPreset("focus")}
              className={`p-2 px-4 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition leading-none ${
                sessionType === "focus"
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Focus Phase (25m)
            </button>
            <button
              onClick={() => handleSetPreset("break")}
              className={`p-2 px-4 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition leading-none ${
                sessionType === "break"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              Short Break (5m)
            </button>
            <button
              onClick={() => handleSetPreset("long_break")}
              className={`p-2 px-4 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition leading-none ${
                sessionType === "long_break"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              Long Rest (15m)
            </button>
          </div>
        </div>

        {/* Audio control deck & play commands */}
        <div className="w-full glass rounded-3xl p-4 border border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`p-3 px-6 rounded-2xl text-xs font-black flex items-center gap-2 transition transform active:translate-y-0 hover:-translate-y-0.5 shadow-md ${
                isActive
                  ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                  : "bg-gradient-to-r from-emerald-500 to-indigo-600 text-white hover:from-emerald-600 hover:to-indigo-700 shadow-emerald-500/10"
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-4.5 h-4.5 fill-current" />
                  TEMPORIZE FOCUS
                </>
              ) : (
                <>
                  <Play className="w-4.5 h-4.5 fill-current" />
                  COMMENCE FOCUS LOOP
                </>
              )}
            </button>

            <button
              onClick={() => handleSetPreset(sessionType)}
              className="p-3 bg-white/5 border border-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition"
              title="Reset current interval"
            >
              <RotateCcw className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Sound wave selecter */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase">Acoustic Mode:</span>
              <div className="flex flex-wrap gap-1">
                {[
                  { value: "none", label: "Mute" },
                  { value: "alpha", label: "Alpha Waves" },
                  { value: "theta", label: "Theta Waves" },
                  { value: "zen", label: "Zen Celestial" },
                  { value: "ocean", label: "Ocean Waves" }
                ].map((snd) => (
                  <button
                    key={snd.value}
                    onClick={() => {
                      if (!isActive && snd.value !== "none") {
                        setIsActive(true); // Auto commencement
                      }
                      setSelectedSound(snd.value as any);
                    }}
                    className={`py-1 px-2.5 text-[10px] font-bold rounded-lg border transition ${
                      selectedSound === snd.value
                        ? "bg-rose-500/15 border-rose-500/40 text-rose-300"
                        : "border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {snd.label}
                  </button>
                ))}
              </div>
            </div>

            {selectedSound !== "none" && (
              <div className="flex items-center gap-2 min-w-[100px]">
                <Volume2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task target checklist & informational card */}
      <div id="focus-targets" className="flex flex-col gap-4 text-left">
        {/* Interactive focus target form card */}
        <div className="glass border border-white/8 rounded-3xl p-5 shadow-2xl flex flex-col h-full justify-between gap-4">
          
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-extrabold text-rose-400 uppercase tracking-widest block mb-1">Interactive Focus Scope</span>
              <h3 className="text-sm font-black text-white">Your Milestone Targets</h3>
            </div>

            {/* Task list container */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 italic">
                  No active targets setup. Write down your next study task below!
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-2.5 transition ${
                      task.completed
                        ? "bg-emerald-500/5 border-emerald-500/20 text-neutral-500 line-through"
                        : "bg-white/5 border-white/5 text-slate-200"
                    }`}
                  >
                    <button
                      onClick={() => toggleTaskCompleted(task.id)}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition ${
                        task.completed
                          ? "bg-emerald-500 border-transparent text-slate-950"
                          : "border-white/20 hover:border-white/50"
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <span className="text-xs font-semibold leading-relaxed flex-1 text-left min-w-0 truncate">
                      {task.text}
                    </span>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* New target form */}
          <div className="space-y-3 pt-3 border-t border-white/5">
            <form onSubmit={handleAddTask} className="flex gap-1.5">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Declare a micro study target..."
                className="flex-1 bg-white/5 border border-white/5 focus:bg-slate-950 text-white placeholder-slate-500 text-xs font-medium p-2.5 rounded-xl focus:border-rose-500 focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="p-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="p-3 bg-gradient-to-br from-indigo-500/5 to-rose-500/5 border border-indigo-500/10 rounded-2xl flex items-start gap-1.5 mt-2">
              <Compass className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-[10px] leading-relaxed text-slate-300">
                <span className="font-extrabold text-white">Acolyte Assistant Guidance:</span>
                <p className="mt-0.5 text-neutral-400">
                  {equippedCompanion === "acolyte-elrond"
                    ? "🦉 \"Elrond: Direct your gaze forward. My starlight glasses are calibrated perfectly. Solve those goals, and I will record your progress in the scroll of AI Wisdom!\""
                    : equippedCompanion === "acolyte-vortex"
                    ? "🦅 \"Vortex: Supersonic HUD online. Clear these milestones with high-intensity speed focus. We are rising above!\""
                    : equippedCompanion === "acolyte-orion"
                    ? "🐺 \"Orion: Tactical blue lasers mapping your studies. Stay fully locked on target. Distractions zeroed!\""
                    : equippedCompanion === "acolyte-aurora"
                    ? "🦊 \"Aurora: Twilight stardust shields operational. Your cognitive flow state is reaching peak performance. Be proud of your brilliant mind!\""
                    : equippedCompanion === "acolyte-glitch"
                    ? "🐉 \"Glitch: Tiny fire puff! *Blinks amber googles* Focus on the timer, and I will perform a beautiful cyber-laser victory dance for you!\""
                    : equippedCompanion === "acolyte-specter"
                    ? "🐈‍⬛ \"Specter: Silent shadow sweep complete. Red eye-visor scanning for any focus errors. Achieve absolute concentration supreme!\""
                    : equippedCompanion === "acolyte-spark"
                    ? "🦎 \"Spark: Sub-aqua bubble helmet locked-in. Ready the neural retrieval nodes to catalog your study achievements!\""
                    : equippedCompanion === "wise-owl"
                    ? "🦉 \"Owl: Focus your intellect. Complete a target in this Pomodoro cycle, and I'll record +5 XP in your cognitive registry.\""
                    : equippedCompanion === "zen-cat"
                    ? "🐱 \"Cat: Mew... Complete these checkmarks so we can take a slow, cozy kitten sleep during the 5m Rest phase.\""
                    : equippedCompanion === "chibi-dragon"
                    ? "🐲 \"Dragon: Light up those tasks with study fire! Complete them for extra glowing gems!\""
                    : "🤖 \"Core Companion: Focus timer is running. Maintain clean workspace parameters for optimal retrieval augmented efficiency.\""}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
