import React from "react";
import { cn } from "@/lib/utils"; // Utility to join class names conditionally

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"; // You can add more variants as needed
}

const Button: React.FC<ButtonProps> = ({ variant = "primary", className, children, ...props }) => {
  const baseStyle = "px-6 py-3 rounded-lg text-white font-semibold transition duration-200 ease-in-out";

  const variantStyles = {
    primary: "bg-teal-500 hover:bg-teal-600",
    secondary: "bg-gray-800 hover:bg-gray-700",
    outline: "border-2 border-teal-500 bg-transparent hover:bg-teal-500 text-teal-500 hover:text-white",
  };

  return (
    <button className={cn(baseStyle, variantStyles[variant], className)} {...props}>
      {children}
    </button>
  );
};

export { Button };
