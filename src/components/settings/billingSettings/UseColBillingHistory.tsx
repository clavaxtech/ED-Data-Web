import React from "react";
import { BillingHistoryObject } from "../../models/redux-models";
import moment from "moment";
import { USDollar, actionType } from "../../../utils/helper";
import { Link } from "react-router-dom";
import { downloadFileLogs } from "../../store/actions/files-actions";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { logUserAction } from "../../store/actions/auth-actions";

function useColBillingHistory() {
    const dispatch = useAppDispatch();
    const { auth: { user: { access_token } } } = useAppSelector(state => state)
    return [
        {
            title: "INVOICE",
            render: (rowData: BillingHistoryObject) => {
                const { company_name, basin_count, county_count } = rowData;
                return (
                    <>
                        <span>{company_name}</span>
                        <p>
                            Monthly Subscription: {basin_count} Basins +
                            {county_count} County
                        </p>
                    </>
                );
            },
        },
        {
            title: "Date",
            render: (rowData: BillingHistoryObject) => {
                const { invoice_date } = rowData;
                return (
                    <span>
                        {invoice_date
                            ? moment(invoice_date).format("MMM-DD-YYYY")
                            : "NA"}
                    </span>
                );
            },
        },
        {
            title: "Amount",
            render: (rowData: BillingHistoryObject) => {
                const { invoice_amount } = rowData;
                return (
                    <span>
                        {invoice_amount
                            ? USDollar.format(Number(invoice_amount))
                            : USDollar.format(0)}
                    </span>
                );
            },
        },
        {
            title: "Status",
            render: (rowData: BillingHistoryObject) => {
                return (
                    <>
                        <span className="status">
                            {rowData.payment_status ? "Paid" : "Failed"}
                        </span>
                    </>
                );
            },
        },
        {
            title: "Action",
            render: (rowData: BillingHistoryObject) => {
                const { stripe_invoice_pdf } = rowData;
                return (
                    <>
                        {stripe_invoice_pdf ? (
                            <Link
                                to={stripe_invoice_pdf}
                                target={"_blank"}
                                onClick={() => {
                                    dispatch(downloadFileLogs(access_token, { download_loc: "0" }));
                                    dispatch(
                                        logUserAction({
                                            action_type: actionType["download_docs"],
                                            action_log_detail:
                                                stripe_invoice_pdf,
                                        })
                                    );
                                }}
                                className="btn btn-primary"
                                rel="noreferrer"
                            >
                                <i className="fa-solid fa-file-invoice-dollar"></i>{" "}
                                View
                            </Link>
                        ) : (
                            <button
                                type="button"
                                className={`btn btn-disabled`}
                                disabled={true}
                            >
                                <i className="fa-solid fa-file-invoice-dollar"></i>{" "}
                                View
                            </button>
                        )}
                    </>
                );
            },
        },
    ];
}

export default useColBillingHistory;
