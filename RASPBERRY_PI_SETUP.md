# Raspberry Pi 5 HDMI Monitor Setup Guide

## Overview

This guide provides instructions for optimizing the Cation application to run smoothly on a Raspberry Pi 5 with an HDMI monitor. The application has been enhanced with responsive design and performance optimizations specifically for Raspberry Pi hardware.

## Hardware Requirements

- Raspberry Pi 5 (recommended) or Raspberry Pi 4 with at least 4GB RAM
- HDMI monitor (1080p recommended, 720p minimum)
- Mouse and keyboard or touchscreen input

## Software Setup

### 1. Install Required Software

```bash
# Update your Raspberry Pi
sudo apt update
sudo apt upgrade -y

# Install Node.js and npm
sudo apt install -y nodejs npm

# Install PostgreSQL (for the backend)
sudo apt install -y postgresql postgresql-contrib

# Install Chromium browser (optimized for Raspberry Pi)
sudo apt install -y chromium-browser
```

### 2. Configure PostgreSQL

Follow the instructions in the `LOCAL_DB_SETUP.md` file to set up the local PostgreSQL database.

### 3. Clone and Set Up the Application

```bash
# Clone the repository (if you haven't already)
git clone https://your-repository-url.git
cd cation

# Install dependencies
npm install

# Set up the database
cd server
npm run setup-local-db
```

## Performance Optimizations

The application includes several optimizations for Raspberry Pi:

1. **Automatic Detection**: The app automatically detects when it's running on a Raspberry Pi and applies optimized settings.

2. **Responsive Design**: The 3D viewer adjusts its rendering quality and UI based on the screen size and device capabilities.

3. **Performance Monitoring**: Press the 'P' key to toggle a performance monitor that shows FPS (frames per second).

4. **Touch Controls**: Optimized touch controls for Raspberry Pi touchscreens.

## Running the Application

### Start the Backend Server

```bash
cd server
npm start
```

### Start the Frontend Development Server

```bash
# In a new terminal, from the project root
npm run dev
```

### Access the Application

Open Chromium browser and navigate to:

```
http://localhost:5173
```

## Troubleshooting

### Performance Issues

If you experience performance issues:

1. Make sure you're using the Chromium browser, which is optimized for Raspberry Pi.

2. Close other applications to free up memory and CPU resources.

3. If the 3D viewer is still slow, you can modify the settings in `src/config/raspberryPi.js` to further reduce quality for better performance:
   - Reduce `maxTextureSize` to 512
   - Set `precision` to 'lowp'
   - Set `shadowMapEnabled` to false

### Display Issues

If the display doesn't fit your screen properly:

1. Check your Raspberry Pi display settings:
   ```bash
   sudo raspi-config
   ```
   Navigate to Display Options and ensure the resolution matches your monitor.

2. If using a touchscreen, calibrate it using:
   ```bash
   sudo apt install -y xinput-calibrator
   xinput_calibrator
   ```

## Additional Notes

- The application is optimized for landscape orientation. If using a portrait display, you may need to adjust your Raspberry Pi display settings.

- For best performance, use a Raspberry Pi 5 with active cooling.

- The 3D viewer will automatically adjust its quality based on the performance of your device.

- To exit fullscreen mode, press Alt+F4 or Ctrl+W.