import * as React from "react";

const Card = React.forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`bg-white dark:bg-zinc-900 rounded-xl shadow p-6 ${className}`} {...props} />
));
Card.displayName = "Card";

export const CardHeader = ({ className = "", ...props }) => (
  <div className={`mb-4 ${className}`} {...props} />
);

export const CardTitle = ({ className = "", ...props }) => (
  <h2 className={`text-xl font-bold ${className}`} {...props} />
);

export const CardContent = ({ className = "", ...props }) => (
  <div className={` ${className}`} {...props} />
);

export default Card;
