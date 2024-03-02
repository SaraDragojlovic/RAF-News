<template>
    <div class="users-page">
      <h1>Users</h1>
      <button class="add-button" @click="goToAddUserForm">
        <span class="add-icon">+</span>
      </button>
      <table class="glass-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>User Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.first_name }}</td>
            <td>{{ user.last_name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.user_type }}</td>
            <td>
              <button class="edit-button" @click="editUser(user)">Edit</button>
              <button class="delete-button" :disabled="user.user_type === 'ADMIN'" @click="toggleUserStatus(user)">
                {{ user.status === 'ACTIVE' ? 'Deactivate' : 'Activate' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
            users: [],
            currentPage: 1,
            hasNextPage: false,
            hasPreviousPage: false,
        };
    },
    methods: {
        async fetchUsers(page) {
            try {
                const response = await this.$axios.get(`http://localhost:8080/api/users/page/${page}`, {
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

                this.users = response.data.slice(0, 10);
                this.hasPreviousPage = this.currentPage > 1;
            } catch (error) {
                console.error(error);
            }
        },
        fetchNextPage() {
            if (this.hasNextPage) {
                this.currentPage++;
                this.fetchUsers(this.currentPage);
            }
        },
        fetchPreviousPage() {
            if (this.hasPreviousPage) {
                this.currentPage--;
                this.fetchUsers(this.currentPage);
            }
        },
        editUser(user) {
            this.$router.push({ name: 'EditUser', params: { userId: user.id } });
        },
        goToAddUserForm() {
            this.$router.push('/users/add');
        },
        // async toggleUserStatus(user) {
        //     try {
        //         if (user.user_type === 'ADMIN') {
        //             return;
        //         }

        //         const newStatus = user.status === 'ACTIVE' ? 'inactive' : 'active';
        //         const response = await this.$axios.put(
        //             `http://localhost:8080/api/users/${user.id}/${newStatus}`, {}, {
        //                 headers: {
        //                     Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        //                 },
        //             }
        //         );

        //         if (response.status === 204) {
        //             user.status = newStatus.toUpperCase();
        //         }
        //     } catch (error) {
        //         console.error(error);
        //     }
        // },
    },
    created() {
        this.fetchUsers(this.currentPage);
    },
};
</script>
  
<style scoped>
.users-page {
    padding-top: 80px;
    padding-left: 30px;
    padding-right: 30px;
    color: #fff;
}

h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
}

table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background-color: rgba(31, 31, 31, 0.8);
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    overflow: hidden;
}

thead {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-top-left-radius: 8px; 
  border-top-right-radius: 8px; 
}

th,
td {
    padding: 10px;
    text-align: left;
}

.glass-table {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.edit-button,
.delete-button,
.add-button,
.pagination-button {
  background-color: #d82506;
  color: #000;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-button:hover,
.add-button:hover,
.pagination-button:hover:not(:disabled) {
  background-color: #c6ff28;
}

.delete-button {
  margin-left: 8px;
  background-color: #dc3545;
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
  background-color: #ffc107;
  color: #000;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-button {
  background-color: #ffc107;
  color: #000;
  border: none;
  padding: 8px 16px 10px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 10px;
  font-size: 20px;
  width: 50px;
  height: 50px;
  text-align: center;
}

.add-button:hover {
  background-color: #c6ff28;
}

.pagination-button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}

a:hover {
    cursor: pointer;
}

.delete-button {
    margin-left: 8px;
    background-color: #dc3545;
}

.delete-button:hover {
    background-color: #8f2031;
}

.delete-button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}
</style>
  
<!-- <style scoped>
.news-page {
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
</style> -->