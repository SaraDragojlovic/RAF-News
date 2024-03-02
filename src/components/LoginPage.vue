<template>
    <div class="login-page">
        <div class="login-container">
            <h1>Login</h1>
            <form @submit.prevent="login" class="login-form">
                <div class="input-field">
                    <label for="email">Email:</label>
                    <input type="email" id="email" v-model="email">
                </div>
                <div class="input-field">
                    <label for="password">Password:</label>
                    <input type="password" id="password" v-model="password">
                </div>
                <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
                <div class="submit-field">
                    <input type="submit" value="Submit">
                </div>
            </form>
        </div>
    </div>
</template>
    
<script>
export default {
    name: "LoginPage",
    data() {
        return {
            email: '',
            password: '',
            errorMessage: '',
        };
    },
    methods: {
        async login() {
            if (!this.email || !this.password) {
                this.errorMessage = 'Both fields are required';
                return;
            }

            try {
                const response = await this.$axios.post('http://localhost:8080/api/users/login', {
                    email: this.email,
                    password: this.password
                });

                console.log(response.data);
                const jwt = response.data.jwt;
                
                if (jwt) {
                    localStorage.setItem('jwt', jwt);

                    this.errorMessage = '';
                    this.$router.push('/');
                }
            } catch (error) {
                console.error(error);
                this.errorMessage = 'Invalid email or password';
            }
        },
    },
};
</script>


<style scoped>
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../assets/home.jpeg') no-repeat center center fixed;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}

.login-container {
    width: 400px;
    padding: 2em;
    background-color: rgba(31, 31, 31, 0.8);
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}

h1 {
    margin-bottom: 32px;
    text-align: center;
    color: #af1c0f;
}

.login-form .input-field {
    margin-bottom: 1em;
}

.login-form label {
    display: block;
    margin-bottom: .5em;
    color: #ddd;
}

.login-form input[type="email"],
.login-form input[type="password"] {
    width: 100%;
    padding: .5em;
    border: 1px solid #ddd;
    background-color: #333;
    color: #ddd;
    border-radius: 4px;
    outline: none;
}

.submit-field {
    text-align: center;
    margin-top: 2em;
}

.submit-field input[type="submit"] {
    background-color: #a2180e;
    color: #000000;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    text-transform: uppercase;
    transition: background-color 0.2s ease;
}

.submit-field input[type="submit"]:hover {
    background-color: #c90b0be3;
}

.error-message {
    color: #FFFFFF;
    background-color: rgba(31, 31, 31, 0.8);
    border: 1px solid #B22222;
    padding: 10px;
    border-radius: 10px;
    margin: 20px 0;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
}
</style>

