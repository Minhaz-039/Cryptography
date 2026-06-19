import { Cpu, EyeOff, Key, LayoutGrid, Lock, Shield } from "lucide-react";
import { useState } from "react";

// Import your cipher components here
import AESVisualizer from "./components/AESVisualizer";
import AsymmetricCiphers from "./components/AsymmetricCiphers";
import BlindSignatures from "./components/BlindSignatures";
import SyllabusOverview from "./components/SyllubusOverview";
import SymmetricCiphers from "./components/SymmetricCiphers";

export default function Cipher() {
  const [activeTab, setActiveTab] = useState("overview");

  const topics = [
    { id: "overview", name: "Overview", icon: LayoutGrid },
    { id: "symmetric", name: "Symmetric", icon: Key },
    { id: "asymmetric", name: "Asymmetric", icon: Shield },
    { id: "blind", name: "Blind Sigs", icon: EyeOff },
    { id: "aes", name: "AES Block", icon: Cpu },
  ];

  return (
    // We changed md:flex-row to flex-col so the navbar stays on top
    <div className="min-h-screen bg-[#090A0F] text-slate-200 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="w-full bg-[#0C0D14]/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-center md:justify-start">
            <Lock className="w-6 h-6 text-[#00F0FF] animate-pulse" />
            <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-[#00F0FF] to-[#9400FF] bg-clip-text text-transparent">
              CRYPTO-LAB
            </span>
          </div>

          {/* Nav Links - Horizontal Scroll on Mobile, Flex Row on PC */}
          <nav className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {topics.map((topic) => {
              const Icon = topic.icon;
              return (
                <button
                  key={topic.id}
                  onClick={() => setActiveTab(topic.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm shrink-0 ${
                    activeTab === topic.id
                      ? "bg-gradient-to-r from-[#00F0FF]/10 to-[#9400FF]/10 border border-[#00F0FF]/30 text-[#00F0FF]"
                      : "text-gray-400 hover:bg-gray-800/30 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {topic.name}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Showcase Panel */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Dynamic Section Injection */}
        <section className="mt-2 md:mt-6">
          {activeTab === "overview" && (
            <SyllabusOverview setActiveTab={setActiveTab} />
          )}
          {activeTab === "symmetric" && <SymmetricCiphers />}
          {activeTab === "asymmetric" && <AsymmetricCiphers />}
          {activeTab === "blind" && <BlindSignatures />}
          {activeTab === "aes" && <AESVisualizer />}
        </section>
      </main>
    </div>
  );
}
