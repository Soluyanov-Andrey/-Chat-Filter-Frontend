class FileList extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.handleClick = this.handleClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this); // Биндим handleDoubleClick
    this.selectedIndex = -1;
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

  handleClick(event) {
    const clickedLi = event.target.closest('li');
    if (clickedLi) {
      const newSelectedIndex = Array.from(clickedLi.parentNode.children).indexOf(clickedLi);

      if (newSelectedIndex === this.selectedIndex) {
        this.selectedIndex = -1;
      } else {
        this.selectedIndex = newSelectedIndex;
      }

      this.render();
    }
  }

  handleDoubleClick(event) {
    const clickedLi = event.target.closest('li');
    if (clickedLi) {
      const index = Array.from(clickedLi.parentNode.children).indexOf(clickedLi);
      const item = this.data[index]; // Получаем элемент данных по индексу

      console.log('Двойной клик по элементу:', item);
      // Здесь можно выполнить действия, специфичные для двойного клика,
      // например, открыть папку или файл.

      // Пример: Вызов пользовательского события для обработки двойного клика
      this.dispatchEvent(new CustomEvent('item-double-click', {
        detail: {
          item: item,  // Передаем данные элемента
          index: index  // Передаем индекс элемента
        },
        bubbles: true, // Разрешаем событию всплывать
        composed: true // Разрешаем событию пересекать границу Shadow DOM
      }));
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
              <img src="${imageUrl}" alt=""> ${item.name}
            </li>
          `;
        }).join('')}
      </ul>

    `;

    this.shadow.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', this.handleClick);
      li.addEventListener('dblclick', this.handleDoubleClick); // Добавляем обработчик двойного клика
    });
  }
}

customElements.define('file-list', FileList);

  export { FileList }; 
