import { combineReducers } from 'redux';
import { pdfReducer } from './modules/pdf';

export const rootReducer = combineReducers({
    pdf: pdfReducer
});

export type RootState = ReturnType<typeof rootReducer>;