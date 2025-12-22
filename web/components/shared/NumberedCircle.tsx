import { Check } from "lucide-react";

interface NumberedCircleProps {
  number: number;
  size?: number;
  isActive?: boolean;
  isCompleted?: boolean;
  className?: string;
}

export const NumberedCircle = ({ 
  number, 
  size = 24, 
  isActive = false, 
  isCompleted = false,
  className = "" 
}: NumberedCircleProps) => {
  // If active, always use purple styling (even if completed)
  // If completed but not active, use green styling
  // Otherwise, use default styling
  const getClassName = () => {
    if (isActive) {
      return "border-primary bg-primary text-primary-foreground";
    } else if (isCompleted) {
      return "border-green-500 bg-green-500 text-white";
    } else {
      return "border-primary/20 bg-white text-[#9260d2]";
    }
  };

  // Show checkmark if completed (whether active or not)
  // Otherwise show the number
  const showCheckmark = isCompleted;

  return (
    <div
      className={`flex items-center justify-center rounded-full border-1 border-white transition-colors relative ${getClassName()} ${className}`}
      style={{ width: size, height: size }}
    >
      {showCheckmark ? (
        <Check className="h-3 w-3" />
      ) : (
        <span className="text-sm font-bold">{number}</span>
      )}
    </div>
  );
};

