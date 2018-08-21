const { remote } = require('electron')

const win = remote.getCurrentWindow()

const root = document.querySelector(':root')
const cssVariables = getComputedStyle(root)
const appName = document.getElementById('appName')
const minimize = document.getElementById('minimize')
const close = document.getElementById('close')

const color1 = cssVariables.getPropertyValue('--color-primary')
const color2 = cssVariables.getPropertyValue('--color-secondary')
const color3 = cssVariables.getPropertyValue('--color-tertiary')
const color4 = cssVariables.getPropertyValue('--color-quaternary')

minimize.addEventListener('click', () => win.minimize())
close.addEventListener('click', () => win.close())

minimize.addEventListener('mouseenter', () => {
  minimize.style.backgroundColor = color3
  if (document.hasFocus()) {
    minimize.style.color = color1
  } else {
    minimize.style.color = 'lightgrey'
  }
})

minimize.addEventListener('mouseleave', () => {
  minimize.style.backgroundColor = color1
  if (document.hasFocus()) {
    minimize.style.color = color4
  } else {
    minimize.style.color = 'lightgrey'
  }
})

close.addEventListener('mouseenter', () => {
  close.style.backgroundColor = color3
  if (document.hasFocus()) {
    close.style.color = color1
  } else {
    close.style.color = 'lightgrey'
  }
})

close.addEventListener('mouseleave', () => {
  close.style.backgroundColor = color1
  if (document.hasFocus()) {
    close.style.color = color4
  } else {
    close.style.color = 'lightgrey'
  }
})

win.on('focus', () => {
  appName.style.color = color4
  minimize.style.color = color4
  close.style.color = color4
})

win.on('blur', () => {
  appName.style.color = 'lightgrey'
  minimize.style.color = 'lightgrey'
  close.style.color = 'lightgrey'
})

win.on('minimize', () => {
  minimize.style.backgroundColor = color1
  minimize.style.color = color4
})