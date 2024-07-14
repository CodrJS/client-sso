"use client";
import { useEffect, useState } from "react";
import UAParser from "ua-parser-js";
import { useSession } from "@/contexts/SessionContext";
import { OryClient } from "@/utils/ory/client";
import { Session, SessionDevice } from "@ory/client";
import Button from "../Button";

export default function SessionsCard() {
  const { session } = useSession();
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    if (session) {
      OryClient.listMySessions({
        page: 1,
        perPage: 10,
      })
        .then(({ data }) => {
          setSessions([session, ...data]);
        })
        .catch(console.error);
    }
  }, [session]);

  const handleRevokeSession = async (sessionId: string) => {
    OryClient.disableMySession({
      id: sessionId,
    })
      .then(() => {
        setSessions([...sessions.filter(s => s.id != sessionId)]);
      })
      .catch(console.error);
  };

  const handleRevokeOtherSessions = async () => {
    OryClient.disableMyOtherSessions()
      .then(() => {
        setSessions([session as Session]);
      })
      .catch(console.error);
  };

  return (
    <div className="min-w-96 bg-white border rounded p-4 flex flex-col gap-4 grow">
      <table>
        <tr>
          <th className="text-left">Current</th>
          <th className="text-left">Session</th>
          <th className="text-left">Expires at</th>
          <th className="text-left">Authenticated at</th>
          <th></th>
        </tr>
        {sessions.length > 0 ? (
          sessions.map(s => {
            const ua = new UAParser(
              ((s.devices || []) as SessionDevice[])[0]?.user_agent,
            );

            // console.log(ua.getResult());

            return (
              <tr id={s.id} key={s.id}>
                <td>{s.id === session?.id ? "Yes" : ""}</td>
                <td>
                  {ua.getBrowser().name} on {ua.getOS().name}{" "}
                  {ua.getOS().version}
                </td>
                <td>{s.expires_at || ""}</td>
                <td>{s.authenticated_at || ""}</td>
                <td>
                  <Button onClick={() => handleRevokeSession(s.id)}>
                    Revoke
                  </Button>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td>No active sessions.</td>
          </tr>
        )}
      </table>
      <div className="flex">
        <Button onClick={handleRevokeOtherSessions}>
          Revoke all other Sessions
        </Button>
      </div>
    </div>
  );
}
