
export const getFamilyColor = (family: string): string => {
  const colorMap: Record<string, string> = {
    'Indo-European': '#FF5733',
    'Sino-Tibetan': '#33FF57',
    'Niger-Congo': '#3357FF',
    'Austronesian': '#FF33A8',
    'Afro-Asiatic': '#33FFF5',
    'Dravidian': '#FFD700',
    'Turkic': '#9932CC',
    'Uralic': '#FF4500',
    'Japonic': '#00FF00',
    'Koreanic': '#FF00FF',
    'Tai-Kadai': '#1E90FF',
    'Mongolic': '#FF8C00',
    'Hmong-Mien': '#FF1493',
    'Austroasiatic': '#00BFFF',
    'Language Isolate': '#964B00',
    'Na-Dene': '#BA55D3', 
    'Algic': '#008080',
    'Iroquoian': '#800000',
    'Uto-Aztecan': '#F08080',
    'Eskimo-Aleut': '#4682B4',
    'Arawakan': '#D2691E',
    'Quechuan': '#556B2F',
    'Tupian': '#8B008B',
    'Carib': '#A0522D',
    'Aymaran': '#6B8E23',
    'Pama-Nyungan': '#483D8B',
    'Nilo-Saharan': '#CD853F',
    'Atlantic-Congo': '#008B8B',
    'Mande': '#BDB76B',
    'Mayan': '#8FBC8F',
    'Mixe-Zoque': '#E9967A',
    'Otomanguean': '#F4A460',
    'Salishan': '#2E8B57',
    'Siouan': '#BC8F8F',
  };

  // Fallback: generate a deterministic color for unknown families
  if (!colorMap[family]) {
    let hash = 0;
    for (let i = 0; i < family.length; i++) {
      hash = family.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = Math.abs(hash).toString(16).substring(0, 6).padEnd(6, '0');
    return `#${color}`;
  }

  return colorMap[family];
};
