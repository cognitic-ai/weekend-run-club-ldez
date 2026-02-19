import { createContext, useContext, useState, useCallback } from "react";

export type Runner = {
  id: string;
  name: string;
  avatar: string;
};

export type Run = {
  id: string;
  title: string;
  date: string; // ISO string
  time: string; // e.g. "7:00 AM"
  location: string;
  distance: string; // e.g. "5K"
  notes: string;
  lat: number;
  lng: number;
  organizer: Runner;
  signups: Runner[];
};

export type Score = {
  id: string;
  runId: string;
  runTitle: string;
  runner: Runner;
  time: string; // e.g. "28:34"
  distance: string;
  notes: string;
  postedAt: string; // ISO string
};

const CURRENT_USER: Runner = {
  id: "me",
  name: "You",
  avatar: "🏃",
};

const SAMPLE_RUNNERS: Runner[] = [
  { id: "1", name: "Alex Park", avatar: "🧑" },
  { id: "2", name: "Jordan Lee", avatar: "👩" },
  { id: "3", name: "Sam Rivera", avatar: "🧑‍🦱" },
  { id: "4", name: "Casey Morgan", avatar: "👨" },
];

const now = new Date();
const nextSaturday = new Date(now);
nextSaturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7 || 7));
const nextSunday = new Date(nextSaturday);
nextSunday.setDate(nextSaturday.getDate() + 1);

const INITIAL_RUNS: Run[] = [
  {
    id: "run1",
    title: "Riverside Morning Run",
    date: nextSaturday.toISOString(),
    time: "7:00 AM",
    location: "Riverside Park, NYC",
    distance: "5K",
    notes:
      "Easy pace along the river. Meet at the main fountain entrance. Bring water!",
    lat: 40.8016,
    lng: -73.9704,
    organizer: SAMPLE_RUNNERS[0],
    signups: [SAMPLE_RUNNERS[0], SAMPLE_RUNNERS[1]],
  },
  {
    id: "run2",
    title: "Central Park Long Run",
    date: nextSunday.toISOString(),
    time: "8:30 AM",
    location: "Central Park, NYC",
    distance: "10K",
    notes:
      "Loop around the park. We'll run the full 6-mile loop. Intermediate pace.",
    lat: 40.7851,
    lng: -73.9683,
    organizer: SAMPLE_RUNNERS[2],
    signups: [SAMPLE_RUNNERS[2], SAMPLE_RUNNERS[3]],
  },
];

const INITIAL_SCORES: Score[] = [
  {
    id: "score1",
    runId: "run-past-1",
    runTitle: "Last Saturday Run",
    runner: SAMPLE_RUNNERS[0],
    time: "24:12",
    distance: "5K",
    notes: "Felt great, new PR!",
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "score2",
    runId: "run-past-1",
    runTitle: "Last Saturday Run",
    runner: SAMPLE_RUNNERS[1],
    time: "27:45",
    distance: "5K",
    notes: "Tough morning but finished strong",
    postedAt: new Date(Date.now() - 1.9 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "score3",
    runId: "run-past-2",
    runTitle: "Sunday Long Run",
    runner: SAMPLE_RUNNERS[3],
    time: "52:08",
    distance: "10K",
    notes: "Beautiful morning!",
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export type RunsStore = {
  runs: Run[];
  scores: Score[];
  currentUser: Runner;
  addRun: (run: Omit<Run, "id" | "organizer" | "signups">) => void;
  toggleSignup: (runId: string) => void;
  addScore: (score: Omit<Score, "id" | "runner" | "postedAt">) => void;
  isSignedUp: (runId: string) => boolean;
};

import React from "react";

const RunsContext = createContext<RunsStore | null>(null);

export function RunsProvider({ children }: { children: React.ReactNode }) {
  const [runs, setRuns] = useState<Run[]>(INITIAL_RUNS);
  const [scores, setScores] = useState<Score[]>(INITIAL_SCORES);

  const addRun = useCallback(
    (data: Omit<Run, "id" | "organizer" | "signups">) => {
      const newRun: Run = {
        ...data,
        id: `run-${Date.now()}`,
        organizer: CURRENT_USER,
        signups: [CURRENT_USER],
      };
      setRuns((prev) => [newRun, ...prev]);
    },
    []
  );

  const toggleSignup = useCallback((runId: string) => {
    setRuns((prev) =>
      prev.map((run) => {
        if (run.id !== runId) return run;
        const alreadySigned = run.signups.some((r) => r.id === CURRENT_USER.id);
        return {
          ...run,
          signups: alreadySigned
            ? run.signups.filter((r) => r.id !== CURRENT_USER.id)
            : [...run.signups, CURRENT_USER],
        };
      })
    );
  }, []);

  const addScore = useCallback(
    (data: Omit<Score, "id" | "runner" | "postedAt">) => {
      const newScore: Score = {
        ...data,
        id: `score-${Date.now()}`,
        runner: CURRENT_USER,
        postedAt: new Date().toISOString(),
      };
      setScores((prev) => [newScore, ...prev]);
    },
    []
  );

  const isSignedUp = useCallback(
    (runId: string) => {
      const run = runs.find((r) => r.id === runId);
      return run?.signups.some((r) => r.id === CURRENT_USER.id) ?? false;
    },
    [runs]
  );

  return (
    <RunsContext.Provider
      value={{ runs, scores, currentUser: CURRENT_USER, addRun, toggleSignup, addScore, isSignedUp }}
    >
      {children}
    </RunsContext.Provider>
  );
}

export function useRunsStore() {
  const ctx = useContext(RunsContext);
  if (!ctx) throw new Error("useRunsStore must be used within RunsProvider");
  return ctx;
}
