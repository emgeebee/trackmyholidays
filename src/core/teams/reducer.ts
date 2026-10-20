import type { UnknownAction } from "redux";
import type { TeamsState, Team, TeamMember, TeamInvite, TeamHoliday } from "../../types/holiday";

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

interface TeamsAction extends UnknownAction {
  payload?: any;
}

const initialState: TeamsState = {
  teams: [],
  currentTeam: null,
  members: [],
  invites: [],
  teamHolidays: [],
  loading: false,
  error: null,
};

export function teams(state = initialState, action: TeamsAction): TeamsState {
  switch (action.type) {
    case FETCH_TEAMS:
    case FETCH_TEAM_MEMBERS:
    case FETCH_TEAM_INVITES:
    case FETCH_TEAM_HOLIDAYS:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case LOAD_TEAMS:
      return {
        ...state,
        teams: action.payload as Team[],
        loading: false,
        error: null,
      };

    case CREATE_TEAM:
      return {
        ...state,
        teams: [...state.teams, action.payload as Team],
        loading: false,
        error: null,
      };

    case UPDATE_TEAM: {
      const updatedTeam = action.payload as Team;
      return {
        ...state,
        teams: state.teams.map((team) =>
          team.id === updatedTeam.id ? updatedTeam : team
        ),
        currentTeam:
          state.currentTeam?.id === updatedTeam.id
            ? updatedTeam
            : state.currentTeam,
        loading: false,
        error: null,
      };
    }

    case DELETE_TEAM: {
      const teamId = action.payload as string;
      return {
        ...state,
        teams: state.teams.filter((team) => team.id !== teamId),
        currentTeam:
          state.currentTeam?.id === teamId ? null : state.currentTeam,
        loading: false,
        error: null,
      };
    }

    case SET_CURRENT_TEAM:
      return {
        ...state,
        currentTeam: action.payload as Team | null,
      };

    case LOAD_TEAM_MEMBERS:
      return {
        ...state,
        members: action.payload as TeamMember[],
        loading: false,
        error: null,
      };

    case REMOVE_TEAM_MEMBER: {
      const memberId = action.payload as string;
      return {
        ...state,
        members: state.members.filter((member) => member.id !== memberId),
        loading: false,
        error: null,
      };
    }

    case LOAD_TEAM_INVITES:
      return {
        ...state,
        invites: action.payload as TeamInvite[],
        loading: false,
        error: null,
      };

    case INVITE_TEAM_MEMBER:
      return {
        ...state,
        invites: [...state.invites, ...(action.payload as TeamInvite[])],
        loading: false,
        error: null,
      };

    case ACCEPT_TEAM_INVITE: {
      const inviteId = action.payload as string;
      return {
        ...state,
        invites: state.invites.filter((invite) => invite.id !== inviteId),
        loading: false,
        error: null,
      };
    }

    case LOAD_TEAM_HOLIDAYS:
      return {
        ...state,
        teamHolidays: action.payload as TeamHoliday[],
        loading: false,
        error: null,
      };

    case TEAMS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload as string,
      };

    case CLEAR_TEAMS_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}
