


import { useState } from "react";
import { 
  Bot, 
  Lightbulb, 
  Zap, 
  Thermometer, 
  Activity,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  Users,
  Box
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const MetricCard = ({ icon, label, value, unit, subtitle }) => (
  <Card className="p-4 bg-dashboard-card border-dashboard-blue/20">
    <div className="flex items-center gap-3 mb-2">
      <div className="text-dashboard-blue">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-dashboard-text">{label}</p>
      </div>
    </div>
    <div className="space-y-1">
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold text-dashboard-text">{value}</span>
        {unit && <span className="text-sm text-dashboard-muted">{unit}</span>}
      </div>
      {subtitle && (
        <p className="text-xs text-dashboard-muted">{subtitle}</p>
      )}
    </div>
  </Card>
);

export const DashboardSidebar = ({ activeView = '3d', onViewChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [motorIntensity, setMotorIntensity] = useState(0.00);
  const [dataRate1] = useState(60000);
  const [dataRate2] = useState(0);
  const [temperature] = useState(21.2);
  const [electricalPower] = useState(0.00);
  const [electricalPowerHeat] = useState(0.00);
  const [electricalPowerGlobal] = useState(0.00);

  const handleToggle = () => setIsCollapsed(!isCollapsed);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpen}
        className="fixed top-25 left-4 z-50 text-dashboard-text hover:bg-dashboard-blue/10 bg-dashboard-bg border border-dashboard-blue/20 bg-gray-400 "
      >
        <div className="mt-0 ml-0">
          <Menu className="h-4 w-4" />
        </div>
      </Button>
    );
  }

  return (
    <div className={`bg-gray-800 border-r border-dashboard-blue/20 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    } h-screen flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-dashboard-blue/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-dashboard-text text-white">Control Panel</h2>
          )}
          <div className="flex items-center gap-2">
            {!isCollapsed && (
              <Button
              text="white"
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-dashboard-text hover:bg-dashboard-blue/10 bg-white"
              >
                <X className="h-4 w-4 bg-white" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggle}
              className="text-dashboard-text hover:bg-dashboard-blue/10 bg-white"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {isCollapsed ? (
          // Collapsed view - just icons
          <div className="space-y-4">
            <div 
              onClick={() => onViewChange('3d')} 
              className={`cursor-pointer p-2 rounded-full  bg-white ${activeView === '3d' ? 'bg-dashboard-blue/20' : ''}`}
            >
              <Box className="h-6 w-6 text-dashboard-blue mx-auto" />
            </div>
            <div 
              onClick={() => onViewChange('users')} 
              className={`cursor-pointer p-2 rounded-full ${activeView === 'users' ? 'bg-dashboard-blue/20' : ''}`}
            >
              <Users className="h-6 w-6 text-dashboard-blue mx-auto" />
            </div>
            <Bot className="h-6 w-6 text-dashboard-blue mx-auto" />
            <Lightbulb className="h-6 w-6 text-dashboard-accent mx-auto" />
            <Activity className="h-6 w-6 text-dashboard-blue mx-auto" />
            <Thermometer className="h-6 w-6 text-dashboard-blue mx-auto" />
            <Zap className="h-6 w-6 text-dashboard-blue mx-auto" />
            <BarChart3 className="h-6 w-6 text-dashboard-blue mx-auto" />
          </div>
        ) : (
          // Full view
          <div className="space-y-4">
            {/* Navigation */}
            <div className="mb-6 space-y-2">
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${activeView === '3d' ? 'bg-dashboard-blue/20' : ''} hover:bg-dashboard-blue/10 text-dashboard-text bg-white`}
                onClick={() => onViewChange('3d')}
              >
                <Box className="h-5 w-5 mr-2 b" />
                3D Viewer
              </Button>
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${activeView === 'users' ? 'bg-dashboard-blue/20' : ''} hover:bg-dashboard-blue/10 text-dashboard-text bg-white`}
                onClick={() => onViewChange('users')}
              >
                <Users className="h-5 w-5 mr-2" />
                User Management
              </Button>
            </div>
            
            {/* Robot Control Section */}
            <Card className="p-4 bg-dashboard-card border-dashboard-blue/20">
              <div className="flex items-center gap-3 mb-4">
                <Bot className="h-8 w-8 text-dashboard-blue" />
                <div>
                  <h3 className="font-medium text-dashboard-text">Robot Control</h3>
                  <p className="text-xs text-dashboard-muted">System Status</p>
                </div>
              </div>
              <div className="space-y-2">
                <Progress value={75} className="h-2" />
                <p className="text-xs text-dashboard-muted">Operational: 75%</p>
              </div>
            </Card>

            {/* Data Rates */}
            <div className="grid grid-cols-1 gap-3">
              <MetricCard
                icon={<BarChart3 className="h-5 w-5" />}
                label="Data Rate 1"
                value={dataRate1.toLocaleString()}
                unit="b/h"
              />
              <MetricCard
                icon={<BarChart3 className="h-5 w-5" />}
                label="Data Rate 2"
                value={dataRate2.toString()}
                unit="b/h"
              />
            </div>

            {/* Status Indicator */}
            {/* <Card className="p-4 bg-dashboard-card border-dashboard-blue/20">
              <div className="flex items-center justify-center">
                <Lightbulb className="h-8 w-8 text-dashboard-accent" />
              </div>
            </Card> */}

            {/* Motor Intensity */}
            <MetricCard
              icon={<Activity className="h-5 w-5" />}
              label="Motor Intensity"
              value={motorIntensity.toFixed(2)}
              unit="A"
            />

            {/* Temperature */}
            <MetricCard
              icon={<Thermometer className="h-5 w-5" />}
              label="Preform Temperature"
              value={temperature.toFixed(1)}
              unit="°C"
            />

            {/* Electrical Power Metrics */}
            <MetricCard
              icon={<Zap className="h-5 w-5" />}
              label="Electrical Power"
              value={electricalPower.toFixed(2)}
              unit="Wh/b"
            />

            <MetricCard
              icon={<Zap className="h-5 w-5" />}
              label="Electrical Power Heat"
              value={electricalPowerHeat.toFixed(2)}
              unit="Wh/b"
            />

            {/* <MetricCard
              icon={<Zap className="h-5 w-5" />}
              label="Electrical Power Global"
              value={electricalPowerGlobal.toFixed(2)}
              unit="KW"
            /> */}

            {/* Navigation */}
           
            
           
          </div>
        )}
      </div>
    </div>
  );
};

