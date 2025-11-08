export const formatDateBR = (isoDate: string) => {
  return  new Date(isoDate).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};