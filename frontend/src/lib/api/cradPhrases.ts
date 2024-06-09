import client from 'lib/api/client';
import Cookies from 'js-cookie';
import { Phrase } from 'interfaces';

export const viewAllPhrases = (id:number, page:number) => {
    return client.get(`phrases/${id}`, {
        params: {
            page: page,
        },
        headers: {
            'access-token': Cookies.get('_access_token'),
            'client': Cookies.get('_client'),
            'uid': Cookies.get('_uid')
        }
    });
};

export const createNewPhrases = (phrase:Phrase) => {
    return client.post(`phrases`, phrase, {
        headers: {
            'access-token': Cookies.get('_access_token'),
            'client': Cookies.get('_client'),
            'uid': Cookies.get('_uid')
        }
    });
};

export const updatePhrases = (phrase:Phrase) => {
    return client.post(`phrases/${phrase.id}`, phrase, {
        headers: {
            'access-token': Cookies.get('_access_token'),
            'client': Cookies.get('_client'),
            'uid': Cookies.get('_uid')
        }
    });
};

export const destoyPhrases = (id:number) => {
    return client.delete(`phrases/${id}`, {
        headers: {
            'access-token': Cookies.get('_access_token'),
            'client': Cookies.get('_client'),
            'uid': Cookies.get('_uid')
        }
    });
};