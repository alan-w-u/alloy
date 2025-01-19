import React, { useState } from "react";

const NewHangout = () => {
  // State to manage the visibility of the popup
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // State to store the selected values from the dropdowns
  const [selectedGroup, setSelectedGroup] = useState("group1");
  const [selectedSize, setSelectedSize] = useState("small");

  // Toggle popup visibility
  const handleButtonClick = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  // Handle group selection
  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
  };

  // Handle size selection
  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log("Selected Group:", selectedGroup);
    console.log("Selected Size:", selectedSize);

    // Optionally, close the popup after submission
    setIsPopupVisible(false);
  };

  return (
    <div>
      {/* Button to toggle the popup */}
      <button onClick={handleButtonClick}>
        Select Group and Size
      </button>

      {/* Pop-up (visible only when isPopupVisible is true) */}
      {isPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <label htmlFor="groupSelect">Select Group:</label>
            <select
              id="groupSelect"
              value={selectedGroup}
              onChange={handleGroupChange}
            >
              <option value="group1">Group 1</option>
              <option value="group2">Group 2</option>
              <option value="group3">Group 3</option>
            </select>

            <label htmlFor="sizeSelect">Select Size:</label>
            <select
              id="sizeSelect"
              value={selectedSize}
              onChange={handleSizeChange}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>

            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewHangout;
