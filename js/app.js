const metronome = {
  bpm: 60,
  clickAudio: new Audio('sounds/beat.mp3'),
  timer: null,
  isPlaying: false,
  tapTempo: {
    click1Timestamp: 0, 
    click2Timestamp: 0, 
    bpm: 0,
    clickCount: 0
  },
  animation: {

  },
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
      // t1 = Date.now()      
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
  tapTempo: document.getElementById('tapTempo'),
  tempoName: document.getElementById('tempoName'),

  setUpEventListeners: function() {    
    this.startStopButton.addEventListener('click', handlers.toggleStart)
    this.bpmRange.addEventListener('input', handlers.changeTempo.bind(this.bpmRange))
    this.minusFive.addEventListener('click', handlers.decreaseTempoFive)
    this.minusOne.addEventListener('click', handlers.decreaseTempo)
    this.plusOne.addEventListener('click', handlers.increaseTempo)
    this.plusFive.addEventListener('click', handlers.increaseTempoFive)
    this.volumeRange.addEventListener('input', handlers.changeVolume.bind(this.volumeRange))
    this.tapTempo.addEventListener('click', handlers.tapTempo)
  }
}

const handlers = {
  toggleStart: function() {
    if (metronome.isPlaying) {
      metronome.stop()
      view.startStopButtonIcon.classList.remove('fa-stop')
      view.startStopButtonIcon.classList.add('fa-play')
      // animationDisc.classList.remove('animating')
    } else {
      metronome.start()
      view.startStopButtonIcon.classList.remove('fa-play')
      view.startStopButtonIcon.classList.add('fa-stop')
      // animationDisc.classList.add('animating')
      // animationDisc.style.animationDuration = 60 / metronome.bpm * 2 + 's'
    }
  },
  
  changeTempo: function() {
    metronome.bpm = parseInt(this.value)
    bpmDiv.innerText = metronome.bpm
    // ???
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

  tapTempo: function() {
    metronome.tapTempo.clickCount++

    if (metronome.tapTempo.clickCount === 1) {
      metronome.tapTempo.click1Timestamp = Date.now();
    }

    if (metronome.tapTempo.clickCount === 2) {
      metronome.tapTempo.click2Timestamp = Date.now()
      metronome.tapTempo.bpm = 60000 / (metronome.tapTempo.click2Timestamp - metronome.tapTempo.click1Timestamp)

      if (metronome.tapTempo.bpm < 20) metronome.tapTempo.bpm = 20
      if (metronome.tapTempo.bpm > 300) metronome.tapTempo.bpm = 300

      metronome.bpm = Math.floor(metronome.tapTempo.bpm)
      
      bpmRange.value = metronome.bpm
      bpmDiv.textContent = metronome.bpm
      metronome.update()

      metronome.tapTempo.clickCount = 0
    }      
  }
}

view.setUpEventListeners()