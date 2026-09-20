import React, { useEffect, useState } from 'react';
import { Footer } from './components/layout/Footer';
import { Navbar, NavTab } from './components/layout/Navbar';
import { AreaIntelligencePage } from './pages/AreaIntelligencePage';
import { CitizenPortal } from './pages/CitizenPortal';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { GovernanceAuditPage } from './pages/GovernanceAuditPage';
import { ImpactVerificationPage } from './pages/ImpactVerificationPage';
import { IntelligenceCenterPage } from './pages/IntelligenceCenterPage';
import { ModelTransparencyPage } from './pages/ModelTransparencyPage';
import { PolicymakerDashboard } from './pages/PolicymakerDashboard';
import { PolicySimulatorPage } from './pages/PolicySimulatorPage';
import { ResponsibleAIPage } from './pages/ResponsibleAIPage';
import { apiService } from './services/api';
import { SupportedLanguage } from './types';

import { ProjectStory } from './components/ProjectStory/ProjectStory';
import { CinematicPrologue } from './components/ProjectStory/CinematicPrologue';

export const App: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('hi');
  const [currentTab, setCurrentTab] = useState<NavTab>('intelligence');
  const [selectedDistrictForArea, setSelectedDistrictForArea] = useState<string>('Lucknow');
  const [selectedClusterForSimulator, setSelectedClusterForSimulator] = useState<string>('CL-1041');
  const [isAiConnected, setIsAiConnected] = useState<boolean>(true);
  const [isStoryOpen, setIsStoryOpen] = useState<boolean>(false);
  const [isPrologueOpen, setIsPrologueOpen] = useState<boolean>(() => {
    // Only show prologue on first visit session
    return !sessionStorage.getItem('janniti_prologue_seen') && !localStorage.getItem('janniti_prologue_seen');
  });

  useEffect(() => {
    apiService.checkHealth().then((res) => {
      setIsAiConnected(res.geminiConfigured);
    });
  }, []);

  const handleClosePrologue = () => {
    sessionStorage.setItem('janniti_prologue_seen', 'true');
    localStorage.setItem('janniti_prologue_seen', 'true');
    setIsPrologueOpen(false);
  };

  const handleWatchFullStoryFromPrologue = () => {
    handleClosePrologue();
    setIsStoryOpen(true);
  };

  const handleNavigateToArea = (district: string) => {
    setSelectedDistrictForArea(district);
    setCurrentTab('areaintelligence');
  };

  const handleNavigateToSimulator = (clusterId: string) => {
    setSelectedClusterForSimulator(clusterId);
    setCurrentTab('simulator');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      {/* 5-8 Second Cinematic Prologue Movie Opening on First Visit */}
      <CinematicPrologue
        isOpen={isPrologueOpen}
        onClose={handleClosePrologue}
        onWatchFullStory={handleWatchFullStoryFromPrologue}
        currentLanguage={currentLanguage}
      />

      {/* DPI Navbar */}
      <Navbar
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isAiConnected={isAiConnected}
        onOpenVideoTour={() => setIsStoryOpen(true)}
      />

      {/* Fullscreen Cinematic Animated Short Film Modal (15 Continuous Acts, 10 Languages, Web Audio) */}
      <ProjectStory
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      {/* Main Views */}
      <main className="flex-1">
        {currentTab === 'citizen' && (
          <CitizenPortal
            currentLanguage={currentLanguage}
            onSwitchToPolicymaker={() => setCurrentTab('intelligence')}
          />
        )}

        {currentTab === 'intelligence' && (
          <IntelligenceCenterPage
            onNavigateToArea={handleNavigateToArea}
            onNavigateToSimulator={handleNavigateToSimulator}
            onOpenVideoStory={() => setIsStoryOpen(true)}
            currentLanguage={currentLanguage}
          />
        )}

        {currentTab === 'policymaker' && (
          <PolicymakerDashboard 
            onOpenVideoStory={() => setIsStoryOpen(true)}
            currentLanguage={currentLanguage}
          />
        )}

        {currentTab === 'areaintelligence' && (
          <AreaIntelligencePage
            initialDistrict={selectedDistrictForArea}
            onNavigateToSimulator={handleNavigateToSimulator}
          />
        )}

        {currentTab === 'simulator' && (
          <PolicySimulatorPage
            initialClusterId={selectedClusterForSimulator}
          />
        )}

        {currentTab === 'impact' && (
          <ImpactVerificationPage />
        )}

        {currentTab === 'governance' && (
          <GovernanceAuditPage />
        )}

        {currentTab === 'transparency' && (
          <ModelTransparencyPage />
        )}

        {currentTab === 'datasources' && (
          <DataSourcesPage />
        )}

        {currentTab === 'responsibleai' && (
          <ResponsibleAIPage />
        )}
      </main>

      {/* DPI Footer */}
      <Footer onTabChange={(tab: any) => setCurrentTab(tab)} />
    </div>
  );
};

export default App;
