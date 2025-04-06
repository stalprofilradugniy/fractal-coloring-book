import React, { useRef, useEffect } from 'react';
import './FractalCanvas.css';

function FractalCanvas({ selectedColor }) {
  const canvasRef = useRef(null);
  const fractalData = useRef(null); // Для хранения данных фрактала
  const width = 500;
  const height = 500;
  const maxIterations = 100; // Максимальное количество итераций для фрактала

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    const generateFractal = () => {
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      fractalData.current = []; // Инициализация для хранения данных фрактала

      for (let x = 0; x < width; x++) {
        fractalData.current[x] = []; // Инициализация строки
        for (let y = 0; y < height; y++) {
          const color = generateRandomFractalColor(x, y);
          const index = (y * width + x) * 4;
          data[index] = color.r;     // Красный
          data[index + 1] = color.g; // Зеленый
          data[index + 2] = color.b; // Синий
          data[index + 3] = 255;   // Альфа (непрозрачность)
          fractalData.current[x][y] = { originalColor: color, colored: false }; // Сохранение данных
        }
      }
      ctx.putImageData(imageData, 0, 0);
    };

    const generateRandomFractalColor = (x, y) => {
      // Простая логика для создания случайных, но фрактальных цветов
      const value = Math.sin(x * 0.05) * Math.cos(y * 0.05) * 128 + 128;
      const r = Math.floor(Math.random() * value);
      const g = Math.floor(Math.random() * (255 - value));
      const b = Math.floor(value);
      return { r, g, b };
    };

    generateFractal(); // Первоначальная генерация фрактала

    const handleClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((event.clientX - rect.left) * (width / rect.width));
      const y = Math.floor((event.clientY - rect.top) * (height / rect.height));

      if (x >= 0 && x < width && y >= 0 && y < height) {
        floodFill(ctx, x, y, selectedColor);
      }
    };

    const floodFill = (ctx, startX, startY, fillColorHex) => {
      const targetColor = getPixelColor(ctx, startX, startY); // Получаем цвет пикселя, на который кликнули
      if (!targetColor || areColorsEqual(hexToRgb(fillColorHex), targetColor) ) {
        return; // Ничего не делаем, если цвет уже такой же или пиксель за пределами изображения
      }

      const fillColorRgb = hexToRgb(fillColorHex);
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const stack = [[startX, startY]];

      while (stack.length) {
        const [x, y] = stack.pop();
        if (x < 0 || x >= width || y < 0 || y >= height) continue; // Выход за границы

        const pixelIndex = (y * width + x) * 4;
        const currentColor = { r: data[pixelIndex], g: data[pixelIndex + 1], b: data[pixelIndex + 2] };

        if (areColorsEqual(currentColor, targetColor) && !fractalData.current[x][y].colored) {
          data[pixelIndex] = fillColorRgb.r;
          data[pixelIndex + 1] = fillColorRgb.g;
          data[pixelIndex + 2] = fillColorRgb.b;
          fractalData.current[x][y].colored = true; // Отмечаем как раскрашенный

          stack.push([x + 1, y]); // Право
          stack.push([x - 1, y]); // Лево
          stack.push([x, y + 1]); // Низ
          stack.push([x, y - 1]); // Верх
        }
      }
      ctx.putImageData(imageData, 0, 0);
    };


    const getPixelColor = (ctx, x, y) => {
      const imageData = ctx.getImageData(x, y, 1, 1);
      const data = imageData.data;
      if (data.length === 0) return null; // Возвращаем null, если пиксель за пределами изображения
      return { r: data[0], g: data[1], b: data[2] };
    };

    const areColorsEqual = (color1, color2) => {
      return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b;
    };

    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };


    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('click', handleClick); // Очистка при размонтировании
    };
  }, [selectedColor]); // Зависимость от selectedColor, чтобы изменения цвета работали

  return (
    <canvas
      ref={canvasRef}
      className="fractal-canvas"
    />
  );
}

export default FractalCanvas;
