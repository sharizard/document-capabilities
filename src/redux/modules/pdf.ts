import { Dispatch, AnyAction } from "redux";

export function typedAction<T extends string>(type: T): { type: T };
export function typedAction<T extends string, P extends any>(
  type: T,
  payload: P
): { type: T; payload: P };
export function typedAction(type: string, payload?: any) {
  return { type, payload };
}

enum PDF_ACTION {
    FETCH = 'pdf/FETCH',
    RESET = 'pdf/RESET'
};

type PdfState = {
    content: string | null;
}

const initialState: PdfState = { content: null };

const fetchPdf = (content: string) => (
    typedAction(PDF_ACTION.FETCH, content)
);

const reset = () => (
    typedAction(PDF_ACTION.RESET)
);

type PdfAction = ReturnType<typeof fetchPdf | typeof reset>;

export function pdfReducer(
    state = initialState,
    action: PdfAction
): PdfState {
    switch (action.type) {
        case PDF_ACTION.FETCH:
            return { content: action.payload };
        case PDF_ACTION.RESET:
            return { content: null };
        default:
            return state;
    }
}

export const fetchPdfFromBackend = (fullname: string, address: string, postalinfo: string) => {
    return async (dispatch: Dispatch<AnyAction>) => {
        const response = await fetch('api/pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullname,
                address,
                postalinfo
            })
        });
        const data = await response.json();
        return dispatch(fetchPdf(data.content));
    }
}