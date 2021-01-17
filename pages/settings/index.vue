<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit="updateSettings">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  v-model="user.image"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  v-model="user.username"
                  placeholder="Your Name"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  v-model="user.bio"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  v-model="user.email"
                  placeholder="Email"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  v-model="user.password"
                  required
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger" @click="logout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { getUser, updateUser } from "@/api/user";
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  name: "Settings",
  middleware: "authenticated",
  async asyncData() {
    const { data } = await getUser();
    return { user: data.user };
  },
  methods: {
    ...mapMutations(["setUser"]),

    async updateSettings(e) {
      e.preventDefault();
      try {
        const { data } = await updateUser({ user: this.user });
        Cookie.setUser("user", data.user);
        this.setUser(data.user);
      } catch (e) {
        console.log(e);
      }
    },
    logout() {
      this.setUser(null);
      Cookie.remove("user");
      this.$router.push({ name: "login" });
    },
  },
};
</script>