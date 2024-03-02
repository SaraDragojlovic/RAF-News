<template>
    <div class="custom-single-news-page">
      <div class="custom-container">
        <div class="custom-news-card">
          <h2 class="custom-title custom-centered" >{{ news.title }}</h2>
          <div class="custom-metadata">
            <p class="custom-author">By {{ author }}</p>
            <p class="custom-creation-time">{{ this.news.creation_time }}</p>
          </div>
          <div class="custom-tags-list">
            <router-link class="custom-tag-link" v-for="(tag, index) in tags" :to="'/tag/' + tag.id" :key="index">
              <span class="custom-tag">{{ tag.name }}</span>
            </router-link>
          </div>
          <p class="custom-content">{{ news.text }}</p>
          <router-link :to="'/category/' + category.id" class="custom-category-link">
            <p class="custom-category">Category: {{ category.name }}</p>
          </router-link>
          <div class="custom-comments-section">
            <h3 class="custom-comments-title">User Comments</h3>
            <form @submit.prevent="addComment" class="custom-comment-form">
              <div class="custom-form-group">
                <label for="author_name">Name</label>
                <input type="text" id="author_name" v-model="newComment.author_name" required />
              </div>
              <div class="custom-form-group">
                <label for="comment_text">Comment</label>
                <textarea id="comment_text" v-model="newComment.text" required></textarea>
              </div>
              <div class="custom-form-group" style="text-align: center;">
                <button type="submit" class="custom-btn custom-btn-primary">Add Comment</button>
              </div>
            </form>
            <div class="custom-comment" v-for="(comment, index) in comments" :key="index">
              <p class="custom-comment-author">{{ comment.author_name }}</p>
              <p class="custom-comment-creation-date">{{ comment.creation_date }}</p>
              <p class="custom-comment-text">{{ comment.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<script>
import Cookies from 'js-cookie';

export default {
    data() {
        return {
            news: {},
            category: {},
            author: '',
            tags: [],
            comments: [],
            newComment: {
                author_name: '',
                text: ''
            },
        };
    },
    async created() {
        const newsId = this.$route.params.newsId;
        Cookies.set(`visitedNews_${newsId}`, 'true', { expires: 365 });
        const response = await this.$axios.get(`http://localhost:8080/api/news/${newsId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
        });
        this.news = response.data;
        this.fetchCategory();
        this.fetchAuthor();
        this.fetchTags();
        this.fetchComments();
    },
    methods: {
        async fetchCategory() {
            const categoryId = this.news.category_id;
            const response = await this.$axios.get(`http://localhost:8080/api/categories/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            });

            this.category = response.data;
        },
        async fetchAuthor() {
            const authorId = this.news.author_id;
            const response = await this.$axios.get(`http://localhost:8080/api/users/${authorId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            });

            this.author = `${response.data.first_name} ${response.data.last_name}`;
        },
        async fetchTags() {
            const id = this.$route.params.newsId;
            try {
                const response = await this.$axios.get(`http://localhost:8080/api/news_tags/news/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                });
                
                const tagIds = response.data.map(tag => tag.tag_id);
 

                this.tags = await Promise.all(tagIds.map(async tagId => {
                    const tagResponse = await this.$axios.get(`http://localhost:8080/api/tags/${tagId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                        },
                    });
                    return tagResponse.data;
                }));
            } catch (error) {
                console.error('Error fetching tags data', error);
            }
        },
        async fetchComments() {
            const newsId = this.$route.params.newsId;
            const response = await this.$axios.get(`http://localhost:8080/api/comments/news/${newsId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            });
            this.comments = response.data;
        },
        async addComment() {
            const newsId = this.$route.params.newsId;
            const data = {
                author_name: this.newComment.author_name,
                text: this.newComment.text,
                news_id: newsId
            };
            try {
                const response = await this.$axios.post('http://localhost:8080/api/comments', data, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                });
                const createdComment = response.data;
                this.comments.unshift(createdComment);
                this.newComment.author_name = '';
                this.newComment.text = '';

                //?
                // const commentResponse = await this.$axios.get(`http://localhost:8080/api/comments/${createdComment.id}`, {
                //     headers: {
                //         Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                //     },
                // });
                // const updatedComment = commentResponse.data;

                // const commentIndex = this.comments.findIndex(comment => comment.id === updatedComment.id);
                // if (commentIndex !== -1) {
                //     this.comments[commentIndex].creation_date = updatedComment.creation_date;
                // }
            } catch (error) {
                console.error('Error adding comment', error);
            }
        },
    },
};
</script>

<style scoped>
.custom-single-news-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(rgba(22, 22, 22, 0.9), rgba(22, 22, 22, 0.9)),
              url('@/assets/pozadina.jpeg') no-repeat center center fixed;
  background-size: cover;
  padding: 60px 20px;
  color: #fff;
}

.custom-container {
  width: 100%;
  max-width: 1100px;
  margin: auto;
  padding: 10px;
}

.custom-news-card {
  background-color: rgba(22, 22, 22, 0.9);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.custom-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #f8f6f1;
}

.custom-metadata {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #aaa;
  margin-bottom: 15px;
}

.custom-author,
.custom-creation-time {
  font-size: 14px;
}

.custom-tags-list {
  margin-top: 15px;
}

.custom-tag-link {
  text-decoration: none;
  margin-right: 10px;
}

.custom-tag {
  display: inline-block;
  background: #982005;
  color: #222;
  border-radius: 8px;
  padding: 3px 8px;
  font-size: 12px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.custom-tag:hover {
  background: #c6ff28;
  color: #111;
}

.custom-content {
  font-size: 18px;
  line-height: 1.6;
  margin-top: 20px;
  color: #ddd;
}

.custom-centered {
  text-align: center;
}

.custom-category-link {
  display: inline-block;
  margin-top: 20px;
  text-decoration: none;
  color: #7d0d0d;
}

.custom-category-link:hover {
  color: #c6ff28;
}

.custom-comments-section {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #444;
}

.custom-comments-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #980b0b;
  text-align: center;
}

.custom-comment-form {
  margin-bottom: 30px;
}

.custom-form-group {
  margin-bottom: 20px;
}

.custom-comment-form label {
  font-size: 14px;
  font-weight: bold;
  color: #aaa;
  margin-bottom: 8px;
  display: block;
}

.custom-comment-form input[type="text"],
.custom-comment-form textarea {
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #555;
  background-color: rgba(0, 0, 0, 0.1);
  color: #ddd;
}

.custom-comment-form textarea {
  height: 100px;
}

.custom-comment-form input[type="text"]:focus,
.custom-comment-form textarea:focus {
  outline: none;
  border-color: #ffc107;
}

.custom-btn {
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.custom-btn-primary {
  background-color: #c10707;
  color: #222;
  border: none;
}

.custom-btn-primary:hover {
  background-color: #f4f4f4;
  color: #111;
}

.custom-comment {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 25px;
  transition: background-color 0.3s ease;
}

.custom-comment:hover {
  background-color: rgba(0, 0, 0, 0.4);
}

.custom-comment-author {
  font-size: 16px;
  font-weight: bold;
  color: #ffc107;
  margin-bottom: 5px;
}

.custom-comment-creation-date {
  font-size: 12px;
  color: #aaa;
  margin-bottom: 10px;
}

.custom-comment-text {
  font-size: 16px;
  line-height: 1.5;
  color: #ddd;
}
</style>