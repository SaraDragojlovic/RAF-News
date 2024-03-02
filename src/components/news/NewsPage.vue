<template>
    <div class="news-page">
      <h1>News</h1>
      <button class="add-button" @click="goToAddNewsForm">
        <span class="add-icon">+</span>
      </button>
      <table class="glass-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Creation Time</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="news in newsListWithAuthor" :key="news.id">
            <td><span @click="openNewsPage(news.id)" class="clickable-title text-column">{{ news.title }}</span></td>
            <td>{{ news.creation_time }}</td>
            <td>{{ news.authorName }}</td>
            <td>
              <button class="edit-button" @click="editNews(news)">Edit</button>
              <button class="delete-button" @click="deleteNews(news)">Delete</button>
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
            newsList: [],
            currentPage: 1,
            hasNextPage: false,
            hasPreviousPage: false,
        };
    },
    computed: {
        newsListWithAuthor() {
            return this.newsList.map((news) => ({
                ...news,
                authorName: news.authorName || "",
            }));
        },
    },
    methods: {
        async fetchNews(page) {
            try {
                let url = `http://localhost:8080/api/news/page/${page}`;

                if (this.$route.params.categoryId) {
                    url = `http://localhost:8080/api/news/category/${this.$route.params.categoryId}/${page}`;
                }

                const response = await this.$axios.get(url, {
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

                const authorIds = response.data.map((news) => news.author_id);
                const authorResponses = await Promise.all(
                    authorIds.map((authorId) =>
                        this.$axios.get(`http://localhost:8080/api/users/${authorId}`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                            },
                        })
                    )
                );

                this.newsList = response.data.map((news, index) => ({
                    ...news,
                    authorName: `${authorResponses[index].data.first_name} ${authorResponses[index].data.last_name}`,
                }));
                this.hasPreviousPage = this.currentPage > 1;
            } catch (error) {
                console.error(error);
            }
        },
        fetchNextPage() {
            if (this.hasNextPage) {
                this.currentPage++;
                this.fetchNews(this.currentPage);
            }
        },
        fetchPreviousPage() {
            if (this.hasPreviousPage) {
                this.currentPage--;
                this.fetchNews(this.currentPage);
            }
        },
        goToAddNewsForm() {
            this.$router.push('/news/add');
        },
        editNews(news) {
            this.$router.push({ name: 'EditNews', params: { newsId: news.id } });
        },
        async deleteNews(news) {
            try {
                const response = await this.$axios.delete(`http://localhost:8080/api/news/${news.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                });
                if (response.status === 204) {
                    const index = this.newsList.findIndex(n => n.id === news.id);
                    if (index !== -1) {
                        this.newsList.splice(index, 1);
                        if (this.newsList.length === 0) {
                            if (this.hasPreviousPage) {
                                this.fetchPreviousPage();
                            } else {
                                this.fetchNews(this.currentPage);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            }
        },
        handleRouteChange() {
            this.currentPage = 1;
            this.newsList = [];
            this.fetchNews(this.currentPage);
        },
        async openNewsPage(newsId) {
            try {
                await this.$axios.put(`http://localhost:8080/api/news/visit/${newsId}`, null, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                });

                const url = `${window.location.protocol}//${window.location.host}/single-news/${newsId}`;
                window.open(url, '_blank');
            } catch (error) {
                console.error('Error updating visit count:', error);

                const url = `${window.location.protocol}//${window.location.host}/single-news/${newsId}`;
                window.open(url, '_blank');
            }
        },
    },
    watch: {
        '$route.path': {
            immediate: true,
            handler: 'handleRouteChange',
        },
    },
    created() {
        this.fetchNews(this.currentPage);
    },
};
</script>
  

   <style scoped>
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
     background-color: #007BFF;
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
     background-color: #0056b3;
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