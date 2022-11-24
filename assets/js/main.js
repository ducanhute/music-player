const $ = document.querySelector.bind(document)
const $$ = document.querySelector.bind(document)
//
const playlist = $('.playlist')
const cd = $('.cd')
const playBtn = $(".btn-toggle-play")
const player = $(".player")
const audio = $('#audio')
const nameCurrentSong = $('header h2')
const cdThumb = $('.cd-thumb')
const inputProgress = $('.progress')
const nextBtn = $('.btn-next')  
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
// Tạo key để lưu data vào localStorage
const PLAYER_STORAGE_KEY = 'MY_MUSIC_PLAYER'


//
const app = {
    currentIndex: 0,
    isplaying: false,
    isRandom:false,
    isRepeat: false,
    // Hàm con fig lấy ra dữ liệu lưu vào localStorage
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Chúng ta của hiện tại',
            Singer: 'Sơn Tùng MTP',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Waiting for you',
            Singer: 'MONO',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Anh thề đấy (Remix)',
            Singer: 'Thanh Hưng',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Em là',
            Singer: 'MONO',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Tòng Phu',
            Singer: 'KeyO',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: '2AM',
            Singer: 'JustaTee, Biggdaddy',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Anh yêu em cực',
            Singer: 'Linh Thộn, Minh Vũ',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'Anh chưa biết em (Remix)',
            Singer: 'Liu Grace, Kriss Ngo',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            name: 'Chào mừng đến bình nguyên vô tận',
            Singer: 'Vũ Huỳnh',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg'
        },
        {
            name: 'Tấm lòng son Remix',
            Singer: 'H-Kray, Đại Mèo',
            path: './assets/music/song10.mp3',
            image: './assets/img/song10.jpg'
        }
    ],
    // Hàm set và lưu data vào localStorage
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index == this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.Singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    // Tạo ra một getter
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function () {
        // Khi scroll
        const _this = this
        const cdWidth = cd.offsetWidth 
        document.onscroll = function() {
            const scrollLegth = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollLegth
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth/cdWidth
        }
        // Xử lý quay đĩa CD
        const cdAnimate = cdThumb.animate([
            // keyframes
            { transform: 'rotate(360deg)' },
          ], {
            // timing options
            duration: 10000,
            iterations: Infinity
          });
        cdAnimate.pause()
        //Khi nhấn play
        playBtn.onclick = function() {
            if(_this.isplaying) {
                audio.pause()
                cdAnimate.pause()
            }
            else {
                audio.play()
                cdAnimate.play()
            }
        }
        // lắng nghe sự kiện audio play
        audio.onplay = function() {
            _this.isplaying = true
            player.classList.add('playing')
        }
        audio.onpause = function() {
            _this.isplaying = false
            player.classList.remove('playing')
        }
        // Cập nhật lại giá trị của thanh input sau khoảng thời gian tùy ý
        setInterval(() => {
            const progressPercent = Math.floor(audio.currentTime/audio.duration*100)
            if(progressPercent) {
                inputProgress.value = progressPercent
        }},1500)
        /**Lắng nghe và xử lý khi tiến độ bài hát thay đổi      
         audio.ontimeupdate = function() {
             progressPercent = Math.floor(audio.currentTime/audio.duration*100)
             if(progressPercent) {
                 inputProgress.value = progressPercen
            }
         }
    
         */        
        // Khi tua bài hát
        inputProgress.onchange = function(e){
            const seekTime = inputProgress.value* audio.duration/100
            audio.currentTime = seekTime
            } 
        // Lắng nghe sự kiện khi bấm next
          nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandom()
            } else{
                _this.nextSong()
            }
            audio.play()
            inputProgress.value = 0 // reset thanh input về không
            _this.render()
            _this.scrollToview()
        } 
        // Lắng nghe sự kiện khi bấm prev
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandom()
            } else{
                _this.prevSong()
            }
            audio.play()
            inputProgress.value = 0 // reset thanh input về không
            _this.render()
            _this.scrollToview()
        }     
        // lắng nghe sự kiện khi bấm randBtn
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            // Lưu config
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle("active",_this.isRandom)
        }
         // lắng nghe sự kiện khi bấm repeat 
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat    
            // Lưu config
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle("active",_this.isRepeat)
        }
        // Xử lý sự kiện khi audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
                _this.playRepeat()
                audio.play()        
                inputProgress.value = 0       
            }
            else {
                nextBtn.click()
            }
        }
        // Xử lý sự kiện click vào bài hát trong Playlist
        playlist.onclick = function(e) {
                songNode = e.target.closest('.song:not(.active)')
                optionNode = e.target.closest('.option')
                if(songNode || optionNode)  {
                    if(optionNode) {
                        console.log("đã bấm option")
                    } 
                    else {
                        let index = songNode.getAttribute('data-index')
                        _this.currentIndex = index
                        _this.loadCurrentSong()
                        _this.render()
                        audio.play()
                    }
                }
            
        }
    },
//END HANDEL EVENT 
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    // Hàm chuyển next song
    nextSong: function() {
    this.currentIndex++
    if(this.currentIndex >= this.songs.length) {
        this.currentIndex = 0
    }
    this.loadCurrentSong()
    },
    // Hàm chuyển prev song
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0 ) {
            this.currentIndex = this.songs.length-1
        }
        this.loadCurrentSong()
    },
    playRandom: function() {
        let newIndex 
        do {
            newIndex = Math.floor(Math.random()*this.songs.length)
        }
        while (newIndex == this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    playRepeat: function() {
        this.currentIndex = this.currentIndex
        this.loadCurrentSong()
    },
    scrollToview: function() {
        $('.song.active').scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
    },
    // Hàm load bài hát đầu tiên
    loadCurrentSong: function() {
        nameCurrentSong.innerHTML = this.currentSong.name
        cdThumb.style.backgroundImage  = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    // Hàm chạy tất cả các phương thưc định nghĩa trong app
    start: function () {
        // load config: các trạng thái của random, repeat dưới dạng boolean
        this.loadConfig()

        // Tạo ra một thuộc tính là curentsong = this.songs[this.currentIndex]
        this.defineProperties()

        // Render ra list bài hát trong giao diện
        this.render()

        // Xử lý các sự kiện
        this.handleEvent()

        // Tải thông tin bài hát đầu tiên: update curentsong, name
        this.loadCurrentSong()

        // Chuyển view về bài đầu tiên
        this.scrollToview()
        // Hiện thị trạng thái ban đầu của hai nút random và repeat
        randomBtn.classList.toggle("active",this.isRandom)
        repeatBtn.classList.toggle("active",this.isRepeat)
    },
}
app.start()
