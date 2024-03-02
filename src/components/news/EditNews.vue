<template>
    <div class="edit-news-page" :key="componentKey">
      <div class="edit-news-container">
        <h1>Edit News</h1>
        <h3>Author: {{ editedNews.authorName }}</h3>
        <form @submit.prevent="updateNews" class="edit-news-form">
          <div class="input-field">
            <label for="title">Title:</label>
            <input type="text" id="title" v-model="editedNews.title" required>
          </div>
          <div class="input-field">
            <label for="text">Text:</label>
            <textarea id="text" v-model="editedNews.text" required></textarea>
          </div>
          <div class="input-field">
            <label for="category_id">Category:</label>
            <select id="category_id" v-model="editedNews.category_id" required class="styled-dropdown">
              <option value="">Select Category...</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
          </div>
          <div class="tags-container">
            <input type="text" id="tags" v-model="tagInput" placeholder="Enter a tag" class="tag-input">
            <button type="button" class="add-tag-button" @click="addTag">Add</button>
          </div>
          <div class="tags-list">
            <span class="tag" v-for="(tag, index) in editedNews.tags" :key="index" @click="deleteTag(index)">{{ tag }}</span>
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
            componentKey: 0,
            editedNews: {
                title: '',
                text: '',
                author_id: '',
                category_id: '',
                tags: [],
            },
            categories: [],
            tagInput: '',
            errorMessage: '',
        };
    },
    methods: {
        async updateNews() {
            if (!this.editedNews.title || !this.editedNews.text || !this.editedNews.category_id) {
                this.errorMessage = 'All fields are required';
                return;
            }

            try {
                const jwt = localStorage.getItem('jwt');

                const newsResponse = await this.$axios.put(
                    `http://localhost:8080/api/news/${this.editedNews.id}`, {
                        title: this.editedNews.title,
                        text: this.editedNews.text,
                        category_id: this.editedNews.category_id,
                    }, {
                        headers: {
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );
                if (newsResponse.status !== 200) {
                    this.errorMessage = 'Error updating news';
                    return;
                }


                const tagIds = [];
                for (let tag of this.editedNews.tags) {
                    let tagResponse = await this.$axios.get(
                        `http://localhost:8080/api/tags/name/${tag}`, {
                            headers: {
                                Authorization: `Bearer ${jwt}`,
                            },
                        }
                    );

                    if (tagResponse.status === 200) {
                        tagIds.push(tagResponse.data.id);
                    } else if (tagResponse.status === 204) {
                        const createdTagResponse = await this.$axios.post(
                            'http://localhost:8080/api/tags', { name: tag }, {
                                headers: {
                                    Authorization: `Bearer ${jwt}`,
                                },
                            }
                        );
                        tagIds.push(createdTagResponse.data.id); //ovde cuvam sve tagId
                    } else {
                        throw new Error(`Unexpected response status: ${tagResponse.status}`);
                    }
                }

              //obrisem sve veze vesti sa tagovima
                await this.$axios.delete(
                    `http://localhost:8080/api/news_tags/news/${this.editedNews.id}`, {
                        headers: {
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );
                //dodamo sve idove sivh tagova koji su preostali
                for (let tagId of tagIds) {
                    await this.$axios.post(
                        'http://localhost:8080/api/news_tags', { news_id: this.editedNews.id, tag_id: tagId }, {
                            headers: {
                                Authorization: `Bearer ${jwt}`,
                            },
                        }
                    );
                }

                this.$router.push({ path: '/news' });
            } catch (error) {
                console.error(error);
                this.errorMessage = 'An error occurred';
            }
        },
        async fetchNews() {
            const id = this.$route.params.newsId;
            try {
                const response = await this.$axios.get(`http://localhost:8080/api/news/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                });
                this.editedNews = response.data;

                const authorResponse = await this.$axios.get(`http://localhost:8080/api/users/${this.editedNews.author_id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                });
                this.editedNews.authorName = authorResponse.data.first_name + ' ' + authorResponse.data.last_name;

            } catch (error) {
                console.error('Error fetching news data', error);
            }
        },
        async fetchCategories() {
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
        async fetchTags() {
            //medjutabela koja na osnovu newsid nadje tagid
            const id = this.$route.params.newsId;
            try {
                const response = await this.$axios.get(`http://localhost:8080/api/news_tags/news/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                });
                const tagIds = response.data.map(tag => tag.tag_id);
                const tags = await Promise.all(tagIds.map(async tagId => {
                    const tagResponse = await this.$axios.get(`http://localhost:8080/api/tags/${tagId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                        },
                    });
                    return tagResponse.data.name; //dobijam ime taga na osnovu tagid
                }));
                this.editedNews.tags = tags;
                this.componentKey += 1; //kada se promeni vrednost kljuca sigurno ima sve podatke zbog asinhronih fja
            } catch (error) {
                console.error('Error fetching tags data', error);
            }
        },
        addTag() {
            if (this.tagInput.trim() !== '') {
                this.editedNews.tags.push(this.tagInput);
                this.tagInput = '';
            }
        },
        deleteTag(index) {
            this.editedNews.tags.splice(index, 1);
            this.$forceUpdate();
        },
    },
    async mounted() {
        try {
            await this.fetchNews();
            await this.fetchCategories();
            await this.fetchTags();
        } catch (error) {
            console.error('Error initializing data', error);
        }
    }
}
</script>
  
<style scoped>
.edit-news-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../../assets/addnews.jpeg') no-repeat center center fixed;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}

.edit-news-container {
    width: 400px;
    padding: 2em;
    background-color: rgba(31, 31, 31, 0.8);
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}

.edit-news-container h1 {
    margin-bottom: 32px;
    text-align: center;
    color: #ffc107;
}

.edit-news-container h3 {
    text-align: center;
    color: #fff;
    font-weight: 400;
}

.edit-news-form .input-field {
    margin-bottom: 1em;
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
}

.edit-news-form label {
    display: block;
    margin-bottom: 0.5em;
    color: #ddd;
}

.edit-news-form input[type="text"],
.edit-news-form textarea {
    width: 100%;
    padding: 0.5em;
    border: 1px solid #ddd;
    background-color: #333;
    color: #ddd;
    border-radius: 4px;
    outline: none;
    box-sizing: border-box;
}

.edit-news-form textarea {
    height: 200px;
}

.tags-container {
    display: flex;
    margin-bottom: 1em;
}

.tags-container input[type="text"] {
    flex-grow: 1;
    padding: 0.5em;
    border: 1px solid #ddd;
    background-color: #333;
    color: #ddd;
    border-radius: 4px;
    outline: none;
    box-sizing: border-box;
}

.tags-container button {
    background-color: #ffc107;
    color: #000;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    text-transform: uppercase;
    transition: background-color 0.2s ease;
    margin-left: 0.5em;
}

.tags-container button:hover {
    background-color: #c6ff28;
}

.tags-list {
    display: flex;
    flex-wrap: wrap;
}

.tag {
    background-color: #ffc107;
    color: #000;
    padding: 5px 10px;
    border-radius: 4px;
    margin-right: 5px;
    margin-bottom: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.tag-input {
    margin-right: 10px;
}

.tag:hover {
    background-color: #B22222;
}

.add-tag-button {
    padding-left: 1em;
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
  