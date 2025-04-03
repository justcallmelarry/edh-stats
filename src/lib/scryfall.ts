async function getColorFromname(name: string): Promise<string[]> {
  try {
    const response = await fetch(`https://api.scryfall.com/cards/named?exact=${name}`);
    if (!response.ok) {
      console.error('Error fetching card data:', response.statusText);
      return [];
    }
    const cardData = await response.json();
    return cardData.color_identity || ['C'];
  } catch (error) {
    console.error('Error fetching card data:', error);
    return [];
  }
}

export async function getColors(deck: string): Promise<string[]> {
  let deckNames = deck.split(/\/+/).map((name) => name.trim());
  let colorSet = new Set<string>();

  for (let name of deckNames) {
    let colors = await getColorFromname(name);
    colors.forEach((c) => colorSet.add(c));
  }

  if (colorSet.size > 1 && colorSet.has('C')) {
    colorSet.delete('C');
  }

  let colors = Array.from(colorSet);
  return colors;
}
