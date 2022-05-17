<template>
  <div class="dilivary-option fill-height">
    <div class="map-wrapper">
      <h2>
        <v-btn text small :ripple="false" secondary--text class="back-btn" @click="closeLocation">
          <img src="/img/next-arrow.svg" alt="next arrow" />
        </v-btn>
        <span>Select you're Location</span>
      </h2>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3333.967410377096!2d-111.89998968453055!3d33.31966746342457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDE5JzEwLjgiTiAxMTHCsDUzJzUyLjEiVw!5e0!3m2!1sen!2sus!4v1516690469899"
        width="100%"
        height="100%"
        frameborder="0"
        style="border:0"
        allowfullscreen
      ></iframe>
      <div class="location-detail-wrapper">
        <div class="location-detail primary">
          <p class="secondary--text text-left">Location Text (Taken from google maps).</p>
          <p class="secondary--text text-left">Example: Uthman Bin Afan Rd, An Nada</p>
          <v-form ref="form" v-model="valid">
            <v-text-field
              color="secondary--text"
              placeholder="Capidesign"
              v-model="name"
              label="House, Apartment, Office number"
            ></v-text-field>
          </v-form>
        </div>
        <v-btn large rounded class="primary-rounded-btn primary secondary--text" @click="submitLocation()">CONFIRM</v-btn>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dilivary-option {
  position: fixed;
  background: white;
  z-index: 9;
  top: 0px;
  left: 0;
  right: 0px;
  max-width: 767px;
  margin: 0 auto;
  overflow-y: auto;
}
.dilivary-option .map-wrapper {
  height: 100%;
  position: relative;
  z-index: 1;
}
.dilivary-option .map-wrapper iframe {
  position: relative;
  z-index: -1;
}
.dilivary-option .map-wrapper h2 {
  position: absolute;
  left: 0;
  right: 0;
  top: 10px;
  line-height: 35px;
  padding: 0 40px;
}
.dilivary-option .map-wrapper h2 .back-btn {
  top: 4px;
  transform: none;
}
.dilivary-option .map-wrapper .location-detail-wrapper {
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  z-index: 2;
}
.dilivary-option .map-wrapper .location-detail {
  padding: 32px 16px 0;
  border-radius: 30px 30px 0px 0;
}
.dilivary-option .map-wrapper .location-detail p {
  margin: 0;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #080040;
  font-family: "Avenir Heavy";
}
.dilivary-option .map-wrapper .location-detail .v-form {
  margin-top: 30px;
}
.dilivary-option .map-wrapper .location-detail .v-form label {
  font-size: 12px;
  line-height: 16px;
  color: #353535;
  font-family: "AvenirLTStd-Book";
}
.dilivary-option .map-wrapper .location-detail .v-form .v-input input {
  color: #080040 !important;
  font-size: 17px;
  font-family: "AvenirLTStd-Medium";
}
.dilivary-option .map-wrapper .primary-rounded-btn {
  min-width: calc(100% - 32px) !important;
  margin: 16px 0 auto;
  font-size: 15px;
  letter-spacing: -0.36px;
}
@media (max-width: 991px) and (orientation: landscape) {
  .v-dialog.delivary-option-modal .map-wrapper .location-detail-wrapper {
    bottom: 15px;
  }
}
</style>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class DeliveryLocation extends Vue {
  @Prop() private locationUrl: string;
  private name: string = "";
  private valid: any = null;

  private created() {
    // debugger;
  }

  private closeLocation() {
    this.$emit("closeLocation");
  }

  private submitLocation() {
    this.$emit("submitLocation");
  }
}
</script>
