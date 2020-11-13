import { FlexPlugin } from 'flex-plugin';
import { ColumnDefinition } from "@twilio/flex-ui";
import TeamViewColumn from './components/TeamViewColumn';

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

    flex.WorkersDataTable.Content.add(
      <ColumnDefinition 
        key="team" 
        header={"Voice Activity"} 
        content={item => <TeamViewColumn item={item} /> }
      />
    );

    flex.TeamsView.defaultProps.filters = [
      flex.TeamsView.activitiesFilter,
      subActivityFilter
    ];

  }

}
