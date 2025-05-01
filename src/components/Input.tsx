import { type InputHTMLAttributes, forwardRef, type ReactNode, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, fullWidth = true, className = "", ...rest }, ref) => {
    const inputId = useId(); // Cria um ID único para acessibilidade

    return (
      <div className={`${fullWidth ? "w-full" : ""} mb-4`}>
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none text-muted">
              {icon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={rest.type ?? "text"}
            className={`input ${icon ? "pl-10" : ""} ${
              error ? "border-danger focus:border-danger focus:ring-danger" : ""
            } ${className}`}
            {...rest}
          />
        </div>

        {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
