"use client";

import type { FieldValues } from "react-hook-form";
import { FormField, type FormFieldBaseProps } from "@/components/form/form-field";
import { Input } from "@/components/ui/input";

type TextFieldProps<T extends FieldValues> = FormFieldBaseProps<T> &
  Omit<React.ComponentProps<typeof Input>, "name" | "id" | "value" | "onChange" | "onBlur">;

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  ...inputProps
}: TextFieldProps<T>) {
  return (
    <FormField control={control} name={name} label={label} description={description}>
      {({ field, controlProps }) => <Input {...inputProps} {...field} {...controlProps} />}
    </FormField>
  );
}
