import React from 'react';
import './ColorPalette.css';

function ColorPalette({ onColorChange, selectedColor }) {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff']; // 7 основных цветов

  return (
    <div className="color-palette">
      {colors.map((color) => (
        <div
          key={color}
          className={`color-swatch ${selectedColor === color ? 'selected' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => onColorChange(color)}
        ></div>
      ))}
    </div>
  );
}

export default ColorPalette;
