class MultimediaPlayer extends DOMGui {

    constructor(audioTagSelector, tracks, guiParams = undefined) {
        super();

        this.audio = document.querySelector(audioTagSelector);
        this.tracks = tracks;
        this.audio.src = this.tracks[0];
        this.currentTrack = 0;
        

        this._DOMElements = {
            play: undefined,
            next: undefined,
            prev: undefined,
            title: undefined,
            artist: undefined,
            album: undefined,
            cover: undefined,
            currentTime: undefined,
            totalTime: undefined,
            progressBar: undefined,
            playlistMenu: undefined,
        }
        this.setDOMElements(guiParams);
        this.addListeners();
        this.setPlayerInfo();
    }

    addListeners() {

        this.startTimeUpdateListener();

        this.addButtonListener('play',
        () => {
            if (this.audio.paused) {
                this.audio.play();
            } else {
                this.audio.pause();
            }
            this._DOMElements.play.classList.toggle('fa-play');
            this._DOMElements.play.classList.toggle('fa-pause');
        });

        this.addButtonListener('next',
        () => {
            this.changePlayingSong(this.currentTrack + 1);
        });

        this.addButtonListener('progressBar',
        (e) => {
            let position = e.offsetX;
            let totalW = e.target.clientWidth;
            let progress = position / totalW;
            this.updateProgressBar(progress);
            this.audio.currentTime = this.audio.duration * progress;
        });
    }

    addButtonListener(btnName, callback){
        this._DOMElements[btnName].onclick = callback;
    }

    changePlayingSong(index) {
        if ( index <= this.tracks.length - 1 ) {
            this.currentTrack = index;
        }else{
            this.currentTrack = 0;
        }
        this.audio.src = this.tracks[this.currentTrack];
        this.audio.play();
        let playing = this._DOMElements.playlistMenu.querySelector('.playing');
        playing.classList.remove('playing');
        let element = this._DOMElements.playlistMenu.children[this.currentTrack];
        element.classList.add('playing');
        this.setPlayerInfo();
    }

    setPlayerInfo() {
        let element = this._DOMElements.playlistMenu.children[this.currentTrack];
        this._DOMElements.title.innerHTML = element.querySelector('.title').innerHTML;
        this._DOMElements.artist.innerHTML = element.querySelector('.artist').innerHTML;
    }

    startTimeUpdateListener() {
        this.audio.ontimeupdate = () => {
            let total = this.audio.duration;
            let current = this.audio.currentTime;
            let progress = current / total;
            this.updateProgressBar(progress);
        }
    }

    updateProgressBar(progress) {
        this._DOMElements.progressBar.querySelector('.fill').style.transform = `scaleX(${progress})`;
    }
}