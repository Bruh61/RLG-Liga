export type Platform = 'epic' | 'steam' | 'psn' | 'xbox';

export interface Player {
  id: string;
  gamertag: string;
  realName?: string;
  platform: Platform;
  /** Owning team id, or null for a free agent. */
  teamId: string | null;
  isCaptain: boolean;
  /** ISO date (yyyy-MM-dd). */
  joinedAt: string;
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  epic: 'Epic Games',
  steam: 'Steam',
  psn: 'PlayStation',
  xbox: 'Xbox',
};
