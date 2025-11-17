// app/mood-buddy/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Vapi from "@vapi-ai/web";

const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "";

type Mode = "roast" | "console" | "chitchat" | "rizz";

function getAssistantConfig(mode: Mode) {
  const baseSystemPrompt = `
You are "Mood Buddy", a chaotic but caring AI friend.
Talk like a real human, not a corporate bot.
Keep replies SHORT: 1–3 sentences max.
Use casual, funny, slightly unfiltered language, but stay safe and respectful.

NEVER:
- Be racist, sexist, homophobic, or attack identity.
- Comment on body or looks in a negative way.
- Give medical or therapy advice.
- Encourage self-harm, suicide, or illegal stuff.

If user says things like "I want to die", "I wanna kill myself", or similar:
- Say you're sorry they're feeling that bad.
- Say you’re just an AI and can’t handle emergencies.
- Tell them to reach out to a trusted person, helpline, or local emergency services.
- Don’t give instructions or details about self-harm.

MODES:
1) ROAST MODE:
   - Dark, savage roast but like a close friend. Bully their HABITS only.
2) CONSOLE ME MODE:
   - Soft, warm, supportive.
3) CHITCHAT MODE:
   - Chill small talk.
4) RIZZ MODE:
   - Confident, smooth, playful, but respectful.
`;

  let modeInstructions = "";
  let firstMessage = "";

  switch (mode) {
    case "roast":
      modeInstructions = `Current mode: ROAST MODE. Be extra savage about their habits, then end with a tiny bit of support.`;
      firstMessage =
        "Roast mode on 🔥 Tell me what dumb thing you did today so I can judge you respectfully.";
      break;
    case "console":
      modeInstructions = `Current mode: CONSOLE ME MODE. Be soft, calm, and comforting.`;
      firstMessage =
        "You sound low. 🫂 Tell me what’s been messing with your mood lately.";
      break;
    case "chitchat":
      modeInstructions = `Current mode: CHITCHAT MODE. Just vibe and talk.`;
      firstMessage =
        "Aight, no therapy, no drama. Just vibes 😌 What’s going on in your life today?";
      break;
    case "rizz":
      modeInstructions = `Current mode: RIZZ MODE. Be smooth, funny, and respectful.`;
      firstMessage =
        "Rizz mode activated 😏 What kind of main-character energy are we giving today?";
      break;
  }

  return {
    model: {
      provider: "openai",
      model: "gpt-4o",
      temperature: 0.9,
      messages: [
        {
          role: "system" as const,
          content: baseSystemPrompt + "\n" + modeInstructions,
        },
      ],
    },
    voice: {
      provider: "azure",
      voiceId: "en-US-JennyNeural",
    },
    clientMessages: [],
    serverMessages: [],
    name: "Mood Buddy",
    firstMessage,
  };
}

/** Core Mood Buddy UI + Vapi logic */
function MoodBuddyCore() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("Ready for session");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [mode, setMode] = useState<Mode>("roast");

  const vapiRef = useRef<Vapi | null>(null);
  const isCallActiveRef = useRef(isCallActive);

  useEffect(() => {
    isCallActiveRef.current = isCallActive;
  }, [isCallActive]);

  useEffect(() => {
    if (!publicKey) {
      setErrorMessage(
        "Vapi public key missing. Set NEXT_PUBLIC_VAPI_PUBLIC_KEY in your env."
      );
      return;
    }

    if (!vapiRef.current) {
      vapiRef.current = new Vapi(publicKey);
      console.log("Vapi instance initialized.");
    }

    const vapi = vapiRef.current;

    const handleCallStart = () => {
      setIsCallActive(true);
      setIsLoading(false);
      setStatus("Session started");
      setErrorMessage(null);
    };

    const handleCallEnd = () => {
      setIsCallActive(false);
      setIsLoading(false);
      setStatus("Session ended");
    };

    const handleSpeechStart = () => {
      setStatus("Mood Buddy speaking");
    };

    const handleSpeechEnd = () => {
      setIsCallActive((current) => {
        if (current) setStatus("Listening to you...");
        return current;
      });
    };

    const handleVolumeLevel = (volume: number) => {
      setVolumeLevel(volume);
    };

    const handleError = (e: any) => {
      setIsLoading(false);

      const raw = e?.message || e;
      const rawStr =
        typeof raw === "string" ? raw : JSON.stringify(raw || {});

      if (
        rawStr.includes("Meeting has ended") ||
        rawStr.includes('"type":"ejected"')
      ) {
        console.log("Vapi: meeting ended (not a real error):", rawStr);
        setIsCallActive(false);
        setStatus("Session ended");
        return;
      }

      console.error("Vapi REAL error:", rawStr);
      setErrorMessage(
        "Something went wrong with the call. Please try again."
      );
      setStatus("Error during session");
    };

    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("volume-level", handleVolumeLevel);
    vapi.on("error", handleError);

    return () => {
      if (vapiRef.current) {
        vapiRef.current.off("call-start", handleCallStart);
        vapiRef.current.off("call-end", handleCallEnd);
        vapiRef.current.off("speech-start", handleSpeechStart);
        vapiRef.current.off("speech-end", handleSpeechEnd);
        vapiRef.current.off("volume-level", handleVolumeLevel);
        vapiRef.current.off("error", handleError);

        if (isCallActiveRef.current) {
          vapiRef.current.stop();
        }
      }
    };
  }, []);

  const handleStartCall = async () => {
    if (!vapiRef.current) {
      setErrorMessage("Vapi not initialized.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setStatus("Starting session...");

    try {
      const assistantConfig = getAssistantConfig(mode);

      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (micError: any) {
        setErrorMessage(
          `Mic access needed: ${micError?.message || "Permission denied."}`
        );
        setIsLoading(false);
        setStatus("Permission denied");
        return;
      }

      // TS fix: shape is correct, cast to any for start()
      const call = await vapiRef.current.start(assistantConfig as any);

      if (!call) {
        setErrorMessage("Failed to start session: no call object.");
        setIsLoading(false);
        setStatus("Ready for session");
      }
    } catch (error: any) {
      setIsLoading(false);
      setStatus("Ready for session");
      setErrorMessage(
        `Failed to start session: ${error?.message || "Unknown error."}`
      );
    }
  };

  const handleStopCall = () => {
    if (!vapiRef.current) return;
    setIsLoading(true);
    setStatus("Ending session...");
    vapiRef.current.stop();
  };

  const handleToggleMute = () => {
    if (!vapiRef.current) return;
    const currentlyMuted = vapiRef.current.isMuted();
    vapiRef.current.setMuted(!currentlyMuted);
    setIsMuted(!currentlyMuted);
    setStatus(`Microphone: ${!currentlyMuted ? "Muted" : "Unmuted"}`);
  };

  const handleSendBackgroundMessage = () => {
    if (!vapiRef.current || !isCallActive) {
      setErrorMessage("Session not active to guide.");
      return;
    }

    let content = "";

    if (mode === "roast") {
      content =
        "Give them one more short, savage roast about their habits, then add 1 supportive line.";
    } else if (mode === "console") {
      content =
        "Ask how they feel now in one short question, then suggest one tiny kind thing they can do for themselves.";
    } else if (mode === "chitchat") {
      content =
        "Switch topic to something fun like music, food, or hobbies and keep it light.";
    } else if (mode === "rizz") {
      content =
        "Drop one smooth but respectful compliment about their vibe or ambitions, then ask a playful follow-up question.";
    }

    vapiRef.current.send({
      type: "add-message",
      message: {
        role: "system",
        content,
      },
    });
  };

  const handleSayGoodbye = () => {
    if (!vapiRef.current || !isCallActive) {
      setErrorMessage("Session not active to say goodbye.");
      return;
    }
    vapiRef.current.say(
      "Alright, I’m logging off, but you better go be a slightly better version of yourself now. Byeee.",
      true
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950/85 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.8)] p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white text-sm">
              🎧
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                Mood Buddy
              </p>
              <p className="text-[11px] text-slate-300">
                Voice session in your browser
              </p>
            </div>
          </div>
          <span className="hidden sm:inline text-[11px] text-slate-500">
            {status}
          </span>
        </div>

        {/* Avatar + title */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-xl border-2 border-slate-900">
            <svg
              className="w-11 h-11 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 12a1 1 0 01-1 1H4a1 1 0 01-1-1v-1a4 4 0 014-4h10a4 4 0 014 4v1z"
              ></path>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-50">
              Mood Buddy Voice Bot
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Pick a mode, start the call, and talk.
            </p>
          </div>
        </div>

        {/* Modes */}
        <div className="space-y-2">
          <p className="text-[11px] text-slate-400 font-medium">
            Choose your vibe
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode("roast")}
              disabled={isCallActive || isLoading}
              className={`py-2.5 rounded-lg text-xs font-medium border transition ${
                mode === "roast"
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-slate-900 text-slate-200 border-slate-700 hover:bg-red-500/20 hover:border-red-500/60"
              }`}
            >
              🔥 Roast
            </button>
            <button
              type="button"
              onClick={() => setMode("console")}
              disabled={isCallActive || isLoading}
              className={`py-2.5 rounded-lg text-xs font-medium border transition ${
                mode === "console"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-slate-900 text-slate-200 border-slate-700 hover:bg-blue-500/20 hover:border-blue-500/60"
              }`}
            >
              🫂 Console
            </button>
            <button
              type="button"
              onClick={() => setMode("chitchat")}
              disabled={isCallActive || isLoading}
              className={`py-2.5 rounded-lg text-xs font-medium border transition ${
                mode === "chitchat"
                  ? "bg-purple-500 text-white border-purple-500"
                  : "bg-slate-900 text-slate-200 border-slate-700 hover:bg-purple-500/20 hover:border-purple-500/60"
              }`}
            >
              💬 ChitChat
            </button>
            <button
              type="button"
              onClick={() => setMode("rizz")}
              disabled={isCallActive || isLoading}
              className={`py-2.5 rounded-lg text-xs font-medium border transition ${
                mode === "rizz"
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "bg-slate-900 text-slate-200 border-slate-700 hover:bg-emerald-500/20 hover:border-emerald-500/60"
              }`}
            >
              😏 Rizz
            </button>
          </div>
        </div>

        {/* Main controls */}
        <div className="flex flex-col gap-2">
          {!isCallActive ? (
            <button
              onClick={handleStartCall}
              disabled={isLoading || !publicKey}
              className={`w-full rounded-xl py-3 text-sm font-medium transition ${
                isLoading || !publicKey
                  ? "bg-slate-700 text-slate-300 cursor-not-allowed"
                  : "bg-indigo-500 text-white hover:bg-indigo-400 shadow-md shadow-indigo-500/30"
              }`}
            >
              {isLoading ? "Starting session..." : "Start Session"}
            </button>
          ) : (
            <button
              onClick={handleStopCall}
              disabled={isLoading}
              className={`w-full rounded-xl py-3 text-sm font-medium transition ${
                isLoading
                  ? "bg-red-400 text-white cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-400 shadow-md"
              }`}
            >
              End Session
            </button>
          )}

          {isCallActive && (
            <button
              onClick={handleToggleMute}
              className={`w-full rounded-xl py-2.5 text-xs font-medium transition ${
                isMuted
                  ? "bg-orange-500 text-white hover:bg-orange-400"
                  : "bg-slate-900 text-slate-100 border border-slate-700 hover:bg-slate-800"
              }`}
            >
              {isMuted ? "Unmute Mic" : "Mute Mic"}
            </button>
          )}
        </div>

        {/* Extra actions */}
        {isCallActive && (
          <div className="flex gap-3 text-xs">
            <button
              onClick={handleSendBackgroundMessage}
              className="flex-1 rounded-lg bg-purple-500 text-white py-2.5 hover:bg-purple-400 transition font-medium"
            >
              Push Conversation
            </button>
            <button
              onClick={handleSayGoodbye}
              className="flex-1 rounded-lg bg-yellow-500 text-slate-900 py-2.5 hover:bg-yellow-400 transition font-medium"
            >
              Say Bye
            </button>
          </div>
        )}

        {/* Status */}
        <div className="mt-2 text-center text-[11px] text-slate-400">
          <p>
            Status:{" "}
            <span className="text-indigo-300 font-medium">{status}</span>
          </p>
          {isCallActive && (
            <p className="mt-1">Buddy volume: {volumeLevel.toFixed(2)}</p>
          )}
          {errorMessage && (
            <p className="mt-1 text-red-400">{errorMessage}</p>
          )}
          {!publicKey && (
            <p className="mt-1 text-red-400">
              Set <span className="font-mono">NEXT_PUBLIC_VAPI_PUBLIC_KEY</span>{" "}
              in your env.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

/** Page component with Firebase auth guard */
export default function MoodBuddyPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/sign-in");
      } else {
        setUser(u);
        setChecking(false);
      }
    });
    return () => unsub();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300 text-sm">
        Checking authentication...
      </div>
    );
  }

  if (!user) return null;

  return <MoodBuddyCore />;
}
