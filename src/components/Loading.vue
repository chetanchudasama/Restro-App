<template>
  <div class="loading-screen fill-height px-4">
    <div class="loading-block">
      <h1>Welcome :)</h1>
      <div class="loader">
        <img src="/img/loading-img.svg" alt="loader image" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-screen {
  background: #fbaf02;
}
.loading-block {
  padding: 31.2vh 0 10vh;
  text-align: left;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.loader {
  width: 200px;
  height: 200px;
  margin: 0 auto;
}
.loader img {
  width: 100%;
  height: 100%;
}
@media (max-height: 480px) {
  .loading-block {
    padding: 12vh 0 10vh;
  }
}
</style>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Loading extends Vue {}
</script>
