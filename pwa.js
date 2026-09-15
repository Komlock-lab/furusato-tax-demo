let installPrompt = null;
const installButton = document.getElementById('install-app');
const standalone = window.matchMedia('(display-mode: standalone)');
function updateInstallButton() {
  installButton.hidden = standalone.matches || window.navigator.standalone === true;
}
updateInstallButton();
standalone.addEventListener('change', updateInstallButton);
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPrompt = event;
});
window.addEventListener('appinstalled', () => {
  installPrompt = null;
  installButton.hidden = true;
});
installButton.addEventListener('click', async () => {
  if (installPrompt) {
    const prompt = installPrompt;
    installPrompt = null;
    try {
      await prompt.prompt();
      await prompt.userChoice;
      return;
    } catch {
      // Manual instructions remain available when a prompt is unavailable.
    }
  }
  document.getElementById('install-dialog').showModal();
});
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).catch((error) => {
      console.warn('Offline setup unavailable; the online demo still works.', error);
    });
  });
}
