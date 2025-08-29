export function Badge({ children, variant = "secondary", className = "" }) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variants = {
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700",
    primary: "bg-blue-500 text-white",
    success: "bg-green-500 text-white",
    danger: "bg-red-500 text-white",
  };
  return (
    <span className={`${base} ${variants[variant] || ""} ${className}`}>{children}</span>
  );
}
