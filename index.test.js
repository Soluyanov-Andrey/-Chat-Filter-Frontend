/**
 * @jest-environment jsdom
 */

test('проверка работы Jest', () => {
    expect(1 + 1).toBe(2);
  });
  
  test('DOM элемент существует', () => {
    document.body.innerHTML = `<div>Hello Jest</div>`;
    expect(document.body.textContent).toBe('Hello Jest');
  });
  