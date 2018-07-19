const metronome = {
  bpm: 60,
  clickAudio: new Audio('sounds/clave.wav'),
  timer: null,
  isPlaying: false,
  click: function() {
    this.clickAudio.play()
  },
  repeatClick: function() {
    this.isPlaying = true
    let t1, t2 = 0    
    this.timer = setInterval(() => {
      this.click()
      if (t1) t2 = t1
      t1 = performance.now()    
      if (t2) console.log(t1 - t2)
    }, 60000 / this.bpm)
  },
  start: function() {
    this.isPlaying = true
    this.click()
    this.repeatClick()    
  },
  update: function() {
    if (this.isPlaying) {
      this.stop()
      this.repeatClick()
    }
  },
  stop: function() {
    clearInterval(this.timer)
    this.timer = null
    this.isPlaying = false
  }  
}

const view = {
  startStopButton: document.getElementById('startStop'),
  startStopButtonIcon: document.getElementById('startStopIcon'),
  bpmRange: document.getElementById('bpmRange'),
  bpmDiv: document.getElementById('bpmDiv'),
  minusFive: document.getElementById('minusFive'),
  minusOne: document.getElementById('minusOne'),
  plusOne: document.getElementById('plusOne'),
  plusFive: document.getElementById('plusFive'),
  volumeRange: document.getElementById('volumeRange'),
  volumeIcon: document.getElementById('volumeIcon'),  
  tempoName: document.getElementById('tempoName'),

  setUpEventListeners: function() {    
    this.startStopButton.addEventListener('click', handlers.toggleStart)
    this.bpmRange.addEventListener('input', handlers.changeTempo.bind(this.bpmRange))
    this.minusFive.addEventListener('click', handlers.decreaseTempoFive)
    this.minusOne.addEventListener('click', handlers.decreaseTempo)
    this.plusOne.addEventListener('click', handlers.increaseTempo)
    this.plusFive.addEventListener('click', handlers.increaseTempoFive)
    this.volumeRange.addEventListener('input', handlers.changeVolume.bind(this.volumeRange))
  }
}

const handlers = {
  toggleStart: function() {
    if (metronome.isPlaying) {
      metronome.stop()
      view.startStopButtonIcon.classList.remove('fa-stop')
      view.startStopButtonIcon.classList.add('fa-play')
    } else {
      metronome.start()
      view.startStopButtonIcon.classList.remove('fa-play')
      view.startStopButtonIcon.classList.add('fa-stop')
    }
  },
  
  changeTempo: function() {
    metronome.bpm = parseInt(this.value)
    bpmDiv.innerText = metronome.bpm
    tempoName.innerText = tempoMarkings.name(metronome.bpm)
    metronome.update()     
  },

  increaseTempo: function() {
    if (metronome.bpm < 300) metronome.bpm++
    view.bpmDiv.innerText = metronome.bpm
    view.bpmRange.value = metronome.bpm
    metronome.update()
  },

  decreaseTempo: function() {
    if (metronome.bpm > 20) metronome.bpm--
    view.bpmDiv.innerText = metronome.bpm
    view.bpmRange.value = metronome.bpm
    metronome.update()
  },

  increaseTempoFive: function() {
    if (metronome.bpm < 296) {
      metronome.bpm += 5
    } else if (metronome.bpm > 295) {
      metronome.bpm = 300
    }      
    view.bpmDiv.innerText = metronome.bpm
    view.bpmRange.value = metronome.bpm
    metronome.update()
  },

  decreaseTempoFive: function() {
    if (metronome.bpm > 24) {
      metronome.bpm -= 5
    } else if (metronome.bpm < 25) {
      metronome.bpm = 20
    } 
    view.bpmDiv.innerText = metronome.bpm
    view.bpmRange.value = metronome.bpm
    metronome.update()
  },

  changeVolume: function() {
    metronome.clickAudio.volume = this.value / 100
    if (this.value > 50) {
      view.volumeIcon.classList.remove('fa-volume-down')
      view.volumeIcon.classList.remove('fa-volume-off')
      view.volumeIcon.classList.add('fa-volume-up')        
    }
    if (this.value < 51 && this.value > 0) {
      view.volumeIcon.classList.remove('fa-volume-up')
      view.volumeIcon.classList.remove('fa-volume-off')
      view.volumeIcon.classList.add('fa-volume-down')        
    }
    if (this.value == 0) {
      view.volumeIcon.classList.remove('fa-volume-up')
      view.volumeIcon.classList.remove('fa-volume-down')
      view.volumeIcon.classList.add('fa-volume-off')        
    }
  },
}

// Keyboard shortcuts
window.addEventListener('keydown', (e) => {
  if (e.keyCode == '37') {
    handlers.decreaseTempo()
  }

  if (e.keyCode == '39') {
    handlers.increaseTempo()
  }

  if (e.keyCode == '40') {
    handlers.decreaseTempoFive()
  }

  if (e.keyCode == '38') {
    handlers.increaseTempoFive()
  }

  if (e.keyCode == '32') {
    handlers.toggleStart()
  }
})

view.setUpEventListeners()