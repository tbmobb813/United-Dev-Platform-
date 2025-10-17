import React, { ReactNode, useEffect, useState } from 'react';

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  url?: boolean;
  number?: boolean;
  integer?: boolean;
  // Custom validator receives an unknown value and should narrow/convert as needed
  custom?: (value: unknown) => boolean | string;
  message?: string;
}

export interface FieldValidation {
  [fieldName: string]: ValidationRule[];
}

export interface ValidationErrors {
  [fieldName: string]: string[];
}

export interface FormValidationHookResult {
  errors: ValidationErrors;
  isValid: boolean;
  validate: (fieldName?: string) => boolean;
  validateAll: () => boolean;
  clearErrors: (fieldName?: string) => void;
  setFieldError: (fieldName: string, error: string) => void;
  hasError: (fieldName: string) => boolean;
  getFirstError: (fieldName: string) => string | null;
}

export interface FormValidationProps {
  children: ReactNode;
  validation: FieldValidation;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, unknown>;
  onValidationChange?: (isValid: boolean, errors: ValidationErrors) => void;
  showErrorsOnMount?: boolean;
  validateOnChange?: boolean;
  className?: string;
}

export interface FieldErrorProps {
  fieldName: string;
  errors?: ValidationErrors;
  className?: string;
  showFirst?: boolean;
}

// Built-in validation rules
const defaultValidators = {
  required: (value: unknown, rule: ValidationRule): string | null => {
    if (
      rule.required &&
      (value === null || value === undefined || value === '')
    ) {
      return rule.message || 'This field is required';
    }
    return null;
  },

  min: (value: unknown, rule: ValidationRule): string | null => {
    if (rule.min !== undefined && value !== null && value !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const numValue = Number(value as any);
      if (!isNaN(numValue) && numValue < rule.min) {
        return rule.message || `Value must be at least ${rule.min}`;
      }
    }
    return null;
  },

  max: (value: unknown, rule: ValidationRule): string | null => {
    if (rule.max !== undefined && value !== null && value !== undefined) {
      const numValue = Number(value as unknown as number | string);
      if (!isNaN(numValue) && numValue > rule.max) {
        return rule.message || `Value must be at least ${rule.max}`;
      }
    }
    return null;
  },

  minLength: (value: unknown, rule: ValidationRule): string | null => {
    if (rule.minLength !== undefined && value !== null && value !== undefined) {
      const strValue = String(value as unknown as string | number);
      if (strValue.length < rule.minLength) {
        return rule.message || `Must be at least ${rule.minLength} characters`;
      }
    }
    return null;
  },

  maxLength: (value: unknown, rule: ValidationRule): string | null => {
    if (rule.maxLength !== undefined && value !== null && value !== undefined) {
      const strValue = String(value as unknown as string | number);
      if (strValue.length > rule.maxLength) {
        return rule.message || `Must be at most ${rule.maxLength} characters`;
      }
    }
    return null;
  },

  pattern: (value: unknown, rule: ValidationRule): string | null => {
    if (rule.pattern && value !== null && value !== undefined && value !== '') {
      const strValue = String(value as unknown as string | number);
      if (!rule.pattern.test(strValue)) {
        return rule.message || 'Invalid format';
      }
    }
    return null;
  },

  email: (value: unknown, rule: ValidationRule): string | null => {
    if (rule.email && value !== null && value !== undefined && value !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const strValue = String(value as unknown as string | number);
      if (!emailRegex.test(strValue)) {
        return rule.message || 'Invalid email address';
      }
    }
    return null;
  },

  url: (value: unknown, rule: ValidationRule): string | null => {
    if (rule.url && value !== null && value !== undefined && value !== '') {
      try {
        new URL(String(value as unknown as string | number));
      } catch {
        return rule.message || 'Invalid URL';
      }
    }
    return null;
  },

  number: (value: unknown, rule: ValidationRule): string | null => {
    if (rule.number && value !== null && value !== undefined && value !== '') {
      const numValue = Number(value as unknown as number | string);
      if (isNaN(numValue)) {
        return rule.message || 'Must be a valid number';
      }
    }
    return null;
  },

  integer: (value: unknown, rule: ValidationRule): string | null => {
    if (rule.integer && value !== null && value !== undefined && value !== '') {
      const numValue = Number(value as unknown as number | string);
      if (isNaN(numValue) || !Number.isInteger(numValue)) {
        return rule.message || 'Must be a valid integer';
      }
    }
    return null;
  },

  custom: (value: unknown, rule: ValidationRule): string | null => {
    if (rule.custom) {
      const result = rule.custom(value);
      if (typeof result === 'string') {
        return result;
      }
      if (result === false) {
        return rule.message || 'Invalid value';
      }
    }
    return null;
  },
};

// Utility function to validate a single field
export const validateField = (
  value: unknown,
  rules: ValidationRule[]
): string[] => {
  const errors: string[] = [];

  for (const rule of rules) {
    for (const [validatorName, validator] of Object.entries(
      defaultValidators
    )) {
      if (rule[validatorName as keyof ValidationRule] !== undefined) {
        const error = validator(value, rule);
        if (error) {
          errors.push(error);
        }
      }
    }
  }

  return errors;
};

// Utility function to validate all fields
export const validateForm = (
  data: Record<string, unknown>,
  validation: FieldValidation
): ValidationErrors => {
  const errors: ValidationErrors = {};

  for (const [fieldName, rules] of Object.entries(validation)) {
    const fieldErrors = validateField(data[fieldName], rules);
    if (fieldErrors.length > 0) {
      errors[fieldName] = fieldErrors;
    }
  }

  return errors;
};

// Hook for form validation
export const useFormValidation = (
  data: Record<string, unknown>,
  validation: FieldValidation,
  options: {
    validateOnChange?: boolean;
    onValidationChange?: (isValid: boolean, errors: ValidationErrors) => void;
  } = {}
): FormValidationHookResult => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = (fieldName?: string): boolean => {
    if (fieldName) {
      // Validate single field
      const rules = validation[fieldName] || [];
      const fieldErrors = validateField(data[fieldName], rules);

      setErrors(prev => ({
        ...prev,
        [fieldName]: fieldErrors,
      }));

      return fieldErrors.length === 0;
    } else {
      // Validate all fields
      return validateAll();
    }
  };

  const validateAll = (): boolean => {
    const newErrors = validateForm(data, validation);
    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;

    if (options.onValidationChange) {
      options.onValidationChange(isValid, newErrors);
    }

    return isValid;
  };

  const clearErrors = (fieldName?: string): void => {
    if (fieldName) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    } else {
      setErrors({});
    }
  };

  const setFieldError = (fieldName: string, error: string): void => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: [error],
    }));
  };

  const hasError = (fieldName: string): boolean => {
    return errors[fieldName] && errors[fieldName].length > 0;
  };

  const getFirstError = (fieldName: string): string | null => {
    return errors[fieldName] && errors[fieldName].length > 0
      ? errors[fieldName][0]
      : null;
  };

  const isValid = Object.keys(errors).length === 0;

  // Validate on data change if enabled
  useEffect(() => {
    if (options.validateOnChange) {
      validateAll();
    }
  }, [data, validation, options.validateOnChange]);

  return {
    errors,
    isValid,
    validate,
    validateAll,
    clearErrors,
    setFieldError,
    hasError,
    getFirstError,
  };
};

// Form validation wrapper component
export const FormValidation: React.FC<FormValidationProps> = ({
  children,
  validation,
  data,
  onValidationChange,
  showErrorsOnMount = false,
  validateOnChange = false,
  className = '',
}) => {
  const { isValid, validateAll } = useFormValidation(data, validation, {
    validateOnChange,
    onValidationChange,
  });

  useEffect(() => {
    if (showErrorsOnMount) {
      validateAll();
    }
  }, []);

  return (
    <div className={`form-validation ${className}`} data-valid={isValid}>
      {children}
    </div>
  );
};

// Field error display component
export const FieldError: React.FC<FieldErrorProps> = ({
  fieldName,
  errors = {},
  className = '',
  showFirst = true,
}) => {
  const fieldErrors = errors[fieldName] || [];

  if (fieldErrors.length === 0) {
    return null;
  }

  const errorsToShow = showFirst ? [fieldErrors[0]] : fieldErrors;

  return (
    <div className={`field-error ${className}`} role='alert' aria-live='polite'>
      {errorsToShow.map((error, index) => (
        <div key={index} className='field-error__message'>
          {error}
        </div>
      ))}
    </div>
  );
};

// Validation context for passing validation state down
export interface ValidationContextValue {
  errors: ValidationErrors;
  isValid: boolean;
  validate: (fieldName?: string) => boolean;
  validateAll: () => boolean;
  clearErrors: (fieldName?: string) => void;
  setFieldError: (fieldName: string, error: string) => void;
  hasError: (fieldName: string) => boolean;
  getFirstError: (fieldName: string) => string | null;
}

export const ValidationContext =
  React.createContext<ValidationContextValue | null>(null);

export const ValidationProvider: React.FC<{
  children: ReactNode;
  data: Record<string, unknown>;
  validation: FieldValidation;
  options?: {
    validateOnChange?: boolean;
    onValidationChange?: (isValid: boolean, errors: ValidationErrors) => void;
  };
}> = ({ children, data, validation, options = {} }) => {
  const validationResult = useFormValidation(data, validation, options);

  return (
    <ValidationContext.Provider value={validationResult}>
      {children}
    </ValidationContext.Provider>
  );
};

// Hook to use validation context
export const useValidation = (): ValidationContextValue => {
  const context = React.useContext(ValidationContext);
  if (!context) {
    throw new Error('useValidation must be used within a ValidationProvider');
  }
  return context;
};

// Quick validation functions for common use cases
export const quickValidation = {
  required: (message?: string): ValidationRule => ({
    required: true,
    message,
  }),

  email: (message?: string): ValidationRule => ({
    email: true,
    message,
  }),

  minLength: (length: number, message?: string): ValidationRule => ({
    minLength: length,
    message: message || `Must be at least ${length} characters`,
  }),

  maxLength: (length: number, message?: string): ValidationRule => ({
    maxLength: length,
    message: message || `Must be at most ${length} characters`,
  }),

  pattern: (pattern: RegExp, message?: string): ValidationRule => ({
    pattern,
    message: message || 'Invalid format',
  }),

  number: (message?: string): ValidationRule => ({
    number: true,
    message,
  }),

  range: (min: number, max: number, message?: string): ValidationRule => ({
    min,
    max,
    message: message || `Value must be between ${min} and ${max}`,
  }),

  custom: (
    validator: (value: unknown) => boolean | string,
    message?: string
  ): ValidationRule => ({
    custom: validator,
    message,
  }),
};

export default FormValidation;
