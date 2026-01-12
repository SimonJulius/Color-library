import './App.css'
import { generateColorInHex, generateGrayScales, generateLighterColor } from './helpers'
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const color = "rgb(23,86,139)"
  const secondary = "rgb(80, 159, 239)"
  const grays = generateGrayScales(color, 15)
  const mainColors = generateLighterColor(color, undefined, 15)
  const secondaryColors = generateLighterColor(secondary, "secondary", 15)
  const hexGray = generateColorInHex(grays)
  console.log({ grays, mainColors, hexGray, secondaryColors })

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
  return (
    <div className='flex gap-2'>
      <div className=''>
        GRAY:
        color: <div className='box' style={{ backgroundColor: color }}></div>
        <div>Shades...</div>
        {Object.values(grays).map(gray => (
          <div className={`box`} style={{ backgroundColor: gray.hex, cursor: 'pointer'}} key={gray.hex} onClick={() => copyColorToClipboard(gray.hex)} />
        ))}
      </div>
      <div>
        MAIN:
        color: <div className='box' style={{ backgroundColor: color }}></div>
        <div>Shades...</div>
        {Object.entries(mainColors).map(color => (
          <div className={`box`} style={{ backgroundColor: color[1].hex, cursor: 'pointer' }} key={color[1].hex} onClick={() => copyColorToClipboard(color[1].hex)}>
            {color[0]}
          </div>
        ))}
      </div>
      <div>
        SECONDARY:
        color: <div className='box' style={{ backgroundColor: secondary }}></div>
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
