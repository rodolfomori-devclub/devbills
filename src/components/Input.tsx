// src/components/Input.tsx
import { type InputHTMLAttributes, forwardRef, type ReactNode, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

/**
 * Componente de input reutilizável que suporta rótulos, ícones e mensagens de erro
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, fullWidth = true, className = "", id, ...rest }, ref) => {
    // Cria um ID único para acessibilidade quando não fornecido
    const generatedId = useId();
    const inputId = id || generatedId;

    // Determina as classes a serem aplicadas ao input
    const inputClasses = [
      "input",
      icon ? "pl-10" : "",
      error ? "border-danger focus:border-danger focus:ring-danger" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={`${fullWidth ? "w-full" : ""} mb-4`}>
        {/* Rótulo do campo */}
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}

        <div className="relative">
          {/* Ícone do campo (se fornecido) */}
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none text-muted">
              {icon}
            </div>
          )}

          {/* Elemento input */}
          <input
            id={inputId}
            ref={ref}
            type={rest.type ?? "text"}
            className={inputClasses}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...rest}
          />
        </div>

        {/* Mensagem de erro (se houver) */}
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);

// Nome de exibição para debugging e DevTools
Input.displayName = "Input";

export default Input;
