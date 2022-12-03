import { RoomId } from '../room/types';

type SessionId = string;

interface Session {
  username?: string;
  roomId: RoomId;
  color: string;
}

export class InMemorySessionStore {
  sessions: Map<SessionId, Session>;

  constructor() {
    this.sessions = new Map();
  }

  findSession(id: SessionId) {
    return this.sessions.get(id);
  }

  saveSession(id: SessionId, session: Session) {
    this.sessions.set(id, session);
    console.log(
      `New session stored for ${session?.username} in room ${session?.roomId}. Number of sessions stored:`,
      this.sessions.size
    );
  }

  findAllSessions() {
    return this.sessions.values();
  }

  deleteSession(id: SessionId) {
    const removed = this.sessions.delete(id);
    if (removed)
      console.log(
        'Session deleted. Number of sessions stored:',
        this.sessions.size
      );
  }
}
