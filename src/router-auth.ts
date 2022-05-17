export default class RouterAuth {

    // used by routing, if the route requires authentication
    public static BeforeEach(to: any, from: any, next: any) {
        if (to.matched.some((record: any) => record.meta.requiresAuth)) {
            // TODO: redirect to login
        } else {
            next();
        }
    }
}
