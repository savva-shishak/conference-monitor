export declare interface Room {
    id: string;
    sessions: string[];
}

export declare interface Session {
    id: string;

    started: string;
    finished: string | null;
    open: boolean;

    messages: any[];
    wavings: string[];

    room: string;
    peers: string[];
}

export declare interface Peer {
    id: string;
    displayName: string;
    avatar: string;
}
