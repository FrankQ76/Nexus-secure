# Nexus P2P Secure Chat

Nexus is a high-performance, browser-based peer-to-peer (P2P) communication platform. It allows users to establish direct, secure connections for video conferencing and instant messaging without the need for centralized data servers.

## Key Features

- **True Peer-to-Peer**: Media and message data are transmitted directly between browsers using WebRTC.
- **End-to-End Privacy**: Because there is no middleman server handling your data, your conversations remain private.
- **Direct Video & Audio**: Low-latency streaming for clear and responsive communication.
- **Encrypted Messaging**: Secure text chat alongside video calls.
- **Zero Configuration**: No account creation required. Simply share your unique Nexus ID to start a session.

## How It Works

1.  **Signaling**: The application uses a signaling server only to help peers discover each other and exchange connection metadata.
2.  **Handshake**: Once the metadata is exchanged, the browsers establish a direct P2P link.
3.  **Data Flow**: After the handshake, all video, audio, and chat data flows directly through the P2P connection, bypassing external servers.

## Built With

- **React**: Modern UI components and state management.
- **Tailwind CSS**: Responsive and high-fidelity styling.
- **PeerJS**: Simplified WebRTC implementation for peer discovery and data channels.
- **Lucide**: Clean and intuitive iconography.

## Security

Nexus prioritizes user privacy. All communication is protected by mandatory encryption:
- **Media Encryption**: Audio and video streams are encrypted using **SRTP** (Secure Real-time Transport Protocol).
- **Key Exchange**: Connection handshakes are secured via **DTLS** (Datagram Transport Layer Security).
- **Data Privacy**: No intermediate servers store or process your conversation content. The application only requires access to your camera and microphone during an active session.
