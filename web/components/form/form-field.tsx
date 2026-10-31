"use client";

import { useId } from "react";
import {
  Controller,
  type Control,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";

export type FormFieldBaseProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
};

type ControlProps = {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
};

type FormFieldProps<T extends FieldValues> = FormFieldBaseProps<T> & {
  children: (props: {
    field: ControllerRenderProps<T, FieldPath<T>>;
    controlProps: ControlProps;
  }) => React.ReactNode;
};

// Binds a react-hook-form field to a labelled shadcn Field. The control rendered by
// `children` gets its id and ARIA wiring, and the description is swapped for the
// validation error when there is one.
export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  children,
}: FormFieldProps<T>) {
  const id = useId();
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const describedBy = fieldState.invalid ? errorId : description ? descriptionId : undefined;

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            {children({
              field,
              controlProps: { id, "aria-invalid": fieldState.invalid, "aria-describedby": describedBy },
            })}
            {fieldState.invalid ? (
              <FieldError id={errorId} errors={[fieldState.error]} />
            ) : (
              description && <FieldDescription id={descriptionId}>{description}</FieldDescription>
            )}
          </Field>
        );
      }}
    />
  );
}
