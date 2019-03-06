import constants from "../config/constants";

const { EventActions } = constants;
const { LOAD_EVENTS, LOAD_EVENTS_BY_ORG, LOAD_EVENTS_BY_DATE, LOAD_EVENTS_BY_EPOCH } = EventActions;

export const setEvents = events => ({ type: LOAD_EVENTS, events });

export const setEventsByOrg = eventsByOrg => ({ type: LOAD_EVENTS_BY_ORG, eventsByOrg });

export const setEventsByDate = eventsByDate => ({ type: LOAD_EVENTS_BY_DATE, eventsByDate });

export const setEventsByEpoch = eventsByEpoch => ({ type: LOAD_EVENTS_BY_EPOCH, eventsByEpoch });
