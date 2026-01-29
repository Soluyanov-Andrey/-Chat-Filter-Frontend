import "./index.scss"
import "./zeroing.scss"

// Импортируем компоненты
import { FileList } from './component/fileList.js'; 
import { MessageModal } from './component/customModal.js'; 
import { CheckboxList } from './component/checkboxList.js'; 
import { PageLoader } from './component/pageLoader.js'; 
import { DialogForm } from './component/dialogForm.js'; 

import {
  FolderStructureService,
  createFolderApi,
  deleteSelectApi,
  getScanApi, 
  laveSelectApi,
  lookPageApi,
  openDocumentApi,
  openThemesApi,
  createPageApi,
  createTopicApi
} from './serviceApi.js';


import {
  removeLastDirectoryFromPath,
  updateTextInput 
} from './additionalFunctions.js'

import makePanelResizable from './limiterMovement.js'


document.addEventListener('DOMContentLoaded', function() {

  let lastClickedItem = null;  // Внешняя переменная для item
  let depth = ''; // Значение может быть трех типов: пустое ('', 'root', 'themes')

  let currentPath = "/media/andrey/backap/flash"; // Объявляем переменную
  let savecurrentPath = currentPath;

  let index;  // Индекс элемента, на котором произошел двойной клик
  let data;   // Массив данных, отображаемых в списке
  let item;   // Объект данных, соответствующий элементу, на котором произошел двойной клик

  const fileListElement = document.getElementById('my-file-list');
  const modal = document.getElementById('message-modal');
  const checkboxList = document.getElementById('checkbox-list');

  //-------------------------------------------------------------------------------
  // Блоки кода событий на кнопках
  //-------------------------------------------------------------------------------

  //------------------------------------------------------------------------------
  const createPageBtn = document.getElementById('createPageBtn');

  async function createPageBtnFn() {
    const result = await createPageApi(currentPath, index);

    if (result.message === 'create-page') {
      try {
        updateFileList();
      } catch (error) {
        console.error("Ошибка при вызове getSelected: ", error);
      }
      return;
    }
  }

  createPageBtn.addEventListener("click", createPageBtnFn);
  //------------------------------------------------------------------------------

  //-------------------------------------------------------------------------------
  const lookPageBtn = document.getElementById('lookPageBtn');
  const rightPanel = document.querySelector('.right-panel'); // Получаем ссылку на right-panel по классу

  let pageLoaderInstance = null; // Объявляем pageLoaderInstance в глобальной области видимости

  async function lookSelected() {
    let arraySelect = checkboxList.getSelectedIndices();
    const result = await lookPageApi(arraySelect);

    if (result.message === 'Страница из выбранных элементов создана') {
      try {
        checkboxList.classList.toggle('hidden'); // Скрываем компонент, меняя стиль 
        lookPageBtn.disabled = true; // Скрываем кнопку "Смотрим страницы", добавляя атрибут disabled
        deleteSelectBtn.disabled = true;
        laveSelectBtn.disabled = true;

        backBtn.disabled = false; // Отображаем кнопку "Вернуться назад"

        pageLoaderInstance = document.createElement('page-loader');
        pageLoaderInstance.setAttribute('page-url', 'http://localhost:3000/LOOK.html'); 
        rightPanel.appendChild(pageLoaderInstance); // Добавляем в right-panel
      } catch (error) {
        console.error("Ошибка при вызове getSelected: ", error);
      }
      return;
    }
  }

  lookPageBtn.addEventListener("click", lookSelected);
  //-------------------------------------------------------------------------------

  //-------------------------------------------------------------------------------
  const deleteSelectBtn = document.getElementById('deleteSelectBtn');
  
  async function deleteSelect() {
    let arraySelect = checkboxList.getSelectedIndices();
    const result = await deleteSelectApi(arraySelect);

    if (result.message === 'Элементы успешно удалены') {
      lookPageBtn.disabled = true;
      deleteSelectBtn.disabled = true;
      laveSelectBtn.disabled = true;
      
      (async () => {
        try {
          const result = await getSelected();
          console.log("Результат getSelected:", result);
        } catch (error) {
          console.error("Ошибка при вызове getSelected:", error);
        }
      })();
      
      modal.openModal(result.message);
      return;
    }
  }
  
  deleteSelectBtn.addEventListener("click", deleteSelect);
  //-------------------------------------------------------------------------------

  //-------------------------------------------------------------------------------
  const laveSelectBtn = document.getElementById('leaveSelectBtn');
  
  async function laveSelected() {
    let arraySelect = checkboxList.getSelectedIndices();
    const result = await laveSelectApi(arraySelect);
    
    if (result.message === 'Элементы успешно удалены') {
      lookPageBtn.disabled = true;
      deleteSelectBtn.disabled = true;
      laveSelectBtn.disabled = true;
      
      (async () => {
        try {
          const result = await getSelected();
          console.log("В laveSelected() Результат getSelected: ", result);
        } catch (error) {
          console.error("Ошибка при вызове getSelected: ", error);
        }
      })();
      
      modal.openModal(result.message);
      return;
    }
  }
  
  laveSelectBtn.addEventListener("click", laveSelected);
  //-------------------------------------------------------------------------------

  //-------------------------------------------------------------------------------
  const scanBtn = document.getElementById("scanBtn");

  async function getSelected() {
    const result = await getScanApi();

    if (result && result.data) {
      const receivedData = result.data;
      const newDataString = JSON.stringify(receivedData);
      checkboxList.setAttribute('data', newDataString);

      console.log(receivedData);
    } else {
      console.log("Ошибка: receivedData не найдено или result равно null/undefined.");
    }
  }

  scanBtn.addEventListener("click", getSelected);
  //-------------------------------------------------------------------------------

  //-------------------------------------------------------------------------------
  const backBtn = document.getElementById("backBtn");

  function handleBackBtn() {
    if (pageLoaderInstance) {
      pageLoaderInstance.remove(); // Удаляем компонент pageLoaderInstance
    }
    
    checkboxList.classList.toggle('hidden', false); // Показываем компонент, меняя стиль
    lookPageBtn.disabled = false; // Показываем кнопку "Смотрим страницы", убирая атрибут disabled
    deleteSelectBtn.disabled = false;
    laveSelectBtn.disabled = false;

    backBtn.disabled = true; // Скрываем кнопку "Вернуться назад"
  }

  backBtn.addEventListener("click", handleBackBtn);
  //-------------------------------------------------------------------------------

  //-------------------------------------------------------------------------------
  const buttonTopic = document.getElementById("addTopicBtn");
  const dialog = document.getElementById('myDialog');

  buttonTopic.disabled = true;

  // Добавляем слушатель на кнопку, которая открывает диалог
  buttonTopic.addEventListener('click', () => {
    dialog.show(); // Вызываем метод show() нашего компонента
  });

  // Слушаем кастомное событие 'dialog-submit', которое отправляет компонент
  dialog.addEventListener('dialog-submit', async (event) => {
    try {
      const submittedValue = event.detail.value;
      console.log('Получено отправленное значение:', submittedValue);

      const data = await createTopicApi(currentPath, submittedValue);

      // Обработка полученных данных
      console.log('Данные получены:', data);

      // Дальнейшая логика обработки data
      if (data.message) {
        console.log('Данные получены1:', data);
        updateFileList();
      } else {
        // Обработка ошибок
        showError(data.message);
      }
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      showError('Произошла ошибка при создании темы');
    }
  });
  //-------------------------------------------------------------------------------

  //-------------------------------------------------------------------------------
  const addFolderBtn = document.getElementById("addFolderBtn");

  async function handleAddFolderButtonClick() {
    if (lastClickedItem?.type === 'folder+') {
      modal.openModal("В папке уже есть папка document");
      return;
    }

    if (lastClickedItem) {
      let path = currentPath + '/' + lastClickedItem.name;
      await createFolderApi(path);
      modal.openModal("Папка создана");
      
      // Загружаем данные
      try {
        const newData = await FolderStructureService.getFolderStructure(currentPath);
        fileListElement.data = newData;
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    }
  }

  addFolderBtn.addEventListener("click", handleAddFolderButtonClick);
  //-------------------------------------------------------------------------------

  //-------------------------------------------------------------------------------
  // Блок вызова fileListElement.dataLoader
  //-------------------------------------------------------------------------------

  const createDataLoader = (path) => {
    return async () => {
      updateTextInput(path, "#input");
      return await FolderStructureService.getFolderStructure(path);
    };
  };

  // Инициализация dataLoader (с начальным путем)
  fileListElement.dataLoader = createDataLoader(currentPath);
  //-------------------------------------------------------------------------------

  //-------------------------------------------------------------------------------
  // Обработка обработчиков из зарегистрированных в компонентах
  //-------------------------------------------------------------------------------

  // checkboxList событие selected-changed
  //-------------------------------------------------------------------------------
  checkboxList.addEventListener('selected-changed', (event) => {
    const shouldDisable = Array.isArray(event.detail) 
      ? event.detail.length === 0
      : true; // Отключаем, если это не массив

    lookPageBtn.disabled = shouldDisable;
    deleteSelectBtn.disabled = shouldDisable;
    laveSelectBtn.disabled = shouldDisable;

    const selectedIndices = event.detail; // Теперь detail — это сам массив
    console.log('Выбранные индексы:', selectedIndices);
  });
  //-------------------------------------------------------------------------------

  // fileListElement событие item-click
  //-------------------------------------------------------------------------------
  document.addEventListener('item-click', (event) => {
    const index = event.detail.index; // Получаем индекс из detail
    const data = fileListElement.data; // Получаем данные из компонента
    const item = data[index]; // Получаем элемент данных по индексу

    lastClickedItem = item; // Записываем во внешнюю переменную
    console.log('Кликнули на элемент:', index);
  });
  //-------------------------------------------------------------------------------

  // fileListElement событие item-double-click 
  /**
   * Обработчик события двойного клика на элементе списка.
   * Определяет тип элемента (папка, "назад" или другой) и выполняет соответствующее действие.
   * @param {Event} event - Объект события двойного клика. Содержит информацию о событии,
   *                        включая индекс элемента, на котором произошел клик.
   */
  document.addEventListener('item-double-click', async (event) => {
    index = event.detail.index; // Индекс элемента, на котором произошел двойной клик
    data = fileListElement.data; // Массив данных, отображаемых в списке
    item = data[index]; // Объект данных, соответствующий элементу

    if (!item) {
      console.warn("Двойной клик на несуществующем элементе.");
      return; // Прерываем выполнение, если item не существует
    }

    console.log('index', index);
    console.log('data', data);
    console.log('item', item);

    switch (true) {
      case isPressBackThemes(item):
        reactionBackThemes();
        break;

      case isPressedOpenThemes(item):
        await getSelected();
        reactionOpenThemes(index);
        break;

      case isPressedSelectDocument(item):
        reactionOpenDocument();
        break;

      case isPressedBackNavigationItem(item):
        reactionBackNavigation();
        break;

      case isPressedFolder(item):
        await reactionFolderDoubleClick(item);
        break;

      default:
        console.log("Двойной клик на элементе, который не является ни папкой, ни кнопкой 'назад'. Ничего не делаем.");
        break;
    }
  });

  function isPressBackThemes(item) {
    return depth === 'themes' && item.name === '...................';
  }

  async function reactionBackThemes() {
    buttonTopic.disabled = false;
    createPageBtn.disabled = true;
    console.log('pressBackThemes(--');
    
    try {
      const newData = await openDocumentApi(currentPath);
      newData.data.unshift({ name: '...................', type: 'folder-' });
      fileListElement.data = newData.data;
      depth = 'root';
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }

    console.log('нажата openBackThemes');
  }

  function isPressedOpenThemes(item) {
    return depth === 'root' && item.name !== '...................';
  }

  async function reactionOpenThemes(index) {
    console.log('pressedOpenThemes--');
    buttonTopic.disabled = true;
    
    try {
      depth = 'themes';
      createPageBtn.disabled = false;
      const newData = await openThemesApi(currentPath, index);
      newData.data.unshift({ name: '...................', type: 'folder-' });
      fileListElement.data = newData.data;
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  }

  function isPressedSelectDocument(item) {
    return item && item.name === 'document';
  }

  async function reactionOpenDocument() {
    console.log('pressedSelectDocument--');
    buttonTopic.disabled = false;
    
    if (depth === '') {
      depth = 'root';
      currentPath = currentPath + '/document';
      
      try {
        const newData = await openDocumentApi(currentPath);
        newData.data.unshift({ name: '...................', type: 'folder-' });
        fileListElement.data = newData.data;
        updateTextInput(currentPath, "#input");
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    }
  }

  /**
   * Проверяет, является ли элемент элементом навигации "назад" ("...................").
   * @param {object} item - Объект, представляющий элемент списка.
   * @returns {boolean} - true, если это элемент "назад", иначе false.
   */
  function isPressedBackNavigationItem(item) {
    return item && item.name === '...................';
  }

  /**
   * Обрабатывает нажатие кнопки "назад", осуществляя переход к предыдущей директории.
   * @async
   */
  async function reactionBackNavigation() {
    buttonTopic.disabled = true;
    console.log('pressedBackNavigationItem--');
    depth = '';
    
    let newPath = removeLastDirectoryFromPath(currentPath);
    updateTextInput(newPath, "#input");
    
    // Загружаем данные
    try {
      const newData = await FolderStructureService.getFolderStructure(newPath);
      
      if (newPath !== savecurrentPath) {
        newData.unshift({ name: '...................', type: 'folder-' });
      }
      
      fileListElement.data = newData;
      currentPath = newPath;
      lastClickedItem = null;
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  }

  /**
   * Проверяет, является ли элемент папкой.
   * @param {object} item - Объект, представляющий элемент списка.
   * @returns {boolean} - true, если это папка, иначе false.
   */
  function isPressedFolder(item) {
    const isActuallyAFolder = item.type && item.type.startsWith('folder') && item.name;
    console.log(!!isActuallyAFolder);
    return !!isActuallyAFolder;
  }

  /**
   * Обрабатывает двойной клик на папке.
   * @param {object} item - Объект, представляющий папку.
   */
  async function reactionFolderDoubleClick(item) {
    console.log('pressedFolder--');
    const folderName = item.name;
    const newPath = constructNewPath(currentPath, folderName);

    currentPath = newPath; // Обновляем текущий путь
    updateTextInput(newPath, "#input");
    fileListElement.dataLoader = createDataLoader(currentPath);

    try {
      const newData = await FolderStructureService.getFolderStructure(currentPath);
      newData.unshift({ name: '...................', type: 'folder-' });
      fileListElement.data = newData;
      lastClickedItem = null;
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  }

  /**
   * Конструирует новый путь на основе текущего пути и имени папки.
   * @param {string} currentPath - Текущий путь.
   * @param {string} folderName - Имя папки.
   * @returns {string} - Новый путь.
   */
  function constructNewPath(currentPath, folderName) {
    let newPath = currentPath;
    if (!currentPath.endsWith('/')) {
      newPath += '/';
    }
    newPath += folderName;
    return newPath;
  }

  async function updateFileList() {
    console.log('updateFileList');
    
    try {
      console.log('currentPath', currentPath);
      const newData = await openDocumentApi(currentPath);
      console.log('newData.data', newData.data);

      newData.data.unshift({ name: '...................', type: 'folder-' });
      fileListElement.data = newData.data;
      depth = 'root';
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }

    console.log('вызвана openBackThemes');
  }

  //-------------------------------------------------------------------------------
  // Загружаем код для перетаскивания разделительной линии
  //-------------------------------------------------------------------------------
  makePanelResizable('.resize-handle', '.left-panel', '.container');

  // Вспомогательная функция для отображения ошибок (добавлена, так как используется в коде)
  function showError(message) {
    console.error('Ошибка:', message);
    // Здесь можно добавить логику отображения ошибки пользователю
  }
});-




