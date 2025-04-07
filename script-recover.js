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

// Lidar com o clique no botão de recuperação
document.addEventListener("DOMContentLoaded", () => {
    const recoverButton = document.querySelector("button");
    const emailInput = document.getElementById("form2Example17");

    recoverButton.addEventListener("click", () => {
        const email = emailInput.value.trim();

        if (email === "") {
            alert("Por favor, insere o teu email.");
            return;
        }

        auth.sendPasswordResetEmail(email)
            .then(() => {
                alert("Email de recuperação enviado com sucesso! Verifica a tua caixa de entrada.");
            })
            .catch((error) => {
                console.error(error);
                if (error.code === "auth/user-not-found") {
                    alert("Este email não está registado.");
                } else if (error.code === "auth/invalid-email") {
                    alert("Formato de email inválido.");
                } else {
                    alert("Ocorreu um erro ao tentar enviar o email. Tenta novamente.");
                }
            });
    });
});
