import { useGradeStore } from "@/store/failed-student-store";

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
  prelim?: number;
  midterm?: number;
  prefinal?: number;
  final?: number;
  overall?: number
}

const getFailedNames = () =>
  new Set(useGradeStore.getState().failedGrades.map((s) => s.name));

export const readLab = (data: any[][], scoreCol: ScoreCol) => {
  const failedNames = getFailedNames();

  var missedLab = data
    .filter((row) => failedNames.has(row[5]))
    .map((row) => ({
      name: row[5],
      missingLabs: [
        row[scoreCol.lab1],
        row[scoreCol.lab2],
        row[scoreCol.lab3],
        row[scoreCol.lab4],
      ].filter((lab) => lab === 0.01 && lab !== null).length,
    }))
    .filter((row) => row.missingLabs > 0);

  return missedLab;
};

export const readQuiz = (data: any[][], scoreCol: ScoreCol) => {
  const failedNames = getFailedNames();

  var missedQuiz = data
    .filter((row) => failedNames.has(row[5]))
    .map((row) => ({
      name: row[5],
      missingQuiz: [
        row[scoreCol.quiz1],
        row[scoreCol.quiz2],
        row[scoreCol.quiz3],
        row[scoreCol.quiz4],
      ].filter((quiz) => quiz < 1 && quiz !== null).length,
    }))
    .filter((row) => row.missingQuiz >= 1);

  return missedQuiz;
};

export const readExam = (data: any[][], scoreCol: ScoreCol) => {
  const failedNames = getFailedNames();

  var examScore = data
    .filter(
      (row) => row[5] != undefined && row[5] !== "" && failedNames.has(row[5]),
    )
    .map((row) => ({
      name: row[5],
      exam: row[scoreCol.exam],
    }))
    .filter((row) => row.exam !== null);

  return examScore;
};

export const mergeScores = (data: any[][], scoreCol: ScoreCol) => {
  const labs = readLab(data, scoreCol);
  const quizzes = readQuiz(data, scoreCol);
  const exams = readExam(data, scoreCol);

  const failedGrades = useGradeStore.getState().failedGrades;

  const updated = failedGrades.map((student) => {
    const labScore = labs.find((l) => l.name === student.name);
    const quizScore = quizzes.find((q) => q.name === student.name);
    const examScore = exams.find((e) => e.name === student.name);

    const { name: _l, ...labData } = labScore ?? {};
    const { name: _q, ...quizData } = quizScore ?? {};
    const { name: _e, ...examData } = examScore ?? {};

    return {
      ...student,
      failedScores: {
        ...labData,
        ...quizData,
        ...examData,
      },
    };
  });
  useGradeStore.getState().setGradeDetails({ failedGrades: updated });
};

export const readGrade = (gradeCol: GradeCol, data: unknown[]) => {
  const grades = (data as any[][])
    .filter(
      (row) =>
        row[6] != null &&
        row[gradeCol.grade] != null &&
        row[6] !== "" &&
        row[gradeCol.grade] !== "" &&
        row[gradeCol.equivalent] === 5.0,
    ).map((row) => {
      return {
        name: row[6],
        grade: row[gradeCol.grade],
        prelim: row[7],
        midterm: row[9],
        prefinal: row[11],
        final: row[13],
        overall: row[16],
      };
    });

  // console.log(grades)

  useGradeStore.getState().setGradeDetails({
    failedGrades: grades,
  });
};


// .map((row) => ({

//     name: row[6],
//     grade: row[gradeCol.grade],
//     prelim: row[7],
//     midterm: row[9],
//     prefinal: row[11],
//     final: row[13],
//   }));

// useGradeStore.getState().setGradeDetails({
//   failedGrades: grades,
// });
export const readAttendance = (data: unknown[]) => {
  const failedNames = getFailedNames();

  // Get dates from row index 3, columns 6-19
  const dates = (data[3] as any[]).slice(6, 20);

  const attendanceStart = 6;
  const attendanceEnd = 20;

  const result = (data as any[][])
    .filter((row) => failedNames.has(row[5]))
    .map((row) => {
      const attendanceCells = row.slice(attendanceStart, attendanceEnd);

      const absenceDates = attendanceCells
        .map((cell: any, i: number) => (cell === "A" ? dates[i] : null))
        .filter(Boolean);

      const lateDates = attendanceCells
        .map((cell: any, i: number) => (cell === "L" ? dates[i] : null))
        .filter(Boolean);

      return {
        name: row[5],
        absences: absenceDates.length,
        absenceDates,
        late: lateDates.length,
        lateDates,
      };
    });

  const { updateAbsences } = useGradeStore.getState();

  result.forEach((student) => {
    updateAbsences(student.name, {
      absences: student.absences,
      absenceDates: student.absenceDates,
      late: student.late,
      lateDates: student.lateDates,
    });
  });
};
