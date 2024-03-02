<template>
    <div class="home-page">
        <h1>Latest News</h1>
        <div class="news-container">
          <NewsCard v-for="news in latestNews" :key="news.id" :news="news" />
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
          latestNews: [],
      };
  },
  async created() {
      const response = await this.$axios.get('http://localhost:8080/api/news/page/1', {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
      });

      if (response.data.length > 10) {
          response.data.pop();
      }

      this.latestNews = response.data;
  },
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('@/assets/home.jpeg') no-repeat center center fixed;
  background-size: cover;
  padding: 80px 30px;
  color: #fff;
}

.home-page h1 {
    font-size: 36px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    margin-bottom: 40px;
}

.home-page .news-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 30px;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
}

.news-card {
    background-color: rgba(31, 31, 31, 0.9);
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
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

</style>
