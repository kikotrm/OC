// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA1WPHKba2wVzCAjOSnSBatONHdlFI6kS0",
    authDomain: "opencourt-a7ed4.firebaseapp.com",
    databaseURL: "https://opencourt-a7ed4-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "opencourt-a7ed4",
    storageBucket: "opencourt-a7ed4.firebasestorage.app",
    messagingSenderId: "185611428061",
    appId: "1:185611428061:web:b01b2117402e8a302f7b34",
    measurementId: "G-ZB4DRVZMKL"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Verificar se o botão de login existe antes de adicionar listener
document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById('login-btn'); // Mudança para o id do botão
    if (loginBtn) {
        loginBtn.addEventListener('click', login);
    }
});

function login() {
    const email = document.getElementById("email").value; // Mudança para o id correto
    const password = document.getElementById("password").value; // Mudança para o id correto

    // Limpar mensagens de erro
    document.getElementById("email-error").textContent = '';
    document.getElementById("password-error").textContent = '';

    if (!email || !password) {
        if (!email) {
            document.getElementById("email-error").textContent = "Email é obrigatório.";
        }
        if (!password) {
            document.getElementById("password-error").textContent = "Senha é obrigatória.";
        }
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Verificar se o e-mail foi verificado
            if (!user.emailVerified) {
                alert("Por favor, verifique seu e-mail antes de fazer login.");
                auth.signOut(); // Desconectar o usuário se o e-mail não for verificado
                return; // Impedir o restante do processo de login
            }

            // Buscar dados adicionais do Firestore
            db.collection("users").doc(user.uid).get()
                .then(doc => {
                    const userData = doc.exists ? doc.data() : {};

                    // Salvar no localStorage
                    localStorage.setItem("user", JSON.stringify({
                        uid: user.uid,
                        email: user.email,
                        ...userData
                    }));

                    // Mensagem de sucesso e redirecionamento
                    window.location.href = "dashboard.html"; // Redirecionar após 2 segundos
                })
                .catch(error => {
                    console.error("Erro ao buscar dados no Firestore:", error);
                    alert("Erro ao buscar dados do usuário.");
                });
        })
        .catch((error) => {
            console.error("Erro no login:", error.message);
            alert("Email ou senha incorretos.");
        });
}