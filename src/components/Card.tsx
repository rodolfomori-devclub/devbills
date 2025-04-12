import { ReactNode } from 'react';

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
  className = '' 
}: CardProps) => {
  return (
    <div className={`
      card 
      ${hoverable ? 'card-hover' : ''} 
      ${glowEffect ? 'glow' : ''}
      ${className}
    `}>
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
      <div>{children}</div>
    </div>
  );
};

export default Card;