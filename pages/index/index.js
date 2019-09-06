const app = getApp()

Page({
  data: {
    recorded: '',
    progress: 0,
    transcribed: '',
  },
  onLoad: function () {
    console.log('Welcome to Mini Code')
  },
  record() {
    const recorderMan = tt.getRecorderManager();
    recorderMan.onStart(() => {
      console.log('recorder start')
    });
    recorderMan.onPause(() => {
      console.log('recorder pause')
    });
    recorderMan.onStop((res) => {
      var that = this;
      console.log('recorder stop', res)
      const tempFilePath = res.tempFilePath
      that.setData({
        recorded: tempFilePath
      })

      const audio = tt.createInnerAudioContext();
      audio.autoplay = true;
      audio.src = tempFilePath;
      audio.onPlay(() => {
        console.log('开始播放');
      });
      audio.onError((error) => {
        console.log(error);
      });
      audio.onEnded(() => {
        console.log('播放结束');
      });
      audio.onTimeUpdate((res) => {
        that.setData({
          progress: audio.currentTime / 3
        });
      });

      let task = tt.uploadFile({
        url: 'http://127.0.0.1:8080/post',
        filePath: tempFilePath,
        name: 'audio',
        success (res) {
          console.log(`request 调用成功`);
          that.setData({
            transcribed: res.data
          });
        },
        fail (res) {
          console.log(`request 调用失败`);
        }
      });
    });
    recorderMan.onFrameRecorded((res) => {
      const { frameBuffer } = res
      console.log('frameBuffer.byteLength ', frameBuffer.byteLength)
    });
    const options = {
      duration: 3000,
      sampleRate: 48000,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      frameSize: 50
    };
    recorderMan.start(options);
  },
})
