const images = import.meta.glob('../assets/images/**/*', { eager: true });

export const dynamicImage = (image: string | undefined): string | undefined => {
  if (!image) return undefined;

  const key = `../assets/images/${image}`;
  if (images[key]) {
    return (images[key] as any).default;
  } else {
    console.error(`Image not found: ${key}`);
    return undefined;
  }
};

export const frontendDynamicImage = dynamicImage;
