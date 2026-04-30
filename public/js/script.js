const botaoMenu = document.querySelector("[data-menu-abrir]");
const botaoFecharMenu = document.querySelector("[data-menu-fechar]");
const painelMenu = document.querySelector("[data-menu-principal]");
const fundoMenu = document.querySelector("[data-fundo-menu]");
const linksMenu = document.querySelectorAll("[data-link-menu]");
const botoesSaidaRapida = document.querySelectorAll("[data-saida-rapida]");
const seletorContato = document.querySelector("[data-seletor-contato]");
const camposContato = document.querySelector("[data-campos-contato]");
const formularioDenuncia = document.querySelector("[data-formulario-denuncia]");

function definirEstadoMenu(ativo) {
  if (!botaoMenu || !painelMenu || !fundoMenu) {
    return;
  }

  botaoMenu.setAttribute("aria-expanded", String(ativo));
  painelMenu.classList.toggle("menu-ativo", ativo);
  document.body.classList.toggle("menu-aberto", ativo);
  fundoMenu.hidden = !ativo;
}

function atualizarCamposContato() {
  if (!seletorContato || !camposContato) {
    return;
  }

  const exibirContato = seletorContato.value === "1";
  camposContato.hidden = !exibirContato;
}

function validarTiposViolencia() {
  if (!formularioDenuncia) {
    return true;
  }

  const camposTipoViolencia = formularioDenuncia.querySelectorAll("input[name='tipos_violencia']");
  if (!camposTipoViolencia.length) {
    return true;
  }

  const peloMenosUmMarcado = Array.from(camposTipoViolencia).some((campo) => campo.checked);
  const primeiroCampo = camposTipoViolencia[0];

  primeiroCampo.setCustomValidity(
    peloMenosUmMarcado ? "" : "Selecione ao menos um tipo de violência."
  );

  return peloMenosUmMarcado;
}

if (botaoMenu && painelMenu && fundoMenu) {
  botaoMenu.addEventListener("click", () => {
    const menuAberto = botaoMenu.getAttribute("aria-expanded") === "true";
    definirEstadoMenu(!menuAberto);
  });

  if (botaoFecharMenu) {
    botaoFecharMenu.addEventListener("click", () => definirEstadoMenu(false));
  }

  fundoMenu.addEventListener("click", () => definirEstadoMenu(false));

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      definirEstadoMenu(false);
    }
  });

  linksMenu.forEach((link) => {
    link.addEventListener("click", () => definirEstadoMenu(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      definirEstadoMenu(false);
    }
  });
}

botoesSaidaRapida.forEach((botao) => {
  botao.addEventListener("click", (evento) => {
    evento.preventDefault();
    window.location.replace("https://www.google.com");
  });
});

if (seletorContato) {
  atualizarCamposContato();
  seletorContato.addEventListener("change", atualizarCamposContato);
}

if (formularioDenuncia) {
  const camposTipoViolencia = formularioDenuncia.querySelectorAll("input[name='tipos_violencia']");

  camposTipoViolencia.forEach((campo) => {
    campo.addEventListener("change", validarTiposViolencia);
  });

  formularioDenuncia.addEventListener("submit", (evento) => {
    if (!validarTiposViolencia()) {
      evento.preventDefault();
      formularioDenuncia.reportValidity();
    }
  });
}
