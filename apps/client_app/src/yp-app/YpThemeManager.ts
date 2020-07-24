export class YpThemeManager {
  themes: Array<Record<string, boolean | string | Record<string, string>>> = [];
  selectedTheme: number | undefined ;
  selectedFont: string | undefined;

  constructor() {
    this.themes.push({
      name: 'Reykjavík',
      '--primary-background-color': '#f7f7f7',
      '--primary-color': '#103458',
      '--accent-color': 'var(--paper-orange-a700)',
    });

    this.themes.push({
      name: 'Basalt Gray',
      '--primary-background-color': '#f7f7f7',
      '--primary-color': 'var(--paper-blue-grey-500)',
      '--accent-color': 'var(--paper-orange-a700)',
    });

    this.themes.push({
      name: 'Green Moss',
      '--primary-background-color': 'var(--paper-light-green-100)',
      '--primary-color': 'var(--paper-light-green-900)',
      '--accent-color': 'var(--paper-pink-a700)',
    });

    this.themes.push({
      name: 'Google Blue',
      '--primary-background-color': 'var(--paper-blue-50)',
      '--primary-color': 'var(--paper-blue-500)',
      '--accent-color': 'var(--paper-deep-orange-a400)',
    });

    this.themes.push({
      name: 'Red Rhubarb',
      '--primary-background-color': 'var(--paper-light-green-50)',
      '--primary-color': 'var(--paper-red-500)',
      '--accent-color': 'var(--paper-yellow-a700)',
    });

    this.themes.push({
      name: 'Mountain Roses',
      '--primary-background-color': 'var(--paper-light-green-50)',
      '--primary-color': 'var(--paper-green-500)',
      '--accent-color': 'var(--paper-red-a700)',
    });

    this.themes.push({
      name: 'Mountain Roses',
      '--primary-background-color': 'var(--paper-light-green-50)',
      '--primary-color': 'var(--paper-green-500)',
      '--accent-color': 'var(--paper-red-a700)',
    });

    this.themes.push({
      name: 'Purple Wizards',
      '--primary-background-color': 'var(--paper-deep-purple-50)',
      '--primary-color': 'var(--paper-deep-purple-500)',
      '--accent-color': 'var(--paper-red-a700)',
    });

    this.themes.push({
      name: 'Kópavogur',
      '--primary-background-color': '#F0F0F0',
      '--primary-color': '#00853E',
      '--accent-color': 'var(--paper-orange-a700)',
    });

    this.themes.push({
      name: 'Forbrukerrådet',
      '--primary-background-color': '#f5f5f5',
      '--primary-color': '#7dbdc9',
      '--accent-color': '#d0672f',
    });

    this.themes.push({
      name: 'Forbrukerrådet Fonts',
      '--primary-background-color': '#f5f5f5',
      '--primary-color': '#7dbdc9',
      '--accent-color': '#d0672f',
      fonts: {
        htmlImport: '/styles/fonts/forbrukerradet-font.html',
        fontName: 'FFClanWebBook',
      },
    });

    this.themes.push({
      name: 'I choose Malta',
      '--primary-background-color': 'var(--paper-blue-grey-100)',
      '--primary-color': '#001a4b',
      '--accent-color': '#d71920',
    });

    this.themes.push({
      name: 'Reykjavík Blue',
      '--primary-background-color': '#f7f7f7',
      '--primary-color': '#084F71',
      '--accent-color': 'var(--paper-orange-a700)',
    });

    this.themes.push({
      name: 'Unicorn 1',
      '--primary-background-color': '#f7f7f7',
      '--primary-color': '#aa3319',
      '--accent-color': '#112e4c',
    });

    this.themes.push({
      name: 'Unicorn 2',
      '--primary-background-color': '#f7f7f7',
      '--primary-color': '#282828',
      '--accent-color': '#aa3319',
    });

    this.themes.push({
      name: 'Mount Air',
      '--primary-background-color': '#f7f7f7',
      '--primary-color': '#0d3c55',
      '--accent-color': '#f16c20',
    });

    this.themes.push({
      name: 'Snjallborg',
      '--primary-background-color': 'var(--paper-blue-grey-100)',
      '--primary-color': '#1e9ac8',
      '--accent-color': '#ee7aa2',
    });

    this.themes.push({
      name: 'Black',
      '--primary-background-color': '#f7f7f7',
      '--primary-color': '#282828',
      '--accent-color': 'var(--paper-orange-a700)',
    });

    this.themes.push({
      name: 'Nesið Okkar',
      '--primary-background-color': 'var(--paper-blue-grey-100)',
      '--primary-color': '#525254',
      '--accent-color': '#e0701e',
    });

    this.themes.push({
      disabled: true,
      name: 'Snjallborg',
      '--primary-background-color': 'var(--paper-blue-grey-100)',
      '--primary-color': '#1e9ac8',
      '--accent-color': '#ee7aa2',
    });

    this.themes.push({
      disabled: true,
      name: 'Black',
      '--primary-background-color': 'var(--paper-blue-grey-100)',
      '--primary-color': '#282828',
      '--accent-color': 'var(--paper-orange-a700)',
    });

    this.themes.push({
      disabled: true,
      name: 'Nesið Okkar',
      '--primary-background-color': 'var(--paper-blue-grey-100)',
      '--primary-color': '#525254',
      '--accent-color': '#e0701e',
    });

    this.themes.push({
      name: 'Iceland',
      '--primary-background-color': 'var(--paper-blue-grey-100)',
      '--primary-color': '#282828',
      '--accent-color': '#dc1e35',
    });

    this.themes.push({
      name: 'The Westbourne',
      '--primary-background-color': 'var(--paper-light-green-50)',
      '--primary-color': 'var(--paper-red-500)',
      '--accent-color': '#fbba00',
    });

    this.themes.push({
      name: 'Amsterdam',
      '--primary-background-color': 'var(--paper-blue-grey-100)',
      '--primary-color': '#164995',
      '--accent-color': '#ed1b24',
    });

    this.themes.push({
      name: 'AS Roma',
      '--primary-background-color': '#DDDBDA',
      '--primary-color': '#970a2c',
      '--accent-color': '#fbba00',
    });

    this.themes.push({
      name: 'AS Roma Inverted',
      '--primary-background-color': '#DDDBDA',
      '--primary-color': '#970a2c',
      '--accent-color': '#1D1D1B',
    });

    this.themes.push({
      name: 'New Jersey',
      '--primary-background-color': '#f7f7f7',
      '--primary-color': '#56920C',
      '--accent-color': '#1880c7',
    });

    this.themes.push({
      name: 'New Jersey Inverted',
      '--primary-background-color': '#f7f7f7',
      '--primary-color': '#1880c7',
      '--accent-color': '#56920C',
    });

    this.themes.push({
      name: 'Scottish Parliament',
      '--primary-background-color': '#f7f7f7',
      '--primary-color': '#500778',
      '--accent-color': '#E87722',
    });
  }

  private _setupOverrideTheme(
    primary: string,
    accent: string,
    background: string | undefined
  ) {
    if (!background) {
      background = 'var(--paper-blue-grey-100)';
    }

    return {
      '--primary-background-color': background,
      '--primary-color': primary,
      '--accent-color': accent,
    };
  }

  updateStyles(
    element: HTMLElement,
    properties: Record<string, string>
  ) {
    for (const property in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, property)) {
        element.style.setProperty(property, properties[property]);
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
    element: HTMLElement,
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
        element,
        this._setupOverrideTheme(
          configuration.themeOverrideColorPrimary,
          configuration.themeOverrideColorAccent,
          configuration.themeOverrideBackgroundColor
        )
      );
    } else if (number) {
      if (this.themes[number]) {
        this.updateStyles(
          element,
          this._onlyGetStylesFromTheme(this.themes[number])
        );
      }
    }
  }
}
