export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  bigint: { input: number; output: number };
  geography: { input: any; output: any };
  geometry: { input: any; output: any };
  jsonb: { input: any; output: any };
  numeric: { input: number; output: number };
  timestamptz: { input: number; output: number };
  uuid: { input: string; output: string };
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  _gt?: InputMaybe<Scalars["Boolean"]["input"]>;
  _gte?: InputMaybe<Scalars["Boolean"]["input"]>;
  _in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lte?: InputMaybe<Scalars["Boolean"]["input"]>;
  _neq?: InputMaybe<Scalars["Boolean"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["Int"]["input"]>;
  _gt?: InputMaybe<Scalars["Int"]["input"]>;
  _gte?: InputMaybe<Scalars["Int"]["input"]>;
  _in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["Int"]["input"]>;
  _lte?: InputMaybe<Scalars["Int"]["input"]>;
  _neq?: InputMaybe<Scalars["Int"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["Int"]["input"]>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["String"]["input"]>;
  _gt?: InputMaybe<Scalars["String"]["input"]>;
  _gte?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars["String"]["input"]>;
  _in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars["String"]["input"]>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars["String"]["input"]>;
  _lt?: InputMaybe<Scalars["String"]["input"]>;
  _lte?: InputMaybe<Scalars["String"]["input"]>;
  _neq?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars["String"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "accounts" */
export type Accounts = {
  __typename?: "accounts";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** OAuth access token */
  access_token?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** Password hash for credentials providers (email/phone) */
  credential_hash?: Maybe<Scalars["String"]["output"]>;
  /** Token expiration timestamp */
  expires_at?: Maybe<Scalars["bigint"]["output"]>;
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** OAuth ID token */
  id_token?: Maybe<Scalars["String"]["output"]>;
  /** OAuth token */
  oauth_token?: Maybe<Scalars["String"]["output"]>;
  /** OAuth token secret */
  oauth_token_secret?: Maybe<Scalars["String"]["output"]>;
  /** OAuth provider */
  provider: Scalars["String"]["output"];
  /** Provider account ID */
  provider_account_id: Scalars["String"]["output"];
  /** Additional provider-specific data (e.g., Telegram username, photo_url) */
  provider_data?: Maybe<Scalars["jsonb"]["output"]>;
  /** OAuth refresh token */
  refresh_token?: Maybe<Scalars["String"]["output"]>;
  /** OAuth scope */
  scope?: Maybe<Scalars["String"]["output"]>;
  /** OAuth session state */
  session_state?: Maybe<Scalars["String"]["output"]>;
  /** Token type */
  token_type?: Maybe<Scalars["String"]["output"]>;
  /** Account type */
  type: Scalars["String"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  /** Reference to users table */
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "accounts" */
export type AccountsProvider_DataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "accounts" */
export type Accounts_Aggregate = {
  __typename?: "accounts_aggregate";
  aggregate?: Maybe<Accounts_Aggregate_Fields>;
  nodes: Array<Accounts>;
};

export type Accounts_Aggregate_Bool_Exp = {
  count?: InputMaybe<Accounts_Aggregate_Bool_Exp_Count>;
};

export type Accounts_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Accounts_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Accounts_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "accounts" */
export type Accounts_Aggregate_Fields = {
  __typename?: "accounts_aggregate_fields";
  avg?: Maybe<Accounts_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Accounts_Max_Fields>;
  min?: Maybe<Accounts_Min_Fields>;
  stddev?: Maybe<Accounts_Stddev_Fields>;
  stddev_pop?: Maybe<Accounts_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Accounts_Stddev_Samp_Fields>;
  sum?: Maybe<Accounts_Sum_Fields>;
  var_pop?: Maybe<Accounts_Var_Pop_Fields>;
  var_samp?: Maybe<Accounts_Var_Samp_Fields>;
  variance?: Maybe<Accounts_Variance_Fields>;
};

/** aggregate fields of "accounts" */
export type Accounts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Accounts_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "accounts" */
export type Accounts_Aggregate_Order_By = {
  avg?: InputMaybe<Accounts_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Accounts_Max_Order_By>;
  min?: InputMaybe<Accounts_Min_Order_By>;
  stddev?: InputMaybe<Accounts_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Accounts_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Accounts_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Accounts_Sum_Order_By>;
  var_pop?: InputMaybe<Accounts_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Accounts_Var_Samp_Order_By>;
  variance?: InputMaybe<Accounts_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Accounts_Append_Input = {
  /** Additional provider-specific data (e.g., Telegram username, photo_url) */
  provider_data?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "accounts" */
export type Accounts_Arr_Rel_Insert_Input = {
  data: Array<Accounts_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Accounts_On_Conflict>;
};

/** aggregate avg on columns */
export type Accounts_Avg_Fields = {
  __typename?: "accounts_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Token expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "accounts" */
export type Accounts_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "accounts". All fields are combined with a logical 'AND'. */
export type Accounts_Bool_Exp = {
  _and?: InputMaybe<Array<Accounts_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Accounts_Bool_Exp>;
  _or?: InputMaybe<Array<Accounts_Bool_Exp>>;
  access_token?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  credential_hash?: InputMaybe<String_Comparison_Exp>;
  expires_at?: InputMaybe<Bigint_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  id_token?: InputMaybe<String_Comparison_Exp>;
  oauth_token?: InputMaybe<String_Comparison_Exp>;
  oauth_token_secret?: InputMaybe<String_Comparison_Exp>;
  provider?: InputMaybe<String_Comparison_Exp>;
  provider_account_id?: InputMaybe<String_Comparison_Exp>;
  provider_data?: InputMaybe<Jsonb_Comparison_Exp>;
  refresh_token?: InputMaybe<String_Comparison_Exp>;
  scope?: InputMaybe<String_Comparison_Exp>;
  session_state?: InputMaybe<String_Comparison_Exp>;
  token_type?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "accounts" */
export enum Accounts_Constraint {
  /** unique or primary key constraint on columns "id" */
  AccountsPkey = "accounts_pkey",
  /** unique or primary key constraint on columns "provider", "provider_account_id" */
  AccountsProviderProviderAccountIdUnique = "accounts_provider_provider_account_id_unique",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Accounts_Delete_At_Path_Input = {
  /** Additional provider-specific data (e.g., Telegram username, photo_url) */
  provider_data?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Accounts_Delete_Elem_Input = {
  /** Additional provider-specific data (e.g., Telegram username, photo_url) */
  provider_data?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Accounts_Delete_Key_Input = {
  /** Additional provider-specific data (e.g., Telegram username, photo_url) */
  provider_data?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "accounts" */
export type Accounts_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "accounts" */
export type Accounts_Insert_Input = {
  /** OAuth access token */
  access_token?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Password hash for credentials providers (email/phone) */
  credential_hash?: InputMaybe<Scalars["String"]["input"]>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Scalars["bigint"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** OAuth ID token */
  id_token?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth token */
  oauth_token?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth token secret */
  oauth_token_secret?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth provider */
  provider?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider account ID */
  provider_account_id?: InputMaybe<Scalars["String"]["input"]>;
  /** Additional provider-specific data (e.g., Telegram username, photo_url) */
  provider_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** OAuth refresh token */
  refresh_token?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth scope */
  scope?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth session state */
  session_state?: InputMaybe<Scalars["String"]["input"]>;
  /** Token type */
  token_type?: InputMaybe<Scalars["String"]["input"]>;
  /** Account type */
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** Reference to users table */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Accounts_Max_Fields = {
  __typename?: "accounts_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** OAuth access token */
  access_token?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Password hash for credentials providers (email/phone) */
  credential_hash?: Maybe<Scalars["String"]["output"]>;
  /** Token expiration timestamp */
  expires_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** OAuth ID token */
  id_token?: Maybe<Scalars["String"]["output"]>;
  /** OAuth token */
  oauth_token?: Maybe<Scalars["String"]["output"]>;
  /** OAuth token secret */
  oauth_token_secret?: Maybe<Scalars["String"]["output"]>;
  /** OAuth provider */
  provider?: Maybe<Scalars["String"]["output"]>;
  /** Provider account ID */
  provider_account_id?: Maybe<Scalars["String"]["output"]>;
  /** OAuth refresh token */
  refresh_token?: Maybe<Scalars["String"]["output"]>;
  /** OAuth scope */
  scope?: Maybe<Scalars["String"]["output"]>;
  /** OAuth session state */
  session_state?: Maybe<Scalars["String"]["output"]>;
  /** Token type */
  token_type?: Maybe<Scalars["String"]["output"]>;
  /** Account type */
  type?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Reference to users table */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "accounts" */
export type Accounts_Max_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  /** OAuth access token */
  access_token?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Password hash for credentials providers (email/phone) */
  credential_hash?: InputMaybe<Order_By>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** OAuth ID token */
  id_token?: InputMaybe<Order_By>;
  /** OAuth token */
  oauth_token?: InputMaybe<Order_By>;
  /** OAuth token secret */
  oauth_token_secret?: InputMaybe<Order_By>;
  /** OAuth provider */
  provider?: InputMaybe<Order_By>;
  /** Provider account ID */
  provider_account_id?: InputMaybe<Order_By>;
  /** OAuth refresh token */
  refresh_token?: InputMaybe<Order_By>;
  /** OAuth scope */
  scope?: InputMaybe<Order_By>;
  /** OAuth session state */
  session_state?: InputMaybe<Order_By>;
  /** Token type */
  token_type?: InputMaybe<Order_By>;
  /** Account type */
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** Reference to users table */
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Accounts_Min_Fields = {
  __typename?: "accounts_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** OAuth access token */
  access_token?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Password hash for credentials providers (email/phone) */
  credential_hash?: Maybe<Scalars["String"]["output"]>;
  /** Token expiration timestamp */
  expires_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** OAuth ID token */
  id_token?: Maybe<Scalars["String"]["output"]>;
  /** OAuth token */
  oauth_token?: Maybe<Scalars["String"]["output"]>;
  /** OAuth token secret */
  oauth_token_secret?: Maybe<Scalars["String"]["output"]>;
  /** OAuth provider */
  provider?: Maybe<Scalars["String"]["output"]>;
  /** Provider account ID */
  provider_account_id?: Maybe<Scalars["String"]["output"]>;
  /** OAuth refresh token */
  refresh_token?: Maybe<Scalars["String"]["output"]>;
  /** OAuth scope */
  scope?: Maybe<Scalars["String"]["output"]>;
  /** OAuth session state */
  session_state?: Maybe<Scalars["String"]["output"]>;
  /** Token type */
  token_type?: Maybe<Scalars["String"]["output"]>;
  /** Account type */
  type?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Reference to users table */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "accounts" */
export type Accounts_Min_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  /** OAuth access token */
  access_token?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Password hash for credentials providers (email/phone) */
  credential_hash?: InputMaybe<Order_By>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** OAuth ID token */
  id_token?: InputMaybe<Order_By>;
  /** OAuth token */
  oauth_token?: InputMaybe<Order_By>;
  /** OAuth token secret */
  oauth_token_secret?: InputMaybe<Order_By>;
  /** OAuth provider */
  provider?: InputMaybe<Order_By>;
  /** Provider account ID */
  provider_account_id?: InputMaybe<Order_By>;
  /** OAuth refresh token */
  refresh_token?: InputMaybe<Order_By>;
  /** OAuth scope */
  scope?: InputMaybe<Order_By>;
  /** OAuth session state */
  session_state?: InputMaybe<Order_By>;
  /** Token type */
  token_type?: InputMaybe<Order_By>;
  /** Account type */
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** Reference to users table */
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "accounts" */
export type Accounts_Mutation_Response = {
  __typename?: "accounts_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Accounts>;
};

/** input type for inserting object relation for remote table "accounts" */
export type Accounts_Obj_Rel_Insert_Input = {
  data: Accounts_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Accounts_On_Conflict>;
};

/** on_conflict condition type for table "accounts" */
export type Accounts_On_Conflict = {
  constraint: Accounts_Constraint;
  update_columns?: Array<Accounts_Update_Column>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

/** Ordering options when selecting data from "accounts". */
export type Accounts_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  access_token?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  credential_hash?: InputMaybe<Order_By>;
  expires_at?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  id_token?: InputMaybe<Order_By>;
  oauth_token?: InputMaybe<Order_By>;
  oauth_token_secret?: InputMaybe<Order_By>;
  provider?: InputMaybe<Order_By>;
  provider_account_id?: InputMaybe<Order_By>;
  provider_data?: InputMaybe<Order_By>;
  refresh_token?: InputMaybe<Order_By>;
  scope?: InputMaybe<Order_By>;
  session_state?: InputMaybe<Order_By>;
  token_type?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: accounts */
export type Accounts_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Accounts_Prepend_Input = {
  /** Additional provider-specific data (e.g., Telegram username, photo_url) */
  provider_data?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "accounts" */
export enum Accounts_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  AccessToken = "access_token",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CredentialHash = "credential_hash",
  /** column name */
  ExpiresAt = "expires_at",
  /** column name */
  Id = "id",
  /** column name */
  IdToken = "id_token",
  /** column name */
  OauthToken = "oauth_token",
  /** column name */
  OauthTokenSecret = "oauth_token_secret",
  /** column name */
  Provider = "provider",
  /** column name */
  ProviderAccountId = "provider_account_id",
  /** column name */
  ProviderData = "provider_data",
  /** column name */
  RefreshToken = "refresh_token",
  /** column name */
  Scope = "scope",
  /** column name */
  SessionState = "session_state",
  /** column name */
  TokenType = "token_type",
  /** column name */
  Type = "type",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "accounts" */
export type Accounts_Set_Input = {
  /** OAuth access token */
  access_token?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Password hash for credentials providers (email/phone) */
  credential_hash?: InputMaybe<Scalars["String"]["input"]>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** OAuth ID token */
  id_token?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth token */
  oauth_token?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth token secret */
  oauth_token_secret?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth provider */
  provider?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider account ID */
  provider_account_id?: InputMaybe<Scalars["String"]["input"]>;
  /** Additional provider-specific data (e.g., Telegram username, photo_url) */
  provider_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** OAuth refresh token */
  refresh_token?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth scope */
  scope?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth session state */
  session_state?: InputMaybe<Scalars["String"]["input"]>;
  /** Token type */
  token_type?: InputMaybe<Scalars["String"]["input"]>;
  /** Account type */
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Reference to users table */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Accounts_Stddev_Fields = {
  __typename?: "accounts_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Token expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "accounts" */
export type Accounts_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Accounts_Stddev_Pop_Fields = {
  __typename?: "accounts_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Token expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "accounts" */
export type Accounts_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Accounts_Stddev_Samp_Fields = {
  __typename?: "accounts_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Token expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "accounts" */
export type Accounts_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "accounts" */
export type Accounts_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Accounts_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Accounts_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth access token */
  access_token?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Password hash for credentials providers (email/phone) */
  credential_hash?: InputMaybe<Scalars["String"]["input"]>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** OAuth ID token */
  id_token?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth token */
  oauth_token?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth token secret */
  oauth_token_secret?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth provider */
  provider?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider account ID */
  provider_account_id?: InputMaybe<Scalars["String"]["input"]>;
  /** Additional provider-specific data (e.g., Telegram username, photo_url) */
  provider_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** OAuth refresh token */
  refresh_token?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth scope */
  scope?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth session state */
  session_state?: InputMaybe<Scalars["String"]["input"]>;
  /** Token type */
  token_type?: InputMaybe<Scalars["String"]["input"]>;
  /** Account type */
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Reference to users table */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Accounts_Sum_Fields = {
  __typename?: "accounts_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Token expiration timestamp */
  expires_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "accounts" */
export type Accounts_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "accounts" */
export enum Accounts_Update_Column {
  /** column name */
  AccessToken = "access_token",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CredentialHash = "credential_hash",
  /** column name */
  ExpiresAt = "expires_at",
  /** column name */
  Id = "id",
  /** column name */
  IdToken = "id_token",
  /** column name */
  OauthToken = "oauth_token",
  /** column name */
  OauthTokenSecret = "oauth_token_secret",
  /** column name */
  Provider = "provider",
  /** column name */
  ProviderAccountId = "provider_account_id",
  /** column name */
  ProviderData = "provider_data",
  /** column name */
  RefreshToken = "refresh_token",
  /** column name */
  Scope = "scope",
  /** column name */
  SessionState = "session_state",
  /** column name */
  TokenType = "token_type",
  /** column name */
  Type = "type",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Accounts_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Accounts_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Accounts_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Accounts_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Accounts_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Accounts_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Accounts_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Accounts_Set_Input>;
  /** filter the rows which have to be updated */
  where: Accounts_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Accounts_Var_Pop_Fields = {
  __typename?: "accounts_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Token expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "accounts" */
export type Accounts_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Accounts_Var_Samp_Fields = {
  __typename?: "accounts_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Token expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "accounts" */
export type Accounts_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Accounts_Variance_Fields = {
  __typename?: "accounts_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Token expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "accounts" */
export type Accounts_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "auth_jwt" */
export type Auth_Jwt = {
  __typename?: "auth_jwt";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  jwt?: Maybe<Scalars["String"]["output"]>;
  redirect?: Maybe<Scalars["String"]["output"]>;
  updated_at: Scalars["bigint"]["output"];
};

/** aggregated selection of "auth_jwt" */
export type Auth_Jwt_Aggregate = {
  __typename?: "auth_jwt_aggregate";
  aggregate?: Maybe<Auth_Jwt_Aggregate_Fields>;
  nodes: Array<Auth_Jwt>;
};

/** aggregate fields of "auth_jwt" */
export type Auth_Jwt_Aggregate_Fields = {
  __typename?: "auth_jwt_aggregate_fields";
  avg?: Maybe<Auth_Jwt_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Auth_Jwt_Max_Fields>;
  min?: Maybe<Auth_Jwt_Min_Fields>;
  stddev?: Maybe<Auth_Jwt_Stddev_Fields>;
  stddev_pop?: Maybe<Auth_Jwt_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Auth_Jwt_Stddev_Samp_Fields>;
  sum?: Maybe<Auth_Jwt_Sum_Fields>;
  var_pop?: Maybe<Auth_Jwt_Var_Pop_Fields>;
  var_samp?: Maybe<Auth_Jwt_Var_Samp_Fields>;
  variance?: Maybe<Auth_Jwt_Variance_Fields>;
};

/** aggregate fields of "auth_jwt" */
export type Auth_Jwt_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Auth_Jwt_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Auth_Jwt_Avg_Fields = {
  __typename?: "auth_jwt_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "auth_jwt". All fields are combined with a logical 'AND'. */
export type Auth_Jwt_Bool_Exp = {
  _and?: InputMaybe<Array<Auth_Jwt_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Auth_Jwt_Bool_Exp>;
  _or?: InputMaybe<Array<Auth_Jwt_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  jwt?: InputMaybe<String_Comparison_Exp>;
  redirect?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
};

/** unique or primary key constraints on table "auth_jwt" */
export enum Auth_Jwt_Constraint {
  /** unique or primary key constraint on columns "id" */
  AuthJwtPkey = "auth_jwt_pkey",
}

/** input type for incrementing numeric columns in table "auth_jwt" */
export type Auth_Jwt_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "auth_jwt" */
export type Auth_Jwt_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  jwt?: InputMaybe<Scalars["String"]["input"]>;
  redirect?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate max on columns */
export type Auth_Jwt_Max_Fields = {
  __typename?: "auth_jwt_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  jwt?: Maybe<Scalars["String"]["output"]>;
  redirect?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregate min on columns */
export type Auth_Jwt_Min_Fields = {
  __typename?: "auth_jwt_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  jwt?: Maybe<Scalars["String"]["output"]>;
  redirect?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** response of any mutation on the table "auth_jwt" */
export type Auth_Jwt_Mutation_Response = {
  __typename?: "auth_jwt_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Auth_Jwt>;
};

/** input type for inserting object relation for remote table "auth_jwt" */
export type Auth_Jwt_Obj_Rel_Insert_Input = {
  data: Auth_Jwt_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Auth_Jwt_On_Conflict>;
};

/** on_conflict condition type for table "auth_jwt" */
export type Auth_Jwt_On_Conflict = {
  constraint: Auth_Jwt_Constraint;
  update_columns?: Array<Auth_Jwt_Update_Column>;
  where?: InputMaybe<Auth_Jwt_Bool_Exp>;
};

/** Ordering options when selecting data from "auth_jwt". */
export type Auth_Jwt_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  jwt?: InputMaybe<Order_By>;
  redirect?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: auth_jwt */
export type Auth_Jwt_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "auth_jwt" */
export enum Auth_Jwt_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Jwt = "jwt",
  /** column name */
  Redirect = "redirect",
  /** column name */
  UpdatedAt = "updated_at",
}

/** input type for updating data in table "auth_jwt" */
export type Auth_Jwt_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  jwt?: InputMaybe<Scalars["String"]["input"]>;
  redirect?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate stddev on columns */
export type Auth_Jwt_Stddev_Fields = {
  __typename?: "auth_jwt_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Auth_Jwt_Stddev_Pop_Fields = {
  __typename?: "auth_jwt_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Auth_Jwt_Stddev_Samp_Fields = {
  __typename?: "auth_jwt_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "auth_jwt" */
export type Auth_Jwt_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Auth_Jwt_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Auth_Jwt_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  jwt?: InputMaybe<Scalars["String"]["input"]>;
  redirect?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate sum on columns */
export type Auth_Jwt_Sum_Fields = {
  __typename?: "auth_jwt_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "auth_jwt" */
export enum Auth_Jwt_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Jwt = "jwt",
  /** column name */
  Redirect = "redirect",
  /** column name */
  UpdatedAt = "updated_at",
}

export type Auth_Jwt_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Auth_Jwt_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Auth_Jwt_Set_Input>;
  /** filter the rows which have to be updated */
  where: Auth_Jwt_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Auth_Jwt_Var_Pop_Fields = {
  __typename?: "auth_jwt_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Auth_Jwt_Var_Samp_Fields = {
  __typename?: "auth_jwt_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Auth_Jwt_Variance_Fields = {
  __typename?: "auth_jwt_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["bigint"]["input"]>;
  _gt?: InputMaybe<Scalars["bigint"]["input"]>;
  _gte?: InputMaybe<Scalars["bigint"]["input"]>;
  _in?: InputMaybe<Array<Scalars["bigint"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["bigint"]["input"]>;
  _lte?: InputMaybe<Scalars["bigint"]["input"]>;
  _neq?: InputMaybe<Scalars["bigint"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["bigint"]["input"]>>;
};

/** columns and relationships of "storage.buckets" */
export type Buckets = {
  __typename?: "buckets";
  cacheControl?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["timestamptz"]["output"];
  downloadExpiration: Scalars["Int"]["output"];
  /** An array relationship */
  files: Array<Files>;
  /** An aggregate relationship */
  files_aggregate: Files_Aggregate;
  id: Scalars["String"]["output"];
  maxUploadFileSize: Scalars["Int"]["output"];
  minUploadFileSize: Scalars["Int"]["output"];
  presignedUrlsEnabled: Scalars["Boolean"]["output"];
  updatedAt: Scalars["timestamptz"]["output"];
};

/** columns and relationships of "storage.buckets" */
export type BucketsFilesArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};

/** columns and relationships of "storage.buckets" */
export type BucketsFiles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};

/** aggregated selection of "storage.buckets" */
export type Buckets_Aggregate = {
  __typename?: "buckets_aggregate";
  aggregate?: Maybe<Buckets_Aggregate_Fields>;
  nodes: Array<Buckets>;
};

/** aggregate fields of "storage.buckets" */
export type Buckets_Aggregate_Fields = {
  __typename?: "buckets_aggregate_fields";
  avg?: Maybe<Buckets_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Buckets_Max_Fields>;
  min?: Maybe<Buckets_Min_Fields>;
  stddev?: Maybe<Buckets_Stddev_Fields>;
  stddev_pop?: Maybe<Buckets_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Buckets_Stddev_Samp_Fields>;
  sum?: Maybe<Buckets_Sum_Fields>;
  var_pop?: Maybe<Buckets_Var_Pop_Fields>;
  var_samp?: Maybe<Buckets_Var_Samp_Fields>;
  variance?: Maybe<Buckets_Variance_Fields>;
};

/** aggregate fields of "storage.buckets" */
export type Buckets_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Buckets_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Buckets_Avg_Fields = {
  __typename?: "buckets_avg_fields";
  downloadExpiration?: Maybe<Scalars["Float"]["output"]>;
  maxUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
  minUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "storage.buckets". All fields are combined with a logical 'AND'. */
export type Buckets_Bool_Exp = {
  _and?: InputMaybe<Array<Buckets_Bool_Exp>>;
  _not?: InputMaybe<Buckets_Bool_Exp>;
  _or?: InputMaybe<Array<Buckets_Bool_Exp>>;
  cacheControl?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  downloadExpiration?: InputMaybe<Int_Comparison_Exp>;
  files?: InputMaybe<Files_Bool_Exp>;
  files_aggregate?: InputMaybe<Files_Aggregate_Bool_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  maxUploadFileSize?: InputMaybe<Int_Comparison_Exp>;
  minUploadFileSize?: InputMaybe<Int_Comparison_Exp>;
  presignedUrlsEnabled?: InputMaybe<Boolean_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "storage.buckets" */
export enum Buckets_Constraint {
  /** unique or primary key constraint on columns "id" */
  BucketsPkey = "buckets_pkey",
}

/** input type for incrementing numeric columns in table "storage.buckets" */
export type Buckets_Inc_Input = {
  downloadExpiration?: InputMaybe<Scalars["Int"]["input"]>;
  maxUploadFileSize?: InputMaybe<Scalars["Int"]["input"]>;
  minUploadFileSize?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "storage.buckets" */
export type Buckets_Insert_Input = {
  cacheControl?: InputMaybe<Scalars["String"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  downloadExpiration?: InputMaybe<Scalars["Int"]["input"]>;
  files?: InputMaybe<Files_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  maxUploadFileSize?: InputMaybe<Scalars["Int"]["input"]>;
  minUploadFileSize?: InputMaybe<Scalars["Int"]["input"]>;
  presignedUrlsEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type Buckets_Max_Fields = {
  __typename?: "buckets_max_fields";
  cacheControl?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["timestamptz"]["output"]>;
  downloadExpiration?: Maybe<Scalars["Int"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  maxUploadFileSize?: Maybe<Scalars["Int"]["output"]>;
  minUploadFileSize?: Maybe<Scalars["Int"]["output"]>;
  updatedAt?: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregate min on columns */
export type Buckets_Min_Fields = {
  __typename?: "buckets_min_fields";
  cacheControl?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["timestamptz"]["output"]>;
  downloadExpiration?: Maybe<Scalars["Int"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  maxUploadFileSize?: Maybe<Scalars["Int"]["output"]>;
  minUploadFileSize?: Maybe<Scalars["Int"]["output"]>;
  updatedAt?: Maybe<Scalars["timestamptz"]["output"]>;
};

/** response of any mutation on the table "storage.buckets" */
export type Buckets_Mutation_Response = {
  __typename?: "buckets_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Buckets>;
};

/** input type for inserting object relation for remote table "storage.buckets" */
export type Buckets_Obj_Rel_Insert_Input = {
  data: Buckets_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Buckets_On_Conflict>;
};

/** on_conflict condition type for table "storage.buckets" */
export type Buckets_On_Conflict = {
  constraint: Buckets_Constraint;
  update_columns?: Array<Buckets_Update_Column>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};

/** Ordering options when selecting data from "storage.buckets". */
export type Buckets_Order_By = {
  cacheControl?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  downloadExpiration?: InputMaybe<Order_By>;
  files_aggregate?: InputMaybe<Files_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  maxUploadFileSize?: InputMaybe<Order_By>;
  minUploadFileSize?: InputMaybe<Order_By>;
  presignedUrlsEnabled?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: storage.buckets */
export type Buckets_Pk_Columns_Input = {
  id: Scalars["String"]["input"];
};

/** select columns of table "storage.buckets" */
export enum Buckets_Select_Column {
  /** column name */
  CacheControl = "cacheControl",
  /** column name */
  CreatedAt = "createdAt",
  /** column name */
  DownloadExpiration = "downloadExpiration",
  /** column name */
  Id = "id",
  /** column name */
  MaxUploadFileSize = "maxUploadFileSize",
  /** column name */
  MinUploadFileSize = "minUploadFileSize",
  /** column name */
  PresignedUrlsEnabled = "presignedUrlsEnabled",
  /** column name */
  UpdatedAt = "updatedAt",
}

/** input type for updating data in table "storage.buckets" */
export type Buckets_Set_Input = {
  cacheControl?: InputMaybe<Scalars["String"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  downloadExpiration?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  maxUploadFileSize?: InputMaybe<Scalars["Int"]["input"]>;
  minUploadFileSize?: InputMaybe<Scalars["Int"]["input"]>;
  presignedUrlsEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate stddev on columns */
export type Buckets_Stddev_Fields = {
  __typename?: "buckets_stddev_fields";
  downloadExpiration?: Maybe<Scalars["Float"]["output"]>;
  maxUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
  minUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Buckets_Stddev_Pop_Fields = {
  __typename?: "buckets_stddev_pop_fields";
  downloadExpiration?: Maybe<Scalars["Float"]["output"]>;
  maxUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
  minUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Buckets_Stddev_Samp_Fields = {
  __typename?: "buckets_stddev_samp_fields";
  downloadExpiration?: Maybe<Scalars["Float"]["output"]>;
  maxUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
  minUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "buckets" */
export type Buckets_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Buckets_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Buckets_Stream_Cursor_Value_Input = {
  cacheControl?: InputMaybe<Scalars["String"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  downloadExpiration?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  maxUploadFileSize?: InputMaybe<Scalars["Int"]["input"]>;
  minUploadFileSize?: InputMaybe<Scalars["Int"]["input"]>;
  presignedUrlsEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate sum on columns */
export type Buckets_Sum_Fields = {
  __typename?: "buckets_sum_fields";
  downloadExpiration?: Maybe<Scalars["Int"]["output"]>;
  maxUploadFileSize?: Maybe<Scalars["Int"]["output"]>;
  minUploadFileSize?: Maybe<Scalars["Int"]["output"]>;
};

/** update columns of table "storage.buckets" */
export enum Buckets_Update_Column {
  /** column name */
  CacheControl = "cacheControl",
  /** column name */
  CreatedAt = "createdAt",
  /** column name */
  DownloadExpiration = "downloadExpiration",
  /** column name */
  Id = "id",
  /** column name */
  MaxUploadFileSize = "maxUploadFileSize",
  /** column name */
  MinUploadFileSize = "minUploadFileSize",
  /** column name */
  PresignedUrlsEnabled = "presignedUrlsEnabled",
  /** column name */
  UpdatedAt = "updatedAt",
}

export type Buckets_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Buckets_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Buckets_Set_Input>;
  /** filter the rows which have to be updated */
  where: Buckets_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Buckets_Var_Pop_Fields = {
  __typename?: "buckets_var_pop_fields";
  downloadExpiration?: Maybe<Scalars["Float"]["output"]>;
  maxUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
  minUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Buckets_Var_Samp_Fields = {
  __typename?: "buckets_var_samp_fields";
  downloadExpiration?: Maybe<Scalars["Float"]["output"]>;
  maxUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
  minUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Buckets_Variance_Fields = {
  __typename?: "buckets_variance_fields";
  downloadExpiration?: Maybe<Scalars["Float"]["output"]>;
  maxUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
  minUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = "ASC",
  /** descending ordering of the cursor */
  Desc = "DESC",
}

/** columns and relationships of "debug" */
export type Debug = {
  __typename?: "debug";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** Debug value data */
  value?: Maybe<Scalars["jsonb"]["output"]>;
};

/** columns and relationships of "debug" */
export type DebugValueArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "debug" */
export type Debug_Aggregate = {
  __typename?: "debug_aggregate";
  aggregate?: Maybe<Debug_Aggregate_Fields>;
  nodes: Array<Debug>;
};

/** aggregate fields of "debug" */
export type Debug_Aggregate_Fields = {
  __typename?: "debug_aggregate_fields";
  avg?: Maybe<Debug_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Debug_Max_Fields>;
  min?: Maybe<Debug_Min_Fields>;
  stddev?: Maybe<Debug_Stddev_Fields>;
  stddev_pop?: Maybe<Debug_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Debug_Stddev_Samp_Fields>;
  sum?: Maybe<Debug_Sum_Fields>;
  var_pop?: Maybe<Debug_Var_Pop_Fields>;
  var_samp?: Maybe<Debug_Var_Samp_Fields>;
  variance?: Maybe<Debug_Variance_Fields>;
};

/** aggregate fields of "debug" */
export type Debug_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Debug_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Debug_Append_Input = {
  /** Debug value data */
  value?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate avg on columns */
export type Debug_Avg_Fields = {
  __typename?: "debug_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "debug". All fields are combined with a logical 'AND'. */
export type Debug_Bool_Exp = {
  _and?: InputMaybe<Array<Debug_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Debug_Bool_Exp>;
  _or?: InputMaybe<Array<Debug_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  value?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "debug" */
export enum Debug_Constraint {
  /** unique or primary key constraint on columns "id" */
  DebugPkey = "debug_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Debug_Delete_At_Path_Input = {
  /** Debug value data */
  value?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Debug_Delete_Elem_Input = {
  /** Debug value data */
  value?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Debug_Delete_Key_Input = {
  /** Debug value data */
  value?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "debug" */
export type Debug_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "debug" */
export type Debug_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Debug value data */
  value?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate max on columns */
export type Debug_Max_Fields = {
  __typename?: "debug_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregate min on columns */
export type Debug_Min_Fields = {
  __typename?: "debug_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** response of any mutation on the table "debug" */
export type Debug_Mutation_Response = {
  __typename?: "debug_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Debug>;
};

/** input type for inserting object relation for remote table "debug" */
export type Debug_Obj_Rel_Insert_Input = {
  data: Debug_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Debug_On_Conflict>;
};

/** on_conflict condition type for table "debug" */
export type Debug_On_Conflict = {
  constraint: Debug_Constraint;
  update_columns?: Array<Debug_Update_Column>;
  where?: InputMaybe<Debug_Bool_Exp>;
};

/** Ordering options when selecting data from "debug". */
export type Debug_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: debug */
export type Debug_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Debug_Prepend_Input = {
  /** Debug value data */
  value?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "debug" */
export enum Debug_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  Value = "value",
}

/** input type for updating data in table "debug" */
export type Debug_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Debug value data */
  value?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate stddev on columns */
export type Debug_Stddev_Fields = {
  __typename?: "debug_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Debug_Stddev_Pop_Fields = {
  __typename?: "debug_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Debug_Stddev_Samp_Fields = {
  __typename?: "debug_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "debug" */
export type Debug_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Debug_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Debug_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Debug value data */
  value?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate sum on columns */
export type Debug_Sum_Fields = {
  __typename?: "debug_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "debug" */
export enum Debug_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  Value = "value",
}

export type Debug_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Debug_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Debug_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Debug_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Debug_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Debug_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Debug_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Debug_Set_Input>;
  /** filter the rows which have to be updated */
  where: Debug_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Debug_Var_Pop_Fields = {
  __typename?: "debug_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Debug_Var_Samp_Fields = {
  __typename?: "debug_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Debug_Variance_Fields = {
  __typename?: "debug_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "events" */
export type Events = {
  __typename?: "events";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  end?: Maybe<Scalars["bigint"]["output"]>;
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  meta?: Maybe<Scalars["jsonb"]["output"]>;
  object_id?: Maybe<Scalars["uuid"]["output"]>;
  one_off_end_id?: Maybe<Scalars["String"]["output"]>;
  one_off_start_id?: Maybe<Scalars["String"]["output"]>;
  plan_end?: Maybe<Scalars["bigint"]["output"]>;
  plan_start: Scalars["bigint"]["output"];
  /** An object relationship */
  schedule?: Maybe<Schedule>;
  schedule_id?: Maybe<Scalars["uuid"]["output"]>;
  start?: Maybe<Scalars["bigint"]["output"]>;
  status: Scalars["String"]["output"];
  title?: Maybe<Scalars["String"]["output"]>;
  updated_at: Scalars["bigint"]["output"];
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** columns and relationships of "events" */
export type EventsMetaArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "events" */
export type Events_Aggregate = {
  __typename?: "events_aggregate";
  aggregate?: Maybe<Events_Aggregate_Fields>;
  nodes: Array<Events>;
};

export type Events_Aggregate_Bool_Exp = {
  count?: InputMaybe<Events_Aggregate_Bool_Exp_Count>;
};

export type Events_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Events_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Events_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "events" */
export type Events_Aggregate_Fields = {
  __typename?: "events_aggregate_fields";
  avg?: Maybe<Events_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Events_Max_Fields>;
  min?: Maybe<Events_Min_Fields>;
  stddev?: Maybe<Events_Stddev_Fields>;
  stddev_pop?: Maybe<Events_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Events_Stddev_Samp_Fields>;
  sum?: Maybe<Events_Sum_Fields>;
  var_pop?: Maybe<Events_Var_Pop_Fields>;
  var_samp?: Maybe<Events_Var_Samp_Fields>;
  variance?: Maybe<Events_Variance_Fields>;
};

/** aggregate fields of "events" */
export type Events_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Events_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "events" */
export type Events_Aggregate_Order_By = {
  avg?: InputMaybe<Events_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Events_Max_Order_By>;
  min?: InputMaybe<Events_Min_Order_By>;
  stddev?: InputMaybe<Events_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Events_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Events_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Events_Sum_Order_By>;
  var_pop?: InputMaybe<Events_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Events_Var_Samp_Order_By>;
  variance?: InputMaybe<Events_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Events_Append_Input = {
  meta?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "events" */
export type Events_Arr_Rel_Insert_Input = {
  data: Array<Events_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Events_On_Conflict>;
};

/** aggregate avg on columns */
export type Events_Avg_Fields = {
  __typename?: "events_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  end?: Maybe<Scalars["Float"]["output"]>;
  plan_end?: Maybe<Scalars["Float"]["output"]>;
  plan_start?: Maybe<Scalars["Float"]["output"]>;
  start?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "events" */
export type Events_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  end?: InputMaybe<Order_By>;
  plan_end?: InputMaybe<Order_By>;
  plan_start?: InputMaybe<Order_By>;
  start?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "events". All fields are combined with a logical 'AND'. */
export type Events_Bool_Exp = {
  _and?: InputMaybe<Array<Events_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Events_Bool_Exp>;
  _or?: InputMaybe<Array<Events_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  end?: InputMaybe<Bigint_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  meta?: InputMaybe<Jsonb_Comparison_Exp>;
  object_id?: InputMaybe<Uuid_Comparison_Exp>;
  one_off_end_id?: InputMaybe<String_Comparison_Exp>;
  one_off_start_id?: InputMaybe<String_Comparison_Exp>;
  plan_end?: InputMaybe<Bigint_Comparison_Exp>;
  plan_start?: InputMaybe<Bigint_Comparison_Exp>;
  schedule?: InputMaybe<Schedule_Bool_Exp>;
  schedule_id?: InputMaybe<Uuid_Comparison_Exp>;
  start?: InputMaybe<Bigint_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "events" */
export enum Events_Constraint {
  /** unique or primary key constraint on columns "id" */
  EventsPkey = "events_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Events_Delete_At_Path_Input = {
  meta?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Events_Delete_Elem_Input = {
  meta?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Events_Delete_Key_Input = {
  meta?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "events" */
export type Events_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  end?: InputMaybe<Scalars["bigint"]["input"]>;
  plan_end?: InputMaybe<Scalars["bigint"]["input"]>;
  plan_start?: InputMaybe<Scalars["bigint"]["input"]>;
  start?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "events" */
export type Events_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  end?: InputMaybe<Scalars["bigint"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  meta?: InputMaybe<Scalars["jsonb"]["input"]>;
  object_id?: InputMaybe<Scalars["uuid"]["input"]>;
  one_off_end_id?: InputMaybe<Scalars["String"]["input"]>;
  one_off_start_id?: InputMaybe<Scalars["String"]["input"]>;
  plan_end?: InputMaybe<Scalars["bigint"]["input"]>;
  plan_start?: InputMaybe<Scalars["bigint"]["input"]>;
  schedule?: InputMaybe<Schedule_Obj_Rel_Insert_Input>;
  schedule_id?: InputMaybe<Scalars["uuid"]["input"]>;
  start?: InputMaybe<Scalars["bigint"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Events_Max_Fields = {
  __typename?: "events_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  end?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  object_id?: Maybe<Scalars["uuid"]["output"]>;
  one_off_end_id?: Maybe<Scalars["String"]["output"]>;
  one_off_start_id?: Maybe<Scalars["String"]["output"]>;
  plan_end?: Maybe<Scalars["bigint"]["output"]>;
  plan_start?: Maybe<Scalars["bigint"]["output"]>;
  schedule_id?: Maybe<Scalars["uuid"]["output"]>;
  start?: Maybe<Scalars["bigint"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "events" */
export type Events_Max_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  end?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  object_id?: InputMaybe<Order_By>;
  one_off_end_id?: InputMaybe<Order_By>;
  one_off_start_id?: InputMaybe<Order_By>;
  plan_end?: InputMaybe<Order_By>;
  plan_start?: InputMaybe<Order_By>;
  schedule_id?: InputMaybe<Order_By>;
  start?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Events_Min_Fields = {
  __typename?: "events_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  end?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  object_id?: Maybe<Scalars["uuid"]["output"]>;
  one_off_end_id?: Maybe<Scalars["String"]["output"]>;
  one_off_start_id?: Maybe<Scalars["String"]["output"]>;
  plan_end?: Maybe<Scalars["bigint"]["output"]>;
  plan_start?: Maybe<Scalars["bigint"]["output"]>;
  schedule_id?: Maybe<Scalars["uuid"]["output"]>;
  start?: Maybe<Scalars["bigint"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "events" */
export type Events_Min_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  end?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  object_id?: InputMaybe<Order_By>;
  one_off_end_id?: InputMaybe<Order_By>;
  one_off_start_id?: InputMaybe<Order_By>;
  plan_end?: InputMaybe<Order_By>;
  plan_start?: InputMaybe<Order_By>;
  schedule_id?: InputMaybe<Order_By>;
  start?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "events" */
export type Events_Mutation_Response = {
  __typename?: "events_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Events>;
};

/** input type for inserting object relation for remote table "events" */
export type Events_Obj_Rel_Insert_Input = {
  data: Events_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Events_On_Conflict>;
};

/** on_conflict condition type for table "events" */
export type Events_On_Conflict = {
  constraint: Events_Constraint;
  update_columns?: Array<Events_Update_Column>;
  where?: InputMaybe<Events_Bool_Exp>;
};

/** Ordering options when selecting data from "events". */
export type Events_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  end?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  meta?: InputMaybe<Order_By>;
  object_id?: InputMaybe<Order_By>;
  one_off_end_id?: InputMaybe<Order_By>;
  one_off_start_id?: InputMaybe<Order_By>;
  plan_end?: InputMaybe<Order_By>;
  plan_start?: InputMaybe<Order_By>;
  schedule?: InputMaybe<Schedule_Order_By>;
  schedule_id?: InputMaybe<Order_By>;
  start?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: events */
export type Events_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Events_Prepend_Input = {
  meta?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "events" */
export enum Events_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  End = "end",
  /** column name */
  Id = "id",
  /** column name */
  Meta = "meta",
  /** column name */
  ObjectId = "object_id",
  /** column name */
  OneOffEndId = "one_off_end_id",
  /** column name */
  OneOffStartId = "one_off_start_id",
  /** column name */
  PlanEnd = "plan_end",
  /** column name */
  PlanStart = "plan_start",
  /** column name */
  ScheduleId = "schedule_id",
  /** column name */
  Start = "start",
  /** column name */
  Status = "status",
  /** column name */
  Title = "title",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "events" */
export type Events_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  end?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  meta?: InputMaybe<Scalars["jsonb"]["input"]>;
  object_id?: InputMaybe<Scalars["uuid"]["input"]>;
  one_off_end_id?: InputMaybe<Scalars["String"]["input"]>;
  one_off_start_id?: InputMaybe<Scalars["String"]["input"]>;
  plan_end?: InputMaybe<Scalars["bigint"]["input"]>;
  plan_start?: InputMaybe<Scalars["bigint"]["input"]>;
  schedule_id?: InputMaybe<Scalars["uuid"]["input"]>;
  start?: InputMaybe<Scalars["bigint"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Events_Stddev_Fields = {
  __typename?: "events_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  end?: Maybe<Scalars["Float"]["output"]>;
  plan_end?: Maybe<Scalars["Float"]["output"]>;
  plan_start?: Maybe<Scalars["Float"]["output"]>;
  start?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "events" */
export type Events_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  end?: InputMaybe<Order_By>;
  plan_end?: InputMaybe<Order_By>;
  plan_start?: InputMaybe<Order_By>;
  start?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Events_Stddev_Pop_Fields = {
  __typename?: "events_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  end?: Maybe<Scalars["Float"]["output"]>;
  plan_end?: Maybe<Scalars["Float"]["output"]>;
  plan_start?: Maybe<Scalars["Float"]["output"]>;
  start?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "events" */
export type Events_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  end?: InputMaybe<Order_By>;
  plan_end?: InputMaybe<Order_By>;
  plan_start?: InputMaybe<Order_By>;
  start?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Events_Stddev_Samp_Fields = {
  __typename?: "events_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  end?: Maybe<Scalars["Float"]["output"]>;
  plan_end?: Maybe<Scalars["Float"]["output"]>;
  plan_start?: Maybe<Scalars["Float"]["output"]>;
  start?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "events" */
export type Events_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  end?: InputMaybe<Order_By>;
  plan_end?: InputMaybe<Order_By>;
  plan_start?: InputMaybe<Order_By>;
  start?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "events" */
export type Events_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Events_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Events_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  end?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  meta?: InputMaybe<Scalars["jsonb"]["input"]>;
  object_id?: InputMaybe<Scalars["uuid"]["input"]>;
  one_off_end_id?: InputMaybe<Scalars["String"]["input"]>;
  one_off_start_id?: InputMaybe<Scalars["String"]["input"]>;
  plan_end?: InputMaybe<Scalars["bigint"]["input"]>;
  plan_start?: InputMaybe<Scalars["bigint"]["input"]>;
  schedule_id?: InputMaybe<Scalars["uuid"]["input"]>;
  start?: InputMaybe<Scalars["bigint"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Events_Sum_Fields = {
  __typename?: "events_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  end?: Maybe<Scalars["bigint"]["output"]>;
  plan_end?: Maybe<Scalars["bigint"]["output"]>;
  plan_start?: Maybe<Scalars["bigint"]["output"]>;
  start?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "events" */
export type Events_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  end?: InputMaybe<Order_By>;
  plan_end?: InputMaybe<Order_By>;
  plan_start?: InputMaybe<Order_By>;
  start?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "events" */
export enum Events_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  End = "end",
  /** column name */
  Id = "id",
  /** column name */
  Meta = "meta",
  /** column name */
  ObjectId = "object_id",
  /** column name */
  OneOffEndId = "one_off_end_id",
  /** column name */
  OneOffStartId = "one_off_start_id",
  /** column name */
  PlanEnd = "plan_end",
  /** column name */
  PlanStart = "plan_start",
  /** column name */
  ScheduleId = "schedule_id",
  /** column name */
  Start = "start",
  /** column name */
  Status = "status",
  /** column name */
  Title = "title",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Events_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Events_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Events_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Events_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Events_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Events_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Events_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Events_Set_Input>;
  /** filter the rows which have to be updated */
  where: Events_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Events_Var_Pop_Fields = {
  __typename?: "events_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  end?: Maybe<Scalars["Float"]["output"]>;
  plan_end?: Maybe<Scalars["Float"]["output"]>;
  plan_start?: Maybe<Scalars["Float"]["output"]>;
  start?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "events" */
export type Events_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  end?: InputMaybe<Order_By>;
  plan_end?: InputMaybe<Order_By>;
  plan_start?: InputMaybe<Order_By>;
  start?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Events_Var_Samp_Fields = {
  __typename?: "events_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  end?: Maybe<Scalars["Float"]["output"]>;
  plan_end?: Maybe<Scalars["Float"]["output"]>;
  plan_start?: Maybe<Scalars["Float"]["output"]>;
  start?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "events" */
export type Events_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  end?: InputMaybe<Order_By>;
  plan_end?: InputMaybe<Order_By>;
  plan_start?: InputMaybe<Order_By>;
  start?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Events_Variance_Fields = {
  __typename?: "events_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  end?: Maybe<Scalars["Float"]["output"]>;
  plan_end?: Maybe<Scalars["Float"]["output"]>;
  plan_start?: Maybe<Scalars["Float"]["output"]>;
  start?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "events" */
export type Events_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  end?: InputMaybe<Order_By>;
  plan_end?: InputMaybe<Order_By>;
  plan_start?: InputMaybe<Order_By>;
  start?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "storage.files" */
export type Files = {
  __typename?: "files";
  /** An object relationship */
  bucket: Buckets;
  bucketId: Scalars["String"]["output"];
  createdAt: Scalars["timestamptz"]["output"];
  etag?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["uuid"]["output"];
  isUploaded?: Maybe<Scalars["Boolean"]["output"]>;
  metadata?: Maybe<Scalars["jsonb"]["output"]>;
  mimeType?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  size?: Maybe<Scalars["Int"]["output"]>;
  updatedAt: Scalars["timestamptz"]["output"];
  uploadedByUserId?: Maybe<Scalars["uuid"]["output"]>;
};

/** columns and relationships of "storage.files" */
export type FilesMetadataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "storage.files" */
export type Files_Aggregate = {
  __typename?: "files_aggregate";
  aggregate?: Maybe<Files_Aggregate_Fields>;
  nodes: Array<Files>;
};

export type Files_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Files_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Files_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Files_Aggregate_Bool_Exp_Count>;
};

export type Files_Aggregate_Bool_Exp_Bool_And = {
  arguments: Files_Select_Column_Files_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Files_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Files_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Files_Select_Column_Files_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Files_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Files_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Files_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Files_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "storage.files" */
export type Files_Aggregate_Fields = {
  __typename?: "files_aggregate_fields";
  avg?: Maybe<Files_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Files_Max_Fields>;
  min?: Maybe<Files_Min_Fields>;
  stddev?: Maybe<Files_Stddev_Fields>;
  stddev_pop?: Maybe<Files_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Files_Stddev_Samp_Fields>;
  sum?: Maybe<Files_Sum_Fields>;
  var_pop?: Maybe<Files_Var_Pop_Fields>;
  var_samp?: Maybe<Files_Var_Samp_Fields>;
  variance?: Maybe<Files_Variance_Fields>;
};

/** aggregate fields of "storage.files" */
export type Files_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Files_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "storage.files" */
export type Files_Aggregate_Order_By = {
  avg?: InputMaybe<Files_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Files_Max_Order_By>;
  min?: InputMaybe<Files_Min_Order_By>;
  stddev?: InputMaybe<Files_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Files_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Files_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Files_Sum_Order_By>;
  var_pop?: InputMaybe<Files_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Files_Var_Samp_Order_By>;
  variance?: InputMaybe<Files_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Files_Append_Input = {
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "storage.files" */
export type Files_Arr_Rel_Insert_Input = {
  data: Array<Files_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Files_On_Conflict>;
};

/** aggregate avg on columns */
export type Files_Avg_Fields = {
  __typename?: "files_avg_fields";
  size?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "storage.files" */
export type Files_Avg_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "storage.files". All fields are combined with a logical 'AND'. */
export type Files_Bool_Exp = {
  _and?: InputMaybe<Array<Files_Bool_Exp>>;
  _not?: InputMaybe<Files_Bool_Exp>;
  _or?: InputMaybe<Array<Files_Bool_Exp>>;
  bucket?: InputMaybe<Buckets_Bool_Exp>;
  bucketId?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  etag?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  isUploaded?: InputMaybe<Boolean_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  mimeType?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  size?: InputMaybe<Int_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  uploadedByUserId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "storage.files" */
export enum Files_Constraint {
  /** unique or primary key constraint on columns "id" */
  FilesPkey = "files_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Files_Delete_At_Path_Input = {
  metadata?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Files_Delete_Elem_Input = {
  metadata?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Files_Delete_Key_Input = {
  metadata?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "storage.files" */
export type Files_Inc_Input = {
  size?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "storage.files" */
export type Files_Insert_Input = {
  bucket?: InputMaybe<Buckets_Obj_Rel_Insert_Input>;
  bucketId?: InputMaybe<Scalars["String"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  etag?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  isUploaded?: InputMaybe<Scalars["Boolean"]["input"]>;
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  mimeType?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  size?: InputMaybe<Scalars["Int"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  uploadedByUserId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Files_Max_Fields = {
  __typename?: "files_max_fields";
  bucketId?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["timestamptz"]["output"]>;
  etag?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  mimeType?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  size?: Maybe<Scalars["Int"]["output"]>;
  updatedAt?: Maybe<Scalars["timestamptz"]["output"]>;
  uploadedByUserId?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "storage.files" */
export type Files_Max_Order_By = {
  bucketId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  etag?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mimeType?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  uploadedByUserId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Files_Min_Fields = {
  __typename?: "files_min_fields";
  bucketId?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["timestamptz"]["output"]>;
  etag?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  mimeType?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  size?: Maybe<Scalars["Int"]["output"]>;
  updatedAt?: Maybe<Scalars["timestamptz"]["output"]>;
  uploadedByUserId?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "storage.files" */
export type Files_Min_Order_By = {
  bucketId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  etag?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mimeType?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  uploadedByUserId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "storage.files" */
export type Files_Mutation_Response = {
  __typename?: "files_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Files>;
};

/** input type for inserting object relation for remote table "storage.files" */
export type Files_Obj_Rel_Insert_Input = {
  data: Files_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Files_On_Conflict>;
};

/** on_conflict condition type for table "storage.files" */
export type Files_On_Conflict = {
  constraint: Files_Constraint;
  update_columns?: Array<Files_Update_Column>;
  where?: InputMaybe<Files_Bool_Exp>;
};

/** Ordering options when selecting data from "storage.files". */
export type Files_Order_By = {
  bucket?: InputMaybe<Buckets_Order_By>;
  bucketId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  etag?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isUploaded?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  mimeType?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  uploadedByUserId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: storage.files */
export type Files_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Files_Prepend_Input = {
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "storage.files" */
export enum Files_Select_Column {
  /** column name */
  BucketId = "bucketId",
  /** column name */
  CreatedAt = "createdAt",
  /** column name */
  Etag = "etag",
  /** column name */
  Id = "id",
  /** column name */
  IsUploaded = "isUploaded",
  /** column name */
  Metadata = "metadata",
  /** column name */
  MimeType = "mimeType",
  /** column name */
  Name = "name",
  /** column name */
  Size = "size",
  /** column name */
  UpdatedAt = "updatedAt",
  /** column name */
  UploadedByUserId = "uploadedByUserId",
}

/** select "files_aggregate_bool_exp_bool_and_arguments_columns" columns of table "storage.files" */
export enum Files_Select_Column_Files_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsUploaded = "isUploaded",
}

/** select "files_aggregate_bool_exp_bool_or_arguments_columns" columns of table "storage.files" */
export enum Files_Select_Column_Files_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsUploaded = "isUploaded",
}

/** input type for updating data in table "storage.files" */
export type Files_Set_Input = {
  bucketId?: InputMaybe<Scalars["String"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  etag?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  isUploaded?: InputMaybe<Scalars["Boolean"]["input"]>;
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  mimeType?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  size?: InputMaybe<Scalars["Int"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  uploadedByUserId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Files_Stddev_Fields = {
  __typename?: "files_stddev_fields";
  size?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "storage.files" */
export type Files_Stddev_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Files_Stddev_Pop_Fields = {
  __typename?: "files_stddev_pop_fields";
  size?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "storage.files" */
export type Files_Stddev_Pop_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Files_Stddev_Samp_Fields = {
  __typename?: "files_stddev_samp_fields";
  size?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "storage.files" */
export type Files_Stddev_Samp_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "files" */
export type Files_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Files_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Files_Stream_Cursor_Value_Input = {
  bucketId?: InputMaybe<Scalars["String"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  etag?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  isUploaded?: InputMaybe<Scalars["Boolean"]["input"]>;
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  mimeType?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  size?: InputMaybe<Scalars["Int"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  uploadedByUserId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Files_Sum_Fields = {
  __typename?: "files_sum_fields";
  size?: Maybe<Scalars["Int"]["output"]>;
};

/** order by sum() on columns of table "storage.files" */
export type Files_Sum_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** update columns of table "storage.files" */
export enum Files_Update_Column {
  /** column name */
  BucketId = "bucketId",
  /** column name */
  CreatedAt = "createdAt",
  /** column name */
  Etag = "etag",
  /** column name */
  Id = "id",
  /** column name */
  IsUploaded = "isUploaded",
  /** column name */
  Metadata = "metadata",
  /** column name */
  MimeType = "mimeType",
  /** column name */
  Name = "name",
  /** column name */
  Size = "size",
  /** column name */
  UpdatedAt = "updatedAt",
  /** column name */
  UploadedByUserId = "uploadedByUserId",
}

export type Files_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Files_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Files_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Files_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Files_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Files_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Files_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Files_Set_Input>;
  /** filter the rows which have to be updated */
  where: Files_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Files_Var_Pop_Fields = {
  __typename?: "files_var_pop_fields";
  size?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "storage.files" */
export type Files_Var_Pop_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Files_Var_Samp_Fields = {
  __typename?: "files_var_samp_fields";
  size?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "storage.files" */
export type Files_Var_Samp_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Files_Variance_Fields = {
  __typename?: "files_variance_fields";
  size?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "storage.files" */
export type Files_Variance_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** columns and relationships of "geo.features" */
export type Geo_Features = {
  __typename?: "geo_features";
  area_m2?: Maybe<Scalars["numeric"]["output"]>;
  bbox?: Maybe<Scalars["geometry"]["output"]>;
  centroid?: Maybe<Scalars["geometry"]["output"]>;
  created_at: Scalars["timestamptz"]["output"];
  geom: Scalars["geometry"]["output"];
  id: Scalars["uuid"]["output"];
  length_m?: Maybe<Scalars["numeric"]["output"]>;
  props: Scalars["jsonb"]["output"];
  type: Scalars["String"]["output"];
  updated_at: Scalars["timestamptz"]["output"];
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "geo.features" */
export type Geo_FeaturesPropsArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "geo.features" */
export type Geo_Features_Aggregate = {
  __typename?: "geo_features_aggregate";
  aggregate?: Maybe<Geo_Features_Aggregate_Fields>;
  nodes: Array<Geo_Features>;
};

/** aggregate fields of "geo.features" */
export type Geo_Features_Aggregate_Fields = {
  __typename?: "geo_features_aggregate_fields";
  avg?: Maybe<Geo_Features_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Geo_Features_Max_Fields>;
  min?: Maybe<Geo_Features_Min_Fields>;
  stddev?: Maybe<Geo_Features_Stddev_Fields>;
  stddev_pop?: Maybe<Geo_Features_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Geo_Features_Stddev_Samp_Fields>;
  sum?: Maybe<Geo_Features_Sum_Fields>;
  var_pop?: Maybe<Geo_Features_Var_Pop_Fields>;
  var_samp?: Maybe<Geo_Features_Var_Samp_Fields>;
  variance?: Maybe<Geo_Features_Variance_Fields>;
};

/** aggregate fields of "geo.features" */
export type Geo_Features_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Geo_Features_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Geo_Features_Append_Input = {
  props?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate avg on columns */
export type Geo_Features_Avg_Fields = {
  __typename?: "geo_features_avg_fields";
  area_m2?: Maybe<Scalars["Float"]["output"]>;
  length_m?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "geo.features". All fields are combined with a logical 'AND'. */
export type Geo_Features_Bool_Exp = {
  _and?: InputMaybe<Array<Geo_Features_Bool_Exp>>;
  _not?: InputMaybe<Geo_Features_Bool_Exp>;
  _or?: InputMaybe<Array<Geo_Features_Bool_Exp>>;
  area_m2?: InputMaybe<Numeric_Comparison_Exp>;
  bbox?: InputMaybe<Geometry_Comparison_Exp>;
  centroid?: InputMaybe<Geometry_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  geom?: InputMaybe<Geometry_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  length_m?: InputMaybe<Numeric_Comparison_Exp>;
  props?: InputMaybe<Jsonb_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "geo.features" */
export enum Geo_Features_Constraint {
  /** unique or primary key constraint on columns "id" */
  FeaturesPkey = "features_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Geo_Features_Delete_At_Path_Input = {
  props?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Geo_Features_Delete_Elem_Input = {
  props?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Geo_Features_Delete_Key_Input = {
  props?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "geo.features" */
export type Geo_Features_Inc_Input = {
  area_m2?: InputMaybe<Scalars["numeric"]["input"]>;
  length_m?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** input type for inserting data into table "geo.features" */
export type Geo_Features_Insert_Input = {
  area_m2?: InputMaybe<Scalars["numeric"]["input"]>;
  bbox?: InputMaybe<Scalars["geometry"]["input"]>;
  centroid?: InputMaybe<Scalars["geometry"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  geom?: InputMaybe<Scalars["geometry"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  length_m?: InputMaybe<Scalars["numeric"]["input"]>;
  props?: InputMaybe<Scalars["jsonb"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Geo_Features_Max_Fields = {
  __typename?: "geo_features_max_fields";
  area_m2?: Maybe<Scalars["numeric"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  length_m?: Maybe<Scalars["numeric"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type Geo_Features_Min_Fields = {
  __typename?: "geo_features_min_fields";
  area_m2?: Maybe<Scalars["numeric"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  length_m?: Maybe<Scalars["numeric"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "geo.features" */
export type Geo_Features_Mutation_Response = {
  __typename?: "geo_features_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Geo_Features>;
};

/** on_conflict condition type for table "geo.features" */
export type Geo_Features_On_Conflict = {
  constraint: Geo_Features_Constraint;
  update_columns?: Array<Geo_Features_Update_Column>;
  where?: InputMaybe<Geo_Features_Bool_Exp>;
};

/** Ordering options when selecting data from "geo.features". */
export type Geo_Features_Order_By = {
  area_m2?: InputMaybe<Order_By>;
  bbox?: InputMaybe<Order_By>;
  centroid?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  geom?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  length_m?: InputMaybe<Order_By>;
  props?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: geo.features */
export type Geo_Features_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Geo_Features_Prepend_Input = {
  props?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "geo.features" */
export enum Geo_Features_Select_Column {
  /** column name */
  AreaM2 = "area_m2",
  /** column name */
  Bbox = "bbox",
  /** column name */
  Centroid = "centroid",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Geom = "geom",
  /** column name */
  Id = "id",
  /** column name */
  LengthM = "length_m",
  /** column name */
  Props = "props",
  /** column name */
  Type = "type",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "geo.features" */
export type Geo_Features_Set_Input = {
  area_m2?: InputMaybe<Scalars["numeric"]["input"]>;
  bbox?: InputMaybe<Scalars["geometry"]["input"]>;
  centroid?: InputMaybe<Scalars["geometry"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  geom?: InputMaybe<Scalars["geometry"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  length_m?: InputMaybe<Scalars["numeric"]["input"]>;
  props?: InputMaybe<Scalars["jsonb"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Geo_Features_Stddev_Fields = {
  __typename?: "geo_features_stddev_fields";
  area_m2?: Maybe<Scalars["Float"]["output"]>;
  length_m?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Geo_Features_Stddev_Pop_Fields = {
  __typename?: "geo_features_stddev_pop_fields";
  area_m2?: Maybe<Scalars["Float"]["output"]>;
  length_m?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Geo_Features_Stddev_Samp_Fields = {
  __typename?: "geo_features_stddev_samp_fields";
  area_m2?: Maybe<Scalars["Float"]["output"]>;
  length_m?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "geo_features" */
export type Geo_Features_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Geo_Features_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Geo_Features_Stream_Cursor_Value_Input = {
  area_m2?: InputMaybe<Scalars["numeric"]["input"]>;
  bbox?: InputMaybe<Scalars["geometry"]["input"]>;
  centroid?: InputMaybe<Scalars["geometry"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  geom?: InputMaybe<Scalars["geometry"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  length_m?: InputMaybe<Scalars["numeric"]["input"]>;
  props?: InputMaybe<Scalars["jsonb"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Geo_Features_Sum_Fields = {
  __typename?: "geo_features_sum_fields";
  area_m2?: Maybe<Scalars["numeric"]["output"]>;
  length_m?: Maybe<Scalars["numeric"]["output"]>;
};

/** update columns of table "geo.features" */
export enum Geo_Features_Update_Column {
  /** column name */
  AreaM2 = "area_m2",
  /** column name */
  Bbox = "bbox",
  /** column name */
  Centroid = "centroid",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Geom = "geom",
  /** column name */
  Id = "id",
  /** column name */
  LengthM = "length_m",
  /** column name */
  Props = "props",
  /** column name */
  Type = "type",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Geo_Features_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Geo_Features_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Geo_Features_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Geo_Features_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Geo_Features_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Geo_Features_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Geo_Features_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Geo_Features_Set_Input>;
  /** filter the rows which have to be updated */
  where: Geo_Features_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Geo_Features_Var_Pop_Fields = {
  __typename?: "geo_features_var_pop_fields";
  area_m2?: Maybe<Scalars["Float"]["output"]>;
  length_m?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Geo_Features_Var_Samp_Fields = {
  __typename?: "geo_features_var_samp_fields";
  area_m2?: Maybe<Scalars["Float"]["output"]>;
  length_m?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Geo_Features_Variance_Fields = {
  __typename?: "geo_features_variance_fields";
  area_m2?: Maybe<Scalars["Float"]["output"]>;
  length_m?: Maybe<Scalars["Float"]["output"]>;
};

export type Geography_Cast_Exp = {
  geometry?: InputMaybe<Geometry_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "geography". All fields are combined with logical 'AND'. */
export type Geography_Comparison_Exp = {
  _cast?: InputMaybe<Geography_Cast_Exp>;
  _eq?: InputMaybe<Scalars["geography"]["input"]>;
  _gt?: InputMaybe<Scalars["geography"]["input"]>;
  _gte?: InputMaybe<Scalars["geography"]["input"]>;
  _in?: InputMaybe<Array<Scalars["geography"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["geography"]["input"]>;
  _lte?: InputMaybe<Scalars["geography"]["input"]>;
  _neq?: InputMaybe<Scalars["geography"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["geography"]["input"]>>;
  /** is the column within a given distance from the given geography value */
  _st_d_within?: InputMaybe<St_D_Within_Geography_Input>;
  /** does the column spatially intersect the given geography value */
  _st_intersects?: InputMaybe<Scalars["geography"]["input"]>;
};

export type Geometry_Cast_Exp = {
  geography?: InputMaybe<Geography_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "geometry". All fields are combined with logical 'AND'. */
export type Geometry_Comparison_Exp = {
  _cast?: InputMaybe<Geometry_Cast_Exp>;
  _eq?: InputMaybe<Scalars["geometry"]["input"]>;
  _gt?: InputMaybe<Scalars["geometry"]["input"]>;
  _gte?: InputMaybe<Scalars["geometry"]["input"]>;
  _in?: InputMaybe<Array<Scalars["geometry"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["geometry"]["input"]>;
  _lte?: InputMaybe<Scalars["geometry"]["input"]>;
  _neq?: InputMaybe<Scalars["geometry"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["geometry"]["input"]>>;
  /** is the column within a given 3D distance from the given geometry value */
  _st_3d_d_within?: InputMaybe<St_D_Within_Input>;
  /** does the column spatially intersect the given geometry value in 3D */
  _st_3d_intersects?: InputMaybe<Scalars["geometry"]["input"]>;
  /** does the column contain the given geometry value */
  _st_contains?: InputMaybe<Scalars["geometry"]["input"]>;
  /** does the column cross the given geometry value */
  _st_crosses?: InputMaybe<Scalars["geometry"]["input"]>;
  /** is the column within a given distance from the given geometry value */
  _st_d_within?: InputMaybe<St_D_Within_Input>;
  /** is the column equal to given geometry value (directionality is ignored) */
  _st_equals?: InputMaybe<Scalars["geometry"]["input"]>;
  /** does the column spatially intersect the given geometry value */
  _st_intersects?: InputMaybe<Scalars["geometry"]["input"]>;
  /** does the column 'spatially overlap' (intersect but not completely contain) the given geometry value */
  _st_overlaps?: InputMaybe<Scalars["geometry"]["input"]>;
  /** does the column have atleast one point in common with the given geometry value */
  _st_touches?: InputMaybe<Scalars["geometry"]["input"]>;
  /** is the column contained in the given geometry value */
  _st_within?: InputMaybe<Scalars["geometry"]["input"]>;
};

/** columns and relationships of "github_issues" */
export type Github_Issues = {
  __typename?: "github_issues";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** User ID who created/modified the issue (set by trigger) */
  _user_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Reason for locking the issue */
  active_lock_reason?: Maybe<Scalars["String"]["output"]>;
  /** GitHub user assigned to the issue */
  assignee_data?: Maybe<Scalars["jsonb"]["output"]>;
  /** Array of GitHub users assigned to the issue */
  assignees_data?: Maybe<Scalars["jsonb"]["output"]>;
  /** Author association with repository */
  author_association?: Maybe<Scalars["String"]["output"]>;
  /** Issue body/description */
  body?: Maybe<Scalars["String"]["output"]>;
  /** When the issue was closed (unix timestamp) */
  closed_at?: Maybe<Scalars["bigint"]["output"]>;
  /** GitHub user who closed the issue */
  closed_by_data?: Maybe<Scalars["jsonb"]["output"]>;
  /** Number of comments on the issue */
  comments_count: Scalars["Int"]["output"];
  created_at: Scalars["bigint"]["output"];
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: Maybe<Scalars["bigint"]["output"]>;
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  /** GitHub web URL for the issue */
  html_url: Scalars["String"]["output"];
  id: Scalars["uuid"]["output"];
  /** Array of labels attached to the issue */
  labels_data?: Maybe<Scalars["jsonb"]["output"]>;
  /** Whether issue is locked */
  locked: Scalars["Boolean"]["output"];
  /** Milestone data if assigned */
  milestone_data?: Maybe<Scalars["jsonb"]["output"]>;
  /** GitHub GraphQL node ID */
  node_id: Scalars["String"]["output"];
  /** Issue number in repository (nullable for user-created issues) */
  number?: Maybe<Scalars["Int"]["output"]>;
  /** Pull request data if issue is a PR */
  pull_request_data?: Maybe<Scalars["jsonb"]["output"]>;
  /** Repository name */
  repository_name: Scalars["String"]["output"];
  /** Repository owner name */
  repository_owner: Scalars["String"]["output"];
  /** Issue state: open, closed */
  state: Scalars["String"]["output"];
  /** Reason for state change */
  state_reason?: Maybe<Scalars["String"]["output"]>;
  /** Issue title */
  title: Scalars["String"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** GitHub API URL for the issue */
  url: Scalars["String"]["output"];
  /** GitHub user who created the issue */
  user_data?: Maybe<Scalars["jsonb"]["output"]>;
};

/** columns and relationships of "github_issues" */
export type Github_IssuesAssignee_DataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "github_issues" */
export type Github_IssuesAssignees_DataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "github_issues" */
export type Github_IssuesClosed_By_DataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "github_issues" */
export type Github_IssuesLabels_DataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "github_issues" */
export type Github_IssuesMilestone_DataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "github_issues" */
export type Github_IssuesPull_Request_DataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "github_issues" */
export type Github_IssuesUser_DataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "github_issues" */
export type Github_Issues_Aggregate = {
  __typename?: "github_issues_aggregate";
  aggregate?: Maybe<Github_Issues_Aggregate_Fields>;
  nodes: Array<Github_Issues>;
};

/** aggregate fields of "github_issues" */
export type Github_Issues_Aggregate_Fields = {
  __typename?: "github_issues_aggregate_fields";
  avg?: Maybe<Github_Issues_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Github_Issues_Max_Fields>;
  min?: Maybe<Github_Issues_Min_Fields>;
  stddev?: Maybe<Github_Issues_Stddev_Fields>;
  stddev_pop?: Maybe<Github_Issues_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Github_Issues_Stddev_Samp_Fields>;
  sum?: Maybe<Github_Issues_Sum_Fields>;
  var_pop?: Maybe<Github_Issues_Var_Pop_Fields>;
  var_samp?: Maybe<Github_Issues_Var_Samp_Fields>;
  variance?: Maybe<Github_Issues_Variance_Fields>;
};

/** aggregate fields of "github_issues" */
export type Github_Issues_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Github_Issues_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Github_Issues_Append_Input = {
  /** GitHub user assigned to the issue */
  assignee_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Array of GitHub users assigned to the issue */
  assignees_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** GitHub user who closed the issue */
  closed_by_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Array of labels attached to the issue */
  labels_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Milestone data if assigned */
  milestone_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Pull request data if issue is a PR */
  pull_request_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** GitHub user who created the issue */
  user_data?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate avg on columns */
export type Github_Issues_Avg_Fields = {
  __typename?: "github_issues_avg_fields";
  /** When the issue was closed (unix timestamp) */
  closed_at?: Maybe<Scalars["Float"]["output"]>;
  /** Number of comments on the issue */
  comments_count?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: Maybe<Scalars["Float"]["output"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "github_issues". All fields are combined with a logical 'AND'. */
export type Github_Issues_Bool_Exp = {
  _and?: InputMaybe<Array<Github_Issues_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Github_Issues_Bool_Exp>;
  _or?: InputMaybe<Array<Github_Issues_Bool_Exp>>;
  _user_id?: InputMaybe<Uuid_Comparison_Exp>;
  active_lock_reason?: InputMaybe<String_Comparison_Exp>;
  assignee_data?: InputMaybe<Jsonb_Comparison_Exp>;
  assignees_data?: InputMaybe<Jsonb_Comparison_Exp>;
  author_association?: InputMaybe<String_Comparison_Exp>;
  body?: InputMaybe<String_Comparison_Exp>;
  closed_at?: InputMaybe<Bigint_Comparison_Exp>;
  closed_by_data?: InputMaybe<Jsonb_Comparison_Exp>;
  comments_count?: InputMaybe<Int_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  github_id?: InputMaybe<Bigint_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  html_url?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  labels_data?: InputMaybe<Jsonb_Comparison_Exp>;
  locked?: InputMaybe<Boolean_Comparison_Exp>;
  milestone_data?: InputMaybe<Jsonb_Comparison_Exp>;
  node_id?: InputMaybe<String_Comparison_Exp>;
  number?: InputMaybe<Int_Comparison_Exp>;
  pull_request_data?: InputMaybe<Jsonb_Comparison_Exp>;
  repository_name?: InputMaybe<String_Comparison_Exp>;
  repository_owner?: InputMaybe<String_Comparison_Exp>;
  state?: InputMaybe<String_Comparison_Exp>;
  state_reason?: InputMaybe<String_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  url?: InputMaybe<String_Comparison_Exp>;
  user_data?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "github_issues" */
export enum Github_Issues_Constraint {
  /** unique or primary key constraint on columns "github_id" */
  GithubIssuesGithubIdKey = "github_issues_github_id_key",
  /** unique or primary key constraint on columns "id" */
  GithubIssuesPkey = "github_issues_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Github_Issues_Delete_At_Path_Input = {
  /** GitHub user assigned to the issue */
  assignee_data?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Array of GitHub users assigned to the issue */
  assignees_data?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** GitHub user who closed the issue */
  closed_by_data?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Array of labels attached to the issue */
  labels_data?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Milestone data if assigned */
  milestone_data?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Pull request data if issue is a PR */
  pull_request_data?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** GitHub user who created the issue */
  user_data?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Github_Issues_Delete_Elem_Input = {
  /** GitHub user assigned to the issue */
  assignee_data?: InputMaybe<Scalars["Int"]["input"]>;
  /** Array of GitHub users assigned to the issue */
  assignees_data?: InputMaybe<Scalars["Int"]["input"]>;
  /** GitHub user who closed the issue */
  closed_by_data?: InputMaybe<Scalars["Int"]["input"]>;
  /** Array of labels attached to the issue */
  labels_data?: InputMaybe<Scalars["Int"]["input"]>;
  /** Milestone data if assigned */
  milestone_data?: InputMaybe<Scalars["Int"]["input"]>;
  /** Pull request data if issue is a PR */
  pull_request_data?: InputMaybe<Scalars["Int"]["input"]>;
  /** GitHub user who created the issue */
  user_data?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Github_Issues_Delete_Key_Input = {
  /** GitHub user assigned to the issue */
  assignee_data?: InputMaybe<Scalars["String"]["input"]>;
  /** Array of GitHub users assigned to the issue */
  assignees_data?: InputMaybe<Scalars["String"]["input"]>;
  /** GitHub user who closed the issue */
  closed_by_data?: InputMaybe<Scalars["String"]["input"]>;
  /** Array of labels attached to the issue */
  labels_data?: InputMaybe<Scalars["String"]["input"]>;
  /** Milestone data if assigned */
  milestone_data?: InputMaybe<Scalars["String"]["input"]>;
  /** Pull request data if issue is a PR */
  pull_request_data?: InputMaybe<Scalars["String"]["input"]>;
  /** GitHub user who created the issue */
  user_data?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "github_issues" */
export type Github_Issues_Inc_Input = {
  /** When the issue was closed (unix timestamp) */
  closed_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Number of comments on the issue */
  comments_count?: InputMaybe<Scalars["Int"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: InputMaybe<Scalars["Int"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "github_issues" */
export type Github_Issues_Insert_Input = {
  /** User ID who created/modified the issue (set by trigger) */
  _user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reason for locking the issue */
  active_lock_reason?: InputMaybe<Scalars["String"]["input"]>;
  /** GitHub user assigned to the issue */
  assignee_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Array of GitHub users assigned to the issue */
  assignees_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Author association with repository */
  author_association?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue body/description */
  body?: InputMaybe<Scalars["String"]["input"]>;
  /** When the issue was closed (unix timestamp) */
  closed_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub user who closed the issue */
  closed_by_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Number of comments on the issue */
  comments_count?: InputMaybe<Scalars["Int"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: InputMaybe<Scalars["bigint"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  /** GitHub web URL for the issue */
  html_url?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Array of labels attached to the issue */
  labels_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Whether issue is locked */
  locked?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Milestone data if assigned */
  milestone_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** GitHub GraphQL node ID */
  node_id?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: InputMaybe<Scalars["Int"]["input"]>;
  /** Pull request data if issue is a PR */
  pull_request_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Repository name */
  repository_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Repository owner name */
  repository_owner?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue state: open, closed */
  state?: InputMaybe<Scalars["String"]["input"]>;
  /** Reason for state change */
  state_reason?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue title */
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub API URL for the issue */
  url?: InputMaybe<Scalars["String"]["input"]>;
  /** GitHub user who created the issue */
  user_data?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate max on columns */
export type Github_Issues_Max_Fields = {
  __typename?: "github_issues_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** User ID who created/modified the issue (set by trigger) */
  _user_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Reason for locking the issue */
  active_lock_reason?: Maybe<Scalars["String"]["output"]>;
  /** Author association with repository */
  author_association?: Maybe<Scalars["String"]["output"]>;
  /** Issue body/description */
  body?: Maybe<Scalars["String"]["output"]>;
  /** When the issue was closed (unix timestamp) */
  closed_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Number of comments on the issue */
  comments_count?: Maybe<Scalars["Int"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: Maybe<Scalars["bigint"]["output"]>;
  /** GitHub web URL for the issue */
  html_url?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** GitHub GraphQL node ID */
  node_id?: Maybe<Scalars["String"]["output"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: Maybe<Scalars["Int"]["output"]>;
  /** Repository name */
  repository_name?: Maybe<Scalars["String"]["output"]>;
  /** Repository owner name */
  repository_owner?: Maybe<Scalars["String"]["output"]>;
  /** Issue state: open, closed */
  state?: Maybe<Scalars["String"]["output"]>;
  /** Reason for state change */
  state_reason?: Maybe<Scalars["String"]["output"]>;
  /** Issue title */
  title?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** GitHub API URL for the issue */
  url?: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type Github_Issues_Min_Fields = {
  __typename?: "github_issues_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** User ID who created/modified the issue (set by trigger) */
  _user_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Reason for locking the issue */
  active_lock_reason?: Maybe<Scalars["String"]["output"]>;
  /** Author association with repository */
  author_association?: Maybe<Scalars["String"]["output"]>;
  /** Issue body/description */
  body?: Maybe<Scalars["String"]["output"]>;
  /** When the issue was closed (unix timestamp) */
  closed_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Number of comments on the issue */
  comments_count?: Maybe<Scalars["Int"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: Maybe<Scalars["bigint"]["output"]>;
  /** GitHub web URL for the issue */
  html_url?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** GitHub GraphQL node ID */
  node_id?: Maybe<Scalars["String"]["output"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: Maybe<Scalars["Int"]["output"]>;
  /** Repository name */
  repository_name?: Maybe<Scalars["String"]["output"]>;
  /** Repository owner name */
  repository_owner?: Maybe<Scalars["String"]["output"]>;
  /** Issue state: open, closed */
  state?: Maybe<Scalars["String"]["output"]>;
  /** Reason for state change */
  state_reason?: Maybe<Scalars["String"]["output"]>;
  /** Issue title */
  title?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** GitHub API URL for the issue */
  url?: Maybe<Scalars["String"]["output"]>;
};

/** response of any mutation on the table "github_issues" */
export type Github_Issues_Mutation_Response = {
  __typename?: "github_issues_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Github_Issues>;
};

/** input type for inserting object relation for remote table "github_issues" */
export type Github_Issues_Obj_Rel_Insert_Input = {
  data: Github_Issues_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Github_Issues_On_Conflict>;
};

/** on_conflict condition type for table "github_issues" */
export type Github_Issues_On_Conflict = {
  constraint: Github_Issues_Constraint;
  update_columns?: Array<Github_Issues_Update_Column>;
  where?: InputMaybe<Github_Issues_Bool_Exp>;
};

/** Ordering options when selecting data from "github_issues". */
export type Github_Issues_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  _user_id?: InputMaybe<Order_By>;
  active_lock_reason?: InputMaybe<Order_By>;
  assignee_data?: InputMaybe<Order_By>;
  assignees_data?: InputMaybe<Order_By>;
  author_association?: InputMaybe<Order_By>;
  body?: InputMaybe<Order_By>;
  closed_at?: InputMaybe<Order_By>;
  closed_by_data?: InputMaybe<Order_By>;
  comments_count?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  github_id?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  html_url?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  labels_data?: InputMaybe<Order_By>;
  locked?: InputMaybe<Order_By>;
  milestone_data?: InputMaybe<Order_By>;
  node_id?: InputMaybe<Order_By>;
  number?: InputMaybe<Order_By>;
  pull_request_data?: InputMaybe<Order_By>;
  repository_name?: InputMaybe<Order_By>;
  repository_owner?: InputMaybe<Order_By>;
  state?: InputMaybe<Order_By>;
  state_reason?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
  user_data?: InputMaybe<Order_By>;
};

/** primary key columns input for table: github_issues */
export type Github_Issues_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Github_Issues_Prepend_Input = {
  /** GitHub user assigned to the issue */
  assignee_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Array of GitHub users assigned to the issue */
  assignees_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** GitHub user who closed the issue */
  closed_by_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Array of labels attached to the issue */
  labels_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Milestone data if assigned */
  milestone_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Pull request data if issue is a PR */
  pull_request_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** GitHub user who created the issue */
  user_data?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "github_issues" */
export enum Github_Issues_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  UserId = "_user_id",
  /** column name */
  ActiveLockReason = "active_lock_reason",
  /** column name */
  AssigneeData = "assignee_data",
  /** column name */
  AssigneesData = "assignees_data",
  /** column name */
  AuthorAssociation = "author_association",
  /** column name */
  Body = "body",
  /** column name */
  ClosedAt = "closed_at",
  /** column name */
  ClosedByData = "closed_by_data",
  /** column name */
  CommentsCount = "comments_count",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  GithubId = "github_id",
  /** column name */
  HtmlUrl = "html_url",
  /** column name */
  Id = "id",
  /** column name */
  LabelsData = "labels_data",
  /** column name */
  Locked = "locked",
  /** column name */
  MilestoneData = "milestone_data",
  /** column name */
  NodeId = "node_id",
  /** column name */
  Number = "number",
  /** column name */
  PullRequestData = "pull_request_data",
  /** column name */
  RepositoryName = "repository_name",
  /** column name */
  RepositoryOwner = "repository_owner",
  /** column name */
  State = "state",
  /** column name */
  StateReason = "state_reason",
  /** column name */
  Title = "title",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  Url = "url",
  /** column name */
  UserData = "user_data",
}

/** input type for updating data in table "github_issues" */
export type Github_Issues_Set_Input = {
  /** User ID who created/modified the issue (set by trigger) */
  _user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reason for locking the issue */
  active_lock_reason?: InputMaybe<Scalars["String"]["input"]>;
  /** GitHub user assigned to the issue */
  assignee_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Array of GitHub users assigned to the issue */
  assignees_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Author association with repository */
  author_association?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue body/description */
  body?: InputMaybe<Scalars["String"]["input"]>;
  /** When the issue was closed (unix timestamp) */
  closed_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub user who closed the issue */
  closed_by_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Number of comments on the issue */
  comments_count?: InputMaybe<Scalars["Int"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub web URL for the issue */
  html_url?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Array of labels attached to the issue */
  labels_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Whether issue is locked */
  locked?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Milestone data if assigned */
  milestone_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** GitHub GraphQL node ID */
  node_id?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: InputMaybe<Scalars["Int"]["input"]>;
  /** Pull request data if issue is a PR */
  pull_request_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Repository name */
  repository_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Repository owner name */
  repository_owner?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue state: open, closed */
  state?: InputMaybe<Scalars["String"]["input"]>;
  /** Reason for state change */
  state_reason?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue title */
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub API URL for the issue */
  url?: InputMaybe<Scalars["String"]["input"]>;
  /** GitHub user who created the issue */
  user_data?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate stddev on columns */
export type Github_Issues_Stddev_Fields = {
  __typename?: "github_issues_stddev_fields";
  /** When the issue was closed (unix timestamp) */
  closed_at?: Maybe<Scalars["Float"]["output"]>;
  /** Number of comments on the issue */
  comments_count?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: Maybe<Scalars["Float"]["output"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Github_Issues_Stddev_Pop_Fields = {
  __typename?: "github_issues_stddev_pop_fields";
  /** When the issue was closed (unix timestamp) */
  closed_at?: Maybe<Scalars["Float"]["output"]>;
  /** Number of comments on the issue */
  comments_count?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: Maybe<Scalars["Float"]["output"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Github_Issues_Stddev_Samp_Fields = {
  __typename?: "github_issues_stddev_samp_fields";
  /** When the issue was closed (unix timestamp) */
  closed_at?: Maybe<Scalars["Float"]["output"]>;
  /** Number of comments on the issue */
  comments_count?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: Maybe<Scalars["Float"]["output"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "github_issues" */
export type Github_Issues_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Github_Issues_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Github_Issues_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  /** User ID who created/modified the issue (set by trigger) */
  _user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reason for locking the issue */
  active_lock_reason?: InputMaybe<Scalars["String"]["input"]>;
  /** GitHub user assigned to the issue */
  assignee_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Array of GitHub users assigned to the issue */
  assignees_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Author association with repository */
  author_association?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue body/description */
  body?: InputMaybe<Scalars["String"]["input"]>;
  /** When the issue was closed (unix timestamp) */
  closed_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub user who closed the issue */
  closed_by_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Number of comments on the issue */
  comments_count?: InputMaybe<Scalars["Int"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub web URL for the issue */
  html_url?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Array of labels attached to the issue */
  labels_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Whether issue is locked */
  locked?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Milestone data if assigned */
  milestone_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** GitHub GraphQL node ID */
  node_id?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: InputMaybe<Scalars["Int"]["input"]>;
  /** Pull request data if issue is a PR */
  pull_request_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Repository name */
  repository_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Repository owner name */
  repository_owner?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue state: open, closed */
  state?: InputMaybe<Scalars["String"]["input"]>;
  /** Reason for state change */
  state_reason?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue title */
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub API URL for the issue */
  url?: InputMaybe<Scalars["String"]["input"]>;
  /** GitHub user who created the issue */
  user_data?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate sum on columns */
export type Github_Issues_Sum_Fields = {
  __typename?: "github_issues_sum_fields";
  /** When the issue was closed (unix timestamp) */
  closed_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Number of comments on the issue */
  comments_count?: Maybe<Scalars["Int"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: Maybe<Scalars["bigint"]["output"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: Maybe<Scalars["Int"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "github_issues" */
export enum Github_Issues_Update_Column {
  /** column name */
  UserId = "_user_id",
  /** column name */
  ActiveLockReason = "active_lock_reason",
  /** column name */
  AssigneeData = "assignee_data",
  /** column name */
  AssigneesData = "assignees_data",
  /** column name */
  AuthorAssociation = "author_association",
  /** column name */
  Body = "body",
  /** column name */
  ClosedAt = "closed_at",
  /** column name */
  ClosedByData = "closed_by_data",
  /** column name */
  CommentsCount = "comments_count",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  GithubId = "github_id",
  /** column name */
  HtmlUrl = "html_url",
  /** column name */
  Id = "id",
  /** column name */
  LabelsData = "labels_data",
  /** column name */
  Locked = "locked",
  /** column name */
  MilestoneData = "milestone_data",
  /** column name */
  NodeId = "node_id",
  /** column name */
  Number = "number",
  /** column name */
  PullRequestData = "pull_request_data",
  /** column name */
  RepositoryName = "repository_name",
  /** column name */
  RepositoryOwner = "repository_owner",
  /** column name */
  State = "state",
  /** column name */
  StateReason = "state_reason",
  /** column name */
  Title = "title",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  Url = "url",
  /** column name */
  UserData = "user_data",
}

export type Github_Issues_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Github_Issues_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Github_Issues_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Github_Issues_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Github_Issues_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Github_Issues_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Github_Issues_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Github_Issues_Set_Input>;
  /** filter the rows which have to be updated */
  where: Github_Issues_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Github_Issues_Var_Pop_Fields = {
  __typename?: "github_issues_var_pop_fields";
  /** When the issue was closed (unix timestamp) */
  closed_at?: Maybe<Scalars["Float"]["output"]>;
  /** Number of comments on the issue */
  comments_count?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: Maybe<Scalars["Float"]["output"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Github_Issues_Var_Samp_Fields = {
  __typename?: "github_issues_var_samp_fields";
  /** When the issue was closed (unix timestamp) */
  closed_at?: Maybe<Scalars["Float"]["output"]>;
  /** Number of comments on the issue */
  comments_count?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: Maybe<Scalars["Float"]["output"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Github_Issues_Variance_Fields = {
  __typename?: "github_issues_variance_fields";
  /** When the issue was closed (unix timestamp) */
  closed_at?: Maybe<Scalars["Float"]["output"]>;
  /** Number of comments on the issue */
  comments_count?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: Maybe<Scalars["Float"]["output"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "groups" */
export type Groups = {
  __typename?: "groups";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Who can delete group */
  allow_delete_group_users: Scalars["jsonb"]["output"];
  /** Who can send invites */
  allow_invite_users: Scalars["jsonb"]["output"];
  /** Who joins immediately on open policy */
  allow_join_users: Scalars["jsonb"]["output"];
  /** Who can manage members */
  allow_manage_members_users: Scalars["jsonb"]["output"];
  /** Who may request to join */
  allow_request_users: Scalars["jsonb"]["output"];
  /** Who can update group */
  allow_update_group_users: Scalars["jsonb"]["output"];
  /** Visibility allow-list */
  allow_view_users: Scalars["jsonb"]["output"];
  /** Extensible attributes */
  attributes: Scalars["jsonb"]["output"];
  /** Optional avatar file id */
  avatar_file_id?: Maybe<Scalars["uuid"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** Creator user id */
  created_by_id: Scalars["uuid"]["output"];
  /** Description */
  description?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** An array relationship */
  invitations: Array<Invitations>;
  /** An aggregate relationship */
  invitations_aggregate: Invitations_Aggregate;
  /** Join policy */
  join_policy: Scalars["String"]["output"];
  /** Semantic kind: group/team/class/etc */
  kind: Scalars["String"]["output"];
  /** An array relationship */
  memberships: Array<Memberships>;
  /** An aggregate relationship */
  memberships_aggregate: Memberships_Aggregate;
  /** Optional namespace/tenant id */
  namespace?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  owner?: Maybe<Users>;
  /** Current group owner (nullable) */
  owner_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Unique slug */
  slug?: Maybe<Scalars["String"]["output"]>;
  /** Tags as jsonb array of strings */
  tags: Scalars["jsonb"]["output"];
  /** Group title */
  title: Scalars["String"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** Visibility policy */
  visibility: Scalars["String"]["output"];
};

/** columns and relationships of "groups" */
export type GroupsAllow_Delete_Group_UsersArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "groups" */
export type GroupsAllow_Invite_UsersArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "groups" */
export type GroupsAllow_Join_UsersArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "groups" */
export type GroupsAllow_Manage_Members_UsersArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "groups" */
export type GroupsAllow_Request_UsersArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "groups" */
export type GroupsAllow_Update_Group_UsersArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "groups" */
export type GroupsAllow_View_UsersArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "groups" */
export type GroupsAttributesArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "groups" */
export type GroupsInvitationsArgs = {
  distinct_on?: InputMaybe<Array<Invitations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Invitations_Order_By>>;
  where?: InputMaybe<Invitations_Bool_Exp>;
};

/** columns and relationships of "groups" */
export type GroupsInvitations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invitations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Invitations_Order_By>>;
  where?: InputMaybe<Invitations_Bool_Exp>;
};

/** columns and relationships of "groups" */
export type GroupsMembershipsArgs = {
  distinct_on?: InputMaybe<Array<Memberships_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Memberships_Order_By>>;
  where?: InputMaybe<Memberships_Bool_Exp>;
};

/** columns and relationships of "groups" */
export type GroupsMemberships_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Memberships_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Memberships_Order_By>>;
  where?: InputMaybe<Memberships_Bool_Exp>;
};

/** columns and relationships of "groups" */
export type GroupsTagsArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "groups" */
export type Groups_Aggregate = {
  __typename?: "groups_aggregate";
  aggregate?: Maybe<Groups_Aggregate_Fields>;
  nodes: Array<Groups>;
};

/** aggregate fields of "groups" */
export type Groups_Aggregate_Fields = {
  __typename?: "groups_aggregate_fields";
  avg?: Maybe<Groups_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Groups_Max_Fields>;
  min?: Maybe<Groups_Min_Fields>;
  stddev?: Maybe<Groups_Stddev_Fields>;
  stddev_pop?: Maybe<Groups_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Groups_Stddev_Samp_Fields>;
  sum?: Maybe<Groups_Sum_Fields>;
  var_pop?: Maybe<Groups_Var_Pop_Fields>;
  var_samp?: Maybe<Groups_Var_Samp_Fields>;
  variance?: Maybe<Groups_Variance_Fields>;
};

/** aggregate fields of "groups" */
export type Groups_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Groups_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Groups_Append_Input = {
  /** Who can delete group */
  allow_delete_group_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who can send invites */
  allow_invite_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who joins immediately on open policy */
  allow_join_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who can manage members */
  allow_manage_members_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who may request to join */
  allow_request_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who can update group */
  allow_update_group_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Visibility allow-list */
  allow_view_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Extensible attributes */
  attributes?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Tags as jsonb array of strings */
  tags?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate avg on columns */
export type Groups_Avg_Fields = {
  __typename?: "groups_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "groups". All fields are combined with a logical 'AND'. */
export type Groups_Bool_Exp = {
  _and?: InputMaybe<Array<Groups_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Groups_Bool_Exp>;
  _or?: InputMaybe<Array<Groups_Bool_Exp>>;
  allow_delete_group_users?: InputMaybe<Jsonb_Comparison_Exp>;
  allow_invite_users?: InputMaybe<Jsonb_Comparison_Exp>;
  allow_join_users?: InputMaybe<Jsonb_Comparison_Exp>;
  allow_manage_members_users?: InputMaybe<Jsonb_Comparison_Exp>;
  allow_request_users?: InputMaybe<Jsonb_Comparison_Exp>;
  allow_update_group_users?: InputMaybe<Jsonb_Comparison_Exp>;
  allow_view_users?: InputMaybe<Jsonb_Comparison_Exp>;
  attributes?: InputMaybe<Jsonb_Comparison_Exp>;
  avatar_file_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  created_by_id?: InputMaybe<Uuid_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  invitations?: InputMaybe<Invitations_Bool_Exp>;
  invitations_aggregate?: InputMaybe<Invitations_Aggregate_Bool_Exp>;
  join_policy?: InputMaybe<String_Comparison_Exp>;
  kind?: InputMaybe<String_Comparison_Exp>;
  memberships?: InputMaybe<Memberships_Bool_Exp>;
  memberships_aggregate?: InputMaybe<Memberships_Aggregate_Bool_Exp>;
  namespace?: InputMaybe<String_Comparison_Exp>;
  owner?: InputMaybe<Users_Bool_Exp>;
  owner_id?: InputMaybe<Uuid_Comparison_Exp>;
  slug?: InputMaybe<String_Comparison_Exp>;
  tags?: InputMaybe<Jsonb_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  visibility?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "groups" */
export enum Groups_Constraint {
  /** unique or primary key constraint on columns "id" */
  GroupsPkey = "groups_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Groups_Delete_At_Path_Input = {
  /** Who can delete group */
  allow_delete_group_users?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Who can send invites */
  allow_invite_users?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Who joins immediately on open policy */
  allow_join_users?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Who can manage members */
  allow_manage_members_users?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Who may request to join */
  allow_request_users?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Who can update group */
  allow_update_group_users?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Visibility allow-list */
  allow_view_users?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Extensible attributes */
  attributes?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Tags as jsonb array of strings */
  tags?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Groups_Delete_Elem_Input = {
  /** Who can delete group */
  allow_delete_group_users?: InputMaybe<Scalars["Int"]["input"]>;
  /** Who can send invites */
  allow_invite_users?: InputMaybe<Scalars["Int"]["input"]>;
  /** Who joins immediately on open policy */
  allow_join_users?: InputMaybe<Scalars["Int"]["input"]>;
  /** Who can manage members */
  allow_manage_members_users?: InputMaybe<Scalars["Int"]["input"]>;
  /** Who may request to join */
  allow_request_users?: InputMaybe<Scalars["Int"]["input"]>;
  /** Who can update group */
  allow_update_group_users?: InputMaybe<Scalars["Int"]["input"]>;
  /** Visibility allow-list */
  allow_view_users?: InputMaybe<Scalars["Int"]["input"]>;
  /** Extensible attributes */
  attributes?: InputMaybe<Scalars["Int"]["input"]>;
  /** Tags as jsonb array of strings */
  tags?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Groups_Delete_Key_Input = {
  /** Who can delete group */
  allow_delete_group_users?: InputMaybe<Scalars["String"]["input"]>;
  /** Who can send invites */
  allow_invite_users?: InputMaybe<Scalars["String"]["input"]>;
  /** Who joins immediately on open policy */
  allow_join_users?: InputMaybe<Scalars["String"]["input"]>;
  /** Who can manage members */
  allow_manage_members_users?: InputMaybe<Scalars["String"]["input"]>;
  /** Who may request to join */
  allow_request_users?: InputMaybe<Scalars["String"]["input"]>;
  /** Who can update group */
  allow_update_group_users?: InputMaybe<Scalars["String"]["input"]>;
  /** Visibility allow-list */
  allow_view_users?: InputMaybe<Scalars["String"]["input"]>;
  /** Extensible attributes */
  attributes?: InputMaybe<Scalars["String"]["input"]>;
  /** Tags as jsonb array of strings */
  tags?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "groups" */
export type Groups_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "groups" */
export type Groups_Insert_Input = {
  /** Who can delete group */
  allow_delete_group_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who can send invites */
  allow_invite_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who joins immediately on open policy */
  allow_join_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who can manage members */
  allow_manage_members_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who may request to join */
  allow_request_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who can update group */
  allow_update_group_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Visibility allow-list */
  allow_view_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Extensible attributes */
  attributes?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Optional avatar file id */
  avatar_file_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Creator user id */
  created_by_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Description */
  description?: InputMaybe<Scalars["String"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invitations?: InputMaybe<Invitations_Arr_Rel_Insert_Input>;
  /** Join policy */
  join_policy?: InputMaybe<Scalars["String"]["input"]>;
  /** Semantic kind: group/team/class/etc */
  kind?: InputMaybe<Scalars["String"]["input"]>;
  memberships?: InputMaybe<Memberships_Arr_Rel_Insert_Input>;
  /** Optional namespace/tenant id */
  namespace?: InputMaybe<Scalars["String"]["input"]>;
  owner?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** Current group owner (nullable) */
  owner_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Unique slug */
  slug?: InputMaybe<Scalars["String"]["input"]>;
  /** Tags as jsonb array of strings */
  tags?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Group title */
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Visibility policy */
  visibility?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Groups_Max_Fields = {
  __typename?: "groups_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Optional avatar file id */
  avatar_file_id?: Maybe<Scalars["uuid"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Creator user id */
  created_by_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Description */
  description?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Join policy */
  join_policy?: Maybe<Scalars["String"]["output"]>;
  /** Semantic kind: group/team/class/etc */
  kind?: Maybe<Scalars["String"]["output"]>;
  /** Optional namespace/tenant id */
  namespace?: Maybe<Scalars["String"]["output"]>;
  /** Current group owner (nullable) */
  owner_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Unique slug */
  slug?: Maybe<Scalars["String"]["output"]>;
  /** Group title */
  title?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Visibility policy */
  visibility?: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type Groups_Min_Fields = {
  __typename?: "groups_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Optional avatar file id */
  avatar_file_id?: Maybe<Scalars["uuid"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Creator user id */
  created_by_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Description */
  description?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Join policy */
  join_policy?: Maybe<Scalars["String"]["output"]>;
  /** Semantic kind: group/team/class/etc */
  kind?: Maybe<Scalars["String"]["output"]>;
  /** Optional namespace/tenant id */
  namespace?: Maybe<Scalars["String"]["output"]>;
  /** Current group owner (nullable) */
  owner_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Unique slug */
  slug?: Maybe<Scalars["String"]["output"]>;
  /** Group title */
  title?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Visibility policy */
  visibility?: Maybe<Scalars["String"]["output"]>;
};

/** response of any mutation on the table "groups" */
export type Groups_Mutation_Response = {
  __typename?: "groups_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Groups>;
};

/** input type for inserting object relation for remote table "groups" */
export type Groups_Obj_Rel_Insert_Input = {
  data: Groups_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Groups_On_Conflict>;
};

/** on_conflict condition type for table "groups" */
export type Groups_On_Conflict = {
  constraint: Groups_Constraint;
  update_columns?: Array<Groups_Update_Column>;
  where?: InputMaybe<Groups_Bool_Exp>;
};

/** Ordering options when selecting data from "groups". */
export type Groups_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  allow_delete_group_users?: InputMaybe<Order_By>;
  allow_invite_users?: InputMaybe<Order_By>;
  allow_join_users?: InputMaybe<Order_By>;
  allow_manage_members_users?: InputMaybe<Order_By>;
  allow_request_users?: InputMaybe<Order_By>;
  allow_update_group_users?: InputMaybe<Order_By>;
  allow_view_users?: InputMaybe<Order_By>;
  attributes?: InputMaybe<Order_By>;
  avatar_file_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by_id?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  invitations_aggregate?: InputMaybe<Invitations_Aggregate_Order_By>;
  join_policy?: InputMaybe<Order_By>;
  kind?: InputMaybe<Order_By>;
  memberships_aggregate?: InputMaybe<Memberships_Aggregate_Order_By>;
  namespace?: InputMaybe<Order_By>;
  owner?: InputMaybe<Users_Order_By>;
  owner_id?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  tags?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  visibility?: InputMaybe<Order_By>;
};

/** primary key columns input for table: groups */
export type Groups_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Groups_Prepend_Input = {
  /** Who can delete group */
  allow_delete_group_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who can send invites */
  allow_invite_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who joins immediately on open policy */
  allow_join_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who can manage members */
  allow_manage_members_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who may request to join */
  allow_request_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who can update group */
  allow_update_group_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Visibility allow-list */
  allow_view_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Extensible attributes */
  attributes?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Tags as jsonb array of strings */
  tags?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "groups" */
export enum Groups_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  AllowDeleteGroupUsers = "allow_delete_group_users",
  /** column name */
  AllowInviteUsers = "allow_invite_users",
  /** column name */
  AllowJoinUsers = "allow_join_users",
  /** column name */
  AllowManageMembersUsers = "allow_manage_members_users",
  /** column name */
  AllowRequestUsers = "allow_request_users",
  /** column name */
  AllowUpdateGroupUsers = "allow_update_group_users",
  /** column name */
  AllowViewUsers = "allow_view_users",
  /** column name */
  Attributes = "attributes",
  /** column name */
  AvatarFileId = "avatar_file_id",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CreatedById = "created_by_id",
  /** column name */
  Description = "description",
  /** column name */
  Id = "id",
  /** column name */
  JoinPolicy = "join_policy",
  /** column name */
  Kind = "kind",
  /** column name */
  Namespace = "namespace",
  /** column name */
  OwnerId = "owner_id",
  /** column name */
  Slug = "slug",
  /** column name */
  Tags = "tags",
  /** column name */
  Title = "title",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  Visibility = "visibility",
}

/** input type for updating data in table "groups" */
export type Groups_Set_Input = {
  /** Who can delete group */
  allow_delete_group_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who can send invites */
  allow_invite_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who joins immediately on open policy */
  allow_join_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who can manage members */
  allow_manage_members_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who may request to join */
  allow_request_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who can update group */
  allow_update_group_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Visibility allow-list */
  allow_view_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Extensible attributes */
  attributes?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Optional avatar file id */
  avatar_file_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Creator user id */
  created_by_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Description */
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Join policy */
  join_policy?: InputMaybe<Scalars["String"]["input"]>;
  /** Semantic kind: group/team/class/etc */
  kind?: InputMaybe<Scalars["String"]["input"]>;
  /** Optional namespace/tenant id */
  namespace?: InputMaybe<Scalars["String"]["input"]>;
  /** Current group owner (nullable) */
  owner_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Unique slug */
  slug?: InputMaybe<Scalars["String"]["input"]>;
  /** Tags as jsonb array of strings */
  tags?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Group title */
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Visibility policy */
  visibility?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate stddev on columns */
export type Groups_Stddev_Fields = {
  __typename?: "groups_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Groups_Stddev_Pop_Fields = {
  __typename?: "groups_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Groups_Stddev_Samp_Fields = {
  __typename?: "groups_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "groups" */
export type Groups_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Groups_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Groups_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Who can delete group */
  allow_delete_group_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who can send invites */
  allow_invite_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who joins immediately on open policy */
  allow_join_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who can manage members */
  allow_manage_members_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who may request to join */
  allow_request_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Who can update group */
  allow_update_group_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Visibility allow-list */
  allow_view_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Extensible attributes */
  attributes?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Optional avatar file id */
  avatar_file_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Creator user id */
  created_by_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Description */
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Join policy */
  join_policy?: InputMaybe<Scalars["String"]["input"]>;
  /** Semantic kind: group/team/class/etc */
  kind?: InputMaybe<Scalars["String"]["input"]>;
  /** Optional namespace/tenant id */
  namespace?: InputMaybe<Scalars["String"]["input"]>;
  /** Current group owner (nullable) */
  owner_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Unique slug */
  slug?: InputMaybe<Scalars["String"]["input"]>;
  /** Tags as jsonb array of strings */
  tags?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Group title */
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Visibility policy */
  visibility?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate sum on columns */
export type Groups_Sum_Fields = {
  __typename?: "groups_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "groups" */
export enum Groups_Update_Column {
  /** column name */
  AllowDeleteGroupUsers = "allow_delete_group_users",
  /** column name */
  AllowInviteUsers = "allow_invite_users",
  /** column name */
  AllowJoinUsers = "allow_join_users",
  /** column name */
  AllowManageMembersUsers = "allow_manage_members_users",
  /** column name */
  AllowRequestUsers = "allow_request_users",
  /** column name */
  AllowUpdateGroupUsers = "allow_update_group_users",
  /** column name */
  AllowViewUsers = "allow_view_users",
  /** column name */
  Attributes = "attributes",
  /** column name */
  AvatarFileId = "avatar_file_id",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CreatedById = "created_by_id",
  /** column name */
  Description = "description",
  /** column name */
  Id = "id",
  /** column name */
  JoinPolicy = "join_policy",
  /** column name */
  Kind = "kind",
  /** column name */
  Namespace = "namespace",
  /** column name */
  OwnerId = "owner_id",
  /** column name */
  Slug = "slug",
  /** column name */
  Tags = "tags",
  /** column name */
  Title = "title",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  Visibility = "visibility",
}

export type Groups_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Groups_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Groups_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Groups_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Groups_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Groups_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Groups_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Groups_Set_Input>;
  /** filter the rows which have to be updated */
  where: Groups_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Groups_Var_Pop_Fields = {
  __typename?: "groups_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Groups_Var_Samp_Fields = {
  __typename?: "groups_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Groups_Variance_Fields = {
  __typename?: "groups_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "hasyx" */
export type Hasyx = {
  __typename?: "hasyx";
  hid?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  logs_diffs?: Maybe<Logs_Diffs>;
  /** An object relationship */
  logs_states?: Maybe<Logs_States>;
  namespace?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  payments_methods?: Maybe<Payments_Methods>;
  /** An object relationship */
  payments_operations?: Maybe<Payments_Operations>;
  /** An object relationship */
  payments_plans?: Maybe<Payments_Plans>;
  /** An object relationship */
  payments_providers?: Maybe<Payments_Providers>;
  /** An object relationship */
  payments_subscriptions?: Maybe<Payments_Subscriptions>;
  /** An object relationship */
  payments_user_payment_provider_mappings?: Maybe<Payments_User_Payment_Provider_Mappings>;
  project?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  public_accounts?: Maybe<Accounts>;
  /** An object relationship */
  public_auth_jwt?: Maybe<Auth_Jwt>;
  /** An object relationship */
  public_debug?: Maybe<Debug>;
  /** An object relationship */
  public_events?: Maybe<Events>;
  /** An object relationship */
  public_github_issues?: Maybe<Github_Issues>;
  /** An object relationship */
  public_groups?: Maybe<Groups>;
  /** An object relationship */
  public_invitations?: Maybe<Invitations>;
  /** An object relationship */
  public_invited?: Maybe<Invited>;
  /** An object relationship */
  public_invites?: Maybe<Invites>;
  /** An object relationship */
  public_memberships?: Maybe<Memberships>;
  /** An object relationship */
  public_message_reads?: Maybe<Message_Reads>;
  /** An object relationship */
  public_messages?: Maybe<Messages>;
  /** An object relationship */
  public_notifications?: Maybe<Notifications>;
  /** An object relationship */
  public_replies?: Maybe<Replies>;
  /** An object relationship */
  public_rooms?: Maybe<Rooms>;
  /** An object relationship */
  public_schedule?: Maybe<Schedule>;
  /** An object relationship */
  public_users?: Maybe<Users>;
  /** An object relationship */
  public_verification_codes?: Maybe<Verification_Codes>;
  schema?: Maybe<Scalars["String"]["output"]>;
  table?: Maybe<Scalars["String"]["output"]>;
};

/** aggregated selection of "hasyx" */
export type Hasyx_Aggregate = {
  __typename?: "hasyx_aggregate";
  aggregate?: Maybe<Hasyx_Aggregate_Fields>;
  nodes: Array<Hasyx>;
};

/** aggregate fields of "hasyx" */
export type Hasyx_Aggregate_Fields = {
  __typename?: "hasyx_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Hasyx_Max_Fields>;
  min?: Maybe<Hasyx_Min_Fields>;
};

/** aggregate fields of "hasyx" */
export type Hasyx_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Hasyx_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Boolean expression to filter rows from the table "hasyx". All fields are combined with a logical 'AND'. */
export type Hasyx_Bool_Exp = {
  _and?: InputMaybe<Array<Hasyx_Bool_Exp>>;
  _not?: InputMaybe<Hasyx_Bool_Exp>;
  _or?: InputMaybe<Array<Hasyx_Bool_Exp>>;
  hid?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  logs_diffs?: InputMaybe<Logs_Diffs_Bool_Exp>;
  logs_states?: InputMaybe<Logs_States_Bool_Exp>;
  namespace?: InputMaybe<String_Comparison_Exp>;
  payments_methods?: InputMaybe<Payments_Methods_Bool_Exp>;
  payments_operations?: InputMaybe<Payments_Operations_Bool_Exp>;
  payments_plans?: InputMaybe<Payments_Plans_Bool_Exp>;
  payments_providers?: InputMaybe<Payments_Providers_Bool_Exp>;
  payments_subscriptions?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
  payments_user_payment_provider_mappings?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
  project?: InputMaybe<String_Comparison_Exp>;
  public_accounts?: InputMaybe<Accounts_Bool_Exp>;
  public_auth_jwt?: InputMaybe<Auth_Jwt_Bool_Exp>;
  public_debug?: InputMaybe<Debug_Bool_Exp>;
  public_events?: InputMaybe<Events_Bool_Exp>;
  public_github_issues?: InputMaybe<Github_Issues_Bool_Exp>;
  public_groups?: InputMaybe<Groups_Bool_Exp>;
  public_invitations?: InputMaybe<Invitations_Bool_Exp>;
  public_invited?: InputMaybe<Invited_Bool_Exp>;
  public_invites?: InputMaybe<Invites_Bool_Exp>;
  public_memberships?: InputMaybe<Memberships_Bool_Exp>;
  public_message_reads?: InputMaybe<Message_Reads_Bool_Exp>;
  public_messages?: InputMaybe<Messages_Bool_Exp>;
  public_notifications?: InputMaybe<Notifications_Bool_Exp>;
  public_replies?: InputMaybe<Replies_Bool_Exp>;
  public_rooms?: InputMaybe<Rooms_Bool_Exp>;
  public_schedule?: InputMaybe<Schedule_Bool_Exp>;
  public_users?: InputMaybe<Users_Bool_Exp>;
  public_verification_codes?: InputMaybe<Verification_Codes_Bool_Exp>;
  schema?: InputMaybe<String_Comparison_Exp>;
  table?: InputMaybe<String_Comparison_Exp>;
};

/** input type for inserting data into table "hasyx" */
export type Hasyx_Insert_Input = {
  hid?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  logs_diffs?: InputMaybe<Logs_Diffs_Obj_Rel_Insert_Input>;
  logs_states?: InputMaybe<Logs_States_Obj_Rel_Insert_Input>;
  namespace?: InputMaybe<Scalars["String"]["input"]>;
  payments_methods?: InputMaybe<Payments_Methods_Obj_Rel_Insert_Input>;
  payments_operations?: InputMaybe<Payments_Operations_Obj_Rel_Insert_Input>;
  payments_plans?: InputMaybe<Payments_Plans_Obj_Rel_Insert_Input>;
  payments_providers?: InputMaybe<Payments_Providers_Obj_Rel_Insert_Input>;
  payments_subscriptions?: InputMaybe<Payments_Subscriptions_Obj_Rel_Insert_Input>;
  payments_user_payment_provider_mappings?: InputMaybe<Payments_User_Payment_Provider_Mappings_Obj_Rel_Insert_Input>;
  project?: InputMaybe<Scalars["String"]["input"]>;
  public_accounts?: InputMaybe<Accounts_Obj_Rel_Insert_Input>;
  public_auth_jwt?: InputMaybe<Auth_Jwt_Obj_Rel_Insert_Input>;
  public_debug?: InputMaybe<Debug_Obj_Rel_Insert_Input>;
  public_events?: InputMaybe<Events_Obj_Rel_Insert_Input>;
  public_github_issues?: InputMaybe<Github_Issues_Obj_Rel_Insert_Input>;
  public_groups?: InputMaybe<Groups_Obj_Rel_Insert_Input>;
  public_invitations?: InputMaybe<Invitations_Obj_Rel_Insert_Input>;
  public_invited?: InputMaybe<Invited_Obj_Rel_Insert_Input>;
  public_invites?: InputMaybe<Invites_Obj_Rel_Insert_Input>;
  public_memberships?: InputMaybe<Memberships_Obj_Rel_Insert_Input>;
  public_message_reads?: InputMaybe<Message_Reads_Obj_Rel_Insert_Input>;
  public_messages?: InputMaybe<Messages_Obj_Rel_Insert_Input>;
  public_notifications?: InputMaybe<Notifications_Obj_Rel_Insert_Input>;
  public_replies?: InputMaybe<Replies_Obj_Rel_Insert_Input>;
  public_rooms?: InputMaybe<Rooms_Obj_Rel_Insert_Input>;
  public_schedule?: InputMaybe<Schedule_Obj_Rel_Insert_Input>;
  public_users?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  public_verification_codes?: InputMaybe<Verification_Codes_Obj_Rel_Insert_Input>;
  schema?: InputMaybe<Scalars["String"]["input"]>;
  table?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Hasyx_Max_Fields = {
  __typename?: "hasyx_max_fields";
  hid?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  namespace?: Maybe<Scalars["String"]["output"]>;
  project?: Maybe<Scalars["String"]["output"]>;
  schema?: Maybe<Scalars["String"]["output"]>;
  table?: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type Hasyx_Min_Fields = {
  __typename?: "hasyx_min_fields";
  hid?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  namespace?: Maybe<Scalars["String"]["output"]>;
  project?: Maybe<Scalars["String"]["output"]>;
  schema?: Maybe<Scalars["String"]["output"]>;
  table?: Maybe<Scalars["String"]["output"]>;
};

/** input type for inserting object relation for remote table "hasyx" */
export type Hasyx_Obj_Rel_Insert_Input = {
  data: Hasyx_Insert_Input;
};

/** Ordering options when selecting data from "hasyx". */
export type Hasyx_Order_By = {
  hid?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  logs_diffs?: InputMaybe<Logs_Diffs_Order_By>;
  logs_states?: InputMaybe<Logs_States_Order_By>;
  namespace?: InputMaybe<Order_By>;
  payments_methods?: InputMaybe<Payments_Methods_Order_By>;
  payments_operations?: InputMaybe<Payments_Operations_Order_By>;
  payments_plans?: InputMaybe<Payments_Plans_Order_By>;
  payments_providers?: InputMaybe<Payments_Providers_Order_By>;
  payments_subscriptions?: InputMaybe<Payments_Subscriptions_Order_By>;
  payments_user_payment_provider_mappings?: InputMaybe<Payments_User_Payment_Provider_Mappings_Order_By>;
  project?: InputMaybe<Order_By>;
  public_accounts?: InputMaybe<Accounts_Order_By>;
  public_auth_jwt?: InputMaybe<Auth_Jwt_Order_By>;
  public_debug?: InputMaybe<Debug_Order_By>;
  public_events?: InputMaybe<Events_Order_By>;
  public_github_issues?: InputMaybe<Github_Issues_Order_By>;
  public_groups?: InputMaybe<Groups_Order_By>;
  public_invitations?: InputMaybe<Invitations_Order_By>;
  public_invited?: InputMaybe<Invited_Order_By>;
  public_invites?: InputMaybe<Invites_Order_By>;
  public_memberships?: InputMaybe<Memberships_Order_By>;
  public_message_reads?: InputMaybe<Message_Reads_Order_By>;
  public_messages?: InputMaybe<Messages_Order_By>;
  public_notifications?: InputMaybe<Notifications_Order_By>;
  public_replies?: InputMaybe<Replies_Order_By>;
  public_rooms?: InputMaybe<Rooms_Order_By>;
  public_schedule?: InputMaybe<Schedule_Order_By>;
  public_users?: InputMaybe<Users_Order_By>;
  public_verification_codes?: InputMaybe<Verification_Codes_Order_By>;
  schema?: InputMaybe<Order_By>;
  table?: InputMaybe<Order_By>;
};

/** select columns of table "hasyx" */
export enum Hasyx_Select_Column {
  /** column name */
  Hid = "hid",
  /** column name */
  Id = "id",
  /** column name */
  Namespace = "namespace",
  /** column name */
  Project = "project",
  /** column name */
  Schema = "schema",
  /** column name */
  Table = "table",
}

/** Streaming cursor of the table "hasyx" */
export type Hasyx_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Hasyx_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Hasyx_Stream_Cursor_Value_Input = {
  hid?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  namespace?: InputMaybe<Scalars["String"]["input"]>;
  project?: InputMaybe<Scalars["String"]["input"]>;
  schema?: InputMaybe<Scalars["String"]["input"]>;
  table?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "invitations" */
export type Invitations = {
  __typename?: "invitations";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** Expiration in ms */
  expires_at?: Maybe<Scalars["bigint"]["output"]>;
  /** An object relationship */
  group: Groups;
  /** Group id */
  group_id: Scalars["uuid"]["output"];
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** An object relationship */
  invited_by: Users;
  /** Inviter user id */
  invited_by_id: Scalars["uuid"]["output"];
  /** An object relationship */
  invitee_user?: Maybe<Users>;
  /** Invitee user id (optional) */
  invitee_user_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Invitation status */
  status: Scalars["String"]["output"];
  /** Unique invitation token */
  token: Scalars["String"]["output"];
  updated_at: Scalars["bigint"]["output"];
};

/** aggregated selection of "invitations" */
export type Invitations_Aggregate = {
  __typename?: "invitations_aggregate";
  aggregate?: Maybe<Invitations_Aggregate_Fields>;
  nodes: Array<Invitations>;
};

export type Invitations_Aggregate_Bool_Exp = {
  count?: InputMaybe<Invitations_Aggregate_Bool_Exp_Count>;
};

export type Invitations_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Invitations_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Invitations_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "invitations" */
export type Invitations_Aggregate_Fields = {
  __typename?: "invitations_aggregate_fields";
  avg?: Maybe<Invitations_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Invitations_Max_Fields>;
  min?: Maybe<Invitations_Min_Fields>;
  stddev?: Maybe<Invitations_Stddev_Fields>;
  stddev_pop?: Maybe<Invitations_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Invitations_Stddev_Samp_Fields>;
  sum?: Maybe<Invitations_Sum_Fields>;
  var_pop?: Maybe<Invitations_Var_Pop_Fields>;
  var_samp?: Maybe<Invitations_Var_Samp_Fields>;
  variance?: Maybe<Invitations_Variance_Fields>;
};

/** aggregate fields of "invitations" */
export type Invitations_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Invitations_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "invitations" */
export type Invitations_Aggregate_Order_By = {
  avg?: InputMaybe<Invitations_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Invitations_Max_Order_By>;
  min?: InputMaybe<Invitations_Min_Order_By>;
  stddev?: InputMaybe<Invitations_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Invitations_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Invitations_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Invitations_Sum_Order_By>;
  var_pop?: InputMaybe<Invitations_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Invitations_Var_Samp_Order_By>;
  variance?: InputMaybe<Invitations_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "invitations" */
export type Invitations_Arr_Rel_Insert_Input = {
  data: Array<Invitations_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Invitations_On_Conflict>;
};

/** aggregate avg on columns */
export type Invitations_Avg_Fields = {
  __typename?: "invitations_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Expiration in ms */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "invitations" */
export type Invitations_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration in ms */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "invitations". All fields are combined with a logical 'AND'. */
export type Invitations_Bool_Exp = {
  _and?: InputMaybe<Array<Invitations_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Invitations_Bool_Exp>;
  _or?: InputMaybe<Array<Invitations_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  expires_at?: InputMaybe<Bigint_Comparison_Exp>;
  group?: InputMaybe<Groups_Bool_Exp>;
  group_id?: InputMaybe<Uuid_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  invited_by?: InputMaybe<Users_Bool_Exp>;
  invited_by_id?: InputMaybe<Uuid_Comparison_Exp>;
  invitee_user?: InputMaybe<Users_Bool_Exp>;
  invitee_user_id?: InputMaybe<Uuid_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  token?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
};

/** unique or primary key constraints on table "invitations" */
export enum Invitations_Constraint {
  /** unique or primary key constraint on columns "id" */
  InvitationsPkey = "invitations_pkey",
}

/** input type for incrementing numeric columns in table "invitations" */
export type Invitations_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Expiration in ms */
  expires_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "invitations" */
export type Invitations_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Expiration in ms */
  expires_at?: InputMaybe<Scalars["bigint"]["input"]>;
  group?: InputMaybe<Groups_Obj_Rel_Insert_Input>;
  /** Group id */
  group_id?: InputMaybe<Scalars["uuid"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invited_by?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** Inviter user id */
  invited_by_id?: InputMaybe<Scalars["uuid"]["input"]>;
  invitee_user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** Invitee user id (optional) */
  invitee_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Invitation status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique invitation token */
  token?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate max on columns */
export type Invitations_Max_Fields = {
  __typename?: "invitations_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Expiration in ms */
  expires_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Group id */
  group_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Inviter user id */
  invited_by_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Invitee user id (optional) */
  invitee_user_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Invitation status */
  status?: Maybe<Scalars["String"]["output"]>;
  /** Unique invitation token */
  token?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by max() on columns of table "invitations" */
export type Invitations_Max_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Expiration in ms */
  expires_at?: InputMaybe<Order_By>;
  /** Group id */
  group_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Inviter user id */
  invited_by_id?: InputMaybe<Order_By>;
  /** Invitee user id (optional) */
  invitee_user_id?: InputMaybe<Order_By>;
  /** Invitation status */
  status?: InputMaybe<Order_By>;
  /** Unique invitation token */
  token?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Invitations_Min_Fields = {
  __typename?: "invitations_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Expiration in ms */
  expires_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Group id */
  group_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Inviter user id */
  invited_by_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Invitee user id (optional) */
  invitee_user_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Invitation status */
  status?: Maybe<Scalars["String"]["output"]>;
  /** Unique invitation token */
  token?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by min() on columns of table "invitations" */
export type Invitations_Min_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Expiration in ms */
  expires_at?: InputMaybe<Order_By>;
  /** Group id */
  group_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Inviter user id */
  invited_by_id?: InputMaybe<Order_By>;
  /** Invitee user id (optional) */
  invitee_user_id?: InputMaybe<Order_By>;
  /** Invitation status */
  status?: InputMaybe<Order_By>;
  /** Unique invitation token */
  token?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "invitations" */
export type Invitations_Mutation_Response = {
  __typename?: "invitations_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Invitations>;
};

/** input type for inserting object relation for remote table "invitations" */
export type Invitations_Obj_Rel_Insert_Input = {
  data: Invitations_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Invitations_On_Conflict>;
};

/** on_conflict condition type for table "invitations" */
export type Invitations_On_Conflict = {
  constraint: Invitations_Constraint;
  update_columns?: Array<Invitations_Update_Column>;
  where?: InputMaybe<Invitations_Bool_Exp>;
};

/** Ordering options when selecting data from "invitations". */
export type Invitations_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  expires_at?: InputMaybe<Order_By>;
  group?: InputMaybe<Groups_Order_By>;
  group_id?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  invited_by?: InputMaybe<Users_Order_By>;
  invited_by_id?: InputMaybe<Order_By>;
  invitee_user?: InputMaybe<Users_Order_By>;
  invitee_user_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  token?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: invitations */
export type Invitations_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "invitations" */
export enum Invitations_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  ExpiresAt = "expires_at",
  /** column name */
  GroupId = "group_id",
  /** column name */
  Id = "id",
  /** column name */
  InvitedById = "invited_by_id",
  /** column name */
  InviteeUserId = "invitee_user_id",
  /** column name */
  Status = "status",
  /** column name */
  Token = "token",
  /** column name */
  UpdatedAt = "updated_at",
}

/** input type for updating data in table "invitations" */
export type Invitations_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Expiration in ms */
  expires_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Group id */
  group_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Inviter user id */
  invited_by_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Invitee user id (optional) */
  invitee_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Invitation status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique invitation token */
  token?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate stddev on columns */
export type Invitations_Stddev_Fields = {
  __typename?: "invitations_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Expiration in ms */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "invitations" */
export type Invitations_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration in ms */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Invitations_Stddev_Pop_Fields = {
  __typename?: "invitations_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Expiration in ms */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "invitations" */
export type Invitations_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration in ms */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Invitations_Stddev_Samp_Fields = {
  __typename?: "invitations_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Expiration in ms */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "invitations" */
export type Invitations_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration in ms */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "invitations" */
export type Invitations_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Invitations_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Invitations_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Expiration in ms */
  expires_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Group id */
  group_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Inviter user id */
  invited_by_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Invitee user id (optional) */
  invitee_user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Invitation status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique invitation token */
  token?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate sum on columns */
export type Invitations_Sum_Fields = {
  __typename?: "invitations_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Expiration in ms */
  expires_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "invitations" */
export type Invitations_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration in ms */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "invitations" */
export enum Invitations_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  ExpiresAt = "expires_at",
  /** column name */
  GroupId = "group_id",
  /** column name */
  Id = "id",
  /** column name */
  InvitedById = "invited_by_id",
  /** column name */
  InviteeUserId = "invitee_user_id",
  /** column name */
  Status = "status",
  /** column name */
  Token = "token",
  /** column name */
  UpdatedAt = "updated_at",
}

export type Invitations_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Invitations_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Invitations_Set_Input>;
  /** filter the rows which have to be updated */
  where: Invitations_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Invitations_Var_Pop_Fields = {
  __typename?: "invitations_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Expiration in ms */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "invitations" */
export type Invitations_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration in ms */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Invitations_Var_Samp_Fields = {
  __typename?: "invitations_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Expiration in ms */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "invitations" */
export type Invitations_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration in ms */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Invitations_Variance_Fields = {
  __typename?: "invitations_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Expiration in ms */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "invitations" */
export type Invitations_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration in ms */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "invited" */
export type Invited = {
  __typename?: "invited";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** Reference to the invite */
  invite_id: Scalars["uuid"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** User who used the invite */
  user_id: Scalars["uuid"]["output"];
};

/** aggregated selection of "invited" */
export type Invited_Aggregate = {
  __typename?: "invited_aggregate";
  aggregate?: Maybe<Invited_Aggregate_Fields>;
  nodes: Array<Invited>;
};

/** aggregate fields of "invited" */
export type Invited_Aggregate_Fields = {
  __typename?: "invited_aggregate_fields";
  avg?: Maybe<Invited_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Invited_Max_Fields>;
  min?: Maybe<Invited_Min_Fields>;
  stddev?: Maybe<Invited_Stddev_Fields>;
  stddev_pop?: Maybe<Invited_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Invited_Stddev_Samp_Fields>;
  sum?: Maybe<Invited_Sum_Fields>;
  var_pop?: Maybe<Invited_Var_Pop_Fields>;
  var_samp?: Maybe<Invited_Var_Samp_Fields>;
  variance?: Maybe<Invited_Variance_Fields>;
};

/** aggregate fields of "invited" */
export type Invited_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Invited_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Invited_Avg_Fields = {
  __typename?: "invited_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "invited". All fields are combined with a logical 'AND'. */
export type Invited_Bool_Exp = {
  _and?: InputMaybe<Array<Invited_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Invited_Bool_Exp>;
  _or?: InputMaybe<Array<Invited_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  invite_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "invited" */
export enum Invited_Constraint {
  /** unique or primary key constraint on columns "invite_id" */
  InvitedInviteIdUnique = "invited_invite_id_unique",
  /** unique or primary key constraint on columns "id" */
  InvitedPkey = "invited_pkey",
}

/** input type for incrementing numeric columns in table "invited" */
export type Invited_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "invited" */
export type Invited_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the invite */
  invite_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who used the invite */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Invited_Max_Fields = {
  __typename?: "invited_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to the invite */
  invite_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User who used the invite */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type Invited_Min_Fields = {
  __typename?: "invited_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to the invite */
  invite_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User who used the invite */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "invited" */
export type Invited_Mutation_Response = {
  __typename?: "invited_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Invited>;
};

/** input type for inserting object relation for remote table "invited" */
export type Invited_Obj_Rel_Insert_Input = {
  data: Invited_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Invited_On_Conflict>;
};

/** on_conflict condition type for table "invited" */
export type Invited_On_Conflict = {
  constraint: Invited_Constraint;
  update_columns?: Array<Invited_Update_Column>;
  where?: InputMaybe<Invited_Bool_Exp>;
};

/** Ordering options when selecting data from "invited". */
export type Invited_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  invite_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: invited */
export type Invited_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "invited" */
export enum Invited_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  InviteId = "invite_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "invited" */
export type Invited_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the invite */
  invite_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who used the invite */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Invited_Stddev_Fields = {
  __typename?: "invited_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Invited_Stddev_Pop_Fields = {
  __typename?: "invited_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Invited_Stddev_Samp_Fields = {
  __typename?: "invited_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "invited" */
export type Invited_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Invited_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Invited_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to the invite */
  invite_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who used the invite */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Invited_Sum_Fields = {
  __typename?: "invited_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "invited" */
export enum Invited_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  InviteId = "invite_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Invited_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Invited_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Invited_Set_Input>;
  /** filter the rows which have to be updated */
  where: Invited_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Invited_Var_Pop_Fields = {
  __typename?: "invited_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Invited_Var_Samp_Fields = {
  __typename?: "invited_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Invited_Variance_Fields = {
  __typename?: "invited_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "invites" */
export type Invites = {
  __typename?: "invites";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Unique invite code */
  code: Scalars["String"]["output"];
  created_at: Scalars["bigint"]["output"];
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** User who created the invite */
  user_id: Scalars["uuid"]["output"];
};

/** aggregated selection of "invites" */
export type Invites_Aggregate = {
  __typename?: "invites_aggregate";
  aggregate?: Maybe<Invites_Aggregate_Fields>;
  nodes: Array<Invites>;
};

/** aggregate fields of "invites" */
export type Invites_Aggregate_Fields = {
  __typename?: "invites_aggregate_fields";
  avg?: Maybe<Invites_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Invites_Max_Fields>;
  min?: Maybe<Invites_Min_Fields>;
  stddev?: Maybe<Invites_Stddev_Fields>;
  stddev_pop?: Maybe<Invites_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Invites_Stddev_Samp_Fields>;
  sum?: Maybe<Invites_Sum_Fields>;
  var_pop?: Maybe<Invites_Var_Pop_Fields>;
  var_samp?: Maybe<Invites_Var_Samp_Fields>;
  variance?: Maybe<Invites_Variance_Fields>;
};

/** aggregate fields of "invites" */
export type Invites_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Invites_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Invites_Avg_Fields = {
  __typename?: "invites_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "invites". All fields are combined with a logical 'AND'. */
export type Invites_Bool_Exp = {
  _and?: InputMaybe<Array<Invites_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Invites_Bool_Exp>;
  _or?: InputMaybe<Array<Invites_Bool_Exp>>;
  code?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "invites" */
export enum Invites_Constraint {
  /** unique or primary key constraint on columns "code" */
  InvitesCodeKey = "invites_code_key",
  /** unique or primary key constraint on columns "id" */
  InvitesPkey = "invites_pkey",
}

/** input type for incrementing numeric columns in table "invites" */
export type Invites_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "invites" */
export type Invites_Insert_Input = {
  /** Unique invite code */
  code?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who created the invite */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Invites_Max_Fields = {
  __typename?: "invites_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Unique invite code */
  code?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User who created the invite */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type Invites_Min_Fields = {
  __typename?: "invites_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Unique invite code */
  code?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User who created the invite */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "invites" */
export type Invites_Mutation_Response = {
  __typename?: "invites_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Invites>;
};

/** input type for inserting object relation for remote table "invites" */
export type Invites_Obj_Rel_Insert_Input = {
  data: Invites_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Invites_On_Conflict>;
};

/** on_conflict condition type for table "invites" */
export type Invites_On_Conflict = {
  constraint: Invites_Constraint;
  update_columns?: Array<Invites_Update_Column>;
  where?: InputMaybe<Invites_Bool_Exp>;
};

/** Ordering options when selecting data from "invites". */
export type Invites_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  code?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: invites */
export type Invites_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "invites" */
export enum Invites_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  Code = "code",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "invites" */
export type Invites_Set_Input = {
  /** Unique invite code */
  code?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who created the invite */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Invites_Stddev_Fields = {
  __typename?: "invites_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Invites_Stddev_Pop_Fields = {
  __typename?: "invites_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Invites_Stddev_Samp_Fields = {
  __typename?: "invites_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "invites" */
export type Invites_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Invites_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Invites_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Unique invite code */
  code?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who created the invite */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Invites_Sum_Fields = {
  __typename?: "invites_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "invites" */
export enum Invites_Update_Column {
  /** column name */
  Code = "code",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Invites_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Invites_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Invites_Set_Input>;
  /** filter the rows which have to be updated */
  where: Invites_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Invites_Var_Pop_Fields = {
  __typename?: "invites_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Invites_Var_Samp_Fields = {
  __typename?: "invites_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Invites_Variance_Fields = {
  __typename?: "invites_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars["jsonb"]["input"]>;
  _eq?: InputMaybe<Scalars["jsonb"]["input"]>;
  _gt?: InputMaybe<Scalars["jsonb"]["input"]>;
  _gte?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars["String"]["input"]>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars["String"]["input"]>>;
  _in?: InputMaybe<Array<Scalars["jsonb"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["jsonb"]["input"]>;
  _lte?: InputMaybe<Scalars["jsonb"]["input"]>;
  _neq?: InputMaybe<Scalars["jsonb"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["jsonb"]["input"]>>;
};

/** columns and relationships of "logs.diffs" */
export type Logs_Diffs = {
  __typename?: "logs_diffs";
  /** Source column name */
  _column: Scalars["String"]["output"];
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Source record identifier */
  _id: Scalars["String"]["output"];
  /** Source schema name */
  _schema: Scalars["String"]["output"];
  /** Source table name */
  _table: Scalars["String"]["output"];
  /** New value before diff calculation */
  _value?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** Calculated diff from previous state */
  diff?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** Whether the diff has been processed by event trigger */
  processed?: Maybe<Scalars["Boolean"]["output"]>;
  updated_at: Scalars["bigint"]["output"];
  /** User who made the change */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregated selection of "logs.diffs" */
export type Logs_Diffs_Aggregate = {
  __typename?: "logs_diffs_aggregate";
  aggregate?: Maybe<Logs_Diffs_Aggregate_Fields>;
  nodes: Array<Logs_Diffs>;
};

/** aggregate fields of "logs.diffs" */
export type Logs_Diffs_Aggregate_Fields = {
  __typename?: "logs_diffs_aggregate_fields";
  avg?: Maybe<Logs_Diffs_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Logs_Diffs_Max_Fields>;
  min?: Maybe<Logs_Diffs_Min_Fields>;
  stddev?: Maybe<Logs_Diffs_Stddev_Fields>;
  stddev_pop?: Maybe<Logs_Diffs_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Logs_Diffs_Stddev_Samp_Fields>;
  sum?: Maybe<Logs_Diffs_Sum_Fields>;
  var_pop?: Maybe<Logs_Diffs_Var_Pop_Fields>;
  var_samp?: Maybe<Logs_Diffs_Var_Samp_Fields>;
  variance?: Maybe<Logs_Diffs_Variance_Fields>;
};

/** aggregate fields of "logs.diffs" */
export type Logs_Diffs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Logs_Diffs_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Logs_Diffs_Avg_Fields = {
  __typename?: "logs_diffs_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "logs.diffs". All fields are combined with a logical 'AND'. */
export type Logs_Diffs_Bool_Exp = {
  _and?: InputMaybe<Array<Logs_Diffs_Bool_Exp>>;
  _column?: InputMaybe<String_Comparison_Exp>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _id?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Logs_Diffs_Bool_Exp>;
  _or?: InputMaybe<Array<Logs_Diffs_Bool_Exp>>;
  _schema?: InputMaybe<String_Comparison_Exp>;
  _table?: InputMaybe<String_Comparison_Exp>;
  _value?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  diff?: InputMaybe<String_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  processed?: InputMaybe<Boolean_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "logs.diffs" */
export enum Logs_Diffs_Constraint {
  /** unique or primary key constraint on columns "id" */
  DiffsPkey = "diffs_pkey",
}

/** input type for incrementing numeric columns in table "logs.diffs" */
export type Logs_Diffs_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "logs.diffs" */
export type Logs_Diffs_Insert_Input = {
  /** Source column name */
  _column?: InputMaybe<Scalars["String"]["input"]>;
  /** Source record identifier */
  _id?: InputMaybe<Scalars["String"]["input"]>;
  /** Source schema name */
  _schema?: InputMaybe<Scalars["String"]["input"]>;
  /** Source table name */
  _table?: InputMaybe<Scalars["String"]["input"]>;
  /** New value before diff calculation */
  _value?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Calculated diff from previous state */
  diff?: InputMaybe<Scalars["String"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Whether the diff has been processed by event trigger */
  processed?: InputMaybe<Scalars["Boolean"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who made the change */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Logs_Diffs_Max_Fields = {
  __typename?: "logs_diffs_max_fields";
  /** Source column name */
  _column?: Maybe<Scalars["String"]["output"]>;
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Source record identifier */
  _id?: Maybe<Scalars["String"]["output"]>;
  /** Source schema name */
  _schema?: Maybe<Scalars["String"]["output"]>;
  /** Source table name */
  _table?: Maybe<Scalars["String"]["output"]>;
  /** New value before diff calculation */
  _value?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Calculated diff from previous state */
  diff?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User who made the change */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type Logs_Diffs_Min_Fields = {
  __typename?: "logs_diffs_min_fields";
  /** Source column name */
  _column?: Maybe<Scalars["String"]["output"]>;
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Source record identifier */
  _id?: Maybe<Scalars["String"]["output"]>;
  /** Source schema name */
  _schema?: Maybe<Scalars["String"]["output"]>;
  /** Source table name */
  _table?: Maybe<Scalars["String"]["output"]>;
  /** New value before diff calculation */
  _value?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Calculated diff from previous state */
  diff?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User who made the change */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "logs.diffs" */
export type Logs_Diffs_Mutation_Response = {
  __typename?: "logs_diffs_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Logs_Diffs>;
};

/** input type for inserting object relation for remote table "logs.diffs" */
export type Logs_Diffs_Obj_Rel_Insert_Input = {
  data: Logs_Diffs_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Logs_Diffs_On_Conflict>;
};

/** on_conflict condition type for table "logs.diffs" */
export type Logs_Diffs_On_Conflict = {
  constraint: Logs_Diffs_Constraint;
  update_columns?: Array<Logs_Diffs_Update_Column>;
  where?: InputMaybe<Logs_Diffs_Bool_Exp>;
};

/** Ordering options when selecting data from "logs.diffs". */
export type Logs_Diffs_Order_By = {
  _column?: InputMaybe<Order_By>;
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  _id?: InputMaybe<Order_By>;
  _schema?: InputMaybe<Order_By>;
  _table?: InputMaybe<Order_By>;
  _value?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  diff?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  processed?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: logs.diffs */
export type Logs_Diffs_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "logs.diffs" */
export enum Logs_Diffs_Select_Column {
  /** column name */
  Column = "_column",
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  Id = "_id",
  /** column name */
  Schema = "_schema",
  /** column name */
  Table = "_table",
  /** column name */
  Value = "_value",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Diff = "diff",
  /** column name */
  Id = "id",
  /** column name */
  Processed = "processed",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "logs.diffs" */
export type Logs_Diffs_Set_Input = {
  /** Source column name */
  _column?: InputMaybe<Scalars["String"]["input"]>;
  /** Source record identifier */
  _id?: InputMaybe<Scalars["String"]["input"]>;
  /** Source schema name */
  _schema?: InputMaybe<Scalars["String"]["input"]>;
  /** Source table name */
  _table?: InputMaybe<Scalars["String"]["input"]>;
  /** New value before diff calculation */
  _value?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Calculated diff from previous state */
  diff?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Whether the diff has been processed by event trigger */
  processed?: InputMaybe<Scalars["Boolean"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who made the change */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Logs_Diffs_Stddev_Fields = {
  __typename?: "logs_diffs_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Logs_Diffs_Stddev_Pop_Fields = {
  __typename?: "logs_diffs_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Logs_Diffs_Stddev_Samp_Fields = {
  __typename?: "logs_diffs_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "logs_diffs" */
export type Logs_Diffs_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Logs_Diffs_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Logs_Diffs_Stream_Cursor_Value_Input = {
  /** Source column name */
  _column?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Source record identifier */
  _id?: InputMaybe<Scalars["String"]["input"]>;
  /** Source schema name */
  _schema?: InputMaybe<Scalars["String"]["input"]>;
  /** Source table name */
  _table?: InputMaybe<Scalars["String"]["input"]>;
  /** New value before diff calculation */
  _value?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Calculated diff from previous state */
  diff?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Whether the diff has been processed by event trigger */
  processed?: InputMaybe<Scalars["Boolean"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who made the change */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Logs_Diffs_Sum_Fields = {
  __typename?: "logs_diffs_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "logs.diffs" */
export enum Logs_Diffs_Update_Column {
  /** column name */
  Column = "_column",
  /** column name */
  Id = "_id",
  /** column name */
  Schema = "_schema",
  /** column name */
  Table = "_table",
  /** column name */
  Value = "_value",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Diff = "diff",
  /** column name */
  Id = "id",
  /** column name */
  Processed = "processed",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Logs_Diffs_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Logs_Diffs_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Logs_Diffs_Set_Input>;
  /** filter the rows which have to be updated */
  where: Logs_Diffs_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Logs_Diffs_Var_Pop_Fields = {
  __typename?: "logs_diffs_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Logs_Diffs_Var_Samp_Fields = {
  __typename?: "logs_diffs_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Logs_Diffs_Variance_Fields = {
  __typename?: "logs_diffs_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "logs.states" */
export type Logs_States = {
  __typename?: "logs_states";
  /** Source column name */
  _column: Scalars["String"]["output"];
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Source record identifier */
  _id: Scalars["String"]["output"];
  /** Source schema name */
  _schema: Scalars["String"]["output"];
  /** Source table name */
  _table: Scalars["String"]["output"];
  created_at: Scalars["bigint"]["output"];
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** State snapshot (null for delete) */
  state?: Maybe<Scalars["jsonb"]["output"]>;
  updated_at: Scalars["bigint"]["output"];
  /** User who made the change */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** columns and relationships of "logs.states" */
export type Logs_StatesStateArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "logs.states" */
export type Logs_States_Aggregate = {
  __typename?: "logs_states_aggregate";
  aggregate?: Maybe<Logs_States_Aggregate_Fields>;
  nodes: Array<Logs_States>;
};

/** aggregate fields of "logs.states" */
export type Logs_States_Aggregate_Fields = {
  __typename?: "logs_states_aggregate_fields";
  avg?: Maybe<Logs_States_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Logs_States_Max_Fields>;
  min?: Maybe<Logs_States_Min_Fields>;
  stddev?: Maybe<Logs_States_Stddev_Fields>;
  stddev_pop?: Maybe<Logs_States_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Logs_States_Stddev_Samp_Fields>;
  sum?: Maybe<Logs_States_Sum_Fields>;
  var_pop?: Maybe<Logs_States_Var_Pop_Fields>;
  var_samp?: Maybe<Logs_States_Var_Samp_Fields>;
  variance?: Maybe<Logs_States_Variance_Fields>;
};

/** aggregate fields of "logs.states" */
export type Logs_States_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Logs_States_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Logs_States_Append_Input = {
  /** State snapshot (null for delete) */
  state?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate avg on columns */
export type Logs_States_Avg_Fields = {
  __typename?: "logs_states_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "logs.states". All fields are combined with a logical 'AND'. */
export type Logs_States_Bool_Exp = {
  _and?: InputMaybe<Array<Logs_States_Bool_Exp>>;
  _column?: InputMaybe<String_Comparison_Exp>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _id?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Logs_States_Bool_Exp>;
  _or?: InputMaybe<Array<Logs_States_Bool_Exp>>;
  _schema?: InputMaybe<String_Comparison_Exp>;
  _table?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  state?: InputMaybe<Jsonb_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "logs.states" */
export enum Logs_States_Constraint {
  /** unique or primary key constraint on columns "id" */
  StatesPkey = "states_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Logs_States_Delete_At_Path_Input = {
  /** State snapshot (null for delete) */
  state?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Logs_States_Delete_Elem_Input = {
  /** State snapshot (null for delete) */
  state?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Logs_States_Delete_Key_Input = {
  /** State snapshot (null for delete) */
  state?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "logs.states" */
export type Logs_States_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "logs.states" */
export type Logs_States_Insert_Input = {
  /** Source column name */
  _column?: InputMaybe<Scalars["String"]["input"]>;
  /** Source record identifier */
  _id?: InputMaybe<Scalars["String"]["input"]>;
  /** Source schema name */
  _schema?: InputMaybe<Scalars["String"]["input"]>;
  /** Source table name */
  _table?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** State snapshot (null for delete) */
  state?: InputMaybe<Scalars["jsonb"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who made the change */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Logs_States_Max_Fields = {
  __typename?: "logs_states_max_fields";
  /** Source column name */
  _column?: Maybe<Scalars["String"]["output"]>;
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Source record identifier */
  _id?: Maybe<Scalars["String"]["output"]>;
  /** Source schema name */
  _schema?: Maybe<Scalars["String"]["output"]>;
  /** Source table name */
  _table?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User who made the change */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type Logs_States_Min_Fields = {
  __typename?: "logs_states_min_fields";
  /** Source column name */
  _column?: Maybe<Scalars["String"]["output"]>;
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Source record identifier */
  _id?: Maybe<Scalars["String"]["output"]>;
  /** Source schema name */
  _schema?: Maybe<Scalars["String"]["output"]>;
  /** Source table name */
  _table?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User who made the change */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "logs.states" */
export type Logs_States_Mutation_Response = {
  __typename?: "logs_states_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Logs_States>;
};

/** input type for inserting object relation for remote table "logs.states" */
export type Logs_States_Obj_Rel_Insert_Input = {
  data: Logs_States_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Logs_States_On_Conflict>;
};

/** on_conflict condition type for table "logs.states" */
export type Logs_States_On_Conflict = {
  constraint: Logs_States_Constraint;
  update_columns?: Array<Logs_States_Update_Column>;
  where?: InputMaybe<Logs_States_Bool_Exp>;
};

/** Ordering options when selecting data from "logs.states". */
export type Logs_States_Order_By = {
  _column?: InputMaybe<Order_By>;
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  _id?: InputMaybe<Order_By>;
  _schema?: InputMaybe<Order_By>;
  _table?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  state?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: logs.states */
export type Logs_States_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Logs_States_Prepend_Input = {
  /** State snapshot (null for delete) */
  state?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "logs.states" */
export enum Logs_States_Select_Column {
  /** column name */
  Column = "_column",
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  Id = "_id",
  /** column name */
  Schema = "_schema",
  /** column name */
  Table = "_table",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  State = "state",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "logs.states" */
export type Logs_States_Set_Input = {
  /** Source column name */
  _column?: InputMaybe<Scalars["String"]["input"]>;
  /** Source record identifier */
  _id?: InputMaybe<Scalars["String"]["input"]>;
  /** Source schema name */
  _schema?: InputMaybe<Scalars["String"]["input"]>;
  /** Source table name */
  _table?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** State snapshot (null for delete) */
  state?: InputMaybe<Scalars["jsonb"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who made the change */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Logs_States_Stddev_Fields = {
  __typename?: "logs_states_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Logs_States_Stddev_Pop_Fields = {
  __typename?: "logs_states_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Logs_States_Stddev_Samp_Fields = {
  __typename?: "logs_states_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "logs_states" */
export type Logs_States_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Logs_States_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Logs_States_Stream_Cursor_Value_Input = {
  /** Source column name */
  _column?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Source record identifier */
  _id?: InputMaybe<Scalars["String"]["input"]>;
  /** Source schema name */
  _schema?: InputMaybe<Scalars["String"]["input"]>;
  /** Source table name */
  _table?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** State snapshot (null for delete) */
  state?: InputMaybe<Scalars["jsonb"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who made the change */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Logs_States_Sum_Fields = {
  __typename?: "logs_states_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "logs.states" */
export enum Logs_States_Update_Column {
  /** column name */
  Column = "_column",
  /** column name */
  Id = "_id",
  /** column name */
  Schema = "_schema",
  /** column name */
  Table = "_table",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  State = "state",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Logs_States_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Logs_States_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Logs_States_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Logs_States_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Logs_States_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Logs_States_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Logs_States_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Logs_States_Set_Input>;
  /** filter the rows which have to be updated */
  where: Logs_States_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Logs_States_Var_Pop_Fields = {
  __typename?: "logs_states_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Logs_States_Var_Samp_Fields = {
  __typename?: "logs_states_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Logs_States_Variance_Fields = {
  __typename?: "logs_states_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "memberships" */
export type Memberships = {
  __typename?: "memberships";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** An object relationship */
  created_by: Users;
  /** User who created the membership record */
  created_by_id: Scalars["uuid"]["output"];
  /** An object relationship */
  group: Groups;
  /** Group id */
  group_id: Scalars["uuid"]["output"];
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** An object relationship */
  invited_by?: Maybe<Users>;
  /** User who invited (optional) */
  invited_by_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Role in group */
  role: Scalars["String"]["output"];
  /** Membership status */
  status: Scalars["String"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  /** User id */
  user_id: Scalars["uuid"]["output"];
};

/** aggregated selection of "memberships" */
export type Memberships_Aggregate = {
  __typename?: "memberships_aggregate";
  aggregate?: Maybe<Memberships_Aggregate_Fields>;
  nodes: Array<Memberships>;
};

export type Memberships_Aggregate_Bool_Exp = {
  count?: InputMaybe<Memberships_Aggregate_Bool_Exp_Count>;
};

export type Memberships_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Memberships_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Memberships_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "memberships" */
export type Memberships_Aggregate_Fields = {
  __typename?: "memberships_aggregate_fields";
  avg?: Maybe<Memberships_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Memberships_Max_Fields>;
  min?: Maybe<Memberships_Min_Fields>;
  stddev?: Maybe<Memberships_Stddev_Fields>;
  stddev_pop?: Maybe<Memberships_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Memberships_Stddev_Samp_Fields>;
  sum?: Maybe<Memberships_Sum_Fields>;
  var_pop?: Maybe<Memberships_Var_Pop_Fields>;
  var_samp?: Maybe<Memberships_Var_Samp_Fields>;
  variance?: Maybe<Memberships_Variance_Fields>;
};

/** aggregate fields of "memberships" */
export type Memberships_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Memberships_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "memberships" */
export type Memberships_Aggregate_Order_By = {
  avg?: InputMaybe<Memberships_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Memberships_Max_Order_By>;
  min?: InputMaybe<Memberships_Min_Order_By>;
  stddev?: InputMaybe<Memberships_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Memberships_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Memberships_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Memberships_Sum_Order_By>;
  var_pop?: InputMaybe<Memberships_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Memberships_Var_Samp_Order_By>;
  variance?: InputMaybe<Memberships_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "memberships" */
export type Memberships_Arr_Rel_Insert_Input = {
  data: Array<Memberships_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Memberships_On_Conflict>;
};

/** aggregate avg on columns */
export type Memberships_Avg_Fields = {
  __typename?: "memberships_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "memberships" */
export type Memberships_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "memberships". All fields are combined with a logical 'AND'. */
export type Memberships_Bool_Exp = {
  _and?: InputMaybe<Array<Memberships_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Memberships_Bool_Exp>;
  _or?: InputMaybe<Array<Memberships_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  created_by?: InputMaybe<Users_Bool_Exp>;
  created_by_id?: InputMaybe<Uuid_Comparison_Exp>;
  group?: InputMaybe<Groups_Bool_Exp>;
  group_id?: InputMaybe<Uuid_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  invited_by?: InputMaybe<Users_Bool_Exp>;
  invited_by_id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "memberships" */
export enum Memberships_Constraint {
  /** unique or primary key constraint on columns "id" */
  MembershipsPkey = "memberships_pkey",
}

/** input type for incrementing numeric columns in table "memberships" */
export type Memberships_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "memberships" */
export type Memberships_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  created_by?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** User who created the membership record */
  created_by_id?: InputMaybe<Scalars["uuid"]["input"]>;
  group?: InputMaybe<Groups_Obj_Rel_Insert_Input>;
  /** Group id */
  group_id?: InputMaybe<Scalars["uuid"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  invited_by?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** User who invited (optional) */
  invited_by_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Role in group */
  role?: InputMaybe<Scalars["String"]["input"]>;
  /** Membership status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** User id */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Memberships_Max_Fields = {
  __typename?: "memberships_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User who created the membership record */
  created_by_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Group id */
  group_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** User who invited (optional) */
  invited_by_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Role in group */
  role?: Maybe<Scalars["String"]["output"]>;
  /** Membership status */
  status?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User id */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "memberships" */
export type Memberships_Max_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** User who created the membership record */
  created_by_id?: InputMaybe<Order_By>;
  /** Group id */
  group_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** User who invited (optional) */
  invited_by_id?: InputMaybe<Order_By>;
  /** Role in group */
  role?: InputMaybe<Order_By>;
  /** Membership status */
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** User id */
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Memberships_Min_Fields = {
  __typename?: "memberships_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User who created the membership record */
  created_by_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Group id */
  group_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** User who invited (optional) */
  invited_by_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Role in group */
  role?: Maybe<Scalars["String"]["output"]>;
  /** Membership status */
  status?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User id */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "memberships" */
export type Memberships_Min_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** User who created the membership record */
  created_by_id?: InputMaybe<Order_By>;
  /** Group id */
  group_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** User who invited (optional) */
  invited_by_id?: InputMaybe<Order_By>;
  /** Role in group */
  role?: InputMaybe<Order_By>;
  /** Membership status */
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** User id */
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "memberships" */
export type Memberships_Mutation_Response = {
  __typename?: "memberships_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Memberships>;
};

/** input type for inserting object relation for remote table "memberships" */
export type Memberships_Obj_Rel_Insert_Input = {
  data: Memberships_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Memberships_On_Conflict>;
};

/** on_conflict condition type for table "memberships" */
export type Memberships_On_Conflict = {
  constraint: Memberships_Constraint;
  update_columns?: Array<Memberships_Update_Column>;
  where?: InputMaybe<Memberships_Bool_Exp>;
};

/** Ordering options when selecting data from "memberships". */
export type Memberships_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Users_Order_By>;
  created_by_id?: InputMaybe<Order_By>;
  group?: InputMaybe<Groups_Order_By>;
  group_id?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  invited_by?: InputMaybe<Users_Order_By>;
  invited_by_id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: memberships */
export type Memberships_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "memberships" */
export enum Memberships_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CreatedById = "created_by_id",
  /** column name */
  GroupId = "group_id",
  /** column name */
  Id = "id",
  /** column name */
  InvitedById = "invited_by_id",
  /** column name */
  Role = "role",
  /** column name */
  Status = "status",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "memberships" */
export type Memberships_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who created the membership record */
  created_by_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Group id */
  group_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** User who invited (optional) */
  invited_by_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Role in group */
  role?: InputMaybe<Scalars["String"]["input"]>;
  /** Membership status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User id */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Memberships_Stddev_Fields = {
  __typename?: "memberships_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "memberships" */
export type Memberships_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Memberships_Stddev_Pop_Fields = {
  __typename?: "memberships_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "memberships" */
export type Memberships_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Memberships_Stddev_Samp_Fields = {
  __typename?: "memberships_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "memberships" */
export type Memberships_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "memberships" */
export type Memberships_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Memberships_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Memberships_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who created the membership record */
  created_by_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Group id */
  group_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** User who invited (optional) */
  invited_by_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Role in group */
  role?: InputMaybe<Scalars["String"]["input"]>;
  /** Membership status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User id */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Memberships_Sum_Fields = {
  __typename?: "memberships_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "memberships" */
export type Memberships_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "memberships" */
export enum Memberships_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CreatedById = "created_by_id",
  /** column name */
  GroupId = "group_id",
  /** column name */
  Id = "id",
  /** column name */
  InvitedById = "invited_by_id",
  /** column name */
  Role = "role",
  /** column name */
  Status = "status",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Memberships_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Memberships_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Memberships_Set_Input>;
  /** filter the rows which have to be updated */
  where: Memberships_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Memberships_Var_Pop_Fields = {
  __typename?: "memberships_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "memberships" */
export type Memberships_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Memberships_Var_Samp_Fields = {
  __typename?: "memberships_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "memberships" */
export type Memberships_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Memberships_Variance_Fields = {
  __typename?: "memberships_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "memberships" */
export type Memberships_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "message_reads" */
export type Message_Reads = {
  __typename?: "message_reads";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  last_i: Scalars["bigint"]["output"];
  room_id: Scalars["uuid"]["output"];
  updated_at: Scalars["bigint"]["output"];
  user_id: Scalars["uuid"]["output"];
};

/** aggregated selection of "message_reads" */
export type Message_Reads_Aggregate = {
  __typename?: "message_reads_aggregate";
  aggregate?: Maybe<Message_Reads_Aggregate_Fields>;
  nodes: Array<Message_Reads>;
};

/** aggregate fields of "message_reads" */
export type Message_Reads_Aggregate_Fields = {
  __typename?: "message_reads_aggregate_fields";
  avg?: Maybe<Message_Reads_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Message_Reads_Max_Fields>;
  min?: Maybe<Message_Reads_Min_Fields>;
  stddev?: Maybe<Message_Reads_Stddev_Fields>;
  stddev_pop?: Maybe<Message_Reads_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Message_Reads_Stddev_Samp_Fields>;
  sum?: Maybe<Message_Reads_Sum_Fields>;
  var_pop?: Maybe<Message_Reads_Var_Pop_Fields>;
  var_samp?: Maybe<Message_Reads_Var_Samp_Fields>;
  variance?: Maybe<Message_Reads_Variance_Fields>;
};

/** aggregate fields of "message_reads" */
export type Message_Reads_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Message_Reads_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Message_Reads_Avg_Fields = {
  __typename?: "message_reads_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  last_i?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "message_reads". All fields are combined with a logical 'AND'. */
export type Message_Reads_Bool_Exp = {
  _and?: InputMaybe<Array<Message_Reads_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Message_Reads_Bool_Exp>;
  _or?: InputMaybe<Array<Message_Reads_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  last_i?: InputMaybe<Bigint_Comparison_Exp>;
  room_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "message_reads" */
export enum Message_Reads_Constraint {
  /** unique or primary key constraint on columns "id" */
  MessageReadsPkey = "message_reads_pkey",
  /** unique or primary key constraint on columns "user_id", "room_id" */
  UniqueUserRoom = "unique_user_room",
}

/** input type for incrementing numeric columns in table "message_reads" */
export type Message_Reads_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  last_i?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "message_reads" */
export type Message_Reads_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  last_i?: InputMaybe<Scalars["bigint"]["input"]>;
  room_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Message_Reads_Max_Fields = {
  __typename?: "message_reads_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  last_i?: Maybe<Scalars["bigint"]["output"]>;
  room_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type Message_Reads_Min_Fields = {
  __typename?: "message_reads_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  last_i?: Maybe<Scalars["bigint"]["output"]>;
  room_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "message_reads" */
export type Message_Reads_Mutation_Response = {
  __typename?: "message_reads_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Message_Reads>;
};

/** input type for inserting object relation for remote table "message_reads" */
export type Message_Reads_Obj_Rel_Insert_Input = {
  data: Message_Reads_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Message_Reads_On_Conflict>;
};

/** on_conflict condition type for table "message_reads" */
export type Message_Reads_On_Conflict = {
  constraint: Message_Reads_Constraint;
  update_columns?: Array<Message_Reads_Update_Column>;
  where?: InputMaybe<Message_Reads_Bool_Exp>;
};

/** Ordering options when selecting data from "message_reads". */
export type Message_Reads_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  last_i?: InputMaybe<Order_By>;
  room_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: message_reads */
export type Message_Reads_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "message_reads" */
export enum Message_Reads_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  LastI = "last_i",
  /** column name */
  RoomId = "room_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "message_reads" */
export type Message_Reads_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  last_i?: InputMaybe<Scalars["bigint"]["input"]>;
  room_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Message_Reads_Stddev_Fields = {
  __typename?: "message_reads_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  last_i?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Message_Reads_Stddev_Pop_Fields = {
  __typename?: "message_reads_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  last_i?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Message_Reads_Stddev_Samp_Fields = {
  __typename?: "message_reads_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  last_i?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "message_reads" */
export type Message_Reads_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Message_Reads_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Message_Reads_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  last_i?: InputMaybe<Scalars["bigint"]["input"]>;
  room_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Message_Reads_Sum_Fields = {
  __typename?: "message_reads_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  last_i?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "message_reads" */
export enum Message_Reads_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  LastI = "last_i",
  /** column name */
  RoomId = "room_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Message_Reads_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Message_Reads_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Message_Reads_Set_Input>;
  /** filter the rows which have to be updated */
  where: Message_Reads_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Message_Reads_Var_Pop_Fields = {
  __typename?: "message_reads_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  last_i?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Message_Reads_Var_Samp_Fields = {
  __typename?: "message_reads_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  last_i?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Message_Reads_Variance_Fields = {
  __typename?: "message_reads_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  last_i?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "messages" */
export type Messages = {
  __typename?: "messages";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  i: Scalars["bigint"]["output"];
  id: Scalars["uuid"]["output"];
  /** An array relationship */
  replies: Array<Replies>;
  /** An aggregate relationship */
  replies_aggregate: Replies_Aggregate;
  updated_at: Scalars["bigint"]["output"];
  user_id?: Maybe<Scalars["uuid"]["output"]>;
  value?: Maybe<Scalars["String"]["output"]>;
};

/** columns and relationships of "messages" */
export type MessagesRepliesArgs = {
  distinct_on?: InputMaybe<Array<Replies_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Replies_Order_By>>;
  where?: InputMaybe<Replies_Bool_Exp>;
};

/** columns and relationships of "messages" */
export type MessagesReplies_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Replies_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Replies_Order_By>>;
  where?: InputMaybe<Replies_Bool_Exp>;
};

/** aggregated selection of "messages" */
export type Messages_Aggregate = {
  __typename?: "messages_aggregate";
  aggregate?: Maybe<Messages_Aggregate_Fields>;
  nodes: Array<Messages>;
};

/** aggregate fields of "messages" */
export type Messages_Aggregate_Fields = {
  __typename?: "messages_aggregate_fields";
  avg?: Maybe<Messages_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Messages_Max_Fields>;
  min?: Maybe<Messages_Min_Fields>;
  stddev?: Maybe<Messages_Stddev_Fields>;
  stddev_pop?: Maybe<Messages_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Messages_Stddev_Samp_Fields>;
  sum?: Maybe<Messages_Sum_Fields>;
  var_pop?: Maybe<Messages_Var_Pop_Fields>;
  var_samp?: Maybe<Messages_Var_Samp_Fields>;
  variance?: Maybe<Messages_Variance_Fields>;
};

/** aggregate fields of "messages" */
export type Messages_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Messages_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Messages_Avg_Fields = {
  __typename?: "messages_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  i?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "messages". All fields are combined with a logical 'AND'. */
export type Messages_Bool_Exp = {
  _and?: InputMaybe<Array<Messages_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Messages_Bool_Exp>;
  _or?: InputMaybe<Array<Messages_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  i?: InputMaybe<Bigint_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  replies?: InputMaybe<Replies_Bool_Exp>;
  replies_aggregate?: InputMaybe<Replies_Aggregate_Bool_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "messages" */
export enum Messages_Constraint {
  /** unique or primary key constraint on columns "id" */
  MessagesPkey = "messages_pkey",
}

/** input type for incrementing numeric columns in table "messages" */
export type Messages_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  i?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "messages" */
export type Messages_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  i?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  replies?: InputMaybe<Replies_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  value?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Messages_Max_Fields = {
  __typename?: "messages_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  i?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
  value?: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type Messages_Min_Fields = {
  __typename?: "messages_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  i?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
  value?: Maybe<Scalars["String"]["output"]>;
};

/** response of any mutation on the table "messages" */
export type Messages_Mutation_Response = {
  __typename?: "messages_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Messages>;
};

/** input type for inserting object relation for remote table "messages" */
export type Messages_Obj_Rel_Insert_Input = {
  data: Messages_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Messages_On_Conflict>;
};

/** on_conflict condition type for table "messages" */
export type Messages_On_Conflict = {
  constraint: Messages_Constraint;
  update_columns?: Array<Messages_Update_Column>;
  where?: InputMaybe<Messages_Bool_Exp>;
};

/** Ordering options when selecting data from "messages". */
export type Messages_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  i?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  replies_aggregate?: InputMaybe<Replies_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: messages */
export type Messages_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "messages" */
export enum Messages_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  I = "i",
  /** column name */
  Id = "id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
  /** column name */
  Value = "value",
}

/** input type for updating data in table "messages" */
export type Messages_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  i?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  value?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate stddev on columns */
export type Messages_Stddev_Fields = {
  __typename?: "messages_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  i?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Messages_Stddev_Pop_Fields = {
  __typename?: "messages_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  i?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Messages_Stddev_Samp_Fields = {
  __typename?: "messages_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  i?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "messages" */
export type Messages_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Messages_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Messages_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  i?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  value?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate sum on columns */
export type Messages_Sum_Fields = {
  __typename?: "messages_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  i?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "messages" */
export enum Messages_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  I = "i",
  /** column name */
  Id = "id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
  /** column name */
  Value = "value",
}

export type Messages_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Messages_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Messages_Set_Input>;
  /** filter the rows which have to be updated */
  where: Messages_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Messages_Var_Pop_Fields = {
  __typename?: "messages_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  i?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Messages_Var_Samp_Fields = {
  __typename?: "messages_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  i?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Messages_Variance_Fields = {
  __typename?: "messages_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  i?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: "mutation_root";
  /** delete single row from the table: "storage.buckets" */
  deleteBucket?: Maybe<Buckets>;
  /** delete data from the table: "storage.buckets" */
  deleteBuckets?: Maybe<Buckets_Mutation_Response>;
  /** delete single row from the table: "storage.files" */
  deleteFile?: Maybe<Files>;
  /** delete data from the table: "storage.files" */
  deleteFiles?: Maybe<Files_Mutation_Response>;
  /** delete single row from the table: "storage.virus" */
  deleteVirus?: Maybe<Virus>;
  /** delete data from the table: "storage.virus" */
  deleteViruses?: Maybe<Virus_Mutation_Response>;
  /** delete data from the table: "accounts" */
  delete_accounts?: Maybe<Accounts_Mutation_Response>;
  /** delete single row from the table: "accounts" */
  delete_accounts_by_pk?: Maybe<Accounts>;
  /** delete data from the table: "auth_jwt" */
  delete_auth_jwt?: Maybe<Auth_Jwt_Mutation_Response>;
  /** delete single row from the table: "auth_jwt" */
  delete_auth_jwt_by_pk?: Maybe<Auth_Jwt>;
  /** delete data from the table: "debug" */
  delete_debug?: Maybe<Debug_Mutation_Response>;
  /** delete single row from the table: "debug" */
  delete_debug_by_pk?: Maybe<Debug>;
  /** delete data from the table: "events" */
  delete_events?: Maybe<Events_Mutation_Response>;
  /** delete single row from the table: "events" */
  delete_events_by_pk?: Maybe<Events>;
  /** delete data from the table: "geo.features" */
  delete_geo_features?: Maybe<Geo_Features_Mutation_Response>;
  /** delete single row from the table: "geo.features" */
  delete_geo_features_by_pk?: Maybe<Geo_Features>;
  /** delete data from the table: "github_issues" */
  delete_github_issues?: Maybe<Github_Issues_Mutation_Response>;
  /** delete single row from the table: "github_issues" */
  delete_github_issues_by_pk?: Maybe<Github_Issues>;
  /** delete data from the table: "groups" */
  delete_groups?: Maybe<Groups_Mutation_Response>;
  /** delete single row from the table: "groups" */
  delete_groups_by_pk?: Maybe<Groups>;
  /** delete data from the table: "invitations" */
  delete_invitations?: Maybe<Invitations_Mutation_Response>;
  /** delete single row from the table: "invitations" */
  delete_invitations_by_pk?: Maybe<Invitations>;
  /** delete data from the table: "invited" */
  delete_invited?: Maybe<Invited_Mutation_Response>;
  /** delete single row from the table: "invited" */
  delete_invited_by_pk?: Maybe<Invited>;
  /** delete data from the table: "invites" */
  delete_invites?: Maybe<Invites_Mutation_Response>;
  /** delete single row from the table: "invites" */
  delete_invites_by_pk?: Maybe<Invites>;
  /** delete data from the table: "logs.diffs" */
  delete_logs_diffs?: Maybe<Logs_Diffs_Mutation_Response>;
  /** delete single row from the table: "logs.diffs" */
  delete_logs_diffs_by_pk?: Maybe<Logs_Diffs>;
  /** delete data from the table: "logs.states" */
  delete_logs_states?: Maybe<Logs_States_Mutation_Response>;
  /** delete single row from the table: "logs.states" */
  delete_logs_states_by_pk?: Maybe<Logs_States>;
  /** delete data from the table: "memberships" */
  delete_memberships?: Maybe<Memberships_Mutation_Response>;
  /** delete single row from the table: "memberships" */
  delete_memberships_by_pk?: Maybe<Memberships>;
  /** delete data from the table: "message_reads" */
  delete_message_reads?: Maybe<Message_Reads_Mutation_Response>;
  /** delete single row from the table: "message_reads" */
  delete_message_reads_by_pk?: Maybe<Message_Reads>;
  /** delete data from the table: "messages" */
  delete_messages?: Maybe<Messages_Mutation_Response>;
  /** delete single row from the table: "messages" */
  delete_messages_by_pk?: Maybe<Messages>;
  /** delete data from the table: "notification_messages" */
  delete_notification_messages?: Maybe<Notification_Messages_Mutation_Response>;
  /** delete single row from the table: "notification_messages" */
  delete_notification_messages_by_pk?: Maybe<Notification_Messages>;
  /** delete data from the table: "notification_permissions" */
  delete_notification_permissions?: Maybe<Notification_Permissions_Mutation_Response>;
  /** delete single row from the table: "notification_permissions" */
  delete_notification_permissions_by_pk?: Maybe<Notification_Permissions>;
  /** delete data from the table: "notifications" */
  delete_notifications?: Maybe<Notifications_Mutation_Response>;
  /** delete single row from the table: "notifications" */
  delete_notifications_by_pk?: Maybe<Notifications>;
  /** delete data from the table: "payments.methods" */
  delete_payments_methods?: Maybe<Payments_Methods_Mutation_Response>;
  /** delete single row from the table: "payments.methods" */
  delete_payments_methods_by_pk?: Maybe<Payments_Methods>;
  /** delete data from the table: "payments.operations" */
  delete_payments_operations?: Maybe<Payments_Operations_Mutation_Response>;
  /** delete single row from the table: "payments.operations" */
  delete_payments_operations_by_pk?: Maybe<Payments_Operations>;
  /** delete data from the table: "payments.plans" */
  delete_payments_plans?: Maybe<Payments_Plans_Mutation_Response>;
  /** delete single row from the table: "payments.plans" */
  delete_payments_plans_by_pk?: Maybe<Payments_Plans>;
  /** delete data from the table: "payments.providers" */
  delete_payments_providers?: Maybe<Payments_Providers_Mutation_Response>;
  /** delete single row from the table: "payments.providers" */
  delete_payments_providers_by_pk?: Maybe<Payments_Providers>;
  /** delete data from the table: "payments.subscriptions" */
  delete_payments_subscriptions?: Maybe<Payments_Subscriptions_Mutation_Response>;
  /** delete single row from the table: "payments.subscriptions" */
  delete_payments_subscriptions_by_pk?: Maybe<Payments_Subscriptions>;
  /** delete data from the table: "payments.user_payment_provider_mappings" */
  delete_payments_user_payment_provider_mappings?: Maybe<Payments_User_Payment_Provider_Mappings_Mutation_Response>;
  /** delete single row from the table: "payments.user_payment_provider_mappings" */
  delete_payments_user_payment_provider_mappings_by_pk?: Maybe<Payments_User_Payment_Provider_Mappings>;
  /** delete data from the table: "replies" */
  delete_replies?: Maybe<Replies_Mutation_Response>;
  /** delete single row from the table: "replies" */
  delete_replies_by_pk?: Maybe<Replies>;
  /** delete data from the table: "rooms" */
  delete_rooms?: Maybe<Rooms_Mutation_Response>;
  /** delete single row from the table: "rooms" */
  delete_rooms_by_pk?: Maybe<Rooms>;
  /** delete data from the table: "schedule" */
  delete_schedule?: Maybe<Schedule_Mutation_Response>;
  /** delete single row from the table: "schedule" */
  delete_schedule_by_pk?: Maybe<Schedule>;
  /** delete data from the table: "users" */
  delete_users?: Maybe<Users_Mutation_Response>;
  /** delete single row from the table: "users" */
  delete_users_by_pk?: Maybe<Users>;
  /** delete data from the table: "verification_codes" */
  delete_verification_codes?: Maybe<Verification_Codes_Mutation_Response>;
  /** delete single row from the table: "verification_codes" */
  delete_verification_codes_by_pk?: Maybe<Verification_Codes>;
  /** insert a single row into the table: "storage.buckets" */
  insertBucket?: Maybe<Buckets>;
  /** insert data into the table: "storage.buckets" */
  insertBuckets?: Maybe<Buckets_Mutation_Response>;
  /** insert a single row into the table: "storage.files" */
  insertFile?: Maybe<Files>;
  /** insert data into the table: "storage.files" */
  insertFiles?: Maybe<Files_Mutation_Response>;
  /** insert a single row into the table: "storage.virus" */
  insertVirus?: Maybe<Virus>;
  /** insert data into the table: "storage.virus" */
  insertViruses?: Maybe<Virus_Mutation_Response>;
  /** insert data into the table: "accounts" */
  insert_accounts?: Maybe<Accounts_Mutation_Response>;
  /** insert a single row into the table: "accounts" */
  insert_accounts_one?: Maybe<Accounts>;
  /** insert data into the table: "auth_jwt" */
  insert_auth_jwt?: Maybe<Auth_Jwt_Mutation_Response>;
  /** insert a single row into the table: "auth_jwt" */
  insert_auth_jwt_one?: Maybe<Auth_Jwt>;
  /** insert data into the table: "debug" */
  insert_debug?: Maybe<Debug_Mutation_Response>;
  /** insert a single row into the table: "debug" */
  insert_debug_one?: Maybe<Debug>;
  /** insert data into the table: "events" */
  insert_events?: Maybe<Events_Mutation_Response>;
  /** insert a single row into the table: "events" */
  insert_events_one?: Maybe<Events>;
  /** insert data into the table: "geo.features" */
  insert_geo_features?: Maybe<Geo_Features_Mutation_Response>;
  /** insert a single row into the table: "geo.features" */
  insert_geo_features_one?: Maybe<Geo_Features>;
  /** insert data into the table: "github_issues" */
  insert_github_issues?: Maybe<Github_Issues_Mutation_Response>;
  /** insert a single row into the table: "github_issues" */
  insert_github_issues_one?: Maybe<Github_Issues>;
  /** insert data into the table: "groups" */
  insert_groups?: Maybe<Groups_Mutation_Response>;
  /** insert a single row into the table: "groups" */
  insert_groups_one?: Maybe<Groups>;
  /** insert data into the table: "invitations" */
  insert_invitations?: Maybe<Invitations_Mutation_Response>;
  /** insert a single row into the table: "invitations" */
  insert_invitations_one?: Maybe<Invitations>;
  /** insert data into the table: "invited" */
  insert_invited?: Maybe<Invited_Mutation_Response>;
  /** insert a single row into the table: "invited" */
  insert_invited_one?: Maybe<Invited>;
  /** insert data into the table: "invites" */
  insert_invites?: Maybe<Invites_Mutation_Response>;
  /** insert a single row into the table: "invites" */
  insert_invites_one?: Maybe<Invites>;
  /** insert data into the table: "logs.diffs" */
  insert_logs_diffs?: Maybe<Logs_Diffs_Mutation_Response>;
  /** insert a single row into the table: "logs.diffs" */
  insert_logs_diffs_one?: Maybe<Logs_Diffs>;
  /** insert data into the table: "logs.states" */
  insert_logs_states?: Maybe<Logs_States_Mutation_Response>;
  /** insert a single row into the table: "logs.states" */
  insert_logs_states_one?: Maybe<Logs_States>;
  /** insert data into the table: "memberships" */
  insert_memberships?: Maybe<Memberships_Mutation_Response>;
  /** insert a single row into the table: "memberships" */
  insert_memberships_one?: Maybe<Memberships>;
  /** insert data into the table: "message_reads" */
  insert_message_reads?: Maybe<Message_Reads_Mutation_Response>;
  /** insert a single row into the table: "message_reads" */
  insert_message_reads_one?: Maybe<Message_Reads>;
  /** insert data into the table: "messages" */
  insert_messages?: Maybe<Messages_Mutation_Response>;
  /** insert a single row into the table: "messages" */
  insert_messages_one?: Maybe<Messages>;
  /** insert data into the table: "notification_messages" */
  insert_notification_messages?: Maybe<Notification_Messages_Mutation_Response>;
  /** insert a single row into the table: "notification_messages" */
  insert_notification_messages_one?: Maybe<Notification_Messages>;
  /** insert data into the table: "notification_permissions" */
  insert_notification_permissions?: Maybe<Notification_Permissions_Mutation_Response>;
  /** insert a single row into the table: "notification_permissions" */
  insert_notification_permissions_one?: Maybe<Notification_Permissions>;
  /** insert data into the table: "notifications" */
  insert_notifications?: Maybe<Notifications_Mutation_Response>;
  /** insert a single row into the table: "notifications" */
  insert_notifications_one?: Maybe<Notifications>;
  /** insert data into the table: "payments.methods" */
  insert_payments_methods?: Maybe<Payments_Methods_Mutation_Response>;
  /** insert a single row into the table: "payments.methods" */
  insert_payments_methods_one?: Maybe<Payments_Methods>;
  /** insert data into the table: "payments.operations" */
  insert_payments_operations?: Maybe<Payments_Operations_Mutation_Response>;
  /** insert a single row into the table: "payments.operations" */
  insert_payments_operations_one?: Maybe<Payments_Operations>;
  /** insert data into the table: "payments.plans" */
  insert_payments_plans?: Maybe<Payments_Plans_Mutation_Response>;
  /** insert a single row into the table: "payments.plans" */
  insert_payments_plans_one?: Maybe<Payments_Plans>;
  /** insert data into the table: "payments.providers" */
  insert_payments_providers?: Maybe<Payments_Providers_Mutation_Response>;
  /** insert a single row into the table: "payments.providers" */
  insert_payments_providers_one?: Maybe<Payments_Providers>;
  /** insert data into the table: "payments.subscriptions" */
  insert_payments_subscriptions?: Maybe<Payments_Subscriptions_Mutation_Response>;
  /** insert a single row into the table: "payments.subscriptions" */
  insert_payments_subscriptions_one?: Maybe<Payments_Subscriptions>;
  /** insert data into the table: "payments.user_payment_provider_mappings" */
  insert_payments_user_payment_provider_mappings?: Maybe<Payments_User_Payment_Provider_Mappings_Mutation_Response>;
  /** insert a single row into the table: "payments.user_payment_provider_mappings" */
  insert_payments_user_payment_provider_mappings_one?: Maybe<Payments_User_Payment_Provider_Mappings>;
  /** insert data into the table: "replies" */
  insert_replies?: Maybe<Replies_Mutation_Response>;
  /** insert a single row into the table: "replies" */
  insert_replies_one?: Maybe<Replies>;
  /** insert data into the table: "rooms" */
  insert_rooms?: Maybe<Rooms_Mutation_Response>;
  /** insert a single row into the table: "rooms" */
  insert_rooms_one?: Maybe<Rooms>;
  /** insert data into the table: "schedule" */
  insert_schedule?: Maybe<Schedule_Mutation_Response>;
  /** insert a single row into the table: "schedule" */
  insert_schedule_one?: Maybe<Schedule>;
  /** insert data into the table: "users" */
  insert_users?: Maybe<Users_Mutation_Response>;
  /** insert a single row into the table: "users" */
  insert_users_one?: Maybe<Users>;
  /** insert data into the table: "verification_codes" */
  insert_verification_codes?: Maybe<Verification_Codes_Mutation_Response>;
  /** insert a single row into the table: "verification_codes" */
  insert_verification_codes_one?: Maybe<Verification_Codes>;
  /** update single row of the table: "storage.buckets" */
  updateBucket?: Maybe<Buckets>;
  /** update data of the table: "storage.buckets" */
  updateBuckets?: Maybe<Buckets_Mutation_Response>;
  /** update single row of the table: "storage.files" */
  updateFile?: Maybe<Files>;
  /** update data of the table: "storage.files" */
  updateFiles?: Maybe<Files_Mutation_Response>;
  /** update single row of the table: "storage.virus" */
  updateVirus?: Maybe<Virus>;
  /** update data of the table: "storage.virus" */
  updateViruses?: Maybe<Virus_Mutation_Response>;
  /** update data of the table: "accounts" */
  update_accounts?: Maybe<Accounts_Mutation_Response>;
  /** update single row of the table: "accounts" */
  update_accounts_by_pk?: Maybe<Accounts>;
  /** update multiples rows of table: "accounts" */
  update_accounts_many?: Maybe<Array<Maybe<Accounts_Mutation_Response>>>;
  /** update data of the table: "auth_jwt" */
  update_auth_jwt?: Maybe<Auth_Jwt_Mutation_Response>;
  /** update single row of the table: "auth_jwt" */
  update_auth_jwt_by_pk?: Maybe<Auth_Jwt>;
  /** update multiples rows of table: "auth_jwt" */
  update_auth_jwt_many?: Maybe<Array<Maybe<Auth_Jwt_Mutation_Response>>>;
  /** update multiples rows of table: "storage.buckets" */
  update_buckets_many?: Maybe<Array<Maybe<Buckets_Mutation_Response>>>;
  /** update data of the table: "debug" */
  update_debug?: Maybe<Debug_Mutation_Response>;
  /** update single row of the table: "debug" */
  update_debug_by_pk?: Maybe<Debug>;
  /** update multiples rows of table: "debug" */
  update_debug_many?: Maybe<Array<Maybe<Debug_Mutation_Response>>>;
  /** update data of the table: "events" */
  update_events?: Maybe<Events_Mutation_Response>;
  /** update single row of the table: "events" */
  update_events_by_pk?: Maybe<Events>;
  /** update multiples rows of table: "events" */
  update_events_many?: Maybe<Array<Maybe<Events_Mutation_Response>>>;
  /** update multiples rows of table: "storage.files" */
  update_files_many?: Maybe<Array<Maybe<Files_Mutation_Response>>>;
  /** update data of the table: "geo.features" */
  update_geo_features?: Maybe<Geo_Features_Mutation_Response>;
  /** update single row of the table: "geo.features" */
  update_geo_features_by_pk?: Maybe<Geo_Features>;
  /** update multiples rows of table: "geo.features" */
  update_geo_features_many?: Maybe<
    Array<Maybe<Geo_Features_Mutation_Response>>
  >;
  /** update data of the table: "github_issues" */
  update_github_issues?: Maybe<Github_Issues_Mutation_Response>;
  /** update single row of the table: "github_issues" */
  update_github_issues_by_pk?: Maybe<Github_Issues>;
  /** update multiples rows of table: "github_issues" */
  update_github_issues_many?: Maybe<
    Array<Maybe<Github_Issues_Mutation_Response>>
  >;
  /** update data of the table: "groups" */
  update_groups?: Maybe<Groups_Mutation_Response>;
  /** update single row of the table: "groups" */
  update_groups_by_pk?: Maybe<Groups>;
  /** update multiples rows of table: "groups" */
  update_groups_many?: Maybe<Array<Maybe<Groups_Mutation_Response>>>;
  /** update data of the table: "invitations" */
  update_invitations?: Maybe<Invitations_Mutation_Response>;
  /** update single row of the table: "invitations" */
  update_invitations_by_pk?: Maybe<Invitations>;
  /** update multiples rows of table: "invitations" */
  update_invitations_many?: Maybe<Array<Maybe<Invitations_Mutation_Response>>>;
  /** update data of the table: "invited" */
  update_invited?: Maybe<Invited_Mutation_Response>;
  /** update single row of the table: "invited" */
  update_invited_by_pk?: Maybe<Invited>;
  /** update multiples rows of table: "invited" */
  update_invited_many?: Maybe<Array<Maybe<Invited_Mutation_Response>>>;
  /** update data of the table: "invites" */
  update_invites?: Maybe<Invites_Mutation_Response>;
  /** update single row of the table: "invites" */
  update_invites_by_pk?: Maybe<Invites>;
  /** update multiples rows of table: "invites" */
  update_invites_many?: Maybe<Array<Maybe<Invites_Mutation_Response>>>;
  /** update data of the table: "logs.diffs" */
  update_logs_diffs?: Maybe<Logs_Diffs_Mutation_Response>;
  /** update single row of the table: "logs.diffs" */
  update_logs_diffs_by_pk?: Maybe<Logs_Diffs>;
  /** update multiples rows of table: "logs.diffs" */
  update_logs_diffs_many?: Maybe<Array<Maybe<Logs_Diffs_Mutation_Response>>>;
  /** update data of the table: "logs.states" */
  update_logs_states?: Maybe<Logs_States_Mutation_Response>;
  /** update single row of the table: "logs.states" */
  update_logs_states_by_pk?: Maybe<Logs_States>;
  /** update multiples rows of table: "logs.states" */
  update_logs_states_many?: Maybe<Array<Maybe<Logs_States_Mutation_Response>>>;
  /** update data of the table: "memberships" */
  update_memberships?: Maybe<Memberships_Mutation_Response>;
  /** update single row of the table: "memberships" */
  update_memberships_by_pk?: Maybe<Memberships>;
  /** update multiples rows of table: "memberships" */
  update_memberships_many?: Maybe<Array<Maybe<Memberships_Mutation_Response>>>;
  /** update data of the table: "message_reads" */
  update_message_reads?: Maybe<Message_Reads_Mutation_Response>;
  /** update single row of the table: "message_reads" */
  update_message_reads_by_pk?: Maybe<Message_Reads>;
  /** update multiples rows of table: "message_reads" */
  update_message_reads_many?: Maybe<
    Array<Maybe<Message_Reads_Mutation_Response>>
  >;
  /** update data of the table: "messages" */
  update_messages?: Maybe<Messages_Mutation_Response>;
  /** update single row of the table: "messages" */
  update_messages_by_pk?: Maybe<Messages>;
  /** update multiples rows of table: "messages" */
  update_messages_many?: Maybe<Array<Maybe<Messages_Mutation_Response>>>;
  /** update data of the table: "notification_messages" */
  update_notification_messages?: Maybe<Notification_Messages_Mutation_Response>;
  /** update single row of the table: "notification_messages" */
  update_notification_messages_by_pk?: Maybe<Notification_Messages>;
  /** update multiples rows of table: "notification_messages" */
  update_notification_messages_many?: Maybe<
    Array<Maybe<Notification_Messages_Mutation_Response>>
  >;
  /** update data of the table: "notification_permissions" */
  update_notification_permissions?: Maybe<Notification_Permissions_Mutation_Response>;
  /** update single row of the table: "notification_permissions" */
  update_notification_permissions_by_pk?: Maybe<Notification_Permissions>;
  /** update multiples rows of table: "notification_permissions" */
  update_notification_permissions_many?: Maybe<
    Array<Maybe<Notification_Permissions_Mutation_Response>>
  >;
  /** update data of the table: "notifications" */
  update_notifications?: Maybe<Notifications_Mutation_Response>;
  /** update single row of the table: "notifications" */
  update_notifications_by_pk?: Maybe<Notifications>;
  /** update multiples rows of table: "notifications" */
  update_notifications_many?: Maybe<
    Array<Maybe<Notifications_Mutation_Response>>
  >;
  /** update data of the table: "payments.methods" */
  update_payments_methods?: Maybe<Payments_Methods_Mutation_Response>;
  /** update single row of the table: "payments.methods" */
  update_payments_methods_by_pk?: Maybe<Payments_Methods>;
  /** update multiples rows of table: "payments.methods" */
  update_payments_methods_many?: Maybe<
    Array<Maybe<Payments_Methods_Mutation_Response>>
  >;
  /** update data of the table: "payments.operations" */
  update_payments_operations?: Maybe<Payments_Operations_Mutation_Response>;
  /** update single row of the table: "payments.operations" */
  update_payments_operations_by_pk?: Maybe<Payments_Operations>;
  /** update multiples rows of table: "payments.operations" */
  update_payments_operations_many?: Maybe<
    Array<Maybe<Payments_Operations_Mutation_Response>>
  >;
  /** update data of the table: "payments.plans" */
  update_payments_plans?: Maybe<Payments_Plans_Mutation_Response>;
  /** update single row of the table: "payments.plans" */
  update_payments_plans_by_pk?: Maybe<Payments_Plans>;
  /** update multiples rows of table: "payments.plans" */
  update_payments_plans_many?: Maybe<
    Array<Maybe<Payments_Plans_Mutation_Response>>
  >;
  /** update data of the table: "payments.providers" */
  update_payments_providers?: Maybe<Payments_Providers_Mutation_Response>;
  /** update single row of the table: "payments.providers" */
  update_payments_providers_by_pk?: Maybe<Payments_Providers>;
  /** update multiples rows of table: "payments.providers" */
  update_payments_providers_many?: Maybe<
    Array<Maybe<Payments_Providers_Mutation_Response>>
  >;
  /** update data of the table: "payments.subscriptions" */
  update_payments_subscriptions?: Maybe<Payments_Subscriptions_Mutation_Response>;
  /** update single row of the table: "payments.subscriptions" */
  update_payments_subscriptions_by_pk?: Maybe<Payments_Subscriptions>;
  /** update multiples rows of table: "payments.subscriptions" */
  update_payments_subscriptions_many?: Maybe<
    Array<Maybe<Payments_Subscriptions_Mutation_Response>>
  >;
  /** update data of the table: "payments.user_payment_provider_mappings" */
  update_payments_user_payment_provider_mappings?: Maybe<Payments_User_Payment_Provider_Mappings_Mutation_Response>;
  /** update single row of the table: "payments.user_payment_provider_mappings" */
  update_payments_user_payment_provider_mappings_by_pk?: Maybe<Payments_User_Payment_Provider_Mappings>;
  /** update multiples rows of table: "payments.user_payment_provider_mappings" */
  update_payments_user_payment_provider_mappings_many?: Maybe<
    Array<Maybe<Payments_User_Payment_Provider_Mappings_Mutation_Response>>
  >;
  /** update data of the table: "replies" */
  update_replies?: Maybe<Replies_Mutation_Response>;
  /** update single row of the table: "replies" */
  update_replies_by_pk?: Maybe<Replies>;
  /** update multiples rows of table: "replies" */
  update_replies_many?: Maybe<Array<Maybe<Replies_Mutation_Response>>>;
  /** update data of the table: "rooms" */
  update_rooms?: Maybe<Rooms_Mutation_Response>;
  /** update single row of the table: "rooms" */
  update_rooms_by_pk?: Maybe<Rooms>;
  /** update multiples rows of table: "rooms" */
  update_rooms_many?: Maybe<Array<Maybe<Rooms_Mutation_Response>>>;
  /** update data of the table: "schedule" */
  update_schedule?: Maybe<Schedule_Mutation_Response>;
  /** update single row of the table: "schedule" */
  update_schedule_by_pk?: Maybe<Schedule>;
  /** update multiples rows of table: "schedule" */
  update_schedule_many?: Maybe<Array<Maybe<Schedule_Mutation_Response>>>;
  /** update data of the table: "users" */
  update_users?: Maybe<Users_Mutation_Response>;
  /** update single row of the table: "users" */
  update_users_by_pk?: Maybe<Users>;
  /** update multiples rows of table: "users" */
  update_users_many?: Maybe<Array<Maybe<Users_Mutation_Response>>>;
  /** update data of the table: "verification_codes" */
  update_verification_codes?: Maybe<Verification_Codes_Mutation_Response>;
  /** update single row of the table: "verification_codes" */
  update_verification_codes_by_pk?: Maybe<Verification_Codes>;
  /** update multiples rows of table: "verification_codes" */
  update_verification_codes_many?: Maybe<
    Array<Maybe<Verification_Codes_Mutation_Response>>
  >;
  /** update multiples rows of table: "storage.virus" */
  update_virus_many?: Maybe<Array<Maybe<Virus_Mutation_Response>>>;
};

/** mutation root */
export type Mutation_RootDeleteBucketArgs = {
  id: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDeleteBucketsArgs = {
  where: Buckets_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDeleteFileArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDeleteFilesArgs = {
  where: Files_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDeleteVirusArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDeleteVirusesArgs = {
  where: Virus_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_AccountsArgs = {
  where: Accounts_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Accounts_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Auth_JwtArgs = {
  where: Auth_Jwt_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Auth_Jwt_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_DebugArgs = {
  where: Debug_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Debug_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_EventsArgs = {
  where: Events_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Events_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Geo_FeaturesArgs = {
  where: Geo_Features_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Geo_Features_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Github_IssuesArgs = {
  where: Github_Issues_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Github_Issues_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_GroupsArgs = {
  where: Groups_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Groups_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_InvitationsArgs = {
  where: Invitations_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Invitations_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_InvitedArgs = {
  where: Invited_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Invited_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_InvitesArgs = {
  where: Invites_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Invites_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Logs_DiffsArgs = {
  where: Logs_Diffs_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Logs_Diffs_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Logs_StatesArgs = {
  where: Logs_States_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Logs_States_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_MembershipsArgs = {
  where: Memberships_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Memberships_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Message_ReadsArgs = {
  where: Message_Reads_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Message_Reads_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_MessagesArgs = {
  where: Messages_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Messages_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Notification_MessagesArgs = {
  where: Notification_Messages_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Notification_Messages_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Notification_PermissionsArgs = {
  where: Notification_Permissions_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Notification_Permissions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_NotificationsArgs = {
  where: Notifications_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Notifications_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Payments_MethodsArgs = {
  where: Payments_Methods_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payments_Methods_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Payments_OperationsArgs = {
  where: Payments_Operations_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payments_Operations_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Payments_PlansArgs = {
  where: Payments_Plans_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payments_Plans_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Payments_ProvidersArgs = {
  where: Payments_Providers_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payments_Providers_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Payments_SubscriptionsArgs = {
  where: Payments_Subscriptions_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payments_Subscriptions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Payments_User_Payment_Provider_MappingsArgs = {
  where: Payments_User_Payment_Provider_Mappings_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payments_User_Payment_Provider_Mappings_By_PkArgs =
  {
    id: Scalars["uuid"]["input"];
  };

/** mutation root */
export type Mutation_RootDelete_RepliesArgs = {
  where: Replies_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Replies_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_RoomsArgs = {
  where: Rooms_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Rooms_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_ScheduleArgs = {
  where: Schedule_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Schedule_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_UsersArgs = {
  where: Users_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Users_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Verification_CodesArgs = {
  where: Verification_Codes_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Verification_Codes_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootInsertBucketArgs = {
  object: Buckets_Insert_Input;
  on_conflict?: InputMaybe<Buckets_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsertBucketsArgs = {
  objects: Array<Buckets_Insert_Input>;
  on_conflict?: InputMaybe<Buckets_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsertFileArgs = {
  object: Files_Insert_Input;
  on_conflict?: InputMaybe<Files_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsertFilesArgs = {
  objects: Array<Files_Insert_Input>;
  on_conflict?: InputMaybe<Files_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsertVirusArgs = {
  object: Virus_Insert_Input;
  on_conflict?: InputMaybe<Virus_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsertVirusesArgs = {
  objects: Array<Virus_Insert_Input>;
  on_conflict?: InputMaybe<Virus_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_AccountsArgs = {
  objects: Array<Accounts_Insert_Input>;
  on_conflict?: InputMaybe<Accounts_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Accounts_OneArgs = {
  object: Accounts_Insert_Input;
  on_conflict?: InputMaybe<Accounts_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Auth_JwtArgs = {
  objects: Array<Auth_Jwt_Insert_Input>;
  on_conflict?: InputMaybe<Auth_Jwt_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Auth_Jwt_OneArgs = {
  object: Auth_Jwt_Insert_Input;
  on_conflict?: InputMaybe<Auth_Jwt_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_DebugArgs = {
  objects: Array<Debug_Insert_Input>;
  on_conflict?: InputMaybe<Debug_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Debug_OneArgs = {
  object: Debug_Insert_Input;
  on_conflict?: InputMaybe<Debug_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_EventsArgs = {
  objects: Array<Events_Insert_Input>;
  on_conflict?: InputMaybe<Events_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Events_OneArgs = {
  object: Events_Insert_Input;
  on_conflict?: InputMaybe<Events_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Geo_FeaturesArgs = {
  objects: Array<Geo_Features_Insert_Input>;
  on_conflict?: InputMaybe<Geo_Features_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Geo_Features_OneArgs = {
  object: Geo_Features_Insert_Input;
  on_conflict?: InputMaybe<Geo_Features_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Github_IssuesArgs = {
  objects: Array<Github_Issues_Insert_Input>;
  on_conflict?: InputMaybe<Github_Issues_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Github_Issues_OneArgs = {
  object: Github_Issues_Insert_Input;
  on_conflict?: InputMaybe<Github_Issues_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_GroupsArgs = {
  objects: Array<Groups_Insert_Input>;
  on_conflict?: InputMaybe<Groups_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Groups_OneArgs = {
  object: Groups_Insert_Input;
  on_conflict?: InputMaybe<Groups_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_InvitationsArgs = {
  objects: Array<Invitations_Insert_Input>;
  on_conflict?: InputMaybe<Invitations_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Invitations_OneArgs = {
  object: Invitations_Insert_Input;
  on_conflict?: InputMaybe<Invitations_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_InvitedArgs = {
  objects: Array<Invited_Insert_Input>;
  on_conflict?: InputMaybe<Invited_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Invited_OneArgs = {
  object: Invited_Insert_Input;
  on_conflict?: InputMaybe<Invited_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_InvitesArgs = {
  objects: Array<Invites_Insert_Input>;
  on_conflict?: InputMaybe<Invites_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Invites_OneArgs = {
  object: Invites_Insert_Input;
  on_conflict?: InputMaybe<Invites_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Logs_DiffsArgs = {
  objects: Array<Logs_Diffs_Insert_Input>;
  on_conflict?: InputMaybe<Logs_Diffs_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Logs_Diffs_OneArgs = {
  object: Logs_Diffs_Insert_Input;
  on_conflict?: InputMaybe<Logs_Diffs_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Logs_StatesArgs = {
  objects: Array<Logs_States_Insert_Input>;
  on_conflict?: InputMaybe<Logs_States_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Logs_States_OneArgs = {
  object: Logs_States_Insert_Input;
  on_conflict?: InputMaybe<Logs_States_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_MembershipsArgs = {
  objects: Array<Memberships_Insert_Input>;
  on_conflict?: InputMaybe<Memberships_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Memberships_OneArgs = {
  object: Memberships_Insert_Input;
  on_conflict?: InputMaybe<Memberships_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Message_ReadsArgs = {
  objects: Array<Message_Reads_Insert_Input>;
  on_conflict?: InputMaybe<Message_Reads_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Message_Reads_OneArgs = {
  object: Message_Reads_Insert_Input;
  on_conflict?: InputMaybe<Message_Reads_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_MessagesArgs = {
  objects: Array<Messages_Insert_Input>;
  on_conflict?: InputMaybe<Messages_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Messages_OneArgs = {
  object: Messages_Insert_Input;
  on_conflict?: InputMaybe<Messages_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Notification_MessagesArgs = {
  objects: Array<Notification_Messages_Insert_Input>;
  on_conflict?: InputMaybe<Notification_Messages_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Notification_Messages_OneArgs = {
  object: Notification_Messages_Insert_Input;
  on_conflict?: InputMaybe<Notification_Messages_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Notification_PermissionsArgs = {
  objects: Array<Notification_Permissions_Insert_Input>;
  on_conflict?: InputMaybe<Notification_Permissions_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Notification_Permissions_OneArgs = {
  object: Notification_Permissions_Insert_Input;
  on_conflict?: InputMaybe<Notification_Permissions_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_NotificationsArgs = {
  objects: Array<Notifications_Insert_Input>;
  on_conflict?: InputMaybe<Notifications_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Notifications_OneArgs = {
  object: Notifications_Insert_Input;
  on_conflict?: InputMaybe<Notifications_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_MethodsArgs = {
  objects: Array<Payments_Methods_Insert_Input>;
  on_conflict?: InputMaybe<Payments_Methods_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_Methods_OneArgs = {
  object: Payments_Methods_Insert_Input;
  on_conflict?: InputMaybe<Payments_Methods_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_OperationsArgs = {
  objects: Array<Payments_Operations_Insert_Input>;
  on_conflict?: InputMaybe<Payments_Operations_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_Operations_OneArgs = {
  object: Payments_Operations_Insert_Input;
  on_conflict?: InputMaybe<Payments_Operations_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_PlansArgs = {
  objects: Array<Payments_Plans_Insert_Input>;
  on_conflict?: InputMaybe<Payments_Plans_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_Plans_OneArgs = {
  object: Payments_Plans_Insert_Input;
  on_conflict?: InputMaybe<Payments_Plans_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_ProvidersArgs = {
  objects: Array<Payments_Providers_Insert_Input>;
  on_conflict?: InputMaybe<Payments_Providers_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_Providers_OneArgs = {
  object: Payments_Providers_Insert_Input;
  on_conflict?: InputMaybe<Payments_Providers_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_SubscriptionsArgs = {
  objects: Array<Payments_Subscriptions_Insert_Input>;
  on_conflict?: InputMaybe<Payments_Subscriptions_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_Subscriptions_OneArgs = {
  object: Payments_Subscriptions_Insert_Input;
  on_conflict?: InputMaybe<Payments_Subscriptions_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_User_Payment_Provider_MappingsArgs = {
  objects: Array<Payments_User_Payment_Provider_Mappings_Insert_Input>;
  on_conflict?: InputMaybe<Payments_User_Payment_Provider_Mappings_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_User_Payment_Provider_Mappings_OneArgs =
  {
    object: Payments_User_Payment_Provider_Mappings_Insert_Input;
    on_conflict?: InputMaybe<Payments_User_Payment_Provider_Mappings_On_Conflict>;
  };

/** mutation root */
export type Mutation_RootInsert_RepliesArgs = {
  objects: Array<Replies_Insert_Input>;
  on_conflict?: InputMaybe<Replies_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Replies_OneArgs = {
  object: Replies_Insert_Input;
  on_conflict?: InputMaybe<Replies_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_RoomsArgs = {
  objects: Array<Rooms_Insert_Input>;
  on_conflict?: InputMaybe<Rooms_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Rooms_OneArgs = {
  object: Rooms_Insert_Input;
  on_conflict?: InputMaybe<Rooms_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_ScheduleArgs = {
  objects: Array<Schedule_Insert_Input>;
  on_conflict?: InputMaybe<Schedule_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Schedule_OneArgs = {
  object: Schedule_Insert_Input;
  on_conflict?: InputMaybe<Schedule_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_UsersArgs = {
  objects: Array<Users_Insert_Input>;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Users_OneArgs = {
  object: Users_Insert_Input;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Verification_CodesArgs = {
  objects: Array<Verification_Codes_Insert_Input>;
  on_conflict?: InputMaybe<Verification_Codes_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Verification_Codes_OneArgs = {
  object: Verification_Codes_Insert_Input;
  on_conflict?: InputMaybe<Verification_Codes_On_Conflict>;
};

/** mutation root */
export type Mutation_RootUpdateBucketArgs = {
  _inc?: InputMaybe<Buckets_Inc_Input>;
  _set?: InputMaybe<Buckets_Set_Input>;
  pk_columns: Buckets_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdateBucketsArgs = {
  _inc?: InputMaybe<Buckets_Inc_Input>;
  _set?: InputMaybe<Buckets_Set_Input>;
  where: Buckets_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdateFileArgs = {
  _append?: InputMaybe<Files_Append_Input>;
  _delete_at_path?: InputMaybe<Files_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Files_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Files_Delete_Key_Input>;
  _inc?: InputMaybe<Files_Inc_Input>;
  _prepend?: InputMaybe<Files_Prepend_Input>;
  _set?: InputMaybe<Files_Set_Input>;
  pk_columns: Files_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdateFilesArgs = {
  _append?: InputMaybe<Files_Append_Input>;
  _delete_at_path?: InputMaybe<Files_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Files_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Files_Delete_Key_Input>;
  _inc?: InputMaybe<Files_Inc_Input>;
  _prepend?: InputMaybe<Files_Prepend_Input>;
  _set?: InputMaybe<Files_Set_Input>;
  where: Files_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdateVirusArgs = {
  _append?: InputMaybe<Virus_Append_Input>;
  _delete_at_path?: InputMaybe<Virus_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Virus_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Virus_Delete_Key_Input>;
  _prepend?: InputMaybe<Virus_Prepend_Input>;
  _set?: InputMaybe<Virus_Set_Input>;
  pk_columns: Virus_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdateVirusesArgs = {
  _append?: InputMaybe<Virus_Append_Input>;
  _delete_at_path?: InputMaybe<Virus_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Virus_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Virus_Delete_Key_Input>;
  _prepend?: InputMaybe<Virus_Prepend_Input>;
  _set?: InputMaybe<Virus_Set_Input>;
  where: Virus_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_AccountsArgs = {
  _append?: InputMaybe<Accounts_Append_Input>;
  _delete_at_path?: InputMaybe<Accounts_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Accounts_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Accounts_Delete_Key_Input>;
  _inc?: InputMaybe<Accounts_Inc_Input>;
  _prepend?: InputMaybe<Accounts_Prepend_Input>;
  _set?: InputMaybe<Accounts_Set_Input>;
  where: Accounts_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Accounts_By_PkArgs = {
  _append?: InputMaybe<Accounts_Append_Input>;
  _delete_at_path?: InputMaybe<Accounts_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Accounts_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Accounts_Delete_Key_Input>;
  _inc?: InputMaybe<Accounts_Inc_Input>;
  _prepend?: InputMaybe<Accounts_Prepend_Input>;
  _set?: InputMaybe<Accounts_Set_Input>;
  pk_columns: Accounts_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Accounts_ManyArgs = {
  updates: Array<Accounts_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_JwtArgs = {
  _inc?: InputMaybe<Auth_Jwt_Inc_Input>;
  _set?: InputMaybe<Auth_Jwt_Set_Input>;
  where: Auth_Jwt_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_Jwt_By_PkArgs = {
  _inc?: InputMaybe<Auth_Jwt_Inc_Input>;
  _set?: InputMaybe<Auth_Jwt_Set_Input>;
  pk_columns: Auth_Jwt_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_Jwt_ManyArgs = {
  updates: Array<Auth_Jwt_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Buckets_ManyArgs = {
  updates: Array<Buckets_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_DebugArgs = {
  _append?: InputMaybe<Debug_Append_Input>;
  _delete_at_path?: InputMaybe<Debug_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Debug_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Debug_Delete_Key_Input>;
  _inc?: InputMaybe<Debug_Inc_Input>;
  _prepend?: InputMaybe<Debug_Prepend_Input>;
  _set?: InputMaybe<Debug_Set_Input>;
  where: Debug_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Debug_By_PkArgs = {
  _append?: InputMaybe<Debug_Append_Input>;
  _delete_at_path?: InputMaybe<Debug_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Debug_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Debug_Delete_Key_Input>;
  _inc?: InputMaybe<Debug_Inc_Input>;
  _prepend?: InputMaybe<Debug_Prepend_Input>;
  _set?: InputMaybe<Debug_Set_Input>;
  pk_columns: Debug_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Debug_ManyArgs = {
  updates: Array<Debug_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_EventsArgs = {
  _append?: InputMaybe<Events_Append_Input>;
  _delete_at_path?: InputMaybe<Events_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Events_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Events_Delete_Key_Input>;
  _inc?: InputMaybe<Events_Inc_Input>;
  _prepend?: InputMaybe<Events_Prepend_Input>;
  _set?: InputMaybe<Events_Set_Input>;
  where: Events_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Events_By_PkArgs = {
  _append?: InputMaybe<Events_Append_Input>;
  _delete_at_path?: InputMaybe<Events_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Events_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Events_Delete_Key_Input>;
  _inc?: InputMaybe<Events_Inc_Input>;
  _prepend?: InputMaybe<Events_Prepend_Input>;
  _set?: InputMaybe<Events_Set_Input>;
  pk_columns: Events_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Events_ManyArgs = {
  updates: Array<Events_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Files_ManyArgs = {
  updates: Array<Files_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Geo_FeaturesArgs = {
  _append?: InputMaybe<Geo_Features_Append_Input>;
  _delete_at_path?: InputMaybe<Geo_Features_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Geo_Features_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Geo_Features_Delete_Key_Input>;
  _inc?: InputMaybe<Geo_Features_Inc_Input>;
  _prepend?: InputMaybe<Geo_Features_Prepend_Input>;
  _set?: InputMaybe<Geo_Features_Set_Input>;
  where: Geo_Features_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Geo_Features_By_PkArgs = {
  _append?: InputMaybe<Geo_Features_Append_Input>;
  _delete_at_path?: InputMaybe<Geo_Features_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Geo_Features_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Geo_Features_Delete_Key_Input>;
  _inc?: InputMaybe<Geo_Features_Inc_Input>;
  _prepend?: InputMaybe<Geo_Features_Prepend_Input>;
  _set?: InputMaybe<Geo_Features_Set_Input>;
  pk_columns: Geo_Features_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Geo_Features_ManyArgs = {
  updates: Array<Geo_Features_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Github_IssuesArgs = {
  _append?: InputMaybe<Github_Issues_Append_Input>;
  _delete_at_path?: InputMaybe<Github_Issues_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Github_Issues_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Github_Issues_Delete_Key_Input>;
  _inc?: InputMaybe<Github_Issues_Inc_Input>;
  _prepend?: InputMaybe<Github_Issues_Prepend_Input>;
  _set?: InputMaybe<Github_Issues_Set_Input>;
  where: Github_Issues_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Github_Issues_By_PkArgs = {
  _append?: InputMaybe<Github_Issues_Append_Input>;
  _delete_at_path?: InputMaybe<Github_Issues_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Github_Issues_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Github_Issues_Delete_Key_Input>;
  _inc?: InputMaybe<Github_Issues_Inc_Input>;
  _prepend?: InputMaybe<Github_Issues_Prepend_Input>;
  _set?: InputMaybe<Github_Issues_Set_Input>;
  pk_columns: Github_Issues_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Github_Issues_ManyArgs = {
  updates: Array<Github_Issues_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_GroupsArgs = {
  _append?: InputMaybe<Groups_Append_Input>;
  _delete_at_path?: InputMaybe<Groups_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Groups_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Groups_Delete_Key_Input>;
  _inc?: InputMaybe<Groups_Inc_Input>;
  _prepend?: InputMaybe<Groups_Prepend_Input>;
  _set?: InputMaybe<Groups_Set_Input>;
  where: Groups_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Groups_By_PkArgs = {
  _append?: InputMaybe<Groups_Append_Input>;
  _delete_at_path?: InputMaybe<Groups_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Groups_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Groups_Delete_Key_Input>;
  _inc?: InputMaybe<Groups_Inc_Input>;
  _prepend?: InputMaybe<Groups_Prepend_Input>;
  _set?: InputMaybe<Groups_Set_Input>;
  pk_columns: Groups_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Groups_ManyArgs = {
  updates: Array<Groups_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_InvitationsArgs = {
  _inc?: InputMaybe<Invitations_Inc_Input>;
  _set?: InputMaybe<Invitations_Set_Input>;
  where: Invitations_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Invitations_By_PkArgs = {
  _inc?: InputMaybe<Invitations_Inc_Input>;
  _set?: InputMaybe<Invitations_Set_Input>;
  pk_columns: Invitations_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Invitations_ManyArgs = {
  updates: Array<Invitations_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_InvitedArgs = {
  _inc?: InputMaybe<Invited_Inc_Input>;
  _set?: InputMaybe<Invited_Set_Input>;
  where: Invited_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Invited_By_PkArgs = {
  _inc?: InputMaybe<Invited_Inc_Input>;
  _set?: InputMaybe<Invited_Set_Input>;
  pk_columns: Invited_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Invited_ManyArgs = {
  updates: Array<Invited_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_InvitesArgs = {
  _inc?: InputMaybe<Invites_Inc_Input>;
  _set?: InputMaybe<Invites_Set_Input>;
  where: Invites_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Invites_By_PkArgs = {
  _inc?: InputMaybe<Invites_Inc_Input>;
  _set?: InputMaybe<Invites_Set_Input>;
  pk_columns: Invites_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Invites_ManyArgs = {
  updates: Array<Invites_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Logs_DiffsArgs = {
  _inc?: InputMaybe<Logs_Diffs_Inc_Input>;
  _set?: InputMaybe<Logs_Diffs_Set_Input>;
  where: Logs_Diffs_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Logs_Diffs_By_PkArgs = {
  _inc?: InputMaybe<Logs_Diffs_Inc_Input>;
  _set?: InputMaybe<Logs_Diffs_Set_Input>;
  pk_columns: Logs_Diffs_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Logs_Diffs_ManyArgs = {
  updates: Array<Logs_Diffs_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Logs_StatesArgs = {
  _append?: InputMaybe<Logs_States_Append_Input>;
  _delete_at_path?: InputMaybe<Logs_States_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Logs_States_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Logs_States_Delete_Key_Input>;
  _inc?: InputMaybe<Logs_States_Inc_Input>;
  _prepend?: InputMaybe<Logs_States_Prepend_Input>;
  _set?: InputMaybe<Logs_States_Set_Input>;
  where: Logs_States_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Logs_States_By_PkArgs = {
  _append?: InputMaybe<Logs_States_Append_Input>;
  _delete_at_path?: InputMaybe<Logs_States_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Logs_States_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Logs_States_Delete_Key_Input>;
  _inc?: InputMaybe<Logs_States_Inc_Input>;
  _prepend?: InputMaybe<Logs_States_Prepend_Input>;
  _set?: InputMaybe<Logs_States_Set_Input>;
  pk_columns: Logs_States_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Logs_States_ManyArgs = {
  updates: Array<Logs_States_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_MembershipsArgs = {
  _inc?: InputMaybe<Memberships_Inc_Input>;
  _set?: InputMaybe<Memberships_Set_Input>;
  where: Memberships_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Memberships_By_PkArgs = {
  _inc?: InputMaybe<Memberships_Inc_Input>;
  _set?: InputMaybe<Memberships_Set_Input>;
  pk_columns: Memberships_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Memberships_ManyArgs = {
  updates: Array<Memberships_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Message_ReadsArgs = {
  _inc?: InputMaybe<Message_Reads_Inc_Input>;
  _set?: InputMaybe<Message_Reads_Set_Input>;
  where: Message_Reads_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Message_Reads_By_PkArgs = {
  _inc?: InputMaybe<Message_Reads_Inc_Input>;
  _set?: InputMaybe<Message_Reads_Set_Input>;
  pk_columns: Message_Reads_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Message_Reads_ManyArgs = {
  updates: Array<Message_Reads_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_MessagesArgs = {
  _inc?: InputMaybe<Messages_Inc_Input>;
  _set?: InputMaybe<Messages_Set_Input>;
  where: Messages_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Messages_By_PkArgs = {
  _inc?: InputMaybe<Messages_Inc_Input>;
  _set?: InputMaybe<Messages_Set_Input>;
  pk_columns: Messages_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Messages_ManyArgs = {
  updates: Array<Messages_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Notification_MessagesArgs = {
  _append?: InputMaybe<Notification_Messages_Append_Input>;
  _delete_at_path?: InputMaybe<Notification_Messages_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Notification_Messages_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Notification_Messages_Delete_Key_Input>;
  _inc?: InputMaybe<Notification_Messages_Inc_Input>;
  _prepend?: InputMaybe<Notification_Messages_Prepend_Input>;
  _set?: InputMaybe<Notification_Messages_Set_Input>;
  where: Notification_Messages_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Notification_Messages_By_PkArgs = {
  _append?: InputMaybe<Notification_Messages_Append_Input>;
  _delete_at_path?: InputMaybe<Notification_Messages_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Notification_Messages_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Notification_Messages_Delete_Key_Input>;
  _inc?: InputMaybe<Notification_Messages_Inc_Input>;
  _prepend?: InputMaybe<Notification_Messages_Prepend_Input>;
  _set?: InputMaybe<Notification_Messages_Set_Input>;
  pk_columns: Notification_Messages_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Notification_Messages_ManyArgs = {
  updates: Array<Notification_Messages_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Notification_PermissionsArgs = {
  _append?: InputMaybe<Notification_Permissions_Append_Input>;
  _delete_at_path?: InputMaybe<Notification_Permissions_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Notification_Permissions_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Notification_Permissions_Delete_Key_Input>;
  _inc?: InputMaybe<Notification_Permissions_Inc_Input>;
  _prepend?: InputMaybe<Notification_Permissions_Prepend_Input>;
  _set?: InputMaybe<Notification_Permissions_Set_Input>;
  where: Notification_Permissions_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Notification_Permissions_By_PkArgs = {
  _append?: InputMaybe<Notification_Permissions_Append_Input>;
  _delete_at_path?: InputMaybe<Notification_Permissions_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Notification_Permissions_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Notification_Permissions_Delete_Key_Input>;
  _inc?: InputMaybe<Notification_Permissions_Inc_Input>;
  _prepend?: InputMaybe<Notification_Permissions_Prepend_Input>;
  _set?: InputMaybe<Notification_Permissions_Set_Input>;
  pk_columns: Notification_Permissions_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Notification_Permissions_ManyArgs = {
  updates: Array<Notification_Permissions_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_NotificationsArgs = {
  _append?: InputMaybe<Notifications_Append_Input>;
  _delete_at_path?: InputMaybe<Notifications_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Notifications_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Notifications_Delete_Key_Input>;
  _inc?: InputMaybe<Notifications_Inc_Input>;
  _prepend?: InputMaybe<Notifications_Prepend_Input>;
  _set?: InputMaybe<Notifications_Set_Input>;
  where: Notifications_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Notifications_By_PkArgs = {
  _append?: InputMaybe<Notifications_Append_Input>;
  _delete_at_path?: InputMaybe<Notifications_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Notifications_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Notifications_Delete_Key_Input>;
  _inc?: InputMaybe<Notifications_Inc_Input>;
  _prepend?: InputMaybe<Notifications_Prepend_Input>;
  _set?: InputMaybe<Notifications_Set_Input>;
  pk_columns: Notifications_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Notifications_ManyArgs = {
  updates: Array<Notifications_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_MethodsArgs = {
  _append?: InputMaybe<Payments_Methods_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_Methods_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_Methods_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_Methods_Delete_Key_Input>;
  _inc?: InputMaybe<Payments_Methods_Inc_Input>;
  _prepend?: InputMaybe<Payments_Methods_Prepend_Input>;
  _set?: InputMaybe<Payments_Methods_Set_Input>;
  where: Payments_Methods_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Methods_By_PkArgs = {
  _append?: InputMaybe<Payments_Methods_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_Methods_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_Methods_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_Methods_Delete_Key_Input>;
  _inc?: InputMaybe<Payments_Methods_Inc_Input>;
  _prepend?: InputMaybe<Payments_Methods_Prepend_Input>;
  _set?: InputMaybe<Payments_Methods_Set_Input>;
  pk_columns: Payments_Methods_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Methods_ManyArgs = {
  updates: Array<Payments_Methods_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_OperationsArgs = {
  _append?: InputMaybe<Payments_Operations_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_Operations_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_Operations_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_Operations_Delete_Key_Input>;
  _inc?: InputMaybe<Payments_Operations_Inc_Input>;
  _prepend?: InputMaybe<Payments_Operations_Prepend_Input>;
  _set?: InputMaybe<Payments_Operations_Set_Input>;
  where: Payments_Operations_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Operations_By_PkArgs = {
  _append?: InputMaybe<Payments_Operations_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_Operations_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_Operations_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_Operations_Delete_Key_Input>;
  _inc?: InputMaybe<Payments_Operations_Inc_Input>;
  _prepend?: InputMaybe<Payments_Operations_Prepend_Input>;
  _set?: InputMaybe<Payments_Operations_Set_Input>;
  pk_columns: Payments_Operations_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Operations_ManyArgs = {
  updates: Array<Payments_Operations_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_PlansArgs = {
  _append?: InputMaybe<Payments_Plans_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_Plans_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_Plans_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_Plans_Delete_Key_Input>;
  _inc?: InputMaybe<Payments_Plans_Inc_Input>;
  _prepend?: InputMaybe<Payments_Plans_Prepend_Input>;
  _set?: InputMaybe<Payments_Plans_Set_Input>;
  where: Payments_Plans_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Plans_By_PkArgs = {
  _append?: InputMaybe<Payments_Plans_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_Plans_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_Plans_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_Plans_Delete_Key_Input>;
  _inc?: InputMaybe<Payments_Plans_Inc_Input>;
  _prepend?: InputMaybe<Payments_Plans_Prepend_Input>;
  _set?: InputMaybe<Payments_Plans_Set_Input>;
  pk_columns: Payments_Plans_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Plans_ManyArgs = {
  updates: Array<Payments_Plans_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_ProvidersArgs = {
  _append?: InputMaybe<Payments_Providers_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_Providers_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_Providers_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_Providers_Delete_Key_Input>;
  _inc?: InputMaybe<Payments_Providers_Inc_Input>;
  _prepend?: InputMaybe<Payments_Providers_Prepend_Input>;
  _set?: InputMaybe<Payments_Providers_Set_Input>;
  where: Payments_Providers_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Providers_By_PkArgs = {
  _append?: InputMaybe<Payments_Providers_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_Providers_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_Providers_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_Providers_Delete_Key_Input>;
  _inc?: InputMaybe<Payments_Providers_Inc_Input>;
  _prepend?: InputMaybe<Payments_Providers_Prepend_Input>;
  _set?: InputMaybe<Payments_Providers_Set_Input>;
  pk_columns: Payments_Providers_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Providers_ManyArgs = {
  updates: Array<Payments_Providers_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_SubscriptionsArgs = {
  _append?: InputMaybe<Payments_Subscriptions_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_Subscriptions_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_Subscriptions_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_Subscriptions_Delete_Key_Input>;
  _inc?: InputMaybe<Payments_Subscriptions_Inc_Input>;
  _prepend?: InputMaybe<Payments_Subscriptions_Prepend_Input>;
  _set?: InputMaybe<Payments_Subscriptions_Set_Input>;
  where: Payments_Subscriptions_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Subscriptions_By_PkArgs = {
  _append?: InputMaybe<Payments_Subscriptions_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_Subscriptions_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_Subscriptions_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_Subscriptions_Delete_Key_Input>;
  _inc?: InputMaybe<Payments_Subscriptions_Inc_Input>;
  _prepend?: InputMaybe<Payments_Subscriptions_Prepend_Input>;
  _set?: InputMaybe<Payments_Subscriptions_Set_Input>;
  pk_columns: Payments_Subscriptions_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Subscriptions_ManyArgs = {
  updates: Array<Payments_Subscriptions_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_User_Payment_Provider_MappingsArgs = {
  _append?: InputMaybe<Payments_User_Payment_Provider_Mappings_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_User_Payment_Provider_Mappings_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_User_Payment_Provider_Mappings_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_User_Payment_Provider_Mappings_Delete_Key_Input>;
  _inc?: InputMaybe<Payments_User_Payment_Provider_Mappings_Inc_Input>;
  _prepend?: InputMaybe<Payments_User_Payment_Provider_Mappings_Prepend_Input>;
  _set?: InputMaybe<Payments_User_Payment_Provider_Mappings_Set_Input>;
  where: Payments_User_Payment_Provider_Mappings_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_User_Payment_Provider_Mappings_By_PkArgs =
  {
    _append?: InputMaybe<Payments_User_Payment_Provider_Mappings_Append_Input>;
    _delete_at_path?: InputMaybe<Payments_User_Payment_Provider_Mappings_Delete_At_Path_Input>;
    _delete_elem?: InputMaybe<Payments_User_Payment_Provider_Mappings_Delete_Elem_Input>;
    _delete_key?: InputMaybe<Payments_User_Payment_Provider_Mappings_Delete_Key_Input>;
    _inc?: InputMaybe<Payments_User_Payment_Provider_Mappings_Inc_Input>;
    _prepend?: InputMaybe<Payments_User_Payment_Provider_Mappings_Prepend_Input>;
    _set?: InputMaybe<Payments_User_Payment_Provider_Mappings_Set_Input>;
    pk_columns: Payments_User_Payment_Provider_Mappings_Pk_Columns_Input;
  };

/** mutation root */
export type Mutation_RootUpdate_Payments_User_Payment_Provider_Mappings_ManyArgs =
  {
    updates: Array<Payments_User_Payment_Provider_Mappings_Updates>;
  };

/** mutation root */
export type Mutation_RootUpdate_RepliesArgs = {
  _inc?: InputMaybe<Replies_Inc_Input>;
  _set?: InputMaybe<Replies_Set_Input>;
  where: Replies_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Replies_By_PkArgs = {
  _inc?: InputMaybe<Replies_Inc_Input>;
  _set?: InputMaybe<Replies_Set_Input>;
  pk_columns: Replies_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Replies_ManyArgs = {
  updates: Array<Replies_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_RoomsArgs = {
  _append?: InputMaybe<Rooms_Append_Input>;
  _delete_at_path?: InputMaybe<Rooms_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Rooms_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Rooms_Delete_Key_Input>;
  _inc?: InputMaybe<Rooms_Inc_Input>;
  _prepend?: InputMaybe<Rooms_Prepend_Input>;
  _set?: InputMaybe<Rooms_Set_Input>;
  where: Rooms_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Rooms_By_PkArgs = {
  _append?: InputMaybe<Rooms_Append_Input>;
  _delete_at_path?: InputMaybe<Rooms_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Rooms_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Rooms_Delete_Key_Input>;
  _inc?: InputMaybe<Rooms_Inc_Input>;
  _prepend?: InputMaybe<Rooms_Prepend_Input>;
  _set?: InputMaybe<Rooms_Set_Input>;
  pk_columns: Rooms_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Rooms_ManyArgs = {
  updates: Array<Rooms_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_ScheduleArgs = {
  _append?: InputMaybe<Schedule_Append_Input>;
  _delete_at_path?: InputMaybe<Schedule_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Schedule_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Schedule_Delete_Key_Input>;
  _inc?: InputMaybe<Schedule_Inc_Input>;
  _prepend?: InputMaybe<Schedule_Prepend_Input>;
  _set?: InputMaybe<Schedule_Set_Input>;
  where: Schedule_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Schedule_By_PkArgs = {
  _append?: InputMaybe<Schedule_Append_Input>;
  _delete_at_path?: InputMaybe<Schedule_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Schedule_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Schedule_Delete_Key_Input>;
  _inc?: InputMaybe<Schedule_Inc_Input>;
  _prepend?: InputMaybe<Schedule_Prepend_Input>;
  _set?: InputMaybe<Schedule_Set_Input>;
  pk_columns: Schedule_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Schedule_ManyArgs = {
  updates: Array<Schedule_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_UsersArgs = {
  _inc?: InputMaybe<Users_Inc_Input>;
  _set?: InputMaybe<Users_Set_Input>;
  where: Users_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Users_By_PkArgs = {
  _inc?: InputMaybe<Users_Inc_Input>;
  _set?: InputMaybe<Users_Set_Input>;
  pk_columns: Users_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Users_ManyArgs = {
  updates: Array<Users_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Verification_CodesArgs = {
  _inc?: InputMaybe<Verification_Codes_Inc_Input>;
  _set?: InputMaybe<Verification_Codes_Set_Input>;
  where: Verification_Codes_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Verification_Codes_By_PkArgs = {
  _inc?: InputMaybe<Verification_Codes_Inc_Input>;
  _set?: InputMaybe<Verification_Codes_Set_Input>;
  pk_columns: Verification_Codes_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Verification_Codes_ManyArgs = {
  updates: Array<Verification_Codes_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Virus_ManyArgs = {
  updates: Array<Virus_Updates>;
};

/** columns and relationships of "notification_messages" */
export type Notification_Messages = {
  __typename?: "notification_messages";
  /** Notification body */
  body: Scalars["String"]["output"];
  created_at: Scalars["bigint"]["output"];
  /** Additional notification data */
  data?: Maybe<Scalars["jsonb"]["output"]>;
  id: Scalars["uuid"]["output"];
  /** An array relationship */
  notifications: Array<Notifications>;
  /** An aggregate relationship */
  notifications_aggregate: Notifications_Aggregate;
  /** Notification title */
  title: Scalars["String"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  /** Target user for notification */
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "notification_messages" */
export type Notification_MessagesDataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "notification_messages" */
export type Notification_MessagesNotificationsArgs = {
  distinct_on?: InputMaybe<Array<Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notifications_Order_By>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};

/** columns and relationships of "notification_messages" */
export type Notification_MessagesNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notifications_Order_By>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};

/** aggregated selection of "notification_messages" */
export type Notification_Messages_Aggregate = {
  __typename?: "notification_messages_aggregate";
  aggregate?: Maybe<Notification_Messages_Aggregate_Fields>;
  nodes: Array<Notification_Messages>;
};

export type Notification_Messages_Aggregate_Bool_Exp = {
  count?: InputMaybe<Notification_Messages_Aggregate_Bool_Exp_Count>;
};

export type Notification_Messages_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Notification_Messages_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Notification_Messages_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "notification_messages" */
export type Notification_Messages_Aggregate_Fields = {
  __typename?: "notification_messages_aggregate_fields";
  avg?: Maybe<Notification_Messages_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Notification_Messages_Max_Fields>;
  min?: Maybe<Notification_Messages_Min_Fields>;
  stddev?: Maybe<Notification_Messages_Stddev_Fields>;
  stddev_pop?: Maybe<Notification_Messages_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Notification_Messages_Stddev_Samp_Fields>;
  sum?: Maybe<Notification_Messages_Sum_Fields>;
  var_pop?: Maybe<Notification_Messages_Var_Pop_Fields>;
  var_samp?: Maybe<Notification_Messages_Var_Samp_Fields>;
  variance?: Maybe<Notification_Messages_Variance_Fields>;
};

/** aggregate fields of "notification_messages" */
export type Notification_Messages_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Notification_Messages_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "notification_messages" */
export type Notification_Messages_Aggregate_Order_By = {
  avg?: InputMaybe<Notification_Messages_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Notification_Messages_Max_Order_By>;
  min?: InputMaybe<Notification_Messages_Min_Order_By>;
  stddev?: InputMaybe<Notification_Messages_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Notification_Messages_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Notification_Messages_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Notification_Messages_Sum_Order_By>;
  var_pop?: InputMaybe<Notification_Messages_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Notification_Messages_Var_Samp_Order_By>;
  variance?: InputMaybe<Notification_Messages_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Notification_Messages_Append_Input = {
  /** Additional notification data */
  data?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "notification_messages" */
export type Notification_Messages_Arr_Rel_Insert_Input = {
  data: Array<Notification_Messages_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Notification_Messages_On_Conflict>;
};

/** aggregate avg on columns */
export type Notification_Messages_Avg_Fields = {
  __typename?: "notification_messages_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "notification_messages" */
export type Notification_Messages_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "notification_messages". All fields are combined with a logical 'AND'. */
export type Notification_Messages_Bool_Exp = {
  _and?: InputMaybe<Array<Notification_Messages_Bool_Exp>>;
  _not?: InputMaybe<Notification_Messages_Bool_Exp>;
  _or?: InputMaybe<Array<Notification_Messages_Bool_Exp>>;
  body?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  data?: InputMaybe<Jsonb_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  notifications?: InputMaybe<Notifications_Bool_Exp>;
  notifications_aggregate?: InputMaybe<Notifications_Aggregate_Bool_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "notification_messages" */
export enum Notification_Messages_Constraint {
  /** unique or primary key constraint on columns "id" */
  NotificationMessagesPkey = "notification_messages_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Notification_Messages_Delete_At_Path_Input = {
  /** Additional notification data */
  data?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Notification_Messages_Delete_Elem_Input = {
  /** Additional notification data */
  data?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Notification_Messages_Delete_Key_Input = {
  /** Additional notification data */
  data?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "notification_messages" */
export type Notification_Messages_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "notification_messages" */
export type Notification_Messages_Insert_Input = {
  /** Notification body */
  body?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Additional notification data */
  data?: InputMaybe<Scalars["jsonb"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  notifications?: InputMaybe<Notifications_Arr_Rel_Insert_Input>;
  /** Notification title */
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** Target user for notification */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Notification_Messages_Max_Fields = {
  __typename?: "notification_messages_max_fields";
  /** Notification body */
  body?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Notification title */
  title?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Target user for notification */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "notification_messages" */
export type Notification_Messages_Max_Order_By = {
  /** Notification body */
  body?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Notification title */
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** Target user for notification */
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Notification_Messages_Min_Fields = {
  __typename?: "notification_messages_min_fields";
  /** Notification body */
  body?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Notification title */
  title?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Target user for notification */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "notification_messages" */
export type Notification_Messages_Min_Order_By = {
  /** Notification body */
  body?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Notification title */
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** Target user for notification */
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "notification_messages" */
export type Notification_Messages_Mutation_Response = {
  __typename?: "notification_messages_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Notification_Messages>;
};

/** input type for inserting object relation for remote table "notification_messages" */
export type Notification_Messages_Obj_Rel_Insert_Input = {
  data: Notification_Messages_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Notification_Messages_On_Conflict>;
};

/** on_conflict condition type for table "notification_messages" */
export type Notification_Messages_On_Conflict = {
  constraint: Notification_Messages_Constraint;
  update_columns?: Array<Notification_Messages_Update_Column>;
  where?: InputMaybe<Notification_Messages_Bool_Exp>;
};

/** Ordering options when selecting data from "notification_messages". */
export type Notification_Messages_Order_By = {
  body?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  data?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  notifications_aggregate?: InputMaybe<Notifications_Aggregate_Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: notification_messages */
export type Notification_Messages_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Notification_Messages_Prepend_Input = {
  /** Additional notification data */
  data?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "notification_messages" */
export enum Notification_Messages_Select_Column {
  /** column name */
  Body = "body",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Data = "data",
  /** column name */
  Id = "id",
  /** column name */
  Title = "title",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "notification_messages" */
export type Notification_Messages_Set_Input = {
  /** Notification body */
  body?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Additional notification data */
  data?: InputMaybe<Scalars["jsonb"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Notification title */
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Target user for notification */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Notification_Messages_Stddev_Fields = {
  __typename?: "notification_messages_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "notification_messages" */
export type Notification_Messages_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Notification_Messages_Stddev_Pop_Fields = {
  __typename?: "notification_messages_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "notification_messages" */
export type Notification_Messages_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Notification_Messages_Stddev_Samp_Fields = {
  __typename?: "notification_messages_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "notification_messages" */
export type Notification_Messages_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "notification_messages" */
export type Notification_Messages_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Notification_Messages_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Notification_Messages_Stream_Cursor_Value_Input = {
  /** Notification body */
  body?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Additional notification data */
  data?: InputMaybe<Scalars["jsonb"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Notification title */
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Target user for notification */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Notification_Messages_Sum_Fields = {
  __typename?: "notification_messages_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "notification_messages" */
export type Notification_Messages_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "notification_messages" */
export enum Notification_Messages_Update_Column {
  /** column name */
  Body = "body",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Data = "data",
  /** column name */
  Id = "id",
  /** column name */
  Title = "title",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Notification_Messages_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Notification_Messages_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Notification_Messages_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Notification_Messages_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Notification_Messages_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Notification_Messages_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Notification_Messages_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Notification_Messages_Set_Input>;
  /** filter the rows which have to be updated */
  where: Notification_Messages_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Notification_Messages_Var_Pop_Fields = {
  __typename?: "notification_messages_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "notification_messages" */
export type Notification_Messages_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Notification_Messages_Var_Samp_Fields = {
  __typename?: "notification_messages_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "notification_messages" */
export type Notification_Messages_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Notification_Messages_Variance_Fields = {
  __typename?: "notification_messages_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "notification_messages" */
export type Notification_Messages_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "notification_permissions" */
export type Notification_Permissions = {
  __typename?: "notification_permissions";
  created_at: Scalars["bigint"]["output"];
  /** Device information */
  device_info: Scalars["jsonb"]["output"];
  /** Device token for push notifications */
  device_token: Scalars["String"]["output"];
  id: Scalars["uuid"]["output"];
  /** An array relationship */
  notifications: Array<Notifications>;
  /** An aggregate relationship */
  notifications_aggregate: Notifications_Aggregate;
  /** Notification provider (e.g., fcm, apns) */
  provider: Scalars["String"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  /** Reference to users table */
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "notification_permissions" */
export type Notification_PermissionsDevice_InfoArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "notification_permissions" */
export type Notification_PermissionsNotificationsArgs = {
  distinct_on?: InputMaybe<Array<Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notifications_Order_By>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};

/** columns and relationships of "notification_permissions" */
export type Notification_PermissionsNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notifications_Order_By>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};

/** aggregated selection of "notification_permissions" */
export type Notification_Permissions_Aggregate = {
  __typename?: "notification_permissions_aggregate";
  aggregate?: Maybe<Notification_Permissions_Aggregate_Fields>;
  nodes: Array<Notification_Permissions>;
};

export type Notification_Permissions_Aggregate_Bool_Exp = {
  count?: InputMaybe<Notification_Permissions_Aggregate_Bool_Exp_Count>;
};

export type Notification_Permissions_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Notification_Permissions_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Notification_Permissions_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "notification_permissions" */
export type Notification_Permissions_Aggregate_Fields = {
  __typename?: "notification_permissions_aggregate_fields";
  avg?: Maybe<Notification_Permissions_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Notification_Permissions_Max_Fields>;
  min?: Maybe<Notification_Permissions_Min_Fields>;
  stddev?: Maybe<Notification_Permissions_Stddev_Fields>;
  stddev_pop?: Maybe<Notification_Permissions_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Notification_Permissions_Stddev_Samp_Fields>;
  sum?: Maybe<Notification_Permissions_Sum_Fields>;
  var_pop?: Maybe<Notification_Permissions_Var_Pop_Fields>;
  var_samp?: Maybe<Notification_Permissions_Var_Samp_Fields>;
  variance?: Maybe<Notification_Permissions_Variance_Fields>;
};

/** aggregate fields of "notification_permissions" */
export type Notification_Permissions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Notification_Permissions_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "notification_permissions" */
export type Notification_Permissions_Aggregate_Order_By = {
  avg?: InputMaybe<Notification_Permissions_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Notification_Permissions_Max_Order_By>;
  min?: InputMaybe<Notification_Permissions_Min_Order_By>;
  stddev?: InputMaybe<Notification_Permissions_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Notification_Permissions_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Notification_Permissions_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Notification_Permissions_Sum_Order_By>;
  var_pop?: InputMaybe<Notification_Permissions_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Notification_Permissions_Var_Samp_Order_By>;
  variance?: InputMaybe<Notification_Permissions_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Notification_Permissions_Append_Input = {
  /** Device information */
  device_info?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "notification_permissions" */
export type Notification_Permissions_Arr_Rel_Insert_Input = {
  data: Array<Notification_Permissions_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Notification_Permissions_On_Conflict>;
};

/** aggregate avg on columns */
export type Notification_Permissions_Avg_Fields = {
  __typename?: "notification_permissions_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "notification_permissions" */
export type Notification_Permissions_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "notification_permissions". All fields are combined with a logical 'AND'. */
export type Notification_Permissions_Bool_Exp = {
  _and?: InputMaybe<Array<Notification_Permissions_Bool_Exp>>;
  _not?: InputMaybe<Notification_Permissions_Bool_Exp>;
  _or?: InputMaybe<Array<Notification_Permissions_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  device_info?: InputMaybe<Jsonb_Comparison_Exp>;
  device_token?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  notifications?: InputMaybe<Notifications_Bool_Exp>;
  notifications_aggregate?: InputMaybe<Notifications_Aggregate_Bool_Exp>;
  provider?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "notification_permissions" */
export enum Notification_Permissions_Constraint {
  /** unique or primary key constraint on columns "id" */
  NotificationPermissionsPkey = "notification_permissions_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Notification_Permissions_Delete_At_Path_Input = {
  /** Device information */
  device_info?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Notification_Permissions_Delete_Elem_Input = {
  /** Device information */
  device_info?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Notification_Permissions_Delete_Key_Input = {
  /** Device information */
  device_info?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "notification_permissions" */
export type Notification_Permissions_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "notification_permissions" */
export type Notification_Permissions_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Device information */
  device_info?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Device token for push notifications */
  device_token?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  notifications?: InputMaybe<Notifications_Arr_Rel_Insert_Input>;
  /** Notification provider (e.g., fcm, apns) */
  provider?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** Reference to users table */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Notification_Permissions_Max_Fields = {
  __typename?: "notification_permissions_max_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Device token for push notifications */
  device_token?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Notification provider (e.g., fcm, apns) */
  provider?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Reference to users table */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "notification_permissions" */
export type Notification_Permissions_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Device token for push notifications */
  device_token?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Notification provider (e.g., fcm, apns) */
  provider?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** Reference to users table */
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Notification_Permissions_Min_Fields = {
  __typename?: "notification_permissions_min_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Device token for push notifications */
  device_token?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Notification provider (e.g., fcm, apns) */
  provider?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Reference to users table */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "notification_permissions" */
export type Notification_Permissions_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Device token for push notifications */
  device_token?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Notification provider (e.g., fcm, apns) */
  provider?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** Reference to users table */
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "notification_permissions" */
export type Notification_Permissions_Mutation_Response = {
  __typename?: "notification_permissions_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Notification_Permissions>;
};

/** input type for inserting object relation for remote table "notification_permissions" */
export type Notification_Permissions_Obj_Rel_Insert_Input = {
  data: Notification_Permissions_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Notification_Permissions_On_Conflict>;
};

/** on_conflict condition type for table "notification_permissions" */
export type Notification_Permissions_On_Conflict = {
  constraint: Notification_Permissions_Constraint;
  update_columns?: Array<Notification_Permissions_Update_Column>;
  where?: InputMaybe<Notification_Permissions_Bool_Exp>;
};

/** Ordering options when selecting data from "notification_permissions". */
export type Notification_Permissions_Order_By = {
  created_at?: InputMaybe<Order_By>;
  device_info?: InputMaybe<Order_By>;
  device_token?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  notifications_aggregate?: InputMaybe<Notifications_Aggregate_Order_By>;
  provider?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: notification_permissions */
export type Notification_Permissions_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Notification_Permissions_Prepend_Input = {
  /** Device information */
  device_info?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "notification_permissions" */
export enum Notification_Permissions_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DeviceInfo = "device_info",
  /** column name */
  DeviceToken = "device_token",
  /** column name */
  Id = "id",
  /** column name */
  Provider = "provider",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "notification_permissions" */
export type Notification_Permissions_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Device information */
  device_info?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Device token for push notifications */
  device_token?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Notification provider (e.g., fcm, apns) */
  provider?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Reference to users table */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Notification_Permissions_Stddev_Fields = {
  __typename?: "notification_permissions_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "notification_permissions" */
export type Notification_Permissions_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Notification_Permissions_Stddev_Pop_Fields = {
  __typename?: "notification_permissions_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "notification_permissions" */
export type Notification_Permissions_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Notification_Permissions_Stddev_Samp_Fields = {
  __typename?: "notification_permissions_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "notification_permissions" */
export type Notification_Permissions_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "notification_permissions" */
export type Notification_Permissions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Notification_Permissions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Notification_Permissions_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Device information */
  device_info?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Device token for push notifications */
  device_token?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Notification provider (e.g., fcm, apns) */
  provider?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Reference to users table */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Notification_Permissions_Sum_Fields = {
  __typename?: "notification_permissions_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "notification_permissions" */
export type Notification_Permissions_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "notification_permissions" */
export enum Notification_Permissions_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DeviceInfo = "device_info",
  /** column name */
  DeviceToken = "device_token",
  /** column name */
  Id = "id",
  /** column name */
  Provider = "provider",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Notification_Permissions_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Notification_Permissions_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Notification_Permissions_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Notification_Permissions_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Notification_Permissions_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Notification_Permissions_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Notification_Permissions_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Notification_Permissions_Set_Input>;
  /** filter the rows which have to be updated */
  where: Notification_Permissions_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Notification_Permissions_Var_Pop_Fields = {
  __typename?: "notification_permissions_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "notification_permissions" */
export type Notification_Permissions_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Notification_Permissions_Var_Samp_Fields = {
  __typename?: "notification_permissions_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "notification_permissions" */
export type Notification_Permissions_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Notification_Permissions_Variance_Fields = {
  __typename?: "notification_permissions_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "notification_permissions" */
export type Notification_Permissions_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "notifications" */
export type Notifications = {
  __typename?: "notifications";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Notification configuration */
  config?: Maybe<Scalars["jsonb"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** Error message if notification failed */
  error?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** An object relationship */
  message: Notification_Messages;
  /** Reference to notification message */
  message_id: Scalars["uuid"]["output"];
  /** An object relationship */
  permission: Notification_Permissions;
  /** Reference to notification permission */
  permission_id: Scalars["uuid"]["output"];
  /** Notification status */
  status: Scalars["String"]["output"];
  updated_at: Scalars["bigint"]["output"];
};

/** columns and relationships of "notifications" */
export type NotificationsConfigArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "notifications" */
export type Notifications_Aggregate = {
  __typename?: "notifications_aggregate";
  aggregate?: Maybe<Notifications_Aggregate_Fields>;
  nodes: Array<Notifications>;
};

export type Notifications_Aggregate_Bool_Exp = {
  count?: InputMaybe<Notifications_Aggregate_Bool_Exp_Count>;
};

export type Notifications_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Notifications_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Notifications_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "notifications" */
export type Notifications_Aggregate_Fields = {
  __typename?: "notifications_aggregate_fields";
  avg?: Maybe<Notifications_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Notifications_Max_Fields>;
  min?: Maybe<Notifications_Min_Fields>;
  stddev?: Maybe<Notifications_Stddev_Fields>;
  stddev_pop?: Maybe<Notifications_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Notifications_Stddev_Samp_Fields>;
  sum?: Maybe<Notifications_Sum_Fields>;
  var_pop?: Maybe<Notifications_Var_Pop_Fields>;
  var_samp?: Maybe<Notifications_Var_Samp_Fields>;
  variance?: Maybe<Notifications_Variance_Fields>;
};

/** aggregate fields of "notifications" */
export type Notifications_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Notifications_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "notifications" */
export type Notifications_Aggregate_Order_By = {
  avg?: InputMaybe<Notifications_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Notifications_Max_Order_By>;
  min?: InputMaybe<Notifications_Min_Order_By>;
  stddev?: InputMaybe<Notifications_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Notifications_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Notifications_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Notifications_Sum_Order_By>;
  var_pop?: InputMaybe<Notifications_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Notifications_Var_Samp_Order_By>;
  variance?: InputMaybe<Notifications_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Notifications_Append_Input = {
  /** Notification configuration */
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "notifications" */
export type Notifications_Arr_Rel_Insert_Input = {
  data: Array<Notifications_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Notifications_On_Conflict>;
};

/** aggregate avg on columns */
export type Notifications_Avg_Fields = {
  __typename?: "notifications_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "notifications" */
export type Notifications_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "notifications". All fields are combined with a logical 'AND'. */
export type Notifications_Bool_Exp = {
  _and?: InputMaybe<Array<Notifications_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Notifications_Bool_Exp>;
  _or?: InputMaybe<Array<Notifications_Bool_Exp>>;
  config?: InputMaybe<Jsonb_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  error?: InputMaybe<String_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  message?: InputMaybe<Notification_Messages_Bool_Exp>;
  message_id?: InputMaybe<Uuid_Comparison_Exp>;
  permission?: InputMaybe<Notification_Permissions_Bool_Exp>;
  permission_id?: InputMaybe<Uuid_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
};

/** unique or primary key constraints on table "notifications" */
export enum Notifications_Constraint {
  /** unique or primary key constraint on columns "id" */
  NotificationsPkey = "notifications_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Notifications_Delete_At_Path_Input = {
  /** Notification configuration */
  config?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Notifications_Delete_Elem_Input = {
  /** Notification configuration */
  config?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Notifications_Delete_Key_Input = {
  /** Notification configuration */
  config?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "notifications" */
export type Notifications_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "notifications" */
export type Notifications_Insert_Input = {
  /** Notification configuration */
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Error message if notification failed */
  error?: InputMaybe<Scalars["String"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  message?: InputMaybe<Notification_Messages_Obj_Rel_Insert_Input>;
  /** Reference to notification message */
  message_id?: InputMaybe<Scalars["uuid"]["input"]>;
  permission?: InputMaybe<Notification_Permissions_Obj_Rel_Insert_Input>;
  /** Reference to notification permission */
  permission_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Notification status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate max on columns */
export type Notifications_Max_Fields = {
  __typename?: "notifications_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Error message if notification failed */
  error?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to notification message */
  message_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to notification permission */
  permission_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Notification status */
  status?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by max() on columns of table "notifications" */
export type Notifications_Max_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Error message if notification failed */
  error?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Reference to notification message */
  message_id?: InputMaybe<Order_By>;
  /** Reference to notification permission */
  permission_id?: InputMaybe<Order_By>;
  /** Notification status */
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Notifications_Min_Fields = {
  __typename?: "notifications_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Error message if notification failed */
  error?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to notification message */
  message_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to notification permission */
  permission_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Notification status */
  status?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by min() on columns of table "notifications" */
export type Notifications_Min_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Error message if notification failed */
  error?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Reference to notification message */
  message_id?: InputMaybe<Order_By>;
  /** Reference to notification permission */
  permission_id?: InputMaybe<Order_By>;
  /** Notification status */
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "notifications" */
export type Notifications_Mutation_Response = {
  __typename?: "notifications_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Notifications>;
};

/** input type for inserting object relation for remote table "notifications" */
export type Notifications_Obj_Rel_Insert_Input = {
  data: Notifications_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Notifications_On_Conflict>;
};

/** on_conflict condition type for table "notifications" */
export type Notifications_On_Conflict = {
  constraint: Notifications_Constraint;
  update_columns?: Array<Notifications_Update_Column>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};

/** Ordering options when selecting data from "notifications". */
export type Notifications_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  config?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  message?: InputMaybe<Notification_Messages_Order_By>;
  message_id?: InputMaybe<Order_By>;
  permission?: InputMaybe<Notification_Permissions_Order_By>;
  permission_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: notifications */
export type Notifications_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Notifications_Prepend_Input = {
  /** Notification configuration */
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "notifications" */
export enum Notifications_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  Config = "config",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Error = "error",
  /** column name */
  Id = "id",
  /** column name */
  MessageId = "message_id",
  /** column name */
  PermissionId = "permission_id",
  /** column name */
  Status = "status",
  /** column name */
  UpdatedAt = "updated_at",
}

/** input type for updating data in table "notifications" */
export type Notifications_Set_Input = {
  /** Notification configuration */
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Error message if notification failed */
  error?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to notification message */
  message_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to notification permission */
  permission_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Notification status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate stddev on columns */
export type Notifications_Stddev_Fields = {
  __typename?: "notifications_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "notifications" */
export type Notifications_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Notifications_Stddev_Pop_Fields = {
  __typename?: "notifications_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "notifications" */
export type Notifications_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Notifications_Stddev_Samp_Fields = {
  __typename?: "notifications_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "notifications" */
export type Notifications_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "notifications" */
export type Notifications_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Notifications_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Notifications_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Notification configuration */
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Error message if notification failed */
  error?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to notification message */
  message_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to notification permission */
  permission_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Notification status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate sum on columns */
export type Notifications_Sum_Fields = {
  __typename?: "notifications_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "notifications" */
export type Notifications_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "notifications" */
export enum Notifications_Update_Column {
  /** column name */
  Config = "config",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Error = "error",
  /** column name */
  Id = "id",
  /** column name */
  MessageId = "message_id",
  /** column name */
  PermissionId = "permission_id",
  /** column name */
  Status = "status",
  /** column name */
  UpdatedAt = "updated_at",
}

export type Notifications_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Notifications_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Notifications_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Notifications_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Notifications_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Notifications_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Notifications_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Notifications_Set_Input>;
  /** filter the rows which have to be updated */
  where: Notifications_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Notifications_Var_Pop_Fields = {
  __typename?: "notifications_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "notifications" */
export type Notifications_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Notifications_Var_Samp_Fields = {
  __typename?: "notifications_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "notifications" */
export type Notifications_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Notifications_Variance_Fields = {
  __typename?: "notifications_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "notifications" */
export type Notifications_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["numeric"]["input"]>;
  _gt?: InputMaybe<Scalars["numeric"]["input"]>;
  _gte?: InputMaybe<Scalars["numeric"]["input"]>;
  _in?: InputMaybe<Array<Scalars["numeric"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["numeric"]["input"]>;
  _lte?: InputMaybe<Scalars["numeric"]["input"]>;
  _neq?: InputMaybe<Scalars["numeric"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["numeric"]["input"]>>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = "asc",
  /** in ascending order, nulls first */
  AscNullsFirst = "asc_nulls_first",
  /** in ascending order, nulls last */
  AscNullsLast = "asc_nulls_last",
  /** in descending order, nulls first */
  Desc = "desc",
  /** in descending order, nulls first */
  DescNullsFirst = "desc_nulls_first",
  /** in descending order, nulls last */
  DescNullsLast = "desc_nulls_last",
}

/** columns and relationships of "payments.methods" */
export type Payments_Methods = {
  __typename?: "payments_methods";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** Payment method details */
  details?: Maybe<Scalars["jsonb"]["output"]>;
  /** Expiration timestamp */
  expires_at?: Maybe<Scalars["bigint"]["output"]>;
  /** External provider ID */
  external_id?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** Default method flag */
  is_default?: Maybe<Scalars["Boolean"]["output"]>;
  /** Recurrent payment ready */
  is_recurrent_ready?: Maybe<Scalars["Boolean"]["output"]>;
  /** An array relationship */
  operations: Array<Payments_Operations>;
  /** An aggregate relationship */
  operations_aggregate: Payments_Operations_Aggregate;
  /** An object relationship */
  provider: Payments_Providers;
  /** Provider ID */
  provider_id: Scalars["uuid"]["output"];
  /** Recurrent payment details */
  recurrent_details?: Maybe<Scalars["jsonb"]["output"]>;
  /** Method status */
  status?: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  subscriptions: Array<Payments_Subscriptions>;
  /** An aggregate relationship */
  subscriptions_aggregate: Payments_Subscriptions_Aggregate;
  /** Payment method type */
  type: Scalars["String"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  /** User ID */
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "payments.methods" */
export type Payments_MethodsDetailsArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "payments.methods" */
export type Payments_MethodsOperationsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Operations_Order_By>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

/** columns and relationships of "payments.methods" */
export type Payments_MethodsOperations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Operations_Order_By>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

/** columns and relationships of "payments.methods" */
export type Payments_MethodsRecurrent_DetailsArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "payments.methods" */
export type Payments_MethodsSubscriptionsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Subscriptions_Order_By>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

/** columns and relationships of "payments.methods" */
export type Payments_MethodsSubscriptions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Subscriptions_Order_By>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

/** aggregated selection of "payments.methods" */
export type Payments_Methods_Aggregate = {
  __typename?: "payments_methods_aggregate";
  aggregate?: Maybe<Payments_Methods_Aggregate_Fields>;
  nodes: Array<Payments_Methods>;
};

export type Payments_Methods_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Payments_Methods_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Payments_Methods_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Payments_Methods_Aggregate_Bool_Exp_Count>;
};

export type Payments_Methods_Aggregate_Bool_Exp_Bool_And = {
  arguments: Payments_Methods_Select_Column_Payments_Methods_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payments_Methods_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Payments_Methods_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Payments_Methods_Select_Column_Payments_Methods_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payments_Methods_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Payments_Methods_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Payments_Methods_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payments_Methods_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "payments.methods" */
export type Payments_Methods_Aggregate_Fields = {
  __typename?: "payments_methods_aggregate_fields";
  avg?: Maybe<Payments_Methods_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Payments_Methods_Max_Fields>;
  min?: Maybe<Payments_Methods_Min_Fields>;
  stddev?: Maybe<Payments_Methods_Stddev_Fields>;
  stddev_pop?: Maybe<Payments_Methods_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Payments_Methods_Stddev_Samp_Fields>;
  sum?: Maybe<Payments_Methods_Sum_Fields>;
  var_pop?: Maybe<Payments_Methods_Var_Pop_Fields>;
  var_samp?: Maybe<Payments_Methods_Var_Samp_Fields>;
  variance?: Maybe<Payments_Methods_Variance_Fields>;
};

/** aggregate fields of "payments.methods" */
export type Payments_Methods_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payments_Methods_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "payments.methods" */
export type Payments_Methods_Aggregate_Order_By = {
  avg?: InputMaybe<Payments_Methods_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Payments_Methods_Max_Order_By>;
  min?: InputMaybe<Payments_Methods_Min_Order_By>;
  stddev?: InputMaybe<Payments_Methods_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Payments_Methods_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Payments_Methods_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Payments_Methods_Sum_Order_By>;
  var_pop?: InputMaybe<Payments_Methods_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Payments_Methods_Var_Samp_Order_By>;
  variance?: InputMaybe<Payments_Methods_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Payments_Methods_Append_Input = {
  /** Payment method details */
  details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Recurrent payment details */
  recurrent_details?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "payments.methods" */
export type Payments_Methods_Arr_Rel_Insert_Input = {
  data: Array<Payments_Methods_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_Methods_On_Conflict>;
};

/** aggregate avg on columns */
export type Payments_Methods_Avg_Fields = {
  __typename?: "payments_methods_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "payments.methods" */
export type Payments_Methods_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "payments.methods". All fields are combined with a logical 'AND'. */
export type Payments_Methods_Bool_Exp = {
  _and?: InputMaybe<Array<Payments_Methods_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Payments_Methods_Bool_Exp>;
  _or?: InputMaybe<Array<Payments_Methods_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  details?: InputMaybe<Jsonb_Comparison_Exp>;
  expires_at?: InputMaybe<Bigint_Comparison_Exp>;
  external_id?: InputMaybe<String_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_default?: InputMaybe<Boolean_Comparison_Exp>;
  is_recurrent_ready?: InputMaybe<Boolean_Comparison_Exp>;
  operations?: InputMaybe<Payments_Operations_Bool_Exp>;
  operations_aggregate?: InputMaybe<Payments_Operations_Aggregate_Bool_Exp>;
  provider?: InputMaybe<Payments_Providers_Bool_Exp>;
  provider_id?: InputMaybe<Uuid_Comparison_Exp>;
  recurrent_details?: InputMaybe<Jsonb_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  subscriptions?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
  subscriptions_aggregate?: InputMaybe<Payments_Subscriptions_Aggregate_Bool_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "payments.methods" */
export enum Payments_Methods_Constraint {
  /** unique or primary key constraint on columns "id" */
  MethodsPkey = "methods_pkey",
  /** unique or primary key constraint on columns "user_id", "type", "external_id", "provider_id" */
  MethodsUserProviderExternalTypeUnique = "methods_user_provider_external_type_unique",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Payments_Methods_Delete_At_Path_Input = {
  /** Payment method details */
  details?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Recurrent payment details */
  recurrent_details?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Payments_Methods_Delete_Elem_Input = {
  /** Payment method details */
  details?: InputMaybe<Scalars["Int"]["input"]>;
  /** Recurrent payment details */
  recurrent_details?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Payments_Methods_Delete_Key_Input = {
  /** Payment method details */
  details?: InputMaybe<Scalars["String"]["input"]>;
  /** Recurrent payment details */
  recurrent_details?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "payments.methods" */
export type Payments_Methods_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "payments.methods" */
export type Payments_Methods_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Payment method details */
  details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** External provider ID */
  external_id?: InputMaybe<Scalars["String"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Default method flag */
  is_default?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Recurrent payment ready */
  is_recurrent_ready?: InputMaybe<Scalars["Boolean"]["input"]>;
  operations?: InputMaybe<Payments_Operations_Arr_Rel_Insert_Input>;
  provider?: InputMaybe<Payments_Providers_Obj_Rel_Insert_Input>;
  /** Provider ID */
  provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Recurrent payment details */
  recurrent_details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Method status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  subscriptions?: InputMaybe<Payments_Subscriptions_Arr_Rel_Insert_Input>;
  /** Payment method type */
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** User ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Payments_Methods_Max_Fields = {
  __typename?: "payments_methods_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Expiration timestamp */
  expires_at?: Maybe<Scalars["bigint"]["output"]>;
  /** External provider ID */
  external_id?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Provider ID */
  provider_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Method status */
  status?: Maybe<Scalars["String"]["output"]>;
  /** Payment method type */
  type?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "payments.methods" */
export type Payments_Methods_Max_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  /** External provider ID */
  external_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Provider ID */
  provider_id?: InputMaybe<Order_By>;
  /** Method status */
  status?: InputMaybe<Order_By>;
  /** Payment method type */
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** User ID */
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Payments_Methods_Min_Fields = {
  __typename?: "payments_methods_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Expiration timestamp */
  expires_at?: Maybe<Scalars["bigint"]["output"]>;
  /** External provider ID */
  external_id?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Provider ID */
  provider_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Method status */
  status?: Maybe<Scalars["String"]["output"]>;
  /** Payment method type */
  type?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "payments.methods" */
export type Payments_Methods_Min_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  /** External provider ID */
  external_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Provider ID */
  provider_id?: InputMaybe<Order_By>;
  /** Method status */
  status?: InputMaybe<Order_By>;
  /** Payment method type */
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** User ID */
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "payments.methods" */
export type Payments_Methods_Mutation_Response = {
  __typename?: "payments_methods_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Payments_Methods>;
};

/** input type for inserting object relation for remote table "payments.methods" */
export type Payments_Methods_Obj_Rel_Insert_Input = {
  data: Payments_Methods_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_Methods_On_Conflict>;
};

/** on_conflict condition type for table "payments.methods" */
export type Payments_Methods_On_Conflict = {
  constraint: Payments_Methods_Constraint;
  update_columns?: Array<Payments_Methods_Update_Column>;
  where?: InputMaybe<Payments_Methods_Bool_Exp>;
};

/** Ordering options when selecting data from "payments.methods". */
export type Payments_Methods_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  details?: InputMaybe<Order_By>;
  expires_at?: InputMaybe<Order_By>;
  external_id?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  is_default?: InputMaybe<Order_By>;
  is_recurrent_ready?: InputMaybe<Order_By>;
  operations_aggregate?: InputMaybe<Payments_Operations_Aggregate_Order_By>;
  provider?: InputMaybe<Payments_Providers_Order_By>;
  provider_id?: InputMaybe<Order_By>;
  recurrent_details?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  subscriptions_aggregate?: InputMaybe<Payments_Subscriptions_Aggregate_Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: payments.methods */
export type Payments_Methods_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Payments_Methods_Prepend_Input = {
  /** Payment method details */
  details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Recurrent payment details */
  recurrent_details?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "payments.methods" */
export enum Payments_Methods_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Details = "details",
  /** column name */
  ExpiresAt = "expires_at",
  /** column name */
  ExternalId = "external_id",
  /** column name */
  Id = "id",
  /** column name */
  IsDefault = "is_default",
  /** column name */
  IsRecurrentReady = "is_recurrent_ready",
  /** column name */
  ProviderId = "provider_id",
  /** column name */
  RecurrentDetails = "recurrent_details",
  /** column name */
  Status = "status",
  /** column name */
  Type = "type",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** select "payments_methods_aggregate_bool_exp_bool_and_arguments_columns" columns of table "payments.methods" */
export enum Payments_Methods_Select_Column_Payments_Methods_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsDefault = "is_default",
  /** column name */
  IsRecurrentReady = "is_recurrent_ready",
}

/** select "payments_methods_aggregate_bool_exp_bool_or_arguments_columns" columns of table "payments.methods" */
export enum Payments_Methods_Select_Column_Payments_Methods_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsDefault = "is_default",
  /** column name */
  IsRecurrentReady = "is_recurrent_ready",
}

/** input type for updating data in table "payments.methods" */
export type Payments_Methods_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Payment method details */
  details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** External provider ID */
  external_id?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Default method flag */
  is_default?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Recurrent payment ready */
  is_recurrent_ready?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Provider ID */
  provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Recurrent payment details */
  recurrent_details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Method status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  /** Payment method type */
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Payments_Methods_Stddev_Fields = {
  __typename?: "payments_methods_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "payments.methods" */
export type Payments_Methods_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Payments_Methods_Stddev_Pop_Fields = {
  __typename?: "payments_methods_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "payments.methods" */
export type Payments_Methods_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Payments_Methods_Stddev_Samp_Fields = {
  __typename?: "payments_methods_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "payments.methods" */
export type Payments_Methods_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "payments_methods" */
export type Payments_Methods_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payments_Methods_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payments_Methods_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Payment method details */
  details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** External provider ID */
  external_id?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Default method flag */
  is_default?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Recurrent payment ready */
  is_recurrent_ready?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Provider ID */
  provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Recurrent payment details */
  recurrent_details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Method status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  /** Payment method type */
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Payments_Methods_Sum_Fields = {
  __typename?: "payments_methods_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Expiration timestamp */
  expires_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "payments.methods" */
export type Payments_Methods_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "payments.methods" */
export enum Payments_Methods_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Details = "details",
  /** column name */
  ExpiresAt = "expires_at",
  /** column name */
  ExternalId = "external_id",
  /** column name */
  Id = "id",
  /** column name */
  IsDefault = "is_default",
  /** column name */
  IsRecurrentReady = "is_recurrent_ready",
  /** column name */
  ProviderId = "provider_id",
  /** column name */
  RecurrentDetails = "recurrent_details",
  /** column name */
  Status = "status",
  /** column name */
  Type = "type",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Payments_Methods_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Payments_Methods_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Payments_Methods_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Payments_Methods_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Payments_Methods_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Payments_Methods_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Payments_Methods_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payments_Methods_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payments_Methods_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Payments_Methods_Var_Pop_Fields = {
  __typename?: "payments_methods_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "payments.methods" */
export type Payments_Methods_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Payments_Methods_Var_Samp_Fields = {
  __typename?: "payments_methods_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "payments.methods" */
export type Payments_Methods_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Payments_Methods_Variance_Fields = {
  __typename?: "payments_methods_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "payments.methods" */
export type Payments_Methods_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "payments.operations" */
export type Payments_Operations = {
  __typename?: "payments_operations";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Operation amount */
  amount: Scalars["numeric"]["output"];
  created_at: Scalars["bigint"]["output"];
  /** Currency code */
  currency: Scalars["String"]["output"];
  /** Operation description */
  description?: Maybe<Scalars["String"]["output"]>;
  /** Error message */
  error_message?: Maybe<Scalars["String"]["output"]>;
  /** External operation ID */
  external_operation_id?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** Initiation timestamp */
  initiated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Operation metadata */
  metadata?: Maybe<Scalars["jsonb"]["output"]>;
  /** An object relationship */
  method?: Maybe<Payments_Methods>;
  /** Payment method ID */
  method_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Object HID */
  object_hid?: Maybe<Scalars["String"]["output"]>;
  /** Payment timestamp */
  paid_at?: Maybe<Scalars["bigint"]["output"]>;
  /** An object relationship */
  provider: Payments_Providers;
  /** Provider ID */
  provider_id: Scalars["uuid"]["output"];
  /** Provider request details */
  provider_request_details?: Maybe<Scalars["jsonb"]["output"]>;
  /** Provider response details */
  provider_response_details?: Maybe<Scalars["jsonb"]["output"]>;
  /** Operation status */
  status: Scalars["String"]["output"];
  /** An object relationship */
  subscription?: Maybe<Payments_Subscriptions>;
  /** Subscription ID */
  subscription_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  /** User ID */
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "payments.operations" */
export type Payments_OperationsMetadataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "payments.operations" */
export type Payments_OperationsProvider_Request_DetailsArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "payments.operations" */
export type Payments_OperationsProvider_Response_DetailsArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "payments.operations" */
export type Payments_Operations_Aggregate = {
  __typename?: "payments_operations_aggregate";
  aggregate?: Maybe<Payments_Operations_Aggregate_Fields>;
  nodes: Array<Payments_Operations>;
};

export type Payments_Operations_Aggregate_Bool_Exp = {
  count?: InputMaybe<Payments_Operations_Aggregate_Bool_Exp_Count>;
};

export type Payments_Operations_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payments_Operations_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "payments.operations" */
export type Payments_Operations_Aggregate_Fields = {
  __typename?: "payments_operations_aggregate_fields";
  avg?: Maybe<Payments_Operations_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Payments_Operations_Max_Fields>;
  min?: Maybe<Payments_Operations_Min_Fields>;
  stddev?: Maybe<Payments_Operations_Stddev_Fields>;
  stddev_pop?: Maybe<Payments_Operations_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Payments_Operations_Stddev_Samp_Fields>;
  sum?: Maybe<Payments_Operations_Sum_Fields>;
  var_pop?: Maybe<Payments_Operations_Var_Pop_Fields>;
  var_samp?: Maybe<Payments_Operations_Var_Samp_Fields>;
  variance?: Maybe<Payments_Operations_Variance_Fields>;
};

/** aggregate fields of "payments.operations" */
export type Payments_Operations_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "payments.operations" */
export type Payments_Operations_Aggregate_Order_By = {
  avg?: InputMaybe<Payments_Operations_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Payments_Operations_Max_Order_By>;
  min?: InputMaybe<Payments_Operations_Min_Order_By>;
  stddev?: InputMaybe<Payments_Operations_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Payments_Operations_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Payments_Operations_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Payments_Operations_Sum_Order_By>;
  var_pop?: InputMaybe<Payments_Operations_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Payments_Operations_Var_Samp_Order_By>;
  variance?: InputMaybe<Payments_Operations_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Payments_Operations_Append_Input = {
  /** Operation metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Provider request details */
  provider_request_details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Provider response details */
  provider_response_details?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "payments.operations" */
export type Payments_Operations_Arr_Rel_Insert_Input = {
  data: Array<Payments_Operations_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_Operations_On_Conflict>;
};

/** aggregate avg on columns */
export type Payments_Operations_Avg_Fields = {
  __typename?: "payments_operations_avg_fields";
  /** Operation amount */
  amount?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Initiation timestamp */
  initiated_at?: Maybe<Scalars["Float"]["output"]>;
  /** Payment timestamp */
  paid_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "payments.operations" */
export type Payments_Operations_Avg_Order_By = {
  /** Operation amount */
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Order_By>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "payments.operations". All fields are combined with a logical 'AND'. */
export type Payments_Operations_Bool_Exp = {
  _and?: InputMaybe<Array<Payments_Operations_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Payments_Operations_Bool_Exp>;
  _or?: InputMaybe<Array<Payments_Operations_Bool_Exp>>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  currency?: InputMaybe<String_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  error_message?: InputMaybe<String_Comparison_Exp>;
  external_operation_id?: InputMaybe<String_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  initiated_at?: InputMaybe<Bigint_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  method?: InputMaybe<Payments_Methods_Bool_Exp>;
  method_id?: InputMaybe<Uuid_Comparison_Exp>;
  object_hid?: InputMaybe<String_Comparison_Exp>;
  paid_at?: InputMaybe<Bigint_Comparison_Exp>;
  provider?: InputMaybe<Payments_Providers_Bool_Exp>;
  provider_id?: InputMaybe<Uuid_Comparison_Exp>;
  provider_request_details?: InputMaybe<Jsonb_Comparison_Exp>;
  provider_response_details?: InputMaybe<Jsonb_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  subscription?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
  subscription_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "payments.operations" */
export enum Payments_Operations_Constraint {
  /** unique or primary key constraint on columns "id" */
  OperationsPkey = "operations_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Payments_Operations_Delete_At_Path_Input = {
  /** Operation metadata */
  metadata?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Provider request details */
  provider_request_details?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Provider response details */
  provider_response_details?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Payments_Operations_Delete_Elem_Input = {
  /** Operation metadata */
  metadata?: InputMaybe<Scalars["Int"]["input"]>;
  /** Provider request details */
  provider_request_details?: InputMaybe<Scalars["Int"]["input"]>;
  /** Provider response details */
  provider_response_details?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Payments_Operations_Delete_Key_Input = {
  /** Operation metadata */
  metadata?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider request details */
  provider_request_details?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider response details */
  provider_response_details?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "payments.operations" */
export type Payments_Operations_Inc_Input = {
  /** Operation amount */
  amount?: InputMaybe<Scalars["numeric"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "payments.operations" */
export type Payments_Operations_Insert_Input = {
  /** Operation amount */
  amount?: InputMaybe<Scalars["numeric"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Currency code */
  currency?: InputMaybe<Scalars["String"]["input"]>;
  /** Operation description */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Error message */
  error_message?: InputMaybe<Scalars["String"]["input"]>;
  /** External operation ID */
  external_operation_id?: InputMaybe<Scalars["String"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Operation metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  method?: InputMaybe<Payments_Methods_Obj_Rel_Insert_Input>;
  /** Payment method ID */
  method_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Object HID */
  object_hid?: InputMaybe<Scalars["String"]["input"]>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Scalars["bigint"]["input"]>;
  provider?: InputMaybe<Payments_Providers_Obj_Rel_Insert_Input>;
  /** Provider ID */
  provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Provider request details */
  provider_request_details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Provider response details */
  provider_response_details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Operation status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  subscription?: InputMaybe<Payments_Subscriptions_Obj_Rel_Insert_Input>;
  /** Subscription ID */
  subscription_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** User ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Payments_Operations_Max_Fields = {
  __typename?: "payments_operations_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Operation amount */
  amount?: Maybe<Scalars["numeric"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Currency code */
  currency?: Maybe<Scalars["String"]["output"]>;
  /** Operation description */
  description?: Maybe<Scalars["String"]["output"]>;
  /** Error message */
  error_message?: Maybe<Scalars["String"]["output"]>;
  /** External operation ID */
  external_operation_id?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Initiation timestamp */
  initiated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Payment method ID */
  method_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Object HID */
  object_hid?: Maybe<Scalars["String"]["output"]>;
  /** Payment timestamp */
  paid_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Provider ID */
  provider_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Operation status */
  status?: Maybe<Scalars["String"]["output"]>;
  /** Subscription ID */
  subscription_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "payments.operations" */
export type Payments_Operations_Max_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  /** Operation amount */
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Currency code */
  currency?: InputMaybe<Order_By>;
  /** Operation description */
  description?: InputMaybe<Order_By>;
  /** Error message */
  error_message?: InputMaybe<Order_By>;
  /** External operation ID */
  external_operation_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Order_By>;
  /** Payment method ID */
  method_id?: InputMaybe<Order_By>;
  /** Object HID */
  object_hid?: InputMaybe<Order_By>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Order_By>;
  /** Provider ID */
  provider_id?: InputMaybe<Order_By>;
  /** Operation status */
  status?: InputMaybe<Order_By>;
  /** Subscription ID */
  subscription_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** User ID */
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Payments_Operations_Min_Fields = {
  __typename?: "payments_operations_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Operation amount */
  amount?: Maybe<Scalars["numeric"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Currency code */
  currency?: Maybe<Scalars["String"]["output"]>;
  /** Operation description */
  description?: Maybe<Scalars["String"]["output"]>;
  /** Error message */
  error_message?: Maybe<Scalars["String"]["output"]>;
  /** External operation ID */
  external_operation_id?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Initiation timestamp */
  initiated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Payment method ID */
  method_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Object HID */
  object_hid?: Maybe<Scalars["String"]["output"]>;
  /** Payment timestamp */
  paid_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Provider ID */
  provider_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Operation status */
  status?: Maybe<Scalars["String"]["output"]>;
  /** Subscription ID */
  subscription_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "payments.operations" */
export type Payments_Operations_Min_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  /** Operation amount */
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Currency code */
  currency?: InputMaybe<Order_By>;
  /** Operation description */
  description?: InputMaybe<Order_By>;
  /** Error message */
  error_message?: InputMaybe<Order_By>;
  /** External operation ID */
  external_operation_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Order_By>;
  /** Payment method ID */
  method_id?: InputMaybe<Order_By>;
  /** Object HID */
  object_hid?: InputMaybe<Order_By>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Order_By>;
  /** Provider ID */
  provider_id?: InputMaybe<Order_By>;
  /** Operation status */
  status?: InputMaybe<Order_By>;
  /** Subscription ID */
  subscription_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** User ID */
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "payments.operations" */
export type Payments_Operations_Mutation_Response = {
  __typename?: "payments_operations_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Payments_Operations>;
};

/** input type for inserting object relation for remote table "payments.operations" */
export type Payments_Operations_Obj_Rel_Insert_Input = {
  data: Payments_Operations_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_Operations_On_Conflict>;
};

/** on_conflict condition type for table "payments.operations" */
export type Payments_Operations_On_Conflict = {
  constraint: Payments_Operations_Constraint;
  update_columns?: Array<Payments_Operations_Update_Column>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

/** Ordering options when selecting data from "payments.operations". */
export type Payments_Operations_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  currency?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  error_message?: InputMaybe<Order_By>;
  external_operation_id?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  initiated_at?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  method?: InputMaybe<Payments_Methods_Order_By>;
  method_id?: InputMaybe<Order_By>;
  object_hid?: InputMaybe<Order_By>;
  paid_at?: InputMaybe<Order_By>;
  provider?: InputMaybe<Payments_Providers_Order_By>;
  provider_id?: InputMaybe<Order_By>;
  provider_request_details?: InputMaybe<Order_By>;
  provider_response_details?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  subscription?: InputMaybe<Payments_Subscriptions_Order_By>;
  subscription_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: payments.operations */
export type Payments_Operations_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Payments_Operations_Prepend_Input = {
  /** Operation metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Provider request details */
  provider_request_details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Provider response details */
  provider_response_details?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "payments.operations" */
export enum Payments_Operations_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  Amount = "amount",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Currency = "currency",
  /** column name */
  Description = "description",
  /** column name */
  ErrorMessage = "error_message",
  /** column name */
  ExternalOperationId = "external_operation_id",
  /** column name */
  Id = "id",
  /** column name */
  InitiatedAt = "initiated_at",
  /** column name */
  Metadata = "metadata",
  /** column name */
  MethodId = "method_id",
  /** column name */
  ObjectHid = "object_hid",
  /** column name */
  PaidAt = "paid_at",
  /** column name */
  ProviderId = "provider_id",
  /** column name */
  ProviderRequestDetails = "provider_request_details",
  /** column name */
  ProviderResponseDetails = "provider_response_details",
  /** column name */
  Status = "status",
  /** column name */
  SubscriptionId = "subscription_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "payments.operations" */
export type Payments_Operations_Set_Input = {
  /** Operation amount */
  amount?: InputMaybe<Scalars["numeric"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Currency code */
  currency?: InputMaybe<Scalars["String"]["input"]>;
  /** Operation description */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Error message */
  error_message?: InputMaybe<Scalars["String"]["input"]>;
  /** External operation ID */
  external_operation_id?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Operation metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Payment method ID */
  method_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Object HID */
  object_hid?: InputMaybe<Scalars["String"]["input"]>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Provider ID */
  provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Provider request details */
  provider_request_details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Provider response details */
  provider_response_details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Operation status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  /** Subscription ID */
  subscription_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Payments_Operations_Stddev_Fields = {
  __typename?: "payments_operations_stddev_fields";
  /** Operation amount */
  amount?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Initiation timestamp */
  initiated_at?: Maybe<Scalars["Float"]["output"]>;
  /** Payment timestamp */
  paid_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "payments.operations" */
export type Payments_Operations_Stddev_Order_By = {
  /** Operation amount */
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Order_By>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Payments_Operations_Stddev_Pop_Fields = {
  __typename?: "payments_operations_stddev_pop_fields";
  /** Operation amount */
  amount?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Initiation timestamp */
  initiated_at?: Maybe<Scalars["Float"]["output"]>;
  /** Payment timestamp */
  paid_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "payments.operations" */
export type Payments_Operations_Stddev_Pop_Order_By = {
  /** Operation amount */
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Order_By>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Payments_Operations_Stddev_Samp_Fields = {
  __typename?: "payments_operations_stddev_samp_fields";
  /** Operation amount */
  amount?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Initiation timestamp */
  initiated_at?: Maybe<Scalars["Float"]["output"]>;
  /** Payment timestamp */
  paid_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "payments.operations" */
export type Payments_Operations_Stddev_Samp_Order_By = {
  /** Operation amount */
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Order_By>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "payments_operations" */
export type Payments_Operations_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payments_Operations_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payments_Operations_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Operation amount */
  amount?: InputMaybe<Scalars["numeric"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Currency code */
  currency?: InputMaybe<Scalars["String"]["input"]>;
  /** Operation description */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Error message */
  error_message?: InputMaybe<Scalars["String"]["input"]>;
  /** External operation ID */
  external_operation_id?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Operation metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Payment method ID */
  method_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Object HID */
  object_hid?: InputMaybe<Scalars["String"]["input"]>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Provider ID */
  provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Provider request details */
  provider_request_details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Provider response details */
  provider_response_details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Operation status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  /** Subscription ID */
  subscription_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Payments_Operations_Sum_Fields = {
  __typename?: "payments_operations_sum_fields";
  /** Operation amount */
  amount?: Maybe<Scalars["numeric"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Initiation timestamp */
  initiated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Payment timestamp */
  paid_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "payments.operations" */
export type Payments_Operations_Sum_Order_By = {
  /** Operation amount */
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Order_By>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "payments.operations" */
export enum Payments_Operations_Update_Column {
  /** column name */
  Amount = "amount",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Currency = "currency",
  /** column name */
  Description = "description",
  /** column name */
  ErrorMessage = "error_message",
  /** column name */
  ExternalOperationId = "external_operation_id",
  /** column name */
  Id = "id",
  /** column name */
  InitiatedAt = "initiated_at",
  /** column name */
  Metadata = "metadata",
  /** column name */
  MethodId = "method_id",
  /** column name */
  ObjectHid = "object_hid",
  /** column name */
  PaidAt = "paid_at",
  /** column name */
  ProviderId = "provider_id",
  /** column name */
  ProviderRequestDetails = "provider_request_details",
  /** column name */
  ProviderResponseDetails = "provider_response_details",
  /** column name */
  Status = "status",
  /** column name */
  SubscriptionId = "subscription_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Payments_Operations_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Payments_Operations_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Payments_Operations_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Payments_Operations_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Payments_Operations_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Payments_Operations_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Payments_Operations_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payments_Operations_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payments_Operations_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Payments_Operations_Var_Pop_Fields = {
  __typename?: "payments_operations_var_pop_fields";
  /** Operation amount */
  amount?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Initiation timestamp */
  initiated_at?: Maybe<Scalars["Float"]["output"]>;
  /** Payment timestamp */
  paid_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "payments.operations" */
export type Payments_Operations_Var_Pop_Order_By = {
  /** Operation amount */
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Order_By>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Payments_Operations_Var_Samp_Fields = {
  __typename?: "payments_operations_var_samp_fields";
  /** Operation amount */
  amount?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Initiation timestamp */
  initiated_at?: Maybe<Scalars["Float"]["output"]>;
  /** Payment timestamp */
  paid_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "payments.operations" */
export type Payments_Operations_Var_Samp_Order_By = {
  /** Operation amount */
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Order_By>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Payments_Operations_Variance_Fields = {
  __typename?: "payments_operations_variance_fields";
  /** Operation amount */
  amount?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Initiation timestamp */
  initiated_at?: Maybe<Scalars["Float"]["output"]>;
  /** Payment timestamp */
  paid_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "payments.operations" */
export type Payments_Operations_Variance_Order_By = {
  /** Operation amount */
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Order_By>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "payments.plans" */
export type Payments_Plans = {
  __typename?: "payments_plans";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Plan active status */
  active?: Maybe<Scalars["Boolean"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** Currency code */
  currency: Scalars["String"]["output"];
  /** Plan description */
  description?: Maybe<Scalars["String"]["output"]>;
  /** Plan features */
  features?: Maybe<Scalars["jsonb"]["output"]>;
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** Billing interval: "minute", "hour", "day", "week", "month", "year" */
  interval: Scalars["String"]["output"];
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count: Scalars["Int"]["output"];
  /** Plan metadata */
  metadata?: Maybe<Scalars["jsonb"]["output"]>;
  /** Plan name */
  name: Scalars["String"]["output"];
  /** Plan price */
  price: Scalars["numeric"]["output"];
  /** An array relationship */
  subscriptions: Array<Payments_Subscriptions>;
  /** An aggregate relationship */
  subscriptions_aggregate: Payments_Subscriptions_Aggregate;
  /** Trial period in days */
  trial_period_days?: Maybe<Scalars["Int"]["output"]>;
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user?: Maybe<Users>;
  /** Plan creator user ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** columns and relationships of "payments.plans" */
export type Payments_PlansFeaturesArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "payments.plans" */
export type Payments_PlansMetadataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "payments.plans" */
export type Payments_PlansSubscriptionsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Subscriptions_Order_By>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

/** columns and relationships of "payments.plans" */
export type Payments_PlansSubscriptions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Subscriptions_Order_By>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

/** aggregated selection of "payments.plans" */
export type Payments_Plans_Aggregate = {
  __typename?: "payments_plans_aggregate";
  aggregate?: Maybe<Payments_Plans_Aggregate_Fields>;
  nodes: Array<Payments_Plans>;
};

/** aggregate fields of "payments.plans" */
export type Payments_Plans_Aggregate_Fields = {
  __typename?: "payments_plans_aggregate_fields";
  avg?: Maybe<Payments_Plans_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Payments_Plans_Max_Fields>;
  min?: Maybe<Payments_Plans_Min_Fields>;
  stddev?: Maybe<Payments_Plans_Stddev_Fields>;
  stddev_pop?: Maybe<Payments_Plans_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Payments_Plans_Stddev_Samp_Fields>;
  sum?: Maybe<Payments_Plans_Sum_Fields>;
  var_pop?: Maybe<Payments_Plans_Var_Pop_Fields>;
  var_samp?: Maybe<Payments_Plans_Var_Samp_Fields>;
  variance?: Maybe<Payments_Plans_Variance_Fields>;
};

/** aggregate fields of "payments.plans" */
export type Payments_Plans_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payments_Plans_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Payments_Plans_Append_Input = {
  /** Plan features */
  features?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Plan metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate avg on columns */
export type Payments_Plans_Avg_Fields = {
  __typename?: "payments_plans_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: Maybe<Scalars["Float"]["output"]>;
  /** Plan price */
  price?: Maybe<Scalars["Float"]["output"]>;
  /** Trial period in days */
  trial_period_days?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "payments.plans". All fields are combined with a logical 'AND'. */
export type Payments_Plans_Bool_Exp = {
  _and?: InputMaybe<Array<Payments_Plans_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Payments_Plans_Bool_Exp>;
  _or?: InputMaybe<Array<Payments_Plans_Bool_Exp>>;
  active?: InputMaybe<Boolean_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  currency?: InputMaybe<String_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  features?: InputMaybe<Jsonb_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  interval?: InputMaybe<String_Comparison_Exp>;
  interval_count?: InputMaybe<Int_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  price?: InputMaybe<Numeric_Comparison_Exp>;
  subscriptions?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
  subscriptions_aggregate?: InputMaybe<Payments_Subscriptions_Aggregate_Bool_Exp>;
  trial_period_days?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "payments.plans" */
export enum Payments_Plans_Constraint {
  /** unique or primary key constraint on columns "id" */
  PlansPkey = "plans_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Payments_Plans_Delete_At_Path_Input = {
  /** Plan features */
  features?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Plan metadata */
  metadata?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Payments_Plans_Delete_Elem_Input = {
  /** Plan features */
  features?: InputMaybe<Scalars["Int"]["input"]>;
  /** Plan metadata */
  metadata?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Payments_Plans_Delete_Key_Input = {
  /** Plan features */
  features?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan metadata */
  metadata?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "payments.plans" */
export type Payments_Plans_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: InputMaybe<Scalars["Int"]["input"]>;
  /** Plan price */
  price?: InputMaybe<Scalars["numeric"]["input"]>;
  /** Trial period in days */
  trial_period_days?: InputMaybe<Scalars["Int"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "payments.plans" */
export type Payments_Plans_Insert_Input = {
  /** Plan active status */
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Currency code */
  currency?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan description */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan features */
  features?: InputMaybe<Scalars["jsonb"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Billing interval: "minute", "hour", "day", "week", "month", "year" */
  interval?: InputMaybe<Scalars["String"]["input"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: InputMaybe<Scalars["Int"]["input"]>;
  /** Plan metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Plan name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan price */
  price?: InputMaybe<Scalars["numeric"]["input"]>;
  subscriptions?: InputMaybe<Payments_Subscriptions_Arr_Rel_Insert_Input>;
  /** Trial period in days */
  trial_period_days?: InputMaybe<Scalars["Int"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** Plan creator user ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Payments_Plans_Max_Fields = {
  __typename?: "payments_plans_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Currency code */
  currency?: Maybe<Scalars["String"]["output"]>;
  /** Plan description */
  description?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Billing interval: "minute", "hour", "day", "week", "month", "year" */
  interval?: Maybe<Scalars["String"]["output"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: Maybe<Scalars["Int"]["output"]>;
  /** Plan name */
  name?: Maybe<Scalars["String"]["output"]>;
  /** Plan price */
  price?: Maybe<Scalars["numeric"]["output"]>;
  /** Trial period in days */
  trial_period_days?: Maybe<Scalars["Int"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Plan creator user ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type Payments_Plans_Min_Fields = {
  __typename?: "payments_plans_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Currency code */
  currency?: Maybe<Scalars["String"]["output"]>;
  /** Plan description */
  description?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Billing interval: "minute", "hour", "day", "week", "month", "year" */
  interval?: Maybe<Scalars["String"]["output"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: Maybe<Scalars["Int"]["output"]>;
  /** Plan name */
  name?: Maybe<Scalars["String"]["output"]>;
  /** Plan price */
  price?: Maybe<Scalars["numeric"]["output"]>;
  /** Trial period in days */
  trial_period_days?: Maybe<Scalars["Int"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Plan creator user ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "payments.plans" */
export type Payments_Plans_Mutation_Response = {
  __typename?: "payments_plans_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Payments_Plans>;
};

/** input type for inserting object relation for remote table "payments.plans" */
export type Payments_Plans_Obj_Rel_Insert_Input = {
  data: Payments_Plans_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_Plans_On_Conflict>;
};

/** on_conflict condition type for table "payments.plans" */
export type Payments_Plans_On_Conflict = {
  constraint: Payments_Plans_Constraint;
  update_columns?: Array<Payments_Plans_Update_Column>;
  where?: InputMaybe<Payments_Plans_Bool_Exp>;
};

/** Ordering options when selecting data from "payments.plans". */
export type Payments_Plans_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  active?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  currency?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  features?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  interval?: InputMaybe<Order_By>;
  interval_count?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  price?: InputMaybe<Order_By>;
  subscriptions_aggregate?: InputMaybe<Payments_Subscriptions_Aggregate_Order_By>;
  trial_period_days?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: payments.plans */
export type Payments_Plans_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Payments_Plans_Prepend_Input = {
  /** Plan features */
  features?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Plan metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "payments.plans" */
export enum Payments_Plans_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  Active = "active",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Currency = "currency",
  /** column name */
  Description = "description",
  /** column name */
  Features = "features",
  /** column name */
  Id = "id",
  /** column name */
  Interval = "interval",
  /** column name */
  IntervalCount = "interval_count",
  /** column name */
  Metadata = "metadata",
  /** column name */
  Name = "name",
  /** column name */
  Price = "price",
  /** column name */
  TrialPeriodDays = "trial_period_days",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "payments.plans" */
export type Payments_Plans_Set_Input = {
  /** Plan active status */
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Currency code */
  currency?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan description */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan features */
  features?: InputMaybe<Scalars["jsonb"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Billing interval: "minute", "hour", "day", "week", "month", "year" */
  interval?: InputMaybe<Scalars["String"]["input"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: InputMaybe<Scalars["Int"]["input"]>;
  /** Plan metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Plan name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan price */
  price?: InputMaybe<Scalars["numeric"]["input"]>;
  /** Trial period in days */
  trial_period_days?: InputMaybe<Scalars["Int"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Plan creator user ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Payments_Plans_Stddev_Fields = {
  __typename?: "payments_plans_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: Maybe<Scalars["Float"]["output"]>;
  /** Plan price */
  price?: Maybe<Scalars["Float"]["output"]>;
  /** Trial period in days */
  trial_period_days?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Payments_Plans_Stddev_Pop_Fields = {
  __typename?: "payments_plans_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: Maybe<Scalars["Float"]["output"]>;
  /** Plan price */
  price?: Maybe<Scalars["Float"]["output"]>;
  /** Trial period in days */
  trial_period_days?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Payments_Plans_Stddev_Samp_Fields = {
  __typename?: "payments_plans_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: Maybe<Scalars["Float"]["output"]>;
  /** Plan price */
  price?: Maybe<Scalars["Float"]["output"]>;
  /** Trial period in days */
  trial_period_days?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "payments_plans" */
export type Payments_Plans_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payments_Plans_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payments_Plans_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan active status */
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Currency code */
  currency?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan description */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan features */
  features?: InputMaybe<Scalars["jsonb"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Billing interval: "minute", "hour", "day", "week", "month", "year" */
  interval?: InputMaybe<Scalars["String"]["input"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: InputMaybe<Scalars["Int"]["input"]>;
  /** Plan metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Plan name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan price */
  price?: InputMaybe<Scalars["numeric"]["input"]>;
  /** Trial period in days */
  trial_period_days?: InputMaybe<Scalars["Int"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Plan creator user ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Payments_Plans_Sum_Fields = {
  __typename?: "payments_plans_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: Maybe<Scalars["Int"]["output"]>;
  /** Plan price */
  price?: Maybe<Scalars["numeric"]["output"]>;
  /** Trial period in days */
  trial_period_days?: Maybe<Scalars["Int"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "payments.plans" */
export enum Payments_Plans_Update_Column {
  /** column name */
  Active = "active",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Currency = "currency",
  /** column name */
  Description = "description",
  /** column name */
  Features = "features",
  /** column name */
  Id = "id",
  /** column name */
  Interval = "interval",
  /** column name */
  IntervalCount = "interval_count",
  /** column name */
  Metadata = "metadata",
  /** column name */
  Name = "name",
  /** column name */
  Price = "price",
  /** column name */
  TrialPeriodDays = "trial_period_days",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Payments_Plans_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Payments_Plans_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Payments_Plans_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Payments_Plans_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Payments_Plans_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Payments_Plans_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Payments_Plans_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payments_Plans_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payments_Plans_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Payments_Plans_Var_Pop_Fields = {
  __typename?: "payments_plans_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: Maybe<Scalars["Float"]["output"]>;
  /** Plan price */
  price?: Maybe<Scalars["Float"]["output"]>;
  /** Trial period in days */
  trial_period_days?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Payments_Plans_Var_Samp_Fields = {
  __typename?: "payments_plans_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: Maybe<Scalars["Float"]["output"]>;
  /** Plan price */
  price?: Maybe<Scalars["Float"]["output"]>;
  /** Trial period in days */
  trial_period_days?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Payments_Plans_Variance_Fields = {
  __typename?: "payments_plans_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: Maybe<Scalars["Float"]["output"]>;
  /** Plan price */
  price?: Maybe<Scalars["Float"]["output"]>;
  /** Trial period in days */
  trial_period_days?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "payments.providers" */
export type Payments_Providers = {
  __typename?: "payments_providers";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Provider configuration */
  config?: Maybe<Scalars["jsonb"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** Default card webhook URL */
  default_card_webhook_url?: Maybe<Scalars["String"]["output"]>;
  /** Default return URL */
  default_return_url?: Maybe<Scalars["String"]["output"]>;
  /** Default webhook URL */
  default_webhook_url?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** Active status */
  is_active?: Maybe<Scalars["Boolean"]["output"]>;
  /** Test mode flag */
  is_test_mode?: Maybe<Scalars["Boolean"]["output"]>;
  /** An array relationship */
  methods: Array<Payments_Methods>;
  /** An aggregate relationship */
  methods_aggregate: Payments_Methods_Aggregate;
  /** Provider name */
  name?: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  operations: Array<Payments_Operations>;
  /** An aggregate relationship */
  operations_aggregate: Payments_Operations_Aggregate;
  /** An array relationship */
  subscriptions: Array<Payments_Subscriptions>;
  /** An aggregate relationship */
  subscriptions_aggregate: Payments_Subscriptions_Aggregate;
  /** Provider type */
  type?: Maybe<Scalars["String"]["output"]>;
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user?: Maybe<Users>;
  /** Owner user ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
  /** An array relationship */
  user_mappings: Array<Payments_User_Payment_Provider_Mappings>;
  /** An aggregate relationship */
  user_mappings_aggregate: Payments_User_Payment_Provider_Mappings_Aggregate;
};

/** columns and relationships of "payments.providers" */
export type Payments_ProvidersConfigArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "payments.providers" */
export type Payments_ProvidersMethodsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Methods_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Methods_Order_By>>;
  where?: InputMaybe<Payments_Methods_Bool_Exp>;
};

/** columns and relationships of "payments.providers" */
export type Payments_ProvidersMethods_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Methods_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Methods_Order_By>>;
  where?: InputMaybe<Payments_Methods_Bool_Exp>;
};

/** columns and relationships of "payments.providers" */
export type Payments_ProvidersOperationsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Operations_Order_By>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

/** columns and relationships of "payments.providers" */
export type Payments_ProvidersOperations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Operations_Order_By>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

/** columns and relationships of "payments.providers" */
export type Payments_ProvidersSubscriptionsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Subscriptions_Order_By>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

/** columns and relationships of "payments.providers" */
export type Payments_ProvidersSubscriptions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Subscriptions_Order_By>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

/** columns and relationships of "payments.providers" */
export type Payments_ProvidersUser_MappingsArgs = {
  distinct_on?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Select_Column>
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Order_By>
  >;
  where?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
};

/** columns and relationships of "payments.providers" */
export type Payments_ProvidersUser_Mappings_AggregateArgs = {
  distinct_on?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Select_Column>
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Order_By>
  >;
  where?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
};

/** aggregated selection of "payments.providers" */
export type Payments_Providers_Aggregate = {
  __typename?: "payments_providers_aggregate";
  aggregate?: Maybe<Payments_Providers_Aggregate_Fields>;
  nodes: Array<Payments_Providers>;
};

/** aggregate fields of "payments.providers" */
export type Payments_Providers_Aggregate_Fields = {
  __typename?: "payments_providers_aggregate_fields";
  avg?: Maybe<Payments_Providers_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Payments_Providers_Max_Fields>;
  min?: Maybe<Payments_Providers_Min_Fields>;
  stddev?: Maybe<Payments_Providers_Stddev_Fields>;
  stddev_pop?: Maybe<Payments_Providers_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Payments_Providers_Stddev_Samp_Fields>;
  sum?: Maybe<Payments_Providers_Sum_Fields>;
  var_pop?: Maybe<Payments_Providers_Var_Pop_Fields>;
  var_samp?: Maybe<Payments_Providers_Var_Samp_Fields>;
  variance?: Maybe<Payments_Providers_Variance_Fields>;
};

/** aggregate fields of "payments.providers" */
export type Payments_Providers_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payments_Providers_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Payments_Providers_Append_Input = {
  /** Provider configuration */
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate avg on columns */
export type Payments_Providers_Avg_Fields = {
  __typename?: "payments_providers_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "payments.providers". All fields are combined with a logical 'AND'. */
export type Payments_Providers_Bool_Exp = {
  _and?: InputMaybe<Array<Payments_Providers_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Payments_Providers_Bool_Exp>;
  _or?: InputMaybe<Array<Payments_Providers_Bool_Exp>>;
  config?: InputMaybe<Jsonb_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  default_card_webhook_url?: InputMaybe<String_Comparison_Exp>;
  default_return_url?: InputMaybe<String_Comparison_Exp>;
  default_webhook_url?: InputMaybe<String_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  is_test_mode?: InputMaybe<Boolean_Comparison_Exp>;
  methods?: InputMaybe<Payments_Methods_Bool_Exp>;
  methods_aggregate?: InputMaybe<Payments_Methods_Aggregate_Bool_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  operations?: InputMaybe<Payments_Operations_Bool_Exp>;
  operations_aggregate?: InputMaybe<Payments_Operations_Aggregate_Bool_Exp>;
  subscriptions?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
  subscriptions_aggregate?: InputMaybe<Payments_Subscriptions_Aggregate_Bool_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
  user_mappings?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
  user_mappings_aggregate?: InputMaybe<Payments_User_Payment_Provider_Mappings_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "payments.providers" */
export enum Payments_Providers_Constraint {
  /** unique or primary key constraint on columns "type", "is_test_mode", "name" */
  ProvidersNameTypeTestModeUnique = "providers_name_type_test_mode_unique",
  /** unique or primary key constraint on columns "id" */
  ProvidersPkey = "providers_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Payments_Providers_Delete_At_Path_Input = {
  /** Provider configuration */
  config?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Payments_Providers_Delete_Elem_Input = {
  /** Provider configuration */
  config?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Payments_Providers_Delete_Key_Input = {
  /** Provider configuration */
  config?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "payments.providers" */
export type Payments_Providers_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "payments.providers" */
export type Payments_Providers_Insert_Input = {
  /** Provider configuration */
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Default card webhook URL */
  default_card_webhook_url?: InputMaybe<Scalars["String"]["input"]>;
  /** Default return URL */
  default_return_url?: InputMaybe<Scalars["String"]["input"]>;
  /** Default webhook URL */
  default_webhook_url?: InputMaybe<Scalars["String"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Active status */
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Test mode flag */
  is_test_mode?: InputMaybe<Scalars["Boolean"]["input"]>;
  methods?: InputMaybe<Payments_Methods_Arr_Rel_Insert_Input>;
  /** Provider name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  operations?: InputMaybe<Payments_Operations_Arr_Rel_Insert_Input>;
  subscriptions?: InputMaybe<Payments_Subscriptions_Arr_Rel_Insert_Input>;
  /** Provider type */
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** Owner user ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  user_mappings?: InputMaybe<Payments_User_Payment_Provider_Mappings_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Payments_Providers_Max_Fields = {
  __typename?: "payments_providers_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Default card webhook URL */
  default_card_webhook_url?: Maybe<Scalars["String"]["output"]>;
  /** Default return URL */
  default_return_url?: Maybe<Scalars["String"]["output"]>;
  /** Default webhook URL */
  default_webhook_url?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Provider name */
  name?: Maybe<Scalars["String"]["output"]>;
  /** Provider type */
  type?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Owner user ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type Payments_Providers_Min_Fields = {
  __typename?: "payments_providers_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Default card webhook URL */
  default_card_webhook_url?: Maybe<Scalars["String"]["output"]>;
  /** Default return URL */
  default_return_url?: Maybe<Scalars["String"]["output"]>;
  /** Default webhook URL */
  default_webhook_url?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Provider name */
  name?: Maybe<Scalars["String"]["output"]>;
  /** Provider type */
  type?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Owner user ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "payments.providers" */
export type Payments_Providers_Mutation_Response = {
  __typename?: "payments_providers_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Payments_Providers>;
};

/** input type for inserting object relation for remote table "payments.providers" */
export type Payments_Providers_Obj_Rel_Insert_Input = {
  data: Payments_Providers_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_Providers_On_Conflict>;
};

/** on_conflict condition type for table "payments.providers" */
export type Payments_Providers_On_Conflict = {
  constraint: Payments_Providers_Constraint;
  update_columns?: Array<Payments_Providers_Update_Column>;
  where?: InputMaybe<Payments_Providers_Bool_Exp>;
};

/** Ordering options when selecting data from "payments.providers". */
export type Payments_Providers_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  config?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  default_card_webhook_url?: InputMaybe<Order_By>;
  default_return_url?: InputMaybe<Order_By>;
  default_webhook_url?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  is_test_mode?: InputMaybe<Order_By>;
  methods_aggregate?: InputMaybe<Payments_Methods_Aggregate_Order_By>;
  name?: InputMaybe<Order_By>;
  operations_aggregate?: InputMaybe<Payments_Operations_Aggregate_Order_By>;
  subscriptions_aggregate?: InputMaybe<Payments_Subscriptions_Aggregate_Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
  user_mappings_aggregate?: InputMaybe<Payments_User_Payment_Provider_Mappings_Aggregate_Order_By>;
};

/** primary key columns input for table: payments.providers */
export type Payments_Providers_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Payments_Providers_Prepend_Input = {
  /** Provider configuration */
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "payments.providers" */
export enum Payments_Providers_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  Config = "config",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DefaultCardWebhookUrl = "default_card_webhook_url",
  /** column name */
  DefaultReturnUrl = "default_return_url",
  /** column name */
  DefaultWebhookUrl = "default_webhook_url",
  /** column name */
  Id = "id",
  /** column name */
  IsActive = "is_active",
  /** column name */
  IsTestMode = "is_test_mode",
  /** column name */
  Name = "name",
  /** column name */
  Type = "type",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "payments.providers" */
export type Payments_Providers_Set_Input = {
  /** Provider configuration */
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Default card webhook URL */
  default_card_webhook_url?: InputMaybe<Scalars["String"]["input"]>;
  /** Default return URL */
  default_return_url?: InputMaybe<Scalars["String"]["input"]>;
  /** Default webhook URL */
  default_webhook_url?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Active status */
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Test mode flag */
  is_test_mode?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Provider name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider type */
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Owner user ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Payments_Providers_Stddev_Fields = {
  __typename?: "payments_providers_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Payments_Providers_Stddev_Pop_Fields = {
  __typename?: "payments_providers_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Payments_Providers_Stddev_Samp_Fields = {
  __typename?: "payments_providers_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "payments_providers" */
export type Payments_Providers_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payments_Providers_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payments_Providers_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider configuration */
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Default card webhook URL */
  default_card_webhook_url?: InputMaybe<Scalars["String"]["input"]>;
  /** Default return URL */
  default_return_url?: InputMaybe<Scalars["String"]["input"]>;
  /** Default webhook URL */
  default_webhook_url?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Active status */
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Test mode flag */
  is_test_mode?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Provider name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider type */
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Owner user ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Payments_Providers_Sum_Fields = {
  __typename?: "payments_providers_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "payments.providers" */
export enum Payments_Providers_Update_Column {
  /** column name */
  Config = "config",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DefaultCardWebhookUrl = "default_card_webhook_url",
  /** column name */
  DefaultReturnUrl = "default_return_url",
  /** column name */
  DefaultWebhookUrl = "default_webhook_url",
  /** column name */
  Id = "id",
  /** column name */
  IsActive = "is_active",
  /** column name */
  IsTestMode = "is_test_mode",
  /** column name */
  Name = "name",
  /** column name */
  Type = "type",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Payments_Providers_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Payments_Providers_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Payments_Providers_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Payments_Providers_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Payments_Providers_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Payments_Providers_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Payments_Providers_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payments_Providers_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payments_Providers_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Payments_Providers_Var_Pop_Fields = {
  __typename?: "payments_providers_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Payments_Providers_Var_Samp_Fields = {
  __typename?: "payments_providers_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Payments_Providers_Variance_Fields = {
  __typename?: "payments_providers_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "payments.subscriptions" */
export type Payments_Subscriptions = {
  __typename?: "payments_subscriptions";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: Maybe<Scalars["Int"]["output"]>;
  /** Cancel at period end flag */
  cancel_at_period_end?: Maybe<Scalars["Boolean"]["output"]>;
  /** Cancellation timestamp */
  canceled_at?: Maybe<Scalars["bigint"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** Current period end */
  current_period_end?: Maybe<Scalars["bigint"]["output"]>;
  /** Current period start */
  current_period_start?: Maybe<Scalars["bigint"]["output"]>;
  /** End timestamp */
  ended_at?: Maybe<Scalars["bigint"]["output"]>;
  /** External subscription ID */
  external_subscription_id?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** Last successful billing date timestamp */
  last_billing_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: Maybe<Scalars["Int"]["output"]>;
  /** Subscription metadata */
  metadata?: Maybe<Scalars["jsonb"]["output"]>;
  /** An object relationship */
  method: Payments_Methods;
  /** Payment method ID */
  method_id: Scalars["uuid"]["output"];
  /** Next billing date timestamp */
  next_billing_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Object HID */
  object_hid?: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  operations: Array<Payments_Operations>;
  /** An aggregate relationship */
  operations_aggregate: Payments_Operations_Aggregate;
  /** An object relationship */
  plan?: Maybe<Payments_Plans>;
  /** Plan ID */
  plan_id?: Maybe<Scalars["uuid"]["output"]>;
  /** An object relationship */
  provider: Payments_Providers;
  /** Provider ID */
  provider_id: Scalars["uuid"]["output"];
  /** Subscription status */
  status: Scalars["String"]["output"];
  /** Trial end timestamp */
  trial_ends_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  /** User ID */
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "payments.subscriptions" */
export type Payments_SubscriptionsMetadataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "payments.subscriptions" */
export type Payments_SubscriptionsOperationsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Operations_Order_By>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

/** columns and relationships of "payments.subscriptions" */
export type Payments_SubscriptionsOperations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Operations_Order_By>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

/** aggregated selection of "payments.subscriptions" */
export type Payments_Subscriptions_Aggregate = {
  __typename?: "payments_subscriptions_aggregate";
  aggregate?: Maybe<Payments_Subscriptions_Aggregate_Fields>;
  nodes: Array<Payments_Subscriptions>;
};

export type Payments_Subscriptions_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Payments_Subscriptions_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Payments_Subscriptions_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Payments_Subscriptions_Aggregate_Bool_Exp_Count>;
};

export type Payments_Subscriptions_Aggregate_Bool_Exp_Bool_And = {
  arguments: Payments_Subscriptions_Select_Column_Payments_Subscriptions_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Payments_Subscriptions_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Payments_Subscriptions_Select_Column_Payments_Subscriptions_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Payments_Subscriptions_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "payments.subscriptions" */
export type Payments_Subscriptions_Aggregate_Fields = {
  __typename?: "payments_subscriptions_aggregate_fields";
  avg?: Maybe<Payments_Subscriptions_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Payments_Subscriptions_Max_Fields>;
  min?: Maybe<Payments_Subscriptions_Min_Fields>;
  stddev?: Maybe<Payments_Subscriptions_Stddev_Fields>;
  stddev_pop?: Maybe<Payments_Subscriptions_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Payments_Subscriptions_Stddev_Samp_Fields>;
  sum?: Maybe<Payments_Subscriptions_Sum_Fields>;
  var_pop?: Maybe<Payments_Subscriptions_Var_Pop_Fields>;
  var_samp?: Maybe<Payments_Subscriptions_Var_Samp_Fields>;
  variance?: Maybe<Payments_Subscriptions_Variance_Fields>;
};

/** aggregate fields of "payments.subscriptions" */
export type Payments_Subscriptions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "payments.subscriptions" */
export type Payments_Subscriptions_Aggregate_Order_By = {
  avg?: InputMaybe<Payments_Subscriptions_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Payments_Subscriptions_Max_Order_By>;
  min?: InputMaybe<Payments_Subscriptions_Min_Order_By>;
  stddev?: InputMaybe<Payments_Subscriptions_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Payments_Subscriptions_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Payments_Subscriptions_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Payments_Subscriptions_Sum_Order_By>;
  var_pop?: InputMaybe<Payments_Subscriptions_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Payments_Subscriptions_Var_Samp_Order_By>;
  variance?: InputMaybe<Payments_Subscriptions_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Payments_Subscriptions_Append_Input = {
  /** Subscription metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "payments.subscriptions" */
export type Payments_Subscriptions_Arr_Rel_Insert_Input = {
  data: Array<Payments_Subscriptions_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_Subscriptions_On_Conflict>;
};

/** aggregate avg on columns */
export type Payments_Subscriptions_Avg_Fields = {
  __typename?: "payments_subscriptions_avg_fields";
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: Maybe<Scalars["Float"]["output"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: Maybe<Scalars["Float"]["output"]>;
  /** Cancellation timestamp */
  canceled_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Current period end */
  current_period_end?: Maybe<Scalars["Float"]["output"]>;
  /** Current period start */
  current_period_start?: Maybe<Scalars["Float"]["output"]>;
  /** End timestamp */
  ended_at?: Maybe<Scalars["Float"]["output"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: Maybe<Scalars["Float"]["output"]>;
  /** Next billing date timestamp */
  next_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Trial end timestamp */
  trial_ends_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "payments.subscriptions" */
export type Payments_Subscriptions_Avg_Order_By = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Order_By>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Order_By>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Current period end */
  current_period_end?: InputMaybe<Order_By>;
  /** Current period start */
  current_period_start?: InputMaybe<Order_By>;
  /** End timestamp */
  ended_at?: InputMaybe<Order_By>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Order_By>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Order_By>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Order_By>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "payments.subscriptions". All fields are combined with a logical 'AND'. */
export type Payments_Subscriptions_Bool_Exp = {
  _and?: InputMaybe<Array<Payments_Subscriptions_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
  _or?: InputMaybe<Array<Payments_Subscriptions_Bool_Exp>>;
  billing_anchor_date?: InputMaybe<Bigint_Comparison_Exp>;
  billing_retry_count?: InputMaybe<Int_Comparison_Exp>;
  cancel_at_period_end?: InputMaybe<Boolean_Comparison_Exp>;
  canceled_at?: InputMaybe<Bigint_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  current_period_end?: InputMaybe<Bigint_Comparison_Exp>;
  current_period_start?: InputMaybe<Bigint_Comparison_Exp>;
  ended_at?: InputMaybe<Bigint_Comparison_Exp>;
  external_subscription_id?: InputMaybe<String_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  last_billing_date?: InputMaybe<Bigint_Comparison_Exp>;
  max_billing_retries?: InputMaybe<Int_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  method?: InputMaybe<Payments_Methods_Bool_Exp>;
  method_id?: InputMaybe<Uuid_Comparison_Exp>;
  next_billing_date?: InputMaybe<Bigint_Comparison_Exp>;
  object_hid?: InputMaybe<String_Comparison_Exp>;
  operations?: InputMaybe<Payments_Operations_Bool_Exp>;
  operations_aggregate?: InputMaybe<Payments_Operations_Aggregate_Bool_Exp>;
  plan?: InputMaybe<Payments_Plans_Bool_Exp>;
  plan_id?: InputMaybe<Uuid_Comparison_Exp>;
  provider?: InputMaybe<Payments_Providers_Bool_Exp>;
  provider_id?: InputMaybe<Uuid_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  trial_ends_at?: InputMaybe<Bigint_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "payments.subscriptions" */
export enum Payments_Subscriptions_Constraint {
  /** unique or primary key constraint on columns "id" */
  SubscriptionsPkey = "subscriptions_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Payments_Subscriptions_Delete_At_Path_Input = {
  /** Subscription metadata */
  metadata?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Payments_Subscriptions_Delete_Elem_Input = {
  /** Subscription metadata */
  metadata?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Payments_Subscriptions_Delete_Key_Input = {
  /** Subscription metadata */
  metadata?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "payments.subscriptions" */
export type Payments_Subscriptions_Inc_Input = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Scalars["Int"]["input"]>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Scalars["bigint"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Current period end */
  current_period_end?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Current period start */
  current_period_start?: InputMaybe<Scalars["bigint"]["input"]>;
  /** End timestamp */
  ended_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Scalars["Int"]["input"]>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "payments.subscriptions" */
export type Payments_Subscriptions_Insert_Input = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Scalars["Int"]["input"]>;
  /** Cancel at period end flag */
  cancel_at_period_end?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Scalars["bigint"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Current period end */
  current_period_end?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Current period start */
  current_period_start?: InputMaybe<Scalars["bigint"]["input"]>;
  /** End timestamp */
  ended_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** External subscription ID */
  external_subscription_id?: InputMaybe<Scalars["String"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Scalars["Int"]["input"]>;
  /** Subscription metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  method?: InputMaybe<Payments_Methods_Obj_Rel_Insert_Input>;
  /** Payment method ID */
  method_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Object HID */
  object_hid?: InputMaybe<Scalars["String"]["input"]>;
  operations?: InputMaybe<Payments_Operations_Arr_Rel_Insert_Input>;
  plan?: InputMaybe<Payments_Plans_Obj_Rel_Insert_Input>;
  /** Plan ID */
  plan_id?: InputMaybe<Scalars["uuid"]["input"]>;
  provider?: InputMaybe<Payments_Providers_Obj_Rel_Insert_Input>;
  /** Provider ID */
  provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Subscription status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** User ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Payments_Subscriptions_Max_Fields = {
  __typename?: "payments_subscriptions_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: Maybe<Scalars["Int"]["output"]>;
  /** Cancellation timestamp */
  canceled_at?: Maybe<Scalars["bigint"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Current period end */
  current_period_end?: Maybe<Scalars["bigint"]["output"]>;
  /** Current period start */
  current_period_start?: Maybe<Scalars["bigint"]["output"]>;
  /** End timestamp */
  ended_at?: Maybe<Scalars["bigint"]["output"]>;
  /** External subscription ID */
  external_subscription_id?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: Maybe<Scalars["Int"]["output"]>;
  /** Payment method ID */
  method_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Next billing date timestamp */
  next_billing_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Object HID */
  object_hid?: Maybe<Scalars["String"]["output"]>;
  /** Plan ID */
  plan_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Provider ID */
  provider_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Subscription status */
  status?: Maybe<Scalars["String"]["output"]>;
  /** Trial end timestamp */
  trial_ends_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "payments.subscriptions" */
export type Payments_Subscriptions_Max_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Order_By>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Order_By>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Current period end */
  current_period_end?: InputMaybe<Order_By>;
  /** Current period start */
  current_period_start?: InputMaybe<Order_By>;
  /** End timestamp */
  ended_at?: InputMaybe<Order_By>;
  /** External subscription ID */
  external_subscription_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Order_By>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Order_By>;
  /** Payment method ID */
  method_id?: InputMaybe<Order_By>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Order_By>;
  /** Object HID */
  object_hid?: InputMaybe<Order_By>;
  /** Plan ID */
  plan_id?: InputMaybe<Order_By>;
  /** Provider ID */
  provider_id?: InputMaybe<Order_By>;
  /** Subscription status */
  status?: InputMaybe<Order_By>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** User ID */
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Payments_Subscriptions_Min_Fields = {
  __typename?: "payments_subscriptions_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: Maybe<Scalars["Int"]["output"]>;
  /** Cancellation timestamp */
  canceled_at?: Maybe<Scalars["bigint"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Current period end */
  current_period_end?: Maybe<Scalars["bigint"]["output"]>;
  /** Current period start */
  current_period_start?: Maybe<Scalars["bigint"]["output"]>;
  /** End timestamp */
  ended_at?: Maybe<Scalars["bigint"]["output"]>;
  /** External subscription ID */
  external_subscription_id?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: Maybe<Scalars["Int"]["output"]>;
  /** Payment method ID */
  method_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Next billing date timestamp */
  next_billing_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Object HID */
  object_hid?: Maybe<Scalars["String"]["output"]>;
  /** Plan ID */
  plan_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Provider ID */
  provider_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Subscription status */
  status?: Maybe<Scalars["String"]["output"]>;
  /** Trial end timestamp */
  trial_ends_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "payments.subscriptions" */
export type Payments_Subscriptions_Min_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Order_By>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Order_By>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Current period end */
  current_period_end?: InputMaybe<Order_By>;
  /** Current period start */
  current_period_start?: InputMaybe<Order_By>;
  /** End timestamp */
  ended_at?: InputMaybe<Order_By>;
  /** External subscription ID */
  external_subscription_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Order_By>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Order_By>;
  /** Payment method ID */
  method_id?: InputMaybe<Order_By>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Order_By>;
  /** Object HID */
  object_hid?: InputMaybe<Order_By>;
  /** Plan ID */
  plan_id?: InputMaybe<Order_By>;
  /** Provider ID */
  provider_id?: InputMaybe<Order_By>;
  /** Subscription status */
  status?: InputMaybe<Order_By>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** User ID */
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "payments.subscriptions" */
export type Payments_Subscriptions_Mutation_Response = {
  __typename?: "payments_subscriptions_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Payments_Subscriptions>;
};

/** input type for inserting object relation for remote table "payments.subscriptions" */
export type Payments_Subscriptions_Obj_Rel_Insert_Input = {
  data: Payments_Subscriptions_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_Subscriptions_On_Conflict>;
};

/** on_conflict condition type for table "payments.subscriptions" */
export type Payments_Subscriptions_On_Conflict = {
  constraint: Payments_Subscriptions_Constraint;
  update_columns?: Array<Payments_Subscriptions_Update_Column>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

/** Ordering options when selecting data from "payments.subscriptions". */
export type Payments_Subscriptions_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  billing_anchor_date?: InputMaybe<Order_By>;
  billing_retry_count?: InputMaybe<Order_By>;
  cancel_at_period_end?: InputMaybe<Order_By>;
  canceled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  current_period_end?: InputMaybe<Order_By>;
  current_period_start?: InputMaybe<Order_By>;
  ended_at?: InputMaybe<Order_By>;
  external_subscription_id?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  last_billing_date?: InputMaybe<Order_By>;
  max_billing_retries?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  method?: InputMaybe<Payments_Methods_Order_By>;
  method_id?: InputMaybe<Order_By>;
  next_billing_date?: InputMaybe<Order_By>;
  object_hid?: InputMaybe<Order_By>;
  operations_aggregate?: InputMaybe<Payments_Operations_Aggregate_Order_By>;
  plan?: InputMaybe<Payments_Plans_Order_By>;
  plan_id?: InputMaybe<Order_By>;
  provider?: InputMaybe<Payments_Providers_Order_By>;
  provider_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  trial_ends_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: payments.subscriptions */
export type Payments_Subscriptions_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Payments_Subscriptions_Prepend_Input = {
  /** Subscription metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "payments.subscriptions" */
export enum Payments_Subscriptions_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  BillingAnchorDate = "billing_anchor_date",
  /** column name */
  BillingRetryCount = "billing_retry_count",
  /** column name */
  CancelAtPeriodEnd = "cancel_at_period_end",
  /** column name */
  CanceledAt = "canceled_at",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CurrentPeriodEnd = "current_period_end",
  /** column name */
  CurrentPeriodStart = "current_period_start",
  /** column name */
  EndedAt = "ended_at",
  /** column name */
  ExternalSubscriptionId = "external_subscription_id",
  /** column name */
  Id = "id",
  /** column name */
  LastBillingDate = "last_billing_date",
  /** column name */
  MaxBillingRetries = "max_billing_retries",
  /** column name */
  Metadata = "metadata",
  /** column name */
  MethodId = "method_id",
  /** column name */
  NextBillingDate = "next_billing_date",
  /** column name */
  ObjectHid = "object_hid",
  /** column name */
  PlanId = "plan_id",
  /** column name */
  ProviderId = "provider_id",
  /** column name */
  Status = "status",
  /** column name */
  TrialEndsAt = "trial_ends_at",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** select "payments_subscriptions_aggregate_bool_exp_bool_and_arguments_columns" columns of table "payments.subscriptions" */
export enum Payments_Subscriptions_Select_Column_Payments_Subscriptions_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  CancelAtPeriodEnd = "cancel_at_period_end",
}

/** select "payments_subscriptions_aggregate_bool_exp_bool_or_arguments_columns" columns of table "payments.subscriptions" */
export enum Payments_Subscriptions_Select_Column_Payments_Subscriptions_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  CancelAtPeriodEnd = "cancel_at_period_end",
}

/** input type for updating data in table "payments.subscriptions" */
export type Payments_Subscriptions_Set_Input = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Scalars["Int"]["input"]>;
  /** Cancel at period end flag */
  cancel_at_period_end?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Scalars["bigint"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Current period end */
  current_period_end?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Current period start */
  current_period_start?: InputMaybe<Scalars["bigint"]["input"]>;
  /** End timestamp */
  ended_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** External subscription ID */
  external_subscription_id?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Scalars["Int"]["input"]>;
  /** Subscription metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Payment method ID */
  method_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Object HID */
  object_hid?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan ID */
  plan_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Provider ID */
  provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Subscription status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Payments_Subscriptions_Stddev_Fields = {
  __typename?: "payments_subscriptions_stddev_fields";
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: Maybe<Scalars["Float"]["output"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: Maybe<Scalars["Float"]["output"]>;
  /** Cancellation timestamp */
  canceled_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Current period end */
  current_period_end?: Maybe<Scalars["Float"]["output"]>;
  /** Current period start */
  current_period_start?: Maybe<Scalars["Float"]["output"]>;
  /** End timestamp */
  ended_at?: Maybe<Scalars["Float"]["output"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: Maybe<Scalars["Float"]["output"]>;
  /** Next billing date timestamp */
  next_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Trial end timestamp */
  trial_ends_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "payments.subscriptions" */
export type Payments_Subscriptions_Stddev_Order_By = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Order_By>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Order_By>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Current period end */
  current_period_end?: InputMaybe<Order_By>;
  /** Current period start */
  current_period_start?: InputMaybe<Order_By>;
  /** End timestamp */
  ended_at?: InputMaybe<Order_By>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Order_By>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Order_By>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Order_By>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Payments_Subscriptions_Stddev_Pop_Fields = {
  __typename?: "payments_subscriptions_stddev_pop_fields";
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: Maybe<Scalars["Float"]["output"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: Maybe<Scalars["Float"]["output"]>;
  /** Cancellation timestamp */
  canceled_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Current period end */
  current_period_end?: Maybe<Scalars["Float"]["output"]>;
  /** Current period start */
  current_period_start?: Maybe<Scalars["Float"]["output"]>;
  /** End timestamp */
  ended_at?: Maybe<Scalars["Float"]["output"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: Maybe<Scalars["Float"]["output"]>;
  /** Next billing date timestamp */
  next_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Trial end timestamp */
  trial_ends_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "payments.subscriptions" */
export type Payments_Subscriptions_Stddev_Pop_Order_By = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Order_By>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Order_By>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Current period end */
  current_period_end?: InputMaybe<Order_By>;
  /** Current period start */
  current_period_start?: InputMaybe<Order_By>;
  /** End timestamp */
  ended_at?: InputMaybe<Order_By>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Order_By>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Order_By>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Order_By>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Payments_Subscriptions_Stddev_Samp_Fields = {
  __typename?: "payments_subscriptions_stddev_samp_fields";
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: Maybe<Scalars["Float"]["output"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: Maybe<Scalars["Float"]["output"]>;
  /** Cancellation timestamp */
  canceled_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Current period end */
  current_period_end?: Maybe<Scalars["Float"]["output"]>;
  /** Current period start */
  current_period_start?: Maybe<Scalars["Float"]["output"]>;
  /** End timestamp */
  ended_at?: Maybe<Scalars["Float"]["output"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: Maybe<Scalars["Float"]["output"]>;
  /** Next billing date timestamp */
  next_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Trial end timestamp */
  trial_ends_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "payments.subscriptions" */
export type Payments_Subscriptions_Stddev_Samp_Order_By = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Order_By>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Order_By>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Current period end */
  current_period_end?: InputMaybe<Order_By>;
  /** Current period start */
  current_period_start?: InputMaybe<Order_By>;
  /** End timestamp */
  ended_at?: InputMaybe<Order_By>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Order_By>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Order_By>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Order_By>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "payments_subscriptions" */
export type Payments_Subscriptions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payments_Subscriptions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payments_Subscriptions_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Scalars["Int"]["input"]>;
  /** Cancel at period end flag */
  cancel_at_period_end?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Scalars["bigint"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Current period end */
  current_period_end?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Current period start */
  current_period_start?: InputMaybe<Scalars["bigint"]["input"]>;
  /** End timestamp */
  ended_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** External subscription ID */
  external_subscription_id?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Scalars["Int"]["input"]>;
  /** Subscription metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Payment method ID */
  method_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Object HID */
  object_hid?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan ID */
  plan_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Provider ID */
  provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Subscription status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Payments_Subscriptions_Sum_Fields = {
  __typename?: "payments_subscriptions_sum_fields";
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: Maybe<Scalars["Int"]["output"]>;
  /** Cancellation timestamp */
  canceled_at?: Maybe<Scalars["bigint"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Current period end */
  current_period_end?: Maybe<Scalars["bigint"]["output"]>;
  /** Current period start */
  current_period_start?: Maybe<Scalars["bigint"]["output"]>;
  /** End timestamp */
  ended_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: Maybe<Scalars["Int"]["output"]>;
  /** Next billing date timestamp */
  next_billing_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Trial end timestamp */
  trial_ends_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "payments.subscriptions" */
export type Payments_Subscriptions_Sum_Order_By = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Order_By>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Order_By>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Current period end */
  current_period_end?: InputMaybe<Order_By>;
  /** Current period start */
  current_period_start?: InputMaybe<Order_By>;
  /** End timestamp */
  ended_at?: InputMaybe<Order_By>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Order_By>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Order_By>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Order_By>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "payments.subscriptions" */
export enum Payments_Subscriptions_Update_Column {
  /** column name */
  BillingAnchorDate = "billing_anchor_date",
  /** column name */
  BillingRetryCount = "billing_retry_count",
  /** column name */
  CancelAtPeriodEnd = "cancel_at_period_end",
  /** column name */
  CanceledAt = "canceled_at",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CurrentPeriodEnd = "current_period_end",
  /** column name */
  CurrentPeriodStart = "current_period_start",
  /** column name */
  EndedAt = "ended_at",
  /** column name */
  ExternalSubscriptionId = "external_subscription_id",
  /** column name */
  Id = "id",
  /** column name */
  LastBillingDate = "last_billing_date",
  /** column name */
  MaxBillingRetries = "max_billing_retries",
  /** column name */
  Metadata = "metadata",
  /** column name */
  MethodId = "method_id",
  /** column name */
  NextBillingDate = "next_billing_date",
  /** column name */
  ObjectHid = "object_hid",
  /** column name */
  PlanId = "plan_id",
  /** column name */
  ProviderId = "provider_id",
  /** column name */
  Status = "status",
  /** column name */
  TrialEndsAt = "trial_ends_at",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Payments_Subscriptions_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Payments_Subscriptions_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Payments_Subscriptions_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Payments_Subscriptions_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Payments_Subscriptions_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Payments_Subscriptions_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Payments_Subscriptions_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payments_Subscriptions_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payments_Subscriptions_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Payments_Subscriptions_Var_Pop_Fields = {
  __typename?: "payments_subscriptions_var_pop_fields";
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: Maybe<Scalars["Float"]["output"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: Maybe<Scalars["Float"]["output"]>;
  /** Cancellation timestamp */
  canceled_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Current period end */
  current_period_end?: Maybe<Scalars["Float"]["output"]>;
  /** Current period start */
  current_period_start?: Maybe<Scalars["Float"]["output"]>;
  /** End timestamp */
  ended_at?: Maybe<Scalars["Float"]["output"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: Maybe<Scalars["Float"]["output"]>;
  /** Next billing date timestamp */
  next_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Trial end timestamp */
  trial_ends_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "payments.subscriptions" */
export type Payments_Subscriptions_Var_Pop_Order_By = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Order_By>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Order_By>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Current period end */
  current_period_end?: InputMaybe<Order_By>;
  /** Current period start */
  current_period_start?: InputMaybe<Order_By>;
  /** End timestamp */
  ended_at?: InputMaybe<Order_By>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Order_By>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Order_By>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Order_By>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Payments_Subscriptions_Var_Samp_Fields = {
  __typename?: "payments_subscriptions_var_samp_fields";
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: Maybe<Scalars["Float"]["output"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: Maybe<Scalars["Float"]["output"]>;
  /** Cancellation timestamp */
  canceled_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Current period end */
  current_period_end?: Maybe<Scalars["Float"]["output"]>;
  /** Current period start */
  current_period_start?: Maybe<Scalars["Float"]["output"]>;
  /** End timestamp */
  ended_at?: Maybe<Scalars["Float"]["output"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: Maybe<Scalars["Float"]["output"]>;
  /** Next billing date timestamp */
  next_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Trial end timestamp */
  trial_ends_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "payments.subscriptions" */
export type Payments_Subscriptions_Var_Samp_Order_By = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Order_By>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Order_By>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Current period end */
  current_period_end?: InputMaybe<Order_By>;
  /** Current period start */
  current_period_start?: InputMaybe<Order_By>;
  /** End timestamp */
  ended_at?: InputMaybe<Order_By>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Order_By>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Order_By>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Order_By>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Payments_Subscriptions_Variance_Fields = {
  __typename?: "payments_subscriptions_variance_fields";
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: Maybe<Scalars["Float"]["output"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: Maybe<Scalars["Float"]["output"]>;
  /** Cancellation timestamp */
  canceled_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Current period end */
  current_period_end?: Maybe<Scalars["Float"]["output"]>;
  /** Current period start */
  current_period_start?: Maybe<Scalars["Float"]["output"]>;
  /** End timestamp */
  ended_at?: Maybe<Scalars["Float"]["output"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: Maybe<Scalars["Float"]["output"]>;
  /** Next billing date timestamp */
  next_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Trial end timestamp */
  trial_ends_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "payments.subscriptions" */
export type Payments_Subscriptions_Variance_Order_By = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Order_By>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Order_By>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Current period end */
  current_period_end?: InputMaybe<Order_By>;
  /** Current period start */
  current_period_start?: InputMaybe<Order_By>;
  /** End timestamp */
  ended_at?: InputMaybe<Order_By>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Order_By>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Order_By>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Order_By>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings = {
  __typename?: "payments_user_payment_provider_mappings";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** Mapping metadata */
  metadata?: Maybe<Scalars["jsonb"]["output"]>;
  /** An object relationship */
  provider: Payments_Providers;
  /** Provider customer key */
  provider_customer_key: Scalars["String"]["output"];
  /** Provider ID */
  provider_id: Scalars["uuid"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  /** User ID */
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_MappingsMetadataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Aggregate = {
  __typename?: "payments_user_payment_provider_mappings_aggregate";
  aggregate?: Maybe<Payments_User_Payment_Provider_Mappings_Aggregate_Fields>;
  nodes: Array<Payments_User_Payment_Provider_Mappings>;
};

export type Payments_User_Payment_Provider_Mappings_Aggregate_Bool_Exp = {
  count?: InputMaybe<Payments_User_Payment_Provider_Mappings_Aggregate_Bool_Exp_Count>;
};

export type Payments_User_Payment_Provider_Mappings_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Select_Column>
  >;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Aggregate_Fields = {
  __typename?: "payments_user_payment_provider_mappings_aggregate_fields";
  avg?: Maybe<Payments_User_Payment_Provider_Mappings_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Payments_User_Payment_Provider_Mappings_Max_Fields>;
  min?: Maybe<Payments_User_Payment_Provider_Mappings_Min_Fields>;
  stddev?: Maybe<Payments_User_Payment_Provider_Mappings_Stddev_Fields>;
  stddev_pop?: Maybe<Payments_User_Payment_Provider_Mappings_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Payments_User_Payment_Provider_Mappings_Stddev_Samp_Fields>;
  sum?: Maybe<Payments_User_Payment_Provider_Mappings_Sum_Fields>;
  var_pop?: Maybe<Payments_User_Payment_Provider_Mappings_Var_Pop_Fields>;
  var_samp?: Maybe<Payments_User_Payment_Provider_Mappings_Var_Samp_Fields>;
  variance?: Maybe<Payments_User_Payment_Provider_Mappings_Variance_Fields>;
};

/** aggregate fields of "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Aggregate_FieldsCountArgs =
  {
    columns?: InputMaybe<
      Array<Payments_User_Payment_Provider_Mappings_Select_Column>
    >;
    distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  };

/** order by aggregate values of table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Aggregate_Order_By = {
  avg?: InputMaybe<Payments_User_Payment_Provider_Mappings_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Payments_User_Payment_Provider_Mappings_Max_Order_By>;
  min?: InputMaybe<Payments_User_Payment_Provider_Mappings_Min_Order_By>;
  stddev?: InputMaybe<Payments_User_Payment_Provider_Mappings_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Payments_User_Payment_Provider_Mappings_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Payments_User_Payment_Provider_Mappings_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Payments_User_Payment_Provider_Mappings_Sum_Order_By>;
  var_pop?: InputMaybe<Payments_User_Payment_Provider_Mappings_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Payments_User_Payment_Provider_Mappings_Var_Samp_Order_By>;
  variance?: InputMaybe<Payments_User_Payment_Provider_Mappings_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Payments_User_Payment_Provider_Mappings_Append_Input = {
  /** Mapping metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Arr_Rel_Insert_Input = {
  data: Array<Payments_User_Payment_Provider_Mappings_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_User_Payment_Provider_Mappings_On_Conflict>;
};

/** aggregate avg on columns */
export type Payments_User_Payment_Provider_Mappings_Avg_Fields = {
  __typename?: "payments_user_payment_provider_mappings_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "payments.user_payment_provider_mappings". All fields are combined with a logical 'AND'. */
export type Payments_User_Payment_Provider_Mappings_Bool_Exp = {
  _and?: InputMaybe<Array<Payments_User_Payment_Provider_Mappings_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
  _or?: InputMaybe<Array<Payments_User_Payment_Provider_Mappings_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  provider?: InputMaybe<Payments_Providers_Bool_Exp>;
  provider_customer_key?: InputMaybe<String_Comparison_Exp>;
  provider_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "payments.user_payment_provider_mappings" */
export enum Payments_User_Payment_Provider_Mappings_Constraint {
  /** unique or primary key constraint on columns "id" */
  UserPaymentProviderMappingsPkey = "user_payment_provider_mappings_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Payments_User_Payment_Provider_Mappings_Delete_At_Path_Input = {
  /** Mapping metadata */
  metadata?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Payments_User_Payment_Provider_Mappings_Delete_Elem_Input = {
  /** Mapping metadata */
  metadata?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Payments_User_Payment_Provider_Mappings_Delete_Key_Input = {
  /** Mapping metadata */
  metadata?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Mapping metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  provider?: InputMaybe<Payments_Providers_Obj_Rel_Insert_Input>;
  /** Provider customer key */
  provider_customer_key?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider ID */
  provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** User ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Payments_User_Payment_Provider_Mappings_Max_Fields = {
  __typename?: "payments_user_payment_provider_mappings_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Provider customer key */
  provider_customer_key?: Maybe<Scalars["String"]["output"]>;
  /** Provider ID */
  provider_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Max_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Provider customer key */
  provider_customer_key?: InputMaybe<Order_By>;
  /** Provider ID */
  provider_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** User ID */
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Payments_User_Payment_Provider_Mappings_Min_Fields = {
  __typename?: "payments_user_payment_provider_mappings_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Provider customer key */
  provider_customer_key?: Maybe<Scalars["String"]["output"]>;
  /** Provider ID */
  provider_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Min_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Provider customer key */
  provider_customer_key?: InputMaybe<Order_By>;
  /** Provider ID */
  provider_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** User ID */
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Mutation_Response = {
  __typename?: "payments_user_payment_provider_mappings_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Payments_User_Payment_Provider_Mappings>;
};

/** input type for inserting object relation for remote table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Obj_Rel_Insert_Input = {
  data: Payments_User_Payment_Provider_Mappings_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_User_Payment_Provider_Mappings_On_Conflict>;
};

/** on_conflict condition type for table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_On_Conflict = {
  constraint: Payments_User_Payment_Provider_Mappings_Constraint;
  update_columns?: Array<Payments_User_Payment_Provider_Mappings_Update_Column>;
  where?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
};

/** Ordering options when selecting data from "payments.user_payment_provider_mappings". */
export type Payments_User_Payment_Provider_Mappings_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  provider?: InputMaybe<Payments_Providers_Order_By>;
  provider_customer_key?: InputMaybe<Order_By>;
  provider_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: payments.user_payment_provider_mappings */
export type Payments_User_Payment_Provider_Mappings_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Payments_User_Payment_Provider_Mappings_Prepend_Input = {
  /** Mapping metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "payments.user_payment_provider_mappings" */
export enum Payments_User_Payment_Provider_Mappings_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Metadata = "metadata",
  /** column name */
  ProviderCustomerKey = "provider_customer_key",
  /** column name */
  ProviderId = "provider_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Mapping metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Provider customer key */
  provider_customer_key?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider ID */
  provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Payments_User_Payment_Provider_Mappings_Stddev_Fields = {
  __typename?: "payments_user_payment_provider_mappings_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Payments_User_Payment_Provider_Mappings_Stddev_Pop_Fields = {
  __typename?: "payments_user_payment_provider_mappings_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Payments_User_Payment_Provider_Mappings_Stddev_Samp_Fields = {
  __typename?: "payments_user_payment_provider_mappings_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "payments_user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payments_User_Payment_Provider_Mappings_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payments_User_Payment_Provider_Mappings_Stream_Cursor_Value_Input =
  {
    _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
    _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
    created_at?: InputMaybe<Scalars["bigint"]["input"]>;
    id?: InputMaybe<Scalars["uuid"]["input"]>;
    /** Mapping metadata */
    metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
    /** Provider customer key */
    provider_customer_key?: InputMaybe<Scalars["String"]["input"]>;
    /** Provider ID */
    provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
    updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
    /** User ID */
    user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  };

/** aggregate sum on columns */
export type Payments_User_Payment_Provider_Mappings_Sum_Fields = {
  __typename?: "payments_user_payment_provider_mappings_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "payments.user_payment_provider_mappings" */
export enum Payments_User_Payment_Provider_Mappings_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Metadata = "metadata",
  /** column name */
  ProviderCustomerKey = "provider_customer_key",
  /** column name */
  ProviderId = "provider_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Payments_User_Payment_Provider_Mappings_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Payments_User_Payment_Provider_Mappings_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Payments_User_Payment_Provider_Mappings_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Payments_User_Payment_Provider_Mappings_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Payments_User_Payment_Provider_Mappings_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Payments_User_Payment_Provider_Mappings_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Payments_User_Payment_Provider_Mappings_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payments_User_Payment_Provider_Mappings_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payments_User_Payment_Provider_Mappings_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Payments_User_Payment_Provider_Mappings_Var_Pop_Fields = {
  __typename?: "payments_user_payment_provider_mappings_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Payments_User_Payment_Provider_Mappings_Var_Samp_Fields = {
  __typename?: "payments_user_payment_provider_mappings_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Payments_User_Payment_Provider_Mappings_Variance_Fields = {
  __typename?: "payments_user_payment_provider_mappings_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

export type Query_Root = {
  __typename?: "query_root";
  /** An array relationship */
  accounts: Array<Accounts>;
  /** An aggregate relationship */
  accounts_aggregate: Accounts_Aggregate;
  /** fetch data from the table: "accounts" using primary key columns */
  accounts_by_pk?: Maybe<Accounts>;
  /** fetch data from the table: "auth_jwt" */
  auth_jwt: Array<Auth_Jwt>;
  /** fetch aggregated fields from the table: "auth_jwt" */
  auth_jwt_aggregate: Auth_Jwt_Aggregate;
  /** fetch data from the table: "auth_jwt" using primary key columns */
  auth_jwt_by_pk?: Maybe<Auth_Jwt>;
  /** fetch data from the table: "storage.buckets" using primary key columns */
  bucket?: Maybe<Buckets>;
  /** fetch data from the table: "storage.buckets" */
  buckets: Array<Buckets>;
  /** fetch aggregated fields from the table: "storage.buckets" */
  bucketsAggregate: Buckets_Aggregate;
  /** fetch data from the table: "debug" */
  debug: Array<Debug>;
  /** fetch aggregated fields from the table: "debug" */
  debug_aggregate: Debug_Aggregate;
  /** fetch data from the table: "debug" using primary key columns */
  debug_by_pk?: Maybe<Debug>;
  /** An array relationship */
  events: Array<Events>;
  /** An aggregate relationship */
  events_aggregate: Events_Aggregate;
  /** fetch data from the table: "events" using primary key columns */
  events_by_pk?: Maybe<Events>;
  /** fetch data from the table: "storage.files" using primary key columns */
  file?: Maybe<Files>;
  /** An array relationship */
  files: Array<Files>;
  /** fetch aggregated fields from the table: "storage.files" */
  filesAggregate: Files_Aggregate;
  /** fetch data from the table: "geo.features" */
  geo_features: Array<Geo_Features>;
  /** fetch aggregated fields from the table: "geo.features" */
  geo_features_aggregate: Geo_Features_Aggregate;
  /** fetch data from the table: "geo.features" using primary key columns */
  geo_features_by_pk?: Maybe<Geo_Features>;
  /** fetch data from the table: "github_issues" */
  github_issues: Array<Github_Issues>;
  /** fetch aggregated fields from the table: "github_issues" */
  github_issues_aggregate: Github_Issues_Aggregate;
  /** fetch data from the table: "github_issues" using primary key columns */
  github_issues_by_pk?: Maybe<Github_Issues>;
  /** fetch data from the table: "groups" */
  groups: Array<Groups>;
  /** fetch aggregated fields from the table: "groups" */
  groups_aggregate: Groups_Aggregate;
  /** fetch data from the table: "groups" using primary key columns */
  groups_by_pk?: Maybe<Groups>;
  /** fetch data from the table: "hasyx" */
  hasyx: Array<Hasyx>;
  /** fetch aggregated fields from the table: "hasyx" */
  hasyx_aggregate: Hasyx_Aggregate;
  /** An array relationship */
  invitations: Array<Invitations>;
  /** An aggregate relationship */
  invitations_aggregate: Invitations_Aggregate;
  /** fetch data from the table: "invitations" using primary key columns */
  invitations_by_pk?: Maybe<Invitations>;
  /** fetch data from the table: "invited" */
  invited: Array<Invited>;
  /** fetch aggregated fields from the table: "invited" */
  invited_aggregate: Invited_Aggregate;
  /** fetch data from the table: "invited" using primary key columns */
  invited_by_pk?: Maybe<Invited>;
  /** fetch data from the table: "invites" */
  invites: Array<Invites>;
  /** fetch aggregated fields from the table: "invites" */
  invites_aggregate: Invites_Aggregate;
  /** fetch data from the table: "invites" using primary key columns */
  invites_by_pk?: Maybe<Invites>;
  /** fetch data from the table: "logs.diffs" */
  logs_diffs: Array<Logs_Diffs>;
  /** fetch aggregated fields from the table: "logs.diffs" */
  logs_diffs_aggregate: Logs_Diffs_Aggregate;
  /** fetch data from the table: "logs.diffs" using primary key columns */
  logs_diffs_by_pk?: Maybe<Logs_Diffs>;
  /** fetch data from the table: "logs.states" */
  logs_states: Array<Logs_States>;
  /** fetch aggregated fields from the table: "logs.states" */
  logs_states_aggregate: Logs_States_Aggregate;
  /** fetch data from the table: "logs.states" using primary key columns */
  logs_states_by_pk?: Maybe<Logs_States>;
  /** An array relationship */
  memberships: Array<Memberships>;
  /** An aggregate relationship */
  memberships_aggregate: Memberships_Aggregate;
  /** fetch data from the table: "memberships" using primary key columns */
  memberships_by_pk?: Maybe<Memberships>;
  /** fetch data from the table: "message_reads" */
  message_reads: Array<Message_Reads>;
  /** fetch aggregated fields from the table: "message_reads" */
  message_reads_aggregate: Message_Reads_Aggregate;
  /** fetch data from the table: "message_reads" using primary key columns */
  message_reads_by_pk?: Maybe<Message_Reads>;
  /** fetch data from the table: "messages" */
  messages: Array<Messages>;
  /** fetch aggregated fields from the table: "messages" */
  messages_aggregate: Messages_Aggregate;
  /** fetch data from the table: "messages" using primary key columns */
  messages_by_pk?: Maybe<Messages>;
  /** An array relationship */
  notification_messages: Array<Notification_Messages>;
  /** An aggregate relationship */
  notification_messages_aggregate: Notification_Messages_Aggregate;
  /** fetch data from the table: "notification_messages" using primary key columns */
  notification_messages_by_pk?: Maybe<Notification_Messages>;
  /** An array relationship */
  notification_permissions: Array<Notification_Permissions>;
  /** An aggregate relationship */
  notification_permissions_aggregate: Notification_Permissions_Aggregate;
  /** fetch data from the table: "notification_permissions" using primary key columns */
  notification_permissions_by_pk?: Maybe<Notification_Permissions>;
  /** An array relationship */
  notifications: Array<Notifications>;
  /** An aggregate relationship */
  notifications_aggregate: Notifications_Aggregate;
  /** fetch data from the table: "notifications" using primary key columns */
  notifications_by_pk?: Maybe<Notifications>;
  /** fetch data from the table: "payments.methods" */
  payments_methods: Array<Payments_Methods>;
  /** fetch aggregated fields from the table: "payments.methods" */
  payments_methods_aggregate: Payments_Methods_Aggregate;
  /** fetch data from the table: "payments.methods" using primary key columns */
  payments_methods_by_pk?: Maybe<Payments_Methods>;
  /** fetch data from the table: "payments.operations" */
  payments_operations: Array<Payments_Operations>;
  /** fetch aggregated fields from the table: "payments.operations" */
  payments_operations_aggregate: Payments_Operations_Aggregate;
  /** fetch data from the table: "payments.operations" using primary key columns */
  payments_operations_by_pk?: Maybe<Payments_Operations>;
  /** fetch data from the table: "payments.plans" */
  payments_plans: Array<Payments_Plans>;
  /** fetch aggregated fields from the table: "payments.plans" */
  payments_plans_aggregate: Payments_Plans_Aggregate;
  /** fetch data from the table: "payments.plans" using primary key columns */
  payments_plans_by_pk?: Maybe<Payments_Plans>;
  /** fetch data from the table: "payments.providers" */
  payments_providers: Array<Payments_Providers>;
  /** fetch aggregated fields from the table: "payments.providers" */
  payments_providers_aggregate: Payments_Providers_Aggregate;
  /** fetch data from the table: "payments.providers" using primary key columns */
  payments_providers_by_pk?: Maybe<Payments_Providers>;
  /** fetch data from the table: "payments.subscriptions" */
  payments_subscriptions: Array<Payments_Subscriptions>;
  /** fetch aggregated fields from the table: "payments.subscriptions" */
  payments_subscriptions_aggregate: Payments_Subscriptions_Aggregate;
  /** fetch data from the table: "payments.subscriptions" using primary key columns */
  payments_subscriptions_by_pk?: Maybe<Payments_Subscriptions>;
  /** fetch data from the table: "payments.user_payment_provider_mappings" */
  payments_user_payment_provider_mappings: Array<Payments_User_Payment_Provider_Mappings>;
  /** fetch aggregated fields from the table: "payments.user_payment_provider_mappings" */
  payments_user_payment_provider_mappings_aggregate: Payments_User_Payment_Provider_Mappings_Aggregate;
  /** fetch data from the table: "payments.user_payment_provider_mappings" using primary key columns */
  payments_user_payment_provider_mappings_by_pk?: Maybe<Payments_User_Payment_Provider_Mappings>;
  /** An array relationship */
  replies: Array<Replies>;
  /** An aggregate relationship */
  replies_aggregate: Replies_Aggregate;
  /** fetch data from the table: "replies" using primary key columns */
  replies_by_pk?: Maybe<Replies>;
  /** fetch data from the table: "rooms" */
  rooms: Array<Rooms>;
  /** fetch aggregated fields from the table: "rooms" */
  rooms_aggregate: Rooms_Aggregate;
  /** fetch data from the table: "rooms" using primary key columns */
  rooms_by_pk?: Maybe<Rooms>;
  /** fetch data from the table: "schedule" */
  schedule: Array<Schedule>;
  /** fetch aggregated fields from the table: "schedule" */
  schedule_aggregate: Schedule_Aggregate;
  /** fetch data from the table: "schedule" using primary key columns */
  schedule_by_pk?: Maybe<Schedule>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
  /** fetch data from the table: "verification_codes" */
  verification_codes: Array<Verification_Codes>;
  /** fetch aggregated fields from the table: "verification_codes" */
  verification_codes_aggregate: Verification_Codes_Aggregate;
  /** fetch data from the table: "verification_codes" using primary key columns */
  verification_codes_by_pk?: Maybe<Verification_Codes>;
  /** fetch data from the table: "storage.virus" using primary key columns */
  virus?: Maybe<Virus>;
  /** fetch data from the table: "storage.virus" */
  viruses: Array<Virus>;
  /** fetch aggregated fields from the table: "storage.virus" */
  virusesAggregate: Virus_Aggregate;
};

export type Query_RootAccountsArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

export type Query_RootAccounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

export type Query_RootAccounts_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootAuth_JwtArgs = {
  distinct_on?: InputMaybe<Array<Auth_Jwt_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Jwt_Order_By>>;
  where?: InputMaybe<Auth_Jwt_Bool_Exp>;
};

export type Query_RootAuth_Jwt_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Auth_Jwt_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Jwt_Order_By>>;
  where?: InputMaybe<Auth_Jwt_Bool_Exp>;
};

export type Query_RootAuth_Jwt_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootBucketArgs = {
  id: Scalars["String"]["input"];
};

export type Query_RootBucketsArgs = {
  distinct_on?: InputMaybe<Array<Buckets_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Buckets_Order_By>>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};

export type Query_RootBucketsAggregateArgs = {
  distinct_on?: InputMaybe<Array<Buckets_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Buckets_Order_By>>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};

export type Query_RootDebugArgs = {
  distinct_on?: InputMaybe<Array<Debug_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Debug_Order_By>>;
  where?: InputMaybe<Debug_Bool_Exp>;
};

export type Query_RootDebug_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Debug_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Debug_Order_By>>;
  where?: InputMaybe<Debug_Bool_Exp>;
};

export type Query_RootDebug_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootEventsArgs = {
  distinct_on?: InputMaybe<Array<Events_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Events_Order_By>>;
  where?: InputMaybe<Events_Bool_Exp>;
};

export type Query_RootEvents_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Events_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Events_Order_By>>;
  where?: InputMaybe<Events_Bool_Exp>;
};

export type Query_RootEvents_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootFileArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootFilesArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};

export type Query_RootFilesAggregateArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};

export type Query_RootGeo_FeaturesArgs = {
  distinct_on?: InputMaybe<Array<Geo_Features_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Geo_Features_Order_By>>;
  where?: InputMaybe<Geo_Features_Bool_Exp>;
};

export type Query_RootGeo_Features_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Geo_Features_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Geo_Features_Order_By>>;
  where?: InputMaybe<Geo_Features_Bool_Exp>;
};

export type Query_RootGeo_Features_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootGithub_IssuesArgs = {
  distinct_on?: InputMaybe<Array<Github_Issues_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Github_Issues_Order_By>>;
  where?: InputMaybe<Github_Issues_Bool_Exp>;
};

export type Query_RootGithub_Issues_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Github_Issues_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Github_Issues_Order_By>>;
  where?: InputMaybe<Github_Issues_Bool_Exp>;
};

export type Query_RootGithub_Issues_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootGroupsArgs = {
  distinct_on?: InputMaybe<Array<Groups_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Groups_Order_By>>;
  where?: InputMaybe<Groups_Bool_Exp>;
};

export type Query_RootGroups_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Groups_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Groups_Order_By>>;
  where?: InputMaybe<Groups_Bool_Exp>;
};

export type Query_RootGroups_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootHasyxArgs = {
  distinct_on?: InputMaybe<Array<Hasyx_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Hasyx_Order_By>>;
  where?: InputMaybe<Hasyx_Bool_Exp>;
};

export type Query_RootHasyx_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Hasyx_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Hasyx_Order_By>>;
  where?: InputMaybe<Hasyx_Bool_Exp>;
};

export type Query_RootInvitationsArgs = {
  distinct_on?: InputMaybe<Array<Invitations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Invitations_Order_By>>;
  where?: InputMaybe<Invitations_Bool_Exp>;
};

export type Query_RootInvitations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invitations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Invitations_Order_By>>;
  where?: InputMaybe<Invitations_Bool_Exp>;
};

export type Query_RootInvitations_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootInvitedArgs = {
  distinct_on?: InputMaybe<Array<Invited_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Invited_Order_By>>;
  where?: InputMaybe<Invited_Bool_Exp>;
};

export type Query_RootInvited_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invited_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Invited_Order_By>>;
  where?: InputMaybe<Invited_Bool_Exp>;
};

export type Query_RootInvited_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootInvitesArgs = {
  distinct_on?: InputMaybe<Array<Invites_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Invites_Order_By>>;
  where?: InputMaybe<Invites_Bool_Exp>;
};

export type Query_RootInvites_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invites_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Invites_Order_By>>;
  where?: InputMaybe<Invites_Bool_Exp>;
};

export type Query_RootInvites_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootLogs_DiffsArgs = {
  distinct_on?: InputMaybe<Array<Logs_Diffs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Logs_Diffs_Order_By>>;
  where?: InputMaybe<Logs_Diffs_Bool_Exp>;
};

export type Query_RootLogs_Diffs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Logs_Diffs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Logs_Diffs_Order_By>>;
  where?: InputMaybe<Logs_Diffs_Bool_Exp>;
};

export type Query_RootLogs_Diffs_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootLogs_StatesArgs = {
  distinct_on?: InputMaybe<Array<Logs_States_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Logs_States_Order_By>>;
  where?: InputMaybe<Logs_States_Bool_Exp>;
};

export type Query_RootLogs_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Logs_States_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Logs_States_Order_By>>;
  where?: InputMaybe<Logs_States_Bool_Exp>;
};

export type Query_RootLogs_States_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootMembershipsArgs = {
  distinct_on?: InputMaybe<Array<Memberships_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Memberships_Order_By>>;
  where?: InputMaybe<Memberships_Bool_Exp>;
};

export type Query_RootMemberships_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Memberships_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Memberships_Order_By>>;
  where?: InputMaybe<Memberships_Bool_Exp>;
};

export type Query_RootMemberships_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootMessage_ReadsArgs = {
  distinct_on?: InputMaybe<Array<Message_Reads_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Message_Reads_Order_By>>;
  where?: InputMaybe<Message_Reads_Bool_Exp>;
};

export type Query_RootMessage_Reads_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Message_Reads_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Message_Reads_Order_By>>;
  where?: InputMaybe<Message_Reads_Bool_Exp>;
};

export type Query_RootMessage_Reads_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootMessagesArgs = {
  distinct_on?: InputMaybe<Array<Messages_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Messages_Order_By>>;
  where?: InputMaybe<Messages_Bool_Exp>;
};

export type Query_RootMessages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Messages_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Messages_Order_By>>;
  where?: InputMaybe<Messages_Bool_Exp>;
};

export type Query_RootMessages_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootNotification_MessagesArgs = {
  distinct_on?: InputMaybe<Array<Notification_Messages_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Messages_Order_By>>;
  where?: InputMaybe<Notification_Messages_Bool_Exp>;
};

export type Query_RootNotification_Messages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notification_Messages_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Messages_Order_By>>;
  where?: InputMaybe<Notification_Messages_Bool_Exp>;
};

export type Query_RootNotification_Messages_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootNotification_PermissionsArgs = {
  distinct_on?: InputMaybe<Array<Notification_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Permissions_Order_By>>;
  where?: InputMaybe<Notification_Permissions_Bool_Exp>;
};

export type Query_RootNotification_Permissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notification_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Permissions_Order_By>>;
  where?: InputMaybe<Notification_Permissions_Bool_Exp>;
};

export type Query_RootNotification_Permissions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootNotificationsArgs = {
  distinct_on?: InputMaybe<Array<Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notifications_Order_By>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};

export type Query_RootNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notifications_Order_By>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};

export type Query_RootNotifications_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootPayments_MethodsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Methods_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Methods_Order_By>>;
  where?: InputMaybe<Payments_Methods_Bool_Exp>;
};

export type Query_RootPayments_Methods_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Methods_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Methods_Order_By>>;
  where?: InputMaybe<Payments_Methods_Bool_Exp>;
};

export type Query_RootPayments_Methods_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootPayments_OperationsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Operations_Order_By>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

export type Query_RootPayments_Operations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Operations_Order_By>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

export type Query_RootPayments_Operations_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootPayments_PlansArgs = {
  distinct_on?: InputMaybe<Array<Payments_Plans_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Plans_Order_By>>;
  where?: InputMaybe<Payments_Plans_Bool_Exp>;
};

export type Query_RootPayments_Plans_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Plans_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Plans_Order_By>>;
  where?: InputMaybe<Payments_Plans_Bool_Exp>;
};

export type Query_RootPayments_Plans_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootPayments_ProvidersArgs = {
  distinct_on?: InputMaybe<Array<Payments_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Providers_Order_By>>;
  where?: InputMaybe<Payments_Providers_Bool_Exp>;
};

export type Query_RootPayments_Providers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Providers_Order_By>>;
  where?: InputMaybe<Payments_Providers_Bool_Exp>;
};

export type Query_RootPayments_Providers_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootPayments_SubscriptionsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Subscriptions_Order_By>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

export type Query_RootPayments_Subscriptions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Subscriptions_Order_By>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

export type Query_RootPayments_Subscriptions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootPayments_User_Payment_Provider_MappingsArgs = {
  distinct_on?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Select_Column>
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Order_By>
  >;
  where?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
};

export type Query_RootPayments_User_Payment_Provider_Mappings_AggregateArgs = {
  distinct_on?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Select_Column>
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Order_By>
  >;
  where?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
};

export type Query_RootPayments_User_Payment_Provider_Mappings_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootRepliesArgs = {
  distinct_on?: InputMaybe<Array<Replies_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Replies_Order_By>>;
  where?: InputMaybe<Replies_Bool_Exp>;
};

export type Query_RootReplies_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Replies_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Replies_Order_By>>;
  where?: InputMaybe<Replies_Bool_Exp>;
};

export type Query_RootReplies_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootRoomsArgs = {
  distinct_on?: InputMaybe<Array<Rooms_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Rooms_Order_By>>;
  where?: InputMaybe<Rooms_Bool_Exp>;
};

export type Query_RootRooms_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rooms_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Rooms_Order_By>>;
  where?: InputMaybe<Rooms_Bool_Exp>;
};

export type Query_RootRooms_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootScheduleArgs = {
  distinct_on?: InputMaybe<Array<Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Schedule_Order_By>>;
  where?: InputMaybe<Schedule_Bool_Exp>;
};

export type Query_RootSchedule_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Schedule_Order_By>>;
  where?: InputMaybe<Schedule_Bool_Exp>;
};

export type Query_RootSchedule_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Query_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Query_RootUsers_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootVerification_CodesArgs = {
  distinct_on?: InputMaybe<Array<Verification_Codes_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Verification_Codes_Order_By>>;
  where?: InputMaybe<Verification_Codes_Bool_Exp>;
};

export type Query_RootVerification_Codes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Verification_Codes_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Verification_Codes_Order_By>>;
  where?: InputMaybe<Verification_Codes_Bool_Exp>;
};

export type Query_RootVerification_Codes_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootVirusArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootVirusesArgs = {
  distinct_on?: InputMaybe<Array<Virus_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Virus_Order_By>>;
  where?: InputMaybe<Virus_Bool_Exp>;
};

export type Query_RootVirusesAggregateArgs = {
  distinct_on?: InputMaybe<Array<Virus_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Virus_Order_By>>;
  where?: InputMaybe<Virus_Bool_Exp>;
};

/** columns and relationships of "replies" */
export type Replies = {
  __typename?: "replies";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** An object relationship */
  message?: Maybe<Messages>;
  message_id?: Maybe<Scalars["uuid"]["output"]>;
  /** An object relationship */
  room: Rooms;
  room_id: Scalars["uuid"]["output"];
  updated_at: Scalars["bigint"]["output"];
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregated selection of "replies" */
export type Replies_Aggregate = {
  __typename?: "replies_aggregate";
  aggregate?: Maybe<Replies_Aggregate_Fields>;
  nodes: Array<Replies>;
};

export type Replies_Aggregate_Bool_Exp = {
  count?: InputMaybe<Replies_Aggregate_Bool_Exp_Count>;
};

export type Replies_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Replies_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Replies_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "replies" */
export type Replies_Aggregate_Fields = {
  __typename?: "replies_aggregate_fields";
  avg?: Maybe<Replies_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Replies_Max_Fields>;
  min?: Maybe<Replies_Min_Fields>;
  stddev?: Maybe<Replies_Stddev_Fields>;
  stddev_pop?: Maybe<Replies_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Replies_Stddev_Samp_Fields>;
  sum?: Maybe<Replies_Sum_Fields>;
  var_pop?: Maybe<Replies_Var_Pop_Fields>;
  var_samp?: Maybe<Replies_Var_Samp_Fields>;
  variance?: Maybe<Replies_Variance_Fields>;
};

/** aggregate fields of "replies" */
export type Replies_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Replies_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "replies" */
export type Replies_Aggregate_Order_By = {
  avg?: InputMaybe<Replies_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Replies_Max_Order_By>;
  min?: InputMaybe<Replies_Min_Order_By>;
  stddev?: InputMaybe<Replies_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Replies_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Replies_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Replies_Sum_Order_By>;
  var_pop?: InputMaybe<Replies_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Replies_Var_Samp_Order_By>;
  variance?: InputMaybe<Replies_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "replies" */
export type Replies_Arr_Rel_Insert_Input = {
  data: Array<Replies_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Replies_On_Conflict>;
};

/** aggregate avg on columns */
export type Replies_Avg_Fields = {
  __typename?: "replies_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "replies" */
export type Replies_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "replies". All fields are combined with a logical 'AND'. */
export type Replies_Bool_Exp = {
  _and?: InputMaybe<Array<Replies_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Replies_Bool_Exp>;
  _or?: InputMaybe<Array<Replies_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  message?: InputMaybe<Messages_Bool_Exp>;
  message_id?: InputMaybe<Uuid_Comparison_Exp>;
  room?: InputMaybe<Rooms_Bool_Exp>;
  room_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "replies" */
export enum Replies_Constraint {
  /** unique or primary key constraint on columns "id" */
  RepliesPkey = "replies_pkey",
}

/** input type for incrementing numeric columns in table "replies" */
export type Replies_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "replies" */
export type Replies_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  message?: InputMaybe<Messages_Obj_Rel_Insert_Input>;
  message_id?: InputMaybe<Scalars["uuid"]["input"]>;
  room?: InputMaybe<Rooms_Obj_Rel_Insert_Input>;
  room_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Replies_Max_Fields = {
  __typename?: "replies_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  message_id?: Maybe<Scalars["uuid"]["output"]>;
  room_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "replies" */
export type Replies_Max_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  message_id?: InputMaybe<Order_By>;
  room_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Replies_Min_Fields = {
  __typename?: "replies_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  message_id?: Maybe<Scalars["uuid"]["output"]>;
  room_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "replies" */
export type Replies_Min_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  message_id?: InputMaybe<Order_By>;
  room_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "replies" */
export type Replies_Mutation_Response = {
  __typename?: "replies_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Replies>;
};

/** input type for inserting object relation for remote table "replies" */
export type Replies_Obj_Rel_Insert_Input = {
  data: Replies_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Replies_On_Conflict>;
};

/** on_conflict condition type for table "replies" */
export type Replies_On_Conflict = {
  constraint: Replies_Constraint;
  update_columns?: Array<Replies_Update_Column>;
  where?: InputMaybe<Replies_Bool_Exp>;
};

/** Ordering options when selecting data from "replies". */
export type Replies_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  message?: InputMaybe<Messages_Order_By>;
  message_id?: InputMaybe<Order_By>;
  room?: InputMaybe<Rooms_Order_By>;
  room_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: replies */
export type Replies_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "replies" */
export enum Replies_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  MessageId = "message_id",
  /** column name */
  RoomId = "room_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "replies" */
export type Replies_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  message_id?: InputMaybe<Scalars["uuid"]["input"]>;
  room_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Replies_Stddev_Fields = {
  __typename?: "replies_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "replies" */
export type Replies_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Replies_Stddev_Pop_Fields = {
  __typename?: "replies_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "replies" */
export type Replies_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Replies_Stddev_Samp_Fields = {
  __typename?: "replies_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "replies" */
export type Replies_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "replies" */
export type Replies_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Replies_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Replies_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  message_id?: InputMaybe<Scalars["uuid"]["input"]>;
  room_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Replies_Sum_Fields = {
  __typename?: "replies_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "replies" */
export type Replies_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "replies" */
export enum Replies_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  MessageId = "message_id",
  /** column name */
  RoomId = "room_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Replies_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Replies_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Replies_Set_Input>;
  /** filter the rows which have to be updated */
  where: Replies_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Replies_Var_Pop_Fields = {
  __typename?: "replies_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "replies" */
export type Replies_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Replies_Var_Samp_Fields = {
  __typename?: "replies_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "replies" */
export type Replies_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Replies_Variance_Fields = {
  __typename?: "replies_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "replies" */
export type Replies_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "rooms" */
export type Rooms = {
  __typename?: "rooms";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  allow_change_users: Scalars["jsonb"]["output"];
  allow_delete_users: Scalars["jsonb"]["output"];
  allow_remove_users: Scalars["jsonb"]["output"];
  allow_reply_users: Scalars["jsonb"]["output"];
  allow_select_users: Scalars["jsonb"]["output"];
  created_at: Scalars["bigint"]["output"];
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** An array relationship */
  replies: Array<Replies>;
  /** An aggregate relationship */
  replies_aggregate: Replies_Aggregate;
  title?: Maybe<Scalars["String"]["output"]>;
  updated_at: Scalars["bigint"]["output"];
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "rooms" */
export type RoomsAllow_Change_UsersArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "rooms" */
export type RoomsAllow_Delete_UsersArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "rooms" */
export type RoomsAllow_Remove_UsersArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "rooms" */
export type RoomsAllow_Reply_UsersArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "rooms" */
export type RoomsAllow_Select_UsersArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "rooms" */
export type RoomsRepliesArgs = {
  distinct_on?: InputMaybe<Array<Replies_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Replies_Order_By>>;
  where?: InputMaybe<Replies_Bool_Exp>;
};

/** columns and relationships of "rooms" */
export type RoomsReplies_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Replies_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Replies_Order_By>>;
  where?: InputMaybe<Replies_Bool_Exp>;
};

/** aggregated selection of "rooms" */
export type Rooms_Aggregate = {
  __typename?: "rooms_aggregate";
  aggregate?: Maybe<Rooms_Aggregate_Fields>;
  nodes: Array<Rooms>;
};

/** aggregate fields of "rooms" */
export type Rooms_Aggregate_Fields = {
  __typename?: "rooms_aggregate_fields";
  avg?: Maybe<Rooms_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Rooms_Max_Fields>;
  min?: Maybe<Rooms_Min_Fields>;
  stddev?: Maybe<Rooms_Stddev_Fields>;
  stddev_pop?: Maybe<Rooms_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rooms_Stddev_Samp_Fields>;
  sum?: Maybe<Rooms_Sum_Fields>;
  var_pop?: Maybe<Rooms_Var_Pop_Fields>;
  var_samp?: Maybe<Rooms_Var_Samp_Fields>;
  variance?: Maybe<Rooms_Variance_Fields>;
};

/** aggregate fields of "rooms" */
export type Rooms_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rooms_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Rooms_Append_Input = {
  allow_change_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  allow_delete_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  allow_remove_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  allow_reply_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  allow_select_users?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate avg on columns */
export type Rooms_Avg_Fields = {
  __typename?: "rooms_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "rooms". All fields are combined with a logical 'AND'. */
export type Rooms_Bool_Exp = {
  _and?: InputMaybe<Array<Rooms_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Rooms_Bool_Exp>;
  _or?: InputMaybe<Array<Rooms_Bool_Exp>>;
  allow_change_users?: InputMaybe<Jsonb_Comparison_Exp>;
  allow_delete_users?: InputMaybe<Jsonb_Comparison_Exp>;
  allow_remove_users?: InputMaybe<Jsonb_Comparison_Exp>;
  allow_reply_users?: InputMaybe<Jsonb_Comparison_Exp>;
  allow_select_users?: InputMaybe<Jsonb_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  replies?: InputMaybe<Replies_Bool_Exp>;
  replies_aggregate?: InputMaybe<Replies_Aggregate_Bool_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "rooms" */
export enum Rooms_Constraint {
  /** unique or primary key constraint on columns "id" */
  RoomsPkey = "rooms_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Rooms_Delete_At_Path_Input = {
  allow_change_users?: InputMaybe<Array<Scalars["String"]["input"]>>;
  allow_delete_users?: InputMaybe<Array<Scalars["String"]["input"]>>;
  allow_remove_users?: InputMaybe<Array<Scalars["String"]["input"]>>;
  allow_reply_users?: InputMaybe<Array<Scalars["String"]["input"]>>;
  allow_select_users?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Rooms_Delete_Elem_Input = {
  allow_change_users?: InputMaybe<Scalars["Int"]["input"]>;
  allow_delete_users?: InputMaybe<Scalars["Int"]["input"]>;
  allow_remove_users?: InputMaybe<Scalars["Int"]["input"]>;
  allow_reply_users?: InputMaybe<Scalars["Int"]["input"]>;
  allow_select_users?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Rooms_Delete_Key_Input = {
  allow_change_users?: InputMaybe<Scalars["String"]["input"]>;
  allow_delete_users?: InputMaybe<Scalars["String"]["input"]>;
  allow_remove_users?: InputMaybe<Scalars["String"]["input"]>;
  allow_reply_users?: InputMaybe<Scalars["String"]["input"]>;
  allow_select_users?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "rooms" */
export type Rooms_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "rooms" */
export type Rooms_Insert_Input = {
  allow_change_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  allow_delete_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  allow_remove_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  allow_reply_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  allow_select_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  replies?: InputMaybe<Replies_Arr_Rel_Insert_Input>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Rooms_Max_Fields = {
  __typename?: "rooms_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type Rooms_Min_Fields = {
  __typename?: "rooms_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "rooms" */
export type Rooms_Mutation_Response = {
  __typename?: "rooms_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Rooms>;
};

/** input type for inserting object relation for remote table "rooms" */
export type Rooms_Obj_Rel_Insert_Input = {
  data: Rooms_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Rooms_On_Conflict>;
};

/** on_conflict condition type for table "rooms" */
export type Rooms_On_Conflict = {
  constraint: Rooms_Constraint;
  update_columns?: Array<Rooms_Update_Column>;
  where?: InputMaybe<Rooms_Bool_Exp>;
};

/** Ordering options when selecting data from "rooms". */
export type Rooms_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  allow_change_users?: InputMaybe<Order_By>;
  allow_delete_users?: InputMaybe<Order_By>;
  allow_remove_users?: InputMaybe<Order_By>;
  allow_reply_users?: InputMaybe<Order_By>;
  allow_select_users?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  replies_aggregate?: InputMaybe<Replies_Aggregate_Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: rooms */
export type Rooms_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Rooms_Prepend_Input = {
  allow_change_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  allow_delete_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  allow_remove_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  allow_reply_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  allow_select_users?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "rooms" */
export enum Rooms_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  AllowChangeUsers = "allow_change_users",
  /** column name */
  AllowDeleteUsers = "allow_delete_users",
  /** column name */
  AllowRemoveUsers = "allow_remove_users",
  /** column name */
  AllowReplyUsers = "allow_reply_users",
  /** column name */
  AllowSelectUsers = "allow_select_users",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Title = "title",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "rooms" */
export type Rooms_Set_Input = {
  allow_change_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  allow_delete_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  allow_remove_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  allow_reply_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  allow_select_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Rooms_Stddev_Fields = {
  __typename?: "rooms_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Rooms_Stddev_Pop_Fields = {
  __typename?: "rooms_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Rooms_Stddev_Samp_Fields = {
  __typename?: "rooms_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "rooms" */
export type Rooms_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rooms_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rooms_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  allow_change_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  allow_delete_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  allow_remove_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  allow_reply_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  allow_select_users?: InputMaybe<Scalars["jsonb"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Rooms_Sum_Fields = {
  __typename?: "rooms_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "rooms" */
export enum Rooms_Update_Column {
  /** column name */
  AllowChangeUsers = "allow_change_users",
  /** column name */
  AllowDeleteUsers = "allow_delete_users",
  /** column name */
  AllowRemoveUsers = "allow_remove_users",
  /** column name */
  AllowReplyUsers = "allow_reply_users",
  /** column name */
  AllowSelectUsers = "allow_select_users",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Title = "title",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Rooms_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Rooms_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Rooms_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Rooms_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Rooms_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rooms_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Rooms_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rooms_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rooms_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rooms_Var_Pop_Fields = {
  __typename?: "rooms_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Rooms_Var_Samp_Fields = {
  __typename?: "rooms_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Rooms_Variance_Fields = {
  __typename?: "rooms_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "schedule" */
export type Schedule = {
  __typename?: "schedule";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  cron: Scalars["String"]["output"];
  duration_sec?: Maybe<Scalars["bigint"]["output"]>;
  end_at?: Maybe<Scalars["bigint"]["output"]>;
  /** An array relationship */
  events: Array<Events>;
  /** An aggregate relationship */
  events_aggregate: Events_Aggregate;
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  meta?: Maybe<Scalars["jsonb"]["output"]>;
  object_id?: Maybe<Scalars["uuid"]["output"]>;
  start_at: Scalars["bigint"]["output"];
  title?: Maybe<Scalars["String"]["output"]>;
  updated_at: Scalars["bigint"]["output"];
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** columns and relationships of "schedule" */
export type ScheduleEventsArgs = {
  distinct_on?: InputMaybe<Array<Events_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Events_Order_By>>;
  where?: InputMaybe<Events_Bool_Exp>;
};

/** columns and relationships of "schedule" */
export type ScheduleEvents_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Events_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Events_Order_By>>;
  where?: InputMaybe<Events_Bool_Exp>;
};

/** columns and relationships of "schedule" */
export type ScheduleMetaArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "schedule" */
export type Schedule_Aggregate = {
  __typename?: "schedule_aggregate";
  aggregate?: Maybe<Schedule_Aggregate_Fields>;
  nodes: Array<Schedule>;
};

/** aggregate fields of "schedule" */
export type Schedule_Aggregate_Fields = {
  __typename?: "schedule_aggregate_fields";
  avg?: Maybe<Schedule_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Schedule_Max_Fields>;
  min?: Maybe<Schedule_Min_Fields>;
  stddev?: Maybe<Schedule_Stddev_Fields>;
  stddev_pop?: Maybe<Schedule_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Schedule_Stddev_Samp_Fields>;
  sum?: Maybe<Schedule_Sum_Fields>;
  var_pop?: Maybe<Schedule_Var_Pop_Fields>;
  var_samp?: Maybe<Schedule_Var_Samp_Fields>;
  variance?: Maybe<Schedule_Variance_Fields>;
};

/** aggregate fields of "schedule" */
export type Schedule_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Schedule_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Schedule_Append_Input = {
  meta?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate avg on columns */
export type Schedule_Avg_Fields = {
  __typename?: "schedule_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  duration_sec?: Maybe<Scalars["Float"]["output"]>;
  end_at?: Maybe<Scalars["Float"]["output"]>;
  start_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "schedule". All fields are combined with a logical 'AND'. */
export type Schedule_Bool_Exp = {
  _and?: InputMaybe<Array<Schedule_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Schedule_Bool_Exp>;
  _or?: InputMaybe<Array<Schedule_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  cron?: InputMaybe<String_Comparison_Exp>;
  duration_sec?: InputMaybe<Bigint_Comparison_Exp>;
  end_at?: InputMaybe<Bigint_Comparison_Exp>;
  events?: InputMaybe<Events_Bool_Exp>;
  events_aggregate?: InputMaybe<Events_Aggregate_Bool_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  meta?: InputMaybe<Jsonb_Comparison_Exp>;
  object_id?: InputMaybe<Uuid_Comparison_Exp>;
  start_at?: InputMaybe<Bigint_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "schedule" */
export enum Schedule_Constraint {
  /** unique or primary key constraint on columns "id" */
  SchedulePkey = "schedule_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Schedule_Delete_At_Path_Input = {
  meta?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Schedule_Delete_Elem_Input = {
  meta?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Schedule_Delete_Key_Input = {
  meta?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "schedule" */
export type Schedule_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  duration_sec?: InputMaybe<Scalars["bigint"]["input"]>;
  end_at?: InputMaybe<Scalars["bigint"]["input"]>;
  start_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "schedule" */
export type Schedule_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  cron?: InputMaybe<Scalars["String"]["input"]>;
  duration_sec?: InputMaybe<Scalars["bigint"]["input"]>;
  end_at?: InputMaybe<Scalars["bigint"]["input"]>;
  events?: InputMaybe<Events_Arr_Rel_Insert_Input>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  meta?: InputMaybe<Scalars["jsonb"]["input"]>;
  object_id?: InputMaybe<Scalars["uuid"]["input"]>;
  start_at?: InputMaybe<Scalars["bigint"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Schedule_Max_Fields = {
  __typename?: "schedule_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  cron?: Maybe<Scalars["String"]["output"]>;
  duration_sec?: Maybe<Scalars["bigint"]["output"]>;
  end_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  object_id?: Maybe<Scalars["uuid"]["output"]>;
  start_at?: Maybe<Scalars["bigint"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type Schedule_Min_Fields = {
  __typename?: "schedule_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  cron?: Maybe<Scalars["String"]["output"]>;
  duration_sec?: Maybe<Scalars["bigint"]["output"]>;
  end_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  object_id?: Maybe<Scalars["uuid"]["output"]>;
  start_at?: Maybe<Scalars["bigint"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "schedule" */
export type Schedule_Mutation_Response = {
  __typename?: "schedule_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Schedule>;
};

/** input type for inserting object relation for remote table "schedule" */
export type Schedule_Obj_Rel_Insert_Input = {
  data: Schedule_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Schedule_On_Conflict>;
};

/** on_conflict condition type for table "schedule" */
export type Schedule_On_Conflict = {
  constraint: Schedule_Constraint;
  update_columns?: Array<Schedule_Update_Column>;
  where?: InputMaybe<Schedule_Bool_Exp>;
};

/** Ordering options when selecting data from "schedule". */
export type Schedule_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  cron?: InputMaybe<Order_By>;
  duration_sec?: InputMaybe<Order_By>;
  end_at?: InputMaybe<Order_By>;
  events_aggregate?: InputMaybe<Events_Aggregate_Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  meta?: InputMaybe<Order_By>;
  object_id?: InputMaybe<Order_By>;
  start_at?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: schedule */
export type Schedule_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Schedule_Prepend_Input = {
  meta?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "schedule" */
export enum Schedule_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Cron = "cron",
  /** column name */
  DurationSec = "duration_sec",
  /** column name */
  EndAt = "end_at",
  /** column name */
  Id = "id",
  /** column name */
  Meta = "meta",
  /** column name */
  ObjectId = "object_id",
  /** column name */
  StartAt = "start_at",
  /** column name */
  Title = "title",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "schedule" */
export type Schedule_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  cron?: InputMaybe<Scalars["String"]["input"]>;
  duration_sec?: InputMaybe<Scalars["bigint"]["input"]>;
  end_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  meta?: InputMaybe<Scalars["jsonb"]["input"]>;
  object_id?: InputMaybe<Scalars["uuid"]["input"]>;
  start_at?: InputMaybe<Scalars["bigint"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Schedule_Stddev_Fields = {
  __typename?: "schedule_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  duration_sec?: Maybe<Scalars["Float"]["output"]>;
  end_at?: Maybe<Scalars["Float"]["output"]>;
  start_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Schedule_Stddev_Pop_Fields = {
  __typename?: "schedule_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  duration_sec?: Maybe<Scalars["Float"]["output"]>;
  end_at?: Maybe<Scalars["Float"]["output"]>;
  start_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Schedule_Stddev_Samp_Fields = {
  __typename?: "schedule_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  duration_sec?: Maybe<Scalars["Float"]["output"]>;
  end_at?: Maybe<Scalars["Float"]["output"]>;
  start_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "schedule" */
export type Schedule_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Schedule_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Schedule_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  cron?: InputMaybe<Scalars["String"]["input"]>;
  duration_sec?: InputMaybe<Scalars["bigint"]["input"]>;
  end_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  meta?: InputMaybe<Scalars["jsonb"]["input"]>;
  object_id?: InputMaybe<Scalars["uuid"]["input"]>;
  start_at?: InputMaybe<Scalars["bigint"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Schedule_Sum_Fields = {
  __typename?: "schedule_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  duration_sec?: Maybe<Scalars["bigint"]["output"]>;
  end_at?: Maybe<Scalars["bigint"]["output"]>;
  start_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "schedule" */
export enum Schedule_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Cron = "cron",
  /** column name */
  DurationSec = "duration_sec",
  /** column name */
  EndAt = "end_at",
  /** column name */
  Id = "id",
  /** column name */
  Meta = "meta",
  /** column name */
  ObjectId = "object_id",
  /** column name */
  StartAt = "start_at",
  /** column name */
  Title = "title",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Schedule_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Schedule_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Schedule_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Schedule_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Schedule_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Schedule_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Schedule_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Schedule_Set_Input>;
  /** filter the rows which have to be updated */
  where: Schedule_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Schedule_Var_Pop_Fields = {
  __typename?: "schedule_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  duration_sec?: Maybe<Scalars["Float"]["output"]>;
  end_at?: Maybe<Scalars["Float"]["output"]>;
  start_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Schedule_Var_Samp_Fields = {
  __typename?: "schedule_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  duration_sec?: Maybe<Scalars["Float"]["output"]>;
  end_at?: Maybe<Scalars["Float"]["output"]>;
  start_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Schedule_Variance_Fields = {
  __typename?: "schedule_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  duration_sec?: Maybe<Scalars["Float"]["output"]>;
  end_at?: Maybe<Scalars["Float"]["output"]>;
  start_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

export type St_D_Within_Geography_Input = {
  distance: Scalars["Float"]["input"];
  from: Scalars["geography"]["input"];
  use_spheroid?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type St_D_Within_Input = {
  distance: Scalars["Float"]["input"];
  from: Scalars["geometry"]["input"];
};

export type Subscription_Root = {
  __typename?: "subscription_root";
  /** An array relationship */
  accounts: Array<Accounts>;
  /** An aggregate relationship */
  accounts_aggregate: Accounts_Aggregate;
  /** fetch data from the table: "accounts" using primary key columns */
  accounts_by_pk?: Maybe<Accounts>;
  /** fetch data from the table in a streaming manner: "accounts" */
  accounts_stream: Array<Accounts>;
  /** fetch data from the table: "auth_jwt" */
  auth_jwt: Array<Auth_Jwt>;
  /** fetch aggregated fields from the table: "auth_jwt" */
  auth_jwt_aggregate: Auth_Jwt_Aggregate;
  /** fetch data from the table: "auth_jwt" using primary key columns */
  auth_jwt_by_pk?: Maybe<Auth_Jwt>;
  /** fetch data from the table in a streaming manner: "auth_jwt" */
  auth_jwt_stream: Array<Auth_Jwt>;
  /** fetch data from the table: "storage.buckets" using primary key columns */
  bucket?: Maybe<Buckets>;
  /** fetch data from the table: "storage.buckets" */
  buckets: Array<Buckets>;
  /** fetch aggregated fields from the table: "storage.buckets" */
  bucketsAggregate: Buckets_Aggregate;
  /** fetch data from the table in a streaming manner: "storage.buckets" */
  buckets_stream: Array<Buckets>;
  /** fetch data from the table: "debug" */
  debug: Array<Debug>;
  /** fetch aggregated fields from the table: "debug" */
  debug_aggregate: Debug_Aggregate;
  /** fetch data from the table: "debug" using primary key columns */
  debug_by_pk?: Maybe<Debug>;
  /** fetch data from the table in a streaming manner: "debug" */
  debug_stream: Array<Debug>;
  /** An array relationship */
  events: Array<Events>;
  /** An aggregate relationship */
  events_aggregate: Events_Aggregate;
  /** fetch data from the table: "events" using primary key columns */
  events_by_pk?: Maybe<Events>;
  /** fetch data from the table in a streaming manner: "events" */
  events_stream: Array<Events>;
  /** fetch data from the table: "storage.files" using primary key columns */
  file?: Maybe<Files>;
  /** An array relationship */
  files: Array<Files>;
  /** fetch aggregated fields from the table: "storage.files" */
  filesAggregate: Files_Aggregate;
  /** fetch data from the table in a streaming manner: "storage.files" */
  files_stream: Array<Files>;
  /** fetch data from the table: "geo.features" */
  geo_features: Array<Geo_Features>;
  /** fetch aggregated fields from the table: "geo.features" */
  geo_features_aggregate: Geo_Features_Aggregate;
  /** fetch data from the table: "geo.features" using primary key columns */
  geo_features_by_pk?: Maybe<Geo_Features>;
  /** fetch data from the table in a streaming manner: "geo.features" */
  geo_features_stream: Array<Geo_Features>;
  /** fetch data from the table: "github_issues" */
  github_issues: Array<Github_Issues>;
  /** fetch aggregated fields from the table: "github_issues" */
  github_issues_aggregate: Github_Issues_Aggregate;
  /** fetch data from the table: "github_issues" using primary key columns */
  github_issues_by_pk?: Maybe<Github_Issues>;
  /** fetch data from the table in a streaming manner: "github_issues" */
  github_issues_stream: Array<Github_Issues>;
  /** fetch data from the table: "groups" */
  groups: Array<Groups>;
  /** fetch aggregated fields from the table: "groups" */
  groups_aggregate: Groups_Aggregate;
  /** fetch data from the table: "groups" using primary key columns */
  groups_by_pk?: Maybe<Groups>;
  /** fetch data from the table in a streaming manner: "groups" */
  groups_stream: Array<Groups>;
  /** fetch data from the table: "hasyx" */
  hasyx: Array<Hasyx>;
  /** fetch aggregated fields from the table: "hasyx" */
  hasyx_aggregate: Hasyx_Aggregate;
  /** fetch data from the table in a streaming manner: "hasyx" */
  hasyx_stream: Array<Hasyx>;
  /** An array relationship */
  invitations: Array<Invitations>;
  /** An aggregate relationship */
  invitations_aggregate: Invitations_Aggregate;
  /** fetch data from the table: "invitations" using primary key columns */
  invitations_by_pk?: Maybe<Invitations>;
  /** fetch data from the table in a streaming manner: "invitations" */
  invitations_stream: Array<Invitations>;
  /** fetch data from the table: "invited" */
  invited: Array<Invited>;
  /** fetch aggregated fields from the table: "invited" */
  invited_aggregate: Invited_Aggregate;
  /** fetch data from the table: "invited" using primary key columns */
  invited_by_pk?: Maybe<Invited>;
  /** fetch data from the table in a streaming manner: "invited" */
  invited_stream: Array<Invited>;
  /** fetch data from the table: "invites" */
  invites: Array<Invites>;
  /** fetch aggregated fields from the table: "invites" */
  invites_aggregate: Invites_Aggregate;
  /** fetch data from the table: "invites" using primary key columns */
  invites_by_pk?: Maybe<Invites>;
  /** fetch data from the table in a streaming manner: "invites" */
  invites_stream: Array<Invites>;
  /** fetch data from the table: "logs.diffs" */
  logs_diffs: Array<Logs_Diffs>;
  /** fetch aggregated fields from the table: "logs.diffs" */
  logs_diffs_aggregate: Logs_Diffs_Aggregate;
  /** fetch data from the table: "logs.diffs" using primary key columns */
  logs_diffs_by_pk?: Maybe<Logs_Diffs>;
  /** fetch data from the table in a streaming manner: "logs.diffs" */
  logs_diffs_stream: Array<Logs_Diffs>;
  /** fetch data from the table: "logs.states" */
  logs_states: Array<Logs_States>;
  /** fetch aggregated fields from the table: "logs.states" */
  logs_states_aggregate: Logs_States_Aggregate;
  /** fetch data from the table: "logs.states" using primary key columns */
  logs_states_by_pk?: Maybe<Logs_States>;
  /** fetch data from the table in a streaming manner: "logs.states" */
  logs_states_stream: Array<Logs_States>;
  /** An array relationship */
  memberships: Array<Memberships>;
  /** An aggregate relationship */
  memberships_aggregate: Memberships_Aggregate;
  /** fetch data from the table: "memberships" using primary key columns */
  memberships_by_pk?: Maybe<Memberships>;
  /** fetch data from the table in a streaming manner: "memberships" */
  memberships_stream: Array<Memberships>;
  /** fetch data from the table: "message_reads" */
  message_reads: Array<Message_Reads>;
  /** fetch aggregated fields from the table: "message_reads" */
  message_reads_aggregate: Message_Reads_Aggregate;
  /** fetch data from the table: "message_reads" using primary key columns */
  message_reads_by_pk?: Maybe<Message_Reads>;
  /** fetch data from the table in a streaming manner: "message_reads" */
  message_reads_stream: Array<Message_Reads>;
  /** fetch data from the table: "messages" */
  messages: Array<Messages>;
  /** fetch aggregated fields from the table: "messages" */
  messages_aggregate: Messages_Aggregate;
  /** fetch data from the table: "messages" using primary key columns */
  messages_by_pk?: Maybe<Messages>;
  /** fetch data from the table in a streaming manner: "messages" */
  messages_stream: Array<Messages>;
  /** An array relationship */
  notification_messages: Array<Notification_Messages>;
  /** An aggregate relationship */
  notification_messages_aggregate: Notification_Messages_Aggregate;
  /** fetch data from the table: "notification_messages" using primary key columns */
  notification_messages_by_pk?: Maybe<Notification_Messages>;
  /** fetch data from the table in a streaming manner: "notification_messages" */
  notification_messages_stream: Array<Notification_Messages>;
  /** An array relationship */
  notification_permissions: Array<Notification_Permissions>;
  /** An aggregate relationship */
  notification_permissions_aggregate: Notification_Permissions_Aggregate;
  /** fetch data from the table: "notification_permissions" using primary key columns */
  notification_permissions_by_pk?: Maybe<Notification_Permissions>;
  /** fetch data from the table in a streaming manner: "notification_permissions" */
  notification_permissions_stream: Array<Notification_Permissions>;
  /** An array relationship */
  notifications: Array<Notifications>;
  /** An aggregate relationship */
  notifications_aggregate: Notifications_Aggregate;
  /** fetch data from the table: "notifications" using primary key columns */
  notifications_by_pk?: Maybe<Notifications>;
  /** fetch data from the table in a streaming manner: "notifications" */
  notifications_stream: Array<Notifications>;
  /** fetch data from the table: "payments.methods" */
  payments_methods: Array<Payments_Methods>;
  /** fetch aggregated fields from the table: "payments.methods" */
  payments_methods_aggregate: Payments_Methods_Aggregate;
  /** fetch data from the table: "payments.methods" using primary key columns */
  payments_methods_by_pk?: Maybe<Payments_Methods>;
  /** fetch data from the table in a streaming manner: "payments.methods" */
  payments_methods_stream: Array<Payments_Methods>;
  /** fetch data from the table: "payments.operations" */
  payments_operations: Array<Payments_Operations>;
  /** fetch aggregated fields from the table: "payments.operations" */
  payments_operations_aggregate: Payments_Operations_Aggregate;
  /** fetch data from the table: "payments.operations" using primary key columns */
  payments_operations_by_pk?: Maybe<Payments_Operations>;
  /** fetch data from the table in a streaming manner: "payments.operations" */
  payments_operations_stream: Array<Payments_Operations>;
  /** fetch data from the table: "payments.plans" */
  payments_plans: Array<Payments_Plans>;
  /** fetch aggregated fields from the table: "payments.plans" */
  payments_plans_aggregate: Payments_Plans_Aggregate;
  /** fetch data from the table: "payments.plans" using primary key columns */
  payments_plans_by_pk?: Maybe<Payments_Plans>;
  /** fetch data from the table in a streaming manner: "payments.plans" */
  payments_plans_stream: Array<Payments_Plans>;
  /** fetch data from the table: "payments.providers" */
  payments_providers: Array<Payments_Providers>;
  /** fetch aggregated fields from the table: "payments.providers" */
  payments_providers_aggregate: Payments_Providers_Aggregate;
  /** fetch data from the table: "payments.providers" using primary key columns */
  payments_providers_by_pk?: Maybe<Payments_Providers>;
  /** fetch data from the table in a streaming manner: "payments.providers" */
  payments_providers_stream: Array<Payments_Providers>;
  /** fetch data from the table: "payments.subscriptions" */
  payments_subscriptions: Array<Payments_Subscriptions>;
  /** fetch aggregated fields from the table: "payments.subscriptions" */
  payments_subscriptions_aggregate: Payments_Subscriptions_Aggregate;
  /** fetch data from the table: "payments.subscriptions" using primary key columns */
  payments_subscriptions_by_pk?: Maybe<Payments_Subscriptions>;
  /** fetch data from the table in a streaming manner: "payments.subscriptions" */
  payments_subscriptions_stream: Array<Payments_Subscriptions>;
  /** fetch data from the table: "payments.user_payment_provider_mappings" */
  payments_user_payment_provider_mappings: Array<Payments_User_Payment_Provider_Mappings>;
  /** fetch aggregated fields from the table: "payments.user_payment_provider_mappings" */
  payments_user_payment_provider_mappings_aggregate: Payments_User_Payment_Provider_Mappings_Aggregate;
  /** fetch data from the table: "payments.user_payment_provider_mappings" using primary key columns */
  payments_user_payment_provider_mappings_by_pk?: Maybe<Payments_User_Payment_Provider_Mappings>;
  /** fetch data from the table in a streaming manner: "payments.user_payment_provider_mappings" */
  payments_user_payment_provider_mappings_stream: Array<Payments_User_Payment_Provider_Mappings>;
  /** An array relationship */
  replies: Array<Replies>;
  /** An aggregate relationship */
  replies_aggregate: Replies_Aggregate;
  /** fetch data from the table: "replies" using primary key columns */
  replies_by_pk?: Maybe<Replies>;
  /** fetch data from the table in a streaming manner: "replies" */
  replies_stream: Array<Replies>;
  /** fetch data from the table: "rooms" */
  rooms: Array<Rooms>;
  /** fetch aggregated fields from the table: "rooms" */
  rooms_aggregate: Rooms_Aggregate;
  /** fetch data from the table: "rooms" using primary key columns */
  rooms_by_pk?: Maybe<Rooms>;
  /** fetch data from the table in a streaming manner: "rooms" */
  rooms_stream: Array<Rooms>;
  /** fetch data from the table: "schedule" */
  schedule: Array<Schedule>;
  /** fetch aggregated fields from the table: "schedule" */
  schedule_aggregate: Schedule_Aggregate;
  /** fetch data from the table: "schedule" using primary key columns */
  schedule_by_pk?: Maybe<Schedule>;
  /** fetch data from the table in a streaming manner: "schedule" */
  schedule_stream: Array<Schedule>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
  /** fetch data from the table in a streaming manner: "users" */
  users_stream: Array<Users>;
  /** fetch data from the table: "verification_codes" */
  verification_codes: Array<Verification_Codes>;
  /** fetch aggregated fields from the table: "verification_codes" */
  verification_codes_aggregate: Verification_Codes_Aggregate;
  /** fetch data from the table: "verification_codes" using primary key columns */
  verification_codes_by_pk?: Maybe<Verification_Codes>;
  /** fetch data from the table in a streaming manner: "verification_codes" */
  verification_codes_stream: Array<Verification_Codes>;
  /** fetch data from the table: "storage.virus" using primary key columns */
  virus?: Maybe<Virus>;
  /** fetch data from the table in a streaming manner: "storage.virus" */
  virus_stream: Array<Virus>;
  /** fetch data from the table: "storage.virus" */
  viruses: Array<Virus>;
  /** fetch aggregated fields from the table: "storage.virus" */
  virusesAggregate: Virus_Aggregate;
};

export type Subscription_RootAccountsArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

export type Subscription_RootAccounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

export type Subscription_RootAccounts_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootAccounts_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Accounts_Stream_Cursor_Input>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

export type Subscription_RootAuth_JwtArgs = {
  distinct_on?: InputMaybe<Array<Auth_Jwt_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Jwt_Order_By>>;
  where?: InputMaybe<Auth_Jwt_Bool_Exp>;
};

export type Subscription_RootAuth_Jwt_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Auth_Jwt_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Jwt_Order_By>>;
  where?: InputMaybe<Auth_Jwt_Bool_Exp>;
};

export type Subscription_RootAuth_Jwt_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootAuth_Jwt_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Auth_Jwt_Stream_Cursor_Input>>;
  where?: InputMaybe<Auth_Jwt_Bool_Exp>;
};

export type Subscription_RootBucketArgs = {
  id: Scalars["String"]["input"];
};

export type Subscription_RootBucketsArgs = {
  distinct_on?: InputMaybe<Array<Buckets_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Buckets_Order_By>>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};

export type Subscription_RootBucketsAggregateArgs = {
  distinct_on?: InputMaybe<Array<Buckets_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Buckets_Order_By>>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};

export type Subscription_RootBuckets_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Buckets_Stream_Cursor_Input>>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};

export type Subscription_RootDebugArgs = {
  distinct_on?: InputMaybe<Array<Debug_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Debug_Order_By>>;
  where?: InputMaybe<Debug_Bool_Exp>;
};

export type Subscription_RootDebug_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Debug_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Debug_Order_By>>;
  where?: InputMaybe<Debug_Bool_Exp>;
};

export type Subscription_RootDebug_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootDebug_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Debug_Stream_Cursor_Input>>;
  where?: InputMaybe<Debug_Bool_Exp>;
};

export type Subscription_RootEventsArgs = {
  distinct_on?: InputMaybe<Array<Events_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Events_Order_By>>;
  where?: InputMaybe<Events_Bool_Exp>;
};

export type Subscription_RootEvents_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Events_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Events_Order_By>>;
  where?: InputMaybe<Events_Bool_Exp>;
};

export type Subscription_RootEvents_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootEvents_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Events_Stream_Cursor_Input>>;
  where?: InputMaybe<Events_Bool_Exp>;
};

export type Subscription_RootFileArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootFilesArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};

export type Subscription_RootFilesAggregateArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};

export type Subscription_RootFiles_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Files_Stream_Cursor_Input>>;
  where?: InputMaybe<Files_Bool_Exp>;
};

export type Subscription_RootGeo_FeaturesArgs = {
  distinct_on?: InputMaybe<Array<Geo_Features_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Geo_Features_Order_By>>;
  where?: InputMaybe<Geo_Features_Bool_Exp>;
};

export type Subscription_RootGeo_Features_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Geo_Features_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Geo_Features_Order_By>>;
  where?: InputMaybe<Geo_Features_Bool_Exp>;
};

export type Subscription_RootGeo_Features_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootGeo_Features_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Geo_Features_Stream_Cursor_Input>>;
  where?: InputMaybe<Geo_Features_Bool_Exp>;
};

export type Subscription_RootGithub_IssuesArgs = {
  distinct_on?: InputMaybe<Array<Github_Issues_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Github_Issues_Order_By>>;
  where?: InputMaybe<Github_Issues_Bool_Exp>;
};

export type Subscription_RootGithub_Issues_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Github_Issues_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Github_Issues_Order_By>>;
  where?: InputMaybe<Github_Issues_Bool_Exp>;
};

export type Subscription_RootGithub_Issues_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootGithub_Issues_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Github_Issues_Stream_Cursor_Input>>;
  where?: InputMaybe<Github_Issues_Bool_Exp>;
};

export type Subscription_RootGroupsArgs = {
  distinct_on?: InputMaybe<Array<Groups_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Groups_Order_By>>;
  where?: InputMaybe<Groups_Bool_Exp>;
};

export type Subscription_RootGroups_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Groups_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Groups_Order_By>>;
  where?: InputMaybe<Groups_Bool_Exp>;
};

export type Subscription_RootGroups_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootGroups_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Groups_Stream_Cursor_Input>>;
  where?: InputMaybe<Groups_Bool_Exp>;
};

export type Subscription_RootHasyxArgs = {
  distinct_on?: InputMaybe<Array<Hasyx_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Hasyx_Order_By>>;
  where?: InputMaybe<Hasyx_Bool_Exp>;
};

export type Subscription_RootHasyx_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Hasyx_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Hasyx_Order_By>>;
  where?: InputMaybe<Hasyx_Bool_Exp>;
};

export type Subscription_RootHasyx_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Hasyx_Stream_Cursor_Input>>;
  where?: InputMaybe<Hasyx_Bool_Exp>;
};

export type Subscription_RootInvitationsArgs = {
  distinct_on?: InputMaybe<Array<Invitations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Invitations_Order_By>>;
  where?: InputMaybe<Invitations_Bool_Exp>;
};

export type Subscription_RootInvitations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invitations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Invitations_Order_By>>;
  where?: InputMaybe<Invitations_Bool_Exp>;
};

export type Subscription_RootInvitations_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootInvitations_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Invitations_Stream_Cursor_Input>>;
  where?: InputMaybe<Invitations_Bool_Exp>;
};

export type Subscription_RootInvitedArgs = {
  distinct_on?: InputMaybe<Array<Invited_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Invited_Order_By>>;
  where?: InputMaybe<Invited_Bool_Exp>;
};

export type Subscription_RootInvited_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invited_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Invited_Order_By>>;
  where?: InputMaybe<Invited_Bool_Exp>;
};

export type Subscription_RootInvited_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootInvited_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Invited_Stream_Cursor_Input>>;
  where?: InputMaybe<Invited_Bool_Exp>;
};

export type Subscription_RootInvitesArgs = {
  distinct_on?: InputMaybe<Array<Invites_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Invites_Order_By>>;
  where?: InputMaybe<Invites_Bool_Exp>;
};

export type Subscription_RootInvites_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invites_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Invites_Order_By>>;
  where?: InputMaybe<Invites_Bool_Exp>;
};

export type Subscription_RootInvites_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootInvites_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Invites_Stream_Cursor_Input>>;
  where?: InputMaybe<Invites_Bool_Exp>;
};

export type Subscription_RootLogs_DiffsArgs = {
  distinct_on?: InputMaybe<Array<Logs_Diffs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Logs_Diffs_Order_By>>;
  where?: InputMaybe<Logs_Diffs_Bool_Exp>;
};

export type Subscription_RootLogs_Diffs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Logs_Diffs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Logs_Diffs_Order_By>>;
  where?: InputMaybe<Logs_Diffs_Bool_Exp>;
};

export type Subscription_RootLogs_Diffs_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootLogs_Diffs_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Logs_Diffs_Stream_Cursor_Input>>;
  where?: InputMaybe<Logs_Diffs_Bool_Exp>;
};

export type Subscription_RootLogs_StatesArgs = {
  distinct_on?: InputMaybe<Array<Logs_States_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Logs_States_Order_By>>;
  where?: InputMaybe<Logs_States_Bool_Exp>;
};

export type Subscription_RootLogs_States_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Logs_States_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Logs_States_Order_By>>;
  where?: InputMaybe<Logs_States_Bool_Exp>;
};

export type Subscription_RootLogs_States_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootLogs_States_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Logs_States_Stream_Cursor_Input>>;
  where?: InputMaybe<Logs_States_Bool_Exp>;
};

export type Subscription_RootMembershipsArgs = {
  distinct_on?: InputMaybe<Array<Memberships_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Memberships_Order_By>>;
  where?: InputMaybe<Memberships_Bool_Exp>;
};

export type Subscription_RootMemberships_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Memberships_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Memberships_Order_By>>;
  where?: InputMaybe<Memberships_Bool_Exp>;
};

export type Subscription_RootMemberships_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootMemberships_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Memberships_Stream_Cursor_Input>>;
  where?: InputMaybe<Memberships_Bool_Exp>;
};

export type Subscription_RootMessage_ReadsArgs = {
  distinct_on?: InputMaybe<Array<Message_Reads_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Message_Reads_Order_By>>;
  where?: InputMaybe<Message_Reads_Bool_Exp>;
};

export type Subscription_RootMessage_Reads_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Message_Reads_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Message_Reads_Order_By>>;
  where?: InputMaybe<Message_Reads_Bool_Exp>;
};

export type Subscription_RootMessage_Reads_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootMessage_Reads_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Message_Reads_Stream_Cursor_Input>>;
  where?: InputMaybe<Message_Reads_Bool_Exp>;
};

export type Subscription_RootMessagesArgs = {
  distinct_on?: InputMaybe<Array<Messages_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Messages_Order_By>>;
  where?: InputMaybe<Messages_Bool_Exp>;
};

export type Subscription_RootMessages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Messages_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Messages_Order_By>>;
  where?: InputMaybe<Messages_Bool_Exp>;
};

export type Subscription_RootMessages_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootMessages_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Messages_Stream_Cursor_Input>>;
  where?: InputMaybe<Messages_Bool_Exp>;
};

export type Subscription_RootNotification_MessagesArgs = {
  distinct_on?: InputMaybe<Array<Notification_Messages_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Messages_Order_By>>;
  where?: InputMaybe<Notification_Messages_Bool_Exp>;
};

export type Subscription_RootNotification_Messages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notification_Messages_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Messages_Order_By>>;
  where?: InputMaybe<Notification_Messages_Bool_Exp>;
};

export type Subscription_RootNotification_Messages_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootNotification_Messages_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Notification_Messages_Stream_Cursor_Input>>;
  where?: InputMaybe<Notification_Messages_Bool_Exp>;
};

export type Subscription_RootNotification_PermissionsArgs = {
  distinct_on?: InputMaybe<Array<Notification_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Permissions_Order_By>>;
  where?: InputMaybe<Notification_Permissions_Bool_Exp>;
};

export type Subscription_RootNotification_Permissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notification_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Permissions_Order_By>>;
  where?: InputMaybe<Notification_Permissions_Bool_Exp>;
};

export type Subscription_RootNotification_Permissions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootNotification_Permissions_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Notification_Permissions_Stream_Cursor_Input>>;
  where?: InputMaybe<Notification_Permissions_Bool_Exp>;
};

export type Subscription_RootNotificationsArgs = {
  distinct_on?: InputMaybe<Array<Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notifications_Order_By>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};

export type Subscription_RootNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notifications_Order_By>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};

export type Subscription_RootNotifications_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootNotifications_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Notifications_Stream_Cursor_Input>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};

export type Subscription_RootPayments_MethodsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Methods_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Methods_Order_By>>;
  where?: InputMaybe<Payments_Methods_Bool_Exp>;
};

export type Subscription_RootPayments_Methods_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Methods_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Methods_Order_By>>;
  where?: InputMaybe<Payments_Methods_Bool_Exp>;
};

export type Subscription_RootPayments_Methods_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootPayments_Methods_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Payments_Methods_Stream_Cursor_Input>>;
  where?: InputMaybe<Payments_Methods_Bool_Exp>;
};

export type Subscription_RootPayments_OperationsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Operations_Order_By>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

export type Subscription_RootPayments_Operations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Operations_Order_By>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

export type Subscription_RootPayments_Operations_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootPayments_Operations_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Payments_Operations_Stream_Cursor_Input>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

export type Subscription_RootPayments_PlansArgs = {
  distinct_on?: InputMaybe<Array<Payments_Plans_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Plans_Order_By>>;
  where?: InputMaybe<Payments_Plans_Bool_Exp>;
};

export type Subscription_RootPayments_Plans_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Plans_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Plans_Order_By>>;
  where?: InputMaybe<Payments_Plans_Bool_Exp>;
};

export type Subscription_RootPayments_Plans_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootPayments_Plans_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Payments_Plans_Stream_Cursor_Input>>;
  where?: InputMaybe<Payments_Plans_Bool_Exp>;
};

export type Subscription_RootPayments_ProvidersArgs = {
  distinct_on?: InputMaybe<Array<Payments_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Providers_Order_By>>;
  where?: InputMaybe<Payments_Providers_Bool_Exp>;
};

export type Subscription_RootPayments_Providers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Providers_Order_By>>;
  where?: InputMaybe<Payments_Providers_Bool_Exp>;
};

export type Subscription_RootPayments_Providers_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootPayments_Providers_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Payments_Providers_Stream_Cursor_Input>>;
  where?: InputMaybe<Payments_Providers_Bool_Exp>;
};

export type Subscription_RootPayments_SubscriptionsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Subscriptions_Order_By>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

export type Subscription_RootPayments_Subscriptions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Subscriptions_Order_By>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

export type Subscription_RootPayments_Subscriptions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootPayments_Subscriptions_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Payments_Subscriptions_Stream_Cursor_Input>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

export type Subscription_RootPayments_User_Payment_Provider_MappingsArgs = {
  distinct_on?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Select_Column>
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Order_By>
  >;
  where?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
};

export type Subscription_RootPayments_User_Payment_Provider_Mappings_AggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<Payments_User_Payment_Provider_Mappings_Select_Column>
    >;
    limit?: InputMaybe<Scalars["Int"]["input"]>;
    offset?: InputMaybe<Scalars["Int"]["input"]>;
    order_by?: InputMaybe<
      Array<Payments_User_Payment_Provider_Mappings_Order_By>
    >;
    where?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
  };

export type Subscription_RootPayments_User_Payment_Provider_Mappings_By_PkArgs =
  {
    id: Scalars["uuid"]["input"];
  };

export type Subscription_RootPayments_User_Payment_Provider_Mappings_StreamArgs =
  {
    batch_size: Scalars["Int"]["input"];
    cursor: Array<
      InputMaybe<Payments_User_Payment_Provider_Mappings_Stream_Cursor_Input>
    >;
    where?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
  };

export type Subscription_RootRepliesArgs = {
  distinct_on?: InputMaybe<Array<Replies_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Replies_Order_By>>;
  where?: InputMaybe<Replies_Bool_Exp>;
};

export type Subscription_RootReplies_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Replies_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Replies_Order_By>>;
  where?: InputMaybe<Replies_Bool_Exp>;
};

export type Subscription_RootReplies_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootReplies_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Replies_Stream_Cursor_Input>>;
  where?: InputMaybe<Replies_Bool_Exp>;
};

export type Subscription_RootRoomsArgs = {
  distinct_on?: InputMaybe<Array<Rooms_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Rooms_Order_By>>;
  where?: InputMaybe<Rooms_Bool_Exp>;
};

export type Subscription_RootRooms_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rooms_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Rooms_Order_By>>;
  where?: InputMaybe<Rooms_Bool_Exp>;
};

export type Subscription_RootRooms_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootRooms_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Rooms_Stream_Cursor_Input>>;
  where?: InputMaybe<Rooms_Bool_Exp>;
};

export type Subscription_RootScheduleArgs = {
  distinct_on?: InputMaybe<Array<Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Schedule_Order_By>>;
  where?: InputMaybe<Schedule_Bool_Exp>;
};

export type Subscription_RootSchedule_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Schedule_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Schedule_Order_By>>;
  where?: InputMaybe<Schedule_Bool_Exp>;
};

export type Subscription_RootSchedule_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootSchedule_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Schedule_Stream_Cursor_Input>>;
  where?: InputMaybe<Schedule_Bool_Exp>;
};

export type Subscription_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Subscription_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Subscription_RootUsers_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootUsers_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Users_Stream_Cursor_Input>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Subscription_RootVerification_CodesArgs = {
  distinct_on?: InputMaybe<Array<Verification_Codes_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Verification_Codes_Order_By>>;
  where?: InputMaybe<Verification_Codes_Bool_Exp>;
};

export type Subscription_RootVerification_Codes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Verification_Codes_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Verification_Codes_Order_By>>;
  where?: InputMaybe<Verification_Codes_Bool_Exp>;
};

export type Subscription_RootVerification_Codes_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootVerification_Codes_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Verification_Codes_Stream_Cursor_Input>>;
  where?: InputMaybe<Verification_Codes_Bool_Exp>;
};

export type Subscription_RootVirusArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootVirus_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Virus_Stream_Cursor_Input>>;
  where?: InputMaybe<Virus_Bool_Exp>;
};

export type Subscription_RootVirusesArgs = {
  distinct_on?: InputMaybe<Array<Virus_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Virus_Order_By>>;
  where?: InputMaybe<Virus_Bool_Exp>;
};

export type Subscription_RootVirusesAggregateArgs = {
  distinct_on?: InputMaybe<Array<Virus_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Virus_Order_By>>;
  where?: InputMaybe<Virus_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _gt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _gte?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _in?: InputMaybe<Array<Scalars["timestamptz"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _lte?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _neq?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["timestamptz"]["input"]>>;
};

/** columns and relationships of "users" */
export type Users = {
  __typename?: "users";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  accounts: Array<Accounts>;
  /** An aggregate relationship */
  accounts_aggregate: Accounts_Aggregate;
  created_at: Scalars["bigint"]["output"];
  /** User email address */
  email?: Maybe<Scalars["String"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["bigint"]["output"]>;
  /** Hasura role for permissions */
  hasura_role?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** User profile image URL */
  image?: Maybe<Scalars["String"]["output"]>;
  /** Admin flag */
  is_admin?: Maybe<Scalars["Boolean"]["output"]>;
  /** User display name */
  name?: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  notification_messages: Array<Notification_Messages>;
  /** An aggregate relationship */
  notification_messages_aggregate: Notification_Messages_Aggregate;
  /** An array relationship */
  notification_permissions: Array<Notification_Permissions>;
  /** An aggregate relationship */
  notification_permissions_aggregate: Notification_Permissions_Aggregate;
  updated_at: Scalars["bigint"]["output"];
};

/** columns and relationships of "users" */
export type UsersAccountsArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersAccounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersNotification_MessagesArgs = {
  distinct_on?: InputMaybe<Array<Notification_Messages_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Messages_Order_By>>;
  where?: InputMaybe<Notification_Messages_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersNotification_Messages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notification_Messages_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Messages_Order_By>>;
  where?: InputMaybe<Notification_Messages_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersNotification_PermissionsArgs = {
  distinct_on?: InputMaybe<Array<Notification_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Permissions_Order_By>>;
  where?: InputMaybe<Notification_Permissions_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersNotification_Permissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notification_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Permissions_Order_By>>;
  where?: InputMaybe<Notification_Permissions_Bool_Exp>;
};

/** aggregated selection of "users" */
export type Users_Aggregate = {
  __typename?: "users_aggregate";
  aggregate?: Maybe<Users_Aggregate_Fields>;
  nodes: Array<Users>;
};

/** aggregate fields of "users" */
export type Users_Aggregate_Fields = {
  __typename?: "users_aggregate_fields";
  avg?: Maybe<Users_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Users_Max_Fields>;
  min?: Maybe<Users_Min_Fields>;
  stddev?: Maybe<Users_Stddev_Fields>;
  stddev_pop?: Maybe<Users_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Users_Stddev_Samp_Fields>;
  sum?: Maybe<Users_Sum_Fields>;
  var_pop?: Maybe<Users_Var_Pop_Fields>;
  var_samp?: Maybe<Users_Var_Samp_Fields>;
  variance?: Maybe<Users_Variance_Fields>;
};

/** aggregate fields of "users" */
export type Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Users_Avg_Fields = {
  __typename?: "users_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Users_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Bool_Exp>>;
  accounts?: InputMaybe<Accounts_Bool_Exp>;
  accounts_aggregate?: InputMaybe<Accounts_Aggregate_Bool_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  email_verified?: InputMaybe<Bigint_Comparison_Exp>;
  hasura_role?: InputMaybe<String_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  image?: InputMaybe<String_Comparison_Exp>;
  is_admin?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  notification_messages?: InputMaybe<Notification_Messages_Bool_Exp>;
  notification_messages_aggregate?: InputMaybe<Notification_Messages_Aggregate_Bool_Exp>;
  notification_permissions?: InputMaybe<Notification_Permissions_Bool_Exp>;
  notification_permissions_aggregate?: InputMaybe<Notification_Permissions_Aggregate_Bool_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
};

/** unique or primary key constraints on table "users" */
export enum Users_Constraint {
  /** unique or primary key constraint on columns "email" */
  UsersEmailKey = "users_email_key",
  /** unique or primary key constraint on columns "id" */
  UsersPkey = "users_pkey",
}

/** input type for incrementing numeric columns in table "users" */
export type Users_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Email verification timestamp */
  email_verified?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "users" */
export type Users_Insert_Input = {
  accounts?: InputMaybe<Accounts_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User email address */
  email?: InputMaybe<Scalars["String"]["input"]>;
  /** Email verification timestamp */
  email_verified?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Hasura role for permissions */
  hasura_role?: InputMaybe<Scalars["String"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** User profile image URL */
  image?: InputMaybe<Scalars["String"]["input"]>;
  /** Admin flag */
  is_admin?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** User display name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  notification_messages?: InputMaybe<Notification_Messages_Arr_Rel_Insert_Input>;
  notification_permissions?: InputMaybe<Notification_Permissions_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate max on columns */
export type Users_Max_Fields = {
  __typename?: "users_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User email address */
  email?: Maybe<Scalars["String"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["bigint"]["output"]>;
  /** Hasura role for permissions */
  hasura_role?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** User profile image URL */
  image?: Maybe<Scalars["String"]["output"]>;
  /** User display name */
  name?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregate min on columns */
export type Users_Min_Fields = {
  __typename?: "users_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User email address */
  email?: Maybe<Scalars["String"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["bigint"]["output"]>;
  /** Hasura role for permissions */
  hasura_role?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** User profile image URL */
  image?: Maybe<Scalars["String"]["output"]>;
  /** User display name */
  name?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** response of any mutation on the table "users" */
export type Users_Mutation_Response = {
  __typename?: "users_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Users>;
};

/** input type for inserting object relation for remote table "users" */
export type Users_Obj_Rel_Insert_Input = {
  data: Users_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** on_conflict condition type for table "users" */
export type Users_On_Conflict = {
  constraint: Users_Constraint;
  update_columns?: Array<Users_Update_Column>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** Ordering options when selecting data from "users". */
export type Users_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  accounts_aggregate?: InputMaybe<Accounts_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  email_verified?: InputMaybe<Order_By>;
  hasura_role?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  image?: InputMaybe<Order_By>;
  is_admin?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  notification_messages_aggregate?: InputMaybe<Notification_Messages_Aggregate_Order_By>;
  notification_permissions_aggregate?: InputMaybe<Notification_Permissions_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: users */
export type Users_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "users" */
export enum Users_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Email = "email",
  /** column name */
  EmailVerified = "email_verified",
  /** column name */
  HasuraRole = "hasura_role",
  /** column name */
  Id = "id",
  /** column name */
  Image = "image",
  /** column name */
  IsAdmin = "is_admin",
  /** column name */
  Name = "name",
  /** column name */
  UpdatedAt = "updated_at",
}

/** input type for updating data in table "users" */
export type Users_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User email address */
  email?: InputMaybe<Scalars["String"]["input"]>;
  /** Email verification timestamp */
  email_verified?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Hasura role for permissions */
  hasura_role?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** User profile image URL */
  image?: InputMaybe<Scalars["String"]["input"]>;
  /** Admin flag */
  is_admin?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** User display name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate stddev on columns */
export type Users_Stddev_Fields = {
  __typename?: "users_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Users_Stddev_Pop_Fields = {
  __typename?: "users_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Users_Stddev_Samp_Fields = {
  __typename?: "users_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "users" */
export type Users_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Users_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Users_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User email address */
  email?: InputMaybe<Scalars["String"]["input"]>;
  /** Email verification timestamp */
  email_verified?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Hasura role for permissions */
  hasura_role?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** User profile image URL */
  image?: InputMaybe<Scalars["String"]["input"]>;
  /** Admin flag */
  is_admin?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** User display name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate sum on columns */
export type Users_Sum_Fields = {
  __typename?: "users_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "users" */
export enum Users_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Email = "email",
  /** column name */
  EmailVerified = "email_verified",
  /** column name */
  HasuraRole = "hasura_role",
  /** column name */
  Id = "id",
  /** column name */
  Image = "image",
  /** column name */
  IsAdmin = "is_admin",
  /** column name */
  Name = "name",
  /** column name */
  UpdatedAt = "updated_at",
}

export type Users_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Users_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Users_Set_Input>;
  /** filter the rows which have to be updated */
  where: Users_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Users_Var_Pop_Fields = {
  __typename?: "users_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Users_Var_Samp_Fields = {
  __typename?: "users_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Users_Variance_Fields = {
  __typename?: "users_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["uuid"]["input"]>;
  _gt?: InputMaybe<Scalars["uuid"]["input"]>;
  _gte?: InputMaybe<Scalars["uuid"]["input"]>;
  _in?: InputMaybe<Array<Scalars["uuid"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["uuid"]["input"]>;
  _lte?: InputMaybe<Scalars["uuid"]["input"]>;
  _neq?: InputMaybe<Scalars["uuid"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["uuid"]["input"]>>;
};

/** columns and relationships of "verification_codes" */
export type Verification_Codes = {
  __typename?: "verification_codes";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Number of verification attempts */
  attempts?: Maybe<Scalars["Int"]["output"]>;
  /** BCrypt hash of the verification code */
  code_hash: Scalars["String"]["output"];
  /** When the code was successfully used */
  consumed_at?: Maybe<Scalars["timestamptz"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** Expiration timestamp of the code */
  expires_at: Scalars["timestamptz"]["output"];
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** Email address or phone number being verified */
  identifier: Scalars["String"]["output"];
  /** Provider used for verification (email or phone) */
  provider: Scalars["String"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** Optional user who initiated verification (may differ from owner) */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregated selection of "verification_codes" */
export type Verification_Codes_Aggregate = {
  __typename?: "verification_codes_aggregate";
  aggregate?: Maybe<Verification_Codes_Aggregate_Fields>;
  nodes: Array<Verification_Codes>;
};

/** aggregate fields of "verification_codes" */
export type Verification_Codes_Aggregate_Fields = {
  __typename?: "verification_codes_aggregate_fields";
  avg?: Maybe<Verification_Codes_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Verification_Codes_Max_Fields>;
  min?: Maybe<Verification_Codes_Min_Fields>;
  stddev?: Maybe<Verification_Codes_Stddev_Fields>;
  stddev_pop?: Maybe<Verification_Codes_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Verification_Codes_Stddev_Samp_Fields>;
  sum?: Maybe<Verification_Codes_Sum_Fields>;
  var_pop?: Maybe<Verification_Codes_Var_Pop_Fields>;
  var_samp?: Maybe<Verification_Codes_Var_Samp_Fields>;
  variance?: Maybe<Verification_Codes_Variance_Fields>;
};

/** aggregate fields of "verification_codes" */
export type Verification_Codes_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Verification_Codes_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Verification_Codes_Avg_Fields = {
  __typename?: "verification_codes_avg_fields";
  /** Number of verification attempts */
  attempts?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "verification_codes". All fields are combined with a logical 'AND'. */
export type Verification_Codes_Bool_Exp = {
  _and?: InputMaybe<Array<Verification_Codes_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Verification_Codes_Bool_Exp>;
  _or?: InputMaybe<Array<Verification_Codes_Bool_Exp>>;
  attempts?: InputMaybe<Int_Comparison_Exp>;
  code_hash?: InputMaybe<String_Comparison_Exp>;
  consumed_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  expires_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  identifier?: InputMaybe<String_Comparison_Exp>;
  provider?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "verification_codes" */
export enum Verification_Codes_Constraint {
  /** unique or primary key constraint on columns "id" */
  VerificationCodesPkey = "verification_codes_pkey",
}

/** input type for incrementing numeric columns in table "verification_codes" */
export type Verification_Codes_Inc_Input = {
  /** Number of verification attempts */
  attempts?: InputMaybe<Scalars["Int"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "verification_codes" */
export type Verification_Codes_Insert_Input = {
  /** Number of verification attempts */
  attempts?: InputMaybe<Scalars["Int"]["input"]>;
  /** BCrypt hash of the verification code */
  code_hash?: InputMaybe<Scalars["String"]["input"]>;
  /** When the code was successfully used */
  consumed_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Expiration timestamp of the code */
  expires_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Email address or phone number being verified */
  identifier?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider used for verification (email or phone) */
  provider?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Optional user who initiated verification (may differ from owner) */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Verification_Codes_Max_Fields = {
  __typename?: "verification_codes_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Number of verification attempts */
  attempts?: Maybe<Scalars["Int"]["output"]>;
  /** BCrypt hash of the verification code */
  code_hash?: Maybe<Scalars["String"]["output"]>;
  /** When the code was successfully used */
  consumed_at?: Maybe<Scalars["timestamptz"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Expiration timestamp of the code */
  expires_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Email address or phone number being verified */
  identifier?: Maybe<Scalars["String"]["output"]>;
  /** Provider used for verification (email or phone) */
  provider?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Optional user who initiated verification (may differ from owner) */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type Verification_Codes_Min_Fields = {
  __typename?: "verification_codes_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Number of verification attempts */
  attempts?: Maybe<Scalars["Int"]["output"]>;
  /** BCrypt hash of the verification code */
  code_hash?: Maybe<Scalars["String"]["output"]>;
  /** When the code was successfully used */
  consumed_at?: Maybe<Scalars["timestamptz"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Expiration timestamp of the code */
  expires_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Email address or phone number being verified */
  identifier?: Maybe<Scalars["String"]["output"]>;
  /** Provider used for verification (email or phone) */
  provider?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Optional user who initiated verification (may differ from owner) */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "verification_codes" */
export type Verification_Codes_Mutation_Response = {
  __typename?: "verification_codes_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Verification_Codes>;
};

/** input type for inserting object relation for remote table "verification_codes" */
export type Verification_Codes_Obj_Rel_Insert_Input = {
  data: Verification_Codes_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Verification_Codes_On_Conflict>;
};

/** on_conflict condition type for table "verification_codes" */
export type Verification_Codes_On_Conflict = {
  constraint: Verification_Codes_Constraint;
  update_columns?: Array<Verification_Codes_Update_Column>;
  where?: InputMaybe<Verification_Codes_Bool_Exp>;
};

/** Ordering options when selecting data from "verification_codes". */
export type Verification_Codes_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  attempts?: InputMaybe<Order_By>;
  code_hash?: InputMaybe<Order_By>;
  consumed_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  expires_at?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  identifier?: InputMaybe<Order_By>;
  provider?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: verification_codes */
export type Verification_Codes_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "verification_codes" */
export enum Verification_Codes_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  Attempts = "attempts",
  /** column name */
  CodeHash = "code_hash",
  /** column name */
  ConsumedAt = "consumed_at",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  ExpiresAt = "expires_at",
  /** column name */
  Id = "id",
  /** column name */
  Identifier = "identifier",
  /** column name */
  Provider = "provider",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "verification_codes" */
export type Verification_Codes_Set_Input = {
  /** Number of verification attempts */
  attempts?: InputMaybe<Scalars["Int"]["input"]>;
  /** BCrypt hash of the verification code */
  code_hash?: InputMaybe<Scalars["String"]["input"]>;
  /** When the code was successfully used */
  consumed_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Expiration timestamp of the code */
  expires_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Email address or phone number being verified */
  identifier?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider used for verification (email or phone) */
  provider?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Optional user who initiated verification (may differ from owner) */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Verification_Codes_Stddev_Fields = {
  __typename?: "verification_codes_stddev_fields";
  /** Number of verification attempts */
  attempts?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Verification_Codes_Stddev_Pop_Fields = {
  __typename?: "verification_codes_stddev_pop_fields";
  /** Number of verification attempts */
  attempts?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Verification_Codes_Stddev_Samp_Fields = {
  __typename?: "verification_codes_stddev_samp_fields";
  /** Number of verification attempts */
  attempts?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "verification_codes" */
export type Verification_Codes_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Verification_Codes_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Verification_Codes_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Number of verification attempts */
  attempts?: InputMaybe<Scalars["Int"]["input"]>;
  /** BCrypt hash of the verification code */
  code_hash?: InputMaybe<Scalars["String"]["input"]>;
  /** When the code was successfully used */
  consumed_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Expiration timestamp of the code */
  expires_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Email address or phone number being verified */
  identifier?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider used for verification (email or phone) */
  provider?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Optional user who initiated verification (may differ from owner) */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Verification_Codes_Sum_Fields = {
  __typename?: "verification_codes_sum_fields";
  /** Number of verification attempts */
  attempts?: Maybe<Scalars["Int"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "verification_codes" */
export enum Verification_Codes_Update_Column {
  /** column name */
  Attempts = "attempts",
  /** column name */
  CodeHash = "code_hash",
  /** column name */
  ConsumedAt = "consumed_at",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  ExpiresAt = "expires_at",
  /** column name */
  Id = "id",
  /** column name */
  Identifier = "identifier",
  /** column name */
  Provider = "provider",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Verification_Codes_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Verification_Codes_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Verification_Codes_Set_Input>;
  /** filter the rows which have to be updated */
  where: Verification_Codes_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Verification_Codes_Var_Pop_Fields = {
  __typename?: "verification_codes_var_pop_fields";
  /** Number of verification attempts */
  attempts?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Verification_Codes_Var_Samp_Fields = {
  __typename?: "verification_codes_var_samp_fields";
  /** Number of verification attempts */
  attempts?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Verification_Codes_Variance_Fields = {
  __typename?: "verification_codes_variance_fields";
  /** Number of verification attempts */
  attempts?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "storage.virus" */
export type Virus = {
  __typename?: "virus";
  createdAt: Scalars["timestamptz"]["output"];
  /** An object relationship */
  file: Files;
  fileId: Scalars["uuid"]["output"];
  filename: Scalars["String"]["output"];
  id: Scalars["uuid"]["output"];
  updatedAt: Scalars["timestamptz"]["output"];
  userSession: Scalars["jsonb"]["output"];
  virus: Scalars["String"]["output"];
};

/** columns and relationships of "storage.virus" */
export type VirusUserSessionArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "storage.virus" */
export type Virus_Aggregate = {
  __typename?: "virus_aggregate";
  aggregate?: Maybe<Virus_Aggregate_Fields>;
  nodes: Array<Virus>;
};

/** aggregate fields of "storage.virus" */
export type Virus_Aggregate_Fields = {
  __typename?: "virus_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Virus_Max_Fields>;
  min?: Maybe<Virus_Min_Fields>;
};

/** aggregate fields of "storage.virus" */
export type Virus_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Virus_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Virus_Append_Input = {
  userSession?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** Boolean expression to filter rows from the table "storage.virus". All fields are combined with a logical 'AND'. */
export type Virus_Bool_Exp = {
  _and?: InputMaybe<Array<Virus_Bool_Exp>>;
  _not?: InputMaybe<Virus_Bool_Exp>;
  _or?: InputMaybe<Array<Virus_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  file?: InputMaybe<Files_Bool_Exp>;
  fileId?: InputMaybe<Uuid_Comparison_Exp>;
  filename?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  userSession?: InputMaybe<Jsonb_Comparison_Exp>;
  virus?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "storage.virus" */
export enum Virus_Constraint {
  /** unique or primary key constraint on columns "id" */
  VirusPkey = "virus_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Virus_Delete_At_Path_Input = {
  userSession?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Virus_Delete_Elem_Input = {
  userSession?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Virus_Delete_Key_Input = {
  userSession?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "storage.virus" */
export type Virus_Insert_Input = {
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  file?: InputMaybe<Files_Obj_Rel_Insert_Input>;
  fileId?: InputMaybe<Scalars["uuid"]["input"]>;
  filename?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  userSession?: InputMaybe<Scalars["jsonb"]["input"]>;
  virus?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Virus_Max_Fields = {
  __typename?: "virus_max_fields";
  createdAt?: Maybe<Scalars["timestamptz"]["output"]>;
  fileId?: Maybe<Scalars["uuid"]["output"]>;
  filename?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updatedAt?: Maybe<Scalars["timestamptz"]["output"]>;
  virus?: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type Virus_Min_Fields = {
  __typename?: "virus_min_fields";
  createdAt?: Maybe<Scalars["timestamptz"]["output"]>;
  fileId?: Maybe<Scalars["uuid"]["output"]>;
  filename?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updatedAt?: Maybe<Scalars["timestamptz"]["output"]>;
  virus?: Maybe<Scalars["String"]["output"]>;
};

/** response of any mutation on the table "storage.virus" */
export type Virus_Mutation_Response = {
  __typename?: "virus_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Virus>;
};

/** on_conflict condition type for table "storage.virus" */
export type Virus_On_Conflict = {
  constraint: Virus_Constraint;
  update_columns?: Array<Virus_Update_Column>;
  where?: InputMaybe<Virus_Bool_Exp>;
};

/** Ordering options when selecting data from "storage.virus". */
export type Virus_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  file?: InputMaybe<Files_Order_By>;
  fileId?: InputMaybe<Order_By>;
  filename?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  userSession?: InputMaybe<Order_By>;
  virus?: InputMaybe<Order_By>;
};

/** primary key columns input for table: storage.virus */
export type Virus_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Virus_Prepend_Input = {
  userSession?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "storage.virus" */
export enum Virus_Select_Column {
  /** column name */
  CreatedAt = "createdAt",
  /** column name */
  FileId = "fileId",
  /** column name */
  Filename = "filename",
  /** column name */
  Id = "id",
  /** column name */
  UpdatedAt = "updatedAt",
  /** column name */
  UserSession = "userSession",
  /** column name */
  Virus = "virus",
}

/** input type for updating data in table "storage.virus" */
export type Virus_Set_Input = {
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  fileId?: InputMaybe<Scalars["uuid"]["input"]>;
  filename?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  userSession?: InputMaybe<Scalars["jsonb"]["input"]>;
  virus?: InputMaybe<Scalars["String"]["input"]>;
};

/** Streaming cursor of the table "virus" */
export type Virus_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Virus_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Virus_Stream_Cursor_Value_Input = {
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  fileId?: InputMaybe<Scalars["uuid"]["input"]>;
  filename?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  userSession?: InputMaybe<Scalars["jsonb"]["input"]>;
  virus?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "storage.virus" */
export enum Virus_Update_Column {
  /** column name */
  CreatedAt = "createdAt",
  /** column name */
  FileId = "fileId",
  /** column name */
  Filename = "filename",
  /** column name */
  Id = "id",
  /** column name */
  UpdatedAt = "updatedAt",
  /** column name */
  UserSession = "userSession",
  /** column name */
  Virus = "virus",
}

export type Virus_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Virus_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Virus_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Virus_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Virus_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Virus_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Virus_Set_Input>;
  /** filter the rows which have to be updated */
  where: Virus_Bool_Exp;
};
