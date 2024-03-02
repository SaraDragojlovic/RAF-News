<template>
  <div class="categories-page">
    <h1>Categories</h1>
    <button class="add-button" @click="goToAddCategoryForm">
      <span class="add-icon">+</span>
    </button>
    <div class="categories-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td><a @click="goToNewsWithCategory(category.id)">{{ category.name }}</a></td>
            <td>{{ category.description }}</td>
            <td>
              <button class="edit-button" @click="editCategory(category)">Edit</button>
              <button class="delete-button" @click="deleteCategory(category)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination-buttons">
      <button class="pagination-button" @click="fetchPreviousPage" :disabled="!hasPreviousPage">&lt;&lt;</button>
      <button class="pagination-button" @click="fetchNextPage" :disabled="!hasNextPage">&gt;&gt;</button>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      categories: [],
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  },
  methods: {
    async fetchCategories(page) {
      try {
        const response = await this.$axios.get(`http://localhost:8080/api/categories/page/${page}`, {
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

        this.categories = response.data.slice(0, 10);
        this.hasPreviousPage = this.currentPage > 1;

      } catch (error) {
        console.error(error);
      }
    },
    fetchNextPage() {
      if (this.hasNextPage) {
        this.currentPage++;
        this.fetchCategories(this.currentPage);
      }
    },
    fetchPreviousPage() {
      if (this.hasPreviousPage) {
        this.currentPage--;
        this.fetchCategories(this.currentPage);
      }
    },
    goToAddCategoryForm() {
      this.$router.push('/categories/add');
    },
    editCategory(category) {
      this.$router.push({ name: 'EditCategory', params: { categoryId: category.id } });
    },
    async deleteCategory(category) {
      try {
        const response = await this.$axios.delete(`http://localhost:8080/api/categories/${category.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        });
        if (response.status === 204) {
          const index = this.categories.findIndex(c => c.id === category.id);
          if (index !== -1) {
            this.categories.splice(index, 1);
            if (this.categories.length === 0) {
              if (this.hasPreviousPage) {
                this.fetchPreviousPage();
              } else {
                this.fetchCategories(this.currentPage);
              }
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    goToNewsWithCategory(categoryId) {
      this.$router.push({ name: 'NewsPage', params: { categoryId } });
    },
  },
  created() {
    this.fetchCategories(this.currentPage);
  },
};
</script>



<style scoped>
.categories-page {
  padding: 20px;
  color: #f6f5f5;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #444;
}

table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc;
}

th,
td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ccc;
}

.edit-button,
.delete-button,
.add-button,
.pagination-button {
  background-color: #178988;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-button:hover,
.add-button:hover,
.pagination-button:hover:not(:disabled) {
  background-color: #ff2205;
}

.delete-button {
  margin-left: 8px;
  background-color: #DC3545;
}

.delete-button:hover {
  background-color: #8f2031;
}

.pagination-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-button {
  margin: 0 10px;
  background-color: #a03504;
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

a:hover {
  cursor: pointer;
}

.add-button {
  background-color: #cc3807;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 20px;
  width: 40px;
  height: 40px;
  text-align: center;
}


.add-button:hover {
  background-color: #9d2a08;
}

.categories-table {
  max-width: 100%;
  overflow-x: auto;
}

.categories-table table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc;
}

.categories-table th,
.categories-table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ccc;
}

.categories-table tr:last-child td {
  border-bottom: none;
}
</style>