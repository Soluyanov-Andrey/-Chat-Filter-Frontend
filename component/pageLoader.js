class PageLoader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.iframe = null; // Инициализируем переменную для iframe
  }

  connectedCallback() {
    this.render();
    this.loadPage();
  }

  loadPage() {
    const pageUrl = this.getAttribute('page-url');
    if (!pageUrl) {
      console.error("Атрибут 'page-url' не указан для PageLoader!");
      this.shadowRoot.innerHTML = '<p>Ошибка: Не указан URL страницы.</p>';
      return;
    }

    this.iframe.src = pageUrl; // Устанавливаем src для iframe
  }


  render() {
    this.shadowRoot.innerHTML = `
      <style>
        iframe {
          width: 100%;
          height: 100%; /* или как вам нужно */
          border: none;
        }
      </style>
      <iframe id="pageFrame"></iframe>
    `;
    this.iframe = this.shadowRoot.getElementById('pageFrame'); // Получаем ссылку на iframe
  }
}

customElements.define('page-loader', PageLoader);