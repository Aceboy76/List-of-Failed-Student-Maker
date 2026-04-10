import { create } from "zustand";

export type FileState = {
  subjectName: string | null;
  section: string | null;
  classCode: string | null;
  schoolYear_Semester: string | null;
  preparedBy?: string | null;
  Noted?: string | null;
  period?: string | null ;

  setFileDetails: (data: Partial<FileState>) => void;
  setPreparedBy: (preparedBy: string) => void;
  setNoted: (noted: string) => void;
};

export const useFileStore = create<FileState>((set) => ({
  subjectName: null,
  section: null,
  classCode: null,
  schoolYear_Semester: null,
  preparedBy: null,
  Noted: null,

  setFileDetails: (data) => set((state) => ({ ...state, ...data })),
  setPreparedBy: (preparedBy) => set({ preparedBy }),
  setNoted: (noted) => set({ Noted: noted }),
}));