<template>
    <div class="news-category-page">
      <h1>Category News</h1>
      <div class="news-container">
        <NewsCard v-for="news in categoryNews" :key="news.id" :news="news" :showCategory="false" />
      </div>
      <div class="pagination-buttons">
        <button class="pagination-button" @click="fetchPreviousPage" :disabled="!hasPreviousPage">&lt;&lt;</button>
        <button class="pagination-button" @click="fetchNextPage" :disabled="!hasNextPage">&gt;&gt;</button>
      </div>
    </div>
  </template>
  
  <script>
  import NewsCard from './NewsCard.vue';
  
  export default {
    components: {
      NewsCard,
    },
    data() {
      return {
        categoryNews: [],
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    },
    methods: {
      async fetchNews(page) {
        const categoryId = this.$route.params.categoryId;
        const response = await this.$axios.get(`http://localhost:8080/api/news/category/${categoryId}/${page}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        });
  
        if (response.data.length > 10) {
          this.hasNextPage = true;
          response.data.pop();
        } else {
          this.hasNextPage = false;
        }
  
        this.categoryNews = response.data.slice(0, 10);
        this.hasPreviousPage = this.currentPage > 1;
      },
      fetchNextPage() {
        if (this.hasNextPage) {
          this.currentPage++;
          this.fetchNews(this.currentPage);
        }
      },
      fetchPreviousPage() {
        if (this.hasPreviousPage) {
          this.currentPage--;
          this.fetchNews(this.currentPage);
        }
      },
    },
    async created() {
      this.fetchNews(this.currentPage);
    },
  };
</script>

<style scoped>
.news-category-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('@/assets/pozadina.jpeg') no-repeat center center fixed;
  background-size: cover;
  padding: 80px 30px;
  color: #fff;
}

.news-category-page h1 {
  font-size: 36px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 40px;
}

.news-category-page .news-container {
  display: grid;
  grid-template-columns:1;
  gap: 30px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.news-card {
  /* background-color: rgba(31, 31, 31, 0.9); */
  background-color: rgba(225, 18, 18, 0);
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0px 5px 15px rgba(140, 11, 11, 0.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  overflow: hidden;
}

.news-card:hover {
  transform: scale(1.03);
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.5);
}

.news-card h2 {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0 20px;
  color: #fff;
}

.news-card p {
  font-size: 18px;
  line-height: 1.6;
  color: #ccc;
}

.pagination-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-button {
  margin: 0 10px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}
</style>
