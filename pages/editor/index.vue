<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent="postArticle">
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="article.title"
                  :disabled="publishDisabled"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  v-model="article.description"
                  :disabled="publishDisabled"
                  placeholder="What's this article about?"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  v-model="article.body"
                  :disabled="publishDisabled"
                  placeholder="Write your article (in markdown)"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="tag"
                  @keydown.enter="addTag"
                  :disabled="publishDisabled"
                />
                <div class="tag-list">
                  <span
                    v-for="tag in article.tagList"
                    :key="tag"
                    class="tag-pill tag-default"
                  >
                    <i class="ion-close-round" @click="deleteTag(tag)" />
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
              <input type="hidden" />
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                :disabled="publishDisabled"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getArticle, publishArticle, updateArticle } from "@/api/article";
export default {
  name: "Editor",
  // 在路由匹配之前，会先执行中间件的处理
  middleware: "authenticated",
  async asyncData({ params }) {
    if (params.slug) {
      const { data } = await getArticle(params.slug);
      const { article } = data;
      return {
        article,
      };
    } else {
      return {
        article: {
          title: "",
          description: "",
          body: "",
          tagList: [],
        },
        slug: params.slug,
      };
    }
  },
  data() {
    return {
      tag: "",
      publishDisabled: false,
    };
  },
  methods: {
    addTag(e) {
      e.preventDefault();
      if (this.tag && this.article.tagList.indexOf(this.tag) < 0) {
        console.log("adding", this.tag);
        this.article.tagList.push(this.tag);
        this.tag = "";
      }
      return false;
    },
    deleteTag(tag) {
      let index = this.article.tagList.indexOf(tag);
      this.article.tagList.splice(index, 1);
    },

    async postArticle() {
      console.log("posting", this.article);
      this.publishDisabled = true;
      try {
        const {
          data: { article },
        } = this.slug
          ? await updateArticle(this.slug, { article: this.article })
          : await publishArticle({ article: this.article });
        console.log(article);
        this.$router.push({
          name: "article",
          params: {
            slug: article.slug,
          },
        });
      } catch (e) {
        this.publishDisabled = false;
      }
    },
  },
};
</script>