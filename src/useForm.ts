"use client";

import { useState, useCallback, type ChangeEvent, type FormEvent } from "react";

interface FormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
}

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
}

interface FormActions<T> {
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleBlur: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldTouched: (field: keyof T, isTouched?: boolean) => void;
  resetForm: () => void;
}

/**
 * Hook that manages form state and validation
 * @param options Form options
 * @returns Form state and actions
 */
export function useForm<T extends Record<string, any>>(
  options: FormOptions<T>
): [FormState<T>, FormActions<T>] {
  const { initialValues, onSubmit, validate } = options;

  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
  });

  const validateForm = useCallback(() => {
    if (!validate) return {};
    return validate(state.values);
  }, [state.values, validate]);

  const handleChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      const { name, value, type } = e.target;

      setState((prevState) => ({
        ...prevState,
        values: {
          ...prevState.values,
          [name]:
            type === "checkbox"
              ? (e.target as HTMLInputElement).checked
              : value,
        },
      }));
    },
    []
  );

  const handleBlur = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      const { name } = e.target;

      setState((prevState) => ({
        ...prevState,
        touched: {
          ...prevState.touched,
          [name]: true,
        },
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const errors = validateForm();
      const hasErrors = Object.keys(errors).length > 0;

      setState((prevState) => ({
        ...prevState,
        errors,
        touched: Object.keys(prevState.values).reduce((acc, key) => {
          acc[key as keyof T] = true;
          return acc;
        }, {} as Partial<Record<keyof T, boolean>>),
        isSubmitting: !hasErrors,
      }));

      if (!hasErrors) {
        try {
          await onSubmit(state.values);
        } finally {
          setState((prevState) => ({
            ...prevState,
            isSubmitting: false,
          }));
        }
      }
    },
    [onSubmit, state.values, validateForm]
  );

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setState((prevState) => ({
      ...prevState,
      values: {
        ...prevState.values,
        [field]: value,
      },
    }));
  }, []);

  const setFieldTouched = useCallback((field: keyof T, isTouched = true) => {
    setState((prevState) => ({
      ...prevState,
      touched: {
        ...prevState.touched,
        [field]: isTouched,
      },
    }));
  }, []);

  const resetForm = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
    });
  }, [initialValues]);

  return [
    state,
    {
      handleChange,
      handleBlur,
      handleSubmit,
      setFieldValue,
      setFieldTouched,
      resetForm,
    },
  ];
}
