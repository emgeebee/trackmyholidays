import { createAction } from "../action-helpers";
import { getToken } from "../auth/selectors";
import { LOGOUT } from "../auth/action-types";
import { clearAuth } from "../auth/storage";
import { getTeamsApiBase } from "./api-base";

import {
  FETCH_TEAMS,
  LOAD_TEAMS,
  CREATE_TEAM,
  UPDATE_TEAM,
  DELETE_TEAM,
  SET_CURRENT_TEAM,
  FETCH_TEAM_MEMBERS,
  LOAD_TEAM_MEMBERS,
  REMOVE_TEAM_MEMBER,
  FETCH_TEAM_INVITES,
  LOAD_TEAM_INVITES,
  INVITE_TEAM_MEMBER,
  ACCEPT_TEAM_INVITE,
  FETCH_TEAM_HOLIDAYS,
  LOAD_TEAM_HOLIDAYS,
  TEAMS_ERROR,
  CLEAR_TEAMS_ERROR,
} from "./action-types";

import type {
  AppThunk,
  Team,
  TeamMember,
  TeamInvite,
  TeamHoliday,
} from "../../types/holiday";

export const fetchTeamsAction = createAction(FETCH_TEAMS);
export const loadTeamsAction = createAction<Team[]>(LOAD_TEAMS);
export const createTeamAction = createAction<Team>(CREATE_TEAM);
export const updateTeamAction = createAction<Team>(UPDATE_TEAM);
export const deleteTeamAction = createAction<string>(DELETE_TEAM);
export const setCurrentTeamAction = createAction<Team | null>(SET_CURRENT_TEAM);

export const fetchTeamMembersAction = createAction(FETCH_TEAM_MEMBERS);
export const loadTeamMembersAction = createAction<TeamMember[]>(LOAD_TEAM_MEMBERS);
export const removeTeamMemberAction = createAction<string>(REMOVE_TEAM_MEMBER);

export const fetchTeamInvitesAction = createAction(FETCH_TEAM_INVITES);
export const loadTeamInvitesAction = createAction<TeamInvite[]>(LOAD_TEAM_INVITES);
export const inviteTeamMemberAction = createAction<TeamInvite[]>(INVITE_TEAM_MEMBER);
export const acceptTeamInviteAction = createAction<string>(ACCEPT_TEAM_INVITE);

export const fetchTeamHolidaysAction = createAction(FETCH_TEAM_HOLIDAYS);
export const loadTeamHolidaysAction = createAction<TeamHoliday[]>(LOAD_TEAM_HOLIDAYS);

export const teamsErrorAction = createAction<string>(TEAMS_ERROR);
export const clearTeamsErrorAction = createAction(CLEAR_TEAMS_ERROR);

export const fetchTeams =
  (): AppThunk<Promise<void>> => async (dispatch, getState) => {
    const state = getState();
    const token = getToken(state);
    const apiBase = getTeamsApiBase(state);
    dispatch(fetchTeamsAction());
    try {
      const response = await fetch(`${apiBase}/api/teams`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 401) {
        clearAuth();
        dispatch({ type: LOGOUT });
        return;
      }
      if (!response.ok) {
        throw new Error(`Failed to fetch teams: ${response.statusText}`);
      }
      const data = await response.json();
      const teams: Team[] = Array.isArray(data) ? data : (data.teams || []);
      dispatch(loadTeamsAction(teams));
    } catch (e) {
      console.error(e);
      dispatch(teamsErrorAction(e instanceof Error ? e.message : "Failed to fetch teams"));
    }
  };

export const createTeam =
  (name: string, parentId?: string): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    const state = getState();
    const token = getToken(state);
    const apiBase = getTeamsApiBase(state);
    dispatch(fetchTeamsAction());
    try {
      const response = await fetch(`${apiBase}/api/teams`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, parentId }),
      });
      if (response.status === 401) {
        clearAuth();
        dispatch({ type: LOGOUT });
        return;
      }
      if (!response.ok) {
        throw new Error(`Failed to create team: ${response.statusText}`);
      }
      const team: Team = await response.json();
      dispatch(createTeamAction(team));
      await dispatch(fetchTeams());
    } catch (e) {
      console.error(e);
      dispatch(teamsErrorAction(e instanceof Error ? e.message : "Failed to create team"));
    }
  };

export const updateTeam =
  (id: string, name: string): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    const state = getState();
    const token = getToken(state);
    const apiBase = getTeamsApiBase(state);
    dispatch(fetchTeamsAction());
    try {
      const response = await fetch(`${apiBase}/api/teams/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      if (response.status === 401) {
        clearAuth();
        dispatch({ type: LOGOUT });
        return;
      }
      if (!response.ok) {
        throw new Error(`Failed to update team: ${response.statusText}`);
      }
      const team: Team = await response.json();
      dispatch(updateTeamAction(team));
      await dispatch(fetchTeams());
    } catch (e) {
      console.error(e);
      dispatch(teamsErrorAction(e instanceof Error ? e.message : "Failed to update team"));
    }
  };

export const deleteTeam =
  (id: string): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    const state = getState();
    const token = getToken(state);
    const apiBase = getTeamsApiBase(state);
    dispatch(fetchTeamsAction());
    try {
      const response = await fetch(`${apiBase}/api/teams/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        clearAuth();
        dispatch({ type: LOGOUT });
        return;
      }
      if (!response.ok) {
        throw new Error(`Failed to delete team: ${response.statusText}`);
      }
      dispatch(deleteTeamAction(id));
      await dispatch(fetchTeams());
    } catch (e) {
      console.error(e);
      dispatch(teamsErrorAction(e instanceof Error ? e.message : "Failed to delete team"));
    }
  };

export const setCurrentTeam =
  (team: Team | null): AppThunk =>
  (dispatch) => {
    dispatch(setCurrentTeamAction(team));
  };

export const fetchTeamMembers =
  (teamId: string): AppThunk<Promise<TeamMember[]>> =>
  async (dispatch, getState) => {
    const state = getState();
    const token = getToken(state);
    const apiBase = getTeamsApiBase(state);
    dispatch(fetchTeamMembersAction());
    try {
      const response = await fetch(`${apiBase}/api/teams/${teamId}/members`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 401) {
        clearAuth();
        dispatch({ type: LOGOUT });
        return [];
      }
      if (!response.ok) {
        throw new Error(`Failed to fetch team members: ${response.statusText}`);
      }
      const data = await response.json();
      const members: TeamMember[] = Array.isArray(data) ? data : (data.members || []);
      dispatch(loadTeamMembersAction(members));
      return members;
    } catch (e) {
      console.error(e);
      dispatch(teamsErrorAction(e instanceof Error ? e.message : "Failed to fetch team members"));
      return [];
    }
  };

export const removeTeamMember =
  (teamId: string, memberId: string): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    const state = getState();
    const token = getToken(state);
    const apiBase = getTeamsApiBase(state);
    dispatch(fetchTeamMembersAction());
    try {
      const response = await fetch(`${apiBase}/api/teams/${teamId}/members/${memberId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        clearAuth();
        dispatch({ type: LOGOUT });
        return;
      }
      if (!response.ok) {
        throw new Error(`Failed to remove team member: ${response.statusText}`);
      }
      dispatch(removeTeamMemberAction(memberId));
      await dispatch(fetchTeamMembers(teamId));
    } catch (e) {
      console.error(e);
      dispatch(teamsErrorAction(e instanceof Error ? e.message : "Failed to remove team member"));
    }
  };

export const fetchTeamInvites =
  (): AppThunk<Promise<void>> => async (dispatch, getState) => {
    const state = getState();
    const token = getToken(state);
    const apiBase = getTeamsApiBase(state);
    dispatch(fetchTeamInvitesAction());
    try {
      const response = await fetch(`${apiBase}/api/teams/invites/pending`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 401) {
        clearAuth();
        dispatch({ type: LOGOUT });
        return;
      }
      if (!response.ok) {
        throw new Error(`Failed to fetch team invites: ${response.statusText}`);
      }
      const data = await response.json();
      const invites: TeamInvite[] = Array.isArray(data) ? data : (data.invites || []);
      dispatch(loadTeamInvitesAction(invites));
    } catch (e) {
      console.error(e);
      dispatch(teamsErrorAction(e instanceof Error ? e.message : "Failed to fetch team invites"));
    }
  };

export const inviteTeamMembers =
  (teamId: string, emails: string[], role: "admin" | "member" = "member"): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    const state = getState();
    const token = getToken(state);
    const apiBase = getTeamsApiBase(state);
    dispatch(fetchTeamInvitesAction());
    try {
      const response = await fetch(`${apiBase}/api/teams/invite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId, emails, role }),
      });
      if (response.status === 401) {
        clearAuth();
        dispatch({ type: LOGOUT });
        return;
      }
      if (!response.ok) {
        throw new Error(`Failed to invite team members: ${response.statusText}`);
      }
      const invites: TeamInvite[] = await response.json();
      dispatch(inviteTeamMemberAction(invites));
    } catch (e) {
      console.error(e);
      dispatch(teamsErrorAction(e instanceof Error ? e.message : "Failed to invite team members"));
    }
  };

export const acceptTeamInvite =
  (inviteId: string): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    const state = getState();
    const token = getToken(state);
    const apiBase = getTeamsApiBase(state);
    dispatch(fetchTeamInvitesAction());
    try {
      const response = await fetch(`${apiBase}/api/teams/invites/${inviteId}/accept`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 401) {
        clearAuth();
        dispatch({ type: LOGOUT });
        return;
      }
      if (!response.ok) {
        throw new Error(`Failed to accept invite: ${response.statusText}`);
      }
      dispatch(acceptTeamInviteAction(inviteId));
      await dispatch(fetchTeamInvites());
      await dispatch(fetchTeams());
    } catch (e) {
      console.error(e);
      dispatch(teamsErrorAction(e instanceof Error ? e.message : "Failed to accept invite"));
    }
  };

export const fetchTeamHolidays =
  (teamId?: string, memberIds?: string[]): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    const state = getState();
    const token = getToken(state);
    const apiBase = getTeamsApiBase(state);
    dispatch(fetchTeamHolidaysAction());
    try {
      const params = new URLSearchParams();
      if (teamId) params.append("teamId", teamId);
      if (memberIds && memberIds.length > 0) {
        memberIds.forEach(id => params.append("memberIds", id));
      }
      const queryString = params.toString();
      const url = `${apiBase}/api/teams/holidays${queryString ? `?${queryString}` : ""}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 401) {
        clearAuth();
        dispatch({ type: LOGOUT });
        return;
      }
      if (!response.ok) {
        throw new Error(`Failed to fetch team holidays: ${response.statusText}`);
      }
      const data = await response.json();
      const holidays: TeamHoliday[] = Array.isArray(data) ? data : (data.holidays || []);
      dispatch(loadTeamHolidaysAction(holidays));
    } catch (e) {
      console.error(e);
      dispatch(teamsErrorAction(e instanceof Error ? e.message : "Failed to fetch team holidays"));
    }
  };
