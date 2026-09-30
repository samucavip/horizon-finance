const screens = document.querySelectorAll('.screen');
const pickerButtons = document.querySelectorAll('.picker-button');
const navItems = document.querySelectorAll('.nav-item[data-screen]');

function showScreen(name) {
  screens.forEach((screen) => screen.classList.toggle('active', screen.id === `screen-${name}`));
  pickerButtons.forEach((button) => button.classList.toggle('active', button.dataset.screen === name));
  navItems.forEach((button) => button.classList.toggle('active', button.dataset.screen === name));
  document.querySelector('.phone').scrollTop = 0;
}

document.querySelectorAll('[data-screen]').forEach((button) => {
  button.addEventListener('click', () => showScreen(button.dataset.screen));
});

document.querySelectorAll('.navigate').forEach((button) => {
  button.addEventListener('click', () => showScreen(button.dataset.target));
});

const sheet = document.getElementById('action-sheet');
const backdrop = document.getElementById('sheet-backdrop');
function toggleSheet(open) {
  sheet.classList.toggle('open', open);
  backdrop.classList.toggle('open', open);
  sheet.setAttribute('aria-hidden', String(!open));
}
document.getElementById('add-button').addEventListener('click', () => toggleSheet(true));
document.getElementById('close-sheet').addEventListener('click', () => toggleSheet(false));
backdrop.addEventListener('click', () => toggleSheet(false));
