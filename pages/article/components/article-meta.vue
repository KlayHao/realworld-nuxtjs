<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'profile',
        params: {
          username: article.author.username,
        },
      }"
      ><img :src="article.author.image"
    /></nuxt-link>
    <div class="info">
      <nuxt-link
        :to="{
          name: 'profile',
          params: {
            username: article.author.username,
          },
        }"
        class="author"
        >{{ article.author.username }}</nuxt-link
      >
      <span class="date">{{ article.createdAt | date("MMM dd, yyyy") }}</span>
    </div>
    <template v-if="user.username !== article.author.username">
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{
          active: article.author.following,
        }"
        :disabled="followDisabled"
        @click="flowAuthor"
      >
        <i class="ion-plus-round"></i>
        &nbsp; {{ article.author.following ? "Unfollow" : "Follow" }}
        {{ article.author.username }}
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{
          active: article.favorited,
        }"
        @click="favoriteArticle"
      >
        <i class="ion-heart"></i>
        &nbsp;
        {{ article.favorited ? "Unfavorite" : "Favorite" }} Article
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
    <template v-else>
      <nuxt-link
        :to="{
          name: 'editor',
          params: { slug: article.slug },
        }"
        class="btn btn-outline-secondary btn-sm"
      >
        <i class="ion-edit"></i>
        &nbsp; Edit Article
      </nuxt-link>
      <button
        class="btn btn-sm btn-outline-danger"
        :disabled="delDisabled"
        @click="deleteArticle"
      >
        <i class="ion-trash-a"></i>
        &nbsp; Delete Article
      </button>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { deleteArticle, addFavorite, deleteFavorite } from "@/api/article";
import { followUser, unFollowUser } from "@/api/profile";
export default {
  name: "ArticleMeta",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      delDisabled: false,
      followDisabled: false,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async deleteArticle() {
      this.delDisabled = true;
      try {
        await deleteArticle(this.article.slug);
        this.$router.push("/");
      } catch (e) {
        this.delDisabled = false;
      }
    },

    async flowAuthor() {
      try {
        this.followDisabled = true;
        if (this.article.author.following) {
          const { data } = await unFollowUser(this.article.author.username);
          this.article.author.following = false;
        } else {
          const { data } = await followUser(this.article.author.username);
          this.article.author.following = true;
        }
        this.followDisabled = false;
      } catch (e) {
        this.followDisabled = true;
      }
    },

    async favoriteArticle() {
      if (this.article.favorited) {
        await deleteFavorite(this.article.slug);
        this.article.favorited = false;
        this.article.favoritesCount -= 1;
      } else {
        await addFavorite(this.article.slug);
        this.article.favorited = true;
        this.article.favoritesCount += 1;
      }
    },
  },
};
</script>