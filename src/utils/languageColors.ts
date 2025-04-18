
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
  };

  return colorMap[family] || '#FFFFFF';
};
