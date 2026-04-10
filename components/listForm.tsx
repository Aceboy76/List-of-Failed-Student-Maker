"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Absences, useGradeStore } from "@/store/failed-student-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FormProps {
  name: string | undefined;
  labs?: number | undefined;
  quiz?: number | undefined;
  exam?: number | undefined;
  absent?: Absences | undefined;
  other?: string | undefined;
  intervention?: string | undefined;
  onClose: () => void;
}

export default function ListForm({
  name,
  labs,
  quiz,
  exam,
  absent,
  onClose,
  other,
  intervention,
}: FormProps) {
  const options = [
    "Guidance Refferal",
    "Added Bonus Grade",
    "Extended/Allowed Late Submission",
    "Intervention Activities",
  ];

  const [editedLabs, setEditedLabs] = React.useState<number | undefined>(labs);
  const [editedQuiz, setEditedQuiz] = React.useState<number | undefined>(quiz);
  const [editedExam, setEditedExam] = React.useState<number | undefined>(exam);
  const [editedAbsences, setEditedAbsences] = React.useState<
    number | undefined
  >(absent?.absences);
  const [editedLate, setEditedLate] = React.useState<number | undefined>(
    absent?.late,
  );
  const [editedAbsenceDates, setEditedAbsenceDates] = React.useState(
    absent?.absenceDates?.join(", ") ?? "",
  );
  const [editedLateDates, setEditedLateDates] = React.useState(
    absent?.lateDates?.join(", ") ?? "",
  );
  const [editIntervention, setEditedIntervention] = React.useState<string>(
    intervention ?? "",
  );
  const [editOther, setEditedOther] = React.useState<string>(other ?? "");

  function onSubmit() {
    const {
      updateFailedScores,
      updateIntervention,
      updateAbsences,
      updateOthers,
    } = useGradeStore.getState();

    updateFailedScores(name!, {
      missingLabs: editedLabs,
      missingQuiz: editedQuiz,
      exam: editedExam,
    });

    updateIntervention(name!, editIntervention);
    updateOthers(name!, editOther);

    updateAbsences(name!, {
      absences: editedAbsences,
      absenceDates: absent?.absenceDates,
      late: editedLate,
      lateDates: absent?.lateDates,
    });

    console.log(JSON.stringify(useGradeStore.getState().failedGrades, null, 2));
    onClose();
  }

  return (
    <div className="flex fixed top-0 left-0 w-full h-full z-10 bg-black/50 items-center justify-center">
      <Card className="w-full sm:max-w-md rounded-2xl">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="form-rhf-demo"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            {/* Editable Fields */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2 mb-4">
                  {labs !== undefined && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-bold w-32">
                        Missed Labs
                      </label>
                      <Input
                        type="number"
                        value={editedLabs}
                        onChange={(e) => setEditedLabs(Number(e.target.value))}
                        className="border-2 border-chart-4"
                      />
                    </div>
                  )}
                  {quiz !== undefined && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-bold w-32">
                        Missed Quiz
                      </label>
                      <Input
                        type="number"
                        value={editedQuiz}
                        onChange={(e) => setEditedQuiz(Number(e.target.value))}
                        className="border-2 border-chart-4"
                      />
                    </div>
                  )}
                  {exam !== undefined && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-bold w-32">Exam</label>
                      <Input
                        type="number"
                        value={editedExam}
                        onChange={(e) => setEditedExam(Number(e.target.value))}
                        className="border-2 border-chart-4"
                      />
                    </div>
                  )}
                  {absent?.absences !== undefined && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-bold w-32">Absences</label>
                      <Input
                        type="number"
                        value={editedAbsences}
                        onChange={(e) =>
                          setEditedAbsences(Number(e.target.value))
                        }
                        className="border-2 border-chart-4"
                      />
                    </div>
                  )}
                  {absent?.absenceDates !== undefined && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-bold w-32">
                        Absence Dates
                      </label>
                      <Input
                        value={editedAbsenceDates}
                        placeholder="e.g. 19, 23, 29"
                        onChange={(e) => setEditedAbsenceDates(e.target.value)}
                        className="border-2 border-chart-4"
                      />
                    </div>
                  )}
                  {absent?.late !== undefined && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-bold w-32">Late</label>
                      <Input
                        type="number"
                        value={editedLate}
                        onChange={(e) => setEditedLate(Number(e.target.value))}
                        className="border-2 border-chart-4"
                      />
                    </div>
                  )}
                  {absent?.lateDates !== undefined && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-bold w-32">
                        Late Dates
                      </label>
                      <Input
                        value={editedLateDates}
                        placeholder="e.g. 29, 30"
                        onChange={(e) => setEditedLateDates(e.target.value)}
                        className="border-2 border-chart-4"
                      />
                    </div>
                  )}
                </div>
                <div className="flexflex-col items-center gap-2">
                  <label className="text-sm font-bold w-32">
                    Other Concerns
                  </label>
                  <InputGroupTextarea
                    value={editOther}
                    placeholder="Add Other Concerns"
                    onChange={(e) => setEditedOther(e.target.value)}
                    className="border-2 border-chart-4"
                  />
                </div>
              </div>
              {/* Intervention */}
              <div>
                <div className="flex justify-between">
                  <FieldLabel htmlFor="form-rhf-demo-description">
                    Intervention
                  </FieldLabel>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="bg-yellow-200 hover:bg-yellow-300 border-2 border-chart-4 rounded-sm mb-1 h-fit py-1"
                        >
                          Pre Select
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-96">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>
                            Select Intervention
                          </DropdownMenuLabel>
                          {options.map((option) => (
                            <DropdownMenuItem
                              key={option}
                              onClick={() => {
                                setEditedIntervention((prev) =>
                                  prev ? `${prev}, ${option}` : option,
                                );
                              }}
                              className="focus:bg-blue-300"
                            >
                              {option}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <InputGroupTextarea
                  id="form-rhf-demo-description"
                  placeholder="Add an intervention."
                  rows={6}
                  className="min-h-24 resize-none border-2 border-chart-4 "
                  value={editIntervention}
                  onChange={(e) => setEditedIntervention(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal" className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="border-2 border-chart-4 rounded-md hover:bg-slate-200"
              onClick={() => onClose()}
            >
              Close
            </Button>
            <Button
              type="submit"
              variant={"outline"}
              className="bg-blue-300 border-2 border-chart-4 hover:bg-blue-400 rounded-md"
              form="form-rhf-demo"
            >
              Submit
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
