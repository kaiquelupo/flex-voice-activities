import { FlexPlugin } from 'flex-plugin';

const PLUGIN_NAME = 'SubActivitiesPlugin';

export default class SubActivitiesPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  init(flex) {

    const subActivityFilter = {
      id: "data.attributes.voiceActivity",
      title: "Voice Activities",
      fieldName: "voiceActivity",
      type: "multiValue",
      condition: "IN",
      options: [
        {
          value: "waiting",
          label: "Waiting",
          default: false
        },
        {
            value: "busy",
            label: "Busy",
            default: false
        },
        {
          value: "warm-transfer",
          label: "Warm Transfer",
          default: false
        }
      ]
  }

    flex.TeamsView.defaultProps.filters = [
      flex.TeamsView.activitiesFilter,
      subActivityFilter
    ];

  }

}
