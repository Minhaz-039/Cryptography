import { Cpu, EyeOff, Key, LayoutGrid, Lock, Shield } from "lucide-react";
import { useState } from "react";
import AsymmetricCiphers from "./components/AsymmetricCiphers";
import SymmetricCiphers from "./components/SymmetricCiphers";

// Temporary structural mock for sections until we populate their logic
const PlaceholderSection = ({ title, description }) => (
  <div className="p-6 rounded-2xl bg-[#121420] border border-gray-800 shadow-xl backdrop-blur-md">
    <h3 className="text-xl font-bold text-[#00F0FF] mb-2">{title}</h3>
    <p className="text-gray-400 text-sm mb-4">{description}</p>
    <div className="p-4 bg-[#090A0F] rounded-lg border border-dashed border-gray-800 text-center text-xs text-gray-500">
      Component visualizer core code will be injected here in the next step.
    </div>
  </div>
);

export default function Cipher() {
  const [activeTab, setActiveTab] = useState("overview");

  const topics = [
    { id: "overview", name: "Syllabus Overview", icon: LayoutGrid },
    { id: "symmetric", name: "Symmetric-Key Ciphers", icon: Key },
    { id: "asymmetric", name: "Asymmetric (RSA & ElGamal)", icon: Shield },
    { id: "blind", name: "Blind Signatures", icon: EyeOff },
    { id: "aes", name: "AES Block Cipher", icon: Cpu },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090A0F] via-[#161224] to-[#090A0F] text-slate-200 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-gradient-to-br from-[#090A0F] via-[#161224] to-[#090A0F] min-h-screen text-white border-r border-gray-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Lock className="w-6 h-6 text-[#00F0FF] animate-pulse" />
            <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-[#00F0FF] to-[#9400FF] bg-clip-text text-transparent">
              CRYPTO-LAB
            </span>
          </div>

          <nav className="space-y-2">
            {topics.map((topic) => {
              const Icon = topic.icon;
              return (
                <button
                  key={topic.id}
                  onClick={() => setActiveTab(topic.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
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

        <div className="mt-8 pt-4 border-t border-gray-800 text-xs text-gray-500">
          Built for Lab Evaluation • Serverless
        </div>
      </aside>

      {/* Main Showcase Panel */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8 overflow-y-auto">
        {/* Modern Interactive Hero Block */}
        <header className="relative p-8 rounded-3xl overflow-hidden bg-gradient-to-br from-[#121420] to-[#0C0D14] border border-gray-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#9400FF]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00F0FF]/5 rounded-full blur-3xl pointer-events-none" />

          <span className="text-xs font-bold tracking-widest text-[#9400FF] uppercase border border-[#9400FF]/30 px-3 py-1 rounded-full bg-[#9400FF]/5">
            Academic Lab Sandbox
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-100 tracking-tight mt-4 mb-2">
            Interactive Cryptography Exploration
          </h1>
          <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
            A real-time cryptographic environment built strictly to visually
            demonstrate the core properties, mathematical operations, and design
            vulnerabilities outlined in the exam curriculum.
          </p>
        </header>

        {/* Dynamic Section Injection based on state selection */}
        <section className="mt-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PlaceholderSection
                title="Kerckhoff's Principle"
                description="Demonstrating security through key secrecy, not algorithmic obscurity."
              />
              <PlaceholderSection
                title="Classical Mathematical Ciphers"
                description="Additive, Multiplicative, and Affine transformation pipelines."
              />
            </div>
          )}
          {activeTab === "symmetric" && <SymmetricCiphers />}
          {activeTab === "asymmetric" && <AsymmetricCiphers />}
          {activeTab === "blind" && (
            <PlaceholderSection
              title="Blind Signature Protocols"
              description="Step-by-step blind token request signing cycles."
            />
          )}
          {activeTab === "aes" && (
            <PlaceholderSection
              title="Advanced Encryption Standard"
              description="Visual matrix mapping breakdown of the standard SPN network."
            />
          )}
        </section>
      </main>
    </div>
  );
}
