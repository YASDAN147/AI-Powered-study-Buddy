import { Badge, ShopItem, UserStats } from "../types";
import { Sparkles, Award, ShoppingBag, CheckCircle, Lock, Coins, ShieldAlert, Heart } from "lucide-react";

interface RewardsStoreProps {
  stats: UserStats;
  onEquipItem: (id: string) => void;
  onUnlockItem: (id: string, cost: number) => void;
  xpNeededForNextLevel: number;
}

export default function RewardsStore({ stats, onEquipItem, onUnlockItem, xpNeededForNextLevel }: RewardsStoreProps) {
  
  const handlePurchase = (item: ShopItem) => {
    if (stats.coins < item.cost) {
      alert("⚠️ Not enough Study Coins! Complete summaries, quizzes, or active recall cards to earn more coins.");
      return;
    }
    onUnlockItem(item.id, item.cost);
  };

  const currentLevelProgress = Math.min(Math.round((stats.xp % xpNeededForNextLevel) / xpNeededForNextLevel * 100), 100);

  return (
    <div id="rewards-workspace" className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-2 min-h-[500px]">
      
      {/* Level stats & Badges display column */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        {/* User Level progression card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-5 rounded-3xl text-left shadow-lg">
          <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">Scholar Progression</span>
          
          <div className="flex items-baseline gap-2 mt-4">
            <h2 className="text-3xl font-black">Level {stats.level}</h2>
            <span className="text-xs font-bold opacity-80">Rank: Senior Academic</span>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>{stats.xp % xpNeededForNextLevel} / {xpNeededForNextLevel} XP</span>
              <span>{currentLevelProgress}%</span>
            </div>
            {/* progress bar */}
            <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white transition-all duration-500" style={{ width: `${currentLevelProgress}%` }} />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-300 animate-pulse" /> Wallet Balance:
            </span>
            <span className="font-extrabold text-base text-amber-300">{stats.coins} Study Coins</span>
          </div>
        </div>

        {/* List of achievements/badges */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-5 rounded-3xl shadow-sm text-left flex-1 flex flex-col">
          <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 mb-3.5 flex items-center gap-1.5">
            <Award className="text-indigo-500 w-4.5 h-4.5" /> Academic Milestones
          </h3>

          <div className="flex-1 overflow-y-auto space-y-3.5 max-h-[290px]">
            {stats.badges.map((b) => (
              <div 
                key={b.id} 
                className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-300 ${
                  b.unlocked 
                    ? "bg-slate-50/50 border-neutral-100 dark:bg-neutral-800/20 dark:border-neutral-800" 
                    : "opacity-40 border-dashed border-neutral-200 dark:border-neutral-800"
                }`}
              >
                <span className={`p-2 rounded-xl text-xs flex items-center justify-center shrink-0 ${
                  b.unlocked ? "bg-indigo-500 text-white" : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800"
                }`}>
                  <Award className="w-4 h-4" />
                </span>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate">{b.name}</h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5 leading-normal">{b.description}</p>
                </div>

                {b.unlocked ? (
                  <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 font-bold text-emerald-600 dark:text-emerald-400 py-0.5 px-2 rounded-full">Gained</span>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customizable Companions & Themes shop column */}
      <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-5 shadow-sm text-left flex flex-col h-full min-h-[460px]">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3.5 mb-4">
          <div className="flex items-center gap-1.5">
            <ShoppingBag className="text-purple-500" />
            <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">Study Companion & Aesthetics Shop</h3>
          </div>
          <span className="text-[10px] bg-amber-50 dark:bg-amber-950 px-2 py-1 rounded-full font-semibold text-amber-600 dark:text-amber-400">
            Earn Coins per Quiz & Active-Recall Card Mastery!
          </span>
        </div>

        {/* Companion Customizer list */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[360px] p-0.5">
          {stats.shopItems.map((item) => (
            <div 
              key={item.id} 
              className={`border rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 relative group h-[160px] ${
                item.isEquipped 
                  ? "bg-indigo-50/20 border-indigo-400 dark:bg-indigo-950/20" 
                  : "border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 bg-neutral-50/10 dark:bg-neutral-900/10"
              }`}
            >
              {/* Core info */}
              <div className="text-left flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-neutral-800 flex items-center justify-center text-indigo-500 text-lg font-bold shrink-0 overflow-hidden">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : item.type === "companion" ? (
                    item.value === "acolyte-elrond" ? "🦉" :
                    item.value === "acolyte-vortex" ? "🦅" :
                    item.value === "acolyte-orion" ? "🐺" :
                    item.value === "acolyte-aurora" ? "🦊" :
                    item.value === "acolyte-glitch" ? "🐉" :
                    item.value === "acolyte-specter" ? "🐈‍⬛" :
                    item.value === "acolyte-spark" ? "🦎" :
                    item.value === "wise-owl" ? "🦉" :
                    item.value === "zen-cat" ? "🐱" :
                    item.value === "chibi-dragon" ? "🐲" : "🤖"
                  ) : (
                    item.value === "theme-forest" ? "🌲" :
                    item.value === "theme-immersive" ? "🌌" : "🎨"
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-1">
                    {item.name}
                    {item.isEquipped && <span className="text-[8px] uppercase bg-indigo-500 text-white px-2 py-0.2 rounded-full font-black">Active</span>}
                  </h4>
                  <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed mt-1">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-3 mt-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-neutral-400 block">
                  {item.type === "theme" ? "Aesthetic Preset" : "AI Mascot shape"}
                </span>

                {item.unlocked ? (
                  item.isEquipped ? (
                    <button 
                      disabled
                      className="px-3.5 py-1.5 bg-neutral-100 text-neutral-400 text-[10px] font-bold rounded-lg cursor-not-allowed dark:bg-neutral-800"
                    >
                      Equipped
                    </button>
                  ) : (
                    <button
                      onClick={() => onEquipItem(item.id)}
                      className="px-3.5 py-1.5 bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 text-[10px] font-bold rounded-lg hover:bg-indigo-500 hover:text-white transition"
                    >
                      Equip Customizer
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => handlePurchase(item)}
                    className="px-4 py-1.5 bg-amber-500 text-white hover:bg-amber-600 text-[10px] font-bold rounded-lg flex items-center gap-1 transition"
                  >
                    <span>Buy for {item.cost}</span>
                    <Coins className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
