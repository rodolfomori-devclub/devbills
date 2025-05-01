// src/components/Button.tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

// Define as variantes visuais disponíveis
type ButtonVariant = "primary" | "outline" | "secondary" | "success" | "danger";

// Props do botão, estendendo todas as props nativas de <button>
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button = ({
  children,
  variant = "primary",
  fullWidth = false,
  isLoading = false,
  className = "",
  disabled,
  ...rest // repassa qualquer outra prop padrão de <button> (ex: onClick, type)
}: ButtonProps) => {
  // Define classes com base na variante escolhida
  const variantClass: string =
    {
      primary: "btn-primary",
      outline: "btn-outline",
      secondary: "btn-secondary",
      success: "btn-success",
      danger: "btn-danger",
    }[variant] || "btn-primary";

  // Renderiza o conteúdo com spinner se estiver carregando
  const renderLoading = () => (
    <div className="flex items-center justify-center">
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
        <title>Loading spinner</title>
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {children}
    </div>
  );

  return (
    <button
      className={`btn ${variantClass} ${fullWidth ? "w-full" : ""} ${
        isLoading || disabled ? "opacity-70 cursor-not-allowed" : ""
      } ${className}`}
      disabled={isLoading || disabled}
      {...rest}
    >
      {isLoading ? renderLoading() : children}
    </button>
  );
};

export default Button;
