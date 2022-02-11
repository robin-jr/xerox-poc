const { app, BrowserWindow, ipcMain, dialog, Menu, } = require('electron')
const fs = require('fs')
const path = require('path')
const os = require('os')

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true
		}
	})
	win.loadFile('index.html')
	const menu = Menu.buildFromTemplate([
		{
			label: app.name,
			submenu: [
				{
					click: () => win.webContents.send('update-counter', 1),
					label: "Increment"
				},
				{
					click: () => win.webContents.send('update-counter', -1),
					label: "Decrement"
				}
			],
		}
		, {
			label: 'Reload',
			accelerator: 'Command+R',
			click: () => {
				console.log("reloaded");
				win.webContents.reload();
			},

		}
	])
	Menu.setApplicationMenu(menu)
	win.webContents.openDevTools();
}


app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

function handleSetTitle(event, title) {
	const webContents = event.sender
	const win = BrowserWindow.fromWebContents(webContents)
	win.setTitle(title)
	console.log("new title set ", title);
}
async function handleFileOpen() {
	const { canceled, filePaths } = await dialog.showOpenDialog();
	if (canceled) {
		return "cancelled";
	}
	return filePaths[0];
}

async function handlePrint(event) {
	const win = new BrowserWindow({ width: 800, height: 600 })
	win.loadURL('http://google.com')
	// win.loadURL('https://bit.ly/3f9DWzQ');

	win.webContents.on('did-finish-load', () => {
		// Use default printing options
		const pdfPath = path.join(os.homedir(), 'Desktop', 'temp1.pdf')
		try {
			win.webContents.print((success, errorType) => {
				if (!success) console.log(errorType)
			})
		} catch (error) {
			console.log("severe ", error);
		}
		// win.webContents.printToPDF({printBackground:true}).then(data => {
		// 	fs.writeFile(pdfPath, data, (error) => {
		// 		if (error) throw error
		// 		console.log(`Wrote PDF successfully to ${pdfPath}`)
		// 	})
		// }).catch(error => {
		// 	console.log(`Failed to write PDF to ${pdfPath}: `, error)
		// })
	})
	// const options = {
	// 	silent: true,
	// 	pageRanges: [{
	// 		from: 0,
	// 		to: 1
	// 	}]
	// }
	// const win = BrowserWindow.fromWebContents(event.sender);

	// win.webContents.print(options,(success, reason) => {
	// 	if (success) {
	// 		console.log("success");
	// 	} else {
	// 		console.log(reason);
	// 	}
	// });
}
async function getPrinters(event) {
	var win = BrowserWindow.fromWebContents(event.sender);
	const res = await win.webContents.getPrintersAsync();
	// console.log(res);
	return res;
}

app.whenReady().then(() => {
	ipcMain.on('counter-value', (_event, value) => {
		console.log(value) // will print value to Node console
	})
	createWindow()
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
	ipcMain.on('set-title', handleSetTitle)
	ipcMain.handle('dialog:openFile', handleFileOpen)
	ipcMain.on('print', handlePrint)
	ipcMain.handle('getPrinters', getPrinters);
})
