import { IncomingHttpHeaders } from 'http';

export interface IHeader extends IncomingHttpHeaders {
    'x-original-uri': string;
    'x-original-method': string;
}
