import React from "react";
import Button from "./Button";

interface LengthSettingProps {
  title: string;
  length: number;
  onIncrease: () => void;
  onDecrease: () => void;
  isDisabled: boolean;
}

const LengthSetting: React.FC<LengthSettingProps> = ({
  title,
  length,
  onIncrease,
  onDecrease,
  isDisabled,
}) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="flex items-center space-x-4">
        <Button onClick={onDecrease} variant="default" disabled={isDisabled}>
          Decrease
        </Button>
        <span className="text-xl">{length}</span>
        <Button onClick={onIncrease} variant="default" disabled={isDisabled}>
          Increase
        </Button>
      </div>
    </div>
  );
};

export default LengthSetting;
// This component can be used in any part of your Next.js application.
