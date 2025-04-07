// 1. Configuração do Firebase
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

// 2. Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 3. Quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
    const registerBtn = document.querySelector('.login-button');
    if (registerBtn) {
        registerBtn.addEventListener('click', registerUser);
    }
});

// 4. Função para registrar usuário
function registerUser() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validar os campos
    if (!username || !email || !password || !confirmPassword) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    if (password !== confirmPassword) {
        alert("As senhas não coincidem.");
        return;
    }

    if (password.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    // Criar usuário no Firebase Authentication
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Enviar o email de verificação
            user.sendEmailVerification()
                .then(() => {
                    // Salvar informações adicionais no Firestore
                    db.collection("users").doc(user.uid).set({
                            username: username,
                            email: email,
                            uid: user.uid,
                            createdAt: Date.now() // Timestamp em milissegundos
                        })
                        .then(() => {
                            alert("Cadastro realizado com sucesso. Verifique seu email para completar o processo.");
                            window.location.href = "login.html"; // Redirecionar para login
                        })
                        .catch((error) => {
                            console.error("Erro ao salvar dados no Firestore:", error);
                            alert("Ocorreu um erro ao registrar. Tente novamente.");
                        });
                })
                .catch((error) => {
                    console.error("Erro ao enviar e-mail de verificação:", error);
                    alert("Falha ao enviar e-mail de verificação.");
                });
        })
        .catch((error) => {
            console.error("Erro ao criar usuário:", error);
            alert("Erro ao registrar: " + error.message);
        });
}