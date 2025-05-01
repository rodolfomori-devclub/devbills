// src/components/Card.tsx
import type { ReactNode } from "react";

// Tipagem das props que o componente Card aceita
interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  hoverable?: boolean;
  glowEffect?: boolean;
  className?: string;
}

const Card = ({
  children,
  title,
  subtitle,
  icon,
  hoverable = false,
  glowEffect = false,
  className = "",
}: CardProps) => {
  // Classes dinâmicas para aplicar efeitos visuais
  const cardClasses = ["card", hoverable && "card-hover", glowEffect && "glow", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClasses}>
      {(title || icon) && (
        <div className="flex items-center space-x-3 mb-4">
          {icon && (
            <div className="p-2 bg-primary bg-opacity-10 rounded-xl flex items-center justify-center">
              {icon}
            </div>
          )}
          <div>
            {title && <h3 className="text-lg font-medium">{title}</h3>}
            {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Conteúdo do cartão (componente filho) */}
      <div>{children}</div>
    </div>
  );
};

export default Card;
