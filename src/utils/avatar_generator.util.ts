export const generateAvatar = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hexColor = (hash & 0x00ffffff).toString(16).toUpperCase();
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${hexColor}&color=ffffff&size=128`;

  return avatarUrl;
};
