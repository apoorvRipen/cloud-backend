export const object = [
    {
        path: '/api/object/upload',
        // TODO: permission: ['object.write'],
        permission: ['user.write'],
        method: 'POST'
    },
    {
        path: '/api/object',
        // TODO: permission: ['object.write'],
        permission: ['user.write'],
        method: 'GET'
    }
];