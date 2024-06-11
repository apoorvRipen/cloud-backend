import URLPattern from 'url-pattern';
import { userServiceUrls } from '../api-urls';


const m200 = 200;
const m403 = 403;
const m404 = 404;

type returnType = 200 | 403 | 404;
interface Gateway {
    path: string;
    permission: Array<string>;
    method: string;
}

// tslint:disable-next-line:cyclomatic-complexity
export const verifyResourcePermission = (
    urlLink: string, method: string, resourcesAssigned: Array<string>
): returnType => {

    let domainPath = urlLink.split('/')[2];
    domainPath = domainPath.includes('?') ? domainPath.split('?')[0] : domainPath;
    const subDomain = formatSubDomain(domainPath);
    const [completeUrl] = urlLink.split('?');
    let permissionBlock: Gateway | undefined;

    
    switch (subDomain) {
        case 'auth':
        case 'user':
            permissionBlock = userServiceUrls[subDomain]
                ? userServiceUrls[subDomain].find((url: Gateway) =>
                    new URLPattern(url.path).match(completeUrl) && url.method === method)
                : undefined; 
            break;
        default:
            permissionBlock = undefined;
            break;
    }



    if (!permissionBlock) {
        return m404;
    } else if (!permissionBlock.permission.some(permission => resourcesAssigned.includes(permission))) {
        return m403;
    }

    return m200;
};

const formatSubDomain = (subDomain: string) => {
    if (subDomain.includes('-')) {
        return subDomain.replace(/-./g, match => match.charAt(1)
            .toUpperCase());
    } else if ( subDomain === "authentication" ){
        return 'auth'
    }

    return subDomain;
};