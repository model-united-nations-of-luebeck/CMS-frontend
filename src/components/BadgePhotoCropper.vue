<script>
import { Cropper } from 'vue-advanced-cropper'
import PortraitStencil from './/PortraitStencil.vue'
import 'vue-advanced-cropper/dist/style.css'
import { useMagicKeys, whenever } from '@vueuse/core'
import { ref } from 'vue'

export default {
  components: {
    Cropper,
    PortraitStencil
  },
  props: {
    image: String
  },
  emits: ['update:image'],
  data() {
    return {
      img: ''
    }
  },
  methods: {
    zoom(value) {
      this.$refs.cropper.zoom(value)
      this.cropImage()
    },
    move(x, y) {
      this.$refs.cropper.move(x, y)
      this.cropImage()
    },
    rotate(deg) {
      this.$refs.cropper.rotate(deg)
      this.cropImage()
    },
    uploadImage(event) {
      // Reference to the DOM input element
      var input = event.target
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        // check input file size
        if (input.files[0].size > 20 * 1024 * 1024) {
          alert('File is too big! Please select a file smaller than 20MB.')
          return
        }

        // create a new FileReader to read this image and convert to base64 format
        var reader = new FileReader()
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e) => {
          // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
          // Read image as base64 and set to imageData
          this.img = e.target.result
          this.existingImage = null
        }
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input.files[0])
        this.cropImage()
      }
    },
    cropImage() {
      const result = this.$refs.cropper.getResult()
      // const newTab = window.open()
      // newTab.document.body.innerHTML = `<img src="${result.canvas.toDataURL('image/jpeg')}"></img>`
      if (result.canvas) {
        this.$emit('update:image', result.canvas.toDataURL('image/jpeg'))
      }
    }
  },
  computed: {
    existingImage() {
      if (this.image && !this.img) {
        // show existing image if no new image is selected
        return this.image
      } else {
        //no existing image available
        return null
      }
    }
  },
  setup() {
    const keys = useMagicKeys()
    const cropper = ref(null) // obtain reference to cropper
    whenever([keys.shift_a, keys.arrowleft], () => {
      cropper.value.move(100, 0)
      this.cropImage()
    })
    whenever([keys.shift_d, keys.arrowright], () => {
      cropper.value.move(-100, 0)
      this.cropImage()
    })
    whenever([keys.shift_w, keys.arrowup], () => {
      cropper.value.move(0, 100)
      this.cropImage()
    })
    whenever([keys.shift_s, keys.arrowdown], () => {
      cropper.value.move(0, -100)
      this.cropImage()
    })
    whenever(keys.shift_q, () => {
      cropper.value.rotate(-2)
      this.cropImage()
    })
    whenever(keys.shift_e, () => {
      cropper.value.rotate(2)
      this.cropImage()
    })
    whenever(keys.shift_control, () => {
      cropper.value.rotate(-90)
      this.cropImage()
    })
    whenever(keys.shift_y, () => {
      cropper.value.zoom(1.1)
      this.cropImage()
    })
    whenever(keys.shift_x, () => {
      cropper.value.zoom(0.9)
      this.cropImage()
    })

    return { cropper }
  }
}
</script>

<template>
  <div id="root">
    <div id="cropper-and-controls">
      <div id="image-buttons">
        <v-btn
          id="upload-btn"
          prepend-icon="mdi-camera"
          color="primary"
          v-tooltip:top="'Click to capture or upload an existing photo'"
          @click="$refs.file.click()"
        >
          <input
            style="display: none"
            type="file"
            ref="file"
            @change="uploadImage($event)"
            accept="image/*"
            required
          /><span v-if="!img && !existingImage">Upload image</span>
          <span v-else>Change image</span>
        </v-btn>
      </div>

      <!-- show cropper if image no existing image is available, else show existing image -->
      <div id="cropper-wrapper" v-if="!existingImage">
        <cropper
          class="cropper"
          ref="cropper"
          :src="img"
          :stencil-component="$options.components.PortraitStencil"
          :stencil-size="{
            width: 350,
            height: 450
          }"
          image-restriction="stencil"
          @change="cropImage"
          @ready="cropImage"
        />
        <PortraitStencil v-if="1 == 2" />
      </div>
      <div id="cropper-wrapper" v-else>
        <img :src="existingImage" />
      </div>

      <div id="mobile" v-if="this.$vuetify.display.smAndDown">
        <div id="mobile-controls" v-if="img">
          <div id="mobile-zoom">
            <v-btn
              @mousedown="rotate(-2)"
              icon="mdi-rotate-left"
              variant="elevated"
              color="primary"
              v-tooltip:bottom="'Rotate photo slightly counterclockwise'"
            ></v-btn>

            <v-btn
              @mousedown="rotate(-90)"
              icon="mdi-format-rotate-90"
              variant="elevated"
              color="primary"
              v-tooltip:bottom="'Rotate photo 90 degrees'"
            ></v-btn>
            <v-btn
              @mousedown="rotate(2)"
              icon="mdi-rotate-right"
              variant="elevated"
              color="primary"
              v-tooltip:bottom="'Rotate photo slightly clockwise'"
            ></v-btn>
          </div>
        </div>
      </div>

      <div id="desktop" v-else>
        <div id="controls" v-if="img">
          <div id="zoom">
            <h3>Zoom</h3>
            <v-btn @mousedown="zoom(1.2)" icon="mdi-magnify-plus"> </v-btn>
            <v-btn @mousedown="zoom(0.8)" icon="mdi-magnify-minus"> </v-btn>
          </div>
          <div id="rotation">
            <h3>Rotate</h3>
            <v-btn @mousedown="rotate(-2)" icon="mdi-rotate-left"></v-btn>
            <v-btn @mousedown="rotate(-90)" icon="mdi-format-rotate-90"></v-btn>
            <v-btn @mousedown="rotate(2)" icon="mdi-rotate-right"></v-btn>
          </div>
          <div id="move">
            <h3>Move</h3>
            <v-btn @mousedown="move(100, 0)" icon="mdi-arrow-left-thin"> </v-btn>
            <v-btn @mousedown="move(-100, 0)" icon="mdi-arrow-right-thin"></v-btn>
            <v-btn @mousedown="move(0, -100)" icon="mdi-arrow-down-thin"></v-btn>
            <v-btn @mousedown="move(0, 100)" icon="mdi-arrow-up-thin"></v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#root {
  width: 350px;
  margin-bottom: 20px;
}

@media (max-width: 600px) {
  /* make image full width on mobile devices */
  #root {
    width: 100%;
  }
}

#cropper-wrapper {
  height: auto;
  display: flex;
  justify-content: center;
  aspect-ratio: 35/45;
  margin-bottom: 10px;

  cursor: move;
  background-color: rgba(0, 0, 0, 0.12);
  border-radius: 5px;
}

#controls {
  display: block;
  position: absolute;

  width: 350px;
  padding: 20px;
}

/* #controls h3 {
  margin-bottom: 10px;
} */
/* #controls div {
  margin-bottom: 50px;
} */
#controls .v-btn {
  margin: 10px;
}

#mobile-controls {
  position: relative;
  display: flex;
  justify-content: center;
  top: 0px;
  left: 0%;
  width: 100%;
}

#mobile-controls .v-btn {
  margin: 0px 20px;
}

#mobile-zoom {
  justify-content: center;
  display: flex;
}

#image-buttons .v-btn {
  margin: 10px 7px;
}

#image-buttons {
  display: flex;
  justify-content: center;
}
</style>
