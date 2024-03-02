<template>
    <div class="news-tag-page">
        <h1>News tagged as "{{ currentTagName }}"</h1>
        <div class="news-container">
          <NewsCard v-for="news in tagNews" :key="news.id" :news="news" />
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
            tagNews: [],
            currentTagName: '',
        };
    },
    async created() {
        const tagId = this.$route.params.tagId;
        let response = await this.$axios.get(`http://localhost:8080/api/news_tags/tag/${tagId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
        });
  
        const newsIds = response.data.map(news_tag => news_tag.news_id);
  
        this.tagNews = await Promise.all(newsIds.map(async newsId => {
            const newsResponse = await this.$axios.get(`http://localhost:8080/api/news/${newsId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            });
            return newsResponse.data;
        }));
  
        response = await this.$axios.get(`http://localhost:8080/api/tags/${tagId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
        });
  
        this.currentTagName = response.data.name;
    },
  };
</script>
  
  <style scoped>
  .news-tag-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('@/assets/pozadina.jpeg') no-repeat center center fixed;
    background-size: cover;
    padding: 80px 30px;
    color: #fff;
  }
  
  .news-tag-page h1 {
    font-size: 36px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    margin-bottom: 40px;
  }
  
  .news-tag-page .news-container {
    display: grid;
    grid-template-columns: 1;
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
  