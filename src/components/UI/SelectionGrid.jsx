import Card from "./Card";

const SelectionGrid = ({
  title,
  options,
  selectedValue,
  onSelect,
  columns = 3,
}) => {
  const gridCols =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="space-y-3 sm:space-y-4">
      {title && (
        <h4 className="text-base sm:text-lg font-semibold text-gray-800">
          {title}
        </h4>
      )}
      <div className={`grid ${gridCols} gap-3 sm:gap-4`}>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => !opt.disabled && onSelect(opt.value)}
            disabled={opt.disabled}
            className={`text-left focus:outline-none focus:ring-2 focus:ring-primary rounded-xl ${
              opt.disabled ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            <Card
              className={`border transition-all duration-200 p-4 sm:p-5 ${
                selectedValue === opt.value
                  ? "border-primary shadow-lg shadow-primary/25"
                  : opt.disabled
                  ? "border-gray-200 bg-gray-50"
                  : "border-gray-200 hover:border-primary hover:shadow-lg"
              }`}
            >
              {opt.image && (
                <img
                  src={opt.image || "/placeholder.svg"}
                  alt={opt.label}
                  className="w-full h-48 sm:h-56 object-cover"
                />
              )}
              {/* <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm sm:text-base">
                  {opt.label}
                </div>
                {opt.description && (
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">
                    {opt.description}
                  </div>
                )}
              </div> */}

              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm sm:text-base">
                  {opt.label}
                  {opt.disabled && (
                    <p className="text-xs text-gray-500 font-normal ">
                      Coming Soon
                    </p>
                  )}
                </div>
                {opt.description && (
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">
                    {opt.description}
                  </div>
                )}
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectionGrid;
