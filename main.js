const electron = require('electron');

const url = require('url');

const path = require('path');


const {app, BrowserWindow, Menu, ipcMain} = electron;


let mainWindow;

let addItemWindow;


// liste
app.on('ready', function () {
    // add browser window into main window
    mainWindow = new BrowserWindow({});
    //// load html file into main window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

//     on close methods when main window close all sub windows should closed

    mainWindow.on('close', function () {
        app.quit()
    })

//    build menu from template
    const mainMenu = Menu.buildFromTemplate(menuTemplate)

    Menu.setApplicationMenu(mainMenu)

});


ipcMain.on('item:add', function (e, item) {
    console.log('This is your Item now we will send it to index.html' + item)
    mainWindow.webContents.send('item:add', item);
    addItemWindow.close()

});

function addNewItemWindow() {
    addItemWindow = new BrowserWindow({});
    addItemWindow.setSize(300, 200);
    addItemWindow.setTitle('Add new Item');

    addItemWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addItem.html'),
        protocol: 'file:',
        slashes: true
    }))


    addItemWindow.on('close', function () {
        addItemWindow = null
    })

}

let menuTemplate = [
    {
        label: 'Files',
        submenu: [
            {
                label: 'Add Item',
                click() {
                    addNewItemWindow();
                }
            },
            {
                label: 'Clear Item',
                click()
                {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'command+q' : 'ctrl+q',
                click() {
                    app.quit()
                }
            },
        ]
    }
];


// if we in mac
if (process.platform === 'darwin') {
    menuTemplate.shift({})

}

// add dev tools if we on development 
if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'Development',
        submenu: [
            {
                label: 'Dev Tool',
                accelerator: process.platform === 'darwin' ? 'command+d' : 'ctrl+d',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();

                }
            },

            {
                label: 'Refresh the page',
                accelerator: process.platform === 'darwin' ? 'command+r' : 'ctrl+r',
                role: 'reload'
            }
        ]
    })
}