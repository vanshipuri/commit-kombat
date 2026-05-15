"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skull, Share2 } from "lucide-react";

interface BattleResult {
  p1_class: string;
  p2_class: string;
  p1_roast: string[];
  p2_roast: string[];
  verdict: string;
  winner: string;
  p1_aura: number;
  p2_aura: number;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BattleResult | null>(null);
  const [names, setNames] = useState({ u1: "", u2: "" });
  const [isShaking, setIsShaking] = useState(false);

  const fight = async () => {
    if (!names.u1 || !names.u2) return alert("Enter both usernames!");
    setLoading(true);
    setResult(null);
    setIsShaking(false);

    try {
      const res = await fetch("/api/battle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ u1: names.u1, u2: names.u2 }),
      });
      const data = await res.json();
      
      if (data.error) {
        alert("Battle Error: " + data.error);
      } else {
        setResult(data);
        setIsShaking(true);
        // Play "Finish Him" Sound
        const audio = new Audio('/finish.mp3');
        audio.play().catch(e => console.log("Audio play blocked by browser"));
        // Remove shake after animation finishes
        setTimeout(() => setIsShaking(false), 500);
      }
    } catch (error) {
      alert("The Arena is offline.");
    } finally {
      setLoading(false);
    }
  };

  const shareOnX = () => {
    if (!result) return;
    const text = `🔥 Just witnessed a brutal GitHub roast! ${names.u1} vs ${names.u2}. Winner: ${result.winner}! Check your aura on Commit Kombat.`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <main className={`min-h-screen bg-zinc-950 text-white font-mono p-4 flex flex-col items-center transition-transform ${isShaking ? 'animate-shake' : ''}`}>
      
      {/* HEADER */}
      <motion.div initial={{ y: -50 }} animate={{ y: 0 }} className="text-center mt-10 mb-12">
        <h1 className="text-5xl md:text-8xl font-black italic text-red-600 drop-shadow-[4px_4px_0px_rgba(255,255,255,1)] mb-2 uppercase tracking-tighter">
          COMMIT KOMBAT
        </h1>
        <p className="text-zinc-500 text-xs md:text-base uppercase tracking-[0.3em]">The Ultimate GitHub Roast Battle</p>
      </motion.div>

      {/* INPUTS */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-12 w-full max-w-4xl">
        <input 
          placeholder="User 1" 
          className="w-full bg-black border-4 border-blue-600 p-4 text-xl outline-none focus:bg-zinc-900 transition-all shadow-[4px_4px_0_0_#2563eb]"
          onChange={(e) => setNames({...names, u1: e.target.value})}
        />
        <div className="text-5xl font-black text-yellow-500 italic animate-pulse">VS</div>
        <input 
          placeholder="User 2" 
          className="w-full bg-black border-4 border-red-600 p-4 text-xl outline-none focus:bg-zinc-900 transition-all shadow-[4px_4px_0_0_#dc2626]"
          onChange={(e) => setNames({...names, u2: e.target.value})}
        />
      </div>

      <button 
        onClick={fight}
        disabled={loading}
        className="group relative bg-white text-black px-16 py-6 text-3xl font-black hover:bg-yellow-400 transition-all active:scale-95 disabled:opacity-50 mb-16 shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] uppercase italic"
      >
        {loading ? "EXTRACTING CRINGE..." : "FINISH THEM"}
      </button>

      {/* RESULTS ARENA */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl pb-32">
            
            {/* P1 CARD */}
            <div className={`p-8 bg-zinc-900 border-8 relative transition-all ${result.winner === names.u1 ? 'border-blue-500 aura-glow-blue scale-105 z-10' : 'border-zinc-800 opacity-80'}`}>
              {result.winner === names.u1 && <div className="absolute -top-10 -left-6 bg-blue-500 text-white px-4 py-2 font-black rotate-[-10deg] text-xl">CHAMPION</div>}
              <div className="flex items-center gap-5 mb-6">
                <img src={`https://github.com/${names.u1}.png`} className="w-20 h-20 border-4 border-white shadow-lg" alt="p1" />
                <div>
                  <h2 className="text-3xl font-bold text-blue-400">@{names.u1}</h2>
                  <p className="text-yellow-500 font-bold uppercase tracking-widest text-sm">{result.p1_class}</p>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1 font-bold"><span>AURA</span><span>{result.p1_aura}</span></div>
                <div className="h-6 bg-zinc-800 border-2 border-white overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${result.p1_aura}%` }} className="h-full bg-blue-500" />
                </div>
              </div>
              <div className="space-y-4">
                {result.p1_roast.map((r, i) => <p key={i} className="text-sm leading-relaxed text-zinc-300 border-l-4 border-blue-500 pl-4 italic">"{r}"</p>)}
              </div>
            </div>

            {/* P2 CARD */}
            <div className={`p-8 bg-zinc-900 border-8 relative transition-all ${result.winner === names.u2 ? 'border-red-600 aura-glow-red scale-105 z-10' : 'border-zinc-800 opacity-80'}`}>
              {result.winner === names.u2 && <div className="absolute -top-10 -right-6 bg-red-600 text-white px-4 py-2 font-black rotate-[10deg] text-xl">CHAMPION</div>}
              <div className="flex flex-row-reverse items-center gap-5 mb-6">
                <img src={`https://github.com/${names.u2}.png`} className="w-20 h-20 border-4 border-white shadow-lg" alt="p2" />
                <div className="text-right">
                  <h2 className="text-3xl font-bold text-red-500">@{names.u2}</h2>
                  <p className="text-yellow-500 font-bold uppercase tracking-widest text-sm">{result.p2_class}</p>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1 font-bold"><span>{result.p2_aura}</span><span>AURA</span></div>
                <div className="h-6 bg-zinc-800 border-2 border-white overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${result.p2_aura}%` }} className="h-full bg-red-600 ml-auto" />
                </div>
              </div>
              <div className="space-y-4 text-right">
                {result.p2_roast.map((r, i) => <p key={i} className="text-sm leading-relaxed text-zinc-300 border-r-4 border-red-600 pr-4 italic">"{r}"</p>)}
              </div>
            </div>

            {/* FINAL VERDICT BOX */}
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="col-span-full bg-white text-black p-10 border-8 border-red-600 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-red-600 animate-pulse"></div>
              <Skull className="mx-auto mb-4 w-12 h-12 text-red-600" />
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter italic">The Senior Staff Engineer's Verdict</h3>
              <p className="text-2xl font-bold leading-tight mb-8">"{result.verdict}"</p>
              <button 
                onClick={shareOnX}
                className="flex items-center gap-2 mx-auto bg-black text-white px-8 py-3 font-bold hover:scale-110 transition-transform"
              >
                <Share2 size={20} /> SHARE ON X
              </button>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}