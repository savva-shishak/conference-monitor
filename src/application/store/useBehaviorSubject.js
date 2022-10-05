import {BehaviorSubject} from "rxjs";
import {useEffect, useState} from "react";
import {peers, rooms, sessions} from "./index";
import moment from "moment";

export function useBehaviorSubject(subject = new BehaviorSubject([])) {
  const [value, setValue] = useState(subject.getValue() || []);

  useEffect(() => {
    subject.subscribe(setValue);
  }, [subject]);

  return value;
}

export const useRooms = () => useBehaviorSubject(rooms)
export const useSessions = () => {
  return useBehaviorSubject(sessions)
    .sort((s1, s2) => (!s1.finished || (moment(s1.finished).isAfter(s2.finished))) ? -1 : 1)
}
export const usePeers = () => useBehaviorSubject(peers)