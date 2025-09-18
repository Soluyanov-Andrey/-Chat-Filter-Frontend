class DialogForm extends HTMLElement {
 constructor() {
 super(); // Всегда вызывайте super() первым в конструкторе

 // Создаем Shadow DOM для инкапсуляции стилей и структуры
 const shadowRoot = this.attachShadow({ mode: 'open' });

 // Изначально модальное окно скрыто
 this._isVisible = false;

 // Создаем структуру DOM для модального окна
 shadowRoot.innerHTML = `
 <style>
 /* Стили для модального окна */
 .dialog-overlay {
  display: ${this._isVisible ? 'flex' : 'none'}; /* Показывать или скрывать */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Убедимся, что модальное окно поверх всего */
 }

 .dialog-box {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 300px; /* Фиксированная ширина */
 }

 .dialog-box h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
 }

 .dialog-box input[type="text"] {
  width: calc(100% - 20px); /* Ширина с учетом padding */
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
 }

 .dialog-box button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
 }

 .dialog-box button.send-button {
  background-color: #007bff;
  color: white;
 }

 .dialog-box button.send-button:hover:not(:disabled) {
  background-color: #0056b3;
 }

 .dialog-box button.send-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
 }

 .dialog-box button.cancel-button {
  background-color: #6c757d;
  color: white;
  margin-left: 10px;
 }

 .dialog-box button.cancel-button:hover {
  background-color: #5a6268;
 }

 /* Стиль для сообщения об ошибке */
 .error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
  height: 20px; /* Задаем высоту, чтобы избежать смещения элементов */
 }
 </style>

 <div class="dialog-overlay">
  <div class="dialog-box">
  <h3>Введите данные</h3>
  <input type="text" id="dialog-input" placeholder="Введите текст...">
  <div id="error-message" class="error-message"></div>
  <button id="send-btn" class="send-button">Отправить</button>
  <button id="cancel-btn" class="cancel-button">Отмена</button>
  </div>
 </div>
 `;

 // Получаем ссылки на элементы внутри Shadow DOM
 this._dialogOverlay = shadowRoot.querySelector('.dialog-overlay');
 this._dialogInput = shadowRoot.getElementById('dialog-input');
 this._sendButton = shadowRoot.getElementById('send-btn');
 this._cancelButton = shadowRoot.getElementById('cancel-btn');
 this._errorMessage = shadowRoot.getElementById('error-message');

 // Привязываем слушатели событий
 this._sendButton.addEventListener('click', this._handleSend.bind(this));
 this._cancelButton.addEventListener('click', this._handleCancel.bind(this));
 this._dialogInput.addEventListener('input', this._validateInput.bind(this)); // Валидация при вводе
 this._dialogInput.addEventListener('keypress', this._handleKeyPress.bind(this)); // Для отправки по Enter

 // Первоначальная валидация
 this._validateInput();
 }

 // Метод для открытия модального окна
 open() {
 this._isVisible = true;
 this._updateVisibility();
 this._dialogInput.value = ''; // Очищаем поле при каждом открытии
 this._errorMessage.textContent = ''; // Очищаем сообщение об ошибке
 this._dialogInput.focus(); // Фокусируемся на поле ввода
 this._validateInput(); // Сбрасываем состояние кнопки отправки
 }

 // Метод для закрытия модального окна
 close() {
 this._isVisible = false;
 this._updateVisibility();
 }

 // Обновляет стиль отображения overlay
 _updateVisibility() {
 this._dialogOverlay.style.display = this._isVisible ? 'flex' : 'none';
 }

 // Обработчик нажатия на кнопку "Отправить"
 _handleSend() {
 const value = this._dialogInput.value.trim(); // Получаем значение и удаляем пробелы

 if (!value) {
 this._showError('Поле не может быть пустым.');
 return; // Прерываем выполнение, если строка пустая
 }

 // Если значение не пустое, отправляем его
 // Мы можем использовать CustomEvent для уведомления родительского элемента
 // или другого обработчика о том, что данные были отправлены.
 this.dispatchEvent(new CustomEvent('dialog-submit', {
  detail: { value: value } // Передаем отправленное значение
 }));

 this.close(); // Закрываем модальное окно после успешной отправки
 }

 // Обработчик нажатия на кнопку "Отмена"
 _handleCancel() {
 this.close();
 // Можно также отправить событие отмены, если это нужно
 // this.dispatchEvent(new CustomEvent('dialog-cancel'));
 }

 // Обработчик ввода текста для валидации
 _validateInput() {
 const value = this._dialogInput.value.trim();
 this._sendButton.disabled = !value; // Кнопка "Отправить" неактивна, если поле пустое

 if (value) {
 this._errorMessage.textContent = ''; // Скрываем сообщение об ошибке, если есть ввод
 }
 }

 // Обработчик нажатия клавиш (для отправки по Enter)
 _handleKeyPress(event) {
 if (event.key === 'Enter') {
 event.preventDefault(); // Предотвращаем стандартное поведение (например, отправку формы)
 this._handleSend(); // Вызываем наш обработчик отправки
 }
 }

 // Метод для отображения сообщения об ошибке
 _showError(message) {
 this._errorMessage.textContent = message;
 }

 // Метод, который может быть вызван извне для открытия диалога
 // (например, из другого компонента или скрипта)
 show() {
 this.open();
 }
}

// Определяем новый пользовательский элемент
customElements.define('dialog-form', DialogForm);