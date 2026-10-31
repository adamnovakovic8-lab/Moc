// Every photo lives in src/assets/photos and is referenced by its path
// inside that folder, e.g. "builds/princess/side.jpg". Astro turns each one
// into resized AVIF/WebP files at build time.
const files = import.meta.glob('/src/assets/photos/**/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });

export function photo(path) {
  const img = files[`/src/assets/photos/${path}`];
  if (!img) throw new Error(`Photo not found: src/assets/photos/${path}`);
  return img;
}

export function hasPhoto(path) {
  return Boolean(files[`/src/assets/photos/${path}`]);
}
