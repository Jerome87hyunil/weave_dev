'use client';

import React, { useState, useMemo } from 'react';
import TabNavigation, { Tab } from '@/components/ui/TabNavigation';
import TokenUsageDisplay from '@/components/ai-assistant/TokenUsageDisplay';
import {
  DataExtractionTab,
  DocumentGenerationTab,
  BusinessLookupTab,
  DocumentRequestTab,
  allTabConfigs
} from '@/components/tabs';
import type { ExtractedData, DocumentTemplate } from '@/components/ai-assistant/types';

export interface WeaveAssistantProps {
  // Configuration
  title?: string;
  subtitle?: string;
  showFooter?: boolean;
  showTokenUsage?: boolean;
  
  // Tab configuration
  enabledTabs?: string[];
  defaultTab?: string;
  
  // Callbacks
  onDataExtracted?: (data: ExtractedData) => void;
  onDocumentGenerated?: (document: DocumentTemplate) => void;
  onBusinessInfoFetched?: (info: unknown) => void;
  onRequestSent?: (request: unknown) => void;
  
  // Styling
  className?: string;
  containerClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export default function WeaveAssistant({
  title = 'Weave AI 비서',
  subtitle = '영수증 데이터 추출 및 문서 생성',
  showFooter = true,
  showTokenUsage = true,
  enabledTabs,
  defaultTab,
  onDataExtracted,
  onDocumentGenerated,
  onBusinessInfoFetched,
  onRequestSent,
  className = '',
  containerClassName = '',
  headerClassName = '',
  contentClassName = ''
}: WeaveAssistantProps) {
  // Filter tabs based on enabledTabs prop
  const availableTabs = useMemo(() => {
    if (!enabledTabs || enabledTabs.length === 0) {
      return allTabConfigs;
    }
    return allTabConfigs.filter(config => enabledTabs.includes(config.id));
  }, [enabledTabs]);

  // Convert to Tab format for TabNavigation
  const tabs: Tab[] = useMemo(() => 
    availableTabs.map(config => ({
      id: config.id,
      label: config.label,
      icon: <span>{config.icon}</span>
    })),
    [availableTabs]
  );

  // Set initial tab
  const initialTab = defaultTab && availableTabs.some(t => t.id === defaultTab) 
    ? defaultTab 
    : availableTabs[0]?.id || 'extract';

  const [activeTab, setActiveTab] = useState(initialTab);

  // Get current tab component
  const renderTabContent = () => {
    const tabConfig = availableTabs.find(config => config.id === activeTab);
    if (!tabConfig) return null;

    switch (tabConfig.id) {
      case 'extract':
        return <DataExtractionTab onDataExtracted={onDataExtracted} />;
      case 'generate':
        return <DocumentGenerationTab onDocumentGenerated={onDocumentGenerated} />;
      case 'business':
        return <BusinessLookupTab onBusinessInfoFetched={onBusinessInfoFetched} />;
      case 'email':
        return <DocumentRequestTab onRequestSent={onRequestSent} />;
      default:
        return null;
    }
  };

  return (
    <div className={`weave-assistant ${className}`}>
      <div className={`min-h-screen bg-gray-50 py-8 ${containerClassName}`}>
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <header className={`mb-8 ${headerClassName}`}>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600">
                {subtitle}
              </p>
            )}
          </header>

          {/* Main Content */}
          <main className={contentClassName}>
            {/* Tab Navigation */}
            {tabs.length > 1 && (
              <TabNavigation
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                className="mb-6"
              />
            )}
            
            {/* Tab Content */}
            <div className="tab-content">
              {renderTabContent()}
            </div>
          </main>

          {/* Footer */}
          {showFooter && (
            <footer className="mt-12 text-center text-sm text-gray-500">
              <p>© 2024 Weave - 프리랜서를 위한 통합 비즈니스 플랫폼</p>
            </footer>
          )}
        </div>
        
        {/* Token Usage Display */}
        {showTokenUsage && <TokenUsageDisplay />}
      </div>
    </div>
  );
}

// Export for easy standalone usage
export { allTabConfigs } from '@/components/tabs';
export type { TabConfig } from '@/components/tabs';