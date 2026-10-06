// Documents created inside a demo workspace expire with it
export const ttl = (user) => (user.workspace.expiresAt ? { expiresAt: new Date(user.workspace.expiresAt) } : {});
