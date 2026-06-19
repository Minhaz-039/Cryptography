import { AlertTriangle, ArrowRightLeft, CheckCircle2, Key } from "lucide-react";
import { useState } from "react";

export default function SymmetricCiphers() {
  const [activeCipher, setActiveCipher] = useState("additive");
  const [plaintext, setPlaintext] = useState("HELLO LAB TEACHER");

  // Keys State
  const [shiftKey, setShiftKey] = useState(3);
  const [multiKey, setMultiKey] = useState(7);
  const [affineKeyA, setAffineKeyA] = useState(5);
  const [affineKeyB, setAffineKeyB] = useState(8);
  const [rails, setRails] = useState(3);

  // Math Helper: Greatest Common Divisor
  const gcd = (a, b) => {
    while (b !== 0) {
      let temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const isCoprime = (key) => gcd(key, 26) === 1;

  // Additive Cipher Logic
  const calculateAdditive = (text, key) => {
    return text.toUpperCase().replace(/[A-Z]/g, (char) => {
      const p = char.charCodeAt(0) - 65;
      const c = (p + key) % 26;
      return String.fromCharCode(c < 0 ? c + 26 + 65 : c + 65);
    });
  };

  // Multiplicative Cipher Logic
  const calculateMultiplicative = (text, key) => {
    if (!isCoprime(key)) return "ERROR: KEY MUST BE COPRIME TO 26";
    return text.toUpperCase().replace(/[A-Z]/g, (char) => {
      const p = char.charCodeAt(0) - 65;
      const c = (p * key) % 26;
      return String.fromCharCode(c + 65);
    });
  };

  // Affine Cipher Logic
  const calculateAffine = (text, a, b) => {
    if (!isCoprime(a)) return "ERROR: KEY 'A' MUST BE COPRIME TO 26";
    return text.toUpperCase().replace(/[A-Z]/g, (char) => {
      const p = char.charCodeAt(0) - 65;
      const c = (p * a + b) % 26;
      return String.fromCharCode(c < 0 ? c + 26 + 65 : c + 65);
    });
  };

  // Transposition (Rail Fence) Logic
  const calculateTransposition = (text, numRails) => {
    const cleanText = text.replace(/[^a-zA-Z]/g, "").toUpperCase();
    if (!cleanText || numRails < 2) return cleanText;

    const fence = Array.from({ length: numRails }, () => []);
    let currentRail = 0;
    let direction = 1;

    for (let char of cleanText) {
      fence[currentRail].push(char);
      currentRail += direction;
      if (currentRail === 0 || currentRail === numRails - 1) {
        direction *= -1;
      }
    }
    return fence.map((rail) => rail.join("")).join("");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cipher Selector Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-[#0C0D14] border border-gray-800 rounded-xl w-fit">
        {["Additive", "Multiplicative", "Affine", "Transposition"].map(
          (cipher) => (
            <button
              key={cipher}
              onClick={() => setActiveCipher(cipher.toLowerCase())}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeCipher === cipher.toLowerCase()
                  ? "bg-[#00F0FF]/10 text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {cipher}
            </button>
          ),
        )}
      </div>

      {/* ADDITIVE CIPHER UI */}
      {activeCipher === "additive" && (
        <div className="p-6 rounded-2xl bg-[#121420] border border-gray-800 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#9400FF]/10 rounded-lg border border-[#9400FF]/30">
              <Key className="w-5 h-5 text-[#9400FF]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">
              Additive Cipher Engine
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Plaintext Input
                </label>
                <input
                  type="text"
                  value={plaintext}
                  onChange={(e) =>
                    setPlaintext(e.target.value.replace(/[^a-zA-Z\s]/g, ""))
                  }
                  className="w-full bg-[#090A0F] border border-gray-700 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#00F0FF] transition-colors uppercase tracking-widest"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Shift Key: {shiftKey}
                </label>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={shiftKey}
                  onChange={(e) => setShiftKey(parseInt(e.target.value))}
                  className="w-full accent-[#00F0FF]"
                />
              </div>
            </div>
            <div className="bg-[#090A0F] p-6 rounded-xl border border-gray-800 flex flex-col justify-center">
              <div className="text-center space-y-4">
                <p className="text-sm font-semibold text-[#9400FF] tracking-widest uppercase">
                  Resulting Ciphertext
                </p>
                <div className="text-3xl font-black tracking-[0.2em] text-[#00F0FF] break-all">
                  {calculateAdditive(plaintext, shiftKey) || "-"}
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-800">
                <p className="text-sm text-gray-400 mb-3 font-medium">
                  Mathematical Formula:
                </p>
                <code className="block bg-[#121420] text-gray-300 p-3 rounded-lg border border-gray-800 text-sm font-mono text-center">
                  C = (P + {shiftKey}) mod 26
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MULTIPLICATIVE CIPHER UI */}
      {activeCipher === "multiplicative" && (
        <div className="p-6 rounded-2xl bg-[#121420] border border-gray-800 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#00F0FF]/10 rounded-lg border border-[#00F0FF]/30">
              <Key className="w-5 h-5 text-[#00F0FF]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">
              Multiplicative Cipher Engine
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Plaintext Input
                </label>
                <input
                  type="text"
                  value={plaintext}
                  onChange={(e) =>
                    setPlaintext(e.target.value.replace(/[^a-zA-Z\s]/g, ""))
                  }
                  className="w-full bg-[#090A0F] border border-gray-700 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#00F0FF] transition-colors uppercase tracking-widest"
                />
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-medium text-gray-400">
                    Multiplier Key: {multiKey}
                  </label>
                  {isCoprime(multiKey) ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                      <CheckCircle2 className="w-3 h-3" /> Valid Coprime
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded">
                      <AlertTriangle className="w-3 h-3" /> Invalid Key
                    </span>
                  )}
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={multiKey}
                  onChange={(e) => setMultiKey(parseInt(e.target.value))}
                  className={`w-full ${isCoprime(multiKey) ? "accent-[#00F0FF]" : "accent-red-500"}`}
                />
              </div>
            </div>
            <div className="bg-[#090A0F] p-6 rounded-xl border border-gray-800 flex flex-col justify-center">
              <div className="text-center space-y-4">
                <p
                  className={`text-sm font-semibold tracking-widest uppercase ${isCoprime(multiKey) ? "text-[#9400FF]" : "text-red-400"}`}
                >
                  Resulting Ciphertext
                </p>
                <div
                  className={`text-3xl font-black tracking-[0.2em] break-all ${isCoprime(multiKey) ? "text-[#00F0FF]" : "text-red-500 text-xl"}`}
                >
                  {calculateMultiplicative(plaintext, multiKey) || "-"}
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-800">
                <p className="text-sm text-gray-400 mb-3 font-medium">
                  Mathematical Formula:
                </p>
                <code className="block bg-[#121420] text-gray-300 p-3 rounded-lg border border-gray-800 text-sm font-mono text-center">
                  C = (P × {multiKey}) mod 26
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AFFINE CIPHER UI */}
      {activeCipher === "affine" && (
        <div className="p-6 rounded-2xl bg-[#121420] border border-gray-800 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-400/10 rounded-lg border border-emerald-400/30">
              <Key className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">
              Affine Cipher Engine
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Plaintext Input
                </label>
                <input
                  type="text"
                  value={plaintext}
                  onChange={(e) =>
                    setPlaintext(e.target.value.replace(/[^a-zA-Z\s]/g, ""))
                  }
                  className="w-full bg-[#090A0F] border border-gray-700 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-400 transition-colors uppercase tracking-widest"
                />
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-medium text-gray-400">
                    Key A (Multiplier): {affineKeyA}
                  </label>
                  {isCoprime(affineKeyA) ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                      <CheckCircle2 className="w-3 h-3" /> Valid Coprime
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded">
                      <AlertTriangle className="w-3 h-3" /> Invalid Key
                    </span>
                  )}
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={affineKeyA}
                  onChange={(e) => setAffineKeyA(parseInt(e.target.value))}
                  className={`w-full ${isCoprime(affineKeyA) ? "accent-emerald-400" : "accent-red-500"}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Key B (Shift): {affineKeyB}
                </label>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={affineKeyB}
                  onChange={(e) => setAffineKeyB(parseInt(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </div>
            </div>
            <div className="bg-[#090A0F] p-6 rounded-xl border border-gray-800 flex flex-col justify-center">
              <div className="text-center space-y-4">
                <p
                  className={`text-sm font-semibold tracking-widest uppercase ${isCoprime(affineKeyA) ? "text-[#9400FF]" : "text-red-400"}`}
                >
                  Resulting Ciphertext
                </p>
                <div
                  className={`text-3xl font-black tracking-[0.2em] break-all ${isCoprime(affineKeyA) ? "text-emerald-400" : "text-red-500 text-xl"}`}
                >
                  {calculateAffine(plaintext, affineKeyA, affineKeyB) || "-"}
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-800">
                <p className="text-sm text-gray-400 mb-3 font-medium">
                  Mathematical Formula:
                </p>
                <code className="block bg-[#121420] text-gray-300 p-3 rounded-lg border border-gray-800 text-sm font-mono text-center">
                  C = (P × {affineKeyA} + {affineKeyB}) mod 26
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRANSPOSITION CIPHER UI */}
      {activeCipher === "transposition" && (
        <div className="p-6 rounded-2xl bg-[#121420] border border-gray-800 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-pink-500/10 rounded-lg border border-pink-500/30">
              <ArrowRightLeft className="w-5 h-5 text-pink-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">
              Transposition Engine (Rail Fence)
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Plaintext Input
                </label>
                <input
                  type="text"
                  value={plaintext}
                  onChange={(e) =>
                    setPlaintext(e.target.value.replace(/[^a-zA-Z\s]/g, ""))
                  }
                  className="w-full bg-[#090A0F] border border-gray-700 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-pink-500 transition-colors uppercase tracking-widest"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Number of Rails (Depth): {rails}
                </label>
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={rails}
                  onChange={(e) => setRails(parseInt(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>
            </div>
            <div className="bg-[#090A0F] p-6 rounded-xl border border-gray-800 flex flex-col justify-center">
              <div className="text-center space-y-4">
                <p className="text-sm font-semibold tracking-widest uppercase text-pink-500">
                  Resulting Ciphertext
                </p>
                <div className="text-3xl font-black tracking-[0.2em] text-slate-100 break-all">
                  {calculateTransposition(plaintext, rails) || "-"}
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-800">
                <p className="text-sm text-gray-400 mb-3 font-medium">
                  Mechanism:
                </p>
                <p className="text-xs text-gray-500">
                  Characters are written diagonally across {rails} parallel
                  "rails", then read linearly row-by-row to create the
                  ciphertext.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
