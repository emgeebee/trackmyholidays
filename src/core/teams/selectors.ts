import type { RootState, Team, TeamMember, TeamInvite, TeamHoliday } from "../../types/holiday";

export const getTeams = (state: RootState): Team[] => state.teams.teams;

export const getCurrentTeam = (state: RootState): Team | null => state.teams.currentTeam;

export const getTeamMembers = (state: RootState): TeamMember[] => state.teams.members;

export const getTeamInvites = (state: RootState): TeamInvite[] => state.teams.invites;

export const getTeamHolidays = (state: RootState): TeamHoliday[] => state.teams.teamHolidays;

export const isTeamsLoading = (state: RootState): boolean => state.teams.loading;

export const getTeamsError = (state: RootState): string | null => state.teams.error;

export const getTeamById = (state: RootState, teamId: string): Team | undefined =>
  state.teams.teams.find((team) => team.id === teamId);

export const isUserTeamAdmin = (state: RootState, teamId: string, userId: string): boolean => {
  const member = state.teams.members.find(
    (m) => m.teamId === teamId && m.userId === userId
  );
  return member?.role === "admin";
};
