
import React, { useRef, useEffect } from 'react';
import { User, VideoOff } from 'lucide-react';

interface VideoWindowProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isLocalMuted: boolean;
  isLocalVideoOff: boolean;
}

const VideoWindow: React.FC<VideoWindowProps> = ({ localStream, remoteStream, isLocalVideoOff }) => {
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localRef.current && localStream) {
      localRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteRef.current && remoteStream) {
      remoteRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="w-full h-full relative bg-slate-900 flex items-center justify-center">
      {/* Remote Video (Main) */}
      <div className="w-full h-full relative overflow-hidden">
        {remoteStream ? (
          <video 
            ref={remoteRef}
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center animate-pulse">
              <User className="w-12 h-12 text-slate-600" />
            </div>
            <span className="text-slate-500 font-medium">Waiting for peer stream...</span>
          </div>
        )}
      </div>

      {/* Local Video (PIP) */}
      <div className="absolute top-6 right-6 w-48 aspect-video rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black">
        {isLocalVideoOff ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-800">
            <VideoOff className="w-6 h-6 text-slate-400" />
          </div>
        ) : (
          <video 
            ref={localRef}
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover mirror-x"
          />
        )}
      </div>

      <style>{`
        .mirror-x { transform: scaleX(-1); }
      `}</style>
    </div>
  );
};

export default VideoWindow;
