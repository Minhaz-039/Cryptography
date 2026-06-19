import {
  ArrowDown,
  ArrowRight,
  Building2,
  EyeOff,
  ShieldCheck,
  User,
} from "lucide-react";
import { useState } from "react";

export default function BlindSignatures() {
  // Setup Authority RSA Keys (Hardcoded to academic prime sizes for clean visualization)
  // p=3, q=11
  const n = 33;
  const e = 3;
  const d = 7;

  // Interactive State
  const [message, setMessage] = useState(5);
  const [blindingFactor, setBlindingFactor] = useState(2); // Random 'r'

  // --- Math Helpers ---
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

  // --- Validation ---
  const isRValid = gcd(blindingFactor, n) === 1;
  const isMValid = message > 0 && message < n;

  // --- Blind Signature Pipeline ---
  // Step 1. Blinding (User): M' = M * r^e mod n
  const rToE = modExp(blindingFactor, e, n);
  const blindedMessage = isMValid && isRValid ? (message * rToE) % n : "ERR";

  // Step 2. Signing (Authority): S' = (M')^d mod n
  const blindedSignature =
    blindedMessage !== "ERR" ? modExp(blindedMessage, d, n) : "ERR";

  // Step 3. Unblinding (User): S = S' * r^-1 mod n
  const rInv = modInverse(blindingFactor, n);
  const finalSignature =
    blindedSignature !== "ERR" ? (blindedSignature * rInv) % n : "ERR";

  // Step 4. Verification (Anyone): S^e mod n == M
  const verificationCheck =
    finalSignature !== "ERR" ? modExp(finalSignature, e, n) : "ERR";
  const isVerified = verificationCheck === message;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#121420] border border-gray-800 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
            <EyeOff className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            Blind Signature Protocol
          </h2>
        </div>
        <p className="text-sm text-gray-400 max-w-3xl">
          Visualizing Chaum's Blind Signature. The User "blinds" a message, the
          Authority signs the blinded data without seeing the original content,
          and the User "unblinds" it to reveal a mathematically valid signature.
        </p>
      </div>

      {/* Main Interactive Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        {/* LEFT COLUMN: USER (ALICE) */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2">
            <User className="w-5 h-5 text-[#00F0FF]" />
            <h3 className="text-lg font-bold text-slate-200">The User</h3>
          </div>

          {/* Phase 1: Preparation */}
          <div className="bg-[#121420] p-5 rounded-xl border border-gray-800 relative">
            <span className="absolute -top-3 -left-3 bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">
              1
            </span>
            <h4 className="text-sm font-semibold text-[#00F0FF] mb-4 uppercase tracking-widest">
              Message Preparation
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                  Original Message (M)
                </label>
                <input
                  type="number"
                  value={message}
                  onChange={(e) => setMessage(parseInt(e.target.value) || 0)}
                  className={`w-full bg-[#090A0F] border ${isMValid ? "border-gray-700 focus:border-[#00F0FF]" : "border-red-500"} text-slate-200 px-4 py-2 rounded-lg outline-none font-mono`}
                />
                {!isMValid && (
                  <p className="text-[10px] text-red-500 mt-1">
                    Must be between 1 and {n - 1}
                  </p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-xs font-semibold text-gray-400 uppercase">
                    Blinding Factor (r): {blindingFactor}
                  </label>
                  {!isRValid && (
                    <span className="text-[10px] text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">
                      Not Coprime to {n}
                    </span>
                  )}
                </div>
                <input
                  type="range"
                  min="2"
                  max={n - 1}
                  value={blindingFactor}
                  onChange={(e) => setBlindingFactor(parseInt(e.target.value))}
                  className={`w-full ${isRValid ? "accent-[#00F0FF]" : "accent-red-500"}`}
                />
              </div>
            </div>
          </div>

          {/* Phase 2: Blinding */}
          <div className="bg-[#090A0F] p-5 rounded-xl border border-[#00F0FF]/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F0FF]/5 rounded-full blur-2xl pointer-events-none" />
            <span className="absolute -top-3 -left-3 bg-[#00F0FF] text-black w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shadow-lg shadow-[#00F0FF]/40">
              2
            </span>

            <h4 className="text-sm font-semibold text-slate-200 mb-2 uppercase tracking-widest">
              Applying Blindness
            </h4>
            <div className="text-center my-4">
              <p className="text-[10px] text-gray-500 mb-1">
                Blinded Message (M')
              </p>
              <p className="text-4xl font-black text-[#00F0FF] font-mono">
                {blindedMessage}
              </p>
            </div>
            <code className="block bg-[#121420] text-gray-400 p-2 rounded border border-gray-800 text-[10px] text-center">
              M' = M × r^e mod n = {message} × {blindingFactor}^{e} mod {n}
            </code>
          </div>

          <div className="flex justify-center text-gray-600 py-2">
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </div>

          {/* Phase 5: Unblinding */}
          <div className="bg-[#121420] p-5 rounded-xl border border-gray-800 relative">
            <span className="absolute -top-3 -left-3 bg-[#00F0FF] text-black w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shadow-lg shadow-[#00F0FF]/40">
              5
            </span>
            <h4 className="text-sm font-semibold text-[#00F0FF] mb-2 uppercase tracking-widest">
              Unblinding the Signature
            </h4>

            <div className="text-center my-4">
              <p className="text-[10px] text-gray-500 mb-1">
                Final Valid Signature (S)
              </p>
              <p className="text-4xl font-black text-emerald-400 font-mono">
                {finalSignature}
              </p>
            </div>
            <code className="block bg-[#090A0F] text-gray-400 p-2 rounded border border-gray-800 text-[10px] text-center">
              S = S' × r⁻¹ mod n ={" "}
              {blindedSignature !== "ERR" ? blindedSignature : "ERR"} × {rInv}{" "}
              mod {n}
            </code>
          </div>
        </div>

        {/* RIGHT COLUMN: AUTHORITY (BANK/SIGNER) */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2">
            <Building2 className="w-5 h-5 text-[#9400FF]" />
            <h3 className="text-lg font-bold text-slate-200">The Authority</h3>
          </div>

          {/* Phase 3: Authority Setup */}
          <div className="bg-[#121420] p-5 rounded-xl border border-gray-800 relative">
            <span className="absolute -top-3 -left-3 bg-[#9400FF]/20 text-[#9400FF] border border-[#9400FF]/50 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">
              3
            </span>
            <h4 className="text-sm font-semibold text-[#9400FF] mb-4 uppercase tracking-widest">
              Authority RSA Keys
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#090A0F] p-2 rounded border border-gray-800">
                <p className="text-[10px] text-gray-500">Modulus (n)</p>
                <p className="text-lg font-mono text-slate-300">{n}</p>
              </div>
              <div className="bg-[#090A0F] p-2 rounded border border-[#00F0FF]/20">
                <p className="text-[10px] text-[#00F0FF]">Public Key (e)</p>
                <p className="text-lg font-mono text-slate-300">{e}</p>
              </div>
              <div className="bg-[#090A0F] p-2 rounded border border-[#9400FF]/20">
                <p className="text-[10px] text-[#9400FF]">Private Key (d)</p>
                <p className="text-lg font-mono text-slate-300">{d}</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-500 text-center mt-3 border-t border-gray-800 pt-2">
              Keys are hardcoded to small values to easily verify the math.
            </p>
          </div>

          <div className="flex justify-center text-gray-600 py-2 lg:rotate-0 rotate-90 lg:-ml-12">
            {/* Visual separator/Arrow for wide screens */}
          </div>

          {/* Phase 4: Blind Signing */}
          <div className="bg-[#090A0F] p-5 rounded-xl border border-[#9400FF]/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#9400FF]/10 rounded-full blur-2xl pointer-events-none" />
            <span className="absolute -top-3 -left-3 bg-[#9400FF] text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shadow-lg shadow-[#9400FF]/40">
              4
            </span>

            <h4 className="text-sm font-semibold text-slate-200 mb-2 uppercase tracking-widest flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-[#9400FF]" /> Blind Signing
            </h4>
            <p className="text-[10px] text-gray-400 mb-4 leading-tight">
              Authority receives M' but has no idea what the original message M
              is. It signs it using its Private Key (d).
            </p>

            <div className="text-center my-4">
              <p className="text-[10px] text-gray-500 mb-1">
                Blinded Signature (S')
              </p>
              <p className="text-4xl font-black text-[#9400FF] font-mono">
                {blindedSignature}
              </p>
            </div>
            <code className="block bg-[#121420] text-gray-400 p-2 rounded border border-gray-800 text-[10px] text-center">
              S' = (M')^d mod n ={" "}
              {blindedMessage !== "ERR" ? blindedMessage : "ERR"}^{d} mod {n}
            </code>
          </div>
        </div>
      </div>

      {/* Phase 6: Final Verification (Full Width) */}
      <div
        className={`mt-4 p-6 rounded-2xl border transition-colors duration-500 relative overflow-hidden ${isVerified && isMValid && isRValid ? "bg-emerald-400/5 border-emerald-400/30" : "bg-red-500/5 border-red-500/30"}`}
      >
        <span className="absolute -top-3 -left-3 bg-slate-800 text-white border border-gray-600 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">
          6
        </span>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-sm font-bold text-slate-200 mb-1 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck
                className={`w-5 h-5 ${isVerified && isMValid && isRValid ? "text-emerald-400" : "text-red-500"}`}
              />
              Public Verification
            </h4>
            <p className="text-xs text-gray-400 max-w-md">
              Anyone can verify the signature using the Authority's Public Key
              (e). If the result equals the original message, the signature is
              mathematically proven!
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">
                Formula Check
              </p>
              <code className="bg-[#090A0F] text-gray-300 p-2 rounded border border-gray-800 text-xs font-mono">
                S^e mod n = {finalSignature !== "ERR" ? finalSignature : "ERR"}^
                {e} mod {n}
              </code>
            </div>
            <div className="flex items-center justify-center w-12 h-12">
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-center min-w-[80px]">
              <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">
                Result
              </p>
              <p
                className={`text-3xl font-black font-mono ${isVerified && isMValid && isRValid ? "text-emerald-400" : "text-red-500"}`}
              >
                {verificationCheck}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
