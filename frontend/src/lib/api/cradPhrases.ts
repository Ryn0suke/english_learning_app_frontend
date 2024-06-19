import client from 'lib/api/client';
import Cookies from 'js-cookie';
import { Phrase, SearchOptions } from 'interfaces';

export const viewAllPhrases = (id: number, page: number, searchOptions: SearchOptions = { japanese: '', english: '', tags: [] }) => {
    console.log(searchOptions);
    return client.get(`phrases/${id}`, {
        params: {
            page: page,
            search: searchOptions
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

export const updatePhrases = (id:number, phrase:Phrase) => {
    console.log(phrase);
    return client.patch(`phrases/${id}`, phrase, {
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