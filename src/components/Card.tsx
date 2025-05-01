// src/components/Card.tsx
import type { ReactNode } from "react";

/**
 * Props for the Card component
 */
interface CardProps {
  /** Main content to be displayed inside the card */
  children: ReactNode;
  /** Optional card title */
  title?: string;
  /** Optional subtitle displayed below the title */
  subtitle?: string;
  /** Optional icon to display next to the title */
  icon?: ReactNode;
  /** Whether the card should have hover effects */
  hoverable?: boolean;
  /** Whether the card should have a glowing effect */
  glowEffect?: boolean;
  /** Additional CSS classes to apply */
  className?: string;
}

/**
 * A versatile Card component for displaying content in a contained box
 */
const Card = ({
  children,
  title,
  subtitle,
  icon,
  hoverable = false,
  glowEffect = false,
  className = "",
}: CardProps) => {
  // Build class names more cleanly with an array
  const classes = [
    "card", // Base card class
    hoverable ? "card-hover" : "", // Add hover effect if enabled
    glowEffect ? "glow" : "", // Add glow effect if enabled
    className, // Any additional custom classes
  ]
    .filter(Boolean)
    .join(" "); // Remove empty strings and join with spaces

  return (
    <div className={classes}>
      {/* Only render the header if there's a title or icon */}
      {(title || icon) && (
        <div className="flex items-center space-x-3 mb-4">
          {/* Icon container */}
          {icon && (
            <div className="p-2 bg-primary bg-opacity-10 rounded-xl flex items-center justify-center">
              {icon}
            </div>
          )}

          {/* Title and subtitle container */}
          {(title || subtitle) && (
            <div>
              {title && <h3 className="text-lg font-medium">{title}</h3>}
              {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
            </div>
          )}
        </div>
      )}

      {/* Card content */}
      <div>{children}</div>
    </div>
  );
};

export default Card;
