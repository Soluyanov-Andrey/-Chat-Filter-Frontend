import "./index.scss"
import "./zeroing.scss"

// Импортируем компаненты
import { FileList } from './component/fileList.js'; 
import { MessageModal } from './component/customModal.js'; 
import { CheckboxList } from './component/checkboxList.js'; 
import { PageLoader } from './component/pageLoader.js'; 

import {
  FolderStructureService,
  createFolderApi,
  deleteSelectApi,
  getScanApi, 
  laveSelectApi,
  lookPageApi,
  openDocumentApi,
  openThemesApi,
  createPageApi
} from './serviceApi.js';


import {
  removeLastDirectoryFromPath,
  updateTextInput 
} from './additionalFunctions.js'

import makePanelResizable from './limiterMovement.js'


document.addEventListener('DOMContentLoaded', function() {

  let lastClickedItem = null;  // Внешняя переменная для item
  let depth = ''; // Значение может быть трех типов пустое '','root','themes'

  let currentPath = "/media/andrey/project/flash/linux/manul"; // Объявляем переменную
  let savecurrentPath = currentPath;


  let index;  // Индекс элемента, на котором произошел двойной клик (например: 11).
  let data;   // Массив данных, отображаемых в списке (например: [{name: ' sh скрипты', type: 'folder-'}, {name: '7zip', type: 'folder-'}, {name: 'UFW сетевой экран', type: 'folder-'}]).
  let item;   // Объект данных, соответствующий элементу, на котором произошел двойной клик (например: {name: 'mysql', type: 'folder-'}).

  const fileListElement = document.getElementById('my-file-list');
  const modal = document.getElementById('message-modal');
  const checkboxList = document.getElementById('checkbox-list');


  // function deleteSelect1(){
  //   console.log('jj');
    
  // }

  // lookPageBtn.addEventListener("click", deleteSelect1);



//-------------------------------------------------------------------------------
// блоки кода событий на кнопках
//-------------------------------------------------------------------------------

  //------------------------------------------------------------------------------

   const createPageBtn = document.getElementById('createPageBtn');

   async function createPageBtnFn(){
   

    const result = await createPageApi(currentPath, index);

    

    if (result.message === 'create-page')
      try {
        
      } catch (error) {
        console.error("Ошибка при вызове getSelected в ", error);
      }
      return;
    
      
     
    }

    createPageBtn.addEventListener("click",createPageBtnFn);
  //------------------------------------------------------------------------------



  //-------------------------------------------------------------------------------
    const lookPageBtn = document.getElementById('lookPageBtn');
    

    const rightPanel = document.querySelector('.right-panel'); // Получаем ссылку на right-panel по классу


    let pageLoaderInstance = null; // Объявляем pageLoaderInstance в глобальной области видимости

    async function lookSelected(){
      
      let arraySelect = checkboxList.getSelectedIndices();
      const result = await lookPageApi(arraySelect);
    
      if (result.message === 'Страница из выбранных элементов создана') {
        try {
          checkboxList.classList.toggle('hidden'); //Скрываем компанент classList меняя стиль 
          lookPageBtn.disabled = true; //Скрываем кнопку Смотрим страницы добавляя атрибут  disabled к html <button id="lookPageBtn" disabled>
          deleteSelectBtn.disabled = true;
          laveSelectBtn.disabled = true;


          backBtn.disabled = false; //Отображаем кнопку вернутся назад
    
          pageLoaderInstance = document.createElement('page-loader');
          pageLoaderInstance.setAttribute('page-url', 'http://localhost:3000/LOOK.html'); 
          rightPanel.appendChild(pageLoaderInstance); // Добавляем в right-panel
        } catch (error) {
          console.error("Ошибка при вызове getSelected в ", error);
        }
        return;
      }
    }
    
    lookPageBtn.addEventListener("click",lookSelected);
  //-------------------------------------------------------------------------------


  //-------------------------------------------------------------------------------
    const deleteSelectBtn = document.getElementById('deleteSelectBtn');
    async function deleteSelect(){

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
            // ... Дальнейшая обработка результата ...
          } catch (error) {
            console.error("Ошибка при вызове getSelected:", error);
            // Обработка ошибки
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
    async function laveSelected(){

      let arraySelect = checkboxList.getSelectedIndices();
      
      const result = await laveSelectApi(arraySelect);
      if (result.message === 'Элементы успешно удалены') {

          lookPageBtn.disabled = true; //Скрываем кнопку Смотрим страницы добавляя атрибут  disabled к html <button id="lookPageBtn" disabled>
          deleteSelectBtn.disabled = true;
          laveSelectBtn.disabled = true;
        (async () => {
          try {
            const result = await getSelected();
            
            console.log("в laveSelected() Результат getSelected: ", result);
            // ... Дальнейшая обработка результата ...
          } catch (error) {
            console.error("Ошибка при вызове getSelected в ", error);
            // Обработка ошибки
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

        console.log(receivedData); // Выведет массив receivedData
        // Теперь можно работать с receivedData, например:
        // receivedData.forEach(item => console.log(item)); // Выведет каждый элемент массива
        // const firstItem = receivedData[0]; // Получить первый элемент
        // console.log(firstItem);
      } else {
        console.log("Ошибка: receivedData не найдено или result равно null/undefined.");
      }
      
    }

    scanBtn.addEventListener("click", getSelected);
  //-------------------------------------------------------------------------------

  //-------------------------------------------------------------------------------
    const backBtn = document.getElementById("backBtn");

    function functionhanbackBtn() {

      pageLoaderInstance.remove(); //Удаляем компанент pageLoaderInstance
      checkboxList.classList.toggle('hidden', false);//Показываем classList меняя стиль
      lookPageBtn.disabled = false; //Показываем кнопку Смотрим страницы убирая атрибут  disabled к html <button id="lookPageBtn">
      deleteSelectBtn.disabled = false;
      laveSelectBtn.disabled = false;

      backBtn.disabled = true; //Отображаем кнопку вернутся назад
      
    }

    backBtn.addEventListener("click", functionhanbackBtn);
  //-------------------------------------------------------------------------------


  //-------------------------------------------------------------------------------
    const buttonTopic = document.getElementById("addTopicBtn");

    buttonTopic.disabled = true;

    function buttonFunctionTopic() {

     
    }

    backBtn.addEventListener("click", buttonFunctionTopic);
  //-------------------------------------------------------------------------------

 

  //-------------------------------------------------------------------------------
    const addFolderBtn = document.getElementById("addFolderBtn");

    async function handleAddFolderButtonClick() {

      if (lastClickedItem?.type === 'folder+') {
        
        modal.openModal("В папке уже есть папка document");
        return;
      }

      if (lastClickedItem){
      let path = currentPath+'/'+lastClickedItem.name;
        await createFolderApi(path);
        modal.openModal("Папка создана");
        // Загружаем данные
        try {
          const newData = await FolderStructureService.getFolderStructure(currentPath);  // Используем currentPath
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
      updateTextInput(path,"#input");
      return await FolderStructureService.getFolderStructure(path);
    };
  };

// Инициализация dataLoader (с начальным путем)
fileListElement.dataLoader = createDataLoader(currentPath); // Создаем dataLoader
//-------------------------------------------------------------------------------




//-------------------------------------------------------------------------------
// Обработка обработчиков из зарегестрированных в компанентах
//-------------------------------------------------------------------------------


  //checkboxList событие selected-changed
  //-------------------------------------------------------------------------------
    checkboxList.addEventListener('selected-changed', (event) => {
      
      const shouldDisable = Array.isArray(event.detail) 
      ? event.detail.length === 0
      : true; // отключаем, если это не массив

      lookPageBtn.disabled = shouldDisable;
      deleteSelectBtn.disabled = shouldDisable;
      laveSelectBtn.disabled = shouldDisable;

      const selectedIndices = event.detail; // Теперь detail — это сам массив
      console.log('Выбранные индексы:', selectedIndices);
    });
  //-------------------------------------------------------------------------------


  //fileListElement событие item-click
  //-------------------------------------------------------------------------------
    document.addEventListener('item-click', (event) => {
      const index = event.detail.index; // Получаем индекс из detail
      const data = fileListElement.data; // Получаем данные из компонента
      const item = data[index]; // Получаем элемент данных по индексу

      lastClickedItem = item; // Записываем во внешнюю переменную
      console.log('Кликнули на элемент:', index);
    
    });
  //-------------------------------------------------------------------------------





  //fileListElement событие item-double-click 
  /**-------------------------------------------------------------------------------
   * Обработчик события двойного клика на элементе списка.
   * Определяет тип элемента (папка, "назад" или другой) и выполняет соответствующее действие.
   * @param {Event} event - Объект события двойного клика. Содержит информацию о событии,
   *                        включая индекс элемента, на котором произошел клик.
   */
  document.addEventListener('item-double-click', async (event) => {
     index = event.detail.index; // Индекс элемента, на котором произошел двойной клик (например: 11).
     data = fileListElement.data; // Массив данных, отображаемых в списке (например: [{name: ' sh скрипты', type: 'folder-'}, {name: '7zip', type: 'folder-'}, {name: 'UFW сетевой экран', type: 'folder-'}]).
     item = data[index]; // Объект данных, соответствующий элементу, на котором произошел двойной клик (например: {name: 'mysql', type: 'folder-'}).

    if (!item) {
      console.warn("Двойной клик на несуществующем элементе.");
      return; // Прерываем выполнение, если item не существует.
    }
      console.log('index',index);
      console.log('data',data);
      console.log('item',item);
    switch (true) {

      case presseBackThemes(item):
        
        createPageBtn.disabled = true;

        reactionBackThemes();
        break;

      case pressedOpenThemes(item):
        getSelected();
        reactionOpenThemes(index);
        break;

      // case isSelectRootBack(item):
      //   handleBackButtonClick();  // Выполняем переход назад, если смотрели папку document файл root
      //   break;

      case pressedSelectDocument(item):
        buttonTopic.disabled = false;
        reactionOpenDocument(); // Выполняем чтение document файл root
        break;
      
      case pressedBackNavigationItem(item):
          
        reactionBackNavigation(); // Выполняем переход назад, если это элемент навигации "назад".
        break;

      case  pressedFolder(item):
        await reactionFolderDoubleClick(item); // Обрабатываем двойной клик на папке.
        break;

      default:
        console.log("Двойной клик на элементе, который не является ни папкой, ни кнопкой 'назад'. Ничего не делаем.");
        // Ничего не делаем, если это не папка и не кнопка "назад"
        break;
    }
  });

  
    function presseBackThemes(item) {
      return depth === 'themes' && item.name === '...................';
    }

      // function removeLastPathPart(path) {
      //   // Удаляем слэш в конце пути, если он есть
      //   path = path.endsWith('/') ? path.slice(0, -1) : path;
      //   // Разделяем путь по слэшам и убираем последнюю часть
      //   const parts = path.split('/');
      //   parts.pop();
      //   // Собираем путь обратно
      //   return parts.join('/');
      // }

      async function reactionBackThemes(index) {
        console.log('presseBackThemes(--');
        try {

          // let currentPathTemp = removeLastPathPart(currentPath);
          // console.log('currentPath--',currentPath);
          const newData = await openDocumentApi(currentPath);
          newData.data.unshift({ name: '...................', type: 'folder-' });
          fileListElement.data = newData.data;
          depth = 'root';
          
        } catch (error) {
          console.error('Ошибка при загрузке данных:', error);
        }

        console.log('нажата openBackThemes');
        

      }
    
    
    
    function pressedOpenThemes(item) {
      return depth === 'root' && item.name != '...................';
    }

      async function reactionOpenThemes(index) {
        console.log('pressedOpenThemes--');
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

    function isSelectRootBack(item) {
      return depth === 'root' && item.name === '...................';
    }
     

    function pressedSelectDocument(item) {
      return item && item.name === 'document';
    }

        async function reactionOpenDocument() {
          console.log('pressedSelectDocument--');
          if( depth === ''){
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
     * Проверяет, является ли элемент элементом навигации "назад" ("...........").
     * @param {object} item - Объект, представляющий элемент списка.
     * @returns {boolean} - True, если это элемент "назад", иначе false.
     */
    function pressedBackNavigationItem(item) {
      return item && item.name === '...................';
    }

        /**
         * Обрабатывает нажатие кнопки "назад", осуществляя переход к предыдущей директории.
         *
         * Функция выполняет следующие действия:
         * 1.  Удаляет последнюю директорию из текущего пути (`currentPath`).
         * 2.  Обновляет текстовое поле в UI (`#input`) новым путем.
         * 3.  Загружает структуру папок для нового пути с помощью `FolderStructureService`.
         * 4.  Добавляет элемент "назад" ("...................") в начало списка, если новый путь не совпадает с путем сохранения (`savecurrentPath`).
         * 5.  Обновляет данные в UI-элементе `fileListElement`, отображающем структуру папок.
         * 6.  Обновляет `currentPath` новым путем.
         * 7.  Сбрасывает `lastClickedItem` в `null`.
         *
         * @async
         * @function handleBackButtonClick
         * @throws {Error} Если происходит ошибка при загрузке структуры папок.
         */
          async function reactionBackNavigation(){
            buttonTopic.disabled = true;
            console.log('pressedBackNavigationItem--');
            depth = '';
            let newPath = removeLastDirectoryFromPath(currentPath);
            updateTextInput(newPath,"#input");
              // Загружаем данные
              try {
                const newData = await FolderStructureService.getFolderStructure(newPath);  // Используем currentPath
                if( newPath != savecurrentPath) {
                newData.unshift({ name: '...................', type: 'folder-' });
                
                //тут происходит вставка в элемент fileListElement
              }
               
                fileListElement.data = newData;
                currentPath =  newPath;
                lastClickedItem = null;
                  
              } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
              }
          
          }


    /**
     * Проверяет, является ли элемент папкой.
     * @param {object} item - Объект, представляющий элемент списка.
     * @returns {boolean} - True, если это папка, иначе false.
     */
    function  pressedFolder(item) {
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



//-------------------------------------------------------------------------------



//-------------------------------------------------------------------------------
// Загружаем код для перетаскивания разделительной линии
//-------------------------------------------------------------------------------


  makePanelResizable('.resize-handle', '.left-panel', '.container');

});

//-------------------------------------------------------------------------------




