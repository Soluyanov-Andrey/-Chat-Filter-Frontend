class CheckboxList extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: 'open' });
      this._data = [];
      this._selectedIndices = []; // Массив для хранения индексов выбранных чекбоксов
      this.handleChange = this.handleChange.bind(this); // Привязка контекста
    }
  
    static get observedAttributes() {
      return ['data'];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'data') {
        try {
          this._data = JSON.parse(newValue);
          this.render();
        } catch (error) {
          console.error('Ошибка при разборе атрибута data:', error);
          this._data = [];
          this.render();
        }
      }
    }
  
    connectedCallback() {
      this.render();
    }
  
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
        checkbox.addEventListener('change', this.handleChange); // Добавляем обработчик события change
        checkbox.dataset.index = index; // Сохраняем индекс элемента
  
        const label = document.createElement('label');
        label.textContent = item;
        label.htmlFor = checkbox.id;
  
        checkboxItem.appendChild(checkbox);
        checkboxItem.appendChild(label);
  
        this.shadow.appendChild(checkboxItem);
      });
    }
  
    handleChange(event) {
      const checkbox = event.target;
      const index = parseInt(checkbox.dataset.index); // Получаем индекс из dataset
      const isChecked = checkbox.checked;
  
      if (isChecked) {
        // Если чекбокс выбран, добавляем индекс в массив
        if (!this._selectedIndices.includes(index + 1)) { //Добавляем +1, чтобы соответствовать требованию нумерации с 1
          this._selectedIndices.push(index + 1);
          this._selectedIndices.sort((a, b) => a - b); // Сортируем массив
        }
      } else {
        // Если чекбокс снят, удаляем индекс из массива
        this._selectedIndices = this._selectedIndices.filter(i => i !== index + 1);
      }
    }
  
    getSelectedIndices() {
      return [...this._selectedIndices]; // Возвращаем копию массива, чтобы предотвратить изменения извне
    }
  }
  
  customElements.define('checkbox-list', CheckboxList);