import { Hash, Lock, LockOpen, Shield } from "lucide-react";
import { useState } from "react";

export default function AsymmetricCiphers() {
  const [activeCipher, setActiveCipher] = useState("rsa");

  // RSA State
  const [p, setP] = useState(11);
  const [q, setQ] = useState(13);
  const [message, setMessage] = useState(7);

  // ElGamal State
  const [elP, setElP] = useState(23);
  const [elX, setElX] = useState(6); // Private Key x
  const [elK, setElK] = useState(15); // Random integer k
  const [elMessage, setElMessage] = useState(10);

  // Math Helpers
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

  const modInverse = (a, m) => {
    let m0 = m,
      y = 0,
      x = 1;
    if (m === 1) return 0;
    while (a > 1) {
      let qVal = Math.floor(a / m);
      let t = m;
      m = a % m;
      a = t;
      t = y;
      y = x - qVal * y;
      x = t;
    }
    if (x < 0) x += m0;
    return x;
  };

  const modExp = (base, exp, mod) => {
    let res = 1;
    base = base % mod;
    while (exp > 0) {
      if (exp % 2 === 1) res = (res * base) % mod;
      exp = Math.floor(exp / 2);
      base = (base * base) % mod;
    }
    return res;
  };

  // --- RSA Calculations ---
  const n = p * q;
  const phi = (p - 1) * (q - 1);

  let e = 2;
  while (e < phi) {
    if (gcd(e, phi) === 1) break;
    e++;
  }

  const d = modInverse(e, phi);
  const isValidMessage = message < n;
  const ciphertext = isValidMessage ? modExp(message, e, n) : "ERROR";
  const decryptedText = isValidMessage ? modExp(ciphertext, d, n) : "ERROR";

  // --- ElGamal Calculations ---
  // Helper to find a primitive root (Generator 'g') for prime 'p'
  const getPrimitiveRoot = (primeNum) => {
    for (let g = 2; g < primeNum; g++) {
      let powers = new Set();
      for (let i = 1; i < primeNum; i++) powers.add(modExp(g, i, primeNum));
      if (powers.size === primeNum - 1) return g;
    }
    return 2; // Fallback
  };

  const elG = getPrimitiveRoot(elP);

  // Ensure x and k stay within valid bounds (1 to p-2) when p changes
  const safeElX = elX >= elP - 1 ? elP - 2 : elX;
  const safeElK = elK >= elP - 1 ? elP - 2 : elK;

  // Key Gen
  const elY = modExp(elG, safeElX, elP);

  // Encryption
  const isElMessageValid = elMessage < elP;
  const c1 = modExp(elG, safeElK, elP);
  const elSharedSecretEnc = modExp(elY, safeElK, elP);
  const c2 = isElMessageValid ? (elMessage * elSharedSecretEnc) % elP : "ERR";

  // Decryption
  const elSharedSecretDec = modExp(c1, safeElX, elP);
  const elSharedSecretInv = modInverse(elSharedSecretDec, elP);
  const elDecrypted = isElMessageValid ? (c2 * elSharedSecretInv) % elP : "ERR";

  return (
    <div className="flex flex-col gap-6">
      {/* Cipher Selector Tabs */}
      <div className="flex gap-2 p-1 bg-[#0C0D14] border border-gray-800 rounded-xl w-fit">
        {["RSA", "ElGamal"].map((cipher) => (
          <button
            key={cipher}
            onClick={() => setActiveCipher(cipher.toLowerCase())}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeCipher === cipher.toLowerCase()
                ? "bg-[#9400FF]/10 text-[#9400FF] shadow-[0_0_15px_rgba(148,0,255,0.1)]"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {cipher}
          </button>
        ))}
      </div>

      {/* RSA UI */}
      {activeCipher === "rsa" && (
        <div className="p-6 rounded-2xl bg-[#121420] border border-gray-800 shadow-xl space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#9400FF]/10 rounded-lg border border-[#9400FF]/30">
              <Shield className="w-5 h-5 text-[#9400FF]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">
              RSA Cryptosystem Visualizer
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Step 1: Prime Generation */}
            <div className="bg-[#090A0F] p-5 rounded-xl border border-gray-800 space-y-4">
              <h3 className="text-sm font-semibold text-[#00F0FF] uppercase tracking-widest flex items-center gap-2">
                <Hash className="w-4 h-4" /> 1. Prime Selection
              </h3>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Prime p
                </label>
                <select
                  value={p}
                  onChange={(e) => setP(Number(e.target.value))}
                  className="w-full bg-[#121420] border border-gray-700 rounded-lg p-2 text-slate-200 outline-none focus:border-[#9400FF]"
                >
                  {[3, 5, 7, 11, 13, 17, 19, 23].map((num) => (
                    <option key={`p-${num}`} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Prime q
                </label>
                <select
                  value={q}
                  onChange={(e) => setQ(Number(e.target.value))}
                  className="w-full bg-[#121420] border border-gray-700 rounded-lg p-2 text-slate-200 outline-none focus:border-[#9400FF]"
                >
                  {[3, 5, 7, 11, 13, 17, 19, 23].map((num) => (
                    <option key={`q-${num}`} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 2: Key Generation Variables */}
            <div className="bg-[#090A0F] p-5 rounded-xl border border-gray-800 space-y-3 col-span-1 lg:col-span-2">
              <h3 className="text-sm font-semibold text-[#00F0FF] uppercase tracking-widest flex items-center gap-2">
                <LockOpen className="w-4 h-4" /> 2. System Variables & Keys
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#121420] p-3 rounded-lg border border-gray-800">
                  <p className="text-xs text-gray-400">Modulus (n = p × q)</p>
                  <p className="text-xl font-mono text-slate-200">{n}</p>
                </div>
                <div className="bg-[#121420] p-3 rounded-lg border border-gray-800">
                  <p className="text-xs text-gray-400">
                    Totient (φ(n) = (p-1)(q-1))
                  </p>
                  <p className="text-xl font-mono text-slate-200">{phi}</p>
                </div>
                <div className="bg-emerald-400/10 p-3 rounded-lg border border-emerald-400/30">
                  <p className="text-xs text-emerald-400 font-semibold">
                    Public Key (e)
                  </p>
                  <p className="text-xl font-mono text-emerald-300">{e}</p>
                  <p className="text-[10px] text-emerald-500 mt-1">
                    Coprime to φ(n)
                  </p>
                </div>
                <div className="bg-pink-500/10 p-3 rounded-lg border border-pink-500/30">
                  <p className="text-xs text-pink-400 font-semibold">
                    Private Key (d)
                  </p>
                  <p className="text-xl font-mono text-pink-300">{d}</p>
                  <p className="text-[10px] text-pink-500 mt-1">
                    (d × e) mod φ(n) = 1
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Encryption & Decryption */}
          <div className="bg-[#090A0F] p-5 rounded-xl border border-gray-800 space-y-6">
            <h3 className="text-sm font-semibold text-[#00F0FF] uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-4 h-4" /> 3. Encryption / Decryption Pipeline
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase">
                  Numeric Message (P)
                </label>
                <input
                  type="number"
                  value={message}
                  onChange={(e) => setMessage(parseInt(e.target.value) || 0)}
                  className={`w-full bg-[#121420] border ${isValidMessage ? "border-gray-700" : "border-red-500"} text-slate-200 px-4 py-3 rounded-xl focus:outline-none font-mono text-center text-xl`}
                />
                {!isValidMessage && (
                  <p className="text-xs text-red-500 text-center">
                    Message must be &lt; n ({n})
                  </p>
                )}
              </div>

              <div className="bg-[#121420] p-4 rounded-xl border border-gray-800 text-center">
                <p className="text-xs text-emerald-400 mb-2 uppercase tracking-widest font-semibold">
                  Ciphertext (C)
                </p>
                <p className="text-3xl font-black text-slate-200 font-mono mb-2">
                  {ciphertext}
                </p>
                <code className="text-[10px] text-gray-500 bg-[#090A0F] px-2 py-1 rounded border border-gray-800">
                  C = {message}^{e} mod {n}
                </code>
              </div>

              <div className="bg-[#121420] p-4 rounded-xl border border-gray-800 text-center">
                <p className="text-xs text-pink-400 mb-2 uppercase tracking-widest font-semibold">
                  Decrypted (P)
                </p>
                <p className="text-3xl font-black text-slate-200 font-mono mb-2">
                  {decryptedText}
                </p>
                <code className="text-[10px] text-gray-500 bg-[#090A0F] px-2 py-1 rounded border border-gray-800">
                  P = {ciphertext !== "ERROR" ? ciphertext : "C"}^{d} mod {n}
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ELGAMAL UI */}
      {activeCipher === "elgamal" && (
        <div className="p-6 rounded-2xl bg-[#121420] border border-gray-800 shadow-xl space-y-8 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00F0FF]/10 rounded-lg border border-[#00F0FF]/30">
              <Shield className="w-5 h-5 text-[#00F0FF]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">
              ElGamal Cryptosystem Visualizer
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Step 1: Domain Parameters */}
            <div className="bg-[#090A0F] p-5 rounded-xl border border-gray-800 space-y-4">
              <h3 className="text-sm font-semibold text-[#00F0FF] uppercase tracking-widest flex items-center gap-2">
                <Hash className="w-4 h-4" /> 1. Domain Parameters
              </h3>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Prime Field (p)
                </label>
                <select
                  value={elP}
                  onChange={(e) => setElP(Number(e.target.value))}
                  className="w-full bg-[#121420] border border-gray-700 rounded-lg p-2 text-slate-200 outline-none focus:border-[#00F0FF]"
                >
                  {[11, 13, 17, 19, 23, 29, 31, 37].map((num) => (
                    <option key={`elp-${num}`} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-[#121420] p-3 rounded-lg border border-gray-800">
                <p className="text-xs text-gray-400 mb-1">
                  Generator (g) - Auto Calculated
                </p>
                <p className="text-xl font-mono text-slate-200">{elG}</p>
                <p className="text-[10px] text-gray-500 mt-1">
                  Primitive root modulo {elP}
                </p>
              </div>
            </div>

            {/* Step 2: Key Generation */}
            <div className="bg-[#090A0F] p-5 rounded-xl border border-gray-800 space-y-3 col-span-1 lg:col-span-2">
              <h3 className="text-sm font-semibold text-[#00F0FF] uppercase tracking-widest flex items-center gap-2">
                <LockOpen className="w-4 h-4" /> 2. Key Generation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                <div className="bg-cyan-400/10 p-4 rounded-lg border border-cyan-400/30 flex flex-col justify-center">
                  <label className="block text-xs text-cyan-400 font-semibold mb-2">
                    Private Key (x): {safeElX}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max={elP - 2}
                    value={safeElX}
                    onChange={(e) => setElX(parseInt(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <p className="text-[10px] text-cyan-500 mt-2 text-center">
                    Secret integer (1 &lt; x &lt; {elP - 1})
                  </p>
                </div>

                <div className="bg-amber-400/10 p-4 rounded-lg border border-amber-400/30 flex flex-col justify-center items-center text-center">
                  <p className="text-xs text-amber-400 font-semibold">
                    Public Key Component (y)
                  </p>
                  <p className="text-3xl font-mono text-amber-300 my-2">
                    {elY}
                  </p>
                  <p className="text-[10px] text-amber-500">
                    y = {elG}^{safeElX} mod {elP}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Encryption & Decryption */}
          <div className="bg-[#090A0F] p-5 rounded-xl border border-gray-800 space-y-6">
            <h3 className="text-sm font-semibold text-[#00F0FF] uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-4 h-4" /> 3. Encryption / Decryption Pipeline
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Inputs */}
              <div className="col-span-1 lg:col-span-3 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                    Message (m)
                  </label>
                  <input
                    type="number"
                    value={elMessage}
                    onChange={(e) =>
                      setElMessage(parseInt(e.target.value) || 0)
                    }
                    className={`w-full bg-[#121420] border ${isElMessageValid ? "border-gray-700" : "border-red-500"} text-slate-200 px-4 py-3 rounded-xl focus:outline-none font-mono text-center text-xl`}
                  />
                  {!isElMessageValid && (
                    <p className="text-xs text-red-500 mt-1">
                      Must be &lt; {elP}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                    Random (k): {safeElK}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max={elP - 2}
                    value={safeElK}
                    onChange={(e) => setElK(parseInt(e.target.value))}
                    className="w-full accent-[#00F0FF] mt-2"
                  />
                </div>
              </div>

              {/* Ciphertext Output */}
              <div className="col-span-1 lg:col-span-5 bg-[#121420] p-4 rounded-xl border border-gray-800 text-center h-full flex flex-col justify-center">
                <p className="text-xs text-amber-400 mb-2 uppercase tracking-widest font-semibold">
                  Ciphertext Pair (c₁, c₂)
                </p>
                <div className="flex justify-center items-center gap-4 text-3xl font-black text-slate-200 font-mono mb-4">
                  <span>({c1},</span>
                  <span>{c2})</span>
                </div>
                <div className="flex flex-col gap-1 text-[10px] text-gray-500">
                  <code className="bg-[#090A0F] px-2 py-1 rounded border border-gray-800">
                    c₁ = g^k = {elG}^{safeElK} mod {elP}
                  </code>
                  <code className="bg-[#090A0F] px-2 py-1 rounded border border-gray-800">
                    c₂ = m × y^k = {elMessage} × {elY}^{safeElK} mod {elP}
                  </code>
                </div>
              </div>

              {/* Decryption Output */}
              <div className="col-span-1 lg:col-span-4 bg-[#121420] p-4 rounded-xl border border-gray-800 text-center h-full flex flex-col justify-center">
                <p className="text-xs text-cyan-400 mb-2 uppercase tracking-widest font-semibold">
                  Decrypted (m)
                </p>
                <p className="text-3xl font-black text-slate-200 font-mono mb-4">
                  {elDecrypted}
                </p>
                <div className="flex flex-col gap-1 text-[10px] text-gray-500">
                  <code className="bg-[#090A0F] px-2 py-1 rounded border border-gray-800">
                    s = c₁^x = {c1}^{safeElX} mod {elP}
                  </code>
                  <code className="bg-[#090A0F] px-2 py-1 rounded border border-gray-800">
                    m = c₂ × s⁻¹ mod {elP}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
