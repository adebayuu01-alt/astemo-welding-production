import React, { useState } from 'react';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PlanningProductionPage from './pages/PlanningProductionPage';
import NotificationPage from './pages/NotificationPage';
import MasterDataAreaPage from './pages/MasterDataAreaPage';
import MasterDataParameterPage from './pages/MasterDataParameterPage';
import MasterDataModelPage from './pages/MasterDataModelPage';
import RegisterModelPage from './pages/RegisterModelPage';
import SettingThresholdPage from './pages/SettingThresholdPage';

import {
  INITIAL_AREAS,
  INITIAL_PARAMETERS,
  INITIAL_THRESHOLDS,
  INITIAL_MODELS,
  INITIAL_REGISTER_MODELS,
  INITIAL_NOTIFICATIONS
} from './data/mockData';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // Application Data States
  const [areas, setAreas] = useState(INITIAL_AREAS);
  const [parameters, setParameters] = useState(INITIAL_PARAMETERS);
  const [thresholds, setThresholds] = useState(INITIAL_THRESHOLDS);
  const [models, setModels] = useState(INITIAL_MODELS);
  const [registerModels, setRegisterModels] = useState(INITIAL_REGISTER_MODELS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read && !n.isRead).length;

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActiveMenu('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleNavigate = (menu) => {
    if (menu === 'user-management' || menu === 'role-management') return;
    setActiveMenu(menu);
  };

  // If not logged in, render LoginPage
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Layout
      activeMenu={activeMenu}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      currentUser={currentUser}
      unreadCount={unreadCount}
    >
      {/* APPLICATION PAGES */}
      {activeMenu === 'dashboard' && (
        <DashboardPage
          areas={areas}
          thresholds={thresholds}
          onUpdateThresholds={setThresholds}
        />
      )}

      {activeMenu === 'planning-production' && (
        <PlanningProductionPage />
      )}

      {activeMenu === 'notification' && (
        <NotificationPage
          notifications={notifications}
          onUpdateNotifications={setNotifications}
        />
      )}

      {/* DATABASE PAGES */}
      {activeMenu === 'master-data-area' && (
        <MasterDataAreaPage
          areas={areas}
          onUpdateAreas={setAreas}
        />
      )}

      {activeMenu === 'master-data-parameter' && (
        <MasterDataParameterPage
          parameters={parameters}
          onUpdateParameters={setParameters}
        />
      )}

      {activeMenu === 'master-data-model' && (
        <MasterDataModelPage
          models={models}
          onUpdateModels={setModels}
        />
      )}

      {activeMenu === 'register-model' && (
        <RegisterModelPage
          registerModels={registerModels}
          onUpdateRegisterModels={setRegisterModels}
          availableModels={models}
          availableParameters={parameters}
        />
      )}

      {/* SETTING PAGES */}
      {activeMenu === 'setting-threshold' && (
        <SettingThresholdPage
          thresholds={thresholds}
          onUpdateThresholds={setThresholds}
          availableParameters={parameters.map((p) => p.parameter)}
        />
      )}
    </Layout>
  );
}
