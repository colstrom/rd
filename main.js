const { app, BrowserWindow, dialog } = require('electron')
const Minikube = require('./src/k8s-engine/minikube.js')
const tray = require('./src/menu/tray.js')
// TODO: rewrite in typescript. This was just a quick proof of concept.

app.setName("Rancher Desktop")

app.whenReady().then(() => {

    tray.init();

    // TODO: Check if first install and start welcome screen
    // TODO: Check if new version and provide window with details on changes

    Minikube.start((code) => {
        console.log(`Child exited with code ${code}`);
        tray.k8sStarted();
    });

})

let gone = false
app.on('before-quit', (event) => {
  if (gone) return
  event.preventDefault();
  tray.k8sStopping()

  Minikube.stop((code) => {
    console.log(`Child exited with code ${code}`);
    gone = true
    app.quit()
  });
})


// We don't need no dock icon. It's in the nav bar
// TODO: Bring back the dock icon when the settings are open.
app.dock.hide();
