import fetchMock from 'fetch-mock';
export declare class YpTestHelpers {
    static setupApp(): Promise<void>;
    static get fetchMockConfig(): {
        headers: {
            'Content-Type': string;
        };
    };
    static getDomain(): YpDomainData;
    static getCommunity(): YpCommunityData;
    static getPost(): YpPostData;
    static getPoint(): YpPointData;
    static getUser(): YpUserData;
    static getGroup(): YpGroupData;
    static getGroupResults(): {
        group: YpGroupData;
        hasNonOpenPosts: boolean;
    };
    static getImages(): Array<YpImageData>;
    static getFetchMock(): fetchMock.FetchMockStatic;
    static renderCommonHeader(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=setup-app.d.ts.map