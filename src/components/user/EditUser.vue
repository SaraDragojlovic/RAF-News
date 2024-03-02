<template>
    <div class="edit-user-page">
      <div class="edit-user-container">
        <h1>Edit User</h1>
        <form @submit.prevent="editUser" class="edit-user-form">
          <div class="input-field">
            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" v-model="user.first_name" required>
          </div>
          <div class="input-field">
            <label for="lastName">Last Name:</label>
            <input type="text" id="lastName" v-model="user.last_name" required>
          </div>
          <div class="input-field">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="user.email" required>
          </div>
          <div class="input-field">
            <label for="userType">User Type:</label>
            <select id="userType" v-model="user.user_type" required class="styled-dropdown">
              <option value="ADMIN">Admin</option>
              <option value="CONTENT_CREATOR">Content Creator</option>
            </select>
          </div>
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
        user: {
          id: '',
          first_name: '',
          last_name: '',
          email: '',
          user_type: '',
        },
      };
    },
    methods: {
      async fetchUser() {
        try {
          const response = await this.$axios.get(`http://localhost:8080/api/users/${this.$route.params.userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
          });
          this.user = response.data;
        } catch (error) {
          console.error(error);
        }
      },
      async editUser() {
        try {
            const { email, first_name, last_name, user_type } = this.user;
            const updatedUser = {
                email,
                first_name,
                last_name,
                user_type,
            };

          const response = await this.$axios.put(
            `http://localhost:8080/api/users/${this.user.id}`,
            updatedUser,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
              },
            }
          );
  
          if (response.status === 200) {
            this.$router.push('/users');
          }
        } catch (error) {
          console.error(error);
        }
      },
    },
    created() {
      this.fetchUser();
    },
  };
</script>
  
<style scoped>
.edit-user-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../../assets/users.jpeg') no-repeat center center fixed;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.edit-user-container {
  width: 400px;
  padding: 2em;
  background-color: rgba(31, 31, 31, 0.8);
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}

h1 {
  margin-bottom: 32px;
  text-align: center;
  color: #ff0707;
}

.edit-user-form .input-field {
  margin-bottom: 1em;
}

.edit-user-form label {
  display: block;
  margin-bottom: 0.5em;
  color: #ddd;
}

.edit-user-form input[type="text"],
.edit-user-form input[type="email"],
.edit-user-form select {
  width: 100%;
  padding: 0.5em;
  border: 1px solid #ddd;
  background-color: #333;
  color: #ddd;
  border-radius: 4px;
  outline: none;
  box-sizing: border-box;
}

.styled-dropdown {
  width: 100%;
  padding: 0.5em;
  border: 1px solid #ddd;
  background-color: #333;
  color: #ddd;
  border-radius: 4px;
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, #ddd 50%), linear-gradient(135deg, #ddd 50%, transparent 50%), linear-gradient(to right, #333, #333);
  background-position: calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px), 100% 0;
  background-size: 5px 5px, 5px 5px, 2.5em 3.5em;
  background-repeat: no-repeat;
  box-sizing: border-box;
  text-transform: uppercase;
}

.submit-field {
  text-align: center;
  margin-top: 2em;
}

.submit-field input[type="submit"] {
  background-color: #ffc107;
  color: #000;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  text-transform: uppercase;
  transition: background-color 0.2s ease;
}

.submit-field input[type="submit"]:hover {
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
  
  