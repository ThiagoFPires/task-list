Vue.component('task-list', {
  template: `
    <div class="task-list-container">
      <h2>Lista de Tarefas</h2>
      <div class="search-container">
        <input 
            type="text" 
            v-model="consulta" 
            placeholder="Buscar por título ou status" 
            class="search-input" 
            @input="filterTasks"
            id="input_buscar"
        />
        <i class="fas fa-search search-icon" @click="filterTasks"></i>
      </div>
      <button @click="$emit('switch-view', 'add-task-form')" class="add-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
        </svg>
      </button>
      <task-filters @filter-changed="updateTaskList"></task-filters>
      <ul>
        <li class="list-item header">
          <span><b>Título</b></span>
          <span><b>Status</b></span>
          <span><b>Ações</b></span>
        </li>
        <li v-for="task in filteredTasks" :key="task.id" class="list-item">
          <span>{{ task.title }}</span>
          <span>{{ task.status }}</span>
          <div class="icons">
            <i class="fas fa-edit editar" @click="editTask(task)"></i>
            <i class="fas fa-trash delete-icon" @click="deleteTask(task.id)"></i>
          </div>
        </li>
      </ul>
    </div>
  `,
  data() {
    return {
      tasks: [],
      selectedStatus: 'Todos',
      consulta: ''
    };
  },
  computed: {
    filteredTasks() {
      let tasks = this.tasks;
      if (this.selectedStatus !== 'Todos') {
        tasks = tasks.filter(task => task.status === this.selectedStatus);
      }
      if (this.consulta) {
        tasks = tasks.filter(task => 
          task.title.toLowerCase().includes(this.consulta.toLowerCase()) ||
          task.status.toLowerCase().includes(this.consulta.toLowerCase())
        );
      }
      return tasks;
    }
  },
  methods: {
    editTask(task) {
      console.log('Editando tarefa:', task);
    },
    deleteTask(taskId) {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
    },
    updateTaskList(status) {
      this.selectedStatus = status;
    },
    filterTasks() {
      this.updateTaskList(this.selectedStatus);
    }
  }
});




Vue.component('add-task-form', {
  template: `
    <div class="add-task-form">
      <h2>Adicionar Nova Tarefa</h2>
      <form @submit.prevent="addTask">
        <div class="text-box">
          <input type="text" v-model="title" placeholder="Título da Tarefa" required />
        </div>
        <div class="text-box">
          <textarea v-model="description" placeholder="Descrição da Tarefa" required></textarea>
        </div>
        <div class="select-box">
          <label for="status">Status:</label>
          <select id="status" v-model="status" required>
            <option value="" disabled>Selecione o status</option>
            <option value="pendente">Pendente</option>
            <option value="em progresso">Em Progresso</option>
            <option value="concluida">Concluída</option>
          </select>
        </div>
        <div class="select-box">
          <label for="priority">Prioridade:</label>
          <select id="priority" v-model="priority" required>
            <option value="" disabled>Selecione a prioridade</option>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
        </div>
        <button :disabled="loading" type="submit" class="submit-button">Adicionar</button>
      </form>
    </div>
  `,
  data() {
    return {
      title: '',
      description: '',
      status: '',
      priority: '',
      loading: false
    };
  },
  methods: {
    async addTask() {
      try {
        this.loading = true;

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
          throw new Error('Usuário não autenticado.');
        }

        const response = await axios.post('http://localhost:4000/tasks', {
          titulo: this.title,
          descricao: this.description,
          status: this.status,
          prioridade: this.priority,
          usuarioId: user.id
        });

        Swal.fire({
          icon: 'success',
          title: 'Tarefa adicionada com sucesso!',
          text: `A tarefa "${this.title}" foi adicionada.`,
          confirmButtonText: 'Ok'
        });

        this.title = '';
        this.description = '';
        this.status = '';
        this.priority = '';

        this.$emit('switch-view', 'task-list');
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao adicionar tarefa',
          text: error.response?.data?.error || 'Ocorreu um erro. Tente novamente.',
          confirmButtonText: 'Tente novamente'
        });
      } finally {
        this.loading = false;
      }
    }
  }
});


Vue.component('task-filters', {
  template: `
    <div class="task-filters">
      <label for="status">Filtrar por status:</label>
      <select v-model="selectedStatus" @change="onStatusChange">
        <option value="Todos">Todos</option>
        <option value="Em andamento">Em andamento</option>
        <option value="Concluída">Concluída</option>
      </select>
    </div>
  `,
  data() {
    return {
      selectedStatus: 'Todos'
    };
  },
  methods: {
    onStatusChange() {
      this.$emit('filter-changed', this.selectedStatus);
    }
  }
});
