import { applyMiddleware, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducers from './combineReducers';
import logger from 'redux-logger';

const persistConfig = {
    key: 'root',
    storage,
}

export const persistedReducer = persistReducer(persistConfig, reducers);

export default () => {
    let store = createStore(persistedReducer, applyMiddleware(logger));
    let persistor = persistStore(store);
    return { store, persistor };
}