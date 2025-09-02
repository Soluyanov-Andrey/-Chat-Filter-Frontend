class FileList extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.handleClick = this.handleClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.selectedIndex = -1;
    this._dataLoader = null;
    this.singleClickTimeout = null; // Добавлено свойство
  }

  static get observedAttributes() {
    return ['data'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data') {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    this.loadData();
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

  get dataLoader() {
    return this._dataLoader;
  }

  set dataLoader(value) {
    if (typeof value !== 'function') {
      console.error('dataLoader должен быть функцией!');
      return;
    }
    this._dataLoader = value;
    this.loadData();
  }

  async loadData() {
    if (!this._dataLoader) {
      console.warn('FileList: dataLoader не предоставлен. Компонент будет отображать пустой список.');
      this.shadow.innerHTML = `<p>Нет источника данных.</p>`;
      return;
    }

    try {
      this.shadow.innerHTML = `<p>Загрузка данных...</p>`;
      const data = await this._dataLoader();
      this.data = data;
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      this.shadow.innerHTML = `<p>Ошибка загрузки данных: ${error}</p>`;
    }
  }


  handleClick(event) {
    const clickedLi = event.target.closest('li');

  if (clickedLi) {
    // Очищаем таймаут, если он уже установлен (значит, был первый клик)
    if (this.singleClickTimeout) {
      clearTimeout(this.singleClickTimeout);
      this.singleClickTimeout = null;
    }

    // Устанавливаем таймаут, который выполнится, если не произойдет двойной клик
    this.singleClickTimeout = setTimeout(() => {
      console.log('Single click');
      const index = Array.from(clickedLi.parentNode.children).indexOf(clickedLi);

      // Toggle the 'active' class for clicked state
      if (clickedLi.classList.contains('active')) {
        clickedLi.classList.remove('active');
      } else {
          //Remove active class from other elements
          this.shadow.querySelectorAll('li.active').forEach(el => {
            el.classList.remove('active');
          });
        clickedLi.classList.add('active');
      }

      const detail = { index: index };
      this.dispatchEvent(new CustomEvent('item-click', {
        detail: detail ,
        bubbles: true,
        composed: true
      }));
      // Здесь ваш код обработки одиночного клика
      this.singleClickTimeout = null; // Очищаем таймаут
    }, 200); // Время ожидания в миллисекундах (настройте по необходимости)
  }
  }



  handleDoubleClick(event) {
    const clickedLi = event.target.closest('li');

    if (clickedLi) {
      // Очищаем таймаут, чтобы предотвратить срабатывание одиночного клика
      if (this.singleClickTimeout) {
        clearTimeout(this.singleClickTimeout);
        this.singleClickTimeout = null;
      }

      const index = Array.from(clickedLi.parentNode.children).indexOf(clickedLi);

      const detail = { index: index };
      const customEvent = new CustomEvent('item-double-click', {
        detail: detail,
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(customEvent);
    }
  }



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

        ul.block03 li.active {
          background-color: yellow; /* Стиль при клике */
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
            imageUrl = './images/books.png';
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
      li.addEventListener('mouseenter', this.handleMouseEnter);
      li.addEventListener('mouseleave', this.handleMouseLeave);
      li.addEventListener('click', this.handleClick);

    });

  }
}

customElements.define('file-list', FileList);