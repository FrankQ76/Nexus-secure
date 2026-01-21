
import React, { useState, useEffect, useRef } from 'react';
import Peer, { DataConnection, MediaConnection } from 'peerjs';
import { Message, PeerState, MediaState } from './types';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  PhoneCall,
  Send,
  Clipboard,
  CheckCircle2,
  MessageSquare,
  Users
} from 'lucide-react';

// Components
import VideoWindow from './components/VideoWindow';
import ChatSidebar from './components/ChatSidebar';
import WelcomeScreen from './components/WelcomeScreen';

const App: React.FC = () => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerState, setPeerState] = useState<PeerState>({
    id: '',
    connected: false,
    isCalling: false,
    isIncomingCall: false,
    remotePeerId: '',
  });
  const [mediaState, setMediaState] = useState<MediaState>({
    audio: true,
    video: true,
    localStream: null,
    remoteStream: null,
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const connRef = useRef<DataConnection | null>(null);
  const callRef = useRef<MediaConnection | null>(null);

  // Initialize Peer
  useEffect(() => {
    const newPeer = new Peer();

    newPeer.on('open', (id) => {
      setPeerState(prev => ({ ...prev, id }));
    });

    newPeer.on('connection', (conn) => {
      connRef.current = conn;
      setupConnectionHandlers(conn);
      setPeerState(prev => ({ ...prev, remotePeerId: conn.peer, connected: true }));
    });

    newPeer.on('call', async (call) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMediaState(prev => ({ ...prev, localStream: stream }));
        call.answer(stream);
        setupCallHandlers(call);
      } catch (err) {
        console.error("Failed to answer call", err);
      }
    });

    setPeer(newPeer);

    return () => {
      newPeer.destroy();
    };
  }, []);

  const setupConnectionHandlers = (conn: DataConnection) => {
    conn.on('data', (data: unknown) => {
      // Validate incoming message structure and content
      if (
        data &&
        typeof data === 'object' &&
        'type' in data &&
        (data as { type: string }).type === 'chat' &&
        'text' in data &&
        typeof (data as { text: unknown }).text === 'string'
      ) {
        const text = (data as { text: string }).text;
        // Sanitize: limit length and trim
        const sanitizedText = text.slice(0, 5000).trim();
        if (sanitizedText) {
          setMessages(prev => [...prev, {
            id: crypto.randomUUID(),
            sender: 'peer',
            text: sanitizedText,
            timestamp: Date.now()
          }]);
        }
      }
    });
    conn.on('close', () => {
      setPeerState(prev => ({ ...prev, connected: false, remotePeerId: '' }));
    });
  };

  const setupCallHandlers = (call: MediaConnection) => {
    callRef.current = call;
    call.on('stream', (remoteStream: MediaStream) => {
      setMediaState(prev => ({ ...prev, remoteStream }));
    });
    call.on('close', () => {
      setMediaState(prev => ({ ...prev, remoteStream: null }));
    });
  };

  const startCall = async (remoteId: string) => {
    if (!peer || !remoteId) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMediaState(prev => ({ ...prev, localStream: stream }));

      const conn = peer.connect(remoteId);
      connRef.current = conn;
      setupConnectionHandlers(conn);

      const call = peer.call(remoteId, stream);
      setupCallHandlers(call);

      setPeerState(prev => ({ ...prev, remotePeerId: remoteId, connected: true }));
    } catch (err) {
      console.error("Failed to get local stream", err);
    }
  };

  const sendMessage = (text: string) => {
    if (connRef.current && text.trim()) {
      connRef.current.send({ type: 'chat', text });
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        sender: 'me',
        text,
        timestamp: Date.now()
      }]);
    }
  };

  const toggleMedia = (type: 'audio' | 'video') => {
    if (mediaState.localStream) {
      const track = type === 'audio'
        ? mediaState.localStream.getAudioTracks()[0]
        : mediaState.localStream.getVideoTracks()[0];

      if (track) {
        track.enabled = !track.enabled;
        setMediaState(prev => ({ ...prev, [type]: track.enabled }));
      }
    }
  };

  const endCall = () => {
    if (callRef.current) callRef.current.close();
    if (connRef.current) connRef.current.close();
    if (mediaState.localStream) {
      mediaState.localStream.getTracks().forEach(t => t.stop());
    }
    setMediaState({ audio: true, video: true, localStream: null, remoteStream: null });
    setPeerState(prev => ({ ...prev, connected: false, remotePeerId: '' }));
    setMessages([]);
  };

  const copyId = () => {
    navigator.clipboard.writeText(peerState.id);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  if (!peerState.connected && !peerState.remotePeerId) {
    return (
      <WelcomeScreen
        peerId={peerState.id}
        onJoin={startCall}
        onCopy={copyId}
        copyFeedback={copyFeedback}
      />
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-950 overflow-hidden">
      <div className="flex-1 relative flex items-center justify-center p-4 bg-black/20">
        <div className="w-full h-full max-w-6xl aspect-video relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <VideoWindow
            localStream={mediaState.localStream}
            remoteStream={mediaState.remoteStream}
            isLocalVideoOff={!mediaState.video}
          />

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-xl">
            <button
              onClick={() => toggleMedia('audio')}
              className={`p-3 rounded-full transition-all ${mediaState.audio ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-500 hover:bg-red-600'}`}
            >
              {mediaState.audio ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <button
              onClick={() => toggleMedia('video')}
              className={`p-3 rounded-full transition-all ${mediaState.video ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-500 hover:bg-red-600'}`}
            >
              {mediaState.video ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
            <button
              onClick={endCall}
              className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-all transform hover:scale-110"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-white/20 mx-2" />
            <div className="flex flex-col text-xs font-medium text-slate-400">
              <span>Peer: {peerState.remotePeerId.slice(0, 8)}...</span>
              <span className="text-emerald-400">Encrypted P2P</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-96 flex flex-col bg-slate-900 border-l border-white/10 shadow-2xl">
        <ChatSidebar
          messages={messages}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default App;
