// component to control the timer
// displays two buttons: one to start/pause (primary style) and the other to reset (danger style)
// props: isRunning, onStartPause, onReset
// uses ./button.txt component

import React from "react";
import Button from "./Button";

interface ControlsProps {
  isRunning: boolean;
  onStartPause: () => void;
  onReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isRunning,
  onStartPause,
  onReset,
}) => (
  <div className="flex justify-center space-x-4">
    <Button
      onClick={onStartPause}
      variant="primary"
    >
      {isRunning ? "Pause" : "Start"}
    </Button>
    <Button
      onClick={onReset}
      variant="danger"
    >
      Reset
    </Button>
  </div>
);

export default Controls;
// This component can be used in any part of your Next.js application.