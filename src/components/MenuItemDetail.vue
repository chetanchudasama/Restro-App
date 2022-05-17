<template>
  <div class="menu-detail-block" :class="isOpenedOrderListDialog ? 'menu-header-border' : 'menu-header-radius' ">
    <div class="menu-detail-inner">
    <v-btn class="back-btn" text @click="closeMenuItemDetail">
      <img src="/img/next-arrow.svg" alt="next arrow" />
    </v-btn>
    <div class="img-block">
      <img :src="menuItemImageSrc" alt="Item image" />
    </div>
    <div class="title-content">
      <h2>{{ menuItemDetail.name }}</h2>
      <p>{{ menuItemDetail.description }}</p>
    </div>
    <div class="filter-block size-block" v-if="menuItemOptionSize">
      <div class="bg-title">
        <h3>{{ menuItemOptionSize.name }}</h3>
      </div>
      <div class="filter-detail">
        <v-radio-group class="radio-group pa-0 ma-0" v-model="selectedMenuItemOptionSize">
          <v-radio
            v-for="menu in menuItemOptionSize.options"
            :key="menu.id"
            :label="menu.name"
            :name="menuItemOptionSize.name"
            :value="menu.id"
            class="size-btn"
            hide-details
            @click="addMenuItemListPrice(menu.price)"
          ></v-radio>
        </v-radio-group>
      </div>
    </div>
    <div class="filter-block amount-block">
      <div class="bg-title">
        <h3>Choose Amount {{ menuItemDetail.itemQuantity }} </h3>
      </div>
      <div class="filter-detail">
        <v-btn
          icon
          class="count-btn minus-btn pa-0"
          :disabled="menuItemDetail.itemQuantity <= 1"
          @click="minusAmountItem"
        >
          <img src="/img/minus-sign.svg" alt="Minus Sign" />
        </v-btn>
        <span class="count-number">{{ menuItemDetail.itemQuantity }}</span>
        <v-btn icon class="count-btn plus-btn pa-0" @click="plusAmountItem">
          <img src="/img/plus-sign.svg" alt="Plus Sign" />
        </v-btn>
      </div>
    </div>
    <div class="filter-block check-block" v-for="menuItem in menuItemAddOn" :key="menuItem.id">
      <div class="bg-title">
        <h3>{{ menuItem.name }}</h3>
      </div>
      <div class="filter-detail">
        <div class="checkbox-wrap" v-for="menu in menuItem.options" :key="menu.id">
           <v-checkbox v-model="selectedAddOnList" :label="menu.name" :value="menu.id"></v-checkbox>
        </div>
      </div>
    </div>
    </div>
    <div class="btn-block">
      <span class="price-text">{{totalPrice }}</span>
      <v-btn
        class="icon-btn primary elevation-0 secondary--text icon-text-btn"
        @click="itemAddedInMenu"
      >
        {{ isOpenedOrderListDialog ? $t('update') : $t('add') }}
        <i class="icon-wrap">
          <img src="/img/next-arrow.svg" alt="Next Arrow" />
        </i>
      </v-btn>
    </div>
    
  </div>
</template>

<style scoped>
.menu-detail-block {
  background: #fff;
  position: fixed;
  z-index: 9999;
  top: auto;
  bottom: 0%;
  right: 0;
  padding: 30px 0 110px;
  border-radius: 50px 50px 0 0;
  overflow-y: auto;
  transition: all 0.3s;
  max-width: 767px;
  margin: 0 auto;
}
.menu-detail-block.menu-header-radius {
  height: calc(100% - 4.5vh);
  border-radius: 50px 50px 0 0;
  left: 1px;
}
.menu-detail-block.menu-header-border {
 height: 100%;
 border-radius: 0;
 left: 0;
}
.menu-detail-block .menu-detail-inner {
  overflow-y: auto;
  height: 100%;
}
.open-menu .menu-detail-block {
  bottom: 0;
}
.menu-detail-block .img-block {
  width: 167px;
  margin: 0 auto 22px;
}
.menu-detail-block .img-block img {
  height: auto;
  width: 100%;
  object-fit: cover;
}
.menu-detail-block .title-content {
  padding: 0 28px 20px;
}
.menu-detail-block .title-content h2 {
  font-size: 20px;
  line-height: 25px;
  letter-spacing: 0.38px;
  margin-bottom: 7px;
}
.menu-detail-block .title-content p {
  font-size: 17px;
  line-height: 22px;
  letter-spacing: 0.32px;
  color: #6a6a6a;
  margin-bottom: 0;
}
.filter-block .bg-title h3 {
  background: #08004009;
  font-size: 13px;
  line-height: 22px;
  letter-spacing: 0.25px;
  font-family: "AvenirLTStd-Roman";
  padding: 9px 20px;
}
.filter-block .filter-detail >>> .size-btn {
  text-transform: capitalize;
  font-size: 17px;
  line-height: 23px;
  letter-spacing: 0.32px;
  color: #080040;
  padding: 6px 19px;
  border-radius: 18px;
  margin: 0 5px;
}
.filter-block .filter-detail >>> .v-btn.active {
  background: #080040;
  color: #fff;
}
.filter-block .filter-detail .count-btn {
  width: 30px;
  height: 30px;
  margin: 0 20px;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
}
.filter-block .filter-detail .count-btn[disabled] {
  pointer-events: none;
  opacity: 0.5;
}
.filter-block .filter-detail .count-number {
  display: inline-block;
  vertical-align: middle;
  font-size: 17px;
  line-height: 23px;
  letter-spacing: 0.32px;
  color: #080040;
  font-family: "AvenirLTStd-Medium";
}
.filter-block.size-block .filter-detail {
  padding: 29px 27px;
}
.filter-block.amount-block .filter-detail {
  padding: 24px 27px;
}
.filter-block.check-block .filter-detail {
  padding: 20px 27px;
}
.filter-block .filter-detail .checkbox-wrap {
  margin-bottom: 24px;
}
.filter-block .filter-detail .checkbox-wrap:last-child {
  margin-bottom: 0;
}
.checkbox-wrap >>> .v-input--checkbox {
  margin: 0;
  padding: 0;
}
.checkbox-wrap >>> .v-input--checkbox .v-input__slot {
  margin: 0;
}
.checkbox-wrap >>> .v-input--checkbox .v-messages {
  display: none;
}
.checkbox-wrap >>> .v-input--selection-controls__input {
  position: absolute;
  right: -5px;
  margin-right: 0;
  top: 2px;
}
.checkbox-wrap >>> .v-input--selection-controls__input + .v-label {
  font-size: 17px;
  line-height: 24px;
  letter-spacing: -0.41px;
  color: #080040;
  font-family: "AvenirLTStd-Roman";
  transition: all 0.3s;
}
.checkbox-wrap
  >>> .v-input--is-label-active
  .v-input--selection-controls__input
  + .v-label {
  font-family: "Avenir Heavy";
}
.checkbox-wrap >>> i.v-icon.mdi-checkbox-marked {
  background: url("/img/check-icon.svg");
  background-repeat: no-repeat;
  background-position: center;
  width: 16px;
  height: 12px;
}
.btn-block {
  display: flex;
  justify-content: space-between;
  padding: 38px 0 30px 27px;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  width: 100%;
}
.btn-block .price-text {
  font-size: 20px;
  line-height: 25px;
  letter-spacing: 0.38px;
  color: #080040;
  font-family: "Avenir Heavy";
}
.btn-block .icon-text-btn {
  font-size: 15px !important;
  letter-spacing: -0.36;
}
.btn-block .icon-text-btn .icon-wrap {
  margin: 0 -58px 0 46px;
}
.arabic-lng .btn-block {
  padding: 38px 27px 30px 0px;
}
.arabic-lng .btn-block .icon-text-btn {
  border-radius: 0 25px 25px 0;
}
.arabic-lng .btn-block .icon-text-btn .icon-wrap {
  margin: 0 0 0 0;
  position: absolute;
  left: 8px;
  transform: rotate(180deg);
}
.arabic-lng .checkbox-wrap >>> .v-input--selection-controls__input {
  left: -5px;
  right: auto;
}
.arabic-lng .checkbox-wrap >>> .v-input--selection-controls__input + .v-label {
  text-align: right;
}
.filter-block .filter-detail >>> .v-input--radio-group__input {
  flex-direction: row;
  justify-content: center;
}
.filter-block .filter-detail >>> .radio-group .v-input__slot {
  margin: 0;
}
.filter-block
  .filter-detail
  >>> .radio-group
  .v-input--selection-controls__input {
  display: none;
}
.filter-block .filter-detail >>> .radio-group .v-messages {
  display: none;
}
.filter-block .filter-detail >>> .size-btn {
  padding: 6px 19px;
  border-radius: 18px;
  margin: 0 5px !important;
}
.filter-block .filter-detail >>> .size-btn label {
  text-transform: capitalize;
  font-size: 17px;
  line-height: 23px;
  letter-spacing: 0.32px;
  font-family: "AvenirLTStd-Roman";
  color: #080040;
}
.filter-block .filter-detail >>> .size-btn.v-item--active {
  background: #080040;
}
.filter-block .filter-detail >>> .size-btn.v-item--active label {
  color: #fff;
}
</style>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Shared from '../common/shared';
import MenuItemModel from '../models/MenuItemModel';
import MenuItemOptionCategoryModel from '../models/MenuItemOptionCategoryModel';

@Component
export default class MenuItemDetail extends Vue {
  @Prop() private menuItem: MenuItemModel;
  @Prop({default: false}) private isOpenedOrderListDialog: boolean;

  private amountItem: number = 1;
  private totalPrice: number = 0;
  private selectedMenuItemOptionSize: any = null;
  private selectedAddOnList: any = [];
  private menuItemOptionSize: any = null;
  private menuItemAddOn: any = [];
  private tempPrice: number = 0;
  private menuItemImageSrc: string = "";
  private mealSizeExtraCharge: number = 0;
  private addOnExtraCharge: number = 0;


  private mounted() {
    this.totalPrice = this.menuItemDetail ? this.roundedNumber(this.menuItemDetail.price * this.menuItemDetail.itemQuantity) : 0;
    this.menuItemImageSrc = Shared.getImageSrcLink(this.menuItemDetail.id, this.menuItemDetail.hasBigPicture, false);
    
    if (this.menuItemDetail && this.menuItemDetail.optionCategories && this.menuItemDetail.optionCategories.length > 0 ) {
      this.menuItemOptionSize = this.menuItemDetail.optionCategories.find((x) => x.checkType === "Radio");
      if (this.menuItemOptionSize) {
        const index = this.menuItemOptionSize.options.findIndex((x) => x.isSelected === true);
        if (index !== -1) {
          this.selectedMenuItemOptionSize = this.menuItemOptionSize.options[index].id;
          if (this.isOpenedOrderListDialog) {
            this.tempPrice = (this.menuItemOptionSize.options[index].price * this.menuItemDetail.itemQuantity);
          }
          this.totalPrice = this.roundedNumber(this.totalPrice + (this.menuItemOptionSize.options[index].price * this.menuItemDetail.itemQuantity));
        }
      }
      this.menuItemAddOn = this.menuItemDetail.optionCategories.filter((y) => y.checkType === "CheckBox");
      if (this.menuItemAddOn && this.menuItemAddOn.length > 0) {
        this.menuItemAddOn.forEach((element) => {
          this.selectedAddOnList =  element.options.filter((x) => x.isSelected === true).map((y) => y.id);
        });
      }
    }
  }

  private get menuItemDetail() {
    return this.menuItem;
  }

  @Watch('selectedAddOnList')
  private onChangeAddOnFirstOption(newValue: any, oldValue: any) {
    if (this.menuItemAddOn.length > 0) {
      let checkboxClickedId: number = 0;
      if (newValue.length > oldValue.length) {
        checkboxClickedId = newValue.find((element) => !oldValue.includes(element));
        this.addOnExtraCharge = this.findPriceFromMenuItem(this.menuItemAddOn, checkboxClickedId);
        this.totalPrice = this.roundedNumber((this.totalPrice + (this.findPriceFromMenuItem(this.menuItemAddOn, checkboxClickedId) * this.menuItemDetail.itemQuantity)));
      } else {
        // because stop first time load the component call
        if (oldValue.length === 0) {
          return;
        }
        this.addOnExtraCharge = this.findPriceFromMenuItem(this.menuItemAddOn, checkboxClickedId);
        checkboxClickedId = oldValue.find((element) => !newValue.includes(element));
        this.totalPrice = this.roundedNumber(this.totalPrice - (this.findPriceFromMenuItem(this.menuItemAddOn, checkboxClickedId) * this.menuItemDetail.itemQuantity));
      }
    }
  }

  private closeMenuItemDetail() {
    this.$emit("closeMenuItemDialog");
  }

  private minusAmountItem() {
    this.menuItemDetail.itemQuantity -=  1;
    this.tempPrice = this.tempPrice - this.mealSizeExtraCharge;
    this.totalPrice = this.roundedNumber(
      this.totalPrice - (this.menuItemDetail.price + this.addOnExtraCharge + this.mealSizeExtraCharge),
    );
  }

  private plusAmountItem() {
    this.menuItemDetail.itemQuantity += 1;
    this.tempPrice = this.tempPrice + this.mealSizeExtraCharge;
    this.totalPrice = this.roundedNumber(
      this.totalPrice + (this.menuItemDetail.price + this.addOnExtraCharge + this.mealSizeExtraCharge),
    );
  }

  private roundedNumber(num: number) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }

  private addMenuItemListPrice(price: number) {
    if (this.tempPrice) {
      this.totalPrice = this.totalPrice - this.tempPrice;  
      this.tempPrice = price * this.menuItemDetail.itemQuantity;
    } else {
      this.totalPrice = this.totalPrice - this.tempPrice;
      this.tempPrice = price * this.menuItemDetail.itemQuantity;
    }
    this.mealSizeExtraCharge = price;
    this.totalPrice = this.roundedNumber(
      this.totalPrice + (price * this.menuItemDetail.itemQuantity),
    );
  }

  private findPriceFromMenuItem(menuItemAddOn: any, checkboxClickedId: number): number {
    let price: number = 0;
    menuItemAddOn.forEach((element) => {
        const index = element.options.findIndex((x) => x.id === checkboxClickedId);
        if (index !== -1) {
          price = element.options[index].price;
          return;
        }
    });
    return price ? price : 0;
  }

  private itemAddedInMenu() {
    
    let updateMenuItemDetail = new MenuItemModel()
    updateMenuItemDetail = this.menuItemDetail;
    updateMenuItemDetail = this.tempFunction(updateMenuItemDetail);
    // console.log(this.menuItemDetail.optionCategories[0].options[0].isSelected);
    // // update menu Details item 
    // if (this.menuItemOptionSize && this.menuItemAddOn) {
    //   const mealSizeindex = this.menuItemOptionSize.options.findIndex((x) => x.id === this.selectedMenuItemOptionSize);
    //   const previouslySelectedIndex = this.menuItemOptionSize.options.findIndex((x) => x.isSelected === true);
    //   // update model data value user clicks meal size 
    //   if (mealSizeindex !== -1 && previouslySelectedIndex !== -1) {
    //     this.menuItemOptionSize.options[previouslySelectedIndex].isSelected = false;
    //     this.menuItemOptionSize.options[mealSizeindex].isSelected = true;
    //   }
    //   console.log(this.menuItemDetail.optionCategories[0].options[0].isSelected);
    //   const tempIndex = updateMenuItemDetail.optionCategories.findIndex((x) => x.checkType === "Radio");
    //   if (tempIndex !== -1) {
    //     updateMenuItemDetail.optionCategories[tempIndex] = Object.assign(new MenuItemOptionCategoryModel(), this.menuItemOptionSize);
    //   }
    //   // update model data vlaue user clicks check in add on list
    //   this.menuItemAddOn.forEach((element, index) => {
    //     this.menuItemAddOn[index].options = element.options.map((x) => this.selectedAddOnList.includes(x.id) ? { ...x, isSelected: true } : { ...x, isSelected: false });
    //   });
    //   const menuAddOnTemp = updateMenuItemDetail.optionCategories.filter((x) => x.checkType === "CheckBox");
    //   menuAddOnTemp.forEach((element, index) => {
    //     const elementIndex = updateMenuItemDetail.optionCategories.findIndex((x) => x.id === element.id);
    //     const secondIndex = this.menuItemAddOn.findIndex((y) => y.id === element.id);
    //     updateMenuItemDetail.optionCategories[elementIndex] = this.menuItemAddOn[secondIndex];
    //   });
    // }
    this.$emit("itemAddedInMenu", updateMenuItemDetail, this.totalPrice);
  }
 
  private tempFunction(updateMenuItemDetail: MenuItemModel) {
    if (this.menuItemOptionSize && this.menuItemAddOn) {
      const mealSizeindex = this.menuItemOptionSize.options.findIndex((x) => x.id === this.selectedMenuItemOptionSize);
      const previouslySelectedIndex = this.menuItemOptionSize.options.findIndex((x) => x.isSelected === true);
      // update model data value user clicks meal size 
      if (mealSizeindex !== -1 && previouslySelectedIndex !== -1) {
        this.menuItemOptionSize.options[previouslySelectedIndex].isSelected = false;
        this.menuItemOptionSize.options[mealSizeindex].isSelected = true;
      }
      const tempIndex = updateMenuItemDetail.optionCategories.findIndex((x) => x.checkType === "Radio");
      if (tempIndex !== -1) {
        updateMenuItemDetail.optionCategories[tempIndex] = Object.assign(new MenuItemOptionCategoryModel(), this.menuItemOptionSize);
      }
      // update model data vlaue user clicks check in add on list
      this.menuItemAddOn.forEach((element, index) => {
        this.menuItemAddOn[index].options = element.options.map((x) => this.selectedAddOnList.includes(x.id) ? { ...x, isSelected: true } : { ...x, isSelected: false });
      });
      const menuAddOnTemp = updateMenuItemDetail.optionCategories.filter((x) => x.checkType === "CheckBox");
      menuAddOnTemp.forEach((element, index) => {
        const elementIndex = updateMenuItemDetail.optionCategories.findIndex((x) => x.id === element.id);
        const secondIndex = this.menuItemAddOn.findIndex((y) => y.id === element.id);
        updateMenuItemDetail.optionCategories[elementIndex] = this.menuItemAddOn[secondIndex];
      });
    }
    return updateMenuItemDetail;
  }
}
</script>
