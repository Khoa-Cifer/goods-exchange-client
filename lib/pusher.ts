import Pusher, { Options } from 'pusher-js';

// Singleton instance to avoid multiple connections
let pusherClientInstance: Pusher | null = null;

interface PusherConfig {
    appKey: string;
    cluster: string;
    authEndpoint: string;
    authToken?: string;
}

export function getPusherClient(config: PusherConfig): Pusher {
    // If client exists and is connected, return it
    if (pusherClientInstance && pusherClientInstance.connection.state === 'connected') {
        return pusherClientInstance;
    }

    // Disconnect and clear previous instance if it exists
    if (pusherClientInstance) {
        pusherClientInstance.disconnect();
        pusherClientInstance = null;
    }

    // Pusher configuration
    const pusherOptions: Options = {
        cluster: config.cluster,
        forceTLS: true,
        authEndpoint: config.authEndpoint,
        auth: {
            headers: config.authToken
                ? { Authorization: `Bearer ${config.authToken}` }
                : {},
        },
    };

    // Initialize new Pusher client
    pusherClientInstance = new Pusher(config.appKey, pusherOptions);

    // Log connection state for debugging
    pusherClientInstance.connection.bind('state_change', (state: { previous: string; current: string }) => {
        console.log(`Pusher connection state: ${state.current}`);
    });

    // Log errors for debugging
    pusherClientInstance.connection.bind('error', (err: any) => {
        console.error('Pusher error:', err);
    });

    return pusherClientInstance;
}