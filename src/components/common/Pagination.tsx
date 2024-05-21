import { PaginateProps } from "../models/page-props";

export const GlobalPagination = (props: PaginateProps) => {
    let { currentPage, totalPages, onPageChange } = props;
    if (totalPages < 1 || currentPage > totalPages) return <></>;
    return (
        <div className={"pagination"}>
            <div className={"paginationWrapper"}>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    type="button"
                    className={"pageItem sides"}
                    disabled={currentPage === 1}
                >
                    ❮ &nbsp; Previous
                </button>

                <button
                    onClick={() => onPageChange(1)}
                    type="button"
                    className={
                        currentPage === 1 ? "pageItem active" : "pageItem"
                    }
                >
                    {1}
                </button>

                {currentPage > 3 && <div className={"separator"}>...</div>}

                {currentPage === totalPages && totalPages > 3 && (
                    <button
                        onClick={() => onPageChange(currentPage - 2)}
                        type="button"
                        className={"pageItem"}
                    >
                        {currentPage - 2}
                    </button>
                )}

                {currentPage > 2 && (
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        type="button"
                        className={"pageItem"}
                    >
                        {currentPage - 1}
                    </button>
                )}

                {currentPage !== 1 && currentPage !== totalPages && (
                    <button
                        onClick={() => onPageChange(currentPage)}
                        type="button"
                        className={["pageItem", "active"].join(" ")}
                    >
                        {currentPage}
                    </button>
                )}

                {currentPage < totalPages - 1 && (
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        type="button"
                        className={"pageItem"}
                    >
                        {currentPage + 1}
                    </button>
                )}

                {currentPage === 1 && totalPages > 3 && (
                    <button
                        onClick={() => onPageChange(currentPage + 2)}
                        type="button"
                        className={"pageItem"}
                    >
                        {currentPage + 2}
                    </button>
                )}

                {currentPage < totalPages - 2 && (
                    <div className={"separator"}>...</div>
                )}

                {totalPages > 1 && (
                    <button
                        onClick={() => onPageChange(totalPages)}
                        type="button"
                        className={
                            currentPage === totalPages
                                ? "pageItem active"
                                : "pageItem"
                        }
                    >
                        {totalPages}
                    </button>
                )}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    type="button"
                    disabled={currentPage === totalPages}
                    className={"pageItem sides"}
                >
                    Next &nbsp; ❯
                </button>
            </div>
        </div>
    );
};
