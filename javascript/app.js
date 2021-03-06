const tempoMarkings = require('./tempoMarkings')

const metronome = {
  isPlaying: false,
  clickAudio: clickSound,
  bpm: 60,
  minBpm: 20,
  maxBpm: 300,
  timer: null,
  clickCount: 0,
  getBpm() {
    return this.bpm
  },
  setBpm(newBpm) {
    this.bpm = newBpm
    localStorage.tempo = this.getBpm()
    // console.log(this.bpm)
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
      if (this.getBpm() + trainer.increment > this.maxBpm) {
        this.setBpm(this.maxBpm)  
      } else {
        this.setBpm(this.getBpm() + trainer.increment)
      }
      view.updateAllBpm()
    }

    let interval = 60000 / this.getBpm()
    // console.log('interval:', interval)

    this.timer = setTimeout(() => {
      // console.log(performance.now() - t1)
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
      this.setBpm(parseInt(localStorage.tempo))
    }
    view.updateAllBpm()

    if (localStorage.volume) {
      this.clickAudio.volume = parseFloat(localStorage.volume)
      view.volumeRange.value = this.clickAudio.volume * 100
      view.updateVolumeIcon()
    }

    if (localStorage.period) {
      trainer.period = parseInt(localStorage.period)
      view.period.value = trainer.period
      view.periodValue.textContent = trainer.period
    }

    if (localStorage.increment) {
      trainer.increment = parseInt(localStorage.increment)
      view.increment.value = trainer.increment
      view.incrementValue.textContent = trainer.increment
    }
  }
}

const trainer = {
  period: 4,
  increment: 0
}

const tapTempo = {
  taps: [],
  timer: null,
  tap: function() {
    this.taps.push(Date.now())
    // console.log(this.taps)
    this.clear()
    if (this.taps.length > 1) {
      let difference = this.taps[this.taps.length - 1] - this.taps[this.taps.length - 2]
      if (difference < 200) {
        metronome.setBpm(300)  
      } else if (difference > 3000) {
        metronome.setBpm(20)
      } else {
        metronome.setBpm(parseInt(60000 / difference))
      }
      view.updateAllBpm()
    }
  },
  clear: function() {
    if ((this.taps[this.taps.length - 1]) - (this.taps[this.taps.length - 2]) > 2000) {
      newFirstTap = this.taps[this.taps.length - 1]
      this.taps = []
      this.taps.push(newFirstTap)
    }
  }
}

const view = {
  window: window,
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
  tapTempoButton: document.getElementById('tapTempoButton'),

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
    this.tapTempoButton.addEventListener('click', handlers.tap)
    this.window.addEventListener('keydown', handlers.keydown)
  },

  updateBpmDiv: function() {
    this.bpmDiv.textContent = metronome.getBpm()
  },

  updateBpmRange: function() {
    this.bpmRange.value = metronome.getBpm()
  },

  updateTempoName: function() {
    this.tempoName.textContent = tempoMarkings.name(metronome.getBpm())
  },

  updateAllBpm: function() {
    this.updateBpmDiv()
    this.updateTempoName()
    this.updateBpmRange()
  },

  updateToggleStart: function() {
    if (metronome.isPlaying) {
      this.startStopButtonIcon.classList.remove('fa-play')
      this.startStopButtonIcon.classList.add('fa-stop')
    } else {
      this.startStopButtonIcon.classList.remove('fa-stop')
      this.startStopButtonIcon.classList.add('fa-play')
    }
  },

  updateVolumeIcon: function() {
    if (this.volumeRange.value > 50) {
      this.volumeIcon.classList.remove('fa-volume-down')
      this.volumeIcon.classList.remove('fa-volume-off')
      this.volumeIcon.classList.add('fa-volume-up')        
    } else if (this.volumeRange.value < 51 && this.volumeRange.value > 0) {
      this.volumeIcon.classList.remove('fa-volume-up')
      this.volumeIcon.classList.remove('fa-volume-off')
      this.volumeIcon.classList.add('fa-volume-down')        
    } else if (this.volumeRange.value == 0) {
      this.volumeIcon.classList.remove('fa-volume-up')
      this.volumeIcon.classList.remove('fa-volume-down')
      this.volumeIcon.classList.add('fa-volume-off')        
    }
  },

  animateTapTempoButton: function() {
    this.tapTempoButton.classList.add('animating')
    setTimeout(() => {
      this.tapTempoButton.classList.remove('animating')
    }, 150)
  }
}

const handlers = {
  toggleStart: function() {
    if (metronome.isPlaying) {
      metronome.stop()     
    } else {
      metronome.start()      
    }
    view.updateToggleStart()
  },
  
  changeTempo: function() {
    metronome.setBpm(parseInt(this.value))
    view.updateBpmDiv()
    view.updateTempoName()
  },

  increaseTempo: function() {
    if (metronome.getBpm() < 300) {
      metronome.setBpm(metronome.getBpm() + 1)      
    }
    view.updateAllBpm() 
  },

  decreaseTempo: function() {
    if (metronome.getBpm() > 20) {
      metronome.setBpm(metronome.getBpm() - 1)
    }
    view.updateAllBpm()
  },

  increaseTempoFive: function() {
    if (metronome.getBpm() < metronome.maxBpm - 4) {
      metronome.setBpm(metronome.getBpm() + 5)
    } else if (metronome.getBpm() > 295) {
      metronome.setBpm(metronome.maxBpm)
    }
    view.updateAllBpm()
  },

  decreaseTempoFive: function() {
    if (metronome.getBpm() > metronome.minBpm + 4) {
      metronome.setBpm(metronome.getBpm() - 5)
    } else if (metronome.getBpm() < metronome.minBpm + 5) {
      metronome.setBpm(metronome.minBpm)
    }
    view.updateAllBpm()
  },

  changeVolume: function() {
    metronome.clickAudio.volume = this.value / 100
    localStorage.volume = metronome.clickAudio.volume
    view.updateVolumeIcon()    
  },

  changePeriod: function() {
    trainer.period = parseInt(this.value)
    localStorage.period = trainer.period
    periodValue.textContent = trainer.period
  },

  changeIncrement: function() {
    trainer.increment = parseInt(this.value)
    localStorage.increment = trainer.increment
    incrementValue.textContent = trainer.increment
  },

  tap: function() {
    view.animateTapTempoButton()
    tapTempo.tap()    
  },

  keydown: function(e) {
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
  }
}

metronome.initialize()
view.setUpEventListeners()