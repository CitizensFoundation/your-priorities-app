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
               <b>Touch navigation</b><br/>
               <em>Pan</em>: One finger drag<br/>
               <em>Zoom</em>: Two finger pinch.<br/>
               <em>Rotate</em>: Two finger drag, opposite direction.<br/>
               <em>Tilt</em>: Two finger drag, same direction.
             </p>
             <p>
               <b>Mouse navigation</b><br/>
               <em>Pan</em>: Left click + drag<br/>
               <em>Zoom</em>: Right click + drag, or Mouse wheel scroll.<br/>
               <em>Rotate</em>: Middle click + drag, or CTRL + Left/Right click + drag<br/>
               <em>Tilt</em>: Two finger drag, same direction.
             </p>
             `,
        is: `<p>
              <b>Stjórn með snertiskjá</b><br/>
              <em>Færsla</em>: Dragðu með einum fingri<br/>
              <em>Aðdráttur</em>: Færðu tvo fingur saman.<br/>
              <em>Snúa</em>: Dragðu með tveimur fingrum, í mismunandi átt.<br/>
              <em>Halla</em>: Dragðu með tveimur fingrum, í sömu átt.
            </p>
            <p>
              <b>Stjórn með mús</b><br/>
              <em>Færsla</em>: Vinstri smella + draga<br/>
              <em>Aðdráttur</em>: Hægri smella + draga, eða skrolla með músarhjóli.<br/>
              <em>Snúa</em>: Miðsmella + draga, eða CTRL + Vinstri/Hægri smella + draga<br/>
              <em>Halla</em>: Dragðu með tveimur fingrum, í sömu átt.
            </p>`,
      },
    } as TutorialPageData,
    chooseType: {
      stage: "chooseType",
      title: {
        en: "Choose land use type or comment",
        is: "Veldu landnýtingu eða bættu við athugasemd",
      },
      content: {
        en: `
             <ul>
              <li>
                  Choose land use type or to make a comment at the bottom of the screen.
              </li>
              <li>
                Then you can click on the map to mark that area as the chosen land use type.
              </li>
              <li>
                If you zoom in and click you choose 1 km2, if you zoom and click out you choose 9 km2.
              </li>
              <li>
                  You can also click on the map to make a comment about your choices.
              </li>
             </ul>

             `,
        is: `<ul>
            <li>
              Veldu notkunartegund lands eða athugasemd neðst á skjánum.
            </li>
            <li>
              Þá geturðu smellt á kortið til að merkja það svæði sem valda nýtingu lands.
            </li>
            <li>
              Ef þú ert nær landinu og smellir velurðu 1 km², ef þú er langt í burtu og smellir velurðu 9 km².
            </li>
            <li>
              Þú getur einnig smellt á kortið til að bæta athugasemd um þitt val.
            </li>
          </ul>`,
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
              <li>
                  You can choose a land use to filter by that type.
              </li>
              <li>
                You can click on the comment icons to take part in the discussion.
              </li>
             </ul>
             `,
        is: `<ul>
            <li>
                Þú getur valið tegund landnýtingar til að sía eftir. Ef ekkert er valið sérðu allar tegundir landnýtinga
            </li>
            <li>
              Þú getur smellt á athugasemdartáknin til að taka þátt í umræðunni.
            </li>
          </ul>`,
      },
    } as TutorialPageData,
  } as Record<TutorialStage, TutorialPageData>;

  haveShown: Array<TutorialStage> = [];

  openStage(
    stage: TutorialStage,
    callbackFunction: Function | undefined = undefined
  ) {
    this.callbackFunction = callbackFunction;
    if (!this.haveShown.includes(stage)) {
      this._openPage(this.stages[stage]);
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

  _openPage(page: TutorialPageData) {
    if (true) {
      setTimeout(() => {
        window.appGlobals.activity("open", "pages", page.id);
        window.appDialogs.getDialogAsync("pageDialog", (dialog: YpPageDialog) => {
          const pageLocale = this._getPageLocale(page);
          this.fire("enableBrowserTouch", {}, document);

          dialog.open(
            page,
            pageLocale,
            this._myCallbackFunction.bind(this),
            this.t("continue")
          );
        });
      }, 1200);
    }
  }

  _myCallbackFunction() {
    this.fire("disableBrowserTouch", {}, document);
    if (this.callbackFunction) {
      this.callbackFunction();
    }
  }
}
