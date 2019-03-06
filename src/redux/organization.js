import constants from "../config/constants";

const { OrgActions } = constants;
const {
  LOAD_ORGS,
} = OrgActions;

const initialState = {
  orgs: {},
};

const Organization = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ORGS:
      return {
        ...state,
        orgs: action.orgs,
      };
    default:
      return state;
  }
};

export default Organization;
