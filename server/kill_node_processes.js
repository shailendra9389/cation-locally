// // kill_node_processes.js
// // Script to kill all Node.js processes

// import { exec } from 'child_process';
// import os from 'os';

// // Determine the OS platform
// const isWindows = os.platform() === 'win32';

// // Command to list and kill Node.js processes based on OS
// const command = isWindows
//   ? 'taskkill /F /IM node.exe'
//   : 'pkill -f node';

// console.log('Attempting to kill all Node.js processes...');

// exec(command, (error, stdout, stderr) => {
//   if (error) {
//     console.error(`Error: ${error.message}`);
//     return;
//   }
  
//   if (stderr) {
//     console.error(`Error: ${stderr}`);
//     return;
//   }
  
//   console.log(`Success: ${stdout}`);
//   console.log('All Node.js processes have been terminated.');
// });