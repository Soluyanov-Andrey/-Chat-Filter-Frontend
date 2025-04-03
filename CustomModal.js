class MessageModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.message = this.getAttribute('message') || 'Сообщение не задано';
    this.okButtonText = this.getAttribute('ok-button-text') || 'OK';

    this.isOpen = false;

    this.render();
  }

  static get observedAttributes() {
    return ['message', 'ok-button-text'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'message' && oldValue !== newValue) {
      this.message = newValue;
    }
    if (name === 'ok-button-text' && oldValue !== newValue) {
      this.okButtonText = newValue;
    }
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: ${this.isOpen ? 'flex' : 'none'}; /* Управляем видимостью через flex */
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal {
          background-color: white;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
          width: 80%;
          max-width: 500px;
        }

        .modal-message {
          margin-bottom: 15px;
        }

        .modal-buttons {
          text-align: right;
        }

        .modal-button {
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .modal-button:hover {
          background-color: #3e8e41;
        }
      </style>

      <div class="modal-overlay">
        <div class="modal">
          <div class="modal-message">${this.message}</div>
          <div class="modal-buttons">
            <button class="modal-button">${this.okButtonText}</button>
          </div>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.modal-button').addEventListener('click', () => {
      this.closeModal(); // Просто закрываем окно по кнопке OK
      this.dispatchEvent(new CustomEvent('modal-closed', {bubbles: true, composed: true})); // Отправляем событие о закрытии
    });

    this.shadowRoot.querySelector('.modal-overlay').addEventListener('click', (event) => {
      if (event.target === this.shadowRoot.querySelector('.modal-overlay')) {
        this.closeModal();
        this.dispatchEvent(new CustomEvent('modal-closed', {bubbles: true, composed: true})); // Отправляем событие о закрытии
      }
    });
  }

  openModal(message = null) { // Добавили возможность динамически менять сообщение при открытии
    if (message) {
      this.message = message;
      this.setAttribute('message', message); // Обновляем атрибут, чтобы future updates работали
    }
    this.isOpen = true;
    this.render();
  }

  closeModal() {
    this.isOpen = false;
    this.render();
  }
}

customElements.define('message-modal', MessageModal);