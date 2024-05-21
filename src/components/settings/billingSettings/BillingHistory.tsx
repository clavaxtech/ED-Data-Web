import React from "react";
import GlobalTable from "../../common/GlobalTable";
import useColBillingHistory from "./UseColBillingHistory";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import moment from "moment";
import { USDollar, actionType } from "../../../utils/helper";
import { GlobalTableProps } from "../../models/page-props";
import { GlobalPagination } from "../../common/Pagination";
import { Link, useNavigate } from "react-router-dom";
import NoDataFound from "../../common/NoDataFound";
import { downloadFileLogs } from "../../store/actions/files-actions";
import { logUserAction } from "../../store/actions/auth-actions";

function BillingHistory({
    page,
    onPageChange,
}: {
    page: number;
    onPageChange: (page: number) => void;
}) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const {
        billingSettings: { paymentHistoryData },
        auth: { user: { access_token } }
    } = useAppSelector((state) => state);
    const {
        history_data,
        total_record,
        latest: {
            company_name,
            basin_count,
            county_count,
            invoice_date,
            invoice_amount,
            payment_status,
            stripe_invoice_pdf,
        },
        page_size,
    } = paymentHistoryData;
    return (
        <div
            className="tab-pane fade show active"
            id="pills-billing-history"
            role="tabpanel"
            aria-labelledby="pills-billing-history-tab"
        >
            <div className="item">
                <h3>Billing History</h3>
                <p>
                    Easily track your billing history, view, and download
                    invoices all in one place.
                </p>
            </div>
            {!invoice_date && (
                <NoDataFound
                    ImageSrc="images/no-billing.svg"
                    headingLabel="You Have No Billing History"
                    description="You're currently not subscribed to a State or Basin.
                    Subscribe to geographical area to get started and unlock
                    valuable insights."
                    onBtnClick={() => navigate("/cart-select-basin")}
                    btnLabel="Subscribe Now"
                />
            )}
            <div className={invoice_date ? `item` : "d-none"}>
                <h3 className="mb-4">Most Recent Invoice</h3>
                <div className="customPlanCard">
                    <div className="left">
                        <h3>{company_name}</h3>
                        <p>
                            Monthly Subscription: {basin_count} Basins +{" "}
                            {county_count} County
                        </p>
                        <p className="date">
                            {invoice_date
                                ? moment(invoice_date).format("MMM-DD-YYYY")
                                : "NA"}
                        </p>
                    </div>
                    <div className="right">
                        <div className="dollerPrice">
                            {invoice_amount
                                ? USDollar.format(Number(invoice_amount))
                                : USDollar.format(0)}
                        </div>
                        <div className="status">
                            {payment_status ? "Paid" : "Failed"}
                        </div>
                        <div>
                            {stripe_invoice_pdf ? (
                                <Link
                                    to={stripe_invoice_pdf}
                                    target={"_blank"}
                                    className="btn btn-primary"
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
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={
                    history_data && history_data.length > 0 ? `item` : "d-none"
                }
            >
                <h3 className="mb-4">Billing History</h3>
                <div className="billingHistoryTable">
                    <GlobalTable
                        tableStyle={{
                            border: 0,
                            cellPadding: 0,
                            cellSpacing: 0,
                        }}
                        cols={
                            useColBillingHistory() as GlobalTableProps["cols"]
                        }
                        data={
                            history_data && history_data.length !== 0
                                ? history_data
                                : []
                        }
                    />
                </div>
                <GlobalPagination
                    currentPage={page}
                    totalPages={
                        total_record && page_size
                            ? Math.floor(total_record / page_size) +
                            (total_record % page_size > 0 ? 1 : 0)
                            : 1
                    }
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
}

export default BillingHistory;
