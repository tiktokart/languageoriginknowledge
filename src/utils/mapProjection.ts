
export const projectLatLongToXY = (latitude: number, longitude: number, width: number, height: number): [number, number] => {
  const x = (longitude + 180) * (width / 360);
  const y = (90 - latitude) * (height / 180);
  return [x, y];
};
