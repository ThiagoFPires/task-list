Vue.component('task-stats', {
  template: `
    <div class="task-stats-container">
      <h2>Estatísticas das Tarefas</h2>
      <div class="stats">
        <p>Total de tarefas: {{ totalTasks }}</p>
        <p>Tarefas concluídas: {{ completedTasks }}</p>
        <p>Tarefas pendentes: {{ pendingTasks }}</p>
      </div>
    </div>
  `,
  data() {
    return {
      totalTasks: 10,
      completedTasks: 5,
      pendingTasks: 5
    };
  }
});
