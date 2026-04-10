import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Field, FieldLabel } from "./ui/field";
import { InputGroup, InputGroupTextarea } from "./ui/input-group";
import React from "react";
import { FailedStudent, useGradeStore } from "../store/failed-student-store";

interface FormProps {
  FailedStudent?: FailedStudent[];
  intervention?: string | undefined;
  onClose: () => void;
}
export default function InterventionForm({
  onClose,
  intervention,
  FailedStudent,
}: FormProps) {
  const options = [
    "Guidance Refferal",
    "Added Bonus Grade",
    "Extended/Allowed Late Submission",
    "Intervention Activities",
  ];

  const [editIntervention, setEditedIntervention] = React.useState<string>(
    intervention ?? "",
  );

  function onSubmit() {
    const { updateIntervention } = useGradeStore.getState();

    FailedStudent?.forEach((student) => {
      updateIntervention(student.name, editIntervention);
    });

    onClose();
  }
  return (
    <>
      <div className="flex fixed top-0 left-0 w-full h-full z-10 bg-black/50 items-center justify-center">
        <Card className="w-full sm:max-w-md rounded-2xl">
          <CardHeader></CardHeader>
          <CardContent>
            <form
              id="form-rhf-demo"
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              <div className="flex justify-between">
                <FieldLabel htmlFor="form-rhf-demo-description">
                  Apply Intervention To All
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
              <InputGroup>
                <InputGroupTextarea
                  id="form-rhf-demo-description"
                  placeholder="Add an intervention."
                  value={editIntervention}
                  onChange={(e) => setEditedIntervention(e.target.value)}
                  rows={6}
                  className="min-h-24 resize-none border-2 border-chart-4"
                />
              </InputGroup>
            </form>
          </CardContent>
          <CardFooter>
            <Field orientation="horizontal" className="flex justify-end">
              <Button
                type="button"
                className="border-2 border-chart-4 rounded-md hover:bg-slate-200"
                variant="outline"
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
                {editIntervention.trim() ? "Submit" : "Submit Empty"}
              </Button>
            </Field>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
