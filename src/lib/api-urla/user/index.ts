export const user = [
    {
        path: '/api/user',
        permission: ['user.write'],
        method: 'POST'
    },
    {
        path: '/api/user',
        permission: ['user.read'],
        method: 'GET'
    },
    {
        path: '/api/user',
        permission: ['user.write'],
        method: 'PUT'
    },
    {
        path: '/api/user',
        permission: ['user.remove'],
        method: 'DELETE'
    },
    {
        path: '/api/user/list',
        permission: ['user.read'],
        method: 'GET'
    },
    {
        path: '/api/user/my-profile',
        permission: ['user.read', 'common.read'],
        method: 'GET'
    },
    {
        path: '/api/user/change-password',
        permission: ['user.write', 'common.read'],
        method: 'PUT'
    },
    {
        path: '/api/user/list/partial',
        permission: ['user.read', 'common.read'],
        method: 'GET'
    }
];