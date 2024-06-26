import client from 'lib/api/client';
import Cookies from 'js-cookie';
import { Tag } from 'interfaces';

export const viewAllTags = (id:number) => {
    return client.get(`tags`, {
        params: {
            id: id
        },
        headers: {
            'access-token': Cookies.get('_access_token'),
            'client': Cookies.get('_client'),
            'uid': Cookies.get('_uid')
        }
    });
};