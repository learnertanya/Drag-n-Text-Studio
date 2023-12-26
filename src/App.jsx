import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Text } from 'react-konva';

const App = () => {
  const [text, setText] = useState('Type your text here');
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textHistory, setTextHistory] = useState([{ text, textColor, fontSize, fontFamily }]);
  const [positionHistory, setPositionHistory] = useState([{ x: 0, y: 0 }]);
  const [currentStep, setCurrentStep] = useState(0);
  const stageRef = useRef(null);

  useEffect(() => {
    const newTextState = { text, textColor, fontSize, fontFamily };
    const newPositionState = { x: stageRef.current.findOne('Text').x(), y: stageRef.current.findOne('Text').y() };

    setTextHistory((prev) => [...prev.slice(0, currentStep + 1), newTextState]);
    setPositionHistory((prev) => [...prev.slice(0, currentStep + 1), newPositionState]);
    setCurrentStep((prev) => prev + 1);
  }, [text, textColor, fontSize, fontFamily]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleTextColorChange = (e) => {
    setTextColor(e.target.value);
  };

  const handleFontSizeChange = (e) => {
    setFontSize(parseInt(e.target.value, 10));
  };

  const handleFontFamilyChange = (e) => {
    setFontFamily(e.target.value);
  };

  const handleUndo = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      applyHistoryStep(currentStep - 1);
    }
  };

  const handleRedo = () => {
    if (currentStep < textHistory.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      applyHistoryStep(newStep);
    }
  };

  const handleTextDragEnd = (e) => {
    const newState = { x: e.target.x(), y: e.target.y() };
    setPositionHistory((prev) => [...prev.slice(0, currentStep + 1), newState]);
    setCurrentStep((prev) => prev + 1);
  };

  const applyHistoryStep = (step) => {
    const { text, textColor, fontSize, fontFamily } = textHistory[step];
    const { x, y } = positionHistory[step];

    setText(text);
    setTextColor(textColor);
    setFontSize(fontSize);
    setFontFamily(fontFamily);

    if (stageRef.current) {
      stageRef.current.findOne('Text').position({ x, y });
      stageRef.current.batchDraw();
    }
  };

  return (
    <div>
      <div>
        <label>Text:</label>
        <input type="text" value={text} onChange={handleTextChange} />
      </div>
      <div>
        <label>Text Color:</label>
        <input type="color" value={textColor} onChange={handleTextColorChange} />
      </div>
      <div>
        <label>Font Size:</label>
        <input type="number" value={fontSize} onChange={handleFontSizeChange} />
      </div>
      <div>
        <label>Font Family:</label>
        <select value={fontFamily} onChange={handleFontFamilyChange}>
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
      </div>
      <div>
        <button onClick={handleUndo} disabled={currentStep === 0}>
          Undo
        </button>
        <button onClick={handleRedo} disabled={currentStep === textHistory.length - 1}>
          Redo
        </button>
      </div>
      <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
        <Layer>
          <Text
            text={text}
            fill={textColor}
            fontSize={fontSize}
            fontFamily={fontFamily}
            draggable
            dragBoundFunc={(pos) => ({ x: pos.x, y: pos.y })}
            onDragEnd={handleTextDragEnd}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default App;
