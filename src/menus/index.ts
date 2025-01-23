import { configPermissionsMenu } from "./configPermissions/main.js";
import { Panel } from "./ticketPanel/main.js";

export const menus = {
    configPermissions: configPermissionsMenu,
    ticket: {
        MainPanel: Panel
    }
}