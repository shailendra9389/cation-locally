/**
 * Raspberry Pi 5 Performance Configuration
 * 
 * This file contains settings optimized for running the application
 * on a Raspberry Pi 5 with HDMI monitor output.
 */

const RASPBERRY_PI_CONFIG = {
  // Rendering settings
  rendering: {
    // Default pixel ratio (1 for performance, can be increased for better quality)
    pixelRatio: 1,
    
    // Limit framerate to improve performance
    maxFrameRate: 30,
    
    // Use lower precision for better performance
    precision: 'mediump',
    
    // Reduce shadow map size for better performance
    shadowMapSize: 1024,
    
    // Disable certain effects on low-power mode
    disableEffectsOnLowPower: true,
    
    // Texture size limits
    maxTextureSize: 1024
  },
  
  // Display settings
  display: {
    // Common Raspberry Pi HDMI resolutions
    resolutions: {
      hdmi720p: { width: 1280, height: 720 },
      hdmi1080p: { width: 1920, height: 1080 },
      hdmiDefault: { width: 1920, height: 1080 }
    },
    
    // Default resolution to use
    defaultResolution: 'hdmi1080p',
    
    // Aspect ratio handling
    maintainAspectRatio: true,
    
    // Screen orientation
    orientation: 'landscape'
  },
  
  // Input settings optimized for Raspberry Pi touchscreens
  input: {
    // Touch sensitivity
    touchRotateSensitivity: 1.5,
    touchZoomSensitivity: 1.0,
    touchPanSensitivity: 1.0,
    
    // Mouse sensitivity
    mouseRotateSensitivity: 1.0,
    mouseZoomSensitivity: 1.0,
    mousePanSensitivity: 1.0,
    
    // Enable/disable specific input methods
    enableTouch: true,
    enableMouse: true,
    enableKeyboard: true
  },
  
  // Performance monitoring
  performance: {
    // Enable FPS counter for debugging
    showFPS: false,
    
    // Enable performance monitoring
    enableMonitoring: false,
    
    // Automatically adjust quality based on performance
    enableAdaptiveQuality: true,
    
    // FPS thresholds for quality adjustment
    targetFPS: 30,
    lowFPSThreshold: 20
  },
  
  // Detect if running on Raspberry Pi
  isRaspberryPi: () => {
    // Check for Raspberry Pi specific user agent or screen dimensions
    // This is a simple heuristic and may need adjustment
    const userAgent = navigator.userAgent.toLowerCase();
    const isARM = /arm/.test(userAgent);
    const isLinux = /linux/.test(userAgent);
    
    // Check for typical Raspberry Pi screen dimensions
    const { width, height } = window.screen;
    const isTypicalResolution = (
      (width === 1920 && height === 1080) || // HDMI 1080p
      (width === 1280 && height === 720) ||  // HDMI 720p
      (width === 800 && height === 480)      // Official 7" touchscreen
    );
    
    return (isARM && isLinux) || isTypicalResolution;
  },
  
  // Apply optimal settings based on device detection
  getOptimalSettings: () => {
    const isRPi = RASPBERRY_PI_CONFIG.isRaspberryPi();
    
    // Return optimized settings if on Raspberry Pi
    if (isRPi) {
      return {
        pixelRatio: 1,
        precision: 'mediump',
        shadowMapEnabled: false,
        antialias: false,
        frameloop: 'demand'
      };
    }
    
    // Return higher quality settings for more powerful devices
    return {
      pixelRatio: window.devicePixelRatio,
      precision: 'highp',
      shadowMapEnabled: true,
      antialias: true,
      frameloop: 'always'
    };
  }
};

export default RASPBERRY_PI_CONFIG;