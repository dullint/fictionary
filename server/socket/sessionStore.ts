type SessionId = string;

interface Session {
  userId: string;
  username?: string;
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
  }

  findAllSessions() {
    return this.sessions.values();
  }
}

// module.exports = {
//   InMemorySessionStore,
// };
