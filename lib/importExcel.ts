import { useFileStore } from "@/store/file-store";
import { useGradeStore } from "@/store/failed-student-store";
import * as XLSX from "xlsx";
import { mergeScores, readAttendance, readExam, readGrade, readLab, readQuiz } from "./readers";

interface ScoreCol {
  lab1: number;
  lab2: number;
  lab3: number;
  lab4: number;
  quiz1: number;
  quiz2: number;
  quiz3: number;
  quiz4: number;
  exam: number;
}

interface GradeCol {
  grade: number;
  equivalent: number;

}


export const getFileDetails = async (file: File, period: string | null) => {

  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    var SettingSheet = workbook.Sheets["Settings"];
    console.log(workbook)

    const subjectName = SettingSheet["E8"].v;
    const section = SettingSheet["P5"].v;
    const code = SettingSheet["P4"].v;
    const schoolYear_Semester = SettingSheet["E6"].v + " " + SettingSheet["E5"].v;

    useGradeStore.getState().resetGrades();

    useFileStore.getState().setFileDetails({
      subjectName,
      section,
      classCode: code,
      schoolYear_Semester,
      period: period,
    });

    getGrades(period, workbook);

    getScore(period, workbook);

    getAttendance(period, workbook);
  } catch (error) {
      return "The selected Excel file is invalid, or it may still be open. Please close the file and try again."
  }

};

export const getGrades = async (
  period: String | null,
  workbook: XLSX.WorkBook,
) => {
  var sheet = workbook.Sheets["Summary"];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // console.log(data);
  switch (period) {
    case "PRELIM":
      {
        const gradeCol: GradeCol = {
          grade: 7,
          equivalent: 8,
        };
        return readGrade(gradeCol, data);
      }

      break;
    case "MIDTERM":
      {
        const gradeCol: GradeCol = {
          grade: 9,
          equivalent: 10,
        };
        return readGrade(gradeCol, data);
      }

      break;
    case "PREFINAL":
      const gradeCol: GradeCol = {
        grade: 11,
        equivalent: 12,
      };
      return readGrade(gradeCol, data);
      break;
    case "FINAL":
      {
        const gradeCol: GradeCol = {
          grade: 13,
          equivalent: 14,
        };
        return readGrade(gradeCol, data);
      }
      break;
  }
};

export const getScore = async (
  period: String | null,
  workbook: XLSX.WorkBook,
) => {
  var Inputsheet = workbook.Sheets["Input"];

  var range = "A1:BE100";
  var data = XLSX.utils.sheet_to_json(Inputsheet, {
    header: 1,
    range: range,
    defval: null,
    blankrows: false,
  }) as any[][];

  switch (period) {
    case "PRELIM":
      {
        const scorCol: ScoreCol = { lab1: 6, lab2: 7, lab3: 8, lab4: 9, quiz1: 11, quiz2: 12, quiz3: 13, quiz4: 14, exam: 16 };
        mergeScores(data, scorCol);
      }

      break;
    case "MIDTERM":
      {
        const scorCol: ScoreCol = { lab1: 19, lab2: 20, lab3: 21, lab4: 22, quiz1: 24, quiz2: 25, quiz3: 26, quiz4: 27, exam: 29 };
        mergeScores(data, scorCol);
      }

      break;
    case "PREFINAL":
      {
        const scorCol: ScoreCol = { lab1: 32, lab2: 33, lab3: 34, lab4: 35, quiz1: 37, quiz2: 38, quiz3: 39, quiz4: 40, exam: 42 };
        mergeScores(data, scorCol);
      }

      break;
    case "FINAL":
      {
        const scorCol: ScoreCol = { lab1: 45, lab2: 46, lab3: 47, lab4: 48, quiz1: 50, quiz2: 51, quiz3: 52, quiz4: 53, exam: 55 };
        mergeScores(data, scorCol);
      }
      break;
  }
};

export const getAttendance = async (
  period: String | null,
  workbook: XLSX.WorkBook,
) => {

  switch (period) {
    case "PRELIM":
      {
        const prelimSheet = workbook.Sheets["PRELIMS"];
        const data = XLSX.utils.sheet_to_json<any[]>(prelimSheet, { header: 1 });

        readAttendance(data);
      }

      break;
    case "MIDTERM":
      {
        const midtermSheet = workbook.Sheets["MIDTERM"];
        const data = XLSX.utils.sheet_to_json<any[]>(midtermSheet, { header: 1 });

        readAttendance(data);
      }

      break;
    case "PREFINAL":
      {
        const prefinalSheet = workbook.Sheets["PRE-FINALS"];
        const data = XLSX.utils.sheet_to_json<any[]>(prefinalSheet, { header: 1 });
        readAttendance(data);
      }

      break;
    case "FINAL":
      {
        const finalSheet = workbook.Sheets["FINALS"];
        const data = XLSX.utils.sheet_to_json<any[]>(finalSheet, { header: 1 });
        readAttendance(data);
      }
      break;
  }


};
