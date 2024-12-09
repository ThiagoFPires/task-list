Documentação api para gerenciamento de Tarefas.

POST auth/register (registrar novo usuário)
http://localhost:4000/auth/register
Registrar o usuário no programa.

Body
{
  "email": "novoemail@daominaio.com",
  "senha": "senha123"
}

POST auth/login (login usuário)
http://localhost:4000/auth/login
Faz com que o usuário faça seu login apartir do cadastro feito anteriormente.

{
  "email": "novoemail@dominio.com",
  "senha": "senha123"
}


POST /tasks (criação de tarefa)
http://localhost:4000/tasks
Faz a criação da tarefa.

{
  "titulo": "Tarefa teste 2",
  "descricao": "Desafio de to-list",
  "prioridade": 5,
  "usuarioId": 1
}

GET /tasks (busca todas as tarefas que foram criadas)
http://localhost:4000/tasks
Lista as tarefas criadas.

GET /tasks/id (busca tarefas pelo id)
http://localhost:4000/tasks/3
Busca a tarefa pelo ID.

PUT /tasks/:id (atualizar informações da tarefa)
http://localhost:4000/tasks/1
Atualiza as informações da tarefa cadastrada.

{
  "titulo": "Tarefa Atualizada",
  "descricao": "Descrição da tarefa atualizada",
  "status": "em andamento",
  "prioridade": 2
}

DELETE /tasks/:id (deletar tarefa)
http://localhost:4000/tasks/1

GET /statistics/:id (gera as estatísticas entre as tarefas)
http://localhost:4000/tasks/statistics/1
Gera a estatistica das tarefas criadas.

