import { useEffect, useState } from "react";

type AddFlowProgressProps = {
  stepLabel: string;
  stepTitle: string;
  from: number;
  to: number;
};

const AddFlowProgress = ({ stepLabel, stepTitle, from, to }: AddFlowProgressProps) => {
  const [progress, setProgress] = useState(from);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setProgress(to);
    }, 40);

    return () => window.clearTimeout(timer);
  }, [to]);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <span className="font-label text-sm font-semibold text-[#4d44e3] uppercase tracking-widest">{stepLabel}</span>
        <span className="font-label text-sm text-[#586064]">{stepTitle}</span>
      </div>
      <div className="h-2 w-full bg-[#e2e9ec] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#4d44e3] to-[#d2d0ff] transition-[width] duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default AddFlowProgress;
