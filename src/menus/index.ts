import { configCategoryMenu } from "./configPermissions/categorys.js";
import { configLogChannelMenu } from "./configPermissions/logChannel.js";
import { mainMenu } from "./configPermissions/main.js";
import { configPermissionsMenu } from "./configPermissions/permissions.js";
import { Panel } from "./ticketPanel/main.js";
import { secondaryMenu } from "./ticketPanel/secondary.js";
import { addUserMenu } from "./ticketPanel/secondaryPanel/addUser.js";
import { choosePriorityMenu } from "./ticketPanel/secondaryPanel/choosePriority.js";
import { moveChannelMenu } from "./ticketPanel/secondaryPanel/moveChannel.js";
import { removeUserMenu } from "./ticketPanel/secondaryPanel/removeUser.js";

export const menus = {
    config: {
        main: mainMenu,
        permissions: configPermissionsMenu,
        categorys: configCategoryMenu,
        logChannel: configLogChannelMenu
    },
    ticket: {
        MainPanel: Panel,
        secondaryMenu: secondaryMenu,
        secondaryPanel: {
            addUser: addUserMenu,
            removeUser: removeUserMenu,
            moveChannel: moveChannelMenu,
            choosePriority: choosePriorityMenu
        }
    }
}