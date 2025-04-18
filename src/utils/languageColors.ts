
export const getFamilyColor = (family: string): string => {
  const colorMap: Record<string, string> = {
    'Indo-European': '#5D9CEC',     // Soft Blue
    'Sino-Tibetan': '#48CFAD',      // Mint Green
    'Niger-Congo': '#FC6E51',       // Soft Red
    'Austronesian': '#EC87C0',      // Soft Pink
    'Afro-Asiatic': '#4A89DC',      // Deep Blue
    'Dravidian': '#F6BB42',         // Warm Yellow
    'Turkic': '#8E44AD',            // Rich Purple
    'Uralic': '#E9573F',            // Bright Orange
    'Japonic': '#37BC9B',           // Teal
    'Koreanic': '#D770AD',          // Bright Pink
    'Tai-Kadai': '#3BAFB9',         // Turquoise
    'Mongolic': '#F6B042',          // Golden Yellow
    'Hmong-Mien': '#967ADC',        // Lavender
    'Austroasiatic': '#3BAFB9',     // Turquoise
    'Language Isolate': '#AC92EC',  // Soft Purple
    'Na-Dene': '#ED5565',           // Coral
    'Algic': '#4FC1E9',             // Sky Blue
    'Iroquoian': '#A0D468',         // Lime Green
    'Uto-Aztecan': '#EC87C0',       // Soft Pink
    'Eskimo-Aleut': '#5D9CEC',      // Soft Blue
  };

  // Generate a more vibrant, deterministic color for unknown families
  if (!colorMap[family]) {
    let hash = 0;
    for (let i = 0; i < family.length; i++) {
      hash = family.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 80%, 65%)`; // More saturated and brighter colors
  }

  return colorMap[family];
};
