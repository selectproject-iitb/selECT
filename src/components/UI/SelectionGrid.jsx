import ImageSelectionGrid from "./ImageSelectionGrid";
import TextSelectionGrid from "./TextSelectionGrid";

const SelectionGrid = ({
  title,
  options,
  selectedValue,
  onSelect,
  columns = 3,
}) => {
  const hasImages = options.some((opt) => opt.image);

  if (hasImages) {
    return (
      <ImageSelectionGrid
        title={title}
        options={options}
        selectedValue={selectedValue}
        onSelect={onSelect}
        columns={columns}
      />
    );
  }

  return (
    <TextSelectionGrid
      title={title}
      options={options}
      selectedValue={selectedValue}
      onSelect={onSelect}
      columns={columns}
    />
  );
};

export default SelectionGrid;
