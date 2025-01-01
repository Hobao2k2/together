import io from 'socket.io-client';

const SOCKET_URL = 'http://10.0.88.20:9001';

class WSService {
    initializeSocket = async () => {
        try {
            this.socket = io(SOCKET_URL, {
                transports: ['websocket'],
            });
            console.log('Socket initialized');

            this.socket.on('connect', () => {
                console.log('Socket connected');
            });

            this.socket.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            this.socket.on('error', (error) => {
                console.error('Socket error:', error);
            });
        } catch (error) {
            console.error('Socket initialization failed:', error);
        }
    };

    emit(event, data = {}) {
        if (this.socket) {
            this.socket.emit(event, data);
        } else {
            console.error('Socket is not initialized. Cannot emit event.');
        }
    }

    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        } else {
            console.error('Socket is not initialized. Cannot listen to events.');
        }
    }

    off(event, callback) {
        if (this.socket) {
            this.socket.off(event, callback);
        } else {
            console.error('Socket is not initialized. Cannot remove event listener.');
        }
    }

    removeListener(listenerName) {
        if (this.socket) {
            this.socket.removeListener(listenerName);
        } else {
            console.error('Socket is not initialized. Cannot remove listener.');
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            console.log('Socket disconnected');
        } else {
            console.error('Socket is not initialized. Cannot disconnect.');
        }
    }
}

const socketService = new WSService();
export default socketService;
