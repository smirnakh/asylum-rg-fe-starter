import React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import CitizenshipMapAll from './Graphs/CitizenshipMapAll';
import CitizenshipMapSingleOffice from './Graphs/CitizenshipMapSingleOffice';
import TimeSeriesAll from './Graphs/TimeSeriesAll';
import OfficeHeatMap from './Graphs/OfficeHeatMap';
import TimeSeriesSingleOffice from './Graphs/TimeSeriesSingleOffice';
import YearLimitsSelect from './YearLimitsSelect';
import ViewSelect from './ViewSelect';
import axios from 'axios';
import { resetVisualizationQuery } from '../../../state/actionCreators';
//import test_data from '../../../data/test_data.json';
import { colors } from '../../../styles/data_vis_colors';
import ScrollToTopOnMount from '../../../utils/scrollToTopOnMount';

const { background_color } = colors;

function GraphWrapper(props) {
  const { set_view, dispatch } = props;
  let { office, view } = useParams();
  if (!view) {
    set_view('time-series');
    view = 'time-series';
  }
  let map_to_render;
  if (!office) {
    switch (view) {
      case 'time-series':
        map_to_render = <TimeSeriesAll />;
        break;
      case 'office-heat-map':
        map_to_render = <OfficeHeatMap />;
        break;
      case 'citizenship':
        map_to_render = <CitizenshipMapAll />;
        break;
      default:
        break;
    }
  } else {
    switch (view) {
      case 'time-series':
        map_to_render = <TimeSeriesSingleOffice office={office} />;
        break;
      case 'citizenship':
        map_to_render = <CitizenshipMapSingleOffice office={office} />;
        break;
      default:
        break;
    }
  }
  async function updateStateWithNewData(
    years,
    view,
    office,
    stateSettingCallback
  ) {
    /*
          _   https://hrf-asylum-be-b.herokuapp.com/cases                                                                          _
        |                                                                                 |
        |   Example request for once the `/summary` endpoint is up and running:           |
        |                                                                                 |
        |     `${url}/summary?to=2022&from=2015&office=ZLA`                               |
        |                                                                                 |
        |     so in axios we will say:                                                    |
        |                                                                                 |     
        |       axios.get(`${url}/summary`, {                                             |
        |         params: {                                                               |
        |           from: <year_start>,                                                   |
        |           to: <year_end>,                                                       |
        |           office: <office>,       [ <-- this one is optional! when    ]         |
        |         },                        [ querying by `all offices` there's ]         |
        |       })                          [ no `office` param in the query    ]         |
        |                                                                                 |
          _                                                                             _
                                   -- Mack 
    
    */

    try {
      if (office === 'all' || !office) {
        const citizenshipData = await axios.get(
          'https://hrf-asylum-be-b.herokuapp.com/cases/citizenshipSummary',
          {
            // mock URL, can be simply replaced by `${Real_Production_URL}/summary` in prod!
            params: {
              from: years[0],
              to: years[1],
            },
          }
        );
        const fiscalData = await axios.get(
          'https://hrf-asylum-be-b.herokuapp.com/cases/fiscalSummary',
          {
            // mock URL, can be simply replaced by `${Real_Production_URL}/summary` in prod!
            params: {
              from: years[0],
              to: years[1],
            },
          }
        );
        const allData = [
          {
            yearResults: fiscalData.data.yearResults,
            citizenshipResults: citizenshipData.data,
          },
        ];
        console.log('allData', allData);
        stateSettingCallback(view, office, allData);
      } else {
        const citizenshipData = await axios.get(
          'https://hrf-asylum-be-b.herokuapp.com/cases/citizenshipSummary',
          {
            params: {
              from: years[0],
              to: years[1],
              office: office,
            },
          }
        );
        const fiscalData = await axios.get(
          'https://hrf-asylum-be-b.herokuapp.com/cases/fiscalSummary',
          {
            params: {
              from: years[0],
              to: years[1],
            },
          }
        );
        const allData = [
          {
            yearResults: fiscalData.data.yearResults,
            citizenshipResults: citizenshipData.data,
          },
        ];
        stateSettingCallback(view, office, allData);
      }
    } catch (err) {
      console.log('data fetching', err);
    }
  }
  const clearQuery = (view, office) => {
    dispatch(resetVisualizationQuery(view, office));
  };
  return (
    <div
      className="map-wrapper-container"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        minHeight: '50px',
        backgroundColor: background_color,
      }}
    >
      <ScrollToTopOnMount />
      {map_to_render}
      <div
        className="user-input-sidebar-container"
        style={{
          width: '300px',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <ViewSelect set_view={set_view} />
        <YearLimitsSelect
          view={view}
          office={office}
          clearQuery={clearQuery}
          updateStateWithNewData={updateStateWithNewData}
        />
      </div>
    </div>
  );
}

export default connect()(GraphWrapper);
