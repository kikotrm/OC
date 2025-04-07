// Espera o conteúdo da página ser carregado
document.addEventListener("DOMContentLoaded", () => {
    const imageButton = document.getElementById("imageButton"); // A imagem que abre o popup
    const popup = document.getElementById("popup"); // O popup de login/register

    // Ao clicar na imagem, alterna a visibilidade do popup
    imageButton.addEventListener("click", () => {
        popup.classList.toggle("show");
    });

    // Função para redirecionar para a página de login
    window.redirectToLogin = function() {
        window.location.href = "login.html";
    };

    // Função para redirecionar para a página de registro
    window.redirectToRegister = function() {
        window.location.href = "register.html";
    };
});