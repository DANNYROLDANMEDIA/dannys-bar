export interface Ingredient {
  amount: string;
  item: string;
}

export interface Cocktail {
  name: string;
  spirit: string;
  icon: string;
  method: string;
  verified: boolean;
  ingredients: Ingredient[];
  hasOptions?: {
    dirty?: boolean;
    spiritChoice?: string[];
  };
  dirtyIngredients?: Ingredient[];
}

export const cocktails: Cocktail[] = [
  { name: "Old Fashioned", spirit: "Bourbon", icon: "🧊", method: "Stir", verified: true, ingredients: [{ amount: "2 slices", item: "Orange" }, { amount: "3 dashes", item: "Orange bitters" }, { amount: "½ oz", item: "Maple syrup (or ¼–½ oz simple syrup)" }, { amount: "2 oz", item: "Bourbon" }] },
  { name: "Margarita", spirit: "Tequila", icon: "🍋‍🟩", method: "Shake & strain", verified: true, ingredients: [{ amount: "1 oz", item: "Lime juice" }, { amount: "½ oz", item: "Agave" }, { amount: "½ oz", item: "Triple sec" }, { amount: "2 oz", item: "Tequila" }] },
  { name: "Cosmopolitan", spirit: "Vodka", icon: "🍷", method: "Shake & strain", verified: true, ingredients: [{ amount: "¼ oz", item: "Lime juice" }, { amount: "1 oz", item: "Cranberry" }, { amount: "½ oz", item: "Triple sec" }, { amount: "1½ oz", item: "Absolut Citron" }] },
  { name: "French 47", spirit: "Gin", icon: "🥂", method: "Shake, pour, top champagne", verified: true, ingredients: [{ amount: "1 oz", item: "Gin" }, { amount: "½ oz", item: "Lemon juice" }, { amount: "½ oz", item: "Sugar syrup" }, { amount: "2 oz", item: "Champagne" }] },
  { name: "Rainbow Paradise", spirit: "Rum", icon: "🌈", method: "Layered", verified: true, ingredients: [{ amount: "3 oz", item: "Pineapple juice" }, { amount: "½ oz", item: "Grenadine" }, { amount: "2 oz", item: "Coconut rum" }, { amount: "1 oz", item: "Blue Curaçao" }] },
  { name: "Tequila Sunrise", spirit: "Tequila", icon: "🌅", method: "Layered", verified: true, ingredients: [{ amount: "3 oz", item: "OJ" }, { amount: "2 oz", item: "Tequila" }, { amount: "1 oz", item: "Grenadine" }] },
  { name: "Pineapple Tequila Smash", spirit: "Tequila", icon: "🍍", method: "Shake", verified: true, ingredients: [{ amount: "2 oz", item: "Tequila" }, { amount: "2 oz", item: "Pineapple juice" }, { amount: "½ oz", item: "Lime juice" }, { amount: "Splash", item: "Agave" }] },
  { name: "Vodka Cranberry", spirit: "Vodka", icon: "🍒", method: "Build", verified: true, ingredients: [{ amount: "1 part", item: "Vodka" }, { amount: "2 parts", item: "Cranberry" }] },
  { name: "B-52 Shot", spirit: "Liqueur", icon: "🔥", method: "Layered", verified: true, ingredients: [{ amount: "⅓ oz", item: "Kahlúa" }, { amount: "⅓ oz", item: "Baileys" }, { amount: "⅓ oz", item: "Grand Marnier" }] },
  { name: "Malibu Pineapple", spirit: "Rum", icon: "🥥", method: "Build", verified: true, ingredients: [{ amount: "4 oz", item: "Pineapple juice" }, { amount: "2 oz", item: "Malibu" }, { amount: "1 oz", item: "White rum" }] },
  { name: "Godfather", spirit: "Whiskey", icon: "🎩", method: "Build", verified: true, ingredients: [{ amount: "1½ oz", item: "Scotch" }, { amount: "½ oz", item: "Amaretto" }] },
  { name: "White Russian", spirit: "Vodka", icon: "🥛", method: "Build & stir", verified: true, ingredients: [{ amount: "1 part", item: "Kahlúa" }, { amount: "2 parts", item: "Vodka" }, { amount: "1 part", item: "Heavy cream" }] },
  { name: "Moscow Mule", spirit: "Vodka", icon: "🫚", method: "Shake", verified: false, ingredients: [{ amount: "1½ oz", item: "Vodka" }, { amount: "4 oz", item: "Ginger beer" }, { amount: "⅓ oz", item: "Lime juice" }] },
  { name: "Manhattan", spirit: "Whiskey", icon: "🏙️", method: "Stir & strain", verified: false, ingredients: [{ amount: "1¾ oz", item: "Rye whiskey" }, { amount: "⅔ oz", item: "Sweet vermouth" }, { amount: "1 dash", item: "Angostura" }] },
  { name: "Espresso Martini", spirit: "Vodka", icon: "☕", method: "Shake & strain", verified: false, ingredients: [{ amount: "1¾ oz", item: "Vodka" }, { amount: "1 oz", item: "Kahlúa" }, { amount: "⅓ oz", item: "Sugar syrup" }, { amount: "1 oz", item: "Espresso" }] },
  { name: "Mudslide", spirit: "Vodka", icon: "🍫", method: "Shake or blend", verified: false, ingredients: [{ amount: "1 part", item: "Kahlúa" }, { amount: "1 part", item: "Absolut" }, { amount: "1 part", item: "Irish Cream" }] },
  { name: "Whiskey Sour", spirit: "Bourbon", icon: "🍋", method: "Shake & strain", verified: false, ingredients: [{ amount: "1½ oz", item: "Bourbon" }, { amount: "¾ oz", item: "Lemon juice" }, { amount: "1 oz", item: "Simple syrup" }] },
  { name: "Dark 'n' Stormy", spirit: "Rum", icon: "🌩️", method: "Build", verified: false, ingredients: [{ amount: "2 oz", item: "Gosling's rum" }, { amount: "3¼ oz", item: "Ginger beer" }] },
  { name: "Sidecar", spirit: "Cognac", icon: "🥃", method: "Shake & strain", verified: false, ingredients: [{ amount: "1½ oz", item: "Cognac" }, { amount: "½ oz", item: "Triple sec" }, { amount: "½ oz", item: "Lemon juice" }] },
  { name: "Love on the Beach", spirit: "Vodka", icon: "🍑", method: "Build", verified: false, ingredients: [{ amount: "1½ oz", item: "Vodka" }, { amount: "¾ oz", item: "Peach schnapps" }, { amount: "1½ oz", item: "OJ" }, { amount: "1½ oz", item: "Cranberry" }] },
  { name: "Spiced Rum Punch", spirit: "Rum", icon: "🍹", method: "Shake", verified: false, ingredients: [{ amount: "2 oz", item: "Captain Morgan" }, { amount: "1 oz", item: "Pineapple juice" }, { amount: "1 oz", item: "OJ" }, { amount: "½ oz", item: "Grenadine" }, { amount: "½ oz", item: "Lime" }] },
  { name: "Captain & Ginger", spirit: "Rum", icon: "⛵", method: "Build", verified: false, ingredients: [{ amount: "2 oz", item: "Captain Morgan" }, { amount: "4–5 oz", item: "Ginger beer" }] },
  { name: "Spiked Hot Chocolate", spirit: "Liqueur", icon: "🍫", method: "Stir", verified: false, ingredients: [{ amount: "2 oz", item: "Baileys" }, { amount: "3 oz", item: "Hot chocolate" }, { amount: "Top", item: "Whipped cream" }] },
  { name: "Spiced Rum Old Fashioned", spirit: "Rum", icon: "🏴‍☠️", method: "Stir", verified: false, ingredients: [{ amount: "2 oz", item: "Captain Morgan" }, { amount: "¼ oz", item: "Demerara syrup" }, { amount: "2 dashes", item: "Angostura" }] },
  { name: "Martini", spirit: "Gin/Vodka", icon: "🍸", method: "Stir & strain", verified: true,
    hasOptions: { dirty: true, spiritChoice: ["Gin", "Vodka"] },
    ingredients: [{ amount: "2½ oz", item: "Gin or Vodka" }, { amount: "½ oz", item: "Dry vermouth" }],
    dirtyIngredients: [{ amount: "2½ oz", item: "Gin or Vodka" }, { amount: "½ oz", item: "Dry vermouth" }, { amount: "½ oz", item: "Olive brine" }],
  },
];

export const spiritColors: Record<string, string> = {
  Bourbon: "#d4872e",
  Tequila: "#a8b545",
  Vodka: "#9ab8d4",
  Gin: "#7ec8a0",
  "Gin/Vodka": "#8ab4b2",
  Rum: "#c47a5a",
  Whiskey: "#c9953c",
  Cognac: "#b5784e",
  Liqueur: "#b07aaa",
};
