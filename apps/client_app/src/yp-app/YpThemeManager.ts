//TODO: User facing automatic, dark mode or high contrast themes selection

export class YpThemeManager {
  themes: Array<Record<string, boolean | string | Record<string, string>>> = [];
  selectedTheme: number | undefined ;
  selectedFont: string | undefined;

  constructor() {
    this.setLoadingStyles();
    this.themes.push({
      name: 'Reykjavík',
      '--mdc-theme-background': '#f7f7f7',
      '--mdc-theme-primary': '#103458',
      '--mdc-theme-secondary': '#ff6500',
    });

    this.themes.push({
      name: 'Basalt Gray',
      '--mdc-theme-background': '#f7f7f7',
      '--mdc-theme-primary': '#37474f',
      '--mdc-theme-secondary': '#ff6500',
    });

    this.themes.push({
      name: 'Green Moss',
      '--mdc-theme-background': '#dcedc8',
      '--mdc-theme-primary': '#558b2f',
      '--mdc-theme-secondary': '#c51162',
    });

    this.themes.push({
      name: 'Google Blue',
      '--mdc-theme-background': '#e3f2fd',
      '--mdc-theme-primary': '#1565c0',
      '--mdc-theme-secondary': '#ff3d00',
    });

    this.themes.push({
      name: 'Red Rhubarb',
      '--mdc-theme-background': '#f1f8e9',
      '--mdc-theme-primary': '#c62828',
      '--mdc-theme-secondary': '#ffd600',
    });

    this.themes.push({
      name: 'Mountain Roses',
      '--mdc-theme-background': '#f1f8e9',
      '--mdc-theme-primary': '#2e7d32',
      '--mdc-theme-secondary': '#d50000',
    });

    this.themes.push({
      name: 'Purple Wizards',
      '--mdc-theme-background': '#ede7f6',
      '--mdc-theme-primary': '#4527a0',
      '--mdc-theme-secondary': '#d50000',
    });

    this.themes.push({
      name: 'Kópavogur',
      '--mdc-theme-background': '#F0F0F0',
      '--mdc-theme-primary': '#004E24',
      '--mdc-theme-secondary': '#ff6500',
    });

    this.themes.push({
      name: 'Forbrukerrådet',
      '--mdc-theme-background': '#f5f5f5',
      '--mdc-theme-primary': '#4b7179',
      '--mdc-theme-secondary': '#d0672f',
    });

    this.themes.push({
      name: 'Forbrukerrådet Fonts',
      '--mdc-theme-background': '#f5f5f5',
      '--mdc-theme-primary': '#4b7179',
      '--mdc-theme-secondary': '#d0672f',
      fonts: {
        htmlImport: '/styles/fonts/forbrukerradet-font.html',
        fontName: 'FFClanWebBook',
      },
    });

    this.themes.push({
      name: 'I choose Malta',
      '--mdc-theme-background': '#cfd8dc',
      '--mdc-theme-primary': '#001a4b',
      '--mdc-theme-secondary': '#d71920',
    });

    this.themes.push({
      name: 'Reykjavík Blue',
      '--mdc-theme-background': '#f7f7f7',
      '--mdc-theme-primary': '#084F71',
      '--mdc-theme-secondary': '#ff6500',
    });

    this.themes.push({
      name: 'Unicorn 1',
      '--mdc-theme-background': '#f7f7f7',
      '--mdc-theme-primary': '#aa3319',
      '--mdc-theme-secondary': '#112e4c',
    });

    this.themes.push({
      name: 'Unicorn 2',
      '--mdc-theme-background': '#f7f7f7',
      '--mdc-theme-primary': '#282828',
      '--mdc-theme-secondary': '#aa3319',
    });

    this.themes.push({
      name: 'Mount Air',
      '--mdc-theme-background': '#f7f7f7',
      '--mdc-theme-primary': '#0d3c55',
      '--mdc-theme-secondary': '#f16c20',
    });

    this.themes.push({
      name: 'Snjallborg',
      '--mdc-theme-background': '#cfd8dc',
      '--mdc-theme-primary': '#1e9ac8',
      '--mdc-theme-secondary': '#ee7aa2',
    });

    this.themes.push({
      name: 'Black',
      '--mdc-theme-background': '#f7f7f7',
      '--mdc-theme-primary': '#282828',
      '--mdc-theme-secondary': '#ff6500',
    });

    this.themes.push({
      name: 'Nesið Okkar',
      '--mdc-theme-background': '#cfd8dc',
      '--mdc-theme-primary': '#525254',
      '--mdc-theme-secondary': '#e0701e',
    });

    this.themes.push({
      disabled: true,
      name: 'Snjallborg',
      '--mdc-theme-background': '#cfd8dc',
      '--mdc-theme-primary': '#1e9ac8',
      '--mdc-theme-secondary': '#ee7aa2',
    });

    this.themes.push({
      disabled: true,
      name: 'Black',
      '--mdc-theme-background': '#cfd8dc',
      '--mdc-theme-primary': '#282828',
      '--mdc-theme-secondary': '#ff6500',
    });

    this.themes.push({
      disabled: true,
      name: 'Nesið Okkar',
      '--mdc-theme-background': '#cfd8dc',
      '--mdc-theme-primary': '#525254',
      '--mdc-theme-secondary': '#e0701e',
    });

    this.themes.push({
      name: 'Iceland',
      '--mdc-theme-background': '#cfd8dc',
      '--mdc-theme-primary': '#282828',
      '--mdc-theme-secondary': '#dc1e35',
    });

    this.themes.push({
      name: 'The Westbourne',
      '--mdc-theme-background': '#f1f8e9',
      '--mdc-theme-primary': '#c62828',
      '--mdc-theme-secondary': '#fbba00',
    });

    this.themes.push({
      name: 'Amsterdam',
      '--mdc-theme-background': '#cfd8dc',
      '--mdc-theme-primary': '#164995',
      '--mdc-theme-secondary': '#ed1b24',
    });

    this.themes.push({
      name: 'AS Roma',
      '--mdc-theme-background': '#DDDBDA',
      '--mdc-theme-primary': '#970a2c',
      '--mdc-theme-secondary': '#fbba00',
    });

    this.themes.push({
      name: 'AS Roma Inverted',
      '--mdc-theme-background': '#DDDBDA',
      '--mdc-theme-primary': '#970a2c',
      '--mdc-theme-secondary': '#1D1D1B',
    });

    this.themes.push({
      name: 'New Jersey',
      '--mdc-theme-background': '#f7f7f7',
      '--mdc-theme-primary': '#56920C',
      '--mdc-theme-secondary': '#1880c7',
    });

    this.themes.push({
      name: 'New Jersey Inverted',
      '--mdc-theme-background': '#f7f7f7',
      '--mdc-theme-primary': '#1880c7',
      '--mdc-theme-secondary': '#56920C',
    });

    this.themes.push({
      name: 'Scottish Parliament',
      '--mdc-theme-background': '#f7f7f7',
      '--mdc-theme-primary': '#500778',
      '--mdc-theme-secondary': '#E87722',
    });
  }

  private _setupOverrideTheme(
    primary: string,
    accent: string,
    background: string | undefined
  ) {
    if (!background) {
      background = '#cfd8dc';
    }

    return {
      '--mdc-theme-background': background,
      '--mdc-theme-primary': primary,
      '--mdc-theme-secondary': accent,
    };
  }

  setLoadingStyles(): void {
    this.updateStyles({
      '--mdc-theme-background': '#7f7f7f',
      '--mdc-theme-primary': '#333',
      '--mdc-theme-secondary': '#333',
      '--mdc-theme-surface': '#FFF',
      '--mdc-theme-on-primary': '#FFF',
      '--mdc-theme-on-secondary': '#FFF',
      '--mdc-theme-on-surface': '#111',
      '--mdc-theme-on-surface-lighter': '#888',
      '--mdc-typography-headline1-font-size': '22px',
      '--mdc-typography-headline1-font-weight': '700',
      '--mdc-typography-headline2-font-size': '18px',
      '--mdc-typography-headline2-font-weight': '700'
    })
  }

  updateStyles(
    properties: Record<string, string>
  ) {
    for (const property in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, property)) {
        if (window.app)
          window.app.style.setProperty(property, properties[property]);
      }
    }
  }

  private _onlyGetStylesFromTheme(
    properties: Record<string, boolean | string | Record<string, string>>
  ) {
    const filterdProperties: Record<string, string> = {};

    for (const property in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, property)) {
        if (property !== 'name' && property !== 'disabled') {
          filterdProperties[property] = properties[property] as string;
        }
      }
    }

    return filterdProperties;
  }

  setTheme(
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
          '#' + configuration.themeOverrideColorPrimary;
      }
      if (configuration.themeOverrideColorAccent.length === 6) {
        configuration.themeOverrideColorAccent =
          '#' + configuration.themeOverrideColorAccent;
      }
      if (
        configuration.themeOverrideBackgroundColor &&
        configuration.themeOverrideBackgroundColor.length === 6
      ) {
        configuration.themeOverrideBackgroundColor =
          '#' + configuration.themeOverrideBackgroundColor;
      }

      this.updateStyles(
        this._setupOverrideTheme(
          configuration.themeOverrideColorPrimary,
          configuration.themeOverrideColorAccent,
          configuration.themeOverrideBackgroundColor
        )
      );
    } else if (number!==undefined) {
      if (this.themes[number]) {
        this.updateStyles(
          this._onlyGetStylesFromTheme(this.themes[number])
        );
      }
    }
  }
}
