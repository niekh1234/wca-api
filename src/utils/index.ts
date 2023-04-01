export const slugify = (str: string, lower = true) => {
  const slug = str.replace(/[^\w ]+/g, '').replace(/ +/g, '-');

  if (lower) {
    return slug.toLowerCase();
  }

  return slug;
};
