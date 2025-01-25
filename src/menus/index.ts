import { configCategoryMenu } from "./configPermissions/categorys.js";
import { configPermissionsMenu } from "./configPermissions/permissions.js";
import { Panel } from "./ticketPanel/main.js";
import { secondaryMenu } from "./ticketPanel/secondary.js";
import { addUserMenu } from "./ticketPanel/secondaryPanel/addUser.js";
import { removeUserMenu } from "./ticketPanel/secondaryPanel/removeUser.js";

export const menus = {
    config: {
        permissions: configPermissionsMenu,
        categorys: configCategoryMenu
    },
    ticket: {
        MainPanel: Panel,
        secondaryMenu: secondaryMenu,
        secondaryPanel: {
            addUser: addUserMenu,
            removeUser: removeUserMenu
        }
    }
}