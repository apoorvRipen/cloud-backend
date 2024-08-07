import { adminRole, adminUser } from "../assets";
import { addRole, addUser, getRole, getUser, hashPassword, updateRole } from "../services";

export const migration = async (name: string) => new Promise(async (resolve, _reject) => {
    switch (name) {
        case "addAdminRole":
            const role = await getRole({ name: "Super Admin" });
            if (role) {
                resolve("Admin role already added");
            } else {
                await addRole(adminRole);
                resolve("Admin role added successfully");
            }
            break;
        case "addAdminUser": {
            const hashedassword = await hashPassword(adminUser.password);
            const role = await getRole({ name: "Super Admin" });
            const user = await getUser({ "contact.email": adminUser.contact.email });

            if (!role) {
                resolve({ success: false, message: "Admin Role not Found" });
                return
            }

            if (user) {
                resolve("Admin role already added");
            } else {
                const userPayload = { ...adminUser, _role: role?._id, password: hashedassword };
                const newUSer = await addUser(userPayload);
                await updateRole({ _id: role?._id }, { createdBy: newUSer._id })
                resolve("Admin role added successfully");
            }
            break;
        }
        default: resolve("Argument not matched");
    }
})