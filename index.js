const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, 
      // Important for using 'remote' module
    },
  });

  // Load your HTML file
  mainWindow.loadFile('index.html');

  // Create context menu
  const contextMenu = Menu.buildFromTemplate([
    { label: 'View', submenu: [
      { label: 'Sort by', click: () => handleSortBy() },
      { label: 'Group', click: () => handleGroup() },
    ]},
    { label: 'Create Folder', click: () => handleCreateFolder() },
  ]);

  // Attach context menu to mainWindow
  mainWindow.webContents.on('context-menu', (e, params) => {
    contextMenu.popup(mainWindow, params.x, params.y);
  });

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle IPC messages from renderer process
ipcMain.handle('createFolder', async (event, folderName) => {
  try {
    const folderPath = path.join(app.getPath('documents'), folderName);
    await fs.promises.mkdir(folderPath);
    return { success: true, message: 'Folder created successfully.' };
  } catch (error) {
    return { success: false, message: `Error creating folder: ${error.message}` };
  }
});

function handleSortBy() {
  // Implement sorting logic here
  // You can communicate with the renderer process to update the UI accordingly
}

function handleGroup() {
  // Implement grouping logic here
  // You can communicate with the renderer process to update the UI accordingly
}

function handleCreateFolder() {
  alert("CreateFolder")
  mainWindow.webContents.send('prompt-create-folder');
}
