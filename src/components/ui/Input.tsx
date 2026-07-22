import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, leftIcon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col w-full text-left gap-1">
        {label && (
          <label className="text-xs text-vibe-light-gray font-medium tracking-wide uppercase">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full h-14 bg-vibe-card border border-vibe-border rounded-xl px-4 focus-within:border-vibe-volt/50 transition-colors">
          {leftIcon && (
            <div className="flex items-center justify-center text-vibe-gray mr-3">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-transparent text-vibe-offwhite placeholder-vibe-gray text-sm focus:outline-none h-full ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="flex items-center justify-center text-vibe-gray ml-3 cursor-pointer">
              {rightIcon}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
