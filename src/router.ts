import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import RestaurantMenu from "@/views/RestaurantMenu.vue";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/menus/:name",
    name: "RestaurantMenu",
    component: RestaurantMenu,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to: any, from: any, next: any) => {
  // prevent to load welcomeIntroduction screen, when user click on browser back button
  // if (to.name !== 'WelcomeIntroduction' || from.name === null) {
  next();
  // } else {
  //   next(false);
  // }
});

export default router;
