import { useState } from "react";
import { StudyNote, StudySession, UserStats } from "../types";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LabelList, AreaChart, Area, CartesianGrid } from "recharts";
import { Calendar, Award, Flame, Hourglass, HelpCircle, FileText, ChevronRight, Activity, Zap, RefreshCw, Sparkles } from "lucide-react";

interface AnalyticsProps {
  stats: UserStats;
  notes: StudyNote[];
}

export default function Analytics({ stats, notes }: AnalyticsProps) {
  // Spaced repetition simulation states
  const [recalls, setRecalls] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState("Python Language Scope");

  // Calculate standard Ebbinghaus Memory Decay curve values (R = e^-(t/S))
  // where S is memory strength. Each recall increases S compoundingly.
  const decayData = Array.from({ length: 11 }).map((_, day) => {
    const memoryStrength = 1.6 + (recalls * 2.8);
    const retentionPct = Math.round(100 * Math.exp(-day / memoryStrength));
    return {
      day: `Day ${day}`,
      "Retention Pct": Math.max(retentionPct, 15), // decay floor
      "Recall Boundary": 60, // standard minimum retrieval threshold
    };
  });

  // Aggregate study sessions by subject
  const subjects = ["Computer Science", "Biology", "History", "Physics", "Literature", "Chemistry"];
  
  // Custom mock data for daily study hours of current week
  const studyDaysMinutes = [
    { name: "Mon", minutes: 45 },
    { name: "Tue", minutes: 30 },
    { name: "Wed", minutes: 60 },
    { name: "Thu", minutes: 20 },
    { name: "Fri", minutes: 75 },
    { name: "Sat", minutes: 90 },
    { name: "Sun", minutes: stats.sessionsHistory.length > 0 ? 50 : 0 }
  ];

  // Subject distribution
  const subjectDistribution = subjects.map((sub, idx) => {
    // Number of notes under this subject
    const noteCount = notes.filter((n) => n.subject === sub).length * 20; // weight
    const quizCount = stats.sessionsHistory.filter((s) => s.type === "quiz").length * 15;
    const value = Math.max(10, noteCount + quizCount + (idx * 5)); // prevent total 0 for nice charts
    return {
      name: sub,
      value
    };
  });

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#a855f7", "#ec4899", "#14b8a6"];

  return (
    <div id="analytics-panel" className="grid grid-cols-1 xl:grid-cols-3 gap-6 p-2 min-h-[500px]">
      
      {/* Diagnostics grid */}
      <div className="xl:col-span-2 flex flex-col gap-6">
        {/* Horizontal quick summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-4 rounded-3xl text-left shadow-sm flex items-center gap-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-2xl">
              <Hourglass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-neutral-400">Study Minutes</span>
              <h3 className="text-base font-black text-neutral-800 dark:text-neutral-100 mt-0.5">{stats.totalStudyTimeMinutes} min</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-4 rounded-3xl text-left shadow-sm flex items-center gap-3">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-2xl">
              <Flame className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-neutral-400">Core Streak</span>
              <h3 className="text-base font-black text-neutral-800 dark:text-neutral-100 mt-0.5">{stats.streak} Days</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-4 rounded-3xl text-left shadow-sm flex items-center gap-3">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-500 rounded-2xl">
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-neutral-400">Total Badges</span>
              <h3 className="text-base font-black text-neutral-800 dark:text-neutral-100 mt-0.5">
                {stats.badges.filter(b => b.unlocked).length} Unlocked
              </h3>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-4 rounded-3xl text-left shadow-sm flex items-center gap-3">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-500 rounded-2xl">
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-neutral-400">Student Tier</span>
              <h3 className="text-sm font-black text-neutral-800 dark:text-neutral-100 mt-1">Level {stats.level} Scholar</h3>
            </div>
          </div>
        </div>

        {/* Weekly hour interactive charts */}
         <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-5 rounded-3xl shadow-sm text-left flex flex-col xl:h-[320px]">
          <div>
            <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest block mb-0.5">Focus Patterns</span>
            <h4 className="text-base font-bold text-neutral-800 dark:text-neutral-100 mb-4">Weekly Practice Timeline</h4>
          </div>

          <div className="flex-1 w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyDaysMinutes} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} label={{ value: 'Minutes spent', angle: -90, position: 'insideLeft', style: { fill: '#afb5be', fontSize: 10, fontWeight: 600 } }} />
                <Tooltip 
                  contentStyle={{ background: "#262626", border: "none", borderRadius: "12px", fontSize: "11px", color: "#fff" }}
                  cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
                />
                <Bar dataKey="minutes" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ebbinghaus Cognitive Memory Decay Curve interactive forecasting tool */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-5 rounded-3xl shadow-sm text-left flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest block mb-0.5">Cognitive Performance Forecaster</span>
              <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">Spaced Repetition Memory Decay Simulator</h4>
            </div>
            
            <div className="flex items-center gap-1.5 self-start">
              <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-500 font-bold py-1 px-2.5 rounded-lg border border-indigo-500/10">
                Recall Practice Count: {recalls}
              </span>
            </div>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed">
            See Ebbinghaus' exponential forgetting curve prediction for <span className="text-indigo-400 font-bold">{selectedTopic}</span>. Click active-recall simulator below to trigger review consolidation, reinforcing memory half-life above the 60% retrieval threshold.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Input Selection control */}
            <div className="md:col-span-1 flex flex-col gap-2 bg-neutral-50 dark:bg-neutral-850 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800">
              <span className="text-[9px] font-bold text-neutral-400 uppercase">Targeting Subject:</span>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 font-bold text-xs p-2 rounded-xl border border-neutral-150 dark:border-neutral-850 focus:outline-none"
              >
                <option value="Python Language Scope">Python Language Scope</option>
                <option value="Advanced Computer Science">Advanced CS Architectures</option>
                <option value="Literature & Poetic Devices">Literature & Poetheory</option>
                <option value="Physics: Photons & Quantum">Physics: Quantum States</option>
                <option value="History: Medieval Dynasties">History: Medieval Dynasties</option>
              </select>

              <div className="mt-2 space-y-2">
                <button
                  onClick={() => setRecalls((r) => r + 1)}
                  className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 active:translate-y-0 text-white font-extrabold text-[10px] tracking-wider uppercase rounded-xl shadow-md transition flex items-center justify-center gap-1"
                >
                  <Zap className="w-3 h-3 fill-current animate-bounce" />
                  Simulate Recall (+Recall)
                </button>
                <button
                  onClick={() => setRecalls(0)}
                  className="w-full py-1.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 font-bold text-[10px] tracking-wider uppercase rounded-xl transition flex items-center justify-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset Curve Decay
                </button>
              </div>
            </div>

            {/* Recharts Area Chart displaying retention decay */}
            <div className="md:col-span-2 h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={decayData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#9ca3af" }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#9ca3af" }} />
                  <Tooltip contentStyle={{ background: "#171717", border: "none", color: "#fff", fontSize: "10px", borderRadius: "8px" }} />
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <Area type="monotone" dataKey="Retention Pct" stroke="#6366f1" fillOpacity={1} fill="url(#colorRetention)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Recall Boundary" stroke="#ef4444" strokeDasharray="5 5" fill="none" strokeWidth={1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Right subject distribution & vertical timelines */}
      <div className="flex flex-col gap-6">
        {/* Course content weight breakdown chart */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-5 rounded-3xl shadow-sm text-left flex flex-col h-[230px]">
          <div>
            <span className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest block mb-0.5">Subject Breakdown</span>
            <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 mb-2">Cognitive Topic Mastery</h4>
          </div>

          <div className="flex-1 flex items-center justify-between shrink-0">
            {/* rechart pie chart */}
            <div className="w-[120px] h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectDistribution}
                    innerRadius={36}
                    outerRadius={50}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {subjectDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 pl-4 space-y-1.5 overflow-y-auto max-h-[140px]">
              {subjectDistribution.map((sub, index) => (
                <div key={sub.name} className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="truncate max-w-[100px]">{sub.name}</span>
                  </span>
                  <span className="font-bold text-neutral-700 dark:text-neutral-200">{sub.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Study History list logs */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-5 rounded-3xl shadow-sm text-left flex flex-col flex-1 max-h-[220px]">
          <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 mb-3 block">Activity Feed History</h4>
          <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[160px]">
            {stats.sessionsHistory.length === 0 ? (
              <p className="text-xs text-neutral-400 italic text-center py-8">Complete flashcards or quiz modules to generate history timeline events.</p>
            ) : (
              stats.sessionsHistory.map((sess) => (
                <div key={sess.id} className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-800/20 border border-neutral-100 dark:border-neutral-800 rounded-2xl text-xs">
                  <div className="flex items-center gap-2 text-left">
                    <span className="p-1 bg-indigo-50 dark:bg-indigo-950 rounded text-indigo-500">
                      {sess.type === "quiz" ? (
                        <HelpCircle className="w-3.5 h-3.5" />
                      ) : (
                        <FileText className="w-3.5 h-3.5" />
                      )}
                    </span>
                    <div>
                      <h5 className="font-bold text-neutral-700 dark:text-neutral-200 capitalize">{sess.type.replace("_", " ")} Session</h5>
                      <span className="text-[10px] text-neutral-400">{sess.date}</span>
                    </div>
                  </div>
                  <span className="font-bold text-indigo-500">+{sess.durationMinutes}m duration</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
