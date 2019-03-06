import constants from "../config/constants";

const { OrgActions } = constants;
const { LOAD_ORGS } = OrgActions;

export const loadOrgs = (orgs) => ({ type: LOAD_ORGS, orgs });

export const getOrgs = (orgs) => (dispatch) => {
  dispatch(loadOrgs(orgs));
};
