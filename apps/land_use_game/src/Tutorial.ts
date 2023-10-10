import { YpCodeBase } from "./@yrpri/common/YpCodeBaseclass";
import { YpPageDialog } from "./@yrpri/yp-page/yp-page-dialog";

export class Tutorial extends YpCodeBase {
  callbackFunction: Function | undefined;

  stages = {
    navigation: {
      stage: "navigation",
      title: {
        en: "3D Navigation",
        is: "3D Umhverfi",
      },
      content: {
        en: `
        <p>
            Navigating through the game works differently depending on the type
            of device you are using.
        </p>
        <div class="layout vertical" style="font-size: 16px;width:100%;padding:8px;background-color: var(--md-sys-color-primary);color: var(--md-sys-color-on-primary);">
            <div class="layout horizontal" style="padding: 8px;font-size: 16px;">
            <div style="width: 65px;" class="layout horizontal center-center">
                    <img
                        src="https://sandcastle.cesium.com/CesiumUnminified/Widgets/Images/NavigationHelp/TouchDrag.svg"
                        alt="Touch Drag"
                        style="max-height: 50px;padding: 8px;"
                    />
                </div>
                <div><em>Pan</em>: One-finger drag<br /></div>
            </div>
            <div class="layout horizontal" style="padding: 8px;">
            <div style="width: 65px;" class="layout horizontal center-center">
                    <img
                        src="https://sandcastle.cesium.com/CesiumUnminified/Widgets/Images/NavigationHelp/TouchZoom.svg"
                        alt="Touch Zoom"
                        style="max-height: 50px;background-color: var(--md-sys-color-primary);padding: 8px;"
                    />
                </div>
                <em>Zoom</em>: Two-finger pinch<br />
            </div>
            <div class="layout horizontal" style="padding: 8px;">
            <div style="width: 65px;" class="layout horizontal center-center">
                    <img
                        src="https://sandcastle.cesium.com/CesiumUnminified/Widgets/Images/NavigationHelp/TouchRotate.svg"
                        alt="Touch Rotate"
                        style="max-height: 50px;background-color: var(--md-sys-color-primary);padding: 8px;"
                    />
                </div>
                <em>Rotate</em>: Two-finger drag, opposite direction<br />
            </div>
            <div class="layout horizontal" style="padding: 8px;">
            <div style="width: 65px;" class="layout horizontal center-center">
                    <img
                        src="https://sandcastle.cesium.com/CesiumUnminified/Widgets/Images/NavigationHelp/TouchTilt.svg"
                        alt="Touch Tilt"
                        style="max-height: 50px;background-color: var(--md-sys-color-primary);padding: 8px;"
                    />
                </div>
                <em>Tilt</em>: Two-finger drag, same direction
            </div>
        </div>
        <div style="padding: 8px;" class="layout vertical">
            <b>Mouse navigation:</b><br />
            <div class="layout horizontal">
              <div style="width: 75px; display: inline-block;padding: 8px;">
                  <img
                      src="https://sandcastle.cesium.com/CesiumUnminified/Widgets/Images/NavigationHelp/MouseLeft.svg"
                      alt="Mouse Left"
                      style="max-height: 75px;"
                  />
              </div>
              <em>Pan</em>: Left click + drag<br />
            </div>
            <div class="layout horizontal">
              <div style="width: 75px; display: inline-block;padding: 8px;">
                  <img
                      src="https://sandcastle.cesium.com/CesiumUnminified/Widgets/Images/NavigationHelp/MouseRight.svg"
                      alt="Mouse Right"
                      style="max-height: 75px;"
                  />
              </div>
              <em>Zoom</em>: Right click + drag, or Mouse wheel scroll<br />
            </div>
            <div class="layout horizontal">
              <div style="width: 75px; display: inline-block;padding: 8px;">
                  <img
                      src="https://sandcastle.cesium.com/CesiumUnminified/Widgets/Images/NavigationHelp/MouseMiddle.svg"
                      alt="Mouse Middle"
                      style="max-height: 75px;"
                  />
              </div>
              <div class="layout vertical">
                <em>Rotate</em>: Middle click + drag, or CTRL +Left/Right click +
                drag<br />
                <em>Tilt</em>Two-finger drag, same direction
              </div>
            </div>
        </div>
    `,
        is: `
        <p>
            Stjórn með snertiskjá og mús virkar mismunandi eftir því hvaða tæki þú notar.
        </p>
        <div class="layout vertical" style="font-size: 16px;width:100%;padding:8px;background-color: var(--md-sys-color-primary);color: var(--md-sys-color-on-primary);">
            <div class="layout horizontal" style="padding: 8px;">
                <div style="width: 65px;" class="layout horizontal center-center">
                    <img
                        src="https://sandcastle.cesium.com/CesiumUnminified/Widgets/Images/NavigationHelp/TouchDrag.svg"
                        alt="Touch Drag"
                        style="max-height: 50px;padding: 8px;"
                    />
                </div>
                <div><em>Færsla</em>: Dragðu með einum fingri<br /></div>
            </div>
            <div class="layout horizontal" style="padding: 8px;">
                <div style="width: 65px;" class="layout horizontal center-center">
                    <img
                        src="https://sandcastle.cesium.com/CesiumUnminified/Widgets/Images/NavigationHelp/TouchZoom.svg"
                        alt="Touch Zoom"
                        style="max-height: 50px;padding: 8px;"
                    />
                </div>
                <em>Aðdráttur</em>: Færðu tvo fingur saman<br />
            </div>
            <div class="layout horizontal" style="padding: 8px;">
                <div style="width: 65px;" class="layout horizontal center-center">
                    <img
                        src="https://sandcastle.cesium.com/CesiumUnminified/Widgets/Images/NavigationHelp/TouchRotate.svg"
                        alt="Touch Rotate"
                        style="max-height: 50px;padding: 8px;"
                    />
                </div>
                <em>Snúa</em>: Dragðu með tveimur fingrum, í mismunandi átt<br />
            </div>
            <div class="layout horizontal" style="padding: 8px;">
                <div style="width: 65px;" class="layout horizontal center-center">
                    <img
                        src="https://sandcastle.cesium.com/CesiumUnminified/Widgets/Images/NavigationHelp/TouchTilt.svg"
                        alt="Touch Tilt"
                        style="max-height: 50px;padding: 8px;"
                    />
                </div>
                <em>Halla</em>: Dragðu með tveimur fingrum, í sömu átt
            </div>
        </div>
        <div style="padding: 8px;" class="layout vertical">
            <b>Stjórn með mús:</b><br />
            <div class="layout horizontal">
              <div style="width: 75px; display: inline-block;">
                  <img
                      src="https://sandcastle.cesium.com/CesiumUnminified/Widgets/Images/NavigationHelp/MouseLeft.svg"
                      alt="Mouse Left"
                      style="max-height: 75px;"
                  />
              </div>
              <em>Færsla</em>: Vinstri smella + draga<br />
            </div>
            <div class="layout horizontal">
              <div style="width: 75px; display: inline-block;">
                  <img
                      src="https://sandcastle.cesium.com/CesiumUnminified/Widgets/Images/NavigationHelp/MouseRight.svg"
                      alt="Mouse Right"
                      style="max-height: 75px;"
                  />
              </div>
              <em>Aðdráttur</em>: Hægri smella + draga, eða skrolla með músarhjóli<br />
            </div>
            <div class="layout horizontal">
              <div style="width: 75px; display: inline-block;">
                  <img
                      src="https://sandcastle.cesium.com/CesiumUnminified/Widgets/Images/NavigationHelp/MouseMiddle.svg"
                      alt="Mouse Middle"
                      style="max-height: 75px;"
                  />
              </div>
              <div class="layout vertical">
                <em>Snúa</em>: Miðsmella + draga, eða CTRL + Vinstri/hægri smella + draga<br />
                <em>Halla</em>Dragðu með tveimur fingrum, í sömu átt
              </div>
            </div>
        </div>
    `,
      },
    } as TutorialPageData,
    functionality: {
      stage: "functionality",
      title: {
        en: "Functionality",
        is: "Virkni",
      },
      content: {
        en: `
          <div class="layout vertical">
            <p>
              Various buttons on the screen have the following functionality.
            </p>

            <div style="font-weight:bold;">Bottom of the screen:</div>
            <p>
              Land use types: Each button represents a different land use
              suggestion. Click a button, then the map to mark the area with the
              chosen land uses colour. Zoom for area sizes (1km2 or 9km2).
              Comment: Right of land use buttons. Click to leave explanations
              for your suggestions by clicking the comment button, then a land
              use you suggested.
            </p>

            <div style="font-weight:bold;">Right side of the screen:</div>
            <p>
              Home button: brings you back to starting point (centers you back
              to start view). Airplane button: lets you view the land from the
              vantage point of a small plane. Globe button: This is the default
              setting for the view of the land area. Click this to exit other
              viewing settings. Globe button with a search icon: This setting
              allows you to view place names within the land area of the game.
              Map button: This setting allows you to view the land area in map
              format. Question button: See instructions to control the 3D environment. Button with an arrow in a circle: Restart the game.
              Stop button: When you are ready to leave the game, click the button to close.
            </p>

            <div style="font-weight:bold;">Top of the screen:</div>
            <p>
              Submit button: Selecting this submits your land use suggestions
              and comments and leads you to the next survey.
            </p>

            <div style="font-weight:bold;">Second Survey:</div>
            <p>
              The second survey aims to gather information about participants'
              values and views on nature and the environment.
            </p>

            <div style="font-weight:bold;">Results Page:</div>
            <p>
              On the results page, you can view all participants' land use
              suggestions and comments. You can also add to other people's
              comments and participate in a conversation on their and your
              suggestions.
            </p>
          </div>
        `,
        is: `
          <div class="layout vertical">
            <p>
             Hnapparnir á skjánum hafa eftirfarandi virkni.
            </p>

            <div style="font-weight:bold;">Neðst á skjánum:</div>
            <p>
              Velja landnotkun: Hver hnappur táknar mismunandi
              landnotkunarmöguleika. Smelltu á hnapp og síðan á kortið til að
              merkja svæðið með völdum landnotkunarlit. Stærð svæðisins sem er
              valinn er 1km 2 eða 9km 2 eftir því sem þú færist nær eða fjær.
              Athugasemd: Hægra megin við landnotkunarhnappana er hnappur fyrir
              athugasemdir. Smelltu á hnappinn og veldu síðan
              landnotkunarreitinn til að rökstyðja val þitt.
            </p>

            <div style="font-weight:bold;">Hægra megin á skjánum:</div>
            <p>
              Heimahnappur: færir þig aftur á upphafsstað. Flugvélarhnappur:
              Skoða landið frá úr flugvél sem flýgur yfir. Hnatthnappur: Þetta
              er sjálfgefin stilling fyrir útsýni yfir landsvæðið. Lokar öðrum
              skoðunarstillingum. Hnatthnappur með leitartákni: Skoða
              staðaheiti og örnefni innan landssvæðis leiksins. Kortahnappur:
              Skoða landsvæðið á kortasniði. Spurningahnappur: Sjá leiðbeiningar til að stjórna 3D umhverfinu.
              Hnappur með ör í hring: Endurræsa leikinn.
              Hætta hnappur: Þegar þú ert tilbúin(n) til að yfirgefa leikinn smelltu á hnappinn til að loka.
            </p>

            <div style="font-weight:bold;">Efst á skjánum:</div>
            <p>
              Senda inn tillögur hnappur: Senda inn tillögur þínar um
              landnotkun með athugasemdum þínum.
            </p>

            <div style="font-weight:bold;">Seinni könnun:</div>
            <p>
              Miðar að því að afla upplýsinga um gildi og sýn þátttakenda á
              náttúru og umhverfi.
            </p>

            <div style="font-weight:bold;">Niðurstöður:</div>
            <p>
              Á niðurstöðusíðunni er hægt að skoða tillögur og athugasemdir
              allra þátttakenda um landnotkun. Þú getur líka bætt við
              athugasemdir annarra og tekið þátt í samtali um tillögur þeirra og
              þínar.
            </p>
          </div>
        `,
      },
    } as TutorialPageData,
    openResults: {
      stage: "openResults",
      title: {
        en: "Explore the results and debate",
        is: "Kynntu þér niðurstöður og ræddu",
      },
      content: {
        en: `
             <ul>
              <li>Your choices for land use have been received!</li>
              <li>Now you can see what other participants have said in their comments and participate in the discussion by clicking one of the comment symbols floating above the land use identification colors or by choosing the comments box placed at the right side of the land use buttons.</li>
              <li>You can also see the distribution and support for individual land use types by choosing one of them at the bottom of the screen.</li>
              <li>When you feel you have sufficiently contributed to the debate you finish the game by logging-out with the button on the right side of your screen.</li>
              <li>We hope you will recommend the game to people you know and share the link on social media.</li>
             </ul>
             `,
        is: `
            <ul>
              <li>Landnýtingarval þitt og athugasemdir þínar eru komnar til skila!</li>
              <li>Við hvetjum þig til að kynna þér líka hvað aðrir þátttakendur hafa sagt í sínum athugasemdum og taka þátt í umræðunni með því að smella á athugasemdatáknin á skjánum fyrir ofan litina sem auðkenna landnýtingu eða velja umræðutáknið hægra megin við landnýtingarhnappana.</li>
              <li>Þú getur líka séð dreifingu og stuðning við einstakar landnýtingarleiðir með því að velja viðeigandi hnapp neðst á skjánum.</li>
              <li>Þegar þér finnst þú hafa tekið nægan þátt í umræðum lýkur þú leik með því að velja útskráningartáknið neðst til hægri á skjánum.</li>
              <li>Þakka þér fyrir þátttökuna! Við vonum að þú mælir með leiknum og deilir honum með þeim sem þú heldur að gætu haft áhuga á þátttöku.</li>
            </ul>
          `,
      },
    } as TutorialPageData,
    noLandUseSelected: {
      stage: "noLandUseSelected",
      title: {
        en: "No land use selected",
        is: "Engin landnýting valin",
      },
      content: {
        en: `
             <p>Choose a land use at the bottom of the screen.</p>
             `,
        is: `<p>Veldu landnýtingu neðst á skjánum</p>`,
      },
    } as TutorialPageData,
    landUseAction: {
      stage: "landUseAction",
      title: {
        en: "Click on map",
        is: "Smeltu á kortið",
      },
      content: {
        en: `
             <p>Click on the map within the marked area to choose the land use</p>
             `,
        is: `<p>Smelltu á kortið innan merkts svæðis til þess að velja landnýtingu</p>`,
      },
    } as TutorialPageData,
    commentAction: {
      stage: "commentAction",
      title: {
        en: "Click on map",
        is: "Smelltu á kortið",
      },
      content: {
        en: `
             <p>Click on the map within the marked area to add a comment</p>
             `,
        is: `<p>Smelltu á kortið innan merkts svæðis til þess að bæta við athugasemd</p>`,
      },
    } as TutorialPageData,
  } as Record<TutorialStage, TutorialPageData>;

  haveShown: Array<TutorialStage> = [];

  openAll(
    helpPages: YpHelpPageData[],
    callbackFunction: Function | undefined = undefined
  ) {
    this.callbackFunction = callbackFunction;

    // Create a combined page for all stages
    let combinedContent: { en: string; is: string } = { en: "", is: "" };
    let combinedTitle: { en: string; is: string } = {
      en: "Help",
      is: "Hjálp",
    }; // Default titles for the main dialog

    const helpPage = helpPages[0];
    combinedContent.en += `<h2>${helpPage.title.en}</h2>\n\n${helpPage.content.en}`;
    combinedContent.is += `<h2>${helpPage.title.is}</h2>\n\n${helpPage.content.is}`;

    // Combine the content and title for all stages
    for (let stageKey in this.stages) {
      if (stageKey === "noLandUseSelected") continue;
      if (stageKey === "openResults") continue;
      if (stageKey === "landUseAction") continue;
      if (stageKey === "commentAction") continue;
      //@ts-ignore
      const stage = this.stages[stageKey];
      combinedContent.en += `<h2>${stage.title.en}</h2>\n\n${stage.content.en}`;
      combinedContent.is += `<h2>${stage.title.is}</h2>\n\n${stage.content.is}`;
    }

    // Create a new TutorialPageData with combined content and title
    const combinedPage: TutorialPageData = {
      stage: "allStages",
      title: combinedTitle,
      content: combinedContent,
    };

    // Open the combined page
    this._openPage(combinedPage, 1);
  }

  openStage(
    stage: TutorialStage,
    callbackFunction: Function | undefined = undefined,
    timeoutMs = 1200
  ) {
    this.callbackFunction = callbackFunction;
    if (!this.haveShown.includes(stage)) {
      this._openPage(this.stages[stage], timeoutMs);
      this.haveShown.push(stage);
    }
  }

  _getPageLocale(page: TutorialPageData) {
    let pageLocale = "en";
    if (page.title[window.appGlobals.locale!]) {
      pageLocale = window.appGlobals.locale!;
    } else if (page.title["en"]) {
      pageLocale = "en";
    } else {
      const key = Object.keys(page.title)[0];
      if (key) {
        pageLocale = key;
      }
    }

    return pageLocale;
  }

  _openPage(page: TutorialPageData, timeoutMs = 1200) {
    if (true) {
      setTimeout(() => {
        window.appGlobals.activity("open", "pages", page.id);
        window.appDialogs.getDialogAsync(
          "pageDialog",
          (dialog: YpPageDialog) => {
            const pageLocale = this._getPageLocale(page);
            this.fire("enableBrowserTouch", {}, document);

            dialog.open(
              page,
              pageLocale,
              this._myCallbackFunction.bind(this),
              this.t("continue")
            );
          }
        );
      }, timeoutMs);
    }
  }

  _myCallbackFunction() {
    this.fire("disableBrowserTouch", {}, document);
    if (this.callbackFunction) {
      this.callbackFunction();
    }
  }
}
