interface IObjectKeys {
  [key: number]: string;
}

const ACCENTS: IObjectKeys = {
  0: "Aguda",
  1: "Grave (Llana)",
  2: "Esdrújula",
  3: "Sobresdrújula",
};

export default (position: number): string => ACCENTS[position] || ACCENTS[3];
