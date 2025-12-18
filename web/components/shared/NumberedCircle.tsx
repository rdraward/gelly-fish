interface NumberedCircleProps {
  number: number;
  size?: number;
  isActive?: boolean;
  className?: string;
}

export const NumberedCircle = ({ number, size = 24, isActive = false, className = "" }: NumberedCircleProps) => {
  return (
    <div
      className={`flex items-center justify-center rounded-full border-1 border-white transition-colors ${
        isActive 
          ? "border-primary bg-primary text-primary-foreground" 
          : "border-primary/20 bg-white text-[#9260d2]"
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="text-sm font-bold">{number}</span>
    </div>
  );
};

