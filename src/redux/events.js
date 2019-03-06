import constants from "../config/constants";

const { EventActions } = constants;
const { LOAD_EVENTS, LOAD_EVENTS_BY_DATE, LOAD_EVENTS_BY_EPOCH, LOAD_EVENTS_BY_ORG } = EventActions;

const initialState = {
  events: {},
  photoEvents: [],
  eventsByDate: {},
  eventsByEpoch: {},
};

const Events = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_EVENTS:
      return {
        ...state,
        events: action.events,
      };
    case LOAD_EVENTS_BY_DATE:
      return {
        ...state,
        eventsByDate: action.eventsByDate,
      };
    case LOAD_EVENTS_BY_EPOCH:
      return {
        ...state,
        eventsByEpoch: action.eventsByEpoch,
      };
    case LOAD_EVENTS_BY_ORG:
      return {
        ...state,
        eventsByOrg: action.eventsByOrg,
      };
    default:
      return state;
  }
};

export default Events;
