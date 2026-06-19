import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Cpu,
  EyeOff,
  Key,
  Shield,
} from "lucide-react";

export default function SyllabusOverview({ setActiveTab }) {
  const modules = [
    {
      id: "symmetric",
      title: "Symmetric-Key Ciphers",
      icon: Key,
      color: "text-[#00F0FF]",
      bgColor: "bg-[#00F0FF]/10",
      borderColor: "group-hover:border-[#00F0FF]/50",
      shadow: "group-hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]",
      description:
        "Explore classical mathematical encryption techniques relying on a single shared secret key and modular arithmetic.",
      topics: [
        "Additive (Caesar)",
        "Multiplicative",
        "Affine",
        "Transposition",
      ],
    },
    {
      id: "asymmetric",
      title: "Asymmetric Encipherment",
      icon: Shield,
      color: "text-[#9400FF]",
      bgColor: "bg-[#9400FF]/10",
      borderColor: "group-hover:border-[#9400FF]/50",
      shadow: "group-hover:shadow-[0_0_20px_rgba(148,0,255,0.15)]",
      description:
        "Visualize public-key cryptography where separate keys are generated for encryption and decryption.",
      topics: [
        "Prime Generation",
        "RSA Cryptosystem",
        "ElGamal",
        "Discrete Logarithms",
      ],
    },
    {
      id: "blind",
      title: "Blind Signatures",
      icon: EyeOff,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "group-hover:border-indigo-500/50",
      shadow: "group-hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]",
      description:
        "Understand privacy-preserving protocols where an authority signs a message without seeing its contents.",
      topics: [
        "Message Blinding",
        "Authority Signing",
        "Unblinding",
        "Public Verification",
      ],
    },
    {
      id: "aes",
      title: "AES Block Cipher",
      icon: Cpu,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      borderColor: "group-hover:border-pink-500/50",
      shadow: "group-hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]",
      description:
        "Step through a modern Substitution-Permutation Network operating on 128-bit blocks of data.",
      topics: ["State Matrices", "SubBytes", "ShiftRows", "MixColumns"],
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Kerckhoff's Principle - Highlight Card */}
      <div className="relative p-1 rounded-2xl bg-gradient-to-r from-[#00F0FF]/20 via-gray-800 to-[#9400FF]/20 shadow-lg">
        <div className="bg-[#121420] rounded-xl p-6 relative overflow-hidden h-full">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800/50 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start gap-4 relative z-10">
            <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30 shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
                Kerckhoff's Principle
                <span className="text-[10px] uppercase tracking-widest bg-gray-800 text-gray-400 px-2 py-1 rounded">
                  Core Philosophy
                </span>
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-4xl">
                A cryptographic system should be secure even if everything about
                the system, except the key, is public knowledge. This visualizer
                adheres to this principle: all mathematical formulas and
                algorithms are entirely transparent on the screen. The security
                relies entirely on the secrecy of the keys you input.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lab Modules Grid */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-bold text-slate-200 uppercase tracking-widest">
            Available Lab Modules
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className={`group relative bg-[#121420] rounded-2xl p-6 border border-gray-800 transition-all duration-300 ${mod.borderColor} ${mod.shadow} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl ${mod.bgColor}`}>
                      <Icon className={`w-6 h-6 ${mod.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-100">
                      {mod.title}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-400 mb-6 min-h-[40px]">
                    {mod.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {mod.topics.map((topic, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono text-gray-500 bg-[#090A0F] border border-gray-800 px-2 py-1 rounded-md"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab(mod.id)}
                  className={`w-full py-3 rounded-xl border border-gray-800 bg-[#090A0F] text-gray-400 font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 group-hover:bg-[#121420] ${mod.borderColor} group-hover:${mod.color}`}
                >
                  Explore Module <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
