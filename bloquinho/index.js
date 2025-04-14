let pipWindow = null;

async function enterPiP() {
	const conteiner = document.querySelector("#conteiner");
	const pipOptions = {
		width: conteiner.clientWidth,
		height: conteiner.clientHeight
	};

	pipWindow = await documentPictureInPicture.requestWindow(pipOptions);

	// Move o conteúdo para a janela PiP
	pipWindow.document.body.appendChild(conteiner);

	// Adiciona estilos básicos para manter aparência
	const style = pipWindow.document.createElement("style");
	style.textContent = `
		body {
			background-color: #222233;
			color: #ddddff;
			font-family: Consolas, monospace;
			padding: 10px;
		}
		h1 {
			margin-bottom: 10px;
		}
		textarea {
			width: 80%;
			height: 300px;
			font-size: 16px;
			padding: 10px;
			background-color: #333344;
			color: #ddddff;
			border: none;
			border-radius: 5px;
			resize: both;
		}
		button {
			margin-top: 10px;
			padding: 5px 10px;
			background-color: #b2b2ff;
			color: #222233;
			border: none;
			border-radius: 5px;
			cursor: pointer;
		}
	`;
	pipWindow.document.head.appendChild(style);

	// Botão opcional: aumentar a janela
	const expandButton = pipWindow.document.createElement("button");
	expandButton.textContent = "Expandir PiP";
	expandButton.onclick = () => pipWindow.resizeBy(100, 100);
	pipWindow.document.body.appendChild(expandButton);

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
