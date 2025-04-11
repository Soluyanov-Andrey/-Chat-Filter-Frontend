/**
 * @class CheckboxList
 * @classdesc Кастомный веб-компонент, отображающий список чекбоксов, привязанный к данным.
 * Компонент позволяет пользователю выбирать несколько элементов из списка и предоставляет методы для получения выбранных индексов.
 * @extends {HTMLElement}
 */
class CheckboxList extends HTMLElement {
  /**
   * @constructor
   */
  constructor() {
    super();
    /**
     * @private
     * @type {ShadowRoot}
     * @desc Shadow DOM компонента.
     */
    this.shadow = this.attachShadow({ mode: 'open' });
    /**
     * @private
     * @type {string[]}
     * @desc Внутренний массив данных для отображения чекбоксов.
     */
    this._data = [];
    /**
     * @private
     * @type {number[]}
     * @desc Массив для хранения индексов выбранных чекбоксов (индексация с 1).
     */
    this._selectedIndices = [];
    /**
     * @private
     * @method
     * @desc Привязка контекста для обработчика событий `handleChange`.
     */
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * @static
   * @readonly
   * @type {string[]}
   * @desc Список атрибутов, за которыми нужно следить.
   * @returns {string[]}
   */
  static get observedAttributes() {
    return ['data'];
  }

  /**
   * @method
   * @desc Callback, вызываемый при изменении значения атрибута.
   * @param {string} name - Имя измененного атрибута.
   * @param {any} oldValue - Предыдущее значение атрибута.
   * @param {any} newValue - Новое значение атрибута.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data') {
      try {
        this._data = JSON.parse(newValue);
        this._selectedIndices = []; // Сбрасываем массив выбранных индексов
        this.render();
      } catch (error) {
        console.error('Ошибка при разборе атрибута data:', error);
        this._data = [];
        this._selectedIndices = []; // Сбрасываем массив выбранных индексов и при ошибке
        this.render();
      }
    }
  }

  /**
   * @method
   * @desc Callback, вызываемый при добавлении элемента в DOM.
   */
  connectedCallback() {
    this.render();
  }

  /**
   * @private
   * @method
   * @desc Отрисовывает компонент (создает список чекбоксов).
   */
  render() {
    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: sans-serif;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.5em;
        }

        input[type="checkbox"] {
          margin-right: 0.5em;
        }
      </style>
    `;

    if (!Array.isArray(this._data)) {
      console.warn('Атрибут data должен быть массивом строк.');
      return;
    }

    this._data.forEach((item, index) => {
      if (typeof item !== 'string') {
        console.warn('Элементы массива data должны быть строками.');
        return;
      }

      const checkboxItem = document.createElement('div');
      checkboxItem.classList.add('checkbox-item');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `checkbox-${index + 1}`;
      checkbox.value = item;
      checkbox.addEventListener('change', this.handleChange);
      checkbox.dataset.index = index;

      const label = document.createElement('label');
      label.textContent = item;
      label.htmlFor = checkbox.id;

      checkboxItem.appendChild(checkbox);
      checkboxItem.appendChild(label);

      this.shadow.appendChild(checkboxItem);
    });
  }

  /**
   * @private
   * @method
   * @desc Обработчик события `change` для чекбоксов.
   * Обновляет массив `_selectedIndices` в зависимости от состояния чекбокса.
   * @param {Event} event - Объект события.
   */
  handleChange(event) {
    const checkbox = event.target;
    const index = parseInt(checkbox.dataset.index);
    const isChecked = checkbox.checked;

    if (isChecked) {
      if (!this._selectedIndices.includes(index + 1)) {
        this._selectedIndices.push(index + 1);
        this._selectedIndices.sort((a, b) => a - b);
      }
    } else {
      this._selectedIndices = this._selectedIndices.filter(i => i !== index + 1);
    }
  }

  /**
   * @method
   * @desc Возвращает массив индексов выбранных элементов.
   * Индексы начинаются с 1.
   * @returns {number[]} - Копия массива индексов выбранных элементов.
   */
  getSelectedIndices() {
    return [...this._selectedIndices];
  }
  
    /**
   * @method
   * @desc Возвращает массив значений (текста меток) выбранных элементов.
   * @returns {string[]} - Массив значений выбранных элементов.
   */
    getSelectedValues() {
      const selectedValues = [];
      //  Используем this.shadow, чтобы работать внутри Shadow DOM
      const checkboxes = this.shadow.querySelectorAll('input[type="checkbox"]:checked'); // Находим все выбранные чекбоксы

      checkboxes.forEach(checkbox => {
        selectedValues.push(checkbox.value); // Добавляем значение (value) каждого выбранного чекбокса
      });

      return selectedValues;
    }


}

customElements.define('checkbox-list', CheckboxList);