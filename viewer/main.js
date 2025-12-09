const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // In development, load from Vite dev server
  // In production, load from dist/index.html
  // For simplicity in this setup, we'll assume we build first or run concurrently.
  // But to support "npm start" running both, we need to wait for vite or just load the file if it exists.
  
  // A common pattern is to check an env var or just try to load localhost.
  // Let's try to load the built file first, as that's more robust for the "npm start" command I'll write.
  // Actually, for a better dev experience, we usually want localhost.
  
  // Let's just load the file from dist for now to ensure it works without a complex wait-on setup.
  // The user can run "npm run dev" if they want hot reload, but I'll set up "npm start" to build and run.
  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  
  // If you want to use dev server:
  // mainWindow.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'JSON Files', extensions: ['json'] }]
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    const content = fs.readFileSync(result.filePaths[0], 'utf-8');
    return { path: result.filePaths[0], content: JSON.parse(content) };
  }
  return null;
});
