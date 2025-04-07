document.addEventListener("DOMContentLoaded", () => {
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

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    const form = document.getElementById("contactForm");

    if (!form) {
        console.error("Formulário não encontrado!");
        return;
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault(); // Previne o envio padrão do formulário

        const username = form.username.value.trim();
        const email = form.email.value.trim();
        const phone = form.phone.value.trim();
        const message = form.message.value.trim();

        if (!username || !email || !message) {
            alert("Por favor preencha todos os campos obrigatórios.");
            return;
        }

        if (phone && !/^\d+$/.test(phone)) {
            alert("Por favor, insira um número de telefone válido.");
            return;
        }

        try {
            await db.collection("ContactUsEmail").add({
                username,
                email,
                phone,
                message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            alert("Mensagem enviada com sucesso!");
            form.reset();
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            alert("Ocorreu um erro ao enviar a mensagem. Tente novamente.");
        }
    });
});
