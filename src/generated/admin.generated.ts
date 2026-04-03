/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import * as AdminTypes from './admin.types.js';

export type BulkQueryMutationVariables = AdminTypes.Exact<{
  query: AdminTypes.Scalars['String']['input'];
  groupObjects?: AdminTypes.InputMaybe<AdminTypes.Scalars['Boolean']['input']>;
}>;


export type BulkQueryMutation = { bulkOperationRunQuery?: AdminTypes.Maybe<{ bulkOperation?: AdminTypes.Maybe<Pick<AdminTypes.BulkOperation, 'id' | 'status' | 'createdAt'>>, userErrors: Array<Pick<AdminTypes.BulkOperationUserError, 'field' | 'message'>> }> };

export type BulkQueryStatusQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type BulkQueryStatusQuery = { currentBulkOperation?: AdminTypes.Maybe<Pick<AdminTypes.BulkOperation, 'id' | 'status' | 'errorCode' | 'objectCount' | 'fileSize' | 'url' | 'partialDataUrl' | 'createdAt' | 'completedAt' | 'query'>> };

export type GetCollectionQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
  productFirst: AdminTypes.Scalars['Int']['input'];
  after?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type GetCollectionQuery = { collection?: AdminTypes.Maybe<(
    Pick<AdminTypes.Collection, 'id' | 'title' | 'handle' | 'descriptionHtml' | 'sortOrder' | 'updatedAt'>
    & { ruleSet?: AdminTypes.Maybe<(
      Pick<AdminTypes.CollectionRuleSet, 'appliedDisjunctively'>
      & { rules: Array<Pick<AdminTypes.CollectionRule, 'column' | 'relation' | 'condition'>> }
    )>, products: { edges: Array<{ node: Pick<AdminTypes.Product, 'id' | 'title' | 'handle' | 'status' | 'totalInventory'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  )> };

export type ListCollectionsQueryVariables = AdminTypes.Exact<{
  first: AdminTypes.Scalars['Int']['input'];
  query?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
  after?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type ListCollectionsQuery = { collections: { edges: Array<{ node: Pick<AdminTypes.Collection, 'id' | 'title' | 'handle' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } };

export type CreateCollectionMutationVariables = AdminTypes.Exact<{
  input: AdminTypes.CollectionInput;
}>;


export type CreateCollectionMutation = { collectionCreate?: AdminTypes.Maybe<{ collection?: AdminTypes.Maybe<Pick<AdminTypes.Collection, 'id' | 'title' | 'handle' | 'updatedAt'>>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type AddProductsToCollectionMutationVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
  productIds: Array<AdminTypes.Scalars['ID']['input']> | AdminTypes.Scalars['ID']['input'];
}>;


export type AddProductsToCollectionMutation = { collectionAddProducts?: AdminTypes.Maybe<{ collection?: AdminTypes.Maybe<Pick<AdminTypes.Collection, 'id' | 'title' | 'handle'>>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type RemoveProductsFromCollectionMutationVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
  productIds: Array<AdminTypes.Scalars['ID']['input']> | AdminTypes.Scalars['ID']['input'];
}>;


export type RemoveProductsFromCollectionMutation = { collectionRemoveProducts?: AdminTypes.Maybe<{ job?: AdminTypes.Maybe<Pick<AdminTypes.Job, 'id' | 'done'>>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type GetCustomerQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type GetCustomerQuery = { customer?: AdminTypes.Maybe<(
    Pick<AdminTypes.Customer, 'id' | 'firstName' | 'lastName' | 'email' | 'phone' | 'state' | 'tags' | 'createdAt' | 'updatedAt'>
    & { defaultAddress?: AdminTypes.Maybe<Pick<AdminTypes.MailingAddress, 'id' | 'address1' | 'address2' | 'city' | 'province' | 'country' | 'zip'>>, addresses: Array<Pick<AdminTypes.MailingAddress, 'id' | 'address1' | 'address2' | 'city' | 'province' | 'country' | 'zip'>>, orders: { edges: Array<{ node: (
          Pick<AdminTypes.Order, 'id' | 'name' | 'createdAt' | 'displayFinancialStatus'>
          & { currentTotalPriceSet: { shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> } }
        ) }> }, metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest'> }> } }
  )> };

export type ListCustomersQueryVariables = AdminTypes.Exact<{
  first: AdminTypes.Scalars['Int']['input'];
  query?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
  after?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type ListCustomersQuery = { customers: { edges: Array<{ node: Pick<AdminTypes.Customer, 'id' | 'firstName' | 'lastName' | 'email' | 'phone' | 'state' | 'tags' | 'createdAt' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } };

export type CreateCustomerMutationVariables = AdminTypes.Exact<{
  input: AdminTypes.CustomerInput;
}>;


export type CreateCustomerMutation = { customerCreate?: AdminTypes.Maybe<{ customer?: AdminTypes.Maybe<Pick<AdminTypes.Customer, 'id' | 'firstName' | 'lastName' | 'email' | 'phone' | 'state'>>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type UpdateCustomerMutationVariables = AdminTypes.Exact<{
  input: AdminTypes.CustomerInput;
}>;


export type UpdateCustomerMutation = { customerUpdate?: AdminTypes.Maybe<{ customer?: AdminTypes.Maybe<Pick<AdminTypes.Customer, 'id' | 'firstName' | 'lastName' | 'email' | 'phone' | 'state' | 'updatedAt'>>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type ListDiscountsQueryVariables = AdminTypes.Exact<{
  first: AdminTypes.Scalars['Int']['input'];
  query?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
  after?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type ListDiscountsQuery = { discountNodes: { edges: Array<{ node: (
        Pick<AdminTypes.DiscountNode, 'id'>
        & { discount: { __typename: 'DiscountAutomaticApp' | 'DiscountAutomaticBxgy' | 'DiscountAutomaticFreeShipping' | 'DiscountCodeApp' | 'DiscountCodeBxgy' | 'DiscountCodeFreeShipping' } | (
          { __typename: 'DiscountAutomaticBasic' }
          & Pick<AdminTypes.DiscountAutomaticBasic, 'title' | 'status' | 'startsAt' | 'endsAt'>
        ) | (
          { __typename: 'DiscountCodeBasic' }
          & Pick<AdminTypes.DiscountCodeBasic, 'title' | 'status' | 'startsAt' | 'endsAt'>
          & { codes: { edges: Array<{ node: Pick<AdminTypes.DiscountRedeemCode, 'code'> }> } }
        ) }
      ) }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } };

export type CreateBasicDiscountMutationVariables = AdminTypes.Exact<{
  basicCodeDiscount: AdminTypes.DiscountCodeBasicInput;
}>;


export type CreateBasicDiscountMutation = { discountCodeBasicCreate?: AdminTypes.Maybe<{ codeDiscountNode?: AdminTypes.Maybe<(
      Pick<AdminTypes.DiscountCodeNode, 'id'>
      & { codeDiscount: { __typename: 'DiscountCodeApp' | 'DiscountCodeBxgy' | 'DiscountCodeFreeShipping' } | (
        { __typename: 'DiscountCodeBasic' }
        & Pick<AdminTypes.DiscountCodeBasic, 'title' | 'status' | 'startsAt' | 'endsAt'>
        & { codes: { edges: Array<{ node: Pick<AdminTypes.DiscountRedeemCode, 'code'> }> } }
      ) }
    )>, userErrors: Array<Pick<AdminTypes.DiscountUserError, 'field' | 'message' | 'code'>> }> };

export type DeleteDiscountMutationVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type DeleteDiscountMutation = { discountCodeDelete?: AdminTypes.Maybe<(
    Pick<AdminTypes.DiscountCodeDeletePayload, 'deletedCodeDiscountId'>
    & { userErrors: Array<Pick<AdminTypes.DiscountUserError, 'field' | 'message' | 'code'>> }
  )> };

export type ListFilesQueryVariables = AdminTypes.Exact<{
  first: AdminTypes.Scalars['Int']['input'];
  after?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
  query?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type ListFilesQuery = { files: { edges: Array<{ node: (
        { __typename: 'ExternalVideo' }
        & Pick<AdminTypes.ExternalVideo, 'id' | 'alt' | 'fileStatus' | 'createdAt' | 'updatedAt'>
      ) | (
        { __typename: 'GenericFile' }
        & Pick<AdminTypes.GenericFile, 'url' | 'mimeType' | 'originalFileSize' | 'id' | 'alt' | 'fileStatus' | 'createdAt' | 'updatedAt'>
      ) | (
        { __typename: 'MediaImage' }
        & Pick<AdminTypes.MediaImage, 'id' | 'alt' | 'fileStatus' | 'createdAt' | 'updatedAt'>
        & { image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url' | 'altText'>> }
      ) | (
        { __typename: 'Model3d' }
        & Pick<AdminTypes.Model3d, 'alt' | 'id' | 'fileStatus' | 'createdAt' | 'updatedAt'>
        & { sources: Array<Pick<AdminTypes.Model3dSource, 'url' | 'mimeType'>> }
      ) | (
        { __typename: 'Video' }
        & Pick<AdminTypes.Video, 'alt' | 'duration' | 'id' | 'fileStatus' | 'createdAt' | 'updatedAt'>
        & { sources: Array<Pick<AdminTypes.VideoSource, 'url' | 'mimeType'>> }
      ) }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } };

export type CreateStagedUploadMutationVariables = AdminTypes.Exact<{
  input: Array<AdminTypes.StagedUploadInput> | AdminTypes.StagedUploadInput;
}>;


export type CreateStagedUploadMutation = { stagedUploadsCreate?: AdminTypes.Maybe<{ stagedTargets?: AdminTypes.Maybe<Array<(
      Pick<AdminTypes.StagedMediaUploadTarget, 'url' | 'resourceUrl'>
      & { parameters: Array<Pick<AdminTypes.StagedUploadParameter, 'name' | 'value'>> }
    )>>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type CreateFileMutationVariables = AdminTypes.Exact<{
  files: Array<AdminTypes.FileCreateInput> | AdminTypes.FileCreateInput;
}>;


export type CreateFileMutation = { fileCreate?: AdminTypes.Maybe<{ files?: AdminTypes.Maybe<Array<(
      { __typename: 'ExternalVideo' }
      & Pick<AdminTypes.ExternalVideo, 'id' | 'alt' | 'fileStatus' | 'createdAt' | 'updatedAt'>
    ) | (
      { __typename: 'GenericFile' }
      & Pick<AdminTypes.GenericFile, 'url' | 'mimeType' | 'id' | 'alt' | 'fileStatus' | 'createdAt' | 'updatedAt'>
    ) | (
      { __typename: 'MediaImage' }
      & Pick<AdminTypes.MediaImage, 'id' | 'alt' | 'fileStatus' | 'createdAt' | 'updatedAt'>
      & { image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url' | 'altText'>> }
    ) | (
      { __typename: 'Model3d' }
      & Pick<AdminTypes.Model3d, 'alt' | 'id' | 'fileStatus' | 'createdAt' | 'updatedAt'>
      & { sources: Array<Pick<AdminTypes.Model3dSource, 'url' | 'mimeType'>> }
    ) | (
      { __typename: 'Video' }
      & Pick<AdminTypes.Video, 'alt' | 'duration' | 'id' | 'fileStatus' | 'createdAt' | 'updatedAt'>
      & { sources: Array<Pick<AdminTypes.VideoSource, 'url' | 'mimeType'>> }
    )>>, userErrors: Array<Pick<AdminTypes.FilesUserError, 'field' | 'message'>> }> };

export type ListFulfillmentOrdersQueryVariables = AdminTypes.Exact<{
  orderId: AdminTypes.Scalars['ID']['input'];
  first: AdminTypes.Scalars['Int']['input'];
  after?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type ListFulfillmentOrdersQuery = { order?: AdminTypes.Maybe<(
    Pick<AdminTypes.Order, 'id'>
    & { fulfillmentOrders: { edges: Array<{ node: (
          Pick<AdminTypes.FulfillmentOrder, 'id' | 'status' | 'requestStatus'>
          & { supportedActions: Array<Pick<AdminTypes.FulfillmentOrderSupportedAction, 'action' | 'externalUrl'>>, assignedLocation: { location?: AdminTypes.Maybe<Pick<AdminTypes.Location, 'id' | 'name'>> }, lineItems: { edges: Array<{ node: (
                Pick<AdminTypes.FulfillmentOrderLineItem, 'id' | 'remainingQuantity' | 'totalQuantity'>
                & { lineItem: Pick<AdminTypes.LineItem, 'id' | 'name' | 'sku' | 'quantity'> }
              ) }> } }
        ) }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  )> };

export type CreateFulfillmentMutationVariables = AdminTypes.Exact<{
  fulfillment: AdminTypes.FulfillmentV2Input;
  message?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type CreateFulfillmentMutation = { fulfillmentCreateV2?: AdminTypes.Maybe<{ fulfillment?: AdminTypes.Maybe<(
      Pick<AdminTypes.Fulfillment, 'id' | 'status' | 'displayStatus' | 'createdAt'>
      & { trackingInfo: Array<Pick<AdminTypes.FulfillmentTrackingInfo, 'number' | 'url' | 'company'>> }
    )>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type GetInventoryLevelQueryVariables = AdminTypes.Exact<{
  inventoryItemId: AdminTypes.Scalars['ID']['input'];
  locationId: AdminTypes.Scalars['ID']['input'];
}>;


export type GetInventoryLevelQuery = { inventoryItem?: AdminTypes.Maybe<(
    Pick<AdminTypes.InventoryItem, 'id' | 'sku' | 'tracked'>
    & { inventoryLevel?: AdminTypes.Maybe<(
      Pick<AdminTypes.InventoryLevel, 'id' | 'updatedAt'>
      & { location: Pick<AdminTypes.Location, 'id' | 'name'>, quantities: Array<Pick<AdminTypes.InventoryQuantity, 'name' | 'quantity' | 'updatedAt'>> }
    )> }
  )> };

export type ListLocationsQueryVariables = AdminTypes.Exact<{
  first: AdminTypes.Scalars['Int']['input'];
  after?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
  query?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type ListLocationsQuery = { locations: { edges: Array<{ node: (
        Pick<AdminTypes.Location, 'id' | 'name' | 'isActive' | 'fulfillsOnlineOrders'>
        & { address: Pick<AdminTypes.LocationAddress, 'address1' | 'city' | 'countryCode' | 'zip'> }
      ) }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } };

export type AdjustInventoryMutationVariables = AdminTypes.Exact<{
  input: AdminTypes.InventoryAdjustQuantitiesInput;
}>;


export type AdjustInventoryMutation = { inventoryAdjustQuantities?: AdminTypes.Maybe<{ inventoryAdjustmentGroup?: AdminTypes.Maybe<(
      Pick<AdminTypes.InventoryAdjustmentGroup, 'createdAt' | 'reason' | 'referenceDocumentUri'>
      & { changes: Array<Pick<AdminTypes.InventoryChange, 'name' | 'delta'>> }
    )>, userErrors: Array<Pick<AdminTypes.InventoryAdjustQuantitiesUserError, 'field' | 'message'>> }> };

export type SetInventoryMutationVariables = AdminTypes.Exact<{
  input: AdminTypes.InventorySetOnHandQuantitiesInput;
}>;


export type SetInventoryMutation = { inventorySetOnHandQuantities?: AdminTypes.Maybe<{ inventoryAdjustmentGroup?: AdminTypes.Maybe<(
      Pick<AdminTypes.InventoryAdjustmentGroup, 'createdAt' | 'reason' | 'referenceDocumentUri'>
      & { changes: Array<Pick<AdminTypes.InventoryChange, 'name' | 'delta'>> }
    )>, userErrors: Array<Pick<AdminTypes.InventorySetOnHandQuantitiesUserError, 'field' | 'message'>> }> };

export type GetMetafieldsQueryVariables = AdminTypes.Exact<{
  ownerId: AdminTypes.Scalars['ID']['input'];
  first: AdminTypes.Scalars['Int']['input'];
  after?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
  namespace?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
  keys?: AdminTypes.InputMaybe<Array<AdminTypes.Scalars['String']['input']> | AdminTypes.Scalars['String']['input']>;
}>;


export type GetMetafieldsQuery = { node?: AdminTypes.Maybe<Pick<AdminTypes.AbandonedCheckout, 'id'> | Pick<AdminTypes.AbandonedCheckoutLineItem, 'id'> | Pick<AdminTypes.Abandonment, 'id'> | Pick<AdminTypes.AddAllProductsOperation, 'id'> | Pick<AdminTypes.AdditionalFee, 'id'> | Pick<AdminTypes.App, 'id'> | Pick<AdminTypes.AppCatalog, 'id'> | Pick<AdminTypes.AppCredit, 'id'> | (
    Pick<AdminTypes.AppInstallation, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.AppPurchaseOneTime, 'id'> | Pick<AdminTypes.AppRevenueAttributionRecord, 'id'> | Pick<AdminTypes.AppSubscription, 'id'> | Pick<AdminTypes.AppUsageRecord, 'id'> | (
    Pick<AdminTypes.Article, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.BasicEvent, 'id'> | (
    Pick<AdminTypes.Blog, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.BulkOperation, 'id'> | Pick<AdminTypes.BusinessEntity, 'id'> | Pick<AdminTypes.CalculatedOrder, 'id'> | (
    Pick<AdminTypes.CartTransform, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.CashTrackingAdjustment, 'id'> | Pick<AdminTypes.CashTrackingSession, 'id'> | Pick<AdminTypes.CatalogCsvOperation, 'id'> | Pick<AdminTypes.Channel, 'id'> | Pick<AdminTypes.ChannelDefinition, 'id'> | Pick<AdminTypes.ChannelInformation, 'id'> | Pick<AdminTypes.CheckoutProfile, 'id'> | (
    Pick<AdminTypes.Collection, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.Comment, 'id'> | Pick<AdminTypes.CommentEvent, 'id'> | (
    Pick<AdminTypes.Company, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.CompanyAddress, 'id'> | Pick<AdminTypes.CompanyContact, 'id'> | Pick<AdminTypes.CompanyContactRole, 'id'> | Pick<AdminTypes.CompanyContactRoleAssignment, 'id'> | (
    Pick<AdminTypes.CompanyLocation, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.CompanyLocationCatalog, 'id'> | Pick<AdminTypes.CompanyLocationStaffMemberAssignment, 'id'> | Pick<AdminTypes.ConsentPolicy, 'id'> | Pick<AdminTypes.CurrencyExchangeAdjustment, 'id'> | (
    Pick<AdminTypes.Customer, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.CustomerAccountAppExtensionPage, 'id'> | Pick<AdminTypes.CustomerAccountNativePage, 'id'> | Pick<AdminTypes.CustomerPaymentMethod, 'id'> | Pick<AdminTypes.CustomerSegmentMembersQuery, 'id'> | Pick<AdminTypes.CustomerVisit, 'id'> | Pick<AdminTypes.DeliveryCarrierService, 'id'> | Pick<AdminTypes.DeliveryCondition, 'id'> | Pick<AdminTypes.DeliveryCountry, 'id'> | (
    Pick<AdminTypes.DeliveryCustomization, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.DeliveryLocationGroup, 'id'> | Pick<AdminTypes.DeliveryMethod, 'id'> | Pick<AdminTypes.DeliveryMethodDefinition, 'id'> | Pick<AdminTypes.DeliveryParticipant, 'id'> | Pick<AdminTypes.DeliveryProfile, 'id'> | Pick<AdminTypes.DeliveryProfileItem, 'id'> | Pick<AdminTypes.DeliveryPromiseParticipant, 'id'> | Pick<AdminTypes.DeliveryPromiseProvider, 'id'> | Pick<AdminTypes.DeliveryProvince, 'id'> | Pick<AdminTypes.DeliveryRateDefinition, 'id'> | Pick<AdminTypes.DeliveryZone, 'id'> | Pick<AdminTypes.DiscountAutomaticBxgy, 'id'> | (
    Pick<AdminTypes.DiscountAutomaticNode, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | (
    Pick<AdminTypes.DiscountCodeNode, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | (
    Pick<AdminTypes.DiscountNode, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.DiscountRedeemCodeBulkCreation, 'id'> | Pick<AdminTypes.Domain, 'id'> | (
    Pick<AdminTypes.DraftOrder, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.DraftOrderLineItem, 'id'> | Pick<AdminTypes.DraftOrderTag, 'id'> | Pick<AdminTypes.Duty, 'id'> | Pick<AdminTypes.ExchangeLineItem, 'id'> | Pick<AdminTypes.ExchangeV2, 'id'> | Pick<AdminTypes.ExternalVideo, 'id'> | Pick<AdminTypes.Fulfillment, 'id'> | (
    Pick<AdminTypes.FulfillmentConstraintRule, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.FulfillmentEvent, 'id'> | Pick<AdminTypes.FulfillmentHold, 'id'> | Pick<AdminTypes.FulfillmentLineItem, 'id'> | Pick<AdminTypes.FulfillmentOrder, 'id'> | Pick<AdminTypes.FulfillmentOrderDestination, 'id'> | Pick<AdminTypes.FulfillmentOrderLineItem, 'id'> | Pick<AdminTypes.FulfillmentOrderMerchantRequest, 'id'> | Pick<AdminTypes.GenericFile, 'id'> | Pick<AdminTypes.GiftCard, 'id'> | (
    Pick<AdminTypes.GiftCardCreditTransaction, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | (
    Pick<AdminTypes.GiftCardDebitTransaction, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.InventoryAdjustmentGroup, 'id'> | Pick<AdminTypes.InventoryItem, 'id'> | Pick<AdminTypes.InventoryItemMeasurement, 'id'> | Pick<AdminTypes.InventoryLevel, 'id'> | Pick<AdminTypes.InventoryQuantity, 'id'> | Pick<AdminTypes.InventoryShipment, 'id'> | Pick<AdminTypes.InventoryShipmentLineItem, 'id'> | (
    Pick<AdminTypes.InventoryTransfer, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.InventoryTransferLineItem, 'id'> | Pick<AdminTypes.LineItem, 'id'> | Pick<AdminTypes.LineItemGroup, 'id'> | (
    Pick<AdminTypes.Location, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.MailingAddress, 'id'> | (
    Pick<AdminTypes.Market, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.MarketCatalog, 'id'> | Pick<AdminTypes.MarketRegionCountry, 'id'> | Pick<AdminTypes.MarketWebPresence, 'id'> | Pick<AdminTypes.MarketingActivity, 'id'> | Pick<AdminTypes.MarketingEvent, 'id'> | (
    Pick<AdminTypes.MediaImage, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.Menu, 'id'> | Pick<AdminTypes.Metafield, 'id'> | Pick<AdminTypes.MetafieldDefinition, 'id'> | Pick<AdminTypes.Metaobject, 'id'> | Pick<AdminTypes.MetaobjectDefinition, 'id'> | Pick<AdminTypes.Model3d, 'id'> | Pick<AdminTypes.OnlineStoreTheme, 'id'> | (
    Pick<AdminTypes.Order, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.OrderAdjustment, 'id'> | Pick<AdminTypes.OrderDisputeSummary, 'id'> | Pick<AdminTypes.OrderTransaction, 'id'> | (
    Pick<AdminTypes.Page, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | (
    Pick<AdminTypes.PaymentCustomization, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.PaymentMandate, 'id'> | Pick<AdminTypes.PaymentSchedule, 'id'> | Pick<AdminTypes.PaymentTerms, 'id'> | Pick<AdminTypes.PaymentTermsTemplate, 'id'> | Pick<AdminTypes.PointOfSaleDevice, 'id'> | Pick<AdminTypes.PriceList, 'id'> | Pick<AdminTypes.PriceRule, 'id'> | Pick<AdminTypes.PriceRuleDiscountCode, 'id'> | (
    Pick<AdminTypes.Product, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.ProductBundleOperation, 'id'> | Pick<AdminTypes.ProductDeleteOperation, 'id'> | Pick<AdminTypes.ProductDuplicateOperation, 'id'> | Pick<AdminTypes.ProductFeed, 'id'> | Pick<AdminTypes.ProductOption, 'id'> | Pick<AdminTypes.ProductOptionValue, 'id'> | Pick<AdminTypes.ProductSetOperation, 'id'> | Pick<AdminTypes.ProductTaxonomyNode, 'id'> | (
    Pick<AdminTypes.ProductVariant, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.ProductVariantComponent, 'id'> | Pick<AdminTypes.Publication, 'id'> | Pick<AdminTypes.PublicationResourceOperation, 'id'> | Pick<AdminTypes.QuantityPriceBreak, 'id'> | Pick<AdminTypes.Refund, 'id'> | Pick<AdminTypes.RefundShippingLine, 'id'> | Pick<AdminTypes.Return, 'id'> | Pick<AdminTypes.ReturnLineItem, 'id'> | Pick<AdminTypes.ReturnableFulfillment, 'id'> | Pick<AdminTypes.ReverseDelivery, 'id'> | Pick<AdminTypes.ReverseDeliveryLineItem, 'id'> | Pick<AdminTypes.ReverseFulfillmentOrder, 'id'> | Pick<AdminTypes.ReverseFulfillmentOrderDisposition, 'id'> | Pick<AdminTypes.ReverseFulfillmentOrderLineItem, 'id'> | Pick<AdminTypes.SaleAdditionalFee, 'id'> | Pick<AdminTypes.SavedSearch, 'id'> | Pick<AdminTypes.ScriptTag, 'id'> | Pick<AdminTypes.Segment, 'id'> | (
    Pick<AdminTypes.SellingPlan, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.SellingPlanGroup, 'id'> | Pick<AdminTypes.ServerPixel, 'id'> | (
    Pick<AdminTypes.Shop, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.ShopAddress, 'id'> | Pick<AdminTypes.ShopPolicy, 'id'> | Pick<AdminTypes.ShopifyPaymentsAccount, 'id'> | Pick<AdminTypes.ShopifyPaymentsBalanceTransaction, 'id'> | Pick<AdminTypes.ShopifyPaymentsBankAccount, 'id'> | Pick<AdminTypes.ShopifyPaymentsDispute, 'id'> | Pick<AdminTypes.ShopifyPaymentsDisputeEvidence, 'id'> | Pick<AdminTypes.ShopifyPaymentsDisputeFileUpload, 'id'> | Pick<AdminTypes.ShopifyPaymentsDisputeFulfillment, 'id'> | Pick<AdminTypes.ShopifyPaymentsPayout, 'id'> | Pick<AdminTypes.StaffMember, 'id'> | Pick<AdminTypes.StandardMetafieldDefinitionTemplate, 'id'> | Pick<AdminTypes.StoreCreditAccount, 'id'> | Pick<AdminTypes.StoreCreditAccountCreditTransaction, 'id'> | Pick<AdminTypes.StoreCreditAccountDebitRevertTransaction, 'id'> | Pick<AdminTypes.StoreCreditAccountDebitTransaction, 'id'> | Pick<AdminTypes.StorefrontAccessToken, 'id'> | Pick<AdminTypes.SubscriptionBillingAttempt, 'id'> | Pick<AdminTypes.SubscriptionContract, 'id'> | Pick<AdminTypes.SubscriptionDraft, 'id'> | Pick<AdminTypes.TaxonomyAttribute, 'id'> | Pick<AdminTypes.TaxonomyCategory, 'id'> | Pick<AdminTypes.TaxonomyChoiceListAttribute, 'id'> | Pick<AdminTypes.TaxonomyMeasurementAttribute, 'id'> | Pick<AdminTypes.TaxonomyValue, 'id'> | Pick<AdminTypes.TenderTransaction, 'id'> | Pick<AdminTypes.TransactionFee, 'id'> | Pick<AdminTypes.UnverifiedReturnLineItem, 'id'> | Pick<AdminTypes.UrlRedirect, 'id'> | Pick<AdminTypes.UrlRedirectImport, 'id'> | (
    Pick<AdminTypes.Validation, 'id'>
    & { metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  ) | Pick<AdminTypes.Video, 'id'> | Pick<AdminTypes.WebPixel, 'id'> | Pick<AdminTypes.WebhookSubscription, 'id'>> };

export type ListMetafieldDefinitionsQueryVariables = AdminTypes.Exact<{
  ownerType: AdminTypes.MetafieldOwnerType;
  first: AdminTypes.Scalars['Int']['input'];
  after?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
  namespace?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type ListMetafieldDefinitionsQuery = { metafieldDefinitions: { edges: Array<{ node: (
        Pick<AdminTypes.MetafieldDefinition, 'id' | 'name' | 'namespace' | 'key' | 'ownerType'>
        & { type: Pick<AdminTypes.MetafieldDefinitionType, 'name' | 'category'> }
      ) }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } };

export type SetMetafieldsMutationVariables = AdminTypes.Exact<{
  metafields: Array<AdminTypes.MetafieldsSetInput> | AdminTypes.MetafieldsSetInput;
}>;


export type SetMetafieldsMutation = { metafieldsSet?: AdminTypes.Maybe<{ metafields?: AdminTypes.Maybe<Array<Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest' | 'updatedAt'>>>, userErrors: Array<Pick<AdminTypes.MetafieldsSetUserError, 'field' | 'message' | 'code' | 'elementIndex'>> }> };

export type DeleteMetafieldsMutationVariables = AdminTypes.Exact<{
  metafields: Array<AdminTypes.MetafieldIdentifierInput> | AdminTypes.MetafieldIdentifierInput;
}>;


export type DeleteMetafieldsMutation = { metafieldsDelete?: AdminTypes.Maybe<{ deletedMetafields?: AdminTypes.Maybe<Array<AdminTypes.Maybe<Pick<AdminTypes.MetafieldIdentifier, 'ownerId' | 'namespace' | 'key'>>>>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type GetOrderQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type GetOrderQuery = { order?: AdminTypes.Maybe<(
    Pick<AdminTypes.Order, 'id' | 'name' | 'displayFinancialStatus' | 'displayFulfillmentStatus' | 'confirmed' | 'cancelReason' | 'cancelledAt' | 'closedAt' | 'createdAt' | 'updatedAt'>
    & { currentSubtotalPriceSet: { shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> }, currentTotalPriceSet: { shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> }, customer?: AdminTypes.Maybe<Pick<AdminTypes.Customer, 'id' | 'email' | 'firstName' | 'lastName'>>, lineItems: { edges: Array<{ node: (
          Pick<AdminTypes.LineItem, 'id' | 'name' | 'quantity' | 'sku' | 'fulfillableQuantity'>
          & { originalUnitPriceSet: { shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> }, discountedTotalSet: { shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> }, product?: AdminTypes.Maybe<Pick<AdminTypes.Product, 'id' | 'title'>>, variant?: AdminTypes.Maybe<Pick<AdminTypes.ProductVariant, 'id' | 'title'>> }
        ) }> }, transactions: Array<(
      Pick<AdminTypes.OrderTransaction, 'id' | 'kind' | 'status' | 'gateway' | 'processedAt'>
      & { amountSet: { shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> } }
    )>, fulfillments: Array<(
      Pick<AdminTypes.Fulfillment, 'id' | 'status' | 'displayStatus' | 'createdAt'>
      & { trackingInfo: Array<Pick<AdminTypes.FulfillmentTrackingInfo, 'number' | 'url' | 'company'>>, fulfillmentLineItems: { edges: Array<{ node: (
            Pick<AdminTypes.FulfillmentLineItem, 'id' | 'quantity'>
            & { lineItem: Pick<AdminTypes.LineItem, 'id' | 'name'> }
          ) }> } }
    )> }
  )> };

export type ListOrdersQueryVariables = AdminTypes.Exact<{
  first: AdminTypes.Scalars['Int']['input'];
  query?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
  after?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type ListOrdersQuery = { orders: { edges: Array<{ node: (
        Pick<AdminTypes.Order, 'id' | 'name' | 'displayFinancialStatus' | 'displayFulfillmentStatus' | 'createdAt'>
        & { currentTotalPriceSet: { shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> }, customer?: AdminTypes.Maybe<Pick<AdminTypes.Customer, 'id' | 'email' | 'firstName' | 'lastName'>> }
      ) }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } };

export type CancelOrderMutationVariables = AdminTypes.Exact<{
  orderId: AdminTypes.Scalars['ID']['input'];
  reason: AdminTypes.OrderCancelReason;
  restock: AdminTypes.Scalars['Boolean']['input'];
  notifyCustomer?: AdminTypes.InputMaybe<AdminTypes.Scalars['Boolean']['input']>;
  staffNote?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
  refundMethod?: AdminTypes.InputMaybe<AdminTypes.OrderCancelRefundMethodInput>;
}>;


export type CancelOrderMutation = { orderCancel?: AdminTypes.Maybe<{ job?: AdminTypes.Maybe<Pick<AdminTypes.Job, 'id' | 'done'>>, orderCancelUserErrors: Array<Pick<AdminTypes.OrderCancelUserError, 'field' | 'message' | 'code'>> }> };

export type CloseOrderMutationVariables = AdminTypes.Exact<{
  input: AdminTypes.OrderCloseInput;
}>;


export type CloseOrderMutation = { orderClose?: AdminTypes.Maybe<{ order?: AdminTypes.Maybe<Pick<AdminTypes.Order, 'id' | 'name' | 'closedAt' | 'displayFinancialStatus' | 'displayFulfillmentStatus'>>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type CreateDraftOrderMutationVariables = AdminTypes.Exact<{
  input: AdminTypes.DraftOrderInput;
}>;


export type CreateDraftOrderMutation = { draftOrderCreate?: AdminTypes.Maybe<{ draftOrder?: AdminTypes.Maybe<(
      Pick<AdminTypes.DraftOrder, 'id' | 'name' | 'invoiceUrl' | 'status' | 'createdAt'>
      & { totalPriceSet: { shopMoney: Pick<AdminTypes.MoneyV2, 'amount' | 'currencyCode'> } }
    )>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type CompleteDraftOrderMutationVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
  sourceName?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type CompleteDraftOrderMutation = { draftOrderComplete?: AdminTypes.Maybe<{ draftOrder?: AdminTypes.Maybe<(
      Pick<AdminTypes.DraftOrder, 'id' | 'name' | 'status'>
      & { order?: AdminTypes.Maybe<Pick<AdminTypes.Order, 'id' | 'name'>> }
    )>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type GetProductQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type GetProductQuery = { product?: AdminTypes.Maybe<(
    Pick<AdminTypes.Product, 'id' | 'title' | 'handle' | 'descriptionHtml' | 'vendor' | 'productType' | 'status' | 'tags' | 'totalInventory' | 'createdAt' | 'updatedAt'>
    & { variants: { edges: Array<{ node: (
          Pick<AdminTypes.ProductVariant, 'id' | 'title' | 'displayName' | 'price' | 'sku' | 'inventoryQuantity' | 'inventoryPolicy'>
          & { selectedOptions: Array<Pick<AdminTypes.SelectedOption, 'name' | 'value'>>, inventoryItem: Pick<AdminTypes.InventoryItem, 'id' | 'tracked'> }
        ) }> }, media: { edges: Array<{ node: (
          { __typename: 'ExternalVideo' }
          & Pick<AdminTypes.ExternalVideo, 'id' | 'alt' | 'originUrl' | 'embedUrl'>
        ) | (
          { __typename: 'MediaImage' }
          & Pick<AdminTypes.MediaImage, 'id'>
          & { image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url' | 'altText'>> }
        ) | (
          { __typename: 'Model3d' }
          & Pick<AdminTypes.Model3d, 'id' | 'alt'>
          & { sources: Array<Pick<AdminTypes.Model3dSource, 'url' | 'mimeType'>> }
        ) | (
          { __typename: 'Video' }
          & Pick<AdminTypes.Video, 'id' | 'alt'>
          & { sources: Array<Pick<AdminTypes.VideoSource, 'url' | 'mimeType'>> }
        ) }> }, metafields: { edges: Array<{ node: Pick<AdminTypes.Metafield, 'id' | 'namespace' | 'key' | 'value' | 'type' | 'compareDigest'> }> } }
  )> };

export type ListProductsQueryVariables = AdminTypes.Exact<{
  first: AdminTypes.Scalars['Int']['input'];
  query?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
  after?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type ListProductsQuery = { products: { edges: Array<{ node: Pick<AdminTypes.Product, 'id' | 'title' | 'handle' | 'vendor' | 'productType' | 'status' | 'totalInventory' | 'createdAt' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } };

export type ListProductVariantsQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
  first: AdminTypes.Scalars['Int']['input'];
  after?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
}>;


export type ListProductVariantsQuery = { product?: AdminTypes.Maybe<(
    Pick<AdminTypes.Product, 'id'>
    & { variants: { edges: Array<{ node: (
          Pick<AdminTypes.ProductVariant, 'id' | 'title' | 'displayName' | 'price' | 'sku' | 'inventoryQuantity' | 'inventoryPolicy'>
          & { selectedOptions: Array<Pick<AdminTypes.SelectedOption, 'name' | 'value'>>, inventoryItem: Pick<AdminTypes.InventoryItem, 'id' | 'tracked'> }
        ) }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } }
  )> };

export type CreateProductMutationVariables = AdminTypes.Exact<{
  product: AdminTypes.ProductCreateInput;
}>;


export type CreateProductMutation = { productCreate?: AdminTypes.Maybe<{ product?: AdminTypes.Maybe<Pick<AdminTypes.Product, 'id' | 'title' | 'handle' | 'status'>>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type UpdateProductMutationVariables = AdminTypes.Exact<{
  product: AdminTypes.ProductUpdateInput;
}>;


export type UpdateProductMutation = { productUpdate?: AdminTypes.Maybe<{ product?: AdminTypes.Maybe<Pick<AdminTypes.Product, 'id' | 'title' | 'handle' | 'status' | 'updatedAt'>>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type DeleteProductMutationVariables = AdminTypes.Exact<{
  input: AdminTypes.ProductDeleteInput;
}>;


export type DeleteProductMutation = { productDelete?: AdminTypes.Maybe<(
    Pick<AdminTypes.ProductDeletePayload, 'deletedProductId'>
    & { productDeleteOperation?: AdminTypes.Maybe<Pick<AdminTypes.ProductDeleteOperation, 'id' | 'status'>>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }
  )> };

export type UpdateVariantMutationVariables = AdminTypes.Exact<{
  productId: AdminTypes.Scalars['ID']['input'];
  variants: Array<AdminTypes.ProductVariantsBulkInput> | AdminTypes.ProductVariantsBulkInput;
}>;


export type UpdateVariantMutation = { productVariantsBulkUpdate?: AdminTypes.Maybe<{ productVariants?: AdminTypes.Maybe<Array<Pick<AdminTypes.ProductVariant, 'id' | 'displayName' | 'price' | 'sku' | 'inventoryPolicy'>>>, userErrors: Array<Pick<AdminTypes.ProductVariantsBulkUpdateUserError, 'field' | 'message'>> }> };

export type GetShopQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type GetShopQuery = { shop: (
    Pick<AdminTypes.Shop, 'id' | 'name' | 'email' | 'currencyCode' | 'myshopifyDomain' | 'timezoneAbbreviation'>
    & { plan: Pick<AdminTypes.ShopPlan, 'displayName' | 'partnerDevelopment' | 'shopifyPlus'>, primaryDomain: Pick<AdminTypes.Domain, 'host' | 'url'> }
  ) };

export type ListWebhooksQueryVariables = AdminTypes.Exact<{
  first: AdminTypes.Scalars['Int']['input'];
  after?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
  query?: AdminTypes.InputMaybe<AdminTypes.Scalars['String']['input']>;
  topics?: AdminTypes.InputMaybe<Array<AdminTypes.WebhookSubscriptionTopic> | AdminTypes.WebhookSubscriptionTopic>;
}>;


export type ListWebhooksQuery = { webhookSubscriptions: { edges: Array<{ node: Pick<AdminTypes.WebhookSubscription, 'id' | 'topic' | 'callbackUrl' | 'format' | 'filter' | 'includeFields' | 'metafieldNamespaces' | 'createdAt' | 'updatedAt'> }>, pageInfo: Pick<AdminTypes.PageInfo, 'hasNextPage' | 'endCursor'> } };

export type CreateWebhookMutationVariables = AdminTypes.Exact<{
  topic: AdminTypes.WebhookSubscriptionTopic;
  webhookSubscription: AdminTypes.WebhookSubscriptionInput;
}>;


export type CreateWebhookMutation = { webhookSubscriptionCreate?: AdminTypes.Maybe<{ webhookSubscription?: AdminTypes.Maybe<Pick<AdminTypes.WebhookSubscription, 'id' | 'topic' | 'callbackUrl' | 'format' | 'filter' | 'includeFields' | 'metafieldNamespaces' | 'createdAt'>>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type DeleteWebhookMutationVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type DeleteWebhookMutation = { webhookSubscriptionDelete?: AdminTypes.Maybe<(
    Pick<AdminTypes.WebhookSubscriptionDeletePayload, 'deletedWebhookSubscriptionId'>
    & { userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }
  )> };

interface GeneratedQueryTypes {
  "query GetShop {\n  shop {\n    id\n    name\n    email\n    currencyCode\n    myshopifyDomain\n    timezoneAbbreviation\n    plan {\n      displayName\n      partnerDevelopment\n      shopifyPlus\n    }\n    primaryDomain {\n      host\n      url\n    }\n  }\n}": {return: GetShopQuery, variables: GetShopQueryVariables},
}

interface GeneratedMutationTypes {
  "mutation BulkQuery($query: String!, $groupObjects: Boolean) {\n  bulkOperationRunQuery(query: $query, groupObjects: $groupObjects) {\n    bulkOperation {\n      id\n      status\n      createdAt\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}\n\nquery BulkQueryStatus {\n  currentBulkOperation(type: QUERY) {\n    id\n    status\n    errorCode\n    objectCount\n    fileSize\n    url\n    partialDataUrl\n    createdAt\n    completedAt\n    query\n  }\n}": {return: never, variables: BulkQueryMutationVariables & BulkQueryStatusQueryVariables},
  "query GetCollection($id: ID!, $productFirst: Int!, $after: String) {\n  collection(id: $id) {\n    id\n    title\n    handle\n    descriptionHtml\n    sortOrder\n    updatedAt\n    ruleSet {\n      appliedDisjunctively\n      rules {\n        column\n        relation\n        condition\n      }\n    }\n    products(first: $productFirst, after: $after) {\n      edges {\n        node {\n          id\n          title\n          handle\n          status\n          totalInventory\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n}\n\nquery ListCollections($first: Int!, $query: String, $after: String) {\n  collections(first: $first, query: $query, after: $after) {\n    edges {\n      node {\n        id\n        title\n        handle\n        updatedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n\nmutation CreateCollection($input: CollectionInput!) {\n  collectionCreate(input: $input) {\n    collection {\n      id\n      title\n      handle\n      updatedAt\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}\n\nmutation AddProductsToCollection($id: ID!, $productIds: [ID!]!) {\n  collectionAddProducts(id: $id, productIds: $productIds) {\n    collection {\n      id\n      title\n      handle\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}\n\nmutation RemoveProductsFromCollection($id: ID!, $productIds: [ID!]!) {\n  collectionRemoveProducts(id: $id, productIds: $productIds) {\n    job {\n      id\n      done\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": {return: never, variables: GetCollectionQueryVariables & ListCollectionsQueryVariables & CreateCollectionMutationVariables & AddProductsToCollectionMutationVariables & RemoveProductsFromCollectionMutationVariables},
  "query GetCustomer($id: ID!) {\n  customer(id: $id) {\n    id\n    firstName\n    lastName\n    email\n    phone\n    state\n    tags\n    createdAt\n    updatedAt\n    defaultAddress {\n      id\n      address1\n      address2\n      city\n      province\n      country\n      zip\n    }\n    addresses(first: 20) {\n      id\n      address1\n      address2\n      city\n      province\n      country\n      zip\n    }\n    orders(first: 10, reverse: true) {\n      edges {\n        node {\n          id\n          name\n          createdAt\n          displayFinancialStatus\n          currentTotalPriceSet {\n            shopMoney {\n              amount\n              currencyCode\n            }\n          }\n        }\n      }\n    }\n    metafields(first: 50) {\n      edges {\n        node {\n          id\n          namespace\n          key\n          value\n          type\n          compareDigest\n        }\n      }\n    }\n  }\n}\n\nquery ListCustomers($first: Int!, $query: String, $after: String) {\n  customers(first: $first, query: $query, after: $after) {\n    edges {\n      node {\n        id\n        firstName\n        lastName\n        email\n        phone\n        state\n        tags\n        createdAt\n        updatedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n\nmutation CreateCustomer($input: CustomerInput!) {\n  customerCreate(input: $input) {\n    customer {\n      id\n      firstName\n      lastName\n      email\n      phone\n      state\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}\n\nmutation UpdateCustomer($input: CustomerInput!) {\n  customerUpdate(input: $input) {\n    customer {\n      id\n      firstName\n      lastName\n      email\n      phone\n      state\n      updatedAt\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": {return: never, variables: GetCustomerQueryVariables & ListCustomersQueryVariables & CreateCustomerMutationVariables & UpdateCustomerMutationVariables},
  "query ListDiscounts($first: Int!, $query: String, $after: String) {\n  discountNodes(first: $first, query: $query, after: $after) {\n    edges {\n      node {\n        id\n        discount {\n          __typename\n          ... on DiscountCodeBasic {\n            title\n            status\n            startsAt\n            endsAt\n            codes(first: 10) {\n              edges {\n                node {\n                  code\n                }\n              }\n            }\n          }\n          ... on DiscountAutomaticBasic {\n            title\n            status\n            startsAt\n            endsAt\n          }\n        }\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n\nmutation CreateBasicDiscount($basicCodeDiscount: DiscountCodeBasicInput!) {\n  discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {\n    codeDiscountNode {\n      id\n      codeDiscount {\n        __typename\n        ... on DiscountCodeBasic {\n          title\n          status\n          startsAt\n          endsAt\n          codes(first: 10) {\n            edges {\n              node {\n                code\n              }\n            }\n          }\n        }\n      }\n    }\n    userErrors {\n      field\n      message\n      code\n    }\n  }\n}\n\nmutation DeleteDiscount($id: ID!) {\n  discountCodeDelete(id: $id) {\n    deletedCodeDiscountId\n    userErrors {\n      field\n      message\n      code\n    }\n  }\n}": {return: never, variables: ListDiscountsQueryVariables & CreateBasicDiscountMutationVariables & DeleteDiscountMutationVariables},
  "query ListFiles($first: Int!, $after: String, $query: String) {\n  files(first: $first, after: $after, query: $query) {\n    edges {\n      node {\n        __typename\n        id\n        alt\n        fileStatus\n        createdAt\n        updatedAt\n        ... on MediaImage {\n          image {\n            url\n            altText\n          }\n        }\n        ... on GenericFile {\n          url\n          mimeType\n          originalFileSize\n        }\n        ... on Video {\n          alt\n          duration\n          sources {\n            url\n            mimeType\n          }\n        }\n        ... on Model3d {\n          alt\n          sources {\n            url\n            mimeType\n          }\n        }\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n\nmutation CreateStagedUpload($input: [StagedUploadInput!]!) {\n  stagedUploadsCreate(input: $input) {\n    stagedTargets {\n      url\n      resourceUrl\n      parameters {\n        name\n        value\n      }\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}\n\nmutation CreateFile($files: [FileCreateInput!]!) {\n  fileCreate(files: $files) {\n    files {\n      __typename\n      id\n      alt\n      fileStatus\n      createdAt\n      updatedAt\n      ... on MediaImage {\n        image {\n          url\n          altText\n        }\n      }\n      ... on GenericFile {\n        url\n        mimeType\n      }\n      ... on Video {\n        alt\n        duration\n        sources {\n          url\n          mimeType\n        }\n      }\n      ... on Model3d {\n        alt\n        sources {\n          url\n          mimeType\n        }\n      }\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": {return: never, variables: ListFilesQueryVariables & CreateStagedUploadMutationVariables & CreateFileMutationVariables},
  "query ListFulfillmentOrders($orderId: ID!, $first: Int!, $after: String) {\n  order(id: $orderId) {\n    id\n    fulfillmentOrders(first: $first, after: $after) {\n      edges {\n        node {\n          id\n          status\n          requestStatus\n          supportedActions {\n            action\n            externalUrl\n          }\n          assignedLocation {\n            location {\n              id\n              name\n            }\n          }\n          lineItems(first: 50) {\n            edges {\n              node {\n                id\n                remainingQuantity\n                totalQuantity\n                lineItem {\n                  id\n                  name\n                  sku\n                  quantity\n                }\n              }\n            }\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n}\n\nmutation CreateFulfillment($fulfillment: FulfillmentV2Input!, $message: String) {\n  fulfillmentCreateV2(fulfillment: $fulfillment, message: $message) {\n    fulfillment {\n      id\n      status\n      displayStatus\n      createdAt\n      trackingInfo {\n        number\n        url\n        company\n      }\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": {return: never, variables: ListFulfillmentOrdersQueryVariables & CreateFulfillmentMutationVariables},
  "query GetInventoryLevel($inventoryItemId: ID!, $locationId: ID!) {\n  inventoryItem(id: $inventoryItemId) {\n    id\n    sku\n    tracked\n    inventoryLevel(locationId: $locationId) {\n      id\n      updatedAt\n      location {\n        id\n        name\n      }\n      quantities(names: [\"available\", \"on_hand\", \"committed\", \"incoming\", \"reserved\"]) {\n        name\n        quantity\n        updatedAt\n      }\n    }\n  }\n}\n\nquery ListLocations($first: Int!, $after: String, $query: String) {\n  locations(first: $first, after: $after, query: $query) {\n    edges {\n      node {\n        id\n        name\n        isActive\n        fulfillsOnlineOrders\n        address {\n          address1\n          city\n          countryCode\n          zip\n        }\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n\nmutation AdjustInventory($input: InventoryAdjustQuantitiesInput!) {\n  inventoryAdjustQuantities(input: $input) {\n    inventoryAdjustmentGroup {\n      createdAt\n      reason\n      referenceDocumentUri\n      changes {\n        name\n        delta\n      }\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}\n\nmutation SetInventory($input: InventorySetOnHandQuantitiesInput!) {\n  inventorySetOnHandQuantities(input: $input) {\n    inventoryAdjustmentGroup {\n      createdAt\n      reason\n      referenceDocumentUri\n      changes {\n        name\n        delta\n      }\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": {return: never, variables: GetInventoryLevelQueryVariables & ListLocationsQueryVariables & AdjustInventoryMutationVariables & SetInventoryMutationVariables},
  "query GetMetafields($ownerId: ID!, $first: Int!, $after: String, $namespace: String, $keys: [String!]) {\n  node(id: $ownerId) {\n    id\n    ... on HasMetafields {\n      metafields(first: $first, after: $after, namespace: $namespace, keys: $keys) {\n        edges {\n          node {\n            id\n            namespace\n            key\n            value\n            type\n            compareDigest\n            updatedAt\n          }\n        }\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n      }\n    }\n  }\n}\n\nquery ListMetafieldDefinitions($ownerType: MetafieldOwnerType!, $first: Int!, $after: String, $namespace: String) {\n  metafieldDefinitions(\n    ownerType: $ownerType\n    first: $first\n    after: $after\n    namespace: $namespace\n  ) {\n    edges {\n      node {\n        id\n        name\n        namespace\n        key\n        ownerType\n        type {\n          name\n          category\n        }\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n\nmutation SetMetafields($metafields: [MetafieldsSetInput!]!) {\n  metafieldsSet(metafields: $metafields) {\n    metafields {\n      id\n      namespace\n      key\n      value\n      type\n      compareDigest\n      updatedAt\n    }\n    userErrors {\n      field\n      message\n      code\n      elementIndex\n    }\n  }\n}\n\nmutation DeleteMetafields($metafields: [MetafieldIdentifierInput!]!) {\n  metafieldsDelete(metafields: $metafields) {\n    deletedMetafields {\n      ownerId\n      namespace\n      key\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": {return: never, variables: GetMetafieldsQueryVariables & ListMetafieldDefinitionsQueryVariables & SetMetafieldsMutationVariables & DeleteMetafieldsMutationVariables},
  "query GetOrder($id: ID!) {\n  order(id: $id) {\n    id\n    name\n    displayFinancialStatus\n    displayFulfillmentStatus\n    confirmed\n    cancelReason\n    cancelledAt\n    closedAt\n    createdAt\n    updatedAt\n    currentSubtotalPriceSet {\n      shopMoney {\n        amount\n        currencyCode\n      }\n    }\n    currentTotalPriceSet {\n      shopMoney {\n        amount\n        currencyCode\n      }\n    }\n    customer {\n      id\n      email\n      firstName\n      lastName\n    }\n    lineItems(first: 100) {\n      edges {\n        node {\n          id\n          name\n          quantity\n          sku\n          fulfillableQuantity\n          originalUnitPriceSet {\n            shopMoney {\n              amount\n              currencyCode\n            }\n          }\n          discountedTotalSet {\n            shopMoney {\n              amount\n              currencyCode\n            }\n          }\n          product {\n            id\n            title\n          }\n          variant {\n            id\n            title\n          }\n        }\n      }\n    }\n    transactions(first: 50) {\n      id\n      kind\n      status\n      gateway\n      processedAt\n      amountSet {\n        shopMoney {\n          amount\n          currencyCode\n        }\n      }\n    }\n    fulfillments {\n      id\n      status\n      displayStatus\n      createdAt\n      trackingInfo {\n        number\n        url\n        company\n      }\n      fulfillmentLineItems(first: 50) {\n        edges {\n          node {\n            id\n            quantity\n            lineItem {\n              id\n              name\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nquery ListOrders($first: Int!, $query: String, $after: String) {\n  orders(first: $first, query: $query, after: $after) {\n    edges {\n      node {\n        id\n        name\n        displayFinancialStatus\n        displayFulfillmentStatus\n        createdAt\n        currentTotalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n        customer {\n          id\n          email\n          firstName\n          lastName\n        }\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n\nmutation CancelOrder($orderId: ID!, $reason: OrderCancelReason!, $restock: Boolean!, $notifyCustomer: Boolean, $staffNote: String, $refundMethod: OrderCancelRefundMethodInput) {\n  orderCancel(\n    orderId: $orderId\n    reason: $reason\n    restock: $restock\n    notifyCustomer: $notifyCustomer\n    staffNote: $staffNote\n    refundMethod: $refundMethod\n  ) {\n    job {\n      id\n      done\n    }\n    orderCancelUserErrors {\n      field\n      message\n      code\n    }\n  }\n}\n\nmutation CloseOrder($input: OrderCloseInput!) {\n  orderClose(input: $input) {\n    order {\n      id\n      name\n      closedAt\n      displayFinancialStatus\n      displayFulfillmentStatus\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}\n\nmutation CreateDraftOrder($input: DraftOrderInput!) {\n  draftOrderCreate(input: $input) {\n    draftOrder {\n      id\n      name\n      invoiceUrl\n      status\n      createdAt\n      totalPriceSet {\n        shopMoney {\n          amount\n          currencyCode\n        }\n      }\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}\n\nmutation CompleteDraftOrder($id: ID!, $sourceName: String) {\n  draftOrderComplete(id: $id, sourceName: $sourceName) {\n    draftOrder {\n      id\n      name\n      status\n      order {\n        id\n        name\n      }\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": {return: never, variables: GetOrderQueryVariables & ListOrdersQueryVariables & CancelOrderMutationVariables & CloseOrderMutationVariables & CreateDraftOrderMutationVariables & CompleteDraftOrderMutationVariables},
  "query GetProduct($id: ID!) {\n  product(id: $id) {\n    id\n    title\n    handle\n    descriptionHtml\n    vendor\n    productType\n    status\n    tags\n    totalInventory\n    createdAt\n    updatedAt\n    variants(first: 100) {\n      edges {\n        node {\n          id\n          title\n          displayName\n          price\n          sku\n          inventoryQuantity\n          inventoryPolicy\n          selectedOptions {\n            name\n            value\n          }\n          inventoryItem {\n            id\n            tracked\n          }\n        }\n      }\n    }\n    media(first: 20) {\n      edges {\n        node {\n          __typename\n          ... on MediaImage {\n            id\n            image {\n              url\n              altText\n            }\n          }\n          ... on Video {\n            id\n            alt\n            sources {\n              url\n              mimeType\n            }\n          }\n          ... on ExternalVideo {\n            id\n            alt\n            originUrl\n            embedUrl\n          }\n          ... on Model3d {\n            id\n            alt\n            sources {\n              url\n              mimeType\n            }\n          }\n        }\n      }\n    }\n    metafields(first: 50) {\n      edges {\n        node {\n          id\n          namespace\n          key\n          value\n          type\n          compareDigest\n        }\n      }\n    }\n  }\n}\n\nquery ListProducts($first: Int!, $query: String, $after: String) {\n  products(first: $first, query: $query, after: $after) {\n    edges {\n      node {\n        id\n        title\n        handle\n        vendor\n        productType\n        status\n        totalInventory\n        createdAt\n        updatedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n\nquery ListProductVariants($id: ID!, $first: Int!, $after: String) {\n  product(id: $id) {\n    id\n    variants(first: $first, after: $after) {\n      edges {\n        node {\n          id\n          title\n          displayName\n          price\n          sku\n          inventoryQuantity\n          inventoryPolicy\n          selectedOptions {\n            name\n            value\n          }\n          inventoryItem {\n            id\n            tracked\n          }\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n}\n\nmutation CreateProduct($product: ProductCreateInput!) {\n  productCreate(product: $product) {\n    product {\n      id\n      title\n      handle\n      status\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}\n\nmutation UpdateProduct($product: ProductUpdateInput!) {\n  productUpdate(product: $product) {\n    product {\n      id\n      title\n      handle\n      status\n      updatedAt\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}\n\nmutation DeleteProduct($input: ProductDeleteInput!) {\n  productDelete(input: $input) {\n    deletedProductId\n    productDeleteOperation {\n      id\n      status\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}\n\nmutation UpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {\n  productVariantsBulkUpdate(productId: $productId, variants: $variants) {\n    productVariants {\n      id\n      displayName\n      price\n      sku\n      inventoryPolicy\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}": {return: never, variables: GetProductQueryVariables & ListProductsQueryVariables & ListProductVariantsQueryVariables & CreateProductMutationVariables & UpdateProductMutationVariables & DeleteProductMutationVariables & UpdateVariantMutationVariables},
  "query ListWebhooks($first: Int!, $after: String, $query: String, $topics: [WebhookSubscriptionTopic!]) {\n  webhookSubscriptions(\n    first: $first\n    after: $after\n    query: $query\n    topics: $topics\n  ) {\n    edges {\n      node {\n        id\n        topic\n        callbackUrl\n        format\n        filter\n        includeFields\n        metafieldNamespaces\n        createdAt\n        updatedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n\nmutation CreateWebhook($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {\n  webhookSubscriptionCreate(\n    topic: $topic\n    webhookSubscription: $webhookSubscription\n  ) {\n    webhookSubscription {\n      id\n      topic\n      callbackUrl\n      format\n      filter\n      includeFields\n      metafieldNamespaces\n      createdAt\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}\n\nmutation DeleteWebhook($id: ID!) {\n  webhookSubscriptionDelete(id: $id) {\n    deletedWebhookSubscriptionId\n    userErrors {\n      field\n      message\n    }\n  }\n}": {return: never, variables: ListWebhooksQueryVariables & CreateWebhookMutationVariables & DeleteWebhookMutationVariables},
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
