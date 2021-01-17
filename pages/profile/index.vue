<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <button
              v-if="user.username !== profile.username"
              class="btn btn-sm btn-outline-secondary action-btn"
            >
              <i class="ion-plus-round"></i>
              &nbsp; {{ profile.following ? "Unfollow" : "Follow" }}
              {{ profile.username }}
            </button>
            <nuxt-link
              v-else
              :to="{
                name: 'settings',
              }"
              class="btn btn-sm btn-outline-secondary action-btn"
            >
              <i class="ion-gear-a"></i>
              Edit Profile Settings
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{ active: !favorited }"
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username,
                    },
                  }"
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: favorited }"
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username,
                      favorites: 'favorites',
                    },
                  }"
                  >Favorited Articles</nuxt-link
                >
              </li>
            </ul>
          </div>

          <div
            v-for="article in articles"
            :key="article.slug"
            class="article-preview"
          >
            <div class="article-meta">
              <a href=""><img :src="article.author.image" /></a>
              <div class="info">
                <a href="" class="author">{{ article.author.username }}</a>
                <span class="date">{{
                  article.createdAt | date("MMM dd, YYYY")
                }}</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right">
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <a href="" class="preview-link">
              <h1>{{ article.title }}</h1>
              <p>{{ article.body }}</p>
              <span>Read more...</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getArticles } from "@/api/article";
import { getProfile } from "@/api/profile";
export default {
  name: "UserProfile",
  middleware: "authenticated",
  async asyncData({ params }) {
    const [
      {
        data: { profile },
      },
      {
        data: { articles },
      },
    ] = await Promise.all([
      getProfile(params.username),
      getArticles(
        !!params.favorites
          ? {
              favorited: params.username,
            }
          : {
              author: params.username,
            }
      ),
    ]);
    console.log(params);
    return { favorited: !!params.favorites, profile, articles };
  },
  computed: {
    ...mapState(["user"]),
  },
};
</script>