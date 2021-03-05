<template>
  <div class="hello">
    <canvas id="canvas" @mousedown="startPainting" @mouseup="finishedPainting" @mousemove="draw" @touchstart="startTouchPainting" @touchmove="drawTouch" @touchend="finishedPainting"></canvas>
    <div id ="c">
      <a id ="clear" @click="clear()">清空</a>
      <color-picker v-model="color"></color-picker>
      <p>
          Color:
          <input v-model="color" type="text">
      </p>
    </div>
  </div>
</template>

<script>

import ColorPicker from 'vue-color-picker-wheel';
import firebase from 'firebase';
// import db from '../db'

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  metaInfo: {
    title: '圖鴨板',
  },
  components: {
    ColorPicker,
  },
  methods: {
    toBlob() {
      const storageRef = firebase.storage().ref();
      const mountainsRef = storageRef.child('drawing.jpg');
      const canvas = document.getElementById('canvas');
      canvas.toBlob((blob) => {
        const image = new Image();
        image.src = blob;
        image.setAttribute('crossorigin', 'anonymous');
        mountainsRef.put(blob).then(() => {
          console.log('Uploaded a blob or file!');
        });
      });
    },
    startPainting(e) {
      this.painting = true;
      console.log(this.painting);
      this.draw(e);
    },
    startTouchPainting(e) {
      e.preventDefault();
      this.painting = true;
      console.log(this.painting);
      this.drawTouch(e);
    },
    finishedPainting() {
      this.painting = false;
      console.log(this.painting);
      this.ctx.beginPath();
      this.toBlob();
    },
    clear() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.finishedPainting();
    },
    drawTouch(e) {
      e.preventDefault();
      // console.log(e);
      if (!this.painting) return;
      this.ctx.lineWidth = 10;
      this.ctx.fillStyle = this.color;
      this.ctx.strokeStyle = this.color;
      this.ctx.lineCap = 'round';
      this.ctx.lineTo(e.changedTouches[0].clientX, e.changedTouches[0].clientY - 70);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(e.changedTouches[0].clientX, e.changedTouches[0].clientY - 70);
    },
    draw(e) {
      if (!this.painting) return;
      this.ctx.lineWidth = 10;
      this.ctx.fillStyle = this.color;
      this.ctx.strokeStyle = this.color;
      this.ctx.lineCap = 'round';
      this.ctx.lineTo(e.clientX, e.clientY - 70);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(e.clientX, e.clientY - 70);
    },
  },
  mounted() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');

    // Resize canvas
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;

    function toDataURL(url, callback) {
      const xhr = new XMLHttpRequest();
      xhr.open('get', url);
      xhr.responseType = 'blob';
      xhr.onload = () => {
        const fr = new FileReader();
        // eslint-disable-next-line
        fr.onload = function () {
          callback(this.result);
        };
        fr.readAsDataURL(xhr.response); // async call
      };
      xhr.send();
    }
    toDataURL('https://firebasestorage.googleapis.com/v0/b/shackhand-autolearn.appspot.com/o/drawing.jpg?alt=media&token=b558d0d1-e7ac-4790-b801-8406712d93ae', (dataURL) => {
      const result = new Image();
      result.src = dataURL;
      result.onload = () => {
        const canvas = document.getElementById('canvas');
        canvas.getContext('2d').drawImage(result, 0, 0);
      };
    });
    // console.log(dataURL);
    // now just to show that passing to a canvas doesn't hold the same results
  },
  data() {
    return {
      message: 'Hello Vue!',
      vueCanvas: null,
      painting: false,
      canvas: null,
      ctx: null,
      color: '#000000',
    };
  },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

a#clear {
  cursor: pointer;
  display: inline-block;
  font-size: 18px;
  background-color: yellow;
  padding: 3px;
  border-radius: 5px;
  color: black;
}

#canvas {
    border: 3px solid black;
}

#c {
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
