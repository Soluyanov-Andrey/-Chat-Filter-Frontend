class FileList extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.handleClick = this.handleClick.bind(this); // Привязываем контекст
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.selectedIndex = -1;
    this._dataLoader = null;
  }

  static get observedAttributes() {
    return ['data']; // data - отслеживаемый атрибут, как и раньше
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data') {
      this.render();
    }
  }

  connectedCallback() {
    this.render(); // Рендерим даже без данных
    this.loadData(); // Загружаем данные
  }

  get data() {
    try {
      return JSON.parse(this.getAttribute('data') || '[]');
    } catch (e) {
      console.error("Не удалось распарсить JSON:", e);
      return [];
    }
  }

  set data(value) {
    this.setAttribute('data', JSON.stringify(value));
  }

  // Геттер и сеттер для dataLoader
  get dataLoader() {
    return this._dataLoader;
  }

  set dataLoader(value) {
    if (typeof value !== 'function') {
      console.error('dataLoader должен быть функцией!');
      return;
    }
    this._dataLoader = value;
    this.loadData(); // Автоматически загружаем данные при установке dataLoader
  }

  // Функция для загрузки данных
  async loadData() {
    if (!this._dataLoader) {
      console.warn('FileList: dataLoader не предоставлен. Компонент будет отображать пустой список.');
      this.shadow.innerHTML = `<p>Нет источника данных.</p>`;
      return;
    }

    try {
      this.shadow.innerHTML = `<p>Загрузка данных...</p>`; // Сообщение о загрузке
      const data = await this._dataLoader(); // Используем приватное свойство _dataLoader
      this.data = data; // Устанавливаем данные
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      this.shadow.innerHTML = `<p>Ошибка загрузки данных: ${error}</p>`;
    }
  }

  handleClick(event) {
    const hoveredLi = event.target.closest('li');
    if (hoveredLi) {
      // Получаем индекс наведенного элемента
      const index = Array.from(hoveredLi.parentNode.children).indexOf(hoveredLi);

      // Добавляем класс "hovered"
      hoveredLi.classList.add('hovered');
    }
    
  }
  handleDoubleClick(event) {
    const clickedLi = event.target.closest('li');
    if (clickedLi) {
      const index = Array.from(clickedLi.parentNode.children).indexOf(clickedLi); // Получаем индекс

      // Получаем данные из атрибута data-index
      //const index = parseInt(clickedLi.dataset.index);

      const detail = { index: index }; // Создаем объект detail с индексом
     // Через регестрацию собственых событий и их вызова вы передаем события и его результат во вне
     //1 Создание объекта события (creating the event object)
      const customEvent = new CustomEvent('item-double-click', {
        detail: detail, // Отправляем объект detail
        bubbles: true,
        composed: true
      })
     // 2. Отправка события (dispatching the event)
      this.dispatchEvent(customEvent);
    }
  }

 // Использовать mouseenter и mouseleave, чтобы избежать проблем с вложенными элементами
 handleMouseEnter(event) {
  const hoveredLi = event.target.closest('li');
  if (hoveredLi) {
    hoveredLi.classList.add('selected');
  }
}

handleMouseLeave(event) {
  const hoveredLi = event.target.closest('li');
  if (hoveredLi) {
    hoveredLi.classList.remove('selected');
  }
}


  render() {
    const data = this.data;
    this.shadow.innerHTML = `
      <style>
        ul.block03 {
          list-style-type: none;
          padding: 0;
        }

        ul.block03 li {
          padding: 5px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          user-select: none;
        }

        ul.block03 li:last-child {
          border-bottom: none;
        }

        ul.block03 li img {
          width: 20px;
          height: 20px;
          margin-right: 5px;
          vertical-align: middle;
        }

        ul.block03 li.selected {
          background-color: #def;
        }
      </style>
      <ul class="block03">
        ${data.map((item, index) => {
          let imageUrl = '';
          let altText = '';

          if (item.type.startsWith('folder-')) {
            imageUrl = './images/minus.png';
            altText = 'Папка';
          } else if (item.type.startsWith('folder+')) {
            imageUrl = './images/check-mark.jpg';
            altText = 'Папка';
          } else {
            imageUrl = './images/file.png';
            altText = 'Файл';
          }

          const isSelected = index === this.selectedIndex;

          return `
            <li class="${isSelected ? 'selected' : ''}" data-index="${index}">
              <img src="${imageUrl}" alt="${altText}"> ${item.name}
            </li>
          `;
        }).join('')}
      </ul>
    `;


    this.shadow.querySelectorAll('li').forEach(li => {
      
      li.addEventListener('dblclick', this.handleDoubleClick);
      li.addEventListener('mouseenter', this.handleMouseEnter); // Изменено
      li.addEventListener('mouseleave', this.handleMouseLeave); // Изменено
    });

  }
}

customElements.define('file-list', FileList);