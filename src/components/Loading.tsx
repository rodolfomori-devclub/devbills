// src/components/Loading.tsx
import type { FC } from "react";

type LoadingSize = "small" | "medium" | "large";

interface LoadingProps {
  size?: LoadingSize;
  fullScreen?: boolean;
  text?: string;
}

const Loading: FC<LoadingProps> = ({
  size = "medium",
  fullScreen = false,
  text = "Carregando...",
}) => {
  const sizeClasses: Record<LoadingSize, string> = {
    small: "w-5 h-5",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const loadingContent = (
    <div className="flex flex-col items-center justify-center">
      <svg
        className={`animate-spin ${sizeClasses[size]} text-primary`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Carregando"
        aria-busy="true"
      >
        <title>Ícone de carregamento</title>
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

      {text && <p className="mt-2 text-sm text-text-muted">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background bg-opacity-80 flex items-center justify-center z-50">
        {loadingContent}
      </div>
    );
  }

  return loadingContent;
};

export default Loading;
