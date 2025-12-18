
export interface Message {
  id: string;
  sender: 'me' | 'peer' | 'ai';
  text: string;
  timestamp: number;
}

export interface PeerState {
  id: string;
  connected: boolean;
  isCalling: boolean;
  isIncomingCall: boolean;
  remotePeerId: string;
}

export interface MediaState {
  audio: boolean;
  video: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}
