// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA1WPHKba2wVzCAjOSnSBatONHdlFI6kS0",
    authDomain: "opencourt-a7ed4.firebaseapp.com",
    databaseURL: "https://opencourt-a7ed4-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "opencourt-a7ed4",
    storageBucket: "opencourt-a7ed4.appspot.com",
    messagingSenderId: "185611428061",
    appId: "1:185611428061:web:b01b2117402e8a302f7b34",
    measurementId: "G-ZB4DRVZMKL"
};

// Inicializando o Firebase
firebase.initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', function() {
    const emailDisplay = document.querySelector("#emailDisplay");
    const usernameDisplay = document.querySelector("#usernameDisplay");
    const editEmailButton = document.querySelector("#editEmailButton");
    const editUsernameButton = document.querySelector("#editUsernameButton");
    const changePasswordButton = document.querySelector(".buttonchangepass");
    const logoutButton = document.querySelector("#logoutButton");
    const deleteAccountButton = document.querySelector(".buttondelete");

    if (!emailDisplay || !usernameDisplay || !editEmailButton || !editUsernameButton || !changePasswordButton || !logoutButton || !deleteAccountButton) {
        console.error("Alguns elementos não foram encontrados no DOM.");
        return;
    }

    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            console.log("Usuário não autenticado");
            window.location.href = "login.html";
        } else {
            console.log("Usuário logado:", user.email);

            const db = firebase.firestore();
            const userDocRef = db.collection('users').doc(user.uid);

            function updateUserProfile() {
                console.log("Buscando dados do usuário no Firestore...");

                userDocRef.get()
                    .then(doc => {
                        if (doc.exists) {
                            console.log("Documento do usuário encontrado:", doc.data());
                            const userData = doc.data();
                            emailDisplay.textContent = userData.email || user.email;
                            usernameDisplay.textContent = userData.username || user.displayName || "Nome não disponível";
                        } else {
                            console.warn("Documento do usuário não encontrado. Criando...");

                            // Cria um novo documento com email padrão e username vazio
                            const userData = {
                                email: user.email,
                                username: ""
                            };

                            userDocRef.set(userData)
                                .then(() => {
                                    console.log("Documento criado com sucesso.");
                                    emailDisplay.textContent = user.email;
                                    usernameDisplay.textContent = "Nome não disponível";
                                })
                                .catch(error => {
                                    console.error("Erro ao criar documento:", error);
                                });
                        }
                    })
                    .catch(error => {
                        console.error("Erro ao obter dados:", error);
                    });
            }

            updateUserProfile();

            editEmailButton.addEventListener("click", function() {
                const newEmail = prompt("Digite o novo e-mail:", emailDisplay.textContent);

                if (newEmail && newEmail !== emailDisplay.textContent) {
                    user.updateEmail(newEmail).then(() => {
                        return userDocRef.update({ email: newEmail });
                    }).then(() => {
                        emailDisplay.textContent = newEmail;
                        alert("E-mail atualizado com sucesso!");
                    }).catch(error => {
                        console.error("Erro ao atualizar e-mail:", error);
                        alert("Erro ao atualizar o e-mail. Talvez seja necessário fazer login novamente.");
                    });
                } else {
                    alert("E-mail não alterado.");
                }
            });

            editUsernameButton.addEventListener("click", function() {
                const newUsername = prompt("Digite o novo nome de usuário:", usernameDisplay.textContent);

                if (newUsername && newUsername !== usernameDisplay.textContent) {
                    userDocRef.update({ username: newUsername })
                        .then(() => {
                            usernameDisplay.textContent = newUsername;
                            alert("Nome de usuário atualizado com sucesso!");
                        })
                        .catch(error => {
                            console.error("Erro ao atualizar nome de usuário:", error);
                            alert("Erro ao atualizar o nome de usuário.");
                        });
                } else {
                    alert("Nome de usuário não alterado.");
                }
            });

            changePasswordButton.addEventListener("click", function() {
                firebase.auth().sendPasswordResetEmail(user.email)
                    .then(() => {
                        alert(`Um e-mail de redefinição de senha foi enviado para ${user.email}`);
                    })
                    .catch(error => {
                        console.error("Erro ao enviar redefinição:", error.message);
                        alert("Erro ao enviar e-mail de redefinição de senha.");
                    });
            });

            logoutButton.addEventListener("click", function() {
                firebase.auth().signOut()
                    .then(() => {
                        console.log("Usuário deslogado.");
                        window.location.href = "login.html";
                    })
                    .catch(error => {
                        console.error("Erro ao deslogar:", error.message);
                        alert("Erro ao fazer logout.");
                    });
            });

            deleteAccountButton.addEventListener("click", function(event) {
                // Evita o comportamento padrão do botão
                event.preventDefault();

                const confirmDelete = confirm("Tem certeza de que deseja apagar a sua conta? Esta ação é irreversível.");

                if (confirmDelete) {
                    const user = firebase.auth().currentUser;
                    const db = firebase.firestore();
                    const userDocRef = db.collection('users').doc(user.uid);

                    // Primeiro, excluir o documento do usuário no Firestore
                    userDocRef.delete()
                        .then(() => {
                            console.log("Dados do usuário no Firestore excluídos com sucesso.");

                            // Agora, tentar excluir a conta do Firebase Authentication
                            return user.delete();
                        })
                        .then(() => {
                            console.log("Conta no Firebase Authentication excluída com sucesso.");
                            alert("Sua conta foi apagada com sucesso.");
                            window.location.href = "login.html"; // Redireciona após a exclusão da conta
                        })
                        .catch(error => {
                            console.error("Erro ao excluir a conta ou os dados:", error);
                            if (error.code === 'auth/requires-recent-login') {
                                alert("Por segurança, faça login novamente para apagar a conta.");
                                // Solicitar que o usuário faça login novamente
                                firebase.auth().signOut().then(() => {
                                    window.location.href = "login.html"; // Redirecionar para login
                                });
                            } else {
                                alert("Erro ao apagar a conta ou os dados. Tente novamente.");
                            }
                        });
                }
            });
        }
    });
});