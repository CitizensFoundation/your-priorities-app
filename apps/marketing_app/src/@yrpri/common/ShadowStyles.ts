/**
@license
Copyright (c) 2010-2020 Citizens Foundation
*/

import { css } from 'lit';

export const ShadowStyles = css`
  .shadow-transition {
     transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
   }

  .shadow-elevation-2dp {
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                0 1px 5px 0 rgba(0, 0, 0, 0.12),
                0 3px 1px -2px rgba(0, 0, 0, 0.2);
  }

  .shadow-elevation-3dp {
    box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14),
                0 1px 8px 0 rgba(0, 0, 0, 0.12),
                0 3px 3px -2px rgba(0, 0, 0, 0.4);
  }

  .shadow-elevation-4dp {
    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
                0 1px 10px 0 rgba(0, 0, 0, 0.12),
                0 2px 4px -1px rgba(0, 0, 0, 0.4);
  }

  .shadow-elevation-6dp {
    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14),
                0 1px 18px 0 rgba(0, 0, 0, 0.12),
                0 3px 5px -1px rgba(0, 0, 0, 0.4);
  }

  .shadow-elevation-8dp {
    box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14),
                0 3px 14px 2px rgba(0, 0, 0, 0.12),
                0 5px 5px -3px rgba(0, 0, 0, 0.4);

  }
  .shadow-elevation-12dp {
    box-shadow: 0 12px 16px 1px rgba(0, 0, 0, 0.14),
                0 4px 22px 3px rgba(0, 0, 0, 0.12),
                0 6px 7px -4px rgba(0, 0, 0, 0.4);
  }

  .shadow-elevation-16dp {
    box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14),
                0  6px 30px 5px rgba(0, 0, 0, 0.12),
                0  8px 10px -5px rgba(0, 0, 0, 0.4);
  }
  .shadow-elevation-24dp {
    box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14),
                0 9px 46px 8px rgba(0, 0, 0, 0.12),
                0 11px 15px -7px rgba(0, 0, 0, 0.4);
  }
`;
