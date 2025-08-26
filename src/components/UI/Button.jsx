import { Link } from "react-router-dom";

const Button = ({
  children,
  to,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-3 focus:ring-primary/25 focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary text-white hover:bg-accent",
    outline:
      "border border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-primary hover:bg-gray-100",
  };
  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-10 px-5 text-sm",
    lg: "h-11 px-6 text-base",
  };
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {loading && (
          <span
            className="animate-spin border-2 border-gray-200 border-t-primary rounded-full w-4 h-4 mr-2"
            aria-hidden="true"
          ></span>
        )}
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={cls}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          className="animate-spin border-2 border-gray-200 border-t-primary rounded-full w-4 h-4 mr-2"
          aria-hidden="true"
        ></span>
      )}
      {children}
    </button>
  );
};

export default Button;
