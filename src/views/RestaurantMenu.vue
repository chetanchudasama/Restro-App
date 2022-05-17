<template>
  <!-- <WelcomeIntroduction v-if="!isOpenRestaurantMenu" v-on:openRestaurantMenu="openRestaurantMenu"> </WelcomeIntroduction> -->
  <div 
    class="menu-screen fill-height" 
    :class="[menuItemDetailDialog ? 'open-menu' : '',isArabicLang ? 'arabic-lng': '']"
    @scroll="handleScroll()"
  >
    <div class="logo-banner bg-img" :style="{ 'background': 'url(' + restaurantLogo + ')' }">
      <v-btn @click="isArabicLang =!isArabicLang" class="lng-btn" text>
        <i class="img-wrap">
          <img class="en-img" src="/img/arabic.svg" alt="arbic image" />
          <img class="ar-img" src="/img/english.svg" alt="english image" />
        </i>
      </v-btn>
    </div>
    <div class="category-block">
      <v-row class="status-block" no-gutters>
        <v-col cols="6" class="py-2 pb-1 px-4 text-left">
          <v-btn class="status-icon-btn" text @click="timingPopup()" :disabled="!isRestaurantOpen">
            <i class="timer-icon icon-wrap">
              <img src="/img/clock-icon.svg" alt="clock icon" />
            </i>
          </v-btn>
        </v-col>
        <v-col cols="6" class="py-2 pb-1 px-4 text-right">
          <v-btn class="status-icon-btn" text @click="mapPopup()">
            <i class="icon-wrap">
              <img src="/img/pin-icon.svg" alt="Pin Icon" />
            </i>
          </v-btn>
        </v-col>
      </v-row>
      <h1 class="px-7 page-title py-0">{{ $t('categories_title_text') }}</h1>
      <div class="menu-bar">
        <v-list class="menu-list px-0 pt-4 pb-5">
          <div v-for="menu in menuCategories" :key="menu.id" v-if="menuCategories.length > 0">
            <v-list-item
              link
              @click="scrollMeTo(menu.name+menu.id)"
              :class="{active:menuActive === menu.name+menu.id}"
            >{{ menu.name }}</v-list-item>
          </div>
        </v-list>
      </div>
      <div class="menu-content-list">
        <div
          class="menu-content-block px-3 pb-5"
          v-for="menu in menuCategories"
          :key="menu.id"
          :ref="menu.name+menu.id"
          v-if="menuCategories.length > 0"
        >
          <h3 class="sec-title pb-3">{{ menu.name }}</h3>
          <div
            class="menu-item-block"
            v-for="menuItem in menu.items"
            :key="menuItem.id"
            v-if="menu.items.length > 0"
            @click="openMenuItemDetailDialog(menuItem)"
          >
            <v-card class="mx-auto pa-0 mb-3 menu-card elevation-5">
              <v-list-item two-line class="pa-2">
                <v-list-item-avatar size="80" class="my-0 elevation-3">
                  <img :src="getImageSrc(menuItem)" :alt="menuItem.name" />
                </v-list-item-avatar>
                <v-list-item-content class="text-left pa-0">
                  <span class="price-label">
                    <em>{{menuItem.price}} </em>
                  </span>
                  <v-list-item-title>{{ menuItem.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ menuItem.description }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </div>
        </div>
      </div>
      <div class="btn-row pa-6">
        <v-btn
          large
          rounded
          @click="openMyOrderListDialog"
          class="primary-rounded-btn primary secondary--text"
        >{{ $t('total_orders_title_text') }} ( {{ totalItemAddedInListSum }} )</v-btn>
      </div>
    </div>
    <MenuItemDetail v-if="menuItemDetailDialog" :menuItem="menuItemDetail" v-on:closeMenuItemDialog="onCloseMenuItemDialog" v-on:itemAddedInMenu="onItemAddedInMenu"> </MenuItemDetail>
    <OrderList 
      v-if="myOrderListDialog" 
      :restaurantMenuData="restaurantMenuData"
      :addedItemMenuInList="addedItemMenuInList"
      v-on:closeMyOrderListDialog="onCloseMyOrderListDialog"> 
    </OrderList>
     <v-dialog
      content-class="custom-modal restaurant-timing"
      v-model="restaurantTimingDialog"
      width="319"
    >
      <v-card>
        <v-card-title class="headline">
          <v-flex justify-center secondary--text>
            <!-- Restaurant Timing -->
            <v-btn class="close-btn" @click="restaurantTimingDialog = false">
              <img src="/img/close-icon.svg" alt="close icon" />
            </v-btn>
          </v-flex>
        </v-card-title>
        <v-card-text>
          <p>{{ restaurantTimingMessage }}</p>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      content-class="custom-modal border-radius-none loaction-map-modal"
      v-model="mapDialog"
      width="337"
    >
      <v-card>
        <div class="map-wrapper">
          <v-btn class="close-btn" @click="mapDialog = false">
            <img src="/img/close-icon.svg" alt="close icon" />
          </v-btn>
          <iframe
            width="100%"
            height="100%"
            id="gmap_canvas"
            :src="restaurantAddress"
            frameborder="0"
            scrolling="no"
            marginheight="0"
            marginwidth="0"
          ></iframe>
          <!-- <a  large
            rounded
            class="primary-rounded-btn primary secondary--text" href="http://maps.google.com/?q=24.7805349,46.6928303"> Click me </a> -->
          <v-btn
            large
            rounded
            class="primary-rounded-btn primary secondary--text"
            @click="locationEnablePopup()"
          >{{$t("directions")}}</v-btn>
          <!-- <v-btn  large
            rounded
            class="primary-rounded-btn primary secondary--text">
          <a :href="restaurantAddress" target="_blank"
          >Directions</a>
          </v-btn> -->
        </div>
      </v-card>
    </v-dialog>
    <!-- <v-dialog
      content-class="custom-modal enable-location"
      v-model="enableLocationDialog"
      width="319"
    >
      <v-card>
        <div class="location-wrapper">
          <v-row no-gutters>
            <v-col>
              <img src="img/locationon-pin.svg" alt />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <h3>Enable your location for easily order</h3>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-btn
                large
                rounded
                @click="locateMe"
                class="primary-rounded-btn primary secondary--text"
              >Enable Location</v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-dialog> -->
  </div>
</template>

<style scoped>
.open-menu.menu-screen:after {
  opacity: 0.74;
  visibility: visible;
}
.menu-screen {
  height: 100vh;
  overflow: auto;
  position: relative;
}
.menu-screen:after {
  position: fixed;
  content: "";
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: #bcb7b7;
  visibility: hidden;
  opacity: 0;
  z-index: 999;
}
.logo-banner {
  height: 36vh;
}
.logo-banner >>> .v-input--switch {
  position: absolute;
  margin: 10px 15px 0;
}
.logo-banner >>> .v-input--switch label {
  color: #fff;
  text-transform: capitalize;
  font-size: 18px;
  font-family: "Avenir Heavy";
}
.logo-banner >>> .v-input--switch .v-input__append-outer {
  margin: 0;
}
.category-block {
  background: #fff;
  height: calc(64vh + 30px);
  border-radius: 30px 30px 0px 0px;
  position: relative;
  z-index: 1;
  margin-top: -30px;
  transition: none;
}
.category-block.sticky-menu {
  margin: 0;
  padding-top: 30px;
}
.status-icon-btn .status-icon {
  height: 15px;
  width: 15px;
  border-radius: 100%;
  display: inline-block;
  vertical-align: middle;
  margin-left: 8px;
}
.status-icon-btn .opened {
  background: #abf90c;
}
.status-icon-btn .closed {
  background: red;
}
.category-block .status-block >>> .v-btn.status-icon-btn {
  min-width: 1px;
  padding: 0;
  height: auto;
}
.status-icon-btn .icon-wrap {
  width: 28px;
  height: 27px;
}
.status-icon-btn .icon-wrap img {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}
.menu-list {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
}
.menu-bar {
  background: #fff;
}
.menu-bar.sticky {
  position: fixed;
  top: 0;
  z-index: 9;
  width: 100%;
}
.menu-bar .menu-list >>> .v-list-item.theme--light {
  font-size: 17px;
  line-height: 23px;
  letter-spacing: 0.32px;
  font-family: "AvenirLTStd-Roman";
  color: #080040 !important;
  justify-content: center;
  background: transparent;
  border-radius: 18px;
  min-height: 36px;
  padding: 0px 25px;
  margin: 0 8px;
  transition: all 3s;
}
.menu-bar .menu-list >>> .v-list-item.theme--light.active {
  color: #ffffff !important;
  background: #080040;
}
.menu-content-list {
  padding-bottom: 70px;
}
.menu-content-block:last-child {
  padding-bottom: 0 !important;
}
.menu-card {
  border-radius: 8px !important;
}
.menu-card >>> .v-list-item__avatar {
  border: 1px solid #707070;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 8px !important;
}
.menu-card .v-list-item__title {
  font-size: 17px;
  line-height: 22px;
  letter-spacing: -0.41px;
  font-family: "Avenir Heavy";
  margin: 0;
  padding-right: 58px;
  white-space: normal;
}
.menu-card .v-list-item__subtitle {
  font-size: 13px;
  line-height: 18px;
  letter-spacing: -0.08px;
  font-family: "AvenirLTStd-Roman";
  margin: 0;
  color: #6a6a6a;
  white-space: normal;
  padding-right: 5px;
}
.menu-card .price-label {
  min-width: 52px;
  font-size: 18px;
  font-family: "AvenirLTStd-Roman";
  letter-spacing: -0.11px;
  line-height: 18px;
  color: #6a6a6a;
  background: #fdc72f !important;
  right: 0;
  top: 0 !important;
  min-height: 32px;
  align-items: center;
  display: inline-flex;
  justify-content: center;
  background-repeat: no-repeat;
  border-radius: 0 8px 0 8px;
  position: absolute;
  padding: 5px 10px;
}
.menu-card .price-label sub {
  bottom: -2px;
  font-size: 12px;
  font-family: "AvenirLTStd-Roman";
  letter-spacing: 0.8px;
  margin-left: 4px;
}
.category-block .btn-row {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 2;
  max-width: 767px;
  margin: 0 auto;
}
.category-block .btn-row >>> .v-btn {
  min-width: 100% !important;
}

/*modal style*/
.restaurant-timing p {
  font-family: "Avenir Heavy";
  font-size: 18px;
  line-height: 28px;
  margin: 15px 0 0;
}
.restaurant-timing .weekday {
  font-family: "Avenir Heavy";
  font-size: 18px;
  line-height: 28px;
}

.restaurant-timing .time-block {
  font-family: "Avenir Heavy";
  font-size: 12px;
  line-height: 28px;
}

.restaurant-timing .headline {
  font-family: "Avenir Heavy" !important;
  font-size: 22px !important;
  line-height: 28px;
  padding-top: 6px !important;
  padding-bottom: 20px !important;
}

.restaurant-timing .v-card__text {
  padding-bottom: 30px !important;
}
.restaurant-timing .v-card__text .row {
  margin-bottom: 3px;
}

.loaction-map-modal .map-wrapper {
  line-height: 0;
  position: relative;
  height: 555px;
  max-height: calc(100vh - 50px);
    z-index: 1;
}
.loaction-map-modal .map-wrapper iframe {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
   position: relative;
  z-index: -1;
}

.loaction-map-modal .primary-rounded-btn {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
}
.loaction-map-modal .primary-rounded-btn a {
  color: inherit;
  font-size: inherit;
  font-family: inherit;
}
.enable-location .location-wrapper {
  padding: 70px 0px 45px;
}
.enable-location .location-wrapper h3 {
  max-width: 230px;
  margin: 60px auto 45px;
}

/*arabic style*/
.arabic-lng .status-block .col.text-right {
  text-align: left !important;
}
.arabic-lng .status-block .col.text-left {
  text-align: right !important;
}
.arabic-lng .status-icon-btn .status-icon {
  margin-left: 0;
  margin-right: 8px;
}
.arabic-lng .menu-item-block .menu-card >>> .v-list-item .v-list-item__content {
  text-align: right !important;
}
.arabic-lng .menu-card >>> .v-list-item__avatar {
  margin-left: 8px !important;
  margin-right: 0 !important;
}
.arabic-lng .menu-card .v-list-item__title {
  padding-right: 0;
  padding-left: 58px;
  font-weight: 700;
}
.arabic-lng .menu-card .v-list-item__subtitle {
  padding-right: 0;
  padding-left: 10px;
}
.arabic-lng .menu-card .price-label {
  left: 0;
  right: auto;
  border-radius: 8px 0 8px 0;
}
</style>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import Shared from "../common/shared";
import WelcomeIntroduction from "@/components/WelcomeIntroduction.vue";
import MenuItemDetail from "@/components/MenuItemDetail.vue";
import OrderList from "@/components/OrderList.vue";
import storeGetters from "../store/storeGetters";
import eventBus from '../common/bus';
import MenuModel from '../models/MenuModel';
import MenuCategoryModel from '../models/MenuCategoryModel';
import MenuItemModel from '../models/MenuItemModel';

@Component({
  components: { WelcomeIntroduction, MenuItemDetail, OrderList },
})
export default class RestaurantMenu extends Vue {
  private restaurantTimingDialog: boolean = false;
  private mapDialog: boolean = false;
  // private enableLocationDialog: boolean = false;
  private menuActive: string = "";
  private restaurantLogo: string = "";
  private isOpenRestaurantMenu: boolean = false;
  private isArabicLang: boolean = false;
  private restaurantMenuData: MenuModel = new MenuModel();
  private restaurantMenuDataTemp: MenuModel = new MenuModel();
  private isRestaurantOpen: boolean = false;
  private menuCategories: MenuCategoryModel[] = [];
  private restaurantAddressLatLong: string = "";
  private menuItemDetailDialog: boolean = false;
  private menuItemDetail: MenuItemModel | null = new MenuItemModel();
  private myOrderListDialog: boolean = false;
  private totalItemAddedInListSum: number = 0;
  private addedItemMenuInList: MenuItemModel[] = [];
  private restaurantTimingMessage: string = "";
  private errorMessage: string = "";
  private location: any = null;

  private timingPopup() {
    this.restaurantTimingDialog = true;
  }

  private created() {
    this.restaurantLogo = Shared.APIBaseURL + "menus/"+ (this.$route && this.$route.params && this.$route.params.name ? this.$route.params.name : "null") +"/MenuHeader";
  }

  private mounted() {
    this.loadRestaurantMenu();
  }

  @Watch("isArabicLang")
  private loadRestaurantMenu() {
    (this.$i18n as any).locale = this.isArabicLang ? "ar" : "en";
    if (this.getMenusEN && this.getMenusAR) {
      if (this.isArabicLang) {
        this.restaurantMenuData = this.getMenusAR;
        this.restaurantMenuDataTemp = this.getMenusAR; 
      } else {
        this.restaurantMenuData = this.getMenusEN;
        this.restaurantMenuDataTemp = this.getMenusEN;
      }
      // this.restaurantAddressLatLong = "https://maps.google.com/?origin=37.421552399999996,-122.09509510000001,&daddr=24.7974921,46.675502";
      this.restaurantAddressLatLong = this.restaurantMenuData.addressCoordinates;
      this.restaurantTimingMessage = this.restaurantMenuData.timingMessage;
      this.isRestaurantOpen = this.restaurantMenuData.isActive;
      this.menuCategories = this.restaurantMenuData.categories;
      this.menuActive =
        this.menuCategories && this.menuCategories.length > 0
          ? this.menuCategories[0].name + this.menuCategories[0].id
          : "";
    }
  }

  private get getMenusEN(): MenuModel | null {
    return storeGetters.getMenusEN();
  }

  private get getMenusAR(): MenuModel | null {
    return storeGetters.getMenusAR();
  }

  private get restaurantAddress() {
    return (
      "https://maps.google.com/maps?q=" +
      (this.restaurantAddressLatLong
        ? this.restaurantAddressLatLong
        : "university%20of%20san%20francisco") +
      "&t=&z=15&ie=UTF8&iwloc=&output=embed"
    );
  }

  private mapPopup() {
    this.mapDialog = true;
  }

  private scrollMeTo(refName) {
    setTimeout(() => {
      this.menuActive = refName;
      const element = this.$refs[refName] as HTMLElement;
      // scrol down menu item
      element[0].scrollIntoView({ behavior: "smooth" });
    }, 0);
  }

  private openRestaurantMenu(openRestaurantMenu: boolean) {
    this.isOpenRestaurantMenu = openRestaurantMenu;
  }

  private getImageSrc(menuItem: any) {
    return Shared.getImageSrcLink(menuItem.id, menuItem.hasBigPicture);
  }

  private handleScroll() {
   const menuBar = document.querySelector(".menu-bar") as HTMLElement;
   const body = document.getElementsByClassName("menu-screen")[0] as HTMLElement;
   const catBlock = document.getElementsByClassName(
      "category-block",
    )[0] as HTMLElement;
   const topImageHeight = document.querySelector(".logo-banner") as HTMLElement;
   const menuBarTop = menuBar.offsetTop + topImageHeight.offsetHeight - 30;
   const bodyTop = body.scrollTop;
   if (bodyTop >= menuBarTop) {
      menuBar.classList.add("sticky");
      catBlock.classList.add("sticky-menu");
    } else {
      menuBar.classList.remove("sticky");
      catBlock.classList.remove("sticky-menu");
    }
  }

  private openMenuItemDetailDialog(menuItem: MenuItemModel) {
    this.menuItemDetail = Object.assign(new MenuItemModel(), menuItem);
    this.menuItemDetailDialog = true;
  }

  private onCloseMenuItemDialog() {
    this.menuItemDetail = null;
    this.menuItemDetailDialog = false;
  }

  private openMyOrderListDialog() {
    if (this.totalItemAddedInListSum > 0) {
      this.myOrderListDialog = true;
    } else {
      eventBus.$emit("showMessage", "No items in your order, please choose one at least");
    }
  }

  private onItemAddedInMenu(menuItem: MenuItemModel, totalPrice: number) {
    this.menuItemDetail = null;
    this.addedItemMenuInList.push(menuItem);
    this.totalItemAddedInListSum += totalPrice;
    this.menuItemDetailDialog = false;
  }

  private onCloseMyOrderListDialog(totalAddedItem: number) {
    this.totalItemAddedInListSum = totalAddedItem;
    this.myOrderListDialog = false;
  }

  private async getLocation() {
    return new Promise((resolve, reject) => {

      if(!("geolocation" in navigator)) {
        reject(new Error('Geolocation is not available.'));
      }

      navigator.geolocation.getCurrentPosition(pos => {
        resolve(pos);
      }, err => {
        reject(err);
      });

    });
  }

  private async locateMe() {
    try {
      this.location = await this.getLocation();
      this.restaurantAddressLatLong = "https://www.google.com/maps/dir/Current+Location/" + this.restaurantMenuData.addressCoordinates;
      window.location.href= this.restaurantAddressLatLong;
      // this.restaurantAddressLatLong = "https://maps.google.com/?saddr=" + this.location.coords.latitude + "," + this.location.coords.longitude + ",&daddr=" + this.restaurantMenuData.addressCoordinates;
      // this.enableLocationDialog = false;
    } catch(e) {
      this.errorMessage= e.message;
    }
  }

  private locationEnablePopup() {
    // here open new
    window.open(this.restaurantAddress, "_blank");
  }
}
</script>
