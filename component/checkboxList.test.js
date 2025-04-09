/**
 * @jest-environment jsdom
 */
import { CheckboxList } from './checkboxList'; // Предполагается, что ваш компонент в этом файле
import '@testing-library/jest-dom'; // для расширенных проверок DOM

describe('CheckboxList Component Tests', () => {
  let checkboxList;

  beforeEach(() => {
    // Создаем экземпляр компонента перед каждым тестом
    checkboxList = document.createElement('checkbox-list');
    document.body.appendChild(checkboxList);
  });

  afterEach(() => {
    // Очищаем DOM после каждого теста
    document.body.innerHTML = '';
  });

  it('should update data attribute and re-render', () => {
    const initialData = ["строка1", "строка2", "еще строка"];
    checkboxList.setAttribute('data', JSON.stringify(initialData));

    const newData = ["новый элемент 1", "новый элемент 2", "новый элемент 3"];
    const newDataString = JSON.stringify(newData);

    checkboxList.setAttribute('data', newDataString);

    // Ждем, пока компонент перерисуется (асинхронность attributeChangedCallback)
    return new Promise(resolve => setTimeout(() => {
      // Проверяем, что количество чекбоксов соответствует новым данным
      const checkboxes = checkboxList.shadowRoot.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes.length).toBe(newData.length);

      // Проверяем, что текст лейблов соответствует новым данным
      checkboxes.forEach((checkbox, index) => {
        const label = checkboxList.shadowRoot.querySelector(`label[for="${checkbox.id}"]`);
        expect(label.textContent).toBe(newData[index]);
      });

      resolve();
    }, 0)); // Задержка 0 мс, чтобы дать время на перерисовку
  });


  // Устанавливает данные в компонент checkboxList, не выбирая ни один из чекбоксов.
  // Ждет, пока компонент перерисуется.
  // Вызывает метод getSelectedIndices() для получения массива индексов выбранных чекбоксов.
  // Проверяет, что массив индексов выбранных чекбоксов пуст, что означает, что ни один из чекбоксов не выбран.
  it('should return an empty array when no checkboxes are selected', () => {
    const initialData = ["строка1", "строка2", "еще строка"];
    checkboxList.setAttribute('data', JSON.stringify(initialData));

     // Ждем, пока компонент перерисуется
     return new Promise(resolve => setTimeout(() => {
       const selectedIndices = checkboxList.getSelectedIndices();
       expect(selectedIndices).toEqual([]);
       resolve();
     }, 0));
  });

  it('should return the correct selected indices', () => {
    const initialData = ["строка1", "строка2", "еще строка", "строка4"];
    checkboxList.setAttribute('data', JSON.stringify(initialData));

    // Ждем, пока компонент перерисуется
    return new Promise(resolve => setTimeout(() => {
      // Получаем все чекбоксы
      const checkboxes = Array.from(checkboxList.shadowRoot.querySelectorAll('input[type="checkbox"]'));

      // Выбираем первый и третий чекбоксы (индексы 0 и 2, значит 1 и 3 в selectedIndices)
      checkboxes[0].checked = true;
      checkboxes[2].checked = true;
      checkboxes[0].dispatchEvent(new Event('change')); // Симулируем событие change
      checkboxes[2].dispatchEvent(new Event('change')); // Симулируем событие change

      const selectedIndices = checkboxList.getSelectedIndices();
      expect(selectedIndices).toEqual([1, 3]);
      resolve();
    }, 0));
  });
});

// Заметки

// const newData = ["новый элемент 1", "новый элемент 2", "новый элемент 3",, "новый элемент 2", "новый элемент 3"];
// const newDataString = JSON.stringify(newData);
// checkboxList.setAttribute('data', newDataString);



// //-------------------------------------------------------------------------------
// // блок вызова событий на кнопках
// //-------------------------------------------------------------------------------

// const scanBtn = document.getElementById("scanBtn");

// function getSelected() {
// const selected = checkboxList.getSelectedIndices();
// console.log("Выбранные элементы:", selected);

// }

// scanBtn.addEventListener("click", getSelected);