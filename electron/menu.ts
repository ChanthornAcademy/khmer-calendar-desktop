import { app, Menu, dialog } from "electron";

export default function useMenu() {
  const init = () => {
    // setup app menus
    const template = [
      {
        label: "File",
        submenu: [
          {
            label: "Quit",
            accelerator: "CmdOrCtrl+Q",
            click: () => {
              app.quit();
            },
          },
        ],
      },
      {
        label: "Help",
        submenu: [
          {
            label: "About",
            click: () => {
              onAbout();
            },
          },
        ],
      },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  };

  const onAbout = () => {
    app.setAboutPanelOptions({
      applicationName: "Khmer Lunar Calendar",
      iconPath: "./public/images/icon.png",
      applicationVersion: "1.0.0",
      version: "1.0.0",
      authors: ["Chanthorn SP"],
      website: "https://github.com/chanthornsp/khmer-calendar-desktop",
      copyright: "Chanthorn SP",
      credits: "Chanthorn SP",
    });
    app.showAboutPanel();
  };

  return { init };
}
