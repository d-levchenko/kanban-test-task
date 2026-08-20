export const generateHashId = (input: string): string => {
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return Math.abs(hash).toString(16).padStart(8, '0');
};

export const generateIndexId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
