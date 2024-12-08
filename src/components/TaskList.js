// Componente de lista de tarefas
Vue.component('task-list', {
  template: `
    <div>
      <h2>Lista de Tarefas</h2>
      <button @click="$emit('switch-view', 'add-task-form')">Adicionar Tarefa</button>
      <task-filters></task-filters>
      <ul>
        <li v-for="task in tasks" :key="task.id">
          {{ task.title }} 
          <button @click="editTask(task)">Editar</button>
          <button @click="deleteTask(task.id)">Deletar</button>
        </li>
      </ul>
    </div>
  `,
  data() {
      return {
          tasks: [
              { id: 1, title: 'Tarefa 1', status: 'Em andamento' },
              { id: 2, title: 'Tarefa 2', status: 'Concluída' },
          ]
      };
  },
  methods: {
      editTask(task) {
          console.log('Editando tarefa:', task);
      },
      deleteTask(taskId) {
          this.tasks = this.tasks.filter(task => task.id !== taskId);
      }
  }
});

// Componente de formulário para adicionar tarefa
Vue.component('add-task-form', {
  template: `
    <div>
      <h2>Adicionar Nova Tarefa</h2>
      <form @submit.prevent="addTask">
          <div class="text-box">
              <input type="text" v-model="title" placeholder="Título da Tarefa" required>
              <input type="text" v-model="status" placeholder="Status da Tarefa" required>
          </div>
          <animated-button :disabled="loading" type="submit">Adicionar</animated-button>
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

// Componente de filtros para tarefas
Vue.component('task-filters', {
  template: `
    <div>
      <label for="status">Filtrar por status:</label>
      <select v-model="selectedStatus">
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
  }
});