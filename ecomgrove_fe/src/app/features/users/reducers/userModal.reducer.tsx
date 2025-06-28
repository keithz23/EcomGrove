export type UserModalState = {
  showAdd: boolean;
  showEdit: boolean;
  showDelete: boolean;
};

export type UserModalAction =
  | { type: "SHOW_ADD" }
  | { type: "SHOW_EDIT" }
  | { type: "SHOW_DELETE" }
  | { type: "CLOSE_ALL" };

export const initialModalState: UserModalState = {
  showAdd: false,
  showEdit: false,
  showDelete: false,
};

export function userModalReducer(
  state: UserModalState,
  action: UserModalAction
): UserModalState {
  switch (action.type) {
    case "SHOW_ADD":
      return { ...initialModalState, showAdd: true };
    case "SHOW_EDIT":
      return {
        ...initialModalState,
        showEdit: true,
      };
    case "SHOW_DELETE":
      return {
        ...initialModalState,
        showDelete: true,
      };
    case "CLOSE_ALL":
      return initialModalState;
    default:
      return state;
  }
}
