<template>
  <div class="edit-category-page">
    <div class="edit-category-container">
      <h1>Edit Category</h1>
      <form @submit.prevent="updateCategory" class="edit-category-form">
        <div class="input-field">
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="editedCategory.name" required />
        </div>
        <div class="input-field">
          <label for="description">Description:</label>
          <textarea id="description" v-model="editedCategory.description" required></textarea>
        </div>
        <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
        <div class="submit-field">
          <input type="submit" value="Update">
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editedCategory: {
        name: '',
        description: '',
      },
      errorMessage: '',
    };
  },
  async created() {
    const id = this.$route.params.categoryId;
    try {
      const response = await this.$axios.get(`http://localhost:8080/api/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        });
      this.editedCategory = response.data;
    } catch (error) {
      console.error('Error fetching category data', error);
    }
  },
  methods: {
    async updateCategory() {
      if (!this.editedCategory.name || !this.editedCategory.description) {
        this.errorMessage = 'Both fields are required';
        return;
      }
      
      try {
        const response = await this.$axios.put(`http://localhost:8080/api/categories/${this.editedCategory.id}`, this.editedCategory, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        });
        if (response.status === 200) {
          this.$router.push('/categories');
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.edit-category-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('../../assets/pozadina.jpeg') no-repeat center center fixed;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.edit-category-container {
  width: 400px;
  padding: 2em;
  background-color: rgba(31, 31, 31, 0.8);
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}
.edit-category-container h1 {
  margin-bottom: 32px;
  text-align: center;
  color: #ffc107;
}

.edit-category-container .input-field {
  margin-bottom: 1em;
}

.edit-category-container label {
  display: block;
  margin-bottom: 0.5em;
  color: #ddd;
}

.edit-category-container input[type="text"],
.edit-category-container textarea {
  width: 100%;
  padding: 0.5em;
  border: 1px solid #ddd;
  background-color: #333;
  color: #ddd;
  border-radius: 4px;
  outline: none;
}

.edit-category-container .submit-field {
  text-align: center;
  margin-top: 2em;
}

.edit-category-container input[type="submit"] {
  background-color: #ffc107;
  color: #000;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  text-transform: uppercase;
  transition: background-color 0.2s ease;
}

.edit-category-container input[type="submit"]:hover {
  background-color: #c6ff28;
}

.error-message {
  color: #ffffff;
  background-color: rgba(31, 31, 31, 0.8);
  border: 1px solid #b22222;
  padding: 10px;
  border-radius: 10px;
  margin: 20px 0;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}
</style>
