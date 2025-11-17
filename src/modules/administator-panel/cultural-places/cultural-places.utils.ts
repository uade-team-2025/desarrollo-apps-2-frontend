export const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'festival verde':
      return 'green';
    case 'centro cultural':
      return 'teal';
    case 'museo':
      return 'purple';
    case 'teatro':
      return 'red';
    case 'biblioteca':
      return 'green';
    case 'galería':
      return 'orange';
    default:
      return 'gray';
  }
};
