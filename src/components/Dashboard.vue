<template>
  <Loading v-if="isLoadingApp"> </Loading>
  <!-- <div v-if="isLoadingApp" class="fill-height">
    <Loading> </Loading>
  </div> -->
</template>

<style scoped></style>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Loading from "@/components/Loading.vue";
import MenuItemsController from "../api/menuItemsController";
import MenuController from "../api/menusController";
import eventBus from "../common/bus";
import storeGetters from "../store/storeGetters";
import storeMutations from "../store/storeMutations";

@Component({
  components: { Loading },
})
export default class Dashboard extends Vue {
  @Prop() private isLoadingApp: boolean;

  private created() {
    // when page load screen loader is display
    try {
      // verify store has values
      const menusENList = storeGetters.getMenusEN();
      const menusARList = storeGetters.getMenusAR();
      // if no value exists in store, get from api call
      if (menusENList && menusARList) {
        this.$emit("update:isLoadingApp", true);
        const queryParameters =
          this.$route && this.$route.params && this.$route.params.name ? this.$route.params.name + "/" : "";
        if (queryParameters) {
          this.getMenus(queryParameters, "en");
        } else {
          // TODO: show error
          // required to verify first
          eventBus.$emit("showMessage", "Restaurant menu URL is incorrect");
        }
      }
    } catch (e) {
      this.$emit("update:isLoadingApp", false);
    }
  }

  private async getMenus(queryParameters: string, lang: string) {
    const self = this;
    MenuController.getMenus(queryParameters, lang)
      .then((res: any) => {
        if (res && res.status === 200) {
          if (lang === 'en') {
            storeMutations.setMenusEN(JSON.parse(res.data));
            this.getMenus(queryParameters, "ar");
          } else {
            storeMutations.setMenusAR(JSON.parse(res.data));
          }
          this.$emit("update:isLoadingApp", false);
        } else if (res.status === 404) {
          // response is 404, meaning that restaurant menu is not found, then the following message should be displayed to user "Restaurant menu URL is incorrect"
          eventBus.$emit("showMessage", "Restaurant menu URL is incorrect");
        } else  {
          // if api timeout, an error message should be displayed to user saying "Sorry, couldn't download the menu. please try again later
          eventBus.$emit("showMessage", "Sorry, couldn't download the menu. please try again later");
        }
      })
      .catch((err: any) => {
        // handle error in api response
      });
  }
}
</script>
