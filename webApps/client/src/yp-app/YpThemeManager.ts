//TODO: User facing automatic, dark mode or high contrast themes selection

import {
  applyTheme,
  argbFromHex,
  themeFromSourceColor,
} from "@material/material-color-utilities";
import {
  applyThemeWithContrast,
  themeFromSourceColorWithContrast,
} from "../common/YpMaterialThemeHelper";
import { YpBaseElement } from "../common/yp-base-element";

//type MaterialColorScheme = 'tonal'|'vibrant'|'expressive'|'content'|'neutral'|'monochrome'|'fidelity'|'dynamic';
//type MaterialDynamicVariants = "monochrome" | "neutral" | "tonalSpot" | "vibrant" | "expressive" | "fidelity" | "content" | "rainbow" | "fruitSalad";

export class YpThemeManager {
  themes: Array<Record<string, boolean | string | Record<string, string>>> = [];
  selectedTheme: number | undefined;
  selectedFont: string | undefined;
  themeColor: string | undefined = "#0327f8";
  themeDarkMode = false;
  themeHighContrast = false;
  themePrimaryColor: string | undefined;
  themeSecondaryColor: string | undefined;
  themeTertiaryColor: string | undefined;
  themeNeutralColor: string | undefined;
  themeNeutralVariantColor: string | undefined;
  themeVariant: MaterialDynamicVariants | undefined;

  static themeScemesOptionsWithName = [
    { name: "Tonal", value: "tonal" },
    { name: "Vibrant", value: "vibrant" },
    { name: "Expressive", value: "expressive" },
    { name: "Content", value: "content" },
    { name: "Neutral", value: "neutral" },
    { name: "Monochrome", value: "monochrome" },
    { name: "Fidelity", value: "fidelity" },
  ];

  static themeVariantsOptionsWithName = [
    { name: "Monochrome", value: "monochrome" },
    { name: "Neutral", value: "neutral" },
    { name: "Tonal Spot", value: "tonalSpot" },
    { name: "Vibrant", value: "vibrant" },
    { name: "Expressive", value: "expressive" },
    { name: "Fidelity", value: "fidelity" },
    { name: "Content", value: "content" },
    { name: "Rainbow", value: "rainbow" },
    { name: "Fruit Salad", value: "fruitSalad" },
  ];

  isAppleDevice = false;
  themeScheme: MaterialColorScheme = "tonal";
  channel = new BroadcastChannel("hex_color");

  constructor() {
    const savedDarkMode = localStorage.getItem(
      YpBaseElement.darkModeLocalStorageKey
    );
    if (savedDarkMode) {
      this.themeDarkMode = true;
    } else {
      this.themeDarkMode = false;
    }

    const savedHighContrastMode = localStorage.getItem(
      YpBaseElement.highContrastLocalStorageKey
    );

    if (savedHighContrastMode) {
      this.themeHighContrast = true;
    } else {
      this.themeHighContrast = false;
    }

    this.setupOldThemes();
    this.themeChanged();

    this.channel.onmessage = (event: any) => {
      this.themeColor = event.data;
      this.themeChanged();
    };
  }

  setupOldThemes() {
    this.themes.push({
      name: "Reykjavík",
      "--mdc-theme-background": "#f7f7f7",
      "--mdc-theme-primary": "#103458",
      "--mdc-theme-secondary": "#ff6500",
    });

    this.themes.push({
      name: "Basalt Gray",
      "--mdc-theme-background": "#f7f7f7",
      "--mdc-theme-primary": "#37474f",
      "--mdc-theme-secondary": "#ff6500",
    });

    this.themes.push({
      name: "Green Moss",
      "--mdc-theme-background": "#dcedc8",
      "--mdc-theme-primary": "#558b2f",
      "--mdc-theme-secondary": "#c51162",
    });

    this.themes.push({
      name: "Google Blue",
      "--mdc-theme-background": "#e3f2fd",
      "--mdc-theme-primary": "#1565c0",
      "--mdc-theme-secondary": "#ff3d00",
    });

    this.themes.push({
      name: "Red Rhubarb",
      "--mdc-theme-background": "#f1f8e9",
      "--mdc-theme-primary": "#c62828",
      "--mdc-theme-secondary": "#ffd600",
    });

    this.themes.push({
      name: "Mountain Roses",
      "--mdc-theme-background": "#f1f8e9",
      "--mdc-theme-primary": "#2e7d32",
      "--mdc-theme-secondary": "#d50000",
    });

    this.themes.push({
      name: "Purple Wizards",
      "--mdc-theme-background": "#ede7f6",
      "--mdc-theme-primary": "#4527a0",
      "--mdc-theme-secondary": "#d50000",
    });

    this.themes.push({
      name: "Kópavogur",
      "--mdc-theme-background": "#F0F0F0",
      "--mdc-theme-primary": "#004E24",
      "--mdc-theme-secondary": "#ff6500",
    });

    this.themes.push({
      name: "Forbrukerrådet",
      "--mdc-theme-background": "#f5f5f5",
      "--mdc-theme-primary": "#4b7179",
      "--mdc-theme-secondary": "#d0672f",
    });

    this.themes.push({
      name: "Forbrukerrådet Fonts",
      "--mdc-theme-background": "#f5f5f5",
      "--mdc-theme-primary": "#4b7179",
      "--mdc-theme-secondary": "#d0672f",
      fonts: {
        htmlImport: "/styles/fonts/forbrukerradet-font.html",
        fontName: "FFClanWebBook",
      },
    });

    this.themes.push({
      name: "I choose Malta",
      "--mdc-theme-background": "#cfd8dc",
      "--mdc-theme-primary": "#001a4b",
      "--mdc-theme-secondary": "#d71920",
    });

    this.themes.push({
      name: "Reykjavík Blue",
      "--mdc-theme-background": "#f7f7f7",
      "--mdc-theme-primary": "#084F71",
      "--mdc-theme-secondary": "#ff6500",
    });

    this.themes.push({
      name: "Unicorn 1",
      "--mdc-theme-background": "#f7f7f7",
      "--mdc-theme-primary": "#aa3319",
      "--mdc-theme-secondary": "#112e4c",
    });

    this.themes.push({
      name: "Unicorn 2",
      "--mdc-theme-background": "#f7f7f7",
      "--mdc-theme-primary": "#282828",
      "--mdc-theme-secondary": "#aa3319",
    });

    this.themes.push({
      name: "Mount Air",
      "--mdc-theme-background": "#f7f7f7",
      "--mdc-theme-primary": "#0d3c55",
      "--mdc-theme-secondary": "#f16c20",
    });

    this.themes.push({
      name: "Snjallborg",
      "--mdc-theme-background": "#cfd8dc",
      "--mdc-theme-primary": "#1e9ac8",
      "--mdc-theme-secondary": "#ee7aa2",
    });

    this.themes.push({
      name: "Black",
      "--mdc-theme-background": "#f7f7f7",
      "--mdc-theme-primary": "#282828",
      "--mdc-theme-secondary": "#ff6500",
    });

    this.themes.push({
      name: "Nesið Okkar",
      "--mdc-theme-background": "#cfd8dc",
      "--mdc-theme-primary": "#525254",
      "--mdc-theme-secondary": "#e0701e",
    });

    this.themes.push({
      disabled: true,
      name: "Snjallborg",
      "--mdc-theme-background": "#cfd8dc",
      "--mdc-theme-primary": "#1e9ac8",
      "--mdc-theme-secondary": "#ee7aa2",
    });

    this.themes.push({
      disabled: true,
      name: "Black",
      "--mdc-theme-background": "#cfd8dc",
      "--mdc-theme-primary": "#282828",
      "--mdc-theme-secondary": "#ff6500",
    });

    this.themes.push({
      disabled: true,
      name: "Nesið Okkar",
      "--mdc-theme-background": "#cfd8dc",
      "--mdc-theme-primary": "#525254",
      "--mdc-theme-secondary": "#e0701e",
    });

    this.themes.push({
      name: "Iceland",
      "--mdc-theme-background": "#cfd8dc",
      "--mdc-theme-primary": "#282828",
      "--mdc-theme-secondary": "#dc1e35",
    });

    this.themes.push({
      name: "The Westbourne",
      "--mdc-theme-background": "#f1f8e9",
      "--mdc-theme-primary": "#c62828",
      "--mdc-theme-secondary": "#fbba00",
    });

    this.themes.push({
      name: "Amsterdam",
      "--mdc-theme-background": "#cfd8dc",
      "--mdc-theme-primary": "#164995",
      "--mdc-theme-secondary": "#ed1b24",
    });

    this.themes.push({
      name: "AS Roma",
      "--mdc-theme-background": "#DDDBDA",
      "--mdc-theme-primary": "#970a2c",
      "--mdc-theme-secondary": "#fbba00",
    });

    this.themes.push({
      name: "AS Roma Inverted",
      "--mdc-theme-background": "#DDDBDA",
      "--mdc-theme-primary": "#970a2c",
      "--mdc-theme-secondary": "#1D1D1B",
    });

    this.themes.push({
      name: "New Jersey",
      "--mdc-theme-background": "#f7f7f7",
      "--mdc-theme-primary": "#56920C",
      "--mdc-theme-secondary": "#1880c7",
    });

    this.themes.push({
      name: "New Jersey Inverted",
      "--mdc-theme-background": "#f7f7f7",
      "--mdc-theme-primary": "#1880c7",
      "--mdc-theme-secondary": "#56920C",
    });

    this.themes.push({
      name: "Scottish Parliament",
      "--mdc-theme-background": "#f7f7f7",
      "--mdc-theme-primary": "#500778",
      "--mdc-theme-secondary": "#E87722",
    });

    this.themes.push({
      name: "RoStartup",
      "--mdc-theme-background": "#F7F7F7",
      "--mdc-theme-primary": "#154164",
      "--mdc-theme-secondary": "#1f52a5",
      "--app-header-font-weight": "500",
      "--app-tags-text-color": "#1f52a5",
      "--app-tags-font-weight": "500",
      fonts: {
        htmlImport: "/styles/fonts/rostartup-font.html",
        fontName: "Montserrat",
      },
    });

    this.themes.push({
      name: "wienExtra",
      "--mdc-theme-background": "#F7F7F7",
      "--mdc-theme-primary": "#292929",
      "--mdc-theme-secondary": "#ff0000",
      fonts: {
        htmlImport: "/styles/fonts/junges-wien-font.html",
        fontName: "WienerMelange",
      },
    });

    this.themes.push({
      name: "Frumbjörg",
      "--mdc-theme-background": "#fefefe",
      "--mdc-theme-primary": "#17263e",
      "--mdc-theme-secondary": "#1f5d04",
      fonts: {
        htmlImport: "/styles/fonts/frumbjorg-font.html",
        fontName: "Merriweather",
      },
    });
  }

  updateStyles(properties: Record<string, string>) {
    for (const property in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, property)) {
        if (window.app)
          window.app.style.setProperty(property, properties[property]);
      }
    }
  }

  setThemeFromOldConfiguration(
    number: number | undefined,
    configuration: YpCollectionConfiguration | undefined = undefined
  ) {
    if (
      configuration &&
      configuration.themeOverrideColorPrimary &&
      configuration.themeOverrideColorPrimary.length > 5 &&
      configuration.themeOverrideColorAccent &&
      configuration.themeOverrideColorAccent.length > 5
    ) {
      if (configuration.themeOverrideColorPrimary.length === 6) {
        configuration.themeOverrideColorPrimary =
          "#" + configuration.themeOverrideColorPrimary;
      }
      if (configuration.themeOverrideColorAccent.length === 6) {
        configuration.themeOverrideColorAccent =
          "#" + configuration.themeOverrideColorAccent;
      }
      if (
        configuration.themeOverrideBackgroundColor &&
        configuration.themeOverrideBackgroundColor.length === 6
      ) {
        configuration.themeOverrideBackgroundColor =
          "#" + configuration.themeOverrideBackgroundColor;
      }

      this.themeColor = configuration.themeOverrideColorPrimary;
      this.themeChanged();
    } else if (number !== undefined) {
      if (this.themes[number]) {
        this.themeColor = this.themes[number]["--mdc-theme-primary"] as string;
        this.themeChanged();
      }
    }

    if (
      number &&
      this.themes[number] &&
      (this.themes[number].originalName === "wienExtra" ||
        this.themes[number].originalName === "RoStartup" ||
        this.themes[number].originalName === "Frumbjörg")
    ) {
      const event = new CustomEvent("yp-large-font", {
        detail: true,
        bubbles: true,
        composed: true,
      });
      document.dispatchEvent(event);
    } else if (number && this.themes[number]) {
      const event = new CustomEvent("yp-large-font", {
        detail: false,
        bubbles: true,
        composed: true,
      });
      document.dispatchEvent(event);
    }
  }

  sanitizeFontStyles(fontStyles: string) {
    const allowedProps = ["body", "font-family", "font-weight", "font-size"];
    const propValueRegex = /([a-zA-Z\-]+)\s*:\s*([^;]+);?/g;

    let sanitizedStyles = "";
    let match;

    while ((match = propValueRegex.exec(fontStyles)) !== null) {
      if (allowedProps.includes(match[1])) {
        sanitizedStyles += `${match[1]}: ${match[2]}; `;
      }
    }

    return sanitizedStyles;
  }

  sanitizeFontImports(fontImports: string[]) {
    const allowedDomains = [
      "fonts.googleapis.com",
      "use.typekit.net", // Adobe Fonts
      "fonts.fontsquirrel.com", // Font Squirrel
      "fast.fonts.net", // Fonts.com
      "myfonts.com", // MyFonts
      "foundry.typenetwork.com", // Type Network
      "fonts.fontspring.com", // Fontspring
      "creativemarket.com", // Creative Market
      "fonts.linotype.com", // Linotype
      "fonts.monotype.com", // Monotype
      "fontshop.com", // FontShop
      "typography.com", // Hoefler&Co.
    ];
    return fontImports.filter((url) => {
      try {
        const parsedUrl = new URL(url);
        return (
          parsedUrl.protocol === "https:" &&
          allowedDomains.some(
            (domain) =>
              parsedUrl.hostname.endsWith(domain) ||
              parsedUrl.hostname.includes(domain)
          )
        );
      } catch (e) {
        return false; // Invalid URL
      }
    });
  }

  applyFontStyles(fontStyles: string | null) {
    let styleElement = document.getElementById("custom-font-styles");
    if (fontStyles) {
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = "custom-font-styles";
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = fontStyles;
    } else if (styleElement) {
      styleElement.textContent = '';
    }
  }

  importFonts(fontImportsString: string | null) {
    document.querySelectorAll('link[data-font-import]').forEach(element => element.remove());

    if (fontImportsString) {
      const fontImports = this.sanitizeFontImports(fontImportsString.split("\n"));
      fontImports.forEach((url) => {
        const linkElement = document.createElement("link");
        linkElement.rel = "stylesheet";
        linkElement.href = url;
        linkElement.setAttribute('data-font-import', 'true');
        document.head.appendChild(linkElement);
      });
    }
  }

  setTheme(
    number: number | undefined,
    configuration: YpCollectionConfiguration | undefined = undefined
  ) {
    if (!configuration) {
      console.warn("No configuration found");
      return;
    }

    if (!configuration.theme) {
      this.setThemeFromOldConfiguration(number, configuration);
    } else {
      if (configuration.theme.oneDynamicColor) {
        this.themeColor = configuration.theme.oneDynamicColor;
        this.themeScheme = configuration.theme.oneColorScheme!;
      } else if (configuration.theme.primaryColor) {
        this.themeColor = undefined;
        this.themePrimaryColor = configuration.theme.primaryColor;
        this.themeSecondaryColor = configuration.theme.secondaryColor;
        this.themeTertiaryColor = configuration.theme.tertiaryColor;
        this.themeNeutralColor = configuration.theme.neutralColor;
        this.themeNeutralVariantColor = configuration.theme.neutralVariantColor;
        //this.themeVariant = configuration.theme.variant;
      }

      if (configuration.theme.fontStyles) {
        this.applyFontStyles(configuration.theme.fontStyles);
      } else {
        this.applyFontStyles(null);
      }
      if (configuration.theme.fontImports) {
        this.importFonts(configuration.theme.fontImports);
      } else {
        this.importFonts(null);
      }

      this.themeChanged();
    }
  }

  updateLiveFromConfiguration(theme: YpThemeConfiguration) {
    if (theme) {
      if (theme.oneDynamicColor) {
        this.themeColor = theme.oneDynamicColor;
        this.themeScheme = theme.oneColorScheme!;
      } else {
        this.themeColor = undefined;
        this.themePrimaryColor = theme.primaryColor;
        this.themeSecondaryColor = theme.secondaryColor;
        this.themeTertiaryColor = theme.tertiaryColor;
        this.themeNeutralColor = theme.neutralColor;
        this.themeNeutralVariantColor = theme.neutralVariantColor;
        this.themeVariant = theme.variant || "fidelity";
      }
      this.themeChanged();
    }
  }

  themeChanged(target: HTMLElement | undefined = undefined) {
    let themeCss = {} as any;

    const isDark =
      this.themeDarkMode === undefined
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : this.themeDarkMode;

    if (false && this.isAppleDevice) {
      const theme = themeFromSourceColor(
        argbFromHex(this.themeColor || "#000000"),
        [
          {
            name: "up-vote",
            value: argbFromHex("#0F0"),
            blend: true,
          },
          {
            name: "down-vote",
            value: argbFromHex("#F00"),
            blend: true,
          },
        ]
      );

      applyTheme(theme, { target: document.body, dark: isDark });
    } else {
      if (this.themeColor) {
        themeCss = themeFromSourceColorWithContrast(
          this.getHexColor(this.themeColor),
          this.themeVariant,
          isDark,
          this.themeScheme,
          this.themeHighContrast ? 2.0 : 0.0
        );
      } else {
        themeCss = themeFromSourceColorWithContrast(
          {
            primary: this.getHexColor(this.themePrimaryColor || "#000000"),
            secondary: this.getHexColor(this.themeSecondaryColor || "#000000"),
            tertiary: this.getHexColor(this.themeTertiaryColor || "#000000"),
            neutral: this.getHexColor(this.themeNeutralColor || "#000000"),
            neutralVariant: this.getHexColor(
              this.themeNeutralVariantColor || "#000000"
            ),
          },
          this.themeVariant,
          isDark,
          "dynamic",
          this.themeHighContrast ? 2.0 : 0.0
        );
      }

      applyThemeWithContrast(document, themeCss);
    }
  }

  getHexColor(color: string | undefined): string {
    if (color) {
      // Replace all # with nothing
      color = color.replace(/#/g, "");
      if (color.length === 6) {
        return `#${color}`;
      } else {
        return "#000000";
      }
    } else {
      return "#000000";
    }
  }
}
