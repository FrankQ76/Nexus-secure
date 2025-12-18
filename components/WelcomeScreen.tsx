
import React, { useState } from 'react';
import { Shield, Video, MessageSquare, PhoneCall, Clipboard, CheckCircle2, Lock } from 'lucide-react';

interface WelcomeProps {
  peerId: string;
  onJoin: (id: string) => void;
  onCopy: () => void;
  copyFeedback: boolean;
}

const WelcomeScreen: React.FC<WelcomeProps> = ({ peerId, onJoin, onCopy, copyFeedback }) => {
  const [targetId, setTargetId] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center">
        
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 mb-4">
              <Shield className="w-8 h-8" />
              <span className="font-bold text-xl tracking-tight uppercase">Nexus Secure</span>
            </div>
            <h1 className="text-5xl font-extrabold text-white leading-tight">
              Secure <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">P2P Chat</span>
            </h1>
            <p className="mt-4 text-slate-400 text-lg max-w-md">
              Direct, encrypted video and messaging without servers. Your data stays between you and your peer.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Video className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Direct Video</h3>
                <p className="text-slate-500 text-sm">Real-time P2P streaming directly between browsers.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Lock className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Private & Secure</h3>
                <p className="text-slate-500 text-sm">No intermediate servers. Only you and your recipient see the content.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="mb-8 p-4 bg-slate-800/50 rounded-2xl border border-white/5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Your ID</label>
            <div className="flex items-center justify-between">
              <code className="text-indigo-400 font-mono text-lg break-all">
                {peerId || 'Generating...'}
              </code>
              <button 
                onClick={onCopy}
                disabled={!peerId}
                className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                {copyFeedback ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Clipboard className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Connect to Peer ID</label>
              <input 
                type="text" 
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                placeholder="Paste Peer ID here..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <button 
              onClick={() => onJoin(targetId)}
              disabled={!targetId}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <PhoneCall className="w-5 h-5" />
              Start Call
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WelcomeScreen;
