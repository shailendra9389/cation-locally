


import React, { useState, useEffect } from 'react';
import { RotateCcw, Waves, Syringe, Package, RotateCw, Wrench, Lock, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import axios from 'axios';

const Footer = ({ userLevel: propUserLevel }) => {
  const [userLevel, setUserLevel] = useState("guest");
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [lastChecked, setLastChecked] = useState(null);

  const checkAccess = (level, key) => {
    const accessMap = {
      engineer: ['temperature_control', 'hopper', 'injection_control', 'rotate_reset'],
      operator: ['bottle_rotate', 'door_lock', 'rotate_reset'],
      maintenance: ['clamp_control', 'alarm', 'rotate_reset', 'temperature_control'],
      admin: ['temperature_control', 'hopper', 'bottle_rotate', 'door_lock', 'clamp_control', 'alarm', 'injection_control', 'rotate_reset']
    };
    if (!level || !accessMap[level]) return false;
    return accessMap[level].includes(key);
  };

  const handleError = (context, error) => {
    console.error(`Error in Footer component (${context}):`, error);
  };
  
  const checkConnectionStatus = async () => {
    try {
      const healthEndpoint = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
      const response = await axios.get(`${healthEndpoint}/health`, { timeout: 5000 });
      setConnectionStatus(response.data.database === 'Connected' ? 'connected' : 'disconnected');
    } catch (error) {
      handleError('health check', error);
      setConnectionStatus('disconnected');
    } finally {
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkConnectionStatus();
    const intervalId = setInterval(checkConnectionStatus, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const updateUIForUserLevel = (level) => {
    if (!level) return;
    setUserLevel(level.toLowerCase());
  };
  
  useEffect(() => {
    if (propUserLevel) {
      updateUIForUserLevel(propUserLevel);
    } else {
      try {
        const userDataStr = localStorage.getItem("user");
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          if (userData?.userLevel) updateUIForUserLevel(userData.userLevel);
        } else {
          const token = localStorage.getItem("authToken");
          if (token) {
            try {
              const payload = token.split('.')[1];
              const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
              const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
              const decodedText = atob(paddedBase64);
              const decodedPayload = JSON.parse(decodedText);
              if (decodedPayload?.userLevel) {
                updateUIForUserLevel(decodedPayload.userLevel);
                localStorage.setItem("user", JSON.stringify({
                  id: decodedPayload.userId,
                  name: decodedPayload.name,
                  userLevel: decodedPayload.userLevel
                }));
              }
            } catch (err) {
              handleError('decoding token', err);
            }
          }
        }
      } catch (err) {
        handleError('reading localStorage', err);
      }
    }
  }, [propUserLevel]);

  const handleControlClick = (item) => {
    if (checkAccess(userLevel, item.key)) {
      alert(`${item.label} control activated by ${userLevel} user`);
    } else {
      alert(`Access denied: Your user level (${userLevel}) does not have permission to use ${item.label}`);
    }
  };
  
  const footerItems = [
    { icon: RotateCcw, label: 'Rotate/Reset', key: 'rotate_reset' },
    { icon: Waves, label: 'Temperature Control', key: 'temperature_control' },
    { icon: Syringe, label: 'Injection Control', key: 'injection_control' },
    { icon: Package, label: 'Feeder/Hopper', key: 'hopper' },
    { icon: RotateCw, label: 'Bottle Rotate', key: 'bottle_rotate' },
    { icon: Wrench, label: 'Clamp Control', key: 'clamp_control' },
    { icon: Lock, label: 'Door Lock/Unlock', key: 'door_lock' },
    { icon: AlertTriangle, label: 'Alarm/Error', key: 'alarm' }
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-slate-700 to-slate-900 border-t border-slate-600 shadow-lg">
      <div className="flex flex-col px-2 py-0.5">
        
        {/* User level indicator */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <span className="text-xs text-gray-400 mr-2">Access Level:</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${userLevel === 'admin' ? 'bg-purple-900 text-purple-200' : 
              userLevel === 'engineer' ? 'bg-blue-900 text-blue-200' : 
              userLevel === 'maintenance' ? 'bg-yellow-900 text-yellow-200' : 
              userLevel === 'operator' ? 'bg-green-900 text-green-200' : 
              'bg-gray-800 text-gray-400'}`}>
              {userLevel.charAt(0).toUpperCase() + userLevel.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          {/* Connection status indicator */}
          <div className="flex items-center gap-x-1 leading-tight">
            {connectionStatus === 'connected' ? (
              <Wifi size={14} className="text-green-400" />
            ) : connectionStatus === 'disconnected' ? (
              <WifiOff size={14} className="text-red-400 animate-pulse" />
            ) : (
              <Wifi size={14} className="text-yellow-400 animate-pulse" />
            )}
            <span className="text-xs text-gray-300">
              {connectionStatus === 'connected' ? 'Connected' : 
              connectionStatus === 'disconnected' ? 'Connection Error' : 'Checking...'}
            </span>
            {lastChecked && (
              <span className="text-xs text-gray-500 ml-1">
                {`Last checked: ${lastChecked.toLocaleTimeString()}`}
              </span>
            )}
          </div>
          
          {/* Control buttons */}
          <div className="flex items-center space-x-2">
            {footerItems.map((item) => {
              const Icon = item.icon;
              const canAccess = checkAccess(userLevel, item.key);

              return (
                <div
                  key={item.key}
                  className={`flex items-center justify-center w-14 h-12 rounded-md transition-colors
                    ${canAccess
                      ? 'text-blue-400 hover:text-white hover:bg-slate-600 cursor-pointer'
                      : 'text-gray-500 opacity-50 cursor-not-allowed'
                    }`}
                  title={canAccess ? item.label : `${item.label} (Restricted)`}
                  onClick={() => handleControlClick(item)}
                >
                  <Icon size={28} strokeWidth={2} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Debug info */}
      {import.meta.env.DEV && (
        <div className="bg-gray-900 border-t border-gray-800 px-4 py-1">
          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer hover:text-gray-400">Debug Info</summary>
            <div className="mt-1 space-y-1">
              <p>User Level: {userLevel}</p>
              <p>Connection: {connectionStatus}</p>
              <p>Last Checked: {lastChecked?.toLocaleTimeString()}</p>
            </div>
          </details>
        </div>
      )}
    </footer>
  );
};

export default Footer;
