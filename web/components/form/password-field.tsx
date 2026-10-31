"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";
import { FormField, type FormFieldBaseProps } from "@/components/form/form-field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

type PasswordFieldProps<T extends FieldValues> = FormFieldBaseProps<T> &
  Omit<
    React.ComponentProps<typeof InputGroupInput>,
    "name" | "id" | "value" | "onChange" | "onBlur" | "type"
  >;

// Password input with a show/hide toggle. `className` sizes the outer group.
export function PasswordField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  ...inputProps
}: PasswordFieldProps<T>) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <FormField control={control} name={name} label={label} description={description}>
      {({ field, controlProps }) => (
        <InputGroup className={className}>
          <InputGroupInput
            {...inputProps}
            {...field}
            {...controlProps}
            type={isVisible ? "text" : "password"}
            className="h-full"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              aria-label="Show password"
              aria-pressed={isVisible}
              onClick={() => setIsVisible((visible) => !visible)}
            >
              {isVisible ? <EyeOffIcon /> : <EyeIcon />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      )}
    </FormField>
  );
}
