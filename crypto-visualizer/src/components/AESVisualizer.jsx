import { ArrowRight, Cpu, Key, Layers, Lock, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export default function AESVisualizer() {
  const [plaintext, setPlaintext] = useState("CRYPTOGRAPHY LAB");
  const [secretKey, setSecretKey] = useState("MYSECRETKEY12345");
  const [activeStep, setActiveStep] = useState(0);

  // --- AES Conceptual Matrix Logic ---
  // 1. Initial State (16 bytes -> 4x4 matrix)
  const getInitialMatrix = (text) => {
    const padded = text.padEnd(16, "X").substring(0, 16);
    let matrix = [[], [], [], []];
    for (let i = 0; i < 16; i++) {
      // Create Hex representation
      matrix[Math.floor(i / 4)].push(
        padded.charCodeAt(i).toString(16).padStart(2, "0").toUpperCase(),
      );
    }
    return matrix;
  };

  const initialMatrix = getInitialMatrix(plaintext);

  // 2. SubBytes Mock (Substitute with an arbitrary offset for visual effect)
  const getSubBytesMatrix = (matrix) => {
    return matrix.map((row) =>
      row.map((hex) => {
        const val = parseInt(hex, 16);
        return ((val + 15) % 256).toString(16).padStart(2, "0").toUpperCase();
      }),
    );
  };

  // 3. ShiftRows (Row 0: 0, Row 1: left 1, Row 2: left 2, Row 3: left 3)
  const getShiftRowsMatrix = (matrix) => {
    return [
      [...matrix[0]],
      [matrix[1][1], matrix[1][2], matrix[1][3], matrix[1][0]],
      [matrix[2][2], matrix[2][3], matrix[2][0], matrix[2][1]],
      [matrix[3][3], matrix[3][0], matrix[3][1], matrix[3][2]],
    ];
  };

  // 4. MixColumns Mock (Scramble column values)
  const getMixColumnsMatrix = (matrix) => {
    return matrix.map((row, rIdx) =>
      row.map((hex, cIdx) => {
        const val = parseInt(hex, 16);
        return ((val ^ (cIdx * 10 + rIdx * 5)) % 256)
          .toString(16)
          .padStart(2, "0")
          .toUpperCase();
      }),
    );
  };

  // 5. AddRoundKey Mock (XOR with key hex)
  const keyMatrix = getInitialMatrix(secretKey);
  const getAddRoundKeyMatrix = (matrix) => {
    return matrix.map((row, rIdx) =>
      row.map((hex, cIdx) => {
        const mVal = parseInt(hex, 16);
        const kVal = parseInt(keyMatrix[rIdx][cIdx], 16);
        return (mVal ^ kVal).toString(16).padStart(2, "0").toUpperCase();
      }),
    );
  };

  // State Machine for the Visualizer
  const matrices = [
    initialMatrix,
    getSubBytesMatrix(initialMatrix),
    getShiftRowsMatrix(getSubBytesMatrix(initialMatrix)),
    getMixColumnsMatrix(getShiftRowsMatrix(getSubBytesMatrix(initialMatrix))),
    getAddRoundKeyMatrix(
      getMixColumnsMatrix(getShiftRowsMatrix(getSubBytesMatrix(initialMatrix))),
    ),
  ];

  const currentMatrix = matrices[activeStep];

  const steps = [
    {
      name: "Initial State",
      desc: "Data is loaded into a 4x4 Hex Matrix (16 bytes).",
    },
    {
      name: "SubBytes",
      desc: "Non-linear substitution step where each byte is replaced using an S-box.",
    },
    {
      name: "ShiftRows",
      desc: "Transposition step where the last three rows are shifted cyclically.",
    },
    {
      name: "MixColumns",
      desc: "Mixing operation acting on the columns to provide diffusion.",
    },
    {
      name: "AddRoundKey",
      desc: "Each byte of the state is XORed with a block of the round key.",
    },
  ];

  const handleNextStep = () => {
    setActiveStep((prev) => (prev < 4 ? prev + 1 : 0));
  };

  // Reset steps if input changes
  useEffect(() => {
    setActiveStep(0);
  }, [plaintext, secretKey]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#121420] to-[#0C0D14] border border-gray-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00F0FF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#00F0FF]/10 rounded-lg border border-[#00F0FF]/30">
            <Cpu className="w-5 h-5 text-[#00F0FF]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            AES Block Cipher Visualization
          </h2>
        </div>
        <p className="text-sm text-gray-400 max-w-3xl">
          Visualizing a single round of the Advanced Encryption Standard (AES)
          Substitution-Permutation Network (SPN). Data is broken down into a 4x4
          State Matrix and passed through four distinct mathematical
          transformations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configuration & Controls */}
        <div className="col-span-1 lg:col-span-5 space-y-6">
          <div className="bg-[#121420] p-6 rounded-xl border border-gray-800 shadow-lg">
            <h3 className="text-sm font-bold text-[#00F0FF] mb-4 uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-4 h-4" /> Block Configuration
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                  Plaintext Block (16 Bytes Max)
                </label>
                <input
                  type="text"
                  value={plaintext}
                  maxLength={16}
                  onChange={(e) => setPlaintext(e.target.value.toUpperCase())}
                  className="w-full bg-[#090A0F] border border-gray-700 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#00F0FF] uppercase font-mono tracking-widest transition-colors"
                  placeholder="16 CHARACTERS"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                  Secret Key (Round Key Mock)
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={secretKey}
                    maxLength={16}
                    onChange={(e) => setSecretKey(e.target.value.toUpperCase())}
                    className="w-full bg-[#090A0F] border border-gray-700 text-slate-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#9400FF] uppercase font-mono tracking-widest transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Pipeline Timeline */}
          <div className="bg-[#121420] p-6 rounded-xl border border-gray-800 shadow-lg">
            <h3 className="text-sm font-bold text-slate-200 mb-6 uppercase tracking-widest">
              Encryption Pipeline
            </h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-800 before:to-transparent">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active ${activeStep === idx ? "opacity-100" : "opacity-40 grayscale transition-all"}`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#121420] z-10 font-bold text-xs ${activeStep === idx ? "bg-[#00F0FF] text-black shadow-[0_0_15px_rgba(0,240,255,0.5)]" : "bg-[#090A0F] text-gray-500 border-gray-800"}`}
                  >
                    {idx}
                  </div>

                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-lg border border-gray-800 bg-[#090A0F]">
                    <h4
                      className={`text-xs font-bold uppercase tracking-wider ${activeStep === idx ? "text-[#00F0FF]" : "text-gray-400"}`}
                    >
                      {step.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleNextStep}
              className="w-full mt-6 bg-gradient-to-r from-[#00F0FF]/20 to-[#9400FF]/20 border border-[#00F0FF]/50 text-slate-100 font-bold text-sm py-3 rounded-xl hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all flex items-center justify-center gap-2"
            >
              {activeStep === 4 ? (
                <>
                  <RefreshCw className="w-4 h-4" /> Reset Pipeline
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" /> Execute Next Step
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: The 4x4 State Matrix */}
        <div className="col-span-1 lg:col-span-7 flex flex-col h-full">
          <div className="bg-[#121420] p-8 rounded-xl border border-gray-800 shadow-xl flex-1 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#9400FF]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center mb-8 z-10">
              <h3 className="text-2xl font-black text-slate-100 uppercase tracking-[0.2em]">
                {steps[activeStep].name}
              </h3>
              <p className="text-sm text-[#00F0FF] mt-2 font-mono">
                STATE MATRIX
              </p>
            </div>

            {/* Matrix Rendering */}
            <div className="grid grid-cols-4 gap-3 md:gap-4 p-6 bg-[#090A0F] border border-gray-700 rounded-2xl shadow-2xl z-10 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 to-[#9400FF]/5 rounded-2xl pointer-events-none" />

              {currentMatrix.map((row, rIdx) =>
                row.map((hex, cIdx) => (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`w-14 h-14 md:w-20 md:h-20 flex items-center justify-center text-xl md:text-2xl font-black font-mono rounded-xl border transition-all duration-500
                      ${activeStep > 0 ? "bg-[#121420] border-[#00F0FF]/50 text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.2)]" : "bg-[#0C0D14] border-gray-800 text-slate-300"}
                    `}
                  >
                    {hex}
                  </div>
                )),
              )}
            </div>

            <div className="mt-8 z-10 bg-[#090A0F] px-4 py-2 rounded border border-gray-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-400 font-mono">
                128-BIT BLOCK (16 BYTES)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
