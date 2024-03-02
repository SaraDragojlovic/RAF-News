<template>
  <div class="custom-news-card" @click="openNewsPage(news.id)">
    <div class="custom-news-header">
      <h2 class="custom-title">{{ news.title }}</h2>
      <p class="custom-creation-time">{{ formattedCreationTime }}</p>
    </div>
    <div class="custom-category" v-if="showCategory">
      <p>{{ category.name }}</p>
    </div>
    <div class="custom-summary">
      <p class="custom-summary-text">{{ displayText }}</p>
    </div>
  </div>
</template>
  
<script>
  import moment from 'moment';
  import Cookies from 'js-cookie';
  
  export default {
    props: {
      news: Object,
      showCategory: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        category: {},
      };
    },
    computed: {
      displayText() {
        return this.news.text.length > 100
          ? this.news.text.substring(0, 200) + '...'
          : this.news.text;
      },
      formattedCreationTime() {
        return moment(this.news.creation_time, 'DD-MM-YYYY HH:mm').fromNow();
      },
    },
    methods: {
      async openNewsPage(newsId) {
        if (!Cookies.get(`visitedNews_${newsId}`)) {
          Cookies.set(`visitedNews_${newsId}`, 'true', { expires: 365 });

          try {
            await this.$axios.put(`http://localhost:8080/api/news/visit/${newsId}`, null, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
          });
          } catch (error) {
            console.error('Error updating visit count:', error);
          }
        }

        this.$router.push({
          name: 'SingleNewsPage',
          params: { newsId: newsId },
        });
      },
    },
    async created() {
      const response = await this.$axios.get(`http://localhost:8080/api/categories/${this.news.category_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
  
      this.category = response.data;
    },
  };
</script>
  

<style>
.custom-news-card {
  background-color: #fff9f9; 
  border: 1px solid #910e0e; 
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.custom-news-card:hover {
  background-color: #f0f0f0; /* Change to your desired hover background color */
  transform: scale(1.02); /* Add a subtle zoom effect on hover */
}

.custom-news-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333; /* Change to your desired text color */
}

.custom-creation-time {
  font-size: 12px;
  color: #777; /* Change to your desired text color */
}

.custom-category {
  margin-top: 10px;
}

.custom-category p {
  background-color: #911c04; /* Change to your desired background color */
  color: #fff; /* Change to your desired text color */
  padding: 5px 10px;
  border-radius: 3px;
  font-weight: bold;
  font-size: 12px;
  display: inline-block;
}

.custom-summary {
  margin-top: 10px;
}

.custom-summary-text {
  font-size: 14px;
  color: #444; /* Change to your desired text color */
}
</style>
