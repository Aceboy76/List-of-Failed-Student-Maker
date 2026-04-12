"use client";

import { useFileStore } from "@/store/file-store";
import { useGradeStore } from "@/store/failed-student-store";
import { Button } from "./ui/button";
import { ListChecksIcon, PenIcon, Student } from "@phosphor-icons/react";
import ListForm from "./listForm";
import { useState } from "react";
import InterventionForm from "./interventionForm";

export default function ExcelTable() {
  const subjectName = useFileStore((state) => state.subjectName);
  const section = useFileStore((state) => state.section);
  const classCode = useFileStore((state) => state.classCode);
  const period = useFileStore((state) => state.period);

  const schoolYear_Semester = useFileStore(
    (state) => state.schoolYear_Semester,
  );
  const failedGrades = useGradeStore((state) => state.failedGrades);
  const [listForm, setlistForm] = useState(false);
  const [interventionForm, setIntervention] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState<
    null | (typeof failedGrades)[0]
  >(null);

  const showInventionForm = () => {
    setIntervention(true);
  };

  const showListForm = (student: (typeof failedGrades)[0]) => {
    setlistForm(true);
    setSelectedStudent(student);
  };

  return (
    <div className="flex flex-col w-full bg-accent h-fit border-2 border-chart-4 rounded-lg p-5 gap-5">
      {/* Top Info */}
      <div className="flex flex-row justify-between">
        <p>
          <span className="font-bold">Subject:</span> {subjectName}
        </p>
        <p>
          <span className="font-bold">Section:</span> {section}
        </p>
        <p>
          <span className="font-bold">Period:</span> {period}
        </p>
        <p>
          <span className="font-bold">Code:</span> {classCode}
        </p>
        <p>
          <span className="font-bold">SY & Sem: </span>
          {schoolYear_Semester}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto max-h-[450px] w-full">
        <div className="min-w-[800px] w-full">
          {/* Header Row */}

          <div className="flex flex-row font-bold border-b-2 border-chart-2 sticky top-0 z-10 bg-accent">
            <div className="w-10 px-4 py-2 border-r-2 border-chart-2 text-start">
              #
            </div>
            <div className="flex-[2] px-4 py-2 border-r-2 border-chart-2">
              Student Name
            </div>
            <div className="flex-[4] px-4 py-2 border-r-2 border-chart-2 text-center">
              Grade
              <div className="grid grid-cols-5 gap-6 text-sm">
                <div>Prelim</div>
                <div>Midterm</div>
                <div>Prefinal</div>
                <div>Final</div>
                <div>Overall</div>
              </div>
            </div>
            <div className="flex-[3] px-4 py-2 border-r-2 border-chart-2 text-center">
              Reason for Failure
            </div>
            <div className="flex-[3] flex px-4 py-2 border-r-2 border-chart-2 text-center">
              <span className="flex-1 text-center">Intervention</span>

              {subjectName ? (
                <Button
                  className="bg-yellow-200 border-2 border-chart-2 hover:bg-yellow-300 rounded-sm"
                  variant={"outline"}
                  onClick={() => showInventionForm()}
                  disabled={false}
                >
                  <ListChecksIcon />
                </Button>
              ) : (
                ""
              )}
            </div>
            <div className="w-16 px-2 py-2 text-center">Edit</div>
          </div>

          {/* Data Rows */}
          {failedGrades.map((student, index) => (
            <div
              key={student.name}
              className="flex flex-row border-b border-chart-2"
            >
              <div className="w-10 px-4 py-2 border-r-2 border-chart-2 text-center">
                {index + 1}
              </div>
              <div className="flex-2 px-4 py-2 border-r-2 border-chart-2">
                {student.name}
              </div>
              <div className="flex-[4] px-4 py-2 border-r-2 border-chart-2 text-center ">
                <div className="grid grid-cols-5 gap-6 w-full text-md ">
                  <div className="text-center">{student.prelim ?? "-"}</div>
                  <div className="text-center">{student.midterm ?? "-"}</div>
                  <div className="text-center">{student.prefinal ?? "-"}</div>
                  <div className="text-center">{student.final ?? "-"}</div>
                  <div className="text-center">{student.overall ?? "-"}</div>
                </div>
              </div>
              <div className="flex-3 px-4 py-2 border-r-2 border-chart-2 break-words whitespace-normal">
                {student.failedScores && (
                  <>
                    {student.failedScores.missingLabs && (
                      <span>
                        <span className="font-bold">Missed Lab: </span>
                        {student.failedScores.missingLabs}
                      </span>
                    )}
                    {student.failedScores.missingLabs &&
                      student.failedScores.missingQuiz &&
                      ", "}
                    {student.failedScores.missingQuiz && (
                      <span>
                        <span className="font-bold">Missed Quiz: </span>
                        {student.failedScores.missingQuiz}
                      </span>
                    )}
                    {(student.failedScores.missingLabs ||
                      student.failedScores.missingQuiz) &&
                      ", "}
                    <span>
                      <span className="font-bold">Exam: </span>
                      {student.failedScores.exam}
                    </span>
                  </>
                )}
                {student.absences && (
                  <span className="ml-2">
                    {(student.failedScores?.missingLabs ||
                      student.failedScores?.missingQuiz ||
                      student.failedScores?.exam !== undefined) &&
                      ", "}
                    <span className="font-bold">Absences: </span>
                    {student.absences.absences ?? 0}
                    {student.absences.absenceDates?.length
                      ? ` (${student.absences.absenceDates.join(", ")})`
                      : ""}
                    {!!student.absences.late && (
                      <>
                        {", "}
                        <span className="font-bold">Late: </span>
                        {student.absences.late}
                        {student.absences.lateDates?.length
                          ? ` (${student.absences.lateDates.join(", ")})`
                          : ""}
                      </>
                    )}{" "}
                    {!!student.other && (
                      <>
                        {", "}
                        <span className="font-bold">Other concern: </span>
                        {student.other}
                      </>
                    )}
                  </span>
                )}
              </div>
              <div className="flex-3 px-4 py-2 border-r-2 border-chart-2">
                {student.failedScores && (
                  <>
                    {student.intervention && (
                      <span>{student.intervention}</span>
                    )}
                  </>
                )}
              </div>
              <div className="w-16 px-2 py-2 flex items-center justify-center">
                <Button
                  variant={"outline"}
                  className="bg-yellow-200 border-2 border-chart-2 hover:bg-yellow-300 rounded-sm"
                  onClick={() => showListForm(student)}
                >
                  <PenIcon />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {listForm ? (
        <ListForm
          name={selectedStudent?.name}
          labs={selectedStudent?.failedScores?.missingLabs}
          quiz={selectedStudent?.failedScores?.missingQuiz}
          exam={selectedStudent?.failedScores?.exam}
          absent={selectedStudent?.absences}
          other={selectedStudent?.other}
          intervention={selectedStudent?.intervention}
          onClose={() => {
            setlistForm(false);
            setSelectedStudent(null);
          }}
        />
      ) : null}

      {interventionForm ? (
        <InterventionForm
          FailedStudent={failedGrades}
          onClose={() => {
            setIntervention(false);
          }}
        />
      ) : null}
    </div>
  );
}
