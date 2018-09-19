const metronome = {
  isPlaying: false,
  clickAudio: clickSound,
  bpm: 60,
  maxBpm: 300,
  timer: null,
  clickCount: 0,
  getBpm() {
    return this.bpm
  },
  setBpm(newBpm) {
    this.bpm = newBpm
    localStorage.tempo = this.getBpm()
    console.log(this.bpm)
  },
  getClickCount() {
    return this.clickCount
  },
  setClickCount(newClickCount) {
    this.clickCount = newClickCount
  },
  start: function() {
    let t1 = performance.now()
    this.clickAudio.play()
    this.isPlaying = true
    this.setClickCount(this.getClickCount() + 1)

    if (
      trainer.increment > 0 
      && 
      this.getClickCount() % trainer.period === 0 
      && 
      this.getBpm() < this.maxBpm
    ) {
      this.setBpm(this.getBpm() + trainer.increment)
      view.updateBpm()
    }

    let interval = 60000 / this.getBpm()
    // console.log('interval:', interval)

    this.timer = setTimeout(() => {
      console.log(performance.now() - t1)
      this.start()
    }, interval)
  },
  stop: function() {
    clearInterval(this.timer)
    this.timer = null
    this.isPlaying = false
    this.setClickCount(0)
  },
  initialize: function() {
    if (localStorage.tempo) {
      this.bpm = parseInt(localStorage.tempo)
      view.bpmDiv.textContent = this.bpm
      view.bpmRange.value = this.bpm
      view.tempoName.textContent = tempoMarkings.name(this.bpm)
    } else {
      view.bpmDiv.textContent = this.bpm
      view.bpmRange.value = this.bpm
      view.tempoName.textContent = tempoMarkings.name(this.bpm)
    }

    if (localStorage.volume) {
      this.clickAudio.volume = parseFloat(localStorage.volume)
      view.volumeRange.value = this.clickAudio.volume * 100
      view.updateVolumeIcon()
    }
  }
}

const trainer = {
  period: 4,
  increment: 0
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
  period: document.getElementById('period'),
  periodValue: document.getElementById('periodValue'),
  increment: document.getElementById('increment'),
  incrementValue: document.getElementById('incrementValue'),

  setUpEventListeners: function() {    
    this.startStopButton.addEventListener('click', handlers.toggleStart)
    this.bpmRange.addEventListener('input', handlers.changeTempo.bind(this.bpmRange))
    this.minusFive.addEventListener('click', handlers.decreaseTempoFive)
    this.minusOne.addEventListener('click', handlers.decreaseTempo)
    this.plusOne.addEventListener('click', handlers.increaseTempo)
    this.plusFive.addEventListener('click', handlers.increaseTempoFive)
    this.volumeRange.addEventListener('input', handlers.changeVolume.bind(this.volumeRange))
    this.period.addEventListener('input', handlers.changePeriod.bind(this.period))
    this.increment.addEventListener('input', handlers.changeIncrement.bind(this.increment))
  },

  updateBpm: function() {
    this.bpmDiv.textContent = metronome.getBpm()
    this.bpmRange.value = metronome.getBpm()
  },

  updateVolumeIcon: function() {
    if (this.volumeRange.value > 50) {
      view.volumeIcon.classList.remove('fa-volume-down')
      view.volumeIcon.classList.remove('fa-volume-off')
      view.volumeIcon.classList.add('fa-volume-up')        
    } else if (this.volumeRange.value < 51 && this.volumeRange.value > 0) {
      view.volumeIcon.classList.remove('fa-volume-up')
      view.volumeIcon.classList.remove('fa-volume-off')
      view.volumeIcon.classList.add('fa-volume-down')        
    } else if (this.volumeRange.value == 0) {
      view.volumeIcon.classList.remove('fa-volume-up')
      view.volumeIcon.classList.remove('fa-volume-down')
      view.volumeIcon.classList.add('fa-volume-off')        
    }
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
    localStorage.tempo = metronome.bpm

    bpmDiv.innerText = metronome.bpm
    tempoName.innerText = tempoMarkings.name(metronome.bpm)   
  },

  increaseTempo: function() {
    if (metronome.bpm < 300) metronome.bpm++
    localStorage.tempo = metronome.bpm

    view.bpmDiv.innerText = metronome.bpm
    view.bpmRange.value = metronome.bpm
  },

  decreaseTempo: function() {
    if (metronome.bpm > 20) metronome.bpm--
    localStorage.tempo = metronome.bpm

    view.bpmDiv.innerText = metronome.bpm
    view.bpmRange.value = metronome.bpm
  },

  increaseTempoFive: function() {
    if (metronome.bpm < 296) {
      metronome.bpm += 5
    } else if (metronome.bpm > 295) {
      metronome.bpm = 300
    }
    localStorage.tempo = metronome.bpm

    view.bpmDiv.innerText = metronome.bpm
    view.bpmRange.value = metronome.bpm
  },

  decreaseTempoFive: function() {
    if (metronome.bpm > 24) {
      metronome.bpm -= 5
    } else if (metronome.bpm < 25) {
      metronome.bpm = 20
    }
    localStorage.tempo = metronome.bpm

    view.bpmDiv.innerText = metronome.bpm
    view.bpmRange.value = metronome.bpm
  },

  changeVolume: function() {
    metronome.clickAudio.volume = this.value / 100
    localStorage.volume = metronome.clickAudio.volume
    view.updateVolumeIcon()    
  },

  changePeriod: function() {
    trainer.period = parseInt(this.value)
    periodValue.textContent = trainer.period
  },

  changeIncrement: function() {
    trainer.increment = parseInt(this.value)
    incrementValue.textContent = trainer.increment
  }
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

metronome.initialize()
view.setUpEventListeners()