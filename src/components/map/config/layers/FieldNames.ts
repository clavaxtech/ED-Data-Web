export default class FieldNames {
    // Active Listing Fields (Do NOT mix and match in code with All Wells fieldname vars)
    static listingWellPointsApi = "Well_API";
    static listingWellPointsListingId = "LISTING_ID";
    static listingWellPointsTypeId = "Parsed_Status_Id";
    // All Well Points Fields (Do NOT mix and match in code with Active Listing fieldname vars)
    static wellPointsOperatorName = "Well_Operator_Name";
    static wellPointsWellName = "Well_Name";
    static wellPointsApi = "Well_API";
    static wellPointsWellTypeName = "Parsed_Status_Name";
    static wellPointsCounty = "county";
    static wellPointsStateAbbr = "state_abbr";
    static wellPointsLegalTownship = "Well_LegalDesc_Township";
    static wellPointsLegalRange = "Well_LegalDesc_Range";
    static wellPointsLegalSection = "Well_LegalDesc_Section";
    static wellPointsLegalAbstract = "Well_LegalDesc_Abstract";
    static wellPointsLegalBlock = "Well_LegalDesc_Block";
    static wellPointsLegalText = "Well_LegalDesc_Text";
    static wellPointsLegalAbbr = "Well_LegalDesc_Abbr";
    static wellPointsLegalQuarterSection = "Well_LegalDesc_QuarterSection";
    static wellPointsLegalLot = "Well_LegalDesc_Lot";
    static wellPointsLegalSurvey = "Well_LegalDesc_Survey";
    static wellPointsField = "Well_Field_Name";
    static wellPointsBasin = "basin_name";
    static wellPointsDepth = "Well_Depth";
    static wellPointsIsVertical = "Well_Is_Vertical";
    static wellPointsSpudDate = "Well_Spud_Date";
    static wellPointsCompletionDate = "Well_Completion_Date";
    static wellPointsProductionDate = "Well_Production_Date";
    static wellPointsStateLink = "Well_Link";
    static wellPointsPermitDate = "Well_Permit_Date";
    static wellDataPointsTypeId = "parsed_status_id";
    static wellPointsTypeId = "actual_status_id";
    static wellPointsTypeName = "Parsed_Status_Name";
    static wellPointsIsSurfacePoint = "is_surface_point";
    static wellPointsCount = "Well_All_Points_Count";
    static wellPointsLatitude = "LATITUDE";
    static wellPointsLongitude = "LONGITUDE";
    //JSON construct fields for all listing highlight
    static listingId = "listingId";
    static listingNMA = "NMA";
    static listingNRA = "NRA";
    static listingWells = "Wells";
    static listingTracts = "Tracts";
    static listingAvgRevenue = "AvgRevenue";
    static listingAuctionCurrentBid = "AuctionCurrentBid";
    static listingAuctionTimeLeft = "AuctionTimeLeft";
    static listingBuyNowPrice = "BuyNowPrice";
    static listingOpWiGrossWiAcs = "GrossWIAcs";
    static listingOpWiAvgWiPercent = "AvgWIPercent";
    static listingOpWiAvgNRIPercent = "AvgNRIPercent";
    static isNapeListing = "is_nape_listing";
    static listingBoothNumber = "booth_number";
    static sealedBidInitialBuyerOfferEndDate = "BidsDue";

    //JSON construct alias names
    static listingNMAAlias = "NMA";
    static listingNRAAlias = "NRA";
    static listingWellsAlias = "Wells";
    static listingTractsAlias = "Tracts";
    static listingAvgRevenueAlias = "Avg Revenue";
    static listingAuctionCurrentBidAlias = "Current Bid";
    static listingAuctionTimeLeftAlias = "Time Left";
    static listingBuyNowPriceAlias = "Buy Now Price";
    static listingOpWiGrossWiAcsAlias = "Gross WI Acs";
    static listingOpWiAvgWiPercentAlias = "Avg WI%";
    static listingOpWiAvgNRIPercentAlias = "Avg NRI%";
    static sealedBidInitialBuyerOfferEndDateAlias = "Bids Due";

    //County Stats
    static countyStatsBasinName = "basin_name";
    static countyStatsCountyName = "county_name";
    static countyStatsStateAbbr = "state_abbr";
    static countyWellTotals = "total_wells";
    

    // All Well Lines Fields
    static wellLinesApi = "Well_API";

    // Tracts
    static tracksIsManual = "Is_Manual";
    static tractsListingId = "LISTING_ID";

    // Units
    static unitsIsManual = "Is_Manual";
    static unitsListingId = "LISTING_ID";

    //Panel Filters
    static queryPanelKeys = ['well_type', 'well_status', 'drill_type', 'production_type',
        'well_name',
        'well_no',
        "operator",
        "state_abbr",
        "county",
        "basin"];
    static rigFields = [
        'well_api',
        "operator_name",
        "state_abbr",
        "county",
        "basin_name"];
    static panelKeyMatch = [
        'well_type',
        'well_status',
        'drill_type',
        'well_product',
        'well_name',
        'well_api',
        'operator_name',
        'state_abbr',
        'county',
        'basin_name'];
}
