// Utility function to get display name for category
export const getCategoryDisplayName = (category: string): string => {
  // Map category enum values to display names
  const categoryMap: Record<string, string> = {
    'FIFTY': '50',
    'HUNDRED': '100',
    'TWO_HUNDRED': '200',
    'THREE_HUNDRED': '300',
    'FOUR_HUNDRED': '400',
    'FIVE_HUNDRED': '500',
    'SIX_HUNDRED': '600',
    'EIGHT_HUNDRED': '800',
    'THOUSAND': '1000',
    // Add more mappings as needed
  };
  
  return categoryMap[category] || category;
};

// Utility function to get full display name with "proxies"
export const getCategoryFullName = (category: string): string => {
  const displayName = getCategoryDisplayName(category);
  return `${displayName} proxies`;
}; 