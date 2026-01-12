import { useState, type ChangeEvent } from 'react';
import './App.css'
import { generateGrayScales, generateLighterColor } from './helpers'
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const [mainColor, setMainColor] = useState('rgb(23,86,139)')
  const [secondaryColor, setSecondaryColor] = useState('rgb(80, 159, 239)')

  const color = "rgb(23,86,139)"
  const secondary = "rgb(80, 159, 239)"
  const grays = generateGrayScales(mainColor, 15)
  const mainColors = generateLighterColor(mainColor, undefined, 15)
  const secondaryColors = generateLighterColor(secondaryColor, "secondary", 15)

  const copyColorToClipboard = (value: string) => {
    if (value === undefined || value === null) return false;

    const text = String(value);

    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.success('Copied')
          return true
        })
        .catch(() => false);
    }


    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;

      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      textarea.style.left = "-9999px";

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success('Copied')
      return successful;
    } catch {
      return false;
    }
  }
  const changeColor = (color: string, type: 'primary' | 'secondary') => {

    if (type === 'secondary') {
      setSecondaryColor(color)
      return
    }
    setMainColor(color)
  }

  const HEX_COLOR_REGEX =
    /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;


  const isBrowserValidColor = (value: string): boolean => {
    const style = new Option().style;
    style.color = '';
    style.color = value;
    return style.color !== '';
  };

  const isValidHexColor = (value: string): boolean =>
    HEX_COLOR_REGEX.test(value) && isBrowserValidColor(value);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'primary' | 'secondary') => {
    const value = e.target.value.trim();

    if (!isValidHexColor(value)) {
      return;
    }

    changeColor(value, type);
  }
  return (
    <div className='flex gap-2'>
      <div>
        <div className='flex flex-col gap-2'>
          <span>Primary Color:</span>
          <input
            className='border-2 border-gray-400 p-2'
            type="text"
            name="primary-color"
            id=""
            onChange={(e) => handleChange(e, 'primary')}
            pattern="^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$"
          />
        </div>
        <div className='flex flex-col gap-2'>
          <span>Secondary Color:</span>
          <input
            className='border-2 border-gray-400 p-2'
            type="text"
            name="primary-color"
            id=""
            onChange={(e) => handleChange(e, 'secondary')}
            pattern="^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$"
          />
        </div>
      </div>
      <div className=''>
        GRAY:
        color: <div className='box' style={{ backgroundColor: mainColor }}></div>
        <div>Shades...</div>
        {Object.values(grays).map(gray => (
          <div className={`box`} style={{ backgroundColor: gray.hex, cursor: 'pointer' }} key={gray.hex} onClick={() => copyColorToClipboard(gray.hex)} />
        ))}
      </div>
      <div>
        MAIN:
        color: <div className='box' style={{ backgroundColor: mainColor }}></div>
        <div>Shades...</div>
        {Object.entries(mainColors).map(color => (
          <div className={`box`} style={{ backgroundColor: color[1].hex, cursor: 'pointer' }} key={color[1].hex} onClick={() => copyColorToClipboard(color[1].hex)}>
            {color[0]}
          </div>
        ))}
      </div>
      <div>
        SECONDARY:
        color: <div className='box' style={{ backgroundColor: secondaryColor }}></div>
        <div>Shades...</div>
        {Object.entries(secondaryColors).map(color => (
          <div className={`box`} style={{ backgroundColor: color[1].hex, cursor: 'pointer' }} key={color[1].hex} onClick={() => copyColorToClipboard(color[1].hex)}>
            {color[0]}
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  )
}

export default App
