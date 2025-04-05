export function sortColors(colors: Array<string>) {
  const colorOrder = ['W', 'U', 'B', 'R', 'G', 'C'];
  return colors.sort((a, b) => colorOrder.indexOf(a) - colorOrder.indexOf(b));
}
