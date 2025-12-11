const configuredPresenceTimeout = Number(process.env.USER_PRESENCE_TIMEOUT_MINUTES);
const PRESENCE_TIMEOUT_MINUTES = Number.isFinite(configuredPresenceTimeout) && configuredPresenceTimeout > 0
  ? configuredPresenceTimeout
  : 5;
const PRESENCE_TIMEOUT_MS = PRESENCE_TIMEOUT_MINUTES * 60 * 1000;

export const presenceTimeoutMinutes = PRESENCE_TIMEOUT_MINUTES;

export function normalizePresence<T extends { isOnline?: boolean | null; lastSeenAt?: Date | null }>(
  entity: T
): T;
export function normalizePresence<T extends { isOnline?: boolean | null; lastSeenAt?: Date | null }>(
  entity: T | null | undefined
): T | null | undefined;
export function normalizePresence<T extends { isOnline?: boolean | null; lastSeenAt?: Date | null }>(
  entity: T | null | undefined
): T | null | undefined {
  if (!entity) return entity;

  const lastSeenAt = entity.lastSeenAt ? new Date(entity.lastSeenAt) : null;
  const isWithinThreshold = lastSeenAt ? Date.now() - lastSeenAt.getTime() <= PRESENCE_TIMEOUT_MS : false;

  return {
    ...entity,
    isOnline: Boolean(entity.isOnline && isWithinThreshold),
    lastSeenAt,
  };
}
