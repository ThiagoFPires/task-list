Vue.component('task-list', {
  template: `
    <div class="task-list-container">
      <h2>Lista de Tarefas</h2>
      <input 
          type="text" 
          v-model="consulta" 
          placeholder="Buscar tarefa" 
          class="search-input" 
          @input="filterTasks"
          id="input_buscar"
      />
      <i class="fas fa-search search-icon" @click="filterTasks"></i>
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
      tasks: [
        { id: 1, title: 'Tarefa 1', status: 'Em andamento' },
        { id: 2, title: 'Tarefa 2', status: 'Concluída' },
        { id: 3, title: 'Tarefa 3', status: 'Em andamento' },
      ],
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
        tasks = tasks.filter(task => task.title.toLowerCase().includes(this.consulta.toLowerCase()));
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
          <input type="text" v-model="status" placeholder="Status da Tarefa" required />
        </div>
        <button :disabled="loading" type="submit" class="submit-button">Adicionar</button>
      </form>
    </div>
  `,
  data() {
    return {
      title: '',
      status: '',
      loading: false
    };
  },
  methods: {
    async addTask() {
      this.loading = true;
      // Simula a adição da tarefa
      setTimeout(() => {
        this.loading = false;
        alert('Tarefa adicionada com sucesso!');
        this.title = '';
        this.status = '';
        this.$emit('switch-view', 'task-list');
      }, 1000);
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
