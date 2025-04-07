const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
    window.location.href = "login.html";
} else {
    console.log("Usuário logado:", user.email);
    // Exemplo: document.getElementById("user-name").innerText = user.name;
}

// Espera o conteúdo da página ser carregado
document.addEventListener("DOMContentLoaded", () => {
    const imageButton = document.getElementById("imageButton"); // A imagem que abre o popup
    const popup = document.getElementById("popup"); // O popup de login/register

    // Inicialmente, o popup deve estar escondido
    popup.classList.remove("show"); // Garantir que o popup está inicialmente oculto

    // Ao clicar na imagem, alterna a visibilidade do popup
    imageButton.addEventListener("click", () => {
        popup.classList.toggle("show"); // Alterna a visibilidade do popup
    });

    // Função para redirecionar para a página de perfil
    window.redirectToProfile = function() {
        window.location.href = "profile.html"; // Redireciona para a página de perfil
    };

    // Função para realizar o logout
    window.logout = function() {
        // Remover os dados de usuário do localStorage
        localStorage.removeItem("user");

        // Realizar o logout no Firebase
        firebase.auth().signOut()
            .then(() => {
                // Redireciona para a página inicial após o logout
                console.log("Usuário deslogado com sucesso.");
                window.location.href = "index.html"; // Redireciona para a página inicial
            })
            .catch((error) => {
                console.error("Erro ao fazer logout:", error.message);
                alert("Ocorreu um erro ao tentar fazer logout.");
            });
    };
});