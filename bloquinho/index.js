let pipWindow = null;
const uniqueIdTitulo = "autosave_titulo";
const uniqueIdTexto = "autosave_texto";
const autosaveDelay = 1000; // 1 segundo
let autosaveLoaded = false;

async function enterPiP() {
	const conteiner = document.querySelector("#conteiner");
	const pipOptions = {
		width: conteiner.clientWidth,
		height: conteiner.clientHeight
	};

	pipWindow = await documentPictureInPicture.requestWindow(pipOptions);

	// Move o conteúdo para a janela PiP
	pipWindow.document.body.appendChild(conteiner);

	// Adiciona estilos básicos
	const style = pipWindow.document.createElement("style");
	style.textContent = `
		html, body {
    		height: 100%;
			width: 100%;
    		margin: 0;
			overflow: hidden;
		}
		body {
			background-color: #222233;
			color: #ddddff;
			font-family: Consolas, monospace;
			padding: 10px;
			display: flex;
			justify-content: center;
    		align-items: center;
		}		
		textarea {
			flex: 1;
			width: 80vw;
    		height: 80vh;
			font-size: 16px;
			background-color: #333344;
			color: #ddddff;
			border: none;
			border-radius: 5px;
			resize: none;
    		box-sizing: border-box;
		}		
	`;
	pipWindow.document.head.appendChild(style);

	// Foco automático no textarea
	requestAnimationFrame(() => {
		const pipBloquinho = pipWindow.document.querySelector("#bloquinho");
		if (pipBloquinho) pipBloquinho.focus();
	});

	// Reposiciona o container ao fechar a janela PiP
	pipWindow.addEventListener("pagehide", () => {
		const main = document.querySelector("#main");
		if (conteiner && main) main.appendChild(conteiner);
	}, { once: true });
}

function baixar() {
	const texto = document.getElementById("bloquinho").value;
	const titulo = document.getElementById("titulo").value;

	const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
	saveAs(blob, titulo + ".txt");
}

// 🔄 Autosave contínuo no estilo SimpleMDE
function iniciarAutosave() {
	const titulo = document.getElementById("titulo");
	const bloquinho = document.getElementById("bloquinho");

	if (!autosaveLoaded) {
		const tituloSalvo = localStorage.getItem(uniqueIdTitulo);
		const textoSalvo = localStorage.getItem(uniqueIdTexto);

		if (tituloSalvo) titulo.value = tituloSalvo;
		if (textoSalvo) bloquinho.value = textoSalvo;

		autosaveLoaded = true;
	}

	function salvar() {
		localStorage.setItem(uniqueIdTitulo, titulo.value);
		localStorage.setItem(uniqueIdTexto, bloquinho.value);
		setTimeout(salvar, autosaveDelay);
	}

	salvar();
}

window.addEventListener("DOMContentLoaded", iniciarAutosave);
