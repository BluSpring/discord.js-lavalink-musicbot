import { Client,PresenceData } from "discord.js";

interface MusicbotOptions {
    prefix?: string;
    helpCmd?: string;
    playCmd?: string;
    pauseCmd?: string;
    stopCmd?: string;
    queueCmd?: string;
    npCmd?: string;
    skipCmd?: string;
    volumeCmd?: string;
    resumeCmd?: string;
    loopCmd?: string;
    admins?: Array<string>;
    customGame?: PresenceData;
    lavalink?: LavalinkOptions;
}

interface LavalinkOptions {
    nodes: LavalinkNodeOptions[];
    restnode: LavalinkNodeOptions;
}

interface LavalinkNodeOptions {
    host: string;
    id: string;
    password?: string | undefined;
    port?: number | string;
    reconnectInterval?: number | undefined;
    /**
     * Replaces host and port above all else.
     */
    address?: string;
}
export = LavalinkMusic;

declare function LavalinkMusic(client: Client, options: MusicbotOptions) {}