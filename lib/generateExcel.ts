import { useGradeStore } from '@/store/failed-student-store';
import { useFileStore } from '@/store/file-store';
import * as XLSXStyle from 'sheetjs-style';
import { FailedStudent } from '../store/failed-student-store';

export const generateExcel = async () => {
    const fileDetails = useFileStore.getState();
    const { failedGrades } = useGradeStore.getState();

    const worksheet: XLSXStyle.WorkSheet = {};

    worksheet["!cols"] = [
        { wch: 3 },
        { wch: 6 },
        { wch: 55 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 90 },
        { wch: 60 },
    ];

    worksheet["!merges"] = [
        XLSXStyle.utils.decode_range("C2:J2"),
        XLSXStyle.utils.decode_range("D4:F4"),
        XLSXStyle.utils.decode_range("D5:F5"),
        XLSXStyle.utils.decode_range("D6:F6"),
        XLSXStyle.utils.decode_range("D7:F7"),
    ];

    const defaultBlackBorder = {
        top: { style: "thin", color: { auto: 1 } },
        bottom: { style: "thin", color: { auto: 1 } },
        left: { style: "thin", color: { auto: 1 } },
        right: { style: "thin", color: { auto: 1 } }
    };
    const withDash = (value: any) => {
        return value === null || value === undefined || value === ""
            ? "-"
            : value;
    };
    const withEmpty = (value: any) => {
        return value === null || value === undefined ? "" : value;
    };
    const labelStyle = {
        font: { name: "Calibri", sz: 16, bold: true },
    };

    const headerStyle = {
        alignment: { horizontal: "center", vertical: "center" },
        font: { name: "Calibri", sz: 16, bold: true },
        fill: { patternType: "solid", fgColor: { rgb: "D0CECE" } },
        border: defaultBlackBorder
    };

    const DetailsValueStyle = {
        font: { name: "Calibri", sz: 16 },
    };

    const IndexValueStyle = {
        font: { name: "Calibri", sz: 16 },
        alignment: { horizontal: "center" },
        border: defaultBlackBorder
    };

    const NameValueStyle = {
        font: { name: "Calibri", sz: 16, bold: true },
        alignment: { vertical: "center" },
        border: defaultBlackBorder
    };

    const NumValueStyle = {
        font: { name: "Calibri", sz: 16, bold: true },
        alignment: { horizontal: "center", vertical: "center" },
        border: defaultBlackBorder
    };

    const TextValueStyle = {
        font: { name: "Calibri", sz: 16 },
        alignment: { vertical: "center", wrapText: true },
        border: defaultBlackBorder
    };


    worksheet["C2"] = {
        v: "LIST OF FAILED STUDENTS",
        t: "s",
        s: {
            font: { name: "Calibri", sz: 16, bold: true },
            fill: { patternType: "solid", fgColor: { rgb: "FFFF00" } },
            alignment: { horizontal: "center", vertical: "center" },
        }
    };

    // Labels
    worksheet["C4"] = { v: "SUBJECT DESCRIPTION", t: "s", s: labelStyle };
    worksheet["C5"] = { v: "SUBJECT CODE", t: "s", s: labelStyle };
    worksheet["C6"] = { v: "SECTION", t: "s", s: labelStyle };
    worksheet["C7"] = { v: "SEMESTER & ACADEMIC YEAR", t: "s", s: labelStyle };

    // Header
    worksheet["C9"] = { v: "STUDENT", t: "s", s: headerStyle };
    worksheet["D9"] = { v: "PRELIMS", t: "s", s: headerStyle };
    worksheet["E9"] = { v: "MIDTERM", t: "s", s: headerStyle };
    worksheet["F9"] = { v: "PREFINALS", t: "s", s: headerStyle };
    worksheet["G9"] = { v: "FINALS", t: "s", s: headerStyle };
    worksheet["H9"] = { v: "FINAL GRADE", t: "s", s: headerStyle };
    worksheet["I9"] = { v: "REASONS FOR FAILURE", t: "s", s: headerStyle };
    worksheet["J9"] = { v: "INTERVENTION", t: "s", s: headerStyle };

    // Details
    worksheet["D4"] = { v: fileDetails.subjectName, t: "s", s: DetailsValueStyle };
    worksheet["D5"] = { v: fileDetails.classCode, t: "s", s: DetailsValueStyle };
    worksheet["D6"] = { v: fileDetails.section, t: "s", s: DetailsValueStyle };
    worksheet["D7"] = { v: fileDetails.schoolYear_Semester, t: "s", s: DetailsValueStyle };

    const startRow = 10;

    // Table Data
    failedGrades.forEach((student, index) => {
        const row = startRow + index;

        worksheet[`B${row}`] = { v: index + 1, t: "n", s: IndexValueStyle };
        worksheet[`C${row}`] = { v: student.name, t: "s", s: NameValueStyle };
        worksheet[`D${row}`] = { v: withDash(student.prelim), t: "s", s: NumValueStyle };
        worksheet[`E${row}`] = { v: withDash(student.midterm), t: "s", s: NumValueStyle };
        worksheet[`F${row}`] = { v: withDash(student.prefinal), t: "s", s: NumValueStyle };
        worksheet[`G${row}`] = { v: withDash(student.final), t: "s", s: NumValueStyle };
        worksheet[`H${row}`] = { v: withDash(student.overall), t: "s", s: NumValueStyle };
        worksheet[`I${row}`] = { v: formatRemarks(student), t: "s", s: TextValueStyle };
        worksheet[`J${row}`] = { v: withEmpty(student.intervention), t: "s", s: TextValueStyle };
    });

    const lastRow = startRow + failedGrades.length - 1;

    const noteRow = lastRow + 2;
    const preparedByLabelRow = noteRow + 3;
    const preparedByNameRow = preparedByLabelRow + 2;
    const instructorRow = preparedByNameRow + 1;
    const notedLabelRow = instructorRow + 2; // 
    const notedNameRow = notedLabelRow + 3;
    const programHeadRow = notedNameRow + 1;

    worksheet[`C${noteRow}`] = {
        v: "Note: Attach a copy of Conference Form (Guidance Office)",
        t: "s",
        s: { font: { name: "Calibri", sz: 16, italic: true } }
    };

    worksheet[`C${preparedByLabelRow}`] = {
        v: "Prepared by:",
        t: "s",
        s: { font: { name: "Calibri", sz: 16 } }
    };

    worksheet[`C${preparedByNameRow}`] = {
        v: fileDetails.preparedBy,
        t: "s",
        s: { font: { name: "Calibri", sz: 16, bold: true } }
    };

    worksheet[`C${instructorRow}`] = {
        v: "Instructor",
        t: "s",
        s: { font: { name: "Calibri", sz: 16 } }
    };

    worksheet[`C${notedLabelRow}`] = {
        v: "Noted:",
        t: "s",
        s: { font: { name: "Calibri", sz: 16 } }
    };

    worksheet[`C${notedNameRow}`] = {
        v: fileDetails.Noted,
        t: "s",
        s: {
            font: { name: "Calibri", sz: 16, bold: true },
            border: {
                bottom: { style: "thin", color: { auto: 1 } },
            }
        }
    };

    worksheet[`C${programHeadRow}`] = {
        v: "Program Head",
        t: "s",
        s: { font: { name: "Calibri", sz: 16 } }
    };

    // ✅ Dynamic sheet range (IMPORTANT FIX)
    const totalRows = programHeadRow + 2;
    worksheet["!ref"] = `A1:K${totalRows}`;

    const workbook = XLSXStyle.utils.book_new();
    XLSXStyle.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const fileName = `LASTNAME_List-of-Fail-Students-${fileDetails.classCode}-${fileDetails.section}.xlsx`;

    XLSXStyle.writeFile(workbook, fileName);
};

const formatRemarks = (student: FailedStudent): string => {
    const parts: string[] = [];

    if (student.failedScores) {
        const scoreParts: string[] = [];

        if (student.failedScores.missingLabs) {
            scoreParts.push(`Missed Lab: ${student.failedScores.missingLabs}`);
        }
        if (student.failedScores.missingQuiz) {
            scoreParts.push(`Missed Quiz: ${student.failedScores.missingQuiz}`);
        }
        if (student.failedScores.exam !== undefined) {
            scoreParts.push(`Exam: ${student.failedScores.exam}`);
        }

        if (scoreParts.length > 0) {
            parts.push(scoreParts.join(", "));
        }
    }

    if (student.absences) {
        const absenceCount = student.absences.absences ?? 0;
        const absenceDates = student.absences.absenceDates?.length
            ? ` (${student.absences.absenceDates.join(", ")})`
            : "";

        let absenceText = `Absences: ${absenceCount}${absenceDates}`;

        if (student.absences.late) {
            const lateDates = student.absences.lateDates?.length
                ? ` (${student.absences.lateDates.join(", ")})`
                : "";
            absenceText += `, Late: ${student.absences.late}${lateDates}`;
        }

        parts.push(absenceText);
    }

    if (student.other) {
        parts.push("Other Concern: " + student.other);
    }

    return parts.join(", ");
};