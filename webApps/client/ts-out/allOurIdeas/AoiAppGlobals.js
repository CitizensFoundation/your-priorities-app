import { YpAppGlobals } from '../yp-app/YpAppGlobals.js';
export class AoiAppGlobals extends YpAppGlobals {
    constructor(serverApi) {
        super(serverApi, true);
        this.disableParentConstruction = true;
        this.getEarlName = () => {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('name')) {
                return urlParams.get('name');
            }
            else {
                const pathSegments = window.location.pathname.split('/');
                if (pathSegments.length >= 4 && pathSegments[3]) {
                    return pathSegments[3];
                }
            }
            console.error(`Earl name not found in URL or path: ${window.location.href}`);
            return null;
        };
        this.setIds = (e) => {
            this.questionId = e.detail.questionId;
            this.earlId = e.detail.earlId;
            this.promptId = e.detail.promptId;
        };
        this.parseQueryString = () => {
            const query = (window.location.search || '?').substr(1);
            let map = {};
            const re = /([^&=]+)=?([^&]*)(?:&+|$)/g;
            let match;
            while ((match = re.exec(query))) {
                const key = match[1];
                const value = match[2];
                map[key] = value;
            }
            this.originalQueryParameters = map;
        };
        this.getSessionFromCookie = () => {
            const strCookies = document.cookie;
            const cookiearray = strCookies.split(';');
            let sid = '';
            for (let i = 0; i < cookiearray.length; i++) {
                let name = cookiearray[i].split('=')[0];
                let value = cookiearray[i].split('=')[1];
                if (name.trim() === '_all_our_ideas_session') {
                    sid = value;
                }
            }
            return sid;
        };
        this.activity = (type, object = undefined) => {
            let actor;
            if (window.appUser && window.appUser.user) {
                actor = window.appUser.user.id.toString();
            }
            else {
                actor = '-1';
            }
            const date = new Date();
            const body = {
                actor: actor,
                type: type,
                object: object,
                path_name: location.pathname,
                event_time: date.toISOString(),
                session_id: this.getSessionFromCookie(),
                originalQueryString: this.getOriginalQueryString(),
                originalReferrer: this.originalReferrer,
                questionId: this.questionId,
                earlId: this.earlId,
                promptId: this.promptId,
                earlName: this.earlName,
                userLocale: window.locale,
                userAutoTranslate: window.autoTranslate,
                user_agent: navigator.userAgent,
                referrer: document.referrer,
                url: location.href,
                screen_width: window.innerWidth,
            };
            try {
                fetch('/api/analytics/createActivityFromApp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                })
                    .then(response => {
                    if (!response.ok) {
                        console.error(`HTTP error! status: ${response.status}`);
                    }
                    else {
                        if (type === 'Voting - left' ||
                            type === 'Voting - right' ||
                            type === 'New Idea - added') {
                            this.checkExternalGoalTrigger(type);
                        }
                    }
                })
                    .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
            }
            catch (error) {
                console.error(error);
            }
        };
        this.parseQueryString();
        this.earlName = this.getEarlName();
        this.originalReferrer = document.referrer;
        document.addEventListener('set-ids', this.setIds.bind(this));
    }
    getOriginalQueryString() {
        if (this.originalQueryParameters) {
            return new URLSearchParams(this.originalQueryParameters).toString();
        }
        else {
            return null;
        }
    }
}
//# sourceMappingURL=AoiAppGlobals.js.map