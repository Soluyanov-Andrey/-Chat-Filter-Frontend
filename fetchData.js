/**
 * @file api-utils.js
 * @module api-utils
 * @description  Содержит утилиты для работы с API, включая функции для выполнения GET и POST запросов.
 */

/**
 * @async
 * @function fetchData
 * @description  Выполняет GET-запрос по указанному URL и возвращает данные в формате JSON.
 * @param {string} url - URL, по которому нужно отправить GET-запрос.
 * @returns {Promise<any>} - Promise, который разрешается с данными в формате JSON, или отклоняется с ошибкой.
 * @throws {Error} - Если происходит ошибка при выполнении запроса или если сервер возвращает ошибку.
 */
async function gethData(url) {
    try {

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Можно опустить для GET запросов
        },
      });


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
      throw error; // Перебрасываем ошибку, чтобы ее можно было обработать выше
    }
  }
  
  /**
   * @async
   * @function postData
   * @description  Выполняет POST-запрос по указанному URL с предоставленными данными в формате JSON.
   * @param {string} url - URL, по которому нужно отправить POST-запрос.
   * @param {object} data - Объект с данными, которые нужно отправить в теле запроса в формате JSON.
   * @returns {Promise<any>} - Promise, который разрешается с данными в формате JSON, полученными от сервера, или отклоняется с ошибкой.
   * @throws {Error} - Если происходит ошибка при выполнении запроса или если сервер возвращает ошибку.
   */
async function postData(url, data) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      throw error; // Перебрасываем ошибку, чтобы ее можно было обработать выше
    }
  }
  
  export { gethData, postData }; // Экспортируем функции списком в конце файла