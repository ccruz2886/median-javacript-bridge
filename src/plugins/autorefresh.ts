import { addCommand } from '../utils';

type AutoRefreshParams = {
  enabled: boolean;
  interval: number;
  url?: string;
};

const autorefresh = {
  set: function (params: AutoRefreshParams) {
    addCommand('median://autorefresh/set', params);
  },
};

export default autorefresh;
