"use client";

import { motion, type Transition, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";

const LABEL_TRANSITION: Transition = {
  duration: 0.28,
  ease: [0.4, 0, 0.2, 1],
};

export interface AnimatedInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  type?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  icon?: React.ReactNode;
}

export default function AnimatedInput({
  value,
  defaultValue = "",
  onChange,
  onFocus,
  onBlur,
  label,
  placeholder = "",
  disabled = false,
  required = false,
  name,
  type = "text",
  className = "",
  inputClassName = "",
  labelClassName = "",
  icon,
}: AnimatedInputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputId = useId();
  const isControlled = value !== undefined;
  const val = isControlled ? value : internalValue;
  const isFloating = !!val || isFocused;
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative flex items-center ${className}`}>
      {icon && (
        <span
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        >
          {icon}
        </span>
      )}

      <input
        id={inputId}
        aria-label={label}
        name={name}
        type={type}
        disabled={disabled}
        required={required}
        value={val}
        placeholder={isFloating ? placeholder : ""}
        onFocus={() => {
          setIsFocused(true);
          onFocus?.();
        }}
        onBlur={() => {
          setIsFocused(false);
          onBlur?.();
        }}
        onChange={(e) => {
          if (!isControlled) {
            setInternalValue(e.target.value);
          }
          onChange?.(e.target.value);
        }}
        className={`peer h-12 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-200 disabled:opacity-50 ${icon ? "pl-10" : ""} ${inputClassName}`}
      />

      <motion.label
        htmlFor={inputId}
        className={`pointer-events-none absolute left-3 top-1/2 origin-left -translate-y-1/2 rounded bg-white px-1 text-gray-500 ${labelClassName}`}
        animate={
          shouldReduceMotion
            ? undefined
            : isFloating
              ? { y: -24, scale: 0.85, color: "rgb(236 72 153)" }
              : { y: 0, scale: 1, color: "rgb(107 114 128)" }
        }
        style={
          shouldReduceMotion
            ? isFloating
              ? {
                  transform: "translateY(-24px) scale(0.85)",
                  color: "rgb(236 72 153)",
                }
              : {
                  transform: "translateY(0) scale(1)",
                  color: "rgb(107 114 128)",
                }
            : undefined
        }
        transition={shouldReduceMotion ? { duration: 0 } : LABEL_TRANSITION}
      >
        {label}
      </motion.label>
    </div>
  );
}
