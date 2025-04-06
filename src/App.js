import React, { useState } from 'react';
import FractalCanvas from './FractalCanvas';
import ColorPalette from './ColorPalette';
import './App.css';

function App() {
  const [selectedColor, setSelectedColor] = useState('#ff0000'); // Красный по умолчанию

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  return (
    <div className="App">
      <h1>Фрактальная Раскраска</h1>
      <div className="app-container">
        <FractalCanvas selectedColor={selectedColor} />
        <ColorPalette onColorChange={handleColorChange} selectedColor={selectedColor} />
      </div>
      <p className="instructions">Кликните по областям фрактала, чтобы раскрасить их.</p>
    </div>
  );
}

export default App;
