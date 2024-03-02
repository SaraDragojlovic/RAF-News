<!-- <template>
    <div class="add-user-page">
      <div class="add-user-container">
        <h1>Add User</h1>
        <form @submit.prevent="addUser" class="add-user-form">
          <div class="input-field">
            <label for="first_name">First Name:</label>
            <input type="text" id="first_name" v-model="user.first_name" required>
          </div>
          <div class="input-field">
            <label for="last_name">Last Name:</label>
            <input type="text" id="last_name" v-model="user.last_name" required>
          </div>
          <div class="input-field">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="user.email" required>
          </div>
          <div class="input-field">
            <label for="user_type">User Type:</label>
            <select id="user_type" v-model="user.user_type" required class="styled-dropdown">
              <option value="">Select User Type...</option>
              <option value="ADMIN">ADMIN</option>
              <option value="CONTENT_CREATOR">CONTENT CREATOR</option>
            </select>
          </div>
          <div class="input-field">
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="user.password" required>
          </div>
          <div class="input-field">
            <label for="confirm_password">Confirm Password:</label>
            <input type="password" id="confirm_password" v-model="confirmPassword" required>
          </div>
          <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
          <div class="submit-field">
            <input type="submit" value="Add">
          </div>
        </form>
      </div>
    </div>
</template> -->

<template>
    <div class="custom-add-user-page">
      <div class="custom-add-user-container">
        <h1 class="custom-add-user-title">Add User</h1>
        <form @submit.prevent="addUser" class="custom-add-user-form">
          <div class="custom-input-field">
            <label for="first_name">First Name:</label>
            <input type="text" id="first_name" v-model="user.first_name" required>
          </div>
          <div class="custom-input-field">
            <label for="last_name">Last Name:</label>
            <input type="text" id="last_name" v-model="user.last_name" required>
          </div>
          <div class="custom-input-field">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="user.email" required>
          </div>
          <div class="custom-input-field">
            <label for="user_type">User Type:</label>
            <select id="user_type" v-model="user.user_type" required class="custom-styled-dropdown">
              <option value="">Select User Type...</option>
              <option value="ADMIN">ADMIN</option>
              <option value="CONTENT_CREATOR">CONTENT CREATOR</option>
            </select>
          </div>
          <div class="custom-input-field">
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="user.password" required>
          </div>
          <div class="custom-input-field">
            <label for="confirm_password">Confirm Password:</label>
            <input type="password" id="confirm_password" v-model="confirmPassword" required>
          </div>
          <p class="custom-error-message" v-if="errorMessage">{{ errorMessage }}</p>
          <div class="custom-submit-field">
            <input type="submit" value="Add" class="custom-submit-button">
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
                first_name: '',
                last_name: '',
                email: '',
                user_type: '',
                password: '',
            },
            confirmPassword: '',
            errorMessage: '',
        };
    },
    methods: {
        async addUser() {
            if (!this.user.first_name || !this.user.last_name || !this.user.email || !this.user.user_type || !this.user.password) {
                this.errorMessage = 'All fields are required';
                return;
            }

            if (this.user.password !== this.confirmPassword) {
                this.errorMessage = 'Password does not match';
                return;
            }

            try {
                this.user.status = 'ACTIVE'

                const payload = { 
                    ...this.user, 
                    password_hash: this.user.password, 
                };
                delete payload.password;

                const response = await this.$axios.post(
                    'http://localhost:8080/api/users',
                    payload, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                        },
                    }
                );
                if (response.status !== 200) {
                    this.errorMessage = 'Error creating user';
                    return;
                }

                this.$router.push({ path: '/users' });
            } catch (error) {
                console.error(error);
                this.errorMessage = 'An error occurred';
            }
        },
    },
};
</script>
  
  

<style>
.custom-add-user-page {
  background-color: #f4f4f4;
  background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../../assets/users.jpeg') no-repeat center center fixed;
  background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.custom-add-user-container {
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 5px;
  width: 400px;
}

.custom-add-user-title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.custom-add-user-form {
  display: flex;
  flex-direction: column;
}

.custom-input-field {
  margin-bottom: 15px;
}

.custom-input-field label {
  font-weight: bold;
}

.custom-input-field input[type="text"],
.custom-input-field input[type="email"],
.custom-input-field select,
.custom-input-field input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.custom-error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}

.custom-submit-field {
  text-align: center;
}

.custom-submit-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.custom-submit-button:hover {
  background-color: #0056b3;
}
</style>