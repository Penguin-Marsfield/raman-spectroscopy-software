const {
    app,
    BrowserWindow
} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function loadBokehServer() {
    // Load the Bokeh Server.
    var PythonShell = require('python-shell');
    var options = {
        mode: 'text',
        pythonPath: 'python3',
        pythonOptions: ['-m'],
        scriptPath: '',
        args: ['serve', './Raman/raman_bokeh_app.py']
    };
    var pshell = PythonShell.run('bokeh', options, function (err, results) {
        if (err) throw err;
        console.log('results: %j', results);
    });
    return pshell;
}


function createWindow() {
    // Create the browser window.
    var pshell = loadBokehServer();

    win = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false
    })

    // After the Bokeh Server is loaded, load the page.
    // Because in current version of bokeh there's no way to know if all elements
    // finished rendering, the workaround here is to use timeout
    // https://stackoverflow.com/questions/42794556/how-to-check-if-my-bokeh-server-application-is-completely-loaded-and-rendered?noredirect=1&lq=1
    // https://github.com/bokeh/bokeh/issues/4272
    setTimeout(function () {
        win.show();
        win.loadURL('http://localhost:5006/raman_bokeh_app');
    }, 1000);

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        pshell.childProcess.kill();
        win = null;
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow();
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    // if (process.platform !== 'darwin') {
    app.quit()
    // }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.