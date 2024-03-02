<template>
    <div class="custom-add-category-page">
      <div class="custom-add-category-container">
        <h1 class="custom-add-category-title">Add Category</h1>
        <form @submit.prevent="addCategory" class="custom-add-category-form">
          <div class="custom-input-field">
            <label for="name">Category Name:</label>
            <input type="text" id="name" v-model="category.name" required>
          </div>
          <div class="custom-input-field">
            <label for="description">Category Description:</label>
            <textarea id="description" v-model="category.description" required></textarea>
          </div>
          <p class="custom-error-message" v-if="errorMessage">{{ errorMessage }}</p>
          <div class="custom-submit-field">
            <input type="submit" value="Add Category" class="custom-submit-button">
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        category: {
          name: '',
          description: '',
        },
        errorMessage: '',
      };
    },
    methods: {
      async addCategory() {
        if (!this.category.name || !this.category.description) {
          this.errorMessage = 'Both fields are required';
          return;
        }
  
        try {
          const response = await this.$axios.post(
            'http://localhost:8080/api/categories',
            this.category,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
              },
            }
          );
          if (response.status === 200) {
            this.$router.push({ path: '/categories' });
          }
        } catch (error) {
          console.error(error);
        }
      },
    },
  };
  </script>
  

<style>
.custom-add-category-page {
  background-color: #f2f2f2;
  background: linear-gradient(
      rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 0.5)
    ), url('../../assets/pozadina.jpeg') no-repeat center center fixed;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.custom-add-category-container {
  background-color: #ce7d64;
  box-shadow: 0 0 10px rgba(107, 28, 28, 0.2);
  padding: 30px;
  border-radius: 10px;
  width: 400px;
}

.custom-add-category-title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  color: #440202;
}

.custom-add-category-form {
  display: flex;
  flex-direction: column;
}

.custom-input-field {
  margin-bottom: 20px;
}

.custom-input-field label {
  font-weight: bold;
  color: #750606;
}

.custom-input-field input[type="text"],
.custom-input-field textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f5f5f5;
  color: #333;
}

.custom-error-message {
  color: #ff3333;
  margin-top: 10px;
  text-align: center;
}

.custom-submit-field {
  text-align: center;
}

.custom-submit-button {
  background-color: #8b0505;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.custom-submit-button:hover {
  background-color: #c40303;
}
</style>