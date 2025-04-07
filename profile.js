// Configuração do Firebase (substitua pelos seus dados)
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_DOMINIO.firebaseapp.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET.appspot.com",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Verifica se o usuário está logado
auth.onAuthStateChanged((user) => {
    if (user) {
        // Usuário logado, carrega os dados
        loadUserData(user.uid);
    } else {
        // Usuário não logado, redireciona para login
        window.location.href = "login.html";
    }
});

// Carrega os dados do usuário
function loadUserData(userId) {
    db.collection("users").doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                // Atualiza a interface
                document.getElementById("username").textContent = userData.username;
                document.getElementById("email").textContent = userData.email;
                document.getElementById("displayUsername").textContent = userData.username;
                document.getElementById("displayEmail").textContent = userData.email;
                document.getElementById("profileImage").src = userData.profilePicture || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog";
            } else {
                alert("Dados do usuário não encontrados!");
            }
        })
        .catch((error) => {
            console.error("Erro ao carregar dados do usuário:", error);
        });
}

// Upload de foto de perfil
document.getElementById("profileUpload").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const userId = auth.currentUser.uid;
        const storageRef = storage.ref(`profile_pictures/${userId}`);
        
        // Faz o upload da imagem para o Firebase Storage
        storageRef.put(file)
            .then(() => {
                // Obtém a URL da imagem após o upload
                return storageRef.getDownloadURL();
            })
            .then((url) => {
                // Salva a URL no Firestore
                db.collection("users").doc(userId).update({ profilePicture: url })
                    .then(() => {
                        // Atualiza a imagem na interface
                        document.getElementById("profileImage").src = url;
                        alert("Foto de perfil atualizada!");
                    })
                    .catch((error) => {
                        console.error("Erro ao atualizar foto de perfil:", error);
                    });
            })
            .catch((error) => {
                console.error("Erro ao fazer upload da foto:", error);
            });
    }
});

// Editar perfil
function editProfile() {
    const newUsername = prompt("Digite seu novo nome de usuário:");
    const newEmail = prompt("Digite seu novo e-mail:");

    if (newUsername || newEmail) {
        const userId = auth.currentUser.uid;
        const updates = {};
        if (newUsername) updates.username = newUsername;
        if (newEmail) updates.email = newEmail;

        db.collection("users").doc(userId).update(updates)
            .then(() => {
                alert("Perfil atualizado com sucesso!");
                loadUserData(userId); // Recarrega os dados
            })
            .catch((error) => {
                console.error("Erro ao atualizar perfil:", error);
            });
    }
}

// Alterar senha
function changePassword() {
    const newPassword = prompt("Digite sua nova senha:");
    if (newPassword) {
        auth.currentUser.updatePassword(newPassword)
            .then(() => {
                alert("Senha alterada com sucesso!");
            })
            .catch((error) => {
                console.error("Erro ao alterar senha:", error);
            });
    }
}