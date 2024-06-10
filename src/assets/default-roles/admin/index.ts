export const adminRole = {
    name: 'Super Admin',
    role: 'SUPERADMIN',
    description: 'Default user-role SuperAdmin with pre-defined permissions.',
    status: 'ACTIVE',
    isDefault: true,
    resources: [
        'user',
        'user.write',
        'user.read',
        'user.remove',
    ]
};
