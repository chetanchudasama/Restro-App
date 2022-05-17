<template>
  <div class="introduction-screen fill-height px-4">
    <div class="bg-img" style="background:url(/img/introduction-bg.png)"></div>
    <v-btn class="icon-btn primary elevation-0 secondary--text" @click="redirectToRestaurantMenu">
      Start
      <i class="icon-wrap">
        <img src="/img/next-arrow.svg" alt="Next Arrow" />
      </i>
    </v-btn>
  </div>
</template>

<style scoped>
.introduction-screen {
  background: #fff;
  padding-bottom: 10vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bg-img {
  min-height: 393px;
  max-width: 350px;
  flex: 0 0 350px;
}
.v-application .introduction-screen .icon-btn {
  bottom: 12.4vh;
  min-width: 197px;
  position: absolute;
  right: 0;
  min-height: 45px;
  font-size: 22px;
  font-family: "Avenir Heavy";
  text-transform: capitalize;
  border-radius: 25px 0 0 25px;
  letter-spacing: -0.53px;
}
.icon-wrap {
  width: 15px;
  height: 12px;
  margin: 0 -42px 0 30px;
}
.icon-wrap img {
  width: 100%;
  height: 100%;
  vertical-align: top;
}
@media (max-width: 374px) {
  .bg-img {
    max-width: 288px;
    min-height: 322px;
  }
}
@media (max-height: 400px) {
  .bg-img {
    max-width: 180px;
    min-height: 202px;
    flex: 0 0 180px;
  }
}
</style>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";

@Component
export default class WelcomeIntroduction extends Vue {
  private redirectToRestaurantMenu() {
    // redirect to restaurant menu
    // this.$router.push('restaurantMenu/fursan');
    this.$emit('openRestaurantMenu', true);
  }
}
</script>
