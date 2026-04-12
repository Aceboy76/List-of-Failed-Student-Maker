"use client";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useState } from "react";
import { getFileDetails } from "@/lib/importExcel";
import ExcelTable from "@/components/excelTable";
import { Button } from "@/components/ui/button";
import { generateExcel } from "@/lib/generateExcel";
import { useFileStore } from "@/store/file-store";
import { toast } from "sonner";

export default function MainTertiaryPage() {
  const Period = ["PRELIM", "MIDTERM", "PREFINAL", "FINAL"];
  const [file, setFile] = useState<File | null>(null);
  const [period, setPeriod] = useState<string | null>(null);
  const [notedBy, setNoted] = useState<string | null>(null);
  const [preparedBy, setPrepared] = useState<string | null>(null);

  const handleClick = async () => {
    if (!file) return;

    const error = await getFileDetails(file, period);

    if (error) {
      toast.error(error);
      return;
    } else {
      toast.success("File loaded successfully!");
    }

    useFileStore.getState().setFileDetails({
      Noted: notedBy?.toString().toUpperCase(),
      preparedBy: preparedBy?.toString().toUpperCase(),
    });
  };

  return (
    <>
      <div className="flex flex-col gap-5 ">
        <div className="flex justify-between">
          <div className="w-full flex gap-5">
            <Field className="w-1/2">
              <FieldLabel>Class Record</FieldLabel>
              <Input
                type="file"
                className="border-chart-4 border-2 rounded-lg"
                accept=".xlsx, .xls"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <FieldDescription>
                Select an excel file to upload.
              </FieldDescription>
            </Field>

            <Field className="w-fit">
              <FieldLabel>Period</FieldLabel>
              <Combobox
                items={Period}
                onInputValueChange={(value) => setPeriod(value)}
              >
                <ComboboxInput
                  placeholder="Select a Period"
                  className="border-chart-4 border-2 rounded-lg"
                />
                <ComboboxContent>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <FieldDescription>Select a school period.</FieldDescription>
            </Field>
            <Field className="w-70">
              <FieldLabel>Prepared By</FieldLabel>
              <Input
                type="text"
                placeholder="Enter Name"
                className="border-chart-4 border-2 rounded-lg uppercase"
                accept=".xlsx, .xls"
                onChange={(e) => setPrepared(e.target.value)}
              />
              <FieldDescription>Add your name here.</FieldDescription>
            </Field>
            <Field className="w-70">
              <FieldLabel>Approved by</FieldLabel>
              <Input
                type="text"
                placeholder="Enter Name"
                className="border-chart-4 border-2 rounded-lg uppercase"
                accept=".xlsx, .xls"
                onChange={(e) => setNoted(e.target.value)}
              />
              <FieldDescription>Add program head name here.</FieldDescription>
            </Field>
          </div>
        </div>
        <div>
          <div className="flex w-full justify-end gap-5">
            <div className="flex items-center">
              {period && file && notedBy && preparedBy ? (
                <Button
                  onClick={handleClick}
                  variant={"outline"}
                  className="text-md rounded-lg p-4 border-2 border-chart-2 bg-yellow-200 hover:bg-yellow-300 
                  "
                  disabled={false}
                >
                  IMPORT
                </Button>
              ) : (
                <Button
                  onClick={handleClick}
                  variant={"outline"}
                  className="text-md rounded-lg p-4 "
                  disabled={true}
                >
                  IMPORT
                </Button>
              )}
            </div>
            {period && file && notedBy && preparedBy ? (
              <Button
                className="text-md p-4 rounded-lg border-2 border-chart-2 bg-blue-300  hover:bg-blue-400 "
                disabled={false}
                variant={"outline"}
                onClick={() => generateExcel()}
              >
                EXPORT & DOWNLOAD
              </Button>
            ) : (
              <Button
                className="text-md rounded-lg p-4 "
                variant={"outline"}
                disabled={true}
              >
                EXPORT & DOWNLOAD
              </Button>
            )}
          </div>
        </div>
        <div>
          <ExcelTable />
        </div>
      </div>
    </>
  );
}
