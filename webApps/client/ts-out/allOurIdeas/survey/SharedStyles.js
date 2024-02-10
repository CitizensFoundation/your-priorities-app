import { css } from 'lit';
export const SharedStyles = css `
  .questionTitle {
    padding: 18px;
    font-size: 24px;
    padding: 8px;
    text-align: center;
    margin-top: 16px;
    border-radius: 16px;
    margin-bottom: 0px;
    margin-top: 16px;
    margin-left: 32px;
    margin-right: 32px;
    max-width: 632px;
  }

  [hidden] {
    display: none !important;
  }

  @media (max-width: 960px) {
    .questionTitle {
      margin-bottom: 16px;
      max-width: 100%;
    }

    .questionTitle[dark-mode] {

    }
}
`;
//# sourceMappingURL=SharedStyles.js.map