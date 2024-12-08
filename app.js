// Componente de login
Vue.component('login-form', {
  template: `
    <div>
      <div class="logo">
          <img src="assets/task-vector-icon.jpg" alt="Logo da Empresa">
      </div>
      <h2>Faça seu login</h2>
      <form @submit.prevent="login">
      <div class="text-box">
          <input type="text" v-model="email" placeholder="E-mail" required>
          <input type="password" v-model="senha" placeholder="Senha" required>
      </div>
          <animated-button :disabled="loading" type="submit">Login</animated-button>
      </form>
      <div class="options">
          <a href="#" @click.prevent="$emit('switch-view', 'register-form')">Cadastre-se</a>
      </div>
    </div>
  `,
  data() {
      return {
          email: '',
          senha: '',
          loading: false
      };
  },
  methods: {
      async login() {
          this.loading = true;
          try {
              const response = await axios.post('http://localhost:4000/auth/login', {
                  email: this.email,
                  senha: this.senha,
              });

              localStorage.setItem('token', response.data.token);
              localStorage.setItem('user', JSON.stringify(response.data.user));

              Swal.fire({
                  icon: 'success',
                  title: 'Login bem-sucedido!',
                  text: 'Bem-vindo de volta, ' + response.data.user.nome + '!',
                  confirmButtonText: 'Ok'
              });

              this.$emit('switch-view', 'task-list');
          } catch (error) {
              Swal.fire({
                  icon: 'error',
                  title: 'Erro ao fazer login',
                  text: 'Verifique suas credenciais e tente novamente.',
                  confirmButtonText: 'Tente novamente'
              });
          } finally {
              this.loading = false;
          }
      }
  }
});

// Componente do botão animado
Vue.component('animated-button', {
  template: `
    <button @mouseover="hover = true" @mouseleave="hover = false" @click="$emit('click')">
        <span :class="{ 'button-text': true, 'button-hover': hover }">
            <slot></slot>
        </span>
    </button>
`,
  data() {
      return {
          hover: false
      };
  }
});

Vue.component('register-form', {
  template: `
    <div>
        <h2>Cadastre-se</h2>
        <form @submit.prevent="register">
        <div class="text-box">
            <input type="text" v-model="nomeCompleto" placeholder="Nome Completo" required>
            <input type="text" v-model="email" placeholder="E-mail" required>
            <input type="password" v-model="senha" placeholder="Senha" required>
            <input type="password" v-model="confirmarSenha" placeholder="Confirme sua Senha" required> 
            <animated-button :disabled="loading" type="submit">Cadastrar</animated-button>
        </div>
        </form>
        <div class="options">
            <a href="#" @click.prevent="$emit('switch-view', 'login-form')">Já tem uma conta? Faça login</a>
        </div>
    </div>
  `,
  data() {
      return {
          email: '',
          senha: '',
          confirmarSenha: '',
          loading: false // Para controle de loading
      }
  },
  methods: {
      async register() {
          // Verificar se as senhas são iguais
          if (this.senha !== this.confirmarSenha) { 
              Swal.fire({
                  icon: 'error',
                  title: 'Erro ao cadastrar!',
                  text: 'As senhas não coincidem.',
                  confirmButtonText: 'Tente novamente',
                  customClass: {
                      confirmButton: 'swal-button-center custom-button'
                  }
              });
              return; // Interromper o processo de cadastro
          }

          this.loading = true; // Ativar loading
          try {
              const response = await axios.post('http://localhost:4000/auth/register', {
                  nome: this.nomeCompleto,
                  email: this.email,
                  senha: this.senha,
              });

              Swal.fire({
                  icon: 'success',
                  title: 'Cadastro realizado com sucesso!',
                  text: 'Você já pode fazer login.',
                  confirmButtonText: 'Ok',
                  customClass: {
                      confirmButton: 'swal-button-center'
                  }
              });

              // Limpar os campos após o cadastro
              this.nomeCompleto = '';
              this.email = '';
              this.senha = '';
              this.confirmarSenha = '';

              // Emitir evento para mudar a visualização, se necessário
              this.$emit('switch-view', 'login-form');

          } catch (error) {
              const errorMessage = error.response?.data?.error || 'Ocorreu um erro ao tentar cadastrar.';
              console.error('Erro ao cadastrar', errorMessage);

              Swal.fire({
                  icon: 'error',
                  title: 'Erro ao cadastrar',
                  text: errorMessage,
                  confirmButtonText: 'Tente novamente',
                  customClass: {
                      confirmButton: 'swal-button-center custom-button'
                  }
              });
          } finally {
              this.loading = false; // Desativar loading
          }
      }
  }
});

// Instanciando a aplicação Vue
new Vue({
  el: '#app',
  data() {
      return {
          currentComponent: 'login-form',
          history: []
      };
  },
  computed: {
      showBackButton() {
          return this.currentComponent !== 'login-form';
      }
  },
  methods: {
      switchView(component) {
          if (this.currentComponent !== component) {
              this.history.push(this.currentComponent);
          }
          this.currentComponent = component;
      },
      goBack() {
          if (this.history.length > 0) {
              this.currentComponent = this.history.pop();
          }
      }
  }
});
