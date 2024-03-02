<template>
  <div class="custom-navbar fixed-navbar glass-effect">
    <div class="nav-links">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/popular" class="nav-link">Popular</router-link>
      <router-link to="/all-categories" class="nav-link">All Categories</router-link>
      <router-link v-if="isLoggedIn && (userType === 'CONTENT_CREATOR' || userType === 'ADMIN')" to="/categories/" class="nav-link">Categories</router-link>
      <router-link v-if="isLoggedIn && (userType === 'CONTENT_CREATOR' || userType === 'ADMIN')" to="/news" class="nav-link">News</router-link>
      <router-link v-if="isLoggedIn && userType === 'ADMIN'" to="/users" class="nav-link">Users</router-link>
    </div>
    <div class="search-bar">
      <input v-model="searchQuery" @keyup.enter="redirectToSearchPage" placeholder="Search" class="search-input" />
    </div>
    <div class="user-section">
      <p v-if="userName" class="user-name">Hello, {{ userName }}</p>
      <router-link v-if="!isLoggedIn" to="/login" class="nav-link">Login</router-link>
      <button v-if="isLoggedIn" class="logout-button" @click="logout">Sign Out</button>
    </div>
  </div>
</template>


<script>
import jwtDecode from "jwt-decode";

export default {
  name: 'AppNavbar',
  data() {
    return {
      userName: '',
      searchQuery: ""     
    }
  },
  computed: {
    isLoggedIn() {
      const jwt = localStorage.getItem('jwt');
      return !!jwt;
    },
    userType() {
      const jwt = localStorage.getItem('jwt');
      return jwt ? jwtDecode(jwt).user_type : null;
    },
  },
  methods: {
    async fetchUserName(userId) {
      try {
        const response = await this.$axios.get(`http://localhost:8080/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        });
        const { first_name, last_name } = response.data;
        this.userName = `${first_name} ${last_name}`;
      } catch (error) {
        console.error(error);
      }
    },
    logout() {
      localStorage.removeItem('jwt');
      this.$router.push('/login');
    },
    redirectToSearchPage() {
      if (this.searchQuery.trim() !== "") {
        this.$router.push({
          name: "SearchPage",
          params: { query: this.searchQuery },
        });
      }
    },
  },
  created() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      const userId = jwtDecode(jwt).id;
      this.fetchUserName(userId);
    }
  },
};
</script>

<style scoped>
.custom-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
    background-color: rgba(34, 34, 34, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s, border 0.3s;
  padding: 15px 30px;
  box-shadow: 0 2px 4px rgba(155, 2, 2, 0.3);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  color: #b20909;
  font-size: 18px;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #42a5f5;
}

.search-bar {
  width: 400px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #6d6b6b;
  border-radius: 20px;
  padding: 3px;
  background-color: #640808;
}

.search-input {
  border: none;
  padding: 10px;
  width: 2 00px;
  outline: none;
  background-color: #640808;
  color: #fff;
}

.search-input::placeholder {
  color: #efeeee;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-name {
  color: #fff;
  font-weight: 500;
}

.logout-button {
  background: #640808;
  border: none;
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #640808;
}

.custom-navbar.glass-effect:hover {
  background-color: rgba(34, 34, 34, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
