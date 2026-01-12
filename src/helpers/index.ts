/* eslint-disable prefer-const */

const COLOR_SUFFIX: { [key: number]: string } = {
    1: "One",
    2: "Two",
    3: "Three",
    4: "Four",
    5: "Five",
    6: "Six",
    7: "Seven",
    8: "Eight",
    9: "Nine",
    10: "Ten",
    11: "Eleven",
    12: "Twelve",
    13: "Thirteen",
    14: "Fourteen",
    15: "Fifteen",
}
export const rgbToHSL = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

export const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;
  
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const color = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0');
    };
  
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  export const hslToRGB = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;
  
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hPrime = h / 60;
    const x = c * (1 - Math.abs((hPrime % 2) - 1));
    let r = 0, g = 0, b = 0;
  
    if (hPrime >= 0 && hPrime < 1) {
      [r, g, b] = [c, x, 0];
    } else if (hPrime >= 1 && hPrime < 2) {
      [r, g, b] = [x, c, 0];
    } else if (hPrime >= 2 && hPrime < 3) {
      [r, g, b] = [0, c, x];
    } else if (hPrime >= 3 && hPrime < 4) {
      [r, g, b] = [0, x, c];
    } else if (hPrime >= 4 && hPrime < 5) {
      [r, g, b] = [x, 0, c];
    } else if (hPrime >= 5 && hPrime < 6) {
      [r, g, b] = [c, 0, x];
    }
  
    const m = l - c / 2;
    const color = `rgb(${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${ Math.round((b + m) * 255)})`
    return color
  };
  

export const parseColor = (color: string) => {
    color = color.trim().toLowerCase();

    const patterns = [
        {
            type: 'hex',
            regex: /^#?([0-9a-f]{3}|[0-9a-f]{6})$/,
            handler: (match: RegExpMatchArray) => {
                let hex = match[1];
                if (hex.length === 3) {
                    hex = hex.split('').map(c => c + c).join('');
                }
                const r = parseInt(hex.slice(0, 2), 16);
                const g = parseInt(hex.slice(2, 4), 16);
                const b = parseInt(hex.slice(4, 6), 16);
                return rgbToHSL(r, g, b);
            }
        },
        {
            type: 'rgb',
            regex: /^rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/,
            handler: (match: RegExpMatchArray) => {
                const r = parseFloat(match[1]);
                const g = parseFloat(match[2]);
                const b = parseFloat(match[3]);
                return rgbToHSL(r, g, b);
            }
        },
        {
            type: 'hsl',
            regex: /^hsl\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)$/,
            handler: (match: RegExpMatchArray) => {
                const h = parseFloat(match[1]);
                const s = parseFloat(match[2]);
                const l = parseFloat(match[3]);
                return { h, s, l };
            }
        }
    ];

    for (const pattern of patterns) {
        const match = color.match(pattern.regex);
        if (match) {
            return pattern.handler(match);
        }
    }

    throw new Error('Invalid color format');
}

export const generateGrayScales = (
    primaryColor: string,
    numShades = 10,
    baseSaturation = 1
  ): Record<
    string,
    {
      hsl: string;
      rgb: string;
      hex: string;
    }
  > => {
    const { h } = parseColor(primaryColor);
    const lightnessLevels = Array.from({ length: numShades }, (_, i) =>
      Math.round((100 / (numShades + 1)) * (i + 1))
    );
  
    const hue = Math.round(h);
    let saturation = baseSaturation;
  
    const hueAdjustments = [
      { range: [45, 75], factor: 0.5 },
      { range: [75, 165], factor: 0.7 },
    ];
  
    for (const { range, factor } of hueAdjustments) {
      if (hue >= range[0] && hue < range[1]) {
        saturation = Math.round(saturation * factor);
        break;
      }
    }
  
    return lightnessLevels.reduce((acc, lightness, i) => {
        if(i === 0 ) {
            acc[`grayFull`] = {
                hsl: `hsla(${hue}, ${saturation}%, ${lightness}%, 1)`,
                rgb: hslToRGB(hue, saturation, lightness),
                hex: hslToHex(hue, saturation, lightness),
              };
        } else {
            acc[`gray${COLOR_SUFFIX[i]}`] = {
              hsl: `hsla(${hue}, ${saturation}%, ${lightness}%, 1)`,
              rgb: hslToRGB(hue, saturation, lightness),
              hex: hslToHex(hue, saturation, lightness),
            };
        }
      return acc;
    }, {} as Record<string, { hsl: string; rgb: string; hex: string }>);
  };
  
  export const generateLighterColor = (color: string, baseName = "primary", numShades = 10) => {
    const baseHsl = parseColor(color);
    const { h, s, l} = baseHsl;

    const result: Record<string, { hsl: string; rgb: string; hex: string }> = {};

    result[baseName + "Full"] = {
        hsl: `hsla(${Math.round(h)}, ${Math.round(s * 10) / 10}%, ${Math.round(l * 10) / 10}%)`,
        rgb:  hslToRGB(h, s, l),
        hex:  hslToHex(h, s, l),
    };


    for (let i = 1; i <= numShades; i++) {
        const t = i / (numShades + 1);
        const lNew = l + t * (100 - l);
        const sNew = s * (1 - t);
        const shades = {
            hsl: `hsla(${Math.round(h)}, ${Math.round(sNew * 10) / 10}%, ${Math.round(lNew * 10) / 10}%)`,
            rgb:  hslToRGB(h, sNew, lNew),
            hex:  hslToHex(h, sNew, lNew),
        };
        result[`${baseName}${COLOR_SUFFIX[i]}`] = shades;
    }
    return result;
  }


  export const generateColorInHex = (colorShades: Record<string, { hsl: string; rgb: string; hex: string }>) => {
   return Object.entries(colorShades).reduce((acc, shade)=> {
        if(!Object.prototype.hasOwnProperty.call(acc, shade[0])) {
            acc[shade[0]] = shade[1].hex
        }
        return acc
    }, {} as Record<string, string>)
  }

