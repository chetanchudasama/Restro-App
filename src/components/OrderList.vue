<template>
  <div class="order-list fill-height">
    <h2 class="pt-2 px-9">
      <v-btn icon :ripple="false" secondary--text class="back-btn mb-5 pa-0" @click="closeMyOrderList">
        <img src="/img/next-arrow.svg" alt="next arrow" />
      </v-btn>
      <span>{{$t("myOrder")}}  </span>
    </h2>
    <div class="list-wrapper pa-3">
      <!-- <v-layout class="column justify-space-between"></v-layout> -->
      <v-card class="mx-auto mb-3 elevation-5 order-card">
      <div class="item-list-wrap pa-2">
        <div v-for="menuItem in addedItemMenuInListDetail" :key="menuItem.id" v-if="addedItemMenuInListDetail.length > 0">
        <v-list-item two-line class="pa-0">
          <v-list-item-avatar size="70" class="ma-0 mr-2">
            <img :src="getImageSrc(menuItem)" alt="dish image" />
          </v-list-item-avatar>
          <v-list-item-content class="text-left">
            <v-list-item-title>
              <v-row no-gutters class="align-center">
                <v-col cols="7" @click="openMenuItemDetailDialog(menuItem)" class="name-title">{{ menuItem.name}}</v-col>
                <v-col cols="5" class="text-right">
                  <span class="ma-2 price-text">{{ calculateMenuItemCost(menuItem) }}</span>
                  <v-btn icon @click="deleteMenuItemFromOrderConfirm(menuItem.id)">
                    <img src="/img/icon-delete.svg" alt />
                  </v-btn>
                </v-col>
              </v-row>
            </v-list-item-title>
            <v-row no-gutters>
              <v-col cols="5">
                <v-list-item-subtitle v-for="addOnList in showAddOnListText(menuItem.optionCategories)" :key="addOnList.id">{{ addOnList }}</v-list-item-subtitle>
              </v-col>
              <v-col cols="7">
                <v-row class="align-center" no-gutters>
                  <v-btn icon @click="minusAmountItem(menuItem)" :disabled="menuItem.itemQuantity <= 1">
                    <img src="/img/minus-icon.svg" alt />
                  </v-btn>
                  <span class="pa-1 count-text">{{menuItem.itemQuantity}}</span>
                  <v-btn icon @click="plusAmountItem(menuItem)">
                    <img src="/img/add-icon.svg" alt />
                  </v-btn>
                </v-row>
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
      </div>
        </div>
        <v-row no-gutters class="align-center total-count pa-4">
          <v-col cols="6 text-left total-text">{{ $t('total') }}</v-col>
          <v-col cols="6 text-right total-price">{{ totalOrderBill }}</v-col>
        </v-row>
      </v-card>
      <div class="btn-group">
        <v-row no-gutters class="btn-wrapper justify-space-between mt-2">
          <v-btn v-if="restaurantMenuData.offerPickup" large rounded class="primary-rounded-btn" :class="!isDeliveryOPtionSelected ? 'primary secondary--text' : 'light-gray gray--text'" @click="pickUpPopup">{{$t('pickUp')}}<br>{{selectedPickupTimeToDisplay}}</v-btn>
          <v-btn v-if="restaurantMenuData.offerDelivery" large rounded class="primary-rounded-btn" :class="!ispickupOptionSelected ? 'primary secondary--text' : 'light-gray gray--text'" @click="locationEnablePopup">{{$t('delivery')}}</v-btn>
        </v-row>
        <v-btn @click="sendOrderOnWhatsApp" large rounded class="primary-rounded-btn mt-2" :disabled="!isDeliveryOPtionSelected && !ispickupOptionSelected" :class="isDeliveryOPtionSelected || ispickupOptionSelected ? 'green secondary--text' : 'light-gray gray--text disabled'">
          <img src="/img/whatsapp.svg" alt class="mr-3" />
          {{$t('sendOrder')}}
        </v-btn>
      </div>
    </div>
      <MenuItemDetail v-if="menuItemDetailDialog" :isOpenedOrderListDialog="true" :menuItem="menuItemDetail" v-on:closeMenuItemDialog="onCloseMenuItemDialog" v-on:itemAddedInMenu="onItemAddedInMenu"> </MenuItemDetail>
    <DeliveryLocation v-if="openMapForLocation" :locationUrl="locationUrl" v-on:closeLocation="closeLocation" v-on:submitLocation="submitLocation"></DeliveryLocation>
      <v-dialog
      content-class="custom-modal confirmation-modal"
      v-model="confirmationDialog"
      width="319"
    >
      <v-card>
        <v-card-title class="headline">
          <v-flex justify-center secondary--text>
            <!-- Restaurant Timing -->
            <v-btn class="close-btn" @click="confirmationDialog = false">
              <img src="/img/close-icon.svg" alt="close icon" />
            </v-btn>
          </v-flex>
        </v-card-title>
        <v-card-text>
          <p>{{$t('confirmation')}}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="deleteMenuItemFromOrder()">{{$t('yes')}}</v-btn>
          <v-btn color="secondary--text" text @click="confirmationDialog = false">{{$t('no')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

       <v-dialog
      content-class="custom-modal enable-location"
      v-model="enableLocationDialog"
      width="319"
    >
      <v-card>
        <div class="location-wrapper">
          <v-row no-gutters>
            <v-col>
              <img src="/img/locationon-pin.svg" alt />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <h3>{{$t('enableLocationForOrder')}}</h3>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-btn
                large
                rounded
                class="primary-rounded-btn primary secondary--text"
                @click="locateMe"
              >{{$t('enableLocation')}}</v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog content-class="custom-modal pickUp-dialog" v-model="pickUpDialog" width="319">
      <v-card>
        <div class="pickup-wrapper">
          <v-row no-gutters>
            <v-col>
              <h3>{{$t('selectPickupTime')}}</h3>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-select
                v-model="selectedPickupTime"
                :items="items"
                :label="$t('selectTime')"
                solo
                class="elevation-0"
                :menu-props="{ contentClass: 'select-menu' }"
              ></v-select>
            </v-col>
          </v-row>
          <v-row no-gutters class="btn-row">
            <v-col>
              <v-btn large rounded @click="savePickupTime" class="primary-rounded-btn primary secondary--text">{{$t('confirm')}}</v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-dialog>
     <v-dialog
      content-class="custom-modal confirmation-modal"
      v-model="confirmationForOrderType"
      width="319"
    >
      <v-card>
        <v-card-title class="headline">
          <v-flex justify-center secondary--text>
            <v-btn class="close-btn" @click="confirmationForOrderType = false">
              <img src="/img/close-icon.svg" alt="close icon" />
            </v-btn>
          </v-flex>
        </v-card-title>
        <v-card-text>
          <p>{{$t('orderSwitchingOption')}}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="switchOrderType">{{$t('yes')}}</v-btn>
          <v-btn color="secondary--text" text @click="confirmationForOrderType = false">{{$t('no')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </div>
</template>

<style scoped>
.order-list{
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
.order-card .name-title {
  font-size: 17px;
  line-height: 24px;
  color: #333a4d;
  font-family: "AvenirLTStd-Medium";
  white-space: normal;
}
.primary-rounded-btn.v-btn:not(.v-btn--round).v-size--large {
    min-width: 135px;
  font-size: 18px;
  min-height: 45px;
  height: auto;
  border-radius: 35px;
}
h2 {
  text-transform: none;
  font-size: 18px;
  letter-spacing: 0.22px;
  font-family: "Avenir Heavy";
  display: block;
  position: relative;
}
.back-btn {
  top: 50%;
  transform: translateY(-50%);
}
.order-card.v-card {
  border-radius: 20px !important;
  height: calc(100vh - 170px);
  padding-bottom: 60px !important;
}
.order-card .item-list-wrap {
  overflow-y: auto;
  height: 100%;
}
.order-card .name-title {
  font-size: 15px;
  line-height: 21px;
  color: #333a4d;
  font-family: "AvenirLTStd-Medium";
}
.order-card .name-title {
  font-size: 17px;
  line-height: 24px;
  color: #333a4d;
  font-family: "AvenirLTStd-Medium";
}
.order-card >>> .v-list-item__subtitle {
  font-size: 13px;
  line-height: 18px;
  color: #b8bbc6;
  font-family: "AvenirLTStd-Roman";
}
.order-card .count-text {
  font-size: 13px;
  line-height: 23px;
  color: #080040;
  letter-spacing: 0.25px;
}
.total-count {
  border-top: 1px dashed #ccc;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
.total-count .total-text {
  font-size: 15px;
  line-height: 21px;
  letter-spacing: -0.36px;
  color: #b8bbc6;
  font-family: "AvenirLTStd-Roman";
}
.total-count .total-price {
  font-size: 17px;
  line-height: 24px;
  letter-spacing: -0.41px;
  color: #080040;
  font-family: "Avenir Heavy";
}
.btn-group >>> .primary-rounded-btn.v-btn:not(.v-btn--round).v-size--large {
  font-family: "AvenirLTStd-Medium";
}
.btn-group >>> .v-btn.primary-rounded-btn.green {
  font-size: 18px;
  min-width: 100%;
}
.btn-group >>> .v-btn.primary-rounded-btn.disabled {
  font-size: 18px;
  min-width: 100%;
}
a.primary-rounded-btn {
  display: inline-flex;
  border-radius: 35px;
  padding: 5px 15px;
  font-size: 22px;
  justify-content: center;
  align-items: center;
  text-transform: capitalize;
  letter-spacing: normal;
  font-family: "Avenir Heavy";
  height: auto;
  min-height: 44px;
  white-space: normal;
  min-width: 100%;
}
.enable-location .location-wrapper {
  padding: 70px 0px 45px;
}
.enable-location .location-wrapper h3 {
  max-width: 230px;
  margin: 60px auto 45px;
}
.pickup-wrapper {
  min-height: 370px;
  padding: 30px 28px 18px;
}
.pickup-wrapper h3 {
  font-size: 23px;
  line-height: 28px;
  letter-spacing: 0.35px;
  margin-bottom: 30px;
}
.pickup-wrapper .btn-row {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 18px;
}
.pickup-wrapper .primary-rounded-btn {
  min-width: calc(100% - 54px) !important;
}
.confirmation-modal p {
  font-family: "Avenir Heavy";
  font-size: 18px;
  line-height: 28px;
  margin: 15px 0 0;
}
/* .select-control {
  width: 155px;
  margin: 0 auto;
  border: 1px solid #000000;
  font-size: 18px;
  line-height: 22px;
  font-family: "AvenirLTStd-Medium";
  border-radius: 2px;
  padding: 10px;
} */

.pickup-wrapper
  >>> .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)
  > .v-input__control
  > .v-input__slot {
  box-shadow: none;
  border: 1px solid #000;
  outline: none;
  width: 155px;
  margin: 0 auto;
  padding: 3px 10px 7px;
}
.pickup-wrapper >>> .v-select__slot label,
.pickup-wrapper >>> .theme--light.v-select .v-select__selection--comma {
  font-size: 20px;
  line-height: 24px;
  font-family: "AvenirLTStd-Medium";
  color: #000000;
  margin: 0;
}
.pickup-wrapper >>> .theme--light.v-select .v-select__selection--comma {
  padding: 6px 0 0;
}
.v-select-list.v-list {
  text-align: left;
  font-size: 20px;
  line-height: 24px;
  font-family: "AvenirLTStd-Medium";
  color: #000000;
  padding: 0;
}
.pickup-wrapper >>> .v-select__slot .v-input__append-inner .v-input__icon {
  background-size: 14px;
  background: url(/img/down-arrow.svg);
  width: 14px;
  height: 14px;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  top: 4px;
  right: -4px;
}
.select-menu {
  box-shadow: none;
  border: 1px solid #000;
}
.arabic-lng .total-count .total-text {
  text-align: right !important;
}
.arabic-lng .total-count .total-price {
  text-align: left !important;
}
.arabic-lng .primary-rounded-btn img {
  margin-right: 0 !important;
  margin-left: 12px !important;
}
.arabic-lng .order-card >>> .v-list-item__subtitle,
.arabic-lng .order-card .name-title {
  text-align: right;
}
.arabic-lng .order-card .v-list-item__title .text-right {
  text-align: left !important;
}


@media (max-width: 991px) and (orientation: landscape) {
  .order-card.v-card {
    min-height: 230px;
  }
  .pickup-wrapper {
    min-height: 285px;
  }
  .enable-location .location-wrapper {
    padding: 40px 0 30px;
  }
  .enable-location .location-wrapper h3 {
    max-width: 230px;
    margin: 16px auto 20px;
  }
}
</style>

<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import MenuItemDetail from "@/components/MenuItemDetail.vue";
import DeliveryLocation from "@/components/DeliveryLocation.vue";
import MenuItemModel from '../models/MenuItemModel';
import Shared from '../common/shared';
import MenuItemOptionCategoryModel from '../models/MenuItemOptionCategoryModel';
import MenuModel from '../models/MenuModel';

@Component({
  components: { MenuItemDetail, DeliveryLocation },
})
export default class OrderList extends Vue {
  @Prop() private addedItemMenuInList: MenuItemModel[];
  @Prop() private restaurantMenuData: MenuModel;
  
  private menuItemDetailDialog: boolean = false;
  private menuItemDetail: MenuItemModel | null = new MenuItemModel();
  private totalOrderBill: number = 0;
  private message: string = "";
  private selectedPickupTime: string = "";
  private enableLocationDialog: boolean = false;
  private pickUpDialog: boolean = false;
  private items: any = ["11:15", "11:30", "11:45", "12:00"];
  private ispickupOptionSelected: boolean = false;
  private isDeliveryOPtionSelected: boolean = false;
  private confirmationDialog: boolean = false;
  private selectedItemToDelete: number = -1;
  private usersLatitude: number = 0;
  private usersLongitude: number = 0;
  private openMapForLocation: boolean = false;
  private locationUrl: string = "";
  private confirmationForOrderType: boolean = false;
  private selectedPickupTimeToDisplay: string = "";
    
  private locationEnablePopup() {
    if (this.ispickupOptionSelected) {
      this.confirmationForOrderType = true;
      return;
    }
    this.openMapForLocation = true;
    this.locationUrl = "https://maps.google.com/?q=";
    
    // if (this.usersLatitude != 0 || this.usersLongitude != 0) {
    //   this.openMapForLocation = true;
    //   this.locationUrl = "https://maps.google.com/?q=" + this.usersLatitude + "," + this.usersLongitude;
    // } else {
    //   this.enableLocationDialog = true;
    // }
  }

  private pickUpPopup() {
    // this.$validator.errors.items = [];
    if (this.isDeliveryOPtionSelected) {
      this.confirmationForOrderType = true;
      return;
    }
    this.selectedPickupTime = "";
    this.pickUpDialog = true;
  }

  private get addedItemMenuInListDetail(): MenuItemModel[] {
    return this.addedItemMenuInList;
  }

  private mounted() {
    this.updateBillPrice();
  }

  private closeMyOrderList() {
    this.$emit("closeMyOrderListDialog", this.totalOrderBill);
  }
  
  private submitLocation() {
    this.openMapForLocation = false;
    this.isDeliveryOPtionSelected = true;
    this.selectedPickupTimeToDisplay = "";
  }

  private closeLocation() {
    this.openMapForLocation = false;
    this.isDeliveryOPtionSelected = false;
    this.ispickupOptionSelected = true;
    this.selectedPickupTimeToDisplay = "";
  }

  // private get isDisabledPickupOrDeliveryButton() {
  //   return this.addedItemMenuInList.length > 0 ? false : true;
  // }

  private openMenuItemDetailDialog(menuItem: MenuItemModel) {
    this.menuItemDetail = menuItem;
    this.menuItemDetailDialog = true;
  }

  private onCloseMenuItemDialog() {
    this.menuItemDetail = null;
    this.menuItemDetailDialog = false;
  }

  private onItemAddedInMenu(menuItem: MenuItemModel,totalPrice: number) {
    const index: number = this.addedItemMenuInListDetail.findIndex(
      (c: MenuItemModel) => c.id === this.menuItemDetail!.id,
    );
    if (index !== -1) {
      this.addedItemMenuInListDetail.splice(index, 1, menuItem);
      this.updateBillPrice();
    }
    this.menuItemDetailDialog = false;
  }

  private deleteMenuItemFromOrderConfirm(itemId: number) {
    this.confirmationDialog = true;
    this.selectedItemToDelete = itemId;
  }

  private deleteMenuItemFromOrder() {
    if (this.selectedItemToDelete > 0) {
      const index = this.addedItemMenuInList.findIndex((x) => x.id === this.selectedItemToDelete);
    if (index !== -1) {
      this.addedItemMenuInList.splice(index, 1);
      this.updateBillPrice();
    }
    this.confirmationDialog = false;
    }
  }

  private getImageSrc(menuItem: any) {
    return Shared.getImageSrcLink(menuItem.id, menuItem.hasBigPicture);
  }

  private minusAmountItem(menuItem: MenuItemModel) {
    const totalTemp = this.totalOrderBill;
    menuItem.itemQuantity = menuItem.itemQuantity - 1;
   let totalMenuItem = this.calculateMenuItemCost(menuItem);
   const temporyPrice = totalMenuItem / menuItem.itemQuantity; 
   this.totalOrderBill = this.roundedNumber(totalTemp - temporyPrice);
  }

  private plusAmountItem(menuItem: MenuItemModel) {
  let totalTemp = this.totalOrderBill;
  totalTemp = this.totalOrderBill - this.calculateMenuItemCost(menuItem);
  menuItem.itemQuantity = menuItem.itemQuantity + 1;
   let totalMenuItem = this.calculateMenuItemCost(menuItem);
  //  if (menuItem.itemQuantity === 1) {
  //    const tempTotal = totalMenuItem;
  //    totalMenuItem =  this.roundedNumber(menuItem.price + tempTotal- menuItem.price);
  //  }
   this.totalOrderBill = this.roundedNumber(totalMenuItem + totalTemp);
  }

  private showAddOnListText(menuItemOption: MenuItemOptionCategoryModel[]) {
    const addOnList =  menuItemOption.filter((y) => y.checkType === "CheckBox");
    if (addOnList && addOnList.length > 0) {
      const addOnListText = addOnList[0].options.filter((x) => x.isSelected).map((y) => y.name);
      return addOnListText ?addOnListText :[];
    }
    return [];
  }

  // private showAddOnListText(menuItemOption: MenuItemOptionCategoryModel[]) {
  //   const addOnList =  menuItemOption.filter((y) => y.checkType === "CheckBox");
  //   let addOnListText: any;
  //   if (addOnList && addOnList.length > 0) {
  //     addOnList.forEach((element, index) => {
  //       const addOnListText = addOnList[index].options.filter((x) => x.isSelected).map((y) => y.name);
  //       console.log(addOnListText);
  //     });
  //   }
  //   console.log(addOnListText ?addOnListText :[]);
  //   return addOnListText ?addOnListText :[];
  // }

  private calculateMenuItemCost(menuItem: MenuItemModel) {
    // here confusion 
    let totalPrice = this.roundedNumber(menuItem.price * menuItem.itemQuantity); 
    // calculate meal size
    const menuItemOptionSize = menuItem.optionCategories.find((x) => x.checkType === "Radio");
      if (menuItemOptionSize) {
        const index = menuItemOptionSize.options.findIndex((x) => x.isSelected === true);
        if (index !== -1) {
          totalPrice = this.roundedNumber(totalPrice + (menuItemOptionSize.options[index].price * menuItem.itemQuantity));
          // totalPrice = this.roundedNumber(totalPrice + (menuItemOptionSize.options[index].price * menuItem.itemQuantity));
        }
    }
    // calculate add on menu in item
    const menuItemAddOn = menuItem.optionCategories.filter((y) => y.checkType === "CheckBox");
      if (menuItemAddOn && menuItemAddOn.length > 0) {
        menuItemAddOn.forEach((element) => {
          totalPrice = this.roundedNumber(totalPrice + (element.options.filter((x) => x.isSelected === true).reduce((a, y) => a + y.price, 0) * menuItem.itemQuantity));
        });
      }
    // this.totalOrderBill = totalPrice;
    return totalPrice;
  }

  private roundedNumber(num: number) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }

  private appendLine(text, newLine, indent, bold) {
    let msg = "";

     if(newLine == true)
      msg = msg.concat("\r\n")


      if(indent == true)
          msg = msg.concat('\t')
      
      if(bold == true)
            msg = msg.concat("*" + text +"* ");
      else msg = msg.concat(text);

      this.message = this.message.concat(msg)
  }

  private getMessage() {
    this.appendLine('Order Type:', true, false,true)
    if (this.ispickupOptionSelected) {
      this.appendLine('Pickup', false, false,false)
      this.appendLine(',', true, false,false)
      this.appendLine('Pickup Time:' + this.selectedPickupTimeToDisplay, false, false,false)
    } else {
      this.appendLine('Delivery', false, false,false)
    }
    this.appendLine('-------------------------------------', true, false,false)
    
    this.addedItemMenuInList.forEach(menuItem => {
      this.appendLine(menuItem.name + "X" + menuItem.itemQuantity, true, false,true);
      let itemSize = "";
      const menuItemOptionSize = menuItem.optionCategories.find((x) => x.checkType === "Radio");
      if (menuItemOptionSize) {
        const index = menuItemOptionSize.options.findIndex((x) => x.isSelected === true);
        if (index !== -1) {
          itemSize = menuItemOptionSize.options[index].name;
        }
      }
      this.appendLine('Size:'+ itemSize, true, true,false);
      const menuItemAddOn = menuItem.optionCategories.filter((y) => y.checkType === "CheckBox");
      if (menuItemAddOn && menuItemAddOn.length > 0) {
        menuItemAddOn.forEach((element) => {
          let addonTextList = element.options.filter((x) => x.isSelected === true).map((y) => y.name);
          addonTextList.forEach((addOnText) => {
            this.appendLine(addOnText, true, true,false);
          })
        });
      }
    });
    
    this.appendLine('', true, false,false)
    this.appendLine('-------------------------------------', true, false,false)
    this.appendLine('Total:', true, false,true)
    this.appendLine(this.totalOrderBill + 'SR', false, false,true)
    this.appendLine('-------------------------------------', true, false,false)

    if(this.isDeliveryOPtionSelected) {
      this.appendLine('Address:', true, false,true)
      this.appendLine("https://www.google.com/maps/place/" +  this.usersLatitude + "," + this.usersLongitude, true,false,false)
  
      // this.appendLine('Address details:', true, false,true)
      // this.appendLine('An Nada, Riyadh 13317, street number 5532', true,false,false)
      // this.appendLine('Building c8, Appartment number 5', true,false,false)
    }


    let url = "https://wa.me/+"+ this.restaurantMenuData.whatsappNumber + "?text=" + this.message;
    url = window.encodeURI(url);

    window.open(url, "_blank");    
  }

  private sendOrderOnWhatsApp() {
    this.message = "";
    this.getMessage();
  }

  private updateBillPrice() {
    if (this.addedItemMenuInList.length > 0) {
      this.totalOrderBill = 0;
      this.addedItemMenuInList.forEach(menuItem => {
        this.totalOrderBill = this.roundedNumber(this.totalOrderBill + this.calculateMenuItemCost(menuItem));
      });
    } else {
      this.totalOrderBill = 0;
    }
  }


  // private async validate(): Promise<boolean> {
  //   const result: boolean = await this.$validator.validateAll(
  //     "refPickup",
  //   );
  //   // set focus to non validate field
  //   if (!result) {
  //     const errorItem: any = this.$el.querySelector(".error--text");
  //       if (errorItem) {
  //           errorItem.focus();
  //           errorItem.getElementsByTagName("input")[0].focus();
  //       }
  //   }
  //   return result;
  // }

  private savePickupTime() {
    // this.validate().then((result: boolean) => {
    //   if (result) {
        this.pickUpDialog = false;
        this.ispickupOptionSelected = true;
        this.isDeliveryOPtionSelected = false;
        this.selectedPickupTimeToDisplay = this.selectedPickupTime;
    //   }
    // });
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
      const location = await this.getLocation() as any;
      // console.log("https://maps.google.com/?q=" + location.coords.latitude + "," + location.coords.longitude );
      this.usersLatitude = location.coords.latitude;
      this.usersLongitude = location.coords.longitude;
      this.enableLocationDialog = false;

      this.openMapForLocation = true;
      this.locationUrl = "https://maps.google.com/?q=" + this.usersLatitude + "," + this.usersLongitude;
    } catch(e) {
      // to do handle error
    }
  }

  private switchOrderType() {
    if (this.ispickupOptionSelected) {
      this.isDeliveryOPtionSelected = true;
      this.ispickupOptionSelected = false;
      this.openMapForLocation = true;
      this.selectedPickupTime = "";
    } else {
      this.ispickupOptionSelected = false;
      this.isDeliveryOPtionSelected = true;
      this.pickUpDialog = true;
    }
    this.confirmationForOrderType = false;
  }
}
</script>