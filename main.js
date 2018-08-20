const electron = require('electron')
const path = require('path')
const url = require('url')
const windowStateKeeper = require('electron-window-state')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow () {
  let mainWindowState = windowStateKeeper()
  
  mainWindow = new BrowserWindow({
    width: 400, 
    height: 290,
    x: mainWindowState.x,
    y: mainWindowState.y,
    frame: false,
    backgroundColor: '#011A27',
    icon: './images/metronome.ico',
    resizable: false,
    show: false
  })

  mainWindow.setMenu(null);

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindowState.manage(mainWindow)
  
  mainWindow.webContents.openDevTools({mode: 'detach'})

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})