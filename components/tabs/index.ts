// Import tab modules and their configs
import DataExtractionTab, { dataExtractionConfig } from './DataExtractionTab';
import DocumentGenerationTab, { documentGenerationConfig } from './DocumentGenerationTab';
import BusinessLookupTab, { businessLookupConfig } from './BusinessLookupTab';
import DocumentRequestTab, { documentRequestConfig } from './DocumentRequestTab';

// Re-export for convenience
export { 
  DataExtractionTab, 
  DocumentGenerationTab, 
  BusinessLookupTab, 
  DocumentRequestTab 
};

// Tab configuration types
export interface TabConfig {
  id: string;
  label: string;
  description: string;
  icon: string;
  component: React.ComponentType<unknown>;
}

// Export all tab configurations as an array for easy iteration
export const allTabConfigs = [
  dataExtractionConfig,
  documentGenerationConfig,
  businessLookupConfig,
  documentRequestConfig,
] as const;

// Helper to get tab config by id
export const getTabConfig = (id: string) => {
  return allTabConfigs.find(config => config.id === id);
};