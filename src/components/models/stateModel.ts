export interface CartSelectBasinViewState {
    isOpen: boolean;
    tabIndex: number;
    deleteCartItemModal: boolean;
    deleteItemId: null | number;
    deleteItemType: null | number;
    sub_id: number | null;
    sub_total: number;
}

export type options = {
    label: string;
    value: string | number;
};
export interface DeactivateRemoveState {
    activeMembersOptions: options[];
}

export type DowData =
    | {
          well_api: string;
          production_date: string;
          production_quantity: string;
      }
    | { production_type: string; total: number }
    | { operator_name: string; total: number };
