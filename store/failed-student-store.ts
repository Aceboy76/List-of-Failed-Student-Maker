import { create } from "zustand";

export type FailedScores = {
  missingLabs?: number;
  missingQuiz?: number;
  exam?: number;
};

export type Absences = {
  absences?: number;
  absenceDates?: number[];
  late?: number;
  lateDates?: number[];
};

export type FailedStudent = {
  name: string;
  grade: number;
  failedScores?: FailedScores;
  absences?: Absences;
  other?: string;
  intervention?: string;
  prelim?: number;
  midterm?: number;
  prefinal?: number;
  final?: number;
  overall?: number;
};

export type gradesState = {
  failedGrades: FailedStudent[];
  setGradeDetails: (data: Partial<gradesState>) => void;
  resetGrades: () => void;
  updateFailedScores: (name: string, scores: FailedScores) => void;
  updateAbsences: (name: string, absences: Absences) => void;
  updateOthers: (name: string, other: string) => void;
  updateIntervention: (name: string, intervention: string) => void;
};

export const useGradeStore = create<gradesState>((set) => ({
  failedGrades: [],
  setGradeDetails: (data) => set((state) => ({ ...state, ...data })),
  resetGrades: () => set({ failedGrades: [] }),
  updateFailedScores: (name, scores) =>
    set((state) => ({
      failedGrades: state.failedGrades.map((student) =>
        student.name === name
          ? { ...student, failedScores: scores }
          : student,
      ),
    })),
  updateAbsences: (name, absences) =>
    set((state) => ({
      failedGrades: state.failedGrades.map((student) =>
        student.name === name
          ? { ...student, absences }
          : student,
      ),
    })),
  updateOthers: (name, other) =>
    set((state) => ({
      failedGrades: state.failedGrades.map((student) =>
        student.name === name
          ? { ...student, other }
          : student,
      ),
    })),
  updateIntervention: (name, intervention) =>
    set((state) => ({
      failedGrades: state.failedGrades.map((student) =>
        student.name === name
          ? { ...student, intervention }
          : student,
      ),
    })),
}));