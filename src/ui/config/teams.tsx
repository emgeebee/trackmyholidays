import { useCallback, useEffect, type JSX } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../core/hooks";
import {
  fetchTeams,
  fetchTeamMembers,
  removeTeamMember,
  fetchTeamInvites,
  acceptTeamInvite,
} from "../../core/teams/actions";
import {
  getTeams,
  getTeamInvites,
  isTeamsLoading,
  getTeamsError,
} from "../../core/teams/selectors";
import { getIsLoggedIn } from "../../core/auth/selectors";
import type { Team, TeamInvite } from "../../types/holiday";

export function TeamsSettings(): JSX.Element {
  const dispatch = useAppDispatch();
  const teams = useSelector(getTeams);
  const invites = useSelector(getTeamInvites);
  const loading = useSelector(isTeamsLoading);
  const error = useSelector(getTeamsError);
  const loggedIn = useSelector(getIsLoggedIn);
  const userId = useSelector((state: any) => state.auth?.ww?.sub);

  useEffect(() => {
    if (loggedIn) {
      dispatch(fetchTeams());
      dispatch(fetchTeamInvites());
    }
  }, [dispatch, loggedIn]);

  const handleAcceptInvite = useCallback(
    (inviteId: string) => {
      dispatch(acceptTeamInvite(inviteId));
    },
    [dispatch]
  );

  const handleLeaveTeam = useCallback(
    async (team: Team) => {
      if (window.confirm(`Are you sure you want to leave "${team.name}"?`)) {
        const members = await dispatch(fetchTeamMembers(team.id)) as any;
        const myMember = members.find((m: any) => m.userId === userId);
        
        if (myMember) {
          await dispatch(removeTeamMember(team.id, myMember.id));
          await dispatch(fetchTeams());
        }
      }
    },
    [dispatch, userId]
  );

  if (!loggedIn) {
    return (
      <div className="config-panel">
        <p className="config-section__hint">Please log in to view teams.</p>
      </div>
    );
  }

  return (
    <div className="config-panel">
      {error && (
        <div className="teams-error">
          {error}
        </div>
      )}

      {invites.length > 0 && (
        <section className="config-section">
          <h4 className="config-section__title">
            Pending Invitations ({invites.length})
          </h4>
          <p className="config-section__hint">
            You've been invited to join these teams
          </p>
          <div className="teams-invites-list">
            {invites.map((invite: TeamInvite) => (
              <div key={invite.id} className="teams-invite-item">
                <div>
                  <strong>{invite.teamName}</strong>
                  <br />
                  <small>Role: {invite.role}</small>
                </div>
                <button
                  type="button"
                  onClick={() => handleAcceptInvite(invite.id)}
                  disabled={loading}
                  className="teams-btn teams-btn--accept"
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="config-section">
        <h4 className="config-section__title">Your Teams</h4>
        <p className="config-section__hint">
          Teams you're a member of
        </p>

        {loading && teams.length === 0 ? (
          <p className="config-section__hint">Loading...</p>
        ) : teams.length === 0 ? (
          <p className="config-section__hint">
            You're not part of any teams yet. Wait for an invitation from a team admin.
          </p>
        ) : (
          <div className="teams-list">
            {teams.map((team: Team) => (
              <div key={team.id} className="teams-list-item">
                <div className="teams-list-item__content">
                  <span className="teams-list-item__name">{team.name}</span>
                  <small className="teams-list-item__date">
                    Joined {new Date(team.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <button
                  type="button"
                  onClick={() => handleLeaveTeam(team)}
                  disabled={loading}
                  className="teams-btn teams-btn--leave"
                >
                  Leave
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
