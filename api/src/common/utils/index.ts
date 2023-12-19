export const stripHtml = (message: string) => {
  const regex = /(<([^>]+)>)/gi;
  return message?.replace(regex, '');
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
