export function Separator({ className = "", ...props }) {
  return (
    <hr className={`border-t border-gray-200 dark:border-gray-700 my-2 ${className}`} {...props} />
  );
}
