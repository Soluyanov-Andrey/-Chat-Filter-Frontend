class AppState {
    constructor() {
        this._lastClickedItem = null;
        this._depth = '';
        this._currentPath = "/media/andrey/project/flash/linux/manul";
        this._savecurrentPath = this._currentPath; // Инициализируем savecurrentPath значением currentPath
        this._index = null;
        this._data = null;
        this._item = null;
        this._registeredMethods = {}; // Хранилище для методов
    }

    getAppState() {
        return {
            lastClickedItem: this._lastClickedItem,
            depth: this._depth,
            currentPath: this._currentPath,
            savecurrentPath: this._savecurrentPath,
            index: this._index,
            data: this._data,
            item: this._item
        };
    }

    setAppState(newState) {
        if (newState.lastClickedItem !== undefined) this._lastClickedItem = newState.lastClickedItem;
        if (newState.depth !== undefined) this._depth = newState.depth;
        if (newState.currentPath !== undefined) this._currentPath = newState.currentPath;
        if (newState.savecurrentPath !== undefined) this._savecurrentPath = newState.savecurrentPath;
        if (newState.index !== undefined) this._index = newState.index;
        if (newState.data !== undefined) this._data = newState.data;
        if (newState.item !== undefined) this._item = newState.item;
    }

    resetAppState() {
        this._lastClickedItem = null;
        this._depth = '';
        this._currentPath = "/media/andrey/project/flash/linux/manul";
        this._savecurrentPath = this._currentPath; // Важно сбросить savecurrentPath
        this._index = null;
        this._data = null;
        this._item = null;
    }

    //  

    get lastClickedItem() {
        return this._lastClickedItem;
    }

    set lastClickedItem(value) {
        this._lastClickedItem = value;
    }

    // Далее создаем методы для регестрации методов которые могут быть вызваны из любого обратившегося класса

    // Регистрация метода
    registerMethod(methodName, method, context = null) {
        this._registeredMethods[methodName] = {
            method: method,
            context: context || this
        };
        console.log(`Метод ${methodName} зарегистрирован`);
    }

    // Вызов зарегистрированного метода
    callMethod(methodName, ...args) {
        const methodInfo = this._registeredMethods[methodName];
        if (methodInfo) {
            return methodInfo.method.apply(methodInfo.context, args);
        } else {
            console.warn(`Метод ${methodName} не найден`);
            return null;
        }
    }

    // Проверка существования метода
    hasMethod(methodName) {
        return !!this._registeredMethods[methodName];
    }

    // Удаление метода
    unregisterMethod(methodName) {
        if (this._registeredMethods[methodName]) {
            delete this._registeredMethods[methodName];
            console.log(`Метод ${methodName} удален`);
        }
    }

    // Получение списка всех зарегистрированных методов
    get registeredMethods() {
        return Object.keys(this._registeredMethods);
    }



    // Геттеры и сеттеры для каждого свойства (можно при необходимости добавить)

    // get lastClickedItem() {
    //     return this._lastClickedItem;
    // }

    // set lastClickedItem(value) {
    //     this._lastClickedItem = value;
    // }

   
}

// Экспортируем класс (важно, чтобы можно было его использовать в других модулях)
export default AppState;

// Пример использования:
// import AppState from './app-state';
// const appState = new AppState();
// console.log(appState.getAppState());
// appState.setAppState({ currentPath: '/new/path' });
// console.log(appState.getAppState());
// appState.resetAppState();
// console.log(appState.getAppState());

