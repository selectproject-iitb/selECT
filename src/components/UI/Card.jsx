const Card = ({ children, className = "", padding = "p-5", ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
