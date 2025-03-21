export const getTagColor = (tag: string) => {
  const tagLower = tag.toLowerCase();
  if (tagLower === 'release') return 'bg-green-600 hover:bg-green-700';
  if (tagLower === 'maintenance' || tagLower === 'onderhoud') return 'bg-orange-600 hover:bg-orange-700';
  if (tagLower === 'update') return 'bg-blue-600 hover:bg-blue-700';
  if (tagLower === 'artikel') return 'bg-indigo-600 hover:bg-indigo-700';
  return 'bg-purple-600 hover:bg-purple-700';
};
