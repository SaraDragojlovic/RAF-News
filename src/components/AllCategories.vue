<template>
  <div class="custom-all-categories-page">
    <h1>All Categories</h1>
    <div class="custom-categories-container">
      <div class="custom-category-card" v-for="category in categories" :key="category.id" @click="navigateToCategory(category.id)">
        <h2 class="custom-category-name">{{ category.name }}</h2>
        <p class="custom-category-description">{{ category.description }}</p>
      </div>
    </div>
  </div>
</template>
  
<script>
  export default {
    data() {
      return {
        categories: [],
      };
    },
    async created() {
      try {
        const response = await this.$axios.get('http://localhost:8080/api/categories', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        });
        this.categories = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    methods: {
        navigateToCategory(categoryId) {
            this.$router.push({
                name: 'NewsCategory',
                params: { categoryId },
            });
        },
    },
  };
</script>
  
   <style scoped>
   .custom-all-categories-page {
     min-height: 100vh;
     display: flex;
     flex-direction: column;
     align-items: center;
     background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('@/assets/pozadina.jpeg') no-repeat center center fixed;
     background-size: cover;
     padding: 80px 30px;
     color: #fff;
   }
   
   .custom-all-categories-page h1 {
     font-size: 36px;
     font-weight: bold;
     text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
     margin-bottom: 40px;
   }
   
   .custom-categories-container {
     display: flex; 
     flex-wrap: wrap; 
     gap: 30px;
     justify-content: center;
     max-width: 1500px;
     margin: 0 auto;
   }
   
   .custom-category-card {
     width: 332.5px;
     height: 148.6px;
     background-color: rgba(140, 124, 124, 0.9);
     border-radius: 12px;
     padding: 25px;
     box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
     transition: transform 0.3s ease, box-shadow 0.3s ease;
     cursor: pointer;
     overflow: hidden;
   }
   
   .custom-category-card:hover {
     transform: scale(1.03);
     box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.5);
   }
   
   .custom-category-name {
     font-size: 24px;
     font-weight: bold;
     margin: 10px 0 20px;
     color: #7c1e04;
   }
   
   .custom-category-description {
     font-size: 18px;
     line-height: 1.6;
     color: #ccc;
   }
   </style>