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
  jsonb: { input: any; output: any };
  numeric: { input: number; output: number };
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

/** columns and relationships of "badma.ais" */
export type Badma_Ais = {
  __typename?: "badma_ais";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  options: Scalars["jsonb"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "badma.ais" */
export type Badma_AisOptionsArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "badma.ais" */
export type Badma_Ais_Aggregate = {
  __typename?: "badma_ais_aggregate";
  aggregate?: Maybe<Badma_Ais_Aggregate_Fields>;
  nodes: Array<Badma_Ais>;
};

export type Badma_Ais_Aggregate_Bool_Exp = {
  count?: InputMaybe<Badma_Ais_Aggregate_Bool_Exp_Count>;
};

export type Badma_Ais_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Badma_Ais_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Badma_Ais_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "badma.ais" */
export type Badma_Ais_Aggregate_Fields = {
  __typename?: "badma_ais_aggregate_fields";
  avg?: Maybe<Badma_Ais_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Badma_Ais_Max_Fields>;
  min?: Maybe<Badma_Ais_Min_Fields>;
  stddev?: Maybe<Badma_Ais_Stddev_Fields>;
  stddev_pop?: Maybe<Badma_Ais_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Badma_Ais_Stddev_Samp_Fields>;
  sum?: Maybe<Badma_Ais_Sum_Fields>;
  var_pop?: Maybe<Badma_Ais_Var_Pop_Fields>;
  var_samp?: Maybe<Badma_Ais_Var_Samp_Fields>;
  variance?: Maybe<Badma_Ais_Variance_Fields>;
};

/** aggregate fields of "badma.ais" */
export type Badma_Ais_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Badma_Ais_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "badma.ais" */
export type Badma_Ais_Aggregate_Order_By = {
  avg?: InputMaybe<Badma_Ais_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Badma_Ais_Max_Order_By>;
  min?: InputMaybe<Badma_Ais_Min_Order_By>;
  stddev?: InputMaybe<Badma_Ais_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Badma_Ais_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Badma_Ais_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Badma_Ais_Sum_Order_By>;
  var_pop?: InputMaybe<Badma_Ais_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Badma_Ais_Var_Samp_Order_By>;
  variance?: InputMaybe<Badma_Ais_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Badma_Ais_Append_Input = {
  options?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "badma.ais" */
export type Badma_Ais_Arr_Rel_Insert_Input = {
  data: Array<Badma_Ais_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Ais_On_Conflict>;
};

/** aggregate avg on columns */
export type Badma_Ais_Avg_Fields = {
  __typename?: "badma_ais_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "badma.ais" */
export type Badma_Ais_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "badma.ais". All fields are combined with a logical 'AND'. */
export type Badma_Ais_Bool_Exp = {
  _and?: InputMaybe<Array<Badma_Ais_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Badma_Ais_Bool_Exp>;
  _or?: InputMaybe<Array<Badma_Ais_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  options?: InputMaybe<Jsonb_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "badma.ais" */
export enum Badma_Ais_Constraint {
  /** unique or primary key constraint on columns "id" */
  AisPkey = "ais_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Badma_Ais_Delete_At_Path_Input = {
  options?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Badma_Ais_Delete_Elem_Input = {
  options?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Badma_Ais_Delete_Key_Input = {
  options?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "badma.ais" */
export type Badma_Ais_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "badma.ais" */
export type Badma_Ais_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  options?: InputMaybe<Scalars["jsonb"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Badma_Ais_Max_Fields = {
  __typename?: "badma_ais_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "badma.ais" */
export type Badma_Ais_Max_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Badma_Ais_Min_Fields = {
  __typename?: "badma_ais_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "badma.ais" */
export type Badma_Ais_Min_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "badma.ais" */
export type Badma_Ais_Mutation_Response = {
  __typename?: "badma_ais_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Badma_Ais>;
};

/** input type for inserting object relation for remote table "badma.ais" */
export type Badma_Ais_Obj_Rel_Insert_Input = {
  data: Badma_Ais_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Ais_On_Conflict>;
};

/** on_conflict condition type for table "badma.ais" */
export type Badma_Ais_On_Conflict = {
  constraint: Badma_Ais_Constraint;
  update_columns?: Array<Badma_Ais_Update_Column>;
  where?: InputMaybe<Badma_Ais_Bool_Exp>;
};

/** Ordering options when selecting data from "badma.ais". */
export type Badma_Ais_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  options?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: badma.ais */
export type Badma_Ais_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Badma_Ais_Prepend_Input = {
  options?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "badma.ais" */
export enum Badma_Ais_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Options = "options",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "badma.ais" */
export type Badma_Ais_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  options?: InputMaybe<Scalars["jsonb"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Badma_Ais_Stddev_Fields = {
  __typename?: "badma_ais_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "badma.ais" */
export type Badma_Ais_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Badma_Ais_Stddev_Pop_Fields = {
  __typename?: "badma_ais_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "badma.ais" */
export type Badma_Ais_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Badma_Ais_Stddev_Samp_Fields = {
  __typename?: "badma_ais_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "badma.ais" */
export type Badma_Ais_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "badma_ais" */
export type Badma_Ais_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Badma_Ais_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Badma_Ais_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  options?: InputMaybe<Scalars["jsonb"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Badma_Ais_Sum_Fields = {
  __typename?: "badma_ais_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "badma.ais" */
export type Badma_Ais_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "badma.ais" */
export enum Badma_Ais_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Options = "options",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Badma_Ais_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Badma_Ais_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Badma_Ais_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Badma_Ais_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Badma_Ais_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Badma_Ais_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Badma_Ais_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Badma_Ais_Set_Input>;
  /** filter the rows which have to be updated */
  where: Badma_Ais_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Badma_Ais_Var_Pop_Fields = {
  __typename?: "badma_ais_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "badma.ais" */
export type Badma_Ais_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Badma_Ais_Var_Samp_Fields = {
  __typename?: "badma_ais_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "badma.ais" */
export type Badma_Ais_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Badma_Ais_Variance_Fields = {
  __typename?: "badma_ais_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "badma.ais" */
export type Badma_Ais_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "badma.clubs" */
export type Badma_Clubs = {
  __typename?: "badma_clubs";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** An array relationship */
  in_clubs: Array<Badma_In_Clubs>;
  /** An aggregate relationship */
  in_clubs_aggregate: Badma_In_Clubs_Aggregate;
  /** An array relationship */
  items: Array<Badma_Items>;
  /** An aggregate relationship */
  items_aggregate: Badma_Items_Aggregate;
  /** Club title/name */
  title: Scalars["String"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  /** User who created and owns the club */
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "badma.clubs" */
export type Badma_ClubsIn_ClubsArgs = {
  distinct_on?: InputMaybe<Array<Badma_In_Clubs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_In_Clubs_Order_By>>;
  where?: InputMaybe<Badma_In_Clubs_Bool_Exp>;
};

/** columns and relationships of "badma.clubs" */
export type Badma_ClubsIn_Clubs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_In_Clubs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_In_Clubs_Order_By>>;
  where?: InputMaybe<Badma_In_Clubs_Bool_Exp>;
};

/** columns and relationships of "badma.clubs" */
export type Badma_ClubsItemsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Items_Order_By>>;
  where?: InputMaybe<Badma_Items_Bool_Exp>;
};

/** columns and relationships of "badma.clubs" */
export type Badma_ClubsItems_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Items_Order_By>>;
  where?: InputMaybe<Badma_Items_Bool_Exp>;
};

/** aggregated selection of "badma.clubs" */
export type Badma_Clubs_Aggregate = {
  __typename?: "badma_clubs_aggregate";
  aggregate?: Maybe<Badma_Clubs_Aggregate_Fields>;
  nodes: Array<Badma_Clubs>;
};

export type Badma_Clubs_Aggregate_Bool_Exp = {
  count?: InputMaybe<Badma_Clubs_Aggregate_Bool_Exp_Count>;
};

export type Badma_Clubs_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Badma_Clubs_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Badma_Clubs_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "badma.clubs" */
export type Badma_Clubs_Aggregate_Fields = {
  __typename?: "badma_clubs_aggregate_fields";
  avg?: Maybe<Badma_Clubs_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Badma_Clubs_Max_Fields>;
  min?: Maybe<Badma_Clubs_Min_Fields>;
  stddev?: Maybe<Badma_Clubs_Stddev_Fields>;
  stddev_pop?: Maybe<Badma_Clubs_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Badma_Clubs_Stddev_Samp_Fields>;
  sum?: Maybe<Badma_Clubs_Sum_Fields>;
  var_pop?: Maybe<Badma_Clubs_Var_Pop_Fields>;
  var_samp?: Maybe<Badma_Clubs_Var_Samp_Fields>;
  variance?: Maybe<Badma_Clubs_Variance_Fields>;
};

/** aggregate fields of "badma.clubs" */
export type Badma_Clubs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Badma_Clubs_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "badma.clubs" */
export type Badma_Clubs_Aggregate_Order_By = {
  avg?: InputMaybe<Badma_Clubs_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Badma_Clubs_Max_Order_By>;
  min?: InputMaybe<Badma_Clubs_Min_Order_By>;
  stddev?: InputMaybe<Badma_Clubs_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Badma_Clubs_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Badma_Clubs_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Badma_Clubs_Sum_Order_By>;
  var_pop?: InputMaybe<Badma_Clubs_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Badma_Clubs_Var_Samp_Order_By>;
  variance?: InputMaybe<Badma_Clubs_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "badma.clubs" */
export type Badma_Clubs_Arr_Rel_Insert_Input = {
  data: Array<Badma_Clubs_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Clubs_On_Conflict>;
};

/** aggregate avg on columns */
export type Badma_Clubs_Avg_Fields = {
  __typename?: "badma_clubs_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "badma.clubs" */
export type Badma_Clubs_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "badma.clubs". All fields are combined with a logical 'AND'. */
export type Badma_Clubs_Bool_Exp = {
  _and?: InputMaybe<Array<Badma_Clubs_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Badma_Clubs_Bool_Exp>;
  _or?: InputMaybe<Array<Badma_Clubs_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  in_clubs?: InputMaybe<Badma_In_Clubs_Bool_Exp>;
  in_clubs_aggregate?: InputMaybe<Badma_In_Clubs_Aggregate_Bool_Exp>;
  items?: InputMaybe<Badma_Items_Bool_Exp>;
  items_aggregate?: InputMaybe<Badma_Items_Aggregate_Bool_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "badma.clubs" */
export enum Badma_Clubs_Constraint {
  /** unique or primary key constraint on columns "id" */
  ClubsPkey = "clubs_pkey",
}

/** input type for incrementing numeric columns in table "badma.clubs" */
export type Badma_Clubs_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "badma.clubs" */
export type Badma_Clubs_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  in_clubs?: InputMaybe<Badma_In_Clubs_Arr_Rel_Insert_Input>;
  items?: InputMaybe<Badma_Items_Arr_Rel_Insert_Input>;
  /** Club title/name */
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** User who created and owns the club */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Badma_Clubs_Max_Fields = {
  __typename?: "badma_clubs_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Club title/name */
  title?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User who created and owns the club */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "badma.clubs" */
export type Badma_Clubs_Max_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Club title/name */
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** User who created and owns the club */
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Badma_Clubs_Min_Fields = {
  __typename?: "badma_clubs_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Club title/name */
  title?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User who created and owns the club */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "badma.clubs" */
export type Badma_Clubs_Min_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Club title/name */
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** User who created and owns the club */
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "badma.clubs" */
export type Badma_Clubs_Mutation_Response = {
  __typename?: "badma_clubs_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Badma_Clubs>;
};

/** input type for inserting object relation for remote table "badma.clubs" */
export type Badma_Clubs_Obj_Rel_Insert_Input = {
  data: Badma_Clubs_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Clubs_On_Conflict>;
};

/** on_conflict condition type for table "badma.clubs" */
export type Badma_Clubs_On_Conflict = {
  constraint: Badma_Clubs_Constraint;
  update_columns?: Array<Badma_Clubs_Update_Column>;
  where?: InputMaybe<Badma_Clubs_Bool_Exp>;
};

/** Ordering options when selecting data from "badma.clubs". */
export type Badma_Clubs_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  in_clubs_aggregate?: InputMaybe<Badma_In_Clubs_Aggregate_Order_By>;
  items_aggregate?: InputMaybe<Badma_Items_Aggregate_Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: badma.clubs */
export type Badma_Clubs_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "badma.clubs" */
export enum Badma_Clubs_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
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

/** input type for updating data in table "badma.clubs" */
export type Badma_Clubs_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Club title/name */
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who created and owns the club */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Badma_Clubs_Stddev_Fields = {
  __typename?: "badma_clubs_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "badma.clubs" */
export type Badma_Clubs_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Badma_Clubs_Stddev_Pop_Fields = {
  __typename?: "badma_clubs_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "badma.clubs" */
export type Badma_Clubs_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Badma_Clubs_Stddev_Samp_Fields = {
  __typename?: "badma_clubs_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "badma.clubs" */
export type Badma_Clubs_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "badma_clubs" */
export type Badma_Clubs_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Badma_Clubs_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Badma_Clubs_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Club title/name */
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who created and owns the club */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Badma_Clubs_Sum_Fields = {
  __typename?: "badma_clubs_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "badma.clubs" */
export type Badma_Clubs_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "badma.clubs" */
export enum Badma_Clubs_Update_Column {
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

export type Badma_Clubs_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Badma_Clubs_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Badma_Clubs_Set_Input>;
  /** filter the rows which have to be updated */
  where: Badma_Clubs_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Badma_Clubs_Var_Pop_Fields = {
  __typename?: "badma_clubs_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "badma.clubs" */
export type Badma_Clubs_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Badma_Clubs_Var_Samp_Fields = {
  __typename?: "badma_clubs_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "badma.clubs" */
export type Badma_Clubs_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Badma_Clubs_Variance_Fields = {
  __typename?: "badma_clubs_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "badma.clubs" */
export type Badma_Clubs_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "badma.errors" */
export type Badma_Errors = {
  __typename?: "badma_errors";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  context?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  error_message?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  game?: Maybe<Badma_Games>;
  game_id?: Maybe<Scalars["uuid"]["output"]>;
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  request_payload?: Maybe<Scalars["jsonb"]["output"]>;
  response_payload?: Maybe<Scalars["jsonb"]["output"]>;
  /** An object relationship */
  user?: Maybe<Users>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** columns and relationships of "badma.errors" */
export type Badma_ErrorsRequest_PayloadArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "badma.errors" */
export type Badma_ErrorsResponse_PayloadArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "badma.errors" */
export type Badma_Errors_Aggregate = {
  __typename?: "badma_errors_aggregate";
  aggregate?: Maybe<Badma_Errors_Aggregate_Fields>;
  nodes: Array<Badma_Errors>;
};

export type Badma_Errors_Aggregate_Bool_Exp = {
  count?: InputMaybe<Badma_Errors_Aggregate_Bool_Exp_Count>;
};

export type Badma_Errors_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Badma_Errors_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Badma_Errors_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "badma.errors" */
export type Badma_Errors_Aggregate_Fields = {
  __typename?: "badma_errors_aggregate_fields";
  avg?: Maybe<Badma_Errors_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Badma_Errors_Max_Fields>;
  min?: Maybe<Badma_Errors_Min_Fields>;
  stddev?: Maybe<Badma_Errors_Stddev_Fields>;
  stddev_pop?: Maybe<Badma_Errors_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Badma_Errors_Stddev_Samp_Fields>;
  sum?: Maybe<Badma_Errors_Sum_Fields>;
  var_pop?: Maybe<Badma_Errors_Var_Pop_Fields>;
  var_samp?: Maybe<Badma_Errors_Var_Samp_Fields>;
  variance?: Maybe<Badma_Errors_Variance_Fields>;
};

/** aggregate fields of "badma.errors" */
export type Badma_Errors_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Badma_Errors_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "badma.errors" */
export type Badma_Errors_Aggregate_Order_By = {
  avg?: InputMaybe<Badma_Errors_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Badma_Errors_Max_Order_By>;
  min?: InputMaybe<Badma_Errors_Min_Order_By>;
  stddev?: InputMaybe<Badma_Errors_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Badma_Errors_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Badma_Errors_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Badma_Errors_Sum_Order_By>;
  var_pop?: InputMaybe<Badma_Errors_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Badma_Errors_Var_Samp_Order_By>;
  variance?: InputMaybe<Badma_Errors_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Badma_Errors_Append_Input = {
  request_payload?: InputMaybe<Scalars["jsonb"]["input"]>;
  response_payload?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "badma.errors" */
export type Badma_Errors_Arr_Rel_Insert_Input = {
  data: Array<Badma_Errors_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Errors_On_Conflict>;
};

/** aggregate avg on columns */
export type Badma_Errors_Avg_Fields = {
  __typename?: "badma_errors_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "badma.errors" */
export type Badma_Errors_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "badma.errors". All fields are combined with a logical 'AND'. */
export type Badma_Errors_Bool_Exp = {
  _and?: InputMaybe<Array<Badma_Errors_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Badma_Errors_Bool_Exp>;
  _or?: InputMaybe<Array<Badma_Errors_Bool_Exp>>;
  context?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  error_message?: InputMaybe<String_Comparison_Exp>;
  game?: InputMaybe<Badma_Games_Bool_Exp>;
  game_id?: InputMaybe<Uuid_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  request_payload?: InputMaybe<Jsonb_Comparison_Exp>;
  response_payload?: InputMaybe<Jsonb_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "badma.errors" */
export enum Badma_Errors_Constraint {
  /** unique or primary key constraint on columns "id" */
  ErrorsPkey = "errors_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Badma_Errors_Delete_At_Path_Input = {
  request_payload?: InputMaybe<Array<Scalars["String"]["input"]>>;
  response_payload?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Badma_Errors_Delete_Elem_Input = {
  request_payload?: InputMaybe<Scalars["Int"]["input"]>;
  response_payload?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Badma_Errors_Delete_Key_Input = {
  request_payload?: InputMaybe<Scalars["String"]["input"]>;
  response_payload?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "badma.errors" */
export type Badma_Errors_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "badma.errors" */
export type Badma_Errors_Insert_Input = {
  context?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  error_message?: InputMaybe<Scalars["String"]["input"]>;
  game?: InputMaybe<Badma_Games_Obj_Rel_Insert_Input>;
  game_id?: InputMaybe<Scalars["uuid"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  request_payload?: InputMaybe<Scalars["jsonb"]["input"]>;
  response_payload?: InputMaybe<Scalars["jsonb"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Badma_Errors_Max_Fields = {
  __typename?: "badma_errors_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  context?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  error_message?: Maybe<Scalars["String"]["output"]>;
  game_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "badma.errors" */
export type Badma_Errors_Max_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  context?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  error_message?: InputMaybe<Order_By>;
  game_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Badma_Errors_Min_Fields = {
  __typename?: "badma_errors_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  context?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  error_message?: Maybe<Scalars["String"]["output"]>;
  game_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "badma.errors" */
export type Badma_Errors_Min_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  context?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  error_message?: InputMaybe<Order_By>;
  game_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "badma.errors" */
export type Badma_Errors_Mutation_Response = {
  __typename?: "badma_errors_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Badma_Errors>;
};

/** input type for inserting object relation for remote table "badma.errors" */
export type Badma_Errors_Obj_Rel_Insert_Input = {
  data: Badma_Errors_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Errors_On_Conflict>;
};

/** on_conflict condition type for table "badma.errors" */
export type Badma_Errors_On_Conflict = {
  constraint: Badma_Errors_Constraint;
  update_columns?: Array<Badma_Errors_Update_Column>;
  where?: InputMaybe<Badma_Errors_Bool_Exp>;
};

/** Ordering options when selecting data from "badma.errors". */
export type Badma_Errors_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  context?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  error_message?: InputMaybe<Order_By>;
  game?: InputMaybe<Badma_Games_Order_By>;
  game_id?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  request_payload?: InputMaybe<Order_By>;
  response_payload?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: badma.errors */
export type Badma_Errors_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Badma_Errors_Prepend_Input = {
  request_payload?: InputMaybe<Scalars["jsonb"]["input"]>;
  response_payload?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "badma.errors" */
export enum Badma_Errors_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  Context = "context",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  ErrorMessage = "error_message",
  /** column name */
  GameId = "game_id",
  /** column name */
  Id = "id",
  /** column name */
  RequestPayload = "request_payload",
  /** column name */
  ResponsePayload = "response_payload",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "badma.errors" */
export type Badma_Errors_Set_Input = {
  context?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  error_message?: InputMaybe<Scalars["String"]["input"]>;
  game_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  request_payload?: InputMaybe<Scalars["jsonb"]["input"]>;
  response_payload?: InputMaybe<Scalars["jsonb"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Badma_Errors_Stddev_Fields = {
  __typename?: "badma_errors_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "badma.errors" */
export type Badma_Errors_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Badma_Errors_Stddev_Pop_Fields = {
  __typename?: "badma_errors_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "badma.errors" */
export type Badma_Errors_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Badma_Errors_Stddev_Samp_Fields = {
  __typename?: "badma_errors_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "badma.errors" */
export type Badma_Errors_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "badma_errors" */
export type Badma_Errors_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Badma_Errors_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Badma_Errors_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  context?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  error_message?: InputMaybe<Scalars["String"]["input"]>;
  game_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  request_payload?: InputMaybe<Scalars["jsonb"]["input"]>;
  response_payload?: InputMaybe<Scalars["jsonb"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Badma_Errors_Sum_Fields = {
  __typename?: "badma_errors_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "badma.errors" */
export type Badma_Errors_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
};

/** update columns of table "badma.errors" */
export enum Badma_Errors_Update_Column {
  /** column name */
  Context = "context",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  ErrorMessage = "error_message",
  /** column name */
  GameId = "game_id",
  /** column name */
  Id = "id",
  /** column name */
  RequestPayload = "request_payload",
  /** column name */
  ResponsePayload = "response_payload",
  /** column name */
  UserId = "user_id",
}

export type Badma_Errors_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Badma_Errors_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Badma_Errors_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Badma_Errors_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Badma_Errors_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Badma_Errors_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Badma_Errors_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Badma_Errors_Set_Input>;
  /** filter the rows which have to be updated */
  where: Badma_Errors_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Badma_Errors_Var_Pop_Fields = {
  __typename?: "badma_errors_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "badma.errors" */
export type Badma_Errors_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Badma_Errors_Var_Samp_Fields = {
  __typename?: "badma_errors_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "badma.errors" */
export type Badma_Errors_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Badma_Errors_Variance_Fields = {
  __typename?: "badma_errors_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "badma.errors" */
export type Badma_Errors_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "badma.games" */
export type Badma_Games = {
  __typename?: "badma_games";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** An array relationship */
  errors: Array<Badma_Errors>;
  /** An aggregate relationship */
  errors_aggregate: Badma_Errors_Aggregate;
  fen?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** An array relationship */
  joins: Array<Badma_Joins>;
  /** An aggregate relationship */
  joins_aggregate: Badma_Joins_Aggregate;
  mode: Scalars["String"]["output"];
  /** An array relationship */
  moves: Array<Badma_Moves>;
  /** An aggregate relationship */
  moves_aggregate: Badma_Moves_Aggregate;
  side: Scalars["Int"]["output"];
  sides: Scalars["Int"]["output"];
  status: Scalars["String"]["output"];
  storage_inserted_at: Scalars["bigint"]["output"];
  storage_updated_at: Scalars["bigint"]["output"];
  /** An array relationship */
  tournament_games: Array<Badma_Tournament_Games>;
  /** An aggregate relationship */
  tournament_games_aggregate: Badma_Tournament_Games_Aggregate;
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "badma.games" */
export type Badma_GamesErrorsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Errors_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Errors_Order_By>>;
  where?: InputMaybe<Badma_Errors_Bool_Exp>;
};

/** columns and relationships of "badma.games" */
export type Badma_GamesErrors_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Errors_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Errors_Order_By>>;
  where?: InputMaybe<Badma_Errors_Bool_Exp>;
};

/** columns and relationships of "badma.games" */
export type Badma_GamesJoinsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Joins_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Joins_Order_By>>;
  where?: InputMaybe<Badma_Joins_Bool_Exp>;
};

/** columns and relationships of "badma.games" */
export type Badma_GamesJoins_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Joins_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Joins_Order_By>>;
  where?: InputMaybe<Badma_Joins_Bool_Exp>;
};

/** columns and relationships of "badma.games" */
export type Badma_GamesMovesArgs = {
  distinct_on?: InputMaybe<Array<Badma_Moves_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Moves_Order_By>>;
  where?: InputMaybe<Badma_Moves_Bool_Exp>;
};

/** columns and relationships of "badma.games" */
export type Badma_GamesMoves_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Moves_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Moves_Order_By>>;
  where?: InputMaybe<Badma_Moves_Bool_Exp>;
};

/** columns and relationships of "badma.games" */
export type Badma_GamesTournament_GamesArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournament_Games_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournament_Games_Order_By>>;
  where?: InputMaybe<Badma_Tournament_Games_Bool_Exp>;
};

/** columns and relationships of "badma.games" */
export type Badma_GamesTournament_Games_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournament_Games_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournament_Games_Order_By>>;
  where?: InputMaybe<Badma_Tournament_Games_Bool_Exp>;
};

/** aggregated selection of "badma.games" */
export type Badma_Games_Aggregate = {
  __typename?: "badma_games_aggregate";
  aggregate?: Maybe<Badma_Games_Aggregate_Fields>;
  nodes: Array<Badma_Games>;
};

export type Badma_Games_Aggregate_Bool_Exp = {
  count?: InputMaybe<Badma_Games_Aggregate_Bool_Exp_Count>;
};

export type Badma_Games_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Badma_Games_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Badma_Games_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "badma.games" */
export type Badma_Games_Aggregate_Fields = {
  __typename?: "badma_games_aggregate_fields";
  avg?: Maybe<Badma_Games_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Badma_Games_Max_Fields>;
  min?: Maybe<Badma_Games_Min_Fields>;
  stddev?: Maybe<Badma_Games_Stddev_Fields>;
  stddev_pop?: Maybe<Badma_Games_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Badma_Games_Stddev_Samp_Fields>;
  sum?: Maybe<Badma_Games_Sum_Fields>;
  var_pop?: Maybe<Badma_Games_Var_Pop_Fields>;
  var_samp?: Maybe<Badma_Games_Var_Samp_Fields>;
  variance?: Maybe<Badma_Games_Variance_Fields>;
};

/** aggregate fields of "badma.games" */
export type Badma_Games_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Badma_Games_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "badma.games" */
export type Badma_Games_Aggregate_Order_By = {
  avg?: InputMaybe<Badma_Games_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Badma_Games_Max_Order_By>;
  min?: InputMaybe<Badma_Games_Min_Order_By>;
  stddev?: InputMaybe<Badma_Games_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Badma_Games_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Badma_Games_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Badma_Games_Sum_Order_By>;
  var_pop?: InputMaybe<Badma_Games_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Badma_Games_Var_Samp_Order_By>;
  variance?: InputMaybe<Badma_Games_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "badma.games" */
export type Badma_Games_Arr_Rel_Insert_Input = {
  data: Array<Badma_Games_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Games_On_Conflict>;
};

/** aggregate avg on columns */
export type Badma_Games_Avg_Fields = {
  __typename?: "badma_games_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  side?: Maybe<Scalars["Float"]["output"]>;
  sides?: Maybe<Scalars["Float"]["output"]>;
  storage_inserted_at?: Maybe<Scalars["Float"]["output"]>;
  storage_updated_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "badma.games" */
export type Badma_Games_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
  sides?: InputMaybe<Order_By>;
  storage_inserted_at?: InputMaybe<Order_By>;
  storage_updated_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "badma.games". All fields are combined with a logical 'AND'. */
export type Badma_Games_Bool_Exp = {
  _and?: InputMaybe<Array<Badma_Games_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Badma_Games_Bool_Exp>;
  _or?: InputMaybe<Array<Badma_Games_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  errors?: InputMaybe<Badma_Errors_Bool_Exp>;
  errors_aggregate?: InputMaybe<Badma_Errors_Aggregate_Bool_Exp>;
  fen?: InputMaybe<String_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  joins?: InputMaybe<Badma_Joins_Bool_Exp>;
  joins_aggregate?: InputMaybe<Badma_Joins_Aggregate_Bool_Exp>;
  mode?: InputMaybe<String_Comparison_Exp>;
  moves?: InputMaybe<Badma_Moves_Bool_Exp>;
  moves_aggregate?: InputMaybe<Badma_Moves_Aggregate_Bool_Exp>;
  side?: InputMaybe<Int_Comparison_Exp>;
  sides?: InputMaybe<Int_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  storage_inserted_at?: InputMaybe<Bigint_Comparison_Exp>;
  storage_updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  tournament_games?: InputMaybe<Badma_Tournament_Games_Bool_Exp>;
  tournament_games_aggregate?: InputMaybe<Badma_Tournament_Games_Aggregate_Bool_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "badma.games" */
export enum Badma_Games_Constraint {
  /** unique or primary key constraint on columns "id" */
  GamesPkey = "games_pkey",
}

/** input type for incrementing numeric columns in table "badma.games" */
export type Badma_Games_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  side?: InputMaybe<Scalars["Int"]["input"]>;
  sides?: InputMaybe<Scalars["Int"]["input"]>;
  storage_inserted_at?: InputMaybe<Scalars["bigint"]["input"]>;
  storage_updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "badma.games" */
export type Badma_Games_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  errors?: InputMaybe<Badma_Errors_Arr_Rel_Insert_Input>;
  fen?: InputMaybe<Scalars["String"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  joins?: InputMaybe<Badma_Joins_Arr_Rel_Insert_Input>;
  mode?: InputMaybe<Scalars["String"]["input"]>;
  moves?: InputMaybe<Badma_Moves_Arr_Rel_Insert_Input>;
  side?: InputMaybe<Scalars["Int"]["input"]>;
  sides?: InputMaybe<Scalars["Int"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  storage_inserted_at?: InputMaybe<Scalars["bigint"]["input"]>;
  storage_updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  tournament_games?: InputMaybe<Badma_Tournament_Games_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Badma_Games_Max_Fields = {
  __typename?: "badma_games_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  fen?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  mode?: Maybe<Scalars["String"]["output"]>;
  side?: Maybe<Scalars["Int"]["output"]>;
  sides?: Maybe<Scalars["Int"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  storage_inserted_at?: Maybe<Scalars["bigint"]["output"]>;
  storage_updated_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "badma.games" */
export type Badma_Games_Max_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  fen?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mode?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
  sides?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  storage_inserted_at?: InputMaybe<Order_By>;
  storage_updated_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Badma_Games_Min_Fields = {
  __typename?: "badma_games_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  fen?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  mode?: Maybe<Scalars["String"]["output"]>;
  side?: Maybe<Scalars["Int"]["output"]>;
  sides?: Maybe<Scalars["Int"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  storage_inserted_at?: Maybe<Scalars["bigint"]["output"]>;
  storage_updated_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "badma.games" */
export type Badma_Games_Min_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  fen?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mode?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
  sides?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  storage_inserted_at?: InputMaybe<Order_By>;
  storage_updated_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "badma.games" */
export type Badma_Games_Mutation_Response = {
  __typename?: "badma_games_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Badma_Games>;
};

/** input type for inserting object relation for remote table "badma.games" */
export type Badma_Games_Obj_Rel_Insert_Input = {
  data: Badma_Games_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Games_On_Conflict>;
};

/** on_conflict condition type for table "badma.games" */
export type Badma_Games_On_Conflict = {
  constraint: Badma_Games_Constraint;
  update_columns?: Array<Badma_Games_Update_Column>;
  where?: InputMaybe<Badma_Games_Bool_Exp>;
};

/** Ordering options when selecting data from "badma.games". */
export type Badma_Games_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  errors_aggregate?: InputMaybe<Badma_Errors_Aggregate_Order_By>;
  fen?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  joins_aggregate?: InputMaybe<Badma_Joins_Aggregate_Order_By>;
  mode?: InputMaybe<Order_By>;
  moves_aggregate?: InputMaybe<Badma_Moves_Aggregate_Order_By>;
  side?: InputMaybe<Order_By>;
  sides?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  storage_inserted_at?: InputMaybe<Order_By>;
  storage_updated_at?: InputMaybe<Order_By>;
  tournament_games_aggregate?: InputMaybe<Badma_Tournament_Games_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: badma.games */
export type Badma_Games_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "badma.games" */
export enum Badma_Games_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Fen = "fen",
  /** column name */
  Id = "id",
  /** column name */
  Mode = "mode",
  /** column name */
  Side = "side",
  /** column name */
  Sides = "sides",
  /** column name */
  Status = "status",
  /** column name */
  StorageInsertedAt = "storage_inserted_at",
  /** column name */
  StorageUpdatedAt = "storage_updated_at",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "badma.games" */
export type Badma_Games_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  fen?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  mode?: InputMaybe<Scalars["String"]["input"]>;
  side?: InputMaybe<Scalars["Int"]["input"]>;
  sides?: InputMaybe<Scalars["Int"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  storage_inserted_at?: InputMaybe<Scalars["bigint"]["input"]>;
  storage_updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Badma_Games_Stddev_Fields = {
  __typename?: "badma_games_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  side?: Maybe<Scalars["Float"]["output"]>;
  sides?: Maybe<Scalars["Float"]["output"]>;
  storage_inserted_at?: Maybe<Scalars["Float"]["output"]>;
  storage_updated_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "badma.games" */
export type Badma_Games_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
  sides?: InputMaybe<Order_By>;
  storage_inserted_at?: InputMaybe<Order_By>;
  storage_updated_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Badma_Games_Stddev_Pop_Fields = {
  __typename?: "badma_games_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  side?: Maybe<Scalars["Float"]["output"]>;
  sides?: Maybe<Scalars["Float"]["output"]>;
  storage_inserted_at?: Maybe<Scalars["Float"]["output"]>;
  storage_updated_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "badma.games" */
export type Badma_Games_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
  sides?: InputMaybe<Order_By>;
  storage_inserted_at?: InputMaybe<Order_By>;
  storage_updated_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Badma_Games_Stddev_Samp_Fields = {
  __typename?: "badma_games_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  side?: Maybe<Scalars["Float"]["output"]>;
  sides?: Maybe<Scalars["Float"]["output"]>;
  storage_inserted_at?: Maybe<Scalars["Float"]["output"]>;
  storage_updated_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "badma.games" */
export type Badma_Games_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
  sides?: InputMaybe<Order_By>;
  storage_inserted_at?: InputMaybe<Order_By>;
  storage_updated_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "badma_games" */
export type Badma_Games_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Badma_Games_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Badma_Games_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  fen?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  mode?: InputMaybe<Scalars["String"]["input"]>;
  side?: InputMaybe<Scalars["Int"]["input"]>;
  sides?: InputMaybe<Scalars["Int"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  storage_inserted_at?: InputMaybe<Scalars["bigint"]["input"]>;
  storage_updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Badma_Games_Sum_Fields = {
  __typename?: "badma_games_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  side?: Maybe<Scalars["Int"]["output"]>;
  sides?: Maybe<Scalars["Int"]["output"]>;
  storage_inserted_at?: Maybe<Scalars["bigint"]["output"]>;
  storage_updated_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "badma.games" */
export type Badma_Games_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
  sides?: InputMaybe<Order_By>;
  storage_inserted_at?: InputMaybe<Order_By>;
  storage_updated_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "badma.games" */
export enum Badma_Games_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Fen = "fen",
  /** column name */
  Id = "id",
  /** column name */
  Mode = "mode",
  /** column name */
  Side = "side",
  /** column name */
  Sides = "sides",
  /** column name */
  Status = "status",
  /** column name */
  StorageInsertedAt = "storage_inserted_at",
  /** column name */
  StorageUpdatedAt = "storage_updated_at",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Badma_Games_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Badma_Games_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Badma_Games_Set_Input>;
  /** filter the rows which have to be updated */
  where: Badma_Games_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Badma_Games_Var_Pop_Fields = {
  __typename?: "badma_games_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  side?: Maybe<Scalars["Float"]["output"]>;
  sides?: Maybe<Scalars["Float"]["output"]>;
  storage_inserted_at?: Maybe<Scalars["Float"]["output"]>;
  storage_updated_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "badma.games" */
export type Badma_Games_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
  sides?: InputMaybe<Order_By>;
  storage_inserted_at?: InputMaybe<Order_By>;
  storage_updated_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Badma_Games_Var_Samp_Fields = {
  __typename?: "badma_games_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  side?: Maybe<Scalars["Float"]["output"]>;
  sides?: Maybe<Scalars["Float"]["output"]>;
  storage_inserted_at?: Maybe<Scalars["Float"]["output"]>;
  storage_updated_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "badma.games" */
export type Badma_Games_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
  sides?: InputMaybe<Order_By>;
  storage_inserted_at?: InputMaybe<Order_By>;
  storage_updated_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Badma_Games_Variance_Fields = {
  __typename?: "badma_games_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  side?: Maybe<Scalars["Float"]["output"]>;
  sides?: Maybe<Scalars["Float"]["output"]>;
  storage_inserted_at?: Maybe<Scalars["Float"]["output"]>;
  storage_updated_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "badma.games" */
export type Badma_Games_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
  sides?: InputMaybe<Order_By>;
  storage_inserted_at?: InputMaybe<Order_By>;
  storage_updated_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "badma.in_clubs" */
export type Badma_In_Clubs = {
  __typename?: "badma_in_clubs";
  /** An object relationship */
  club: Badma_Clubs;
  /** Reference to clubs table */
  club_id: Scalars["uuid"]["output"];
  created_at: Scalars["bigint"]["output"];
  /** An object relationship */
  created_by: Users;
  /** User who created the request */
  created_by_id: Scalars["uuid"]["output"];
  id: Scalars["uuid"]["output"];
  /** Request status */
  status: Scalars["String"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  /** User for whom the request was created */
  user_id: Scalars["uuid"]["output"];
};

/** aggregated selection of "badma.in_clubs" */
export type Badma_In_Clubs_Aggregate = {
  __typename?: "badma_in_clubs_aggregate";
  aggregate?: Maybe<Badma_In_Clubs_Aggregate_Fields>;
  nodes: Array<Badma_In_Clubs>;
};

export type Badma_In_Clubs_Aggregate_Bool_Exp = {
  count?: InputMaybe<Badma_In_Clubs_Aggregate_Bool_Exp_Count>;
};

export type Badma_In_Clubs_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Badma_In_Clubs_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Badma_In_Clubs_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "badma.in_clubs" */
export type Badma_In_Clubs_Aggregate_Fields = {
  __typename?: "badma_in_clubs_aggregate_fields";
  avg?: Maybe<Badma_In_Clubs_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Badma_In_Clubs_Max_Fields>;
  min?: Maybe<Badma_In_Clubs_Min_Fields>;
  stddev?: Maybe<Badma_In_Clubs_Stddev_Fields>;
  stddev_pop?: Maybe<Badma_In_Clubs_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Badma_In_Clubs_Stddev_Samp_Fields>;
  sum?: Maybe<Badma_In_Clubs_Sum_Fields>;
  var_pop?: Maybe<Badma_In_Clubs_Var_Pop_Fields>;
  var_samp?: Maybe<Badma_In_Clubs_Var_Samp_Fields>;
  variance?: Maybe<Badma_In_Clubs_Variance_Fields>;
};

/** aggregate fields of "badma.in_clubs" */
export type Badma_In_Clubs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Badma_In_Clubs_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "badma.in_clubs" */
export type Badma_In_Clubs_Aggregate_Order_By = {
  avg?: InputMaybe<Badma_In_Clubs_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Badma_In_Clubs_Max_Order_By>;
  min?: InputMaybe<Badma_In_Clubs_Min_Order_By>;
  stddev?: InputMaybe<Badma_In_Clubs_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Badma_In_Clubs_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Badma_In_Clubs_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Badma_In_Clubs_Sum_Order_By>;
  var_pop?: InputMaybe<Badma_In_Clubs_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Badma_In_Clubs_Var_Samp_Order_By>;
  variance?: InputMaybe<Badma_In_Clubs_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "badma.in_clubs" */
export type Badma_In_Clubs_Arr_Rel_Insert_Input = {
  data: Array<Badma_In_Clubs_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_In_Clubs_On_Conflict>;
};

/** aggregate avg on columns */
export type Badma_In_Clubs_Avg_Fields = {
  __typename?: "badma_in_clubs_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "badma.in_clubs" */
export type Badma_In_Clubs_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "badma.in_clubs". All fields are combined with a logical 'AND'. */
export type Badma_In_Clubs_Bool_Exp = {
  _and?: InputMaybe<Array<Badma_In_Clubs_Bool_Exp>>;
  _not?: InputMaybe<Badma_In_Clubs_Bool_Exp>;
  _or?: InputMaybe<Array<Badma_In_Clubs_Bool_Exp>>;
  club?: InputMaybe<Badma_Clubs_Bool_Exp>;
  club_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  created_by?: InputMaybe<Users_Bool_Exp>;
  created_by_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "badma.in_clubs" */
export enum Badma_In_Clubs_Constraint {
  /** unique or primary key constraint on columns "id" */
  InClubsPkey = "in_clubs_pkey",
}

/** input type for incrementing numeric columns in table "badma.in_clubs" */
export type Badma_In_Clubs_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "badma.in_clubs" */
export type Badma_In_Clubs_Insert_Input = {
  club?: InputMaybe<Badma_Clubs_Obj_Rel_Insert_Input>;
  /** Reference to clubs table */
  club_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  created_by?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** User who created the request */
  created_by_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Request status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** User for whom the request was created */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Badma_In_Clubs_Max_Fields = {
  __typename?: "badma_in_clubs_max_fields";
  /** Reference to clubs table */
  club_id?: Maybe<Scalars["uuid"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User who created the request */
  created_by_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Request status */
  status?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User for whom the request was created */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "badma.in_clubs" */
export type Badma_In_Clubs_Max_Order_By = {
  /** Reference to clubs table */
  club_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** User who created the request */
  created_by_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Request status */
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** User for whom the request was created */
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Badma_In_Clubs_Min_Fields = {
  __typename?: "badma_in_clubs_min_fields";
  /** Reference to clubs table */
  club_id?: Maybe<Scalars["uuid"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User who created the request */
  created_by_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Request status */
  status?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User for whom the request was created */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "badma.in_clubs" */
export type Badma_In_Clubs_Min_Order_By = {
  /** Reference to clubs table */
  club_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** User who created the request */
  created_by_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Request status */
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** User for whom the request was created */
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "badma.in_clubs" */
export type Badma_In_Clubs_Mutation_Response = {
  __typename?: "badma_in_clubs_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Badma_In_Clubs>;
};

/** on_conflict condition type for table "badma.in_clubs" */
export type Badma_In_Clubs_On_Conflict = {
  constraint: Badma_In_Clubs_Constraint;
  update_columns?: Array<Badma_In_Clubs_Update_Column>;
  where?: InputMaybe<Badma_In_Clubs_Bool_Exp>;
};

/** Ordering options when selecting data from "badma.in_clubs". */
export type Badma_In_Clubs_Order_By = {
  club?: InputMaybe<Badma_Clubs_Order_By>;
  club_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Users_Order_By>;
  created_by_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: badma.in_clubs */
export type Badma_In_Clubs_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "badma.in_clubs" */
export enum Badma_In_Clubs_Select_Column {
  /** column name */
  ClubId = "club_id",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CreatedById = "created_by_id",
  /** column name */
  Id = "id",
  /** column name */
  Status = "status",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "badma.in_clubs" */
export type Badma_In_Clubs_Set_Input = {
  /** Reference to clubs table */
  club_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who created the request */
  created_by_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Request status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User for whom the request was created */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Badma_In_Clubs_Stddev_Fields = {
  __typename?: "badma_in_clubs_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "badma.in_clubs" */
export type Badma_In_Clubs_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Badma_In_Clubs_Stddev_Pop_Fields = {
  __typename?: "badma_in_clubs_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "badma.in_clubs" */
export type Badma_In_Clubs_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Badma_In_Clubs_Stddev_Samp_Fields = {
  __typename?: "badma_in_clubs_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "badma.in_clubs" */
export type Badma_In_Clubs_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "badma_in_clubs" */
export type Badma_In_Clubs_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Badma_In_Clubs_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Badma_In_Clubs_Stream_Cursor_Value_Input = {
  /** Reference to clubs table */
  club_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who created the request */
  created_by_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Request status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User for whom the request was created */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Badma_In_Clubs_Sum_Fields = {
  __typename?: "badma_in_clubs_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "badma.in_clubs" */
export type Badma_In_Clubs_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "badma.in_clubs" */
export enum Badma_In_Clubs_Update_Column {
  /** column name */
  ClubId = "club_id",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CreatedById = "created_by_id",
  /** column name */
  Id = "id",
  /** column name */
  Status = "status",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Badma_In_Clubs_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Badma_In_Clubs_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Badma_In_Clubs_Set_Input>;
  /** filter the rows which have to be updated */
  where: Badma_In_Clubs_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Badma_In_Clubs_Var_Pop_Fields = {
  __typename?: "badma_in_clubs_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "badma.in_clubs" */
export type Badma_In_Clubs_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Badma_In_Clubs_Var_Samp_Fields = {
  __typename?: "badma_in_clubs_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "badma.in_clubs" */
export type Badma_In_Clubs_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Badma_In_Clubs_Variance_Fields = {
  __typename?: "badma_in_clubs_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "badma.in_clubs" */
export type Badma_In_Clubs_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "badma.items" */
export type Badma_Items = {
  __typename?: "badma_items";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Принят ли предмет пользователем */
  accepted: Scalars["Boolean"]["output"];
  /** Timestamp когда предмет был принят */
  accepted_at?: Maybe<Scalars["bigint"]["output"]>;
  /** An object relationship */
  club?: Maybe<Badma_Clubs>;
  /** Владелец может передать права владения клубу */
  club_id?: Maybe<Scalars["uuid"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** Опциональный ID причины предоставления предмета */
  reason_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Кодовое уникальное обозначение сущности */
  type: Scalars["String"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  /** Владелец предмета */
  user_id: Scalars["uuid"]["output"];
};

/** aggregated selection of "badma.items" */
export type Badma_Items_Aggregate = {
  __typename?: "badma_items_aggregate";
  aggregate?: Maybe<Badma_Items_Aggregate_Fields>;
  nodes: Array<Badma_Items>;
};

export type Badma_Items_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Badma_Items_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Badma_Items_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Badma_Items_Aggregate_Bool_Exp_Count>;
};

export type Badma_Items_Aggregate_Bool_Exp_Bool_And = {
  arguments: Badma_Items_Select_Column_Badma_Items_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Badma_Items_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Badma_Items_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Badma_Items_Select_Column_Badma_Items_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Badma_Items_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Badma_Items_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Badma_Items_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Badma_Items_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "badma.items" */
export type Badma_Items_Aggregate_Fields = {
  __typename?: "badma_items_aggregate_fields";
  avg?: Maybe<Badma_Items_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Badma_Items_Max_Fields>;
  min?: Maybe<Badma_Items_Min_Fields>;
  stddev?: Maybe<Badma_Items_Stddev_Fields>;
  stddev_pop?: Maybe<Badma_Items_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Badma_Items_Stddev_Samp_Fields>;
  sum?: Maybe<Badma_Items_Sum_Fields>;
  var_pop?: Maybe<Badma_Items_Var_Pop_Fields>;
  var_samp?: Maybe<Badma_Items_Var_Samp_Fields>;
  variance?: Maybe<Badma_Items_Variance_Fields>;
};

/** aggregate fields of "badma.items" */
export type Badma_Items_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Badma_Items_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "badma.items" */
export type Badma_Items_Aggregate_Order_By = {
  avg?: InputMaybe<Badma_Items_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Badma_Items_Max_Order_By>;
  min?: InputMaybe<Badma_Items_Min_Order_By>;
  stddev?: InputMaybe<Badma_Items_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Badma_Items_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Badma_Items_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Badma_Items_Sum_Order_By>;
  var_pop?: InputMaybe<Badma_Items_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Badma_Items_Var_Samp_Order_By>;
  variance?: InputMaybe<Badma_Items_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "badma.items" */
export type Badma_Items_Arr_Rel_Insert_Input = {
  data: Array<Badma_Items_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Items_On_Conflict>;
};

/** aggregate avg on columns */
export type Badma_Items_Avg_Fields = {
  __typename?: "badma_items_avg_fields";
  /** Timestamp когда предмет был принят */
  accepted_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "badma.items" */
export type Badma_Items_Avg_Order_By = {
  /** Timestamp когда предмет был принят */
  accepted_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "badma.items". All fields are combined with a logical 'AND'. */
export type Badma_Items_Bool_Exp = {
  _and?: InputMaybe<Array<Badma_Items_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Badma_Items_Bool_Exp>;
  _or?: InputMaybe<Array<Badma_Items_Bool_Exp>>;
  accepted?: InputMaybe<Boolean_Comparison_Exp>;
  accepted_at?: InputMaybe<Bigint_Comparison_Exp>;
  club?: InputMaybe<Badma_Clubs_Bool_Exp>;
  club_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  reason_id?: InputMaybe<Uuid_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "badma.items" */
export enum Badma_Items_Constraint {
  /** unique or primary key constraint on columns "id" */
  ItemsPkey = "items_pkey",
}

/** input type for incrementing numeric columns in table "badma.items" */
export type Badma_Items_Inc_Input = {
  /** Timestamp когда предмет был принят */
  accepted_at?: InputMaybe<Scalars["bigint"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "badma.items" */
export type Badma_Items_Insert_Input = {
  /** Принят ли предмет пользователем */
  accepted?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Timestamp когда предмет был принят */
  accepted_at?: InputMaybe<Scalars["bigint"]["input"]>;
  club?: InputMaybe<Badma_Clubs_Obj_Rel_Insert_Input>;
  /** Владелец может передать права владения клубу */
  club_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Опциональный ID причины предоставления предмета */
  reason_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Кодовое уникальное обозначение сущности */
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** Владелец предмета */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Badma_Items_Max_Fields = {
  __typename?: "badma_items_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Timestamp когда предмет был принят */
  accepted_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Владелец может передать права владения клубу */
  club_id?: Maybe<Scalars["uuid"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Опциональный ID причины предоставления предмета */
  reason_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Кодовое уникальное обозначение сущности */
  type?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Владелец предмета */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "badma.items" */
export type Badma_Items_Max_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  /** Timestamp когда предмет был принят */
  accepted_at?: InputMaybe<Order_By>;
  /** Владелец может передать права владения клубу */
  club_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Опциональный ID причины предоставления предмета */
  reason_id?: InputMaybe<Order_By>;
  /** Кодовое уникальное обозначение сущности */
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** Владелец предмета */
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Badma_Items_Min_Fields = {
  __typename?: "badma_items_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** Timestamp когда предмет был принят */
  accepted_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Владелец может передать права владения клубу */
  club_id?: Maybe<Scalars["uuid"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Опциональный ID причины предоставления предмета */
  reason_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Кодовое уникальное обозначение сущности */
  type?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Владелец предмета */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "badma.items" */
export type Badma_Items_Min_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  /** Timestamp когда предмет был принят */
  accepted_at?: InputMaybe<Order_By>;
  /** Владелец может передать права владения клубу */
  club_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Опциональный ID причины предоставления предмета */
  reason_id?: InputMaybe<Order_By>;
  /** Кодовое уникальное обозначение сущности */
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** Владелец предмета */
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "badma.items" */
export type Badma_Items_Mutation_Response = {
  __typename?: "badma_items_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Badma_Items>;
};

/** input type for inserting object relation for remote table "badma.items" */
export type Badma_Items_Obj_Rel_Insert_Input = {
  data: Badma_Items_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Items_On_Conflict>;
};

/** on_conflict condition type for table "badma.items" */
export type Badma_Items_On_Conflict = {
  constraint: Badma_Items_Constraint;
  update_columns?: Array<Badma_Items_Update_Column>;
  where?: InputMaybe<Badma_Items_Bool_Exp>;
};

/** Ordering options when selecting data from "badma.items". */
export type Badma_Items_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  accepted?: InputMaybe<Order_By>;
  accepted_at?: InputMaybe<Order_By>;
  club?: InputMaybe<Badma_Clubs_Order_By>;
  club_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  reason_id?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: badma.items */
export type Badma_Items_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "badma.items" */
export enum Badma_Items_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  Accepted = "accepted",
  /** column name */
  AcceptedAt = "accepted_at",
  /** column name */
  ClubId = "club_id",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  ReasonId = "reason_id",
  /** column name */
  Type = "type",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** select "badma_items_aggregate_bool_exp_bool_and_arguments_columns" columns of table "badma.items" */
export enum Badma_Items_Select_Column_Badma_Items_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Accepted = "accepted",
}

/** select "badma_items_aggregate_bool_exp_bool_or_arguments_columns" columns of table "badma.items" */
export enum Badma_Items_Select_Column_Badma_Items_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Accepted = "accepted",
}

/** input type for updating data in table "badma.items" */
export type Badma_Items_Set_Input = {
  /** Принят ли предмет пользователем */
  accepted?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Timestamp когда предмет был принят */
  accepted_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Владелец может передать права владения клубу */
  club_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Опциональный ID причины предоставления предмета */
  reason_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Кодовое уникальное обозначение сущности */
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Владелец предмета */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Badma_Items_Stddev_Fields = {
  __typename?: "badma_items_stddev_fields";
  /** Timestamp когда предмет был принят */
  accepted_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "badma.items" */
export type Badma_Items_Stddev_Order_By = {
  /** Timestamp когда предмет был принят */
  accepted_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Badma_Items_Stddev_Pop_Fields = {
  __typename?: "badma_items_stddev_pop_fields";
  /** Timestamp когда предмет был принят */
  accepted_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "badma.items" */
export type Badma_Items_Stddev_Pop_Order_By = {
  /** Timestamp когда предмет был принят */
  accepted_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Badma_Items_Stddev_Samp_Fields = {
  __typename?: "badma_items_stddev_samp_fields";
  /** Timestamp когда предмет был принят */
  accepted_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "badma.items" */
export type Badma_Items_Stddev_Samp_Order_By = {
  /** Timestamp когда предмет был принят */
  accepted_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "badma_items" */
export type Badma_Items_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Badma_Items_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Badma_Items_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Принят ли предмет пользователем */
  accepted?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Timestamp когда предмет был принят */
  accepted_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Владелец может передать права владения клубу */
  club_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Опциональный ID причины предоставления предмета */
  reason_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Кодовое уникальное обозначение сущности */
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Владелец предмета */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Badma_Items_Sum_Fields = {
  __typename?: "badma_items_sum_fields";
  /** Timestamp когда предмет был принят */
  accepted_at?: Maybe<Scalars["bigint"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "badma.items" */
export type Badma_Items_Sum_Order_By = {
  /** Timestamp когда предмет был принят */
  accepted_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "badma.items" */
export enum Badma_Items_Update_Column {
  /** column name */
  Accepted = "accepted",
  /** column name */
  AcceptedAt = "accepted_at",
  /** column name */
  ClubId = "club_id",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  ReasonId = "reason_id",
  /** column name */
  Type = "type",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Badma_Items_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Badma_Items_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Badma_Items_Set_Input>;
  /** filter the rows which have to be updated */
  where: Badma_Items_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Badma_Items_Var_Pop_Fields = {
  __typename?: "badma_items_var_pop_fields";
  /** Timestamp когда предмет был принят */
  accepted_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "badma.items" */
export type Badma_Items_Var_Pop_Order_By = {
  /** Timestamp когда предмет был принят */
  accepted_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Badma_Items_Var_Samp_Fields = {
  __typename?: "badma_items_var_samp_fields";
  /** Timestamp когда предмет был принят */
  accepted_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "badma.items" */
export type Badma_Items_Var_Samp_Order_By = {
  /** Timestamp когда предмет был принят */
  accepted_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Badma_Items_Variance_Fields = {
  __typename?: "badma_items_variance_fields";
  /** Timestamp когда предмет был принят */
  accepted_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "badma.items" */
export type Badma_Items_Variance_Order_By = {
  /** Timestamp когда предмет был принят */
  accepted_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "badma.joins" */
export type Badma_Joins = {
  __typename?: "badma_joins";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  client_id?: Maybe<Scalars["uuid"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** An object relationship */
  game: Badma_Games;
  game_id: Scalars["uuid"]["output"];
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  role: Scalars["Int"]["output"];
  side: Scalars["Int"]["output"];
  /** An object relationship */
  user: Users;
  user_id: Scalars["uuid"]["output"];
};

/** aggregated selection of "badma.joins" */
export type Badma_Joins_Aggregate = {
  __typename?: "badma_joins_aggregate";
  aggregate?: Maybe<Badma_Joins_Aggregate_Fields>;
  nodes: Array<Badma_Joins>;
};

export type Badma_Joins_Aggregate_Bool_Exp = {
  count?: InputMaybe<Badma_Joins_Aggregate_Bool_Exp_Count>;
};

export type Badma_Joins_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Badma_Joins_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Badma_Joins_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "badma.joins" */
export type Badma_Joins_Aggregate_Fields = {
  __typename?: "badma_joins_aggregate_fields";
  avg?: Maybe<Badma_Joins_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Badma_Joins_Max_Fields>;
  min?: Maybe<Badma_Joins_Min_Fields>;
  stddev?: Maybe<Badma_Joins_Stddev_Fields>;
  stddev_pop?: Maybe<Badma_Joins_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Badma_Joins_Stddev_Samp_Fields>;
  sum?: Maybe<Badma_Joins_Sum_Fields>;
  var_pop?: Maybe<Badma_Joins_Var_Pop_Fields>;
  var_samp?: Maybe<Badma_Joins_Var_Samp_Fields>;
  variance?: Maybe<Badma_Joins_Variance_Fields>;
};

/** aggregate fields of "badma.joins" */
export type Badma_Joins_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Badma_Joins_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "badma.joins" */
export type Badma_Joins_Aggregate_Order_By = {
  avg?: InputMaybe<Badma_Joins_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Badma_Joins_Max_Order_By>;
  min?: InputMaybe<Badma_Joins_Min_Order_By>;
  stddev?: InputMaybe<Badma_Joins_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Badma_Joins_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Badma_Joins_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Badma_Joins_Sum_Order_By>;
  var_pop?: InputMaybe<Badma_Joins_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Badma_Joins_Var_Samp_Order_By>;
  variance?: InputMaybe<Badma_Joins_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "badma.joins" */
export type Badma_Joins_Arr_Rel_Insert_Input = {
  data: Array<Badma_Joins_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Joins_On_Conflict>;
};

/** aggregate avg on columns */
export type Badma_Joins_Avg_Fields = {
  __typename?: "badma_joins_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  role?: Maybe<Scalars["Float"]["output"]>;
  side?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "badma.joins" */
export type Badma_Joins_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "badma.joins". All fields are combined with a logical 'AND'. */
export type Badma_Joins_Bool_Exp = {
  _and?: InputMaybe<Array<Badma_Joins_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Badma_Joins_Bool_Exp>;
  _or?: InputMaybe<Array<Badma_Joins_Bool_Exp>>;
  client_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  game?: InputMaybe<Badma_Games_Bool_Exp>;
  game_id?: InputMaybe<Uuid_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<Int_Comparison_Exp>;
  side?: InputMaybe<Int_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "badma.joins" */
export enum Badma_Joins_Constraint {
  /** unique or primary key constraint on columns "id" */
  JoinsPkey = "joins_pkey",
}

/** input type for incrementing numeric columns in table "badma.joins" */
export type Badma_Joins_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  role?: InputMaybe<Scalars["Int"]["input"]>;
  side?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "badma.joins" */
export type Badma_Joins_Insert_Input = {
  client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  game?: InputMaybe<Badma_Games_Obj_Rel_Insert_Input>;
  game_id?: InputMaybe<Scalars["uuid"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  role?: InputMaybe<Scalars["Int"]["input"]>;
  side?: InputMaybe<Scalars["Int"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Badma_Joins_Max_Fields = {
  __typename?: "badma_joins_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  client_id?: Maybe<Scalars["uuid"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  game_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  role?: Maybe<Scalars["Int"]["output"]>;
  side?: Maybe<Scalars["Int"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "badma.joins" */
export type Badma_Joins_Max_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  client_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  game_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Badma_Joins_Min_Fields = {
  __typename?: "badma_joins_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  client_id?: Maybe<Scalars["uuid"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  game_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  role?: Maybe<Scalars["Int"]["output"]>;
  side?: Maybe<Scalars["Int"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "badma.joins" */
export type Badma_Joins_Min_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  client_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  game_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "badma.joins" */
export type Badma_Joins_Mutation_Response = {
  __typename?: "badma_joins_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Badma_Joins>;
};

/** input type for inserting object relation for remote table "badma.joins" */
export type Badma_Joins_Obj_Rel_Insert_Input = {
  data: Badma_Joins_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Joins_On_Conflict>;
};

/** on_conflict condition type for table "badma.joins" */
export type Badma_Joins_On_Conflict = {
  constraint: Badma_Joins_Constraint;
  update_columns?: Array<Badma_Joins_Update_Column>;
  where?: InputMaybe<Badma_Joins_Bool_Exp>;
};

/** Ordering options when selecting data from "badma.joins". */
export type Badma_Joins_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  client_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  game?: InputMaybe<Badma_Games_Order_By>;
  game_id?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: badma.joins */
export type Badma_Joins_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "badma.joins" */
export enum Badma_Joins_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  ClientId = "client_id",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  GameId = "game_id",
  /** column name */
  Id = "id",
  /** column name */
  Role = "role",
  /** column name */
  Side = "side",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "badma.joins" */
export type Badma_Joins_Set_Input = {
  client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  game_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  role?: InputMaybe<Scalars["Int"]["input"]>;
  side?: InputMaybe<Scalars["Int"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Badma_Joins_Stddev_Fields = {
  __typename?: "badma_joins_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  role?: Maybe<Scalars["Float"]["output"]>;
  side?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "badma.joins" */
export type Badma_Joins_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Badma_Joins_Stddev_Pop_Fields = {
  __typename?: "badma_joins_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  role?: Maybe<Scalars["Float"]["output"]>;
  side?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "badma.joins" */
export type Badma_Joins_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Badma_Joins_Stddev_Samp_Fields = {
  __typename?: "badma_joins_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  role?: Maybe<Scalars["Float"]["output"]>;
  side?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "badma.joins" */
export type Badma_Joins_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "badma_joins" */
export type Badma_Joins_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Badma_Joins_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Badma_Joins_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  client_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  game_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  role?: InputMaybe<Scalars["Int"]["input"]>;
  side?: InputMaybe<Scalars["Int"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Badma_Joins_Sum_Fields = {
  __typename?: "badma_joins_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  role?: Maybe<Scalars["Int"]["output"]>;
  side?: Maybe<Scalars["Int"]["output"]>;
};

/** order by sum() on columns of table "badma.joins" */
export type Badma_Joins_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
};

/** update columns of table "badma.joins" */
export enum Badma_Joins_Update_Column {
  /** column name */
  ClientId = "client_id",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  GameId = "game_id",
  /** column name */
  Id = "id",
  /** column name */
  Role = "role",
  /** column name */
  Side = "side",
  /** column name */
  UserId = "user_id",
}

export type Badma_Joins_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Badma_Joins_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Badma_Joins_Set_Input>;
  /** filter the rows which have to be updated */
  where: Badma_Joins_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Badma_Joins_Var_Pop_Fields = {
  __typename?: "badma_joins_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  role?: Maybe<Scalars["Float"]["output"]>;
  side?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "badma.joins" */
export type Badma_Joins_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Badma_Joins_Var_Samp_Fields = {
  __typename?: "badma_joins_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  role?: Maybe<Scalars["Float"]["output"]>;
  side?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "badma.joins" */
export type Badma_Joins_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Badma_Joins_Variance_Fields = {
  __typename?: "badma_joins_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  role?: Maybe<Scalars["Float"]["output"]>;
  side?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "badma.joins" */
export type Badma_Joins_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
};

/** columns and relationships of "badma.moves" */
export type Badma_Moves = {
  __typename?: "badma_moves";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  from?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  game: Badma_Games;
  game_id: Scalars["uuid"]["output"];
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  promotion?: Maybe<Scalars["String"]["output"]>;
  side?: Maybe<Scalars["Int"]["output"]>;
  to?: Maybe<Scalars["String"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  user: Users;
  user_id: Scalars["uuid"]["output"];
};

/** aggregated selection of "badma.moves" */
export type Badma_Moves_Aggregate = {
  __typename?: "badma_moves_aggregate";
  aggregate?: Maybe<Badma_Moves_Aggregate_Fields>;
  nodes: Array<Badma_Moves>;
};

export type Badma_Moves_Aggregate_Bool_Exp = {
  count?: InputMaybe<Badma_Moves_Aggregate_Bool_Exp_Count>;
};

export type Badma_Moves_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Badma_Moves_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Badma_Moves_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "badma.moves" */
export type Badma_Moves_Aggregate_Fields = {
  __typename?: "badma_moves_aggregate_fields";
  avg?: Maybe<Badma_Moves_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Badma_Moves_Max_Fields>;
  min?: Maybe<Badma_Moves_Min_Fields>;
  stddev?: Maybe<Badma_Moves_Stddev_Fields>;
  stddev_pop?: Maybe<Badma_Moves_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Badma_Moves_Stddev_Samp_Fields>;
  sum?: Maybe<Badma_Moves_Sum_Fields>;
  var_pop?: Maybe<Badma_Moves_Var_Pop_Fields>;
  var_samp?: Maybe<Badma_Moves_Var_Samp_Fields>;
  variance?: Maybe<Badma_Moves_Variance_Fields>;
};

/** aggregate fields of "badma.moves" */
export type Badma_Moves_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Badma_Moves_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "badma.moves" */
export type Badma_Moves_Aggregate_Order_By = {
  avg?: InputMaybe<Badma_Moves_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Badma_Moves_Max_Order_By>;
  min?: InputMaybe<Badma_Moves_Min_Order_By>;
  stddev?: InputMaybe<Badma_Moves_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Badma_Moves_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Badma_Moves_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Badma_Moves_Sum_Order_By>;
  var_pop?: InputMaybe<Badma_Moves_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Badma_Moves_Var_Samp_Order_By>;
  variance?: InputMaybe<Badma_Moves_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "badma.moves" */
export type Badma_Moves_Arr_Rel_Insert_Input = {
  data: Array<Badma_Moves_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Moves_On_Conflict>;
};

/** aggregate avg on columns */
export type Badma_Moves_Avg_Fields = {
  __typename?: "badma_moves_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  side?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "badma.moves" */
export type Badma_Moves_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "badma.moves". All fields are combined with a logical 'AND'. */
export type Badma_Moves_Bool_Exp = {
  _and?: InputMaybe<Array<Badma_Moves_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Badma_Moves_Bool_Exp>;
  _or?: InputMaybe<Array<Badma_Moves_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  from?: InputMaybe<String_Comparison_Exp>;
  game?: InputMaybe<Badma_Games_Bool_Exp>;
  game_id?: InputMaybe<Uuid_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  promotion?: InputMaybe<String_Comparison_Exp>;
  side?: InputMaybe<Int_Comparison_Exp>;
  to?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "badma.moves" */
export enum Badma_Moves_Constraint {
  /** unique or primary key constraint on columns "id" */
  MovesPkey = "moves_pkey",
}

/** input type for incrementing numeric columns in table "badma.moves" */
export type Badma_Moves_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  side?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "badma.moves" */
export type Badma_Moves_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  from?: InputMaybe<Scalars["String"]["input"]>;
  game?: InputMaybe<Badma_Games_Obj_Rel_Insert_Input>;
  game_id?: InputMaybe<Scalars["uuid"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  promotion?: InputMaybe<Scalars["String"]["input"]>;
  side?: InputMaybe<Scalars["Int"]["input"]>;
  to?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Badma_Moves_Max_Fields = {
  __typename?: "badma_moves_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  from?: Maybe<Scalars["String"]["output"]>;
  game_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  promotion?: Maybe<Scalars["String"]["output"]>;
  side?: Maybe<Scalars["Int"]["output"]>;
  to?: Maybe<Scalars["String"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "badma.moves" */
export type Badma_Moves_Max_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  from?: InputMaybe<Order_By>;
  game_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  promotion?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
  to?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Badma_Moves_Min_Fields = {
  __typename?: "badma_moves_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  from?: Maybe<Scalars["String"]["output"]>;
  game_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  promotion?: Maybe<Scalars["String"]["output"]>;
  side?: Maybe<Scalars["Int"]["output"]>;
  to?: Maybe<Scalars["String"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "badma.moves" */
export type Badma_Moves_Min_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  from?: InputMaybe<Order_By>;
  game_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  promotion?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
  to?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "badma.moves" */
export type Badma_Moves_Mutation_Response = {
  __typename?: "badma_moves_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Badma_Moves>;
};

/** input type for inserting object relation for remote table "badma.moves" */
export type Badma_Moves_Obj_Rel_Insert_Input = {
  data: Badma_Moves_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Moves_On_Conflict>;
};

/** on_conflict condition type for table "badma.moves" */
export type Badma_Moves_On_Conflict = {
  constraint: Badma_Moves_Constraint;
  update_columns?: Array<Badma_Moves_Update_Column>;
  where?: InputMaybe<Badma_Moves_Bool_Exp>;
};

/** Ordering options when selecting data from "badma.moves". */
export type Badma_Moves_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  from?: InputMaybe<Order_By>;
  game?: InputMaybe<Badma_Games_Order_By>;
  game_id?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  promotion?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
  to?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: badma.moves */
export type Badma_Moves_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "badma.moves" */
export enum Badma_Moves_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  From = "from",
  /** column name */
  GameId = "game_id",
  /** column name */
  Id = "id",
  /** column name */
  Promotion = "promotion",
  /** column name */
  Side = "side",
  /** column name */
  To = "to",
  /** column name */
  Type = "type",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "badma.moves" */
export type Badma_Moves_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  from?: InputMaybe<Scalars["String"]["input"]>;
  game_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  promotion?: InputMaybe<Scalars["String"]["input"]>;
  side?: InputMaybe<Scalars["Int"]["input"]>;
  to?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Badma_Moves_Stddev_Fields = {
  __typename?: "badma_moves_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  side?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "badma.moves" */
export type Badma_Moves_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Badma_Moves_Stddev_Pop_Fields = {
  __typename?: "badma_moves_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  side?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "badma.moves" */
export type Badma_Moves_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Badma_Moves_Stddev_Samp_Fields = {
  __typename?: "badma_moves_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  side?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "badma.moves" */
export type Badma_Moves_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "badma_moves" */
export type Badma_Moves_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Badma_Moves_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Badma_Moves_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  from?: InputMaybe<Scalars["String"]["input"]>;
  game_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  promotion?: InputMaybe<Scalars["String"]["input"]>;
  side?: InputMaybe<Scalars["Int"]["input"]>;
  to?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Badma_Moves_Sum_Fields = {
  __typename?: "badma_moves_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  side?: Maybe<Scalars["Int"]["output"]>;
};

/** order by sum() on columns of table "badma.moves" */
export type Badma_Moves_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
};

/** update columns of table "badma.moves" */
export enum Badma_Moves_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  From = "from",
  /** column name */
  GameId = "game_id",
  /** column name */
  Id = "id",
  /** column name */
  Promotion = "promotion",
  /** column name */
  Side = "side",
  /** column name */
  To = "to",
  /** column name */
  Type = "type",
  /** column name */
  UserId = "user_id",
}

export type Badma_Moves_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Badma_Moves_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Badma_Moves_Set_Input>;
  /** filter the rows which have to be updated */
  where: Badma_Moves_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Badma_Moves_Var_Pop_Fields = {
  __typename?: "badma_moves_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  side?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "badma.moves" */
export type Badma_Moves_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Badma_Moves_Var_Samp_Fields = {
  __typename?: "badma_moves_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  side?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "badma.moves" */
export type Badma_Moves_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Badma_Moves_Variance_Fields = {
  __typename?: "badma_moves_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  side?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "badma.moves" */
export type Badma_Moves_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  side?: InputMaybe<Order_By>;
};

/** columns and relationships of "badma.servers" */
export type Badma_Servers = {
  __typename?: "badma_servers";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  active_at: Scalars["bigint"]["output"];
  created_at: Scalars["bigint"]["output"];
  global_address: Scalars["String"]["output"];
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  local_address: Scalars["String"]["output"];
};

/** aggregated selection of "badma.servers" */
export type Badma_Servers_Aggregate = {
  __typename?: "badma_servers_aggregate";
  aggregate?: Maybe<Badma_Servers_Aggregate_Fields>;
  nodes: Array<Badma_Servers>;
};

/** aggregate fields of "badma.servers" */
export type Badma_Servers_Aggregate_Fields = {
  __typename?: "badma_servers_aggregate_fields";
  avg?: Maybe<Badma_Servers_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Badma_Servers_Max_Fields>;
  min?: Maybe<Badma_Servers_Min_Fields>;
  stddev?: Maybe<Badma_Servers_Stddev_Fields>;
  stddev_pop?: Maybe<Badma_Servers_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Badma_Servers_Stddev_Samp_Fields>;
  sum?: Maybe<Badma_Servers_Sum_Fields>;
  var_pop?: Maybe<Badma_Servers_Var_Pop_Fields>;
  var_samp?: Maybe<Badma_Servers_Var_Samp_Fields>;
  variance?: Maybe<Badma_Servers_Variance_Fields>;
};

/** aggregate fields of "badma.servers" */
export type Badma_Servers_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Badma_Servers_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Badma_Servers_Avg_Fields = {
  __typename?: "badma_servers_avg_fields";
  active_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "badma.servers". All fields are combined with a logical 'AND'. */
export type Badma_Servers_Bool_Exp = {
  _and?: InputMaybe<Array<Badma_Servers_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Badma_Servers_Bool_Exp>;
  _or?: InputMaybe<Array<Badma_Servers_Bool_Exp>>;
  active_at?: InputMaybe<Bigint_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  global_address?: InputMaybe<String_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  local_address?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "badma.servers" */
export enum Badma_Servers_Constraint {
  /** unique or primary key constraint on columns "id" */
  ServersPkey = "servers_pkey",
}

/** input type for incrementing numeric columns in table "badma.servers" */
export type Badma_Servers_Inc_Input = {
  active_at?: InputMaybe<Scalars["bigint"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "badma.servers" */
export type Badma_Servers_Insert_Input = {
  active_at?: InputMaybe<Scalars["bigint"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  global_address?: InputMaybe<Scalars["String"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  local_address?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Badma_Servers_Max_Fields = {
  __typename?: "badma_servers_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  active_at?: Maybe<Scalars["bigint"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  global_address?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  local_address?: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type Badma_Servers_Min_Fields = {
  __typename?: "badma_servers_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  active_at?: Maybe<Scalars["bigint"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  global_address?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  local_address?: Maybe<Scalars["String"]["output"]>;
};

/** response of any mutation on the table "badma.servers" */
export type Badma_Servers_Mutation_Response = {
  __typename?: "badma_servers_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Badma_Servers>;
};

/** input type for inserting object relation for remote table "badma.servers" */
export type Badma_Servers_Obj_Rel_Insert_Input = {
  data: Badma_Servers_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Servers_On_Conflict>;
};

/** on_conflict condition type for table "badma.servers" */
export type Badma_Servers_On_Conflict = {
  constraint: Badma_Servers_Constraint;
  update_columns?: Array<Badma_Servers_Update_Column>;
  where?: InputMaybe<Badma_Servers_Bool_Exp>;
};

/** Ordering options when selecting data from "badma.servers". */
export type Badma_Servers_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  active_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  global_address?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  local_address?: InputMaybe<Order_By>;
};

/** primary key columns input for table: badma.servers */
export type Badma_Servers_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "badma.servers" */
export enum Badma_Servers_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  ActiveAt = "active_at",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  GlobalAddress = "global_address",
  /** column name */
  Id = "id",
  /** column name */
  LocalAddress = "local_address",
}

/** input type for updating data in table "badma.servers" */
export type Badma_Servers_Set_Input = {
  active_at?: InputMaybe<Scalars["bigint"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  global_address?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  local_address?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate stddev on columns */
export type Badma_Servers_Stddev_Fields = {
  __typename?: "badma_servers_stddev_fields";
  active_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Badma_Servers_Stddev_Pop_Fields = {
  __typename?: "badma_servers_stddev_pop_fields";
  active_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Badma_Servers_Stddev_Samp_Fields = {
  __typename?: "badma_servers_stddev_samp_fields";
  active_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "badma_servers" */
export type Badma_Servers_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Badma_Servers_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Badma_Servers_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  active_at?: InputMaybe<Scalars["bigint"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  global_address?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  local_address?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate sum on columns */
export type Badma_Servers_Sum_Fields = {
  __typename?: "badma_servers_sum_fields";
  active_at?: Maybe<Scalars["bigint"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "badma.servers" */
export enum Badma_Servers_Update_Column {
  /** column name */
  ActiveAt = "active_at",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  GlobalAddress = "global_address",
  /** column name */
  Id = "id",
  /** column name */
  LocalAddress = "local_address",
}

export type Badma_Servers_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Badma_Servers_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Badma_Servers_Set_Input>;
  /** filter the rows which have to be updated */
  where: Badma_Servers_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Badma_Servers_Var_Pop_Fields = {
  __typename?: "badma_servers_var_pop_fields";
  active_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Badma_Servers_Var_Samp_Fields = {
  __typename?: "badma_servers_var_samp_fields";
  active_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Badma_Servers_Variance_Fields = {
  __typename?: "badma_servers_variance_fields";
  active_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "badma.settings" */
export type Badma_Settings = {
  __typename?: "badma_settings";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** Ключ настройки (board или pieces) */
  key: Scalars["String"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  /** ID пользователя, чья настройка */
  user_id: Scalars["uuid"]["output"];
  /** Значение настройки */
  value: Scalars["String"]["output"];
};

/** aggregated selection of "badma.settings" */
export type Badma_Settings_Aggregate = {
  __typename?: "badma_settings_aggregate";
  aggregate?: Maybe<Badma_Settings_Aggregate_Fields>;
  nodes: Array<Badma_Settings>;
};

export type Badma_Settings_Aggregate_Bool_Exp = {
  count?: InputMaybe<Badma_Settings_Aggregate_Bool_Exp_Count>;
};

export type Badma_Settings_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Badma_Settings_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Badma_Settings_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "badma.settings" */
export type Badma_Settings_Aggregate_Fields = {
  __typename?: "badma_settings_aggregate_fields";
  avg?: Maybe<Badma_Settings_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Badma_Settings_Max_Fields>;
  min?: Maybe<Badma_Settings_Min_Fields>;
  stddev?: Maybe<Badma_Settings_Stddev_Fields>;
  stddev_pop?: Maybe<Badma_Settings_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Badma_Settings_Stddev_Samp_Fields>;
  sum?: Maybe<Badma_Settings_Sum_Fields>;
  var_pop?: Maybe<Badma_Settings_Var_Pop_Fields>;
  var_samp?: Maybe<Badma_Settings_Var_Samp_Fields>;
  variance?: Maybe<Badma_Settings_Variance_Fields>;
};

/** aggregate fields of "badma.settings" */
export type Badma_Settings_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Badma_Settings_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "badma.settings" */
export type Badma_Settings_Aggregate_Order_By = {
  avg?: InputMaybe<Badma_Settings_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Badma_Settings_Max_Order_By>;
  min?: InputMaybe<Badma_Settings_Min_Order_By>;
  stddev?: InputMaybe<Badma_Settings_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Badma_Settings_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Badma_Settings_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Badma_Settings_Sum_Order_By>;
  var_pop?: InputMaybe<Badma_Settings_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Badma_Settings_Var_Samp_Order_By>;
  variance?: InputMaybe<Badma_Settings_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "badma.settings" */
export type Badma_Settings_Arr_Rel_Insert_Input = {
  data: Array<Badma_Settings_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Settings_On_Conflict>;
};

/** aggregate avg on columns */
export type Badma_Settings_Avg_Fields = {
  __typename?: "badma_settings_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "badma.settings" */
export type Badma_Settings_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "badma.settings". All fields are combined with a logical 'AND'. */
export type Badma_Settings_Bool_Exp = {
  _and?: InputMaybe<Array<Badma_Settings_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Badma_Settings_Bool_Exp>;
  _or?: InputMaybe<Array<Badma_Settings_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  key?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "badma.settings" */
export enum Badma_Settings_Constraint {
  /** unique or primary key constraint on columns "id" */
  SettingsPkey = "settings_pkey",
  /** unique or primary key constraint on columns "user_id", "key" */
  SettingsUserKeyUnique = "settings_user_key_unique",
}

/** input type for incrementing numeric columns in table "badma.settings" */
export type Badma_Settings_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "badma.settings" */
export type Badma_Settings_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Ключ настройки (board или pieces) */
  key?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** ID пользователя, чья настройка */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Значение настройки */
  value?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Badma_Settings_Max_Fields = {
  __typename?: "badma_settings_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Ключ настройки (board или pieces) */
  key?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** ID пользователя, чья настройка */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Значение настройки */
  value?: Maybe<Scalars["String"]["output"]>;
};

/** order by max() on columns of table "badma.settings" */
export type Badma_Settings_Max_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Ключ настройки (board или pieces) */
  key?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** ID пользователя, чья настройка */
  user_id?: InputMaybe<Order_By>;
  /** Значение настройки */
  value?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Badma_Settings_Min_Fields = {
  __typename?: "badma_settings_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Ключ настройки (board или pieces) */
  key?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** ID пользователя, чья настройка */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Значение настройки */
  value?: Maybe<Scalars["String"]["output"]>;
};

/** order by min() on columns of table "badma.settings" */
export type Badma_Settings_Min_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Ключ настройки (board или pieces) */
  key?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** ID пользователя, чья настройка */
  user_id?: InputMaybe<Order_By>;
  /** Значение настройки */
  value?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "badma.settings" */
export type Badma_Settings_Mutation_Response = {
  __typename?: "badma_settings_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Badma_Settings>;
};

/** input type for inserting object relation for remote table "badma.settings" */
export type Badma_Settings_Obj_Rel_Insert_Input = {
  data: Badma_Settings_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Settings_On_Conflict>;
};

/** on_conflict condition type for table "badma.settings" */
export type Badma_Settings_On_Conflict = {
  constraint: Badma_Settings_Constraint;
  update_columns?: Array<Badma_Settings_Update_Column>;
  where?: InputMaybe<Badma_Settings_Bool_Exp>;
};

/** Ordering options when selecting data from "badma.settings". */
export type Badma_Settings_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  key?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: badma.settings */
export type Badma_Settings_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "badma.settings" */
export enum Badma_Settings_Select_Column {
  /** column name */
  HasyxSchemaName = "_hasyx_schema_name",
  /** column name */
  HasyxTableName = "_hasyx_table_name",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Key = "key",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
  /** column name */
  Value = "value",
}

/** input type for updating data in table "badma.settings" */
export type Badma_Settings_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Ключ настройки (board или pieces) */
  key?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** ID пользователя, чья настройка */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Значение настройки */
  value?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate stddev on columns */
export type Badma_Settings_Stddev_Fields = {
  __typename?: "badma_settings_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "badma.settings" */
export type Badma_Settings_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Badma_Settings_Stddev_Pop_Fields = {
  __typename?: "badma_settings_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "badma.settings" */
export type Badma_Settings_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Badma_Settings_Stddev_Samp_Fields = {
  __typename?: "badma_settings_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "badma.settings" */
export type Badma_Settings_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "badma_settings" */
export type Badma_Settings_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Badma_Settings_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Badma_Settings_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Ключ настройки (board или pieces) */
  key?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** ID пользователя, чья настройка */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Значение настройки */
  value?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate sum on columns */
export type Badma_Settings_Sum_Fields = {
  __typename?: "badma_settings_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "badma.settings" */
export type Badma_Settings_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "badma.settings" */
export enum Badma_Settings_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Key = "key",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
  /** column name */
  Value = "value",
}

export type Badma_Settings_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Badma_Settings_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Badma_Settings_Set_Input>;
  /** filter the rows which have to be updated */
  where: Badma_Settings_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Badma_Settings_Var_Pop_Fields = {
  __typename?: "badma_settings_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "badma.settings" */
export type Badma_Settings_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Badma_Settings_Var_Samp_Fields = {
  __typename?: "badma_settings_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "badma.settings" */
export type Badma_Settings_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Badma_Settings_Variance_Fields = {
  __typename?: "badma_settings_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "badma.settings" */
export type Badma_Settings_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "badma.tournament_games" */
export type Badma_Tournament_Games = {
  __typename?: "badma_tournament_games";
  created_at: Scalars["bigint"]["output"];
  /** An object relationship */
  game: Badma_Games;
  game_id: Scalars["uuid"]["output"];
  id: Scalars["uuid"]["output"];
  /** An object relationship */
  tournament: Badma_Tournaments;
  tournament_id: Scalars["uuid"]["output"];
  updated_at: Scalars["bigint"]["output"];
};

/** aggregated selection of "badma.tournament_games" */
export type Badma_Tournament_Games_Aggregate = {
  __typename?: "badma_tournament_games_aggregate";
  aggregate?: Maybe<Badma_Tournament_Games_Aggregate_Fields>;
  nodes: Array<Badma_Tournament_Games>;
};

export type Badma_Tournament_Games_Aggregate_Bool_Exp = {
  count?: InputMaybe<Badma_Tournament_Games_Aggregate_Bool_Exp_Count>;
};

export type Badma_Tournament_Games_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Badma_Tournament_Games_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Badma_Tournament_Games_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "badma.tournament_games" */
export type Badma_Tournament_Games_Aggregate_Fields = {
  __typename?: "badma_tournament_games_aggregate_fields";
  avg?: Maybe<Badma_Tournament_Games_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Badma_Tournament_Games_Max_Fields>;
  min?: Maybe<Badma_Tournament_Games_Min_Fields>;
  stddev?: Maybe<Badma_Tournament_Games_Stddev_Fields>;
  stddev_pop?: Maybe<Badma_Tournament_Games_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Badma_Tournament_Games_Stddev_Samp_Fields>;
  sum?: Maybe<Badma_Tournament_Games_Sum_Fields>;
  var_pop?: Maybe<Badma_Tournament_Games_Var_Pop_Fields>;
  var_samp?: Maybe<Badma_Tournament_Games_Var_Samp_Fields>;
  variance?: Maybe<Badma_Tournament_Games_Variance_Fields>;
};

/** aggregate fields of "badma.tournament_games" */
export type Badma_Tournament_Games_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Badma_Tournament_Games_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "badma.tournament_games" */
export type Badma_Tournament_Games_Aggregate_Order_By = {
  avg?: InputMaybe<Badma_Tournament_Games_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Badma_Tournament_Games_Max_Order_By>;
  min?: InputMaybe<Badma_Tournament_Games_Min_Order_By>;
  stddev?: InputMaybe<Badma_Tournament_Games_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Badma_Tournament_Games_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Badma_Tournament_Games_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Badma_Tournament_Games_Sum_Order_By>;
  var_pop?: InputMaybe<Badma_Tournament_Games_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Badma_Tournament_Games_Var_Samp_Order_By>;
  variance?: InputMaybe<Badma_Tournament_Games_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "badma.tournament_games" */
export type Badma_Tournament_Games_Arr_Rel_Insert_Input = {
  data: Array<Badma_Tournament_Games_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Tournament_Games_On_Conflict>;
};

/** aggregate avg on columns */
export type Badma_Tournament_Games_Avg_Fields = {
  __typename?: "badma_tournament_games_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "badma.tournament_games" */
export type Badma_Tournament_Games_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "badma.tournament_games". All fields are combined with a logical 'AND'. */
export type Badma_Tournament_Games_Bool_Exp = {
  _and?: InputMaybe<Array<Badma_Tournament_Games_Bool_Exp>>;
  _not?: InputMaybe<Badma_Tournament_Games_Bool_Exp>;
  _or?: InputMaybe<Array<Badma_Tournament_Games_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  game?: InputMaybe<Badma_Games_Bool_Exp>;
  game_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  tournament?: InputMaybe<Badma_Tournaments_Bool_Exp>;
  tournament_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
};

/** unique or primary key constraints on table "badma.tournament_games" */
export enum Badma_Tournament_Games_Constraint {
  /** unique or primary key constraint on columns "tournament_id", "game_id" */
  TournamentGamesGameIdTournamentIdKey = "tournament_games_game_id_tournament_id_key",
  /** unique or primary key constraint on columns "id" */
  TournamentGamesPkey = "tournament_games_pkey",
}

/** input type for incrementing numeric columns in table "badma.tournament_games" */
export type Badma_Tournament_Games_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "badma.tournament_games" */
export type Badma_Tournament_Games_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  game?: InputMaybe<Badma_Games_Obj_Rel_Insert_Input>;
  game_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  tournament?: InputMaybe<Badma_Tournaments_Obj_Rel_Insert_Input>;
  tournament_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate max on columns */
export type Badma_Tournament_Games_Max_Fields = {
  __typename?: "badma_tournament_games_max_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  game_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  tournament_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by max() on columns of table "badma.tournament_games" */
export type Badma_Tournament_Games_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  game_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  tournament_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Badma_Tournament_Games_Min_Fields = {
  __typename?: "badma_tournament_games_min_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  game_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  tournament_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by min() on columns of table "badma.tournament_games" */
export type Badma_Tournament_Games_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  game_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  tournament_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "badma.tournament_games" */
export type Badma_Tournament_Games_Mutation_Response = {
  __typename?: "badma_tournament_games_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Badma_Tournament_Games>;
};

/** on_conflict condition type for table "badma.tournament_games" */
export type Badma_Tournament_Games_On_Conflict = {
  constraint: Badma_Tournament_Games_Constraint;
  update_columns?: Array<Badma_Tournament_Games_Update_Column>;
  where?: InputMaybe<Badma_Tournament_Games_Bool_Exp>;
};

/** Ordering options when selecting data from "badma.tournament_games". */
export type Badma_Tournament_Games_Order_By = {
  created_at?: InputMaybe<Order_By>;
  game?: InputMaybe<Badma_Games_Order_By>;
  game_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  tournament?: InputMaybe<Badma_Tournaments_Order_By>;
  tournament_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: badma.tournament_games */
export type Badma_Tournament_Games_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "badma.tournament_games" */
export enum Badma_Tournament_Games_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  GameId = "game_id",
  /** column name */
  Id = "id",
  /** column name */
  TournamentId = "tournament_id",
  /** column name */
  UpdatedAt = "updated_at",
}

/** input type for updating data in table "badma.tournament_games" */
export type Badma_Tournament_Games_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  game_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  tournament_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate stddev on columns */
export type Badma_Tournament_Games_Stddev_Fields = {
  __typename?: "badma_tournament_games_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "badma.tournament_games" */
export type Badma_Tournament_Games_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Badma_Tournament_Games_Stddev_Pop_Fields = {
  __typename?: "badma_tournament_games_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "badma.tournament_games" */
export type Badma_Tournament_Games_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Badma_Tournament_Games_Stddev_Samp_Fields = {
  __typename?: "badma_tournament_games_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "badma.tournament_games" */
export type Badma_Tournament_Games_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "badma_tournament_games" */
export type Badma_Tournament_Games_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Badma_Tournament_Games_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Badma_Tournament_Games_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  game_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  tournament_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate sum on columns */
export type Badma_Tournament_Games_Sum_Fields = {
  __typename?: "badma_tournament_games_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "badma.tournament_games" */
export type Badma_Tournament_Games_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "badma.tournament_games" */
export enum Badma_Tournament_Games_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  GameId = "game_id",
  /** column name */
  Id = "id",
  /** column name */
  TournamentId = "tournament_id",
  /** column name */
  UpdatedAt = "updated_at",
}

export type Badma_Tournament_Games_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Badma_Tournament_Games_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Badma_Tournament_Games_Set_Input>;
  /** filter the rows which have to be updated */
  where: Badma_Tournament_Games_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Badma_Tournament_Games_Var_Pop_Fields = {
  __typename?: "badma_tournament_games_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "badma.tournament_games" */
export type Badma_Tournament_Games_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Badma_Tournament_Games_Var_Samp_Fields = {
  __typename?: "badma_tournament_games_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "badma.tournament_games" */
export type Badma_Tournament_Games_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Badma_Tournament_Games_Variance_Fields = {
  __typename?: "badma_tournament_games_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "badma.tournament_games" */
export type Badma_Tournament_Games_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "badma.tournament_participants" */
export type Badma_Tournament_Participants = {
  __typename?: "badma_tournament_participants";
  created_at: Scalars["bigint"]["output"];
  id: Scalars["uuid"]["output"];
  /** 1 for join, 0 for leave */
  role: Scalars["Int"]["output"];
  /** An array relationship */
  scores: Array<Badma_Tournament_Scores>;
  /** An aggregate relationship */
  scores_aggregate: Badma_Tournament_Scores_Aggregate;
  /** An object relationship */
  tournament: Badma_Tournaments;
  tournament_id: Scalars["uuid"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "badma.tournament_participants" */
export type Badma_Tournament_ParticipantsScoresArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournament_Scores_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournament_Scores_Order_By>>;
  where?: InputMaybe<Badma_Tournament_Scores_Bool_Exp>;
};

/** columns and relationships of "badma.tournament_participants" */
export type Badma_Tournament_ParticipantsScores_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournament_Scores_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournament_Scores_Order_By>>;
  where?: InputMaybe<Badma_Tournament_Scores_Bool_Exp>;
};

/** aggregated selection of "badma.tournament_participants" */
export type Badma_Tournament_Participants_Aggregate = {
  __typename?: "badma_tournament_participants_aggregate";
  aggregate?: Maybe<Badma_Tournament_Participants_Aggregate_Fields>;
  nodes: Array<Badma_Tournament_Participants>;
};

export type Badma_Tournament_Participants_Aggregate_Bool_Exp = {
  count?: InputMaybe<Badma_Tournament_Participants_Aggregate_Bool_Exp_Count>;
};

export type Badma_Tournament_Participants_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Badma_Tournament_Participants_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Badma_Tournament_Participants_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "badma.tournament_participants" */
export type Badma_Tournament_Participants_Aggregate_Fields = {
  __typename?: "badma_tournament_participants_aggregate_fields";
  avg?: Maybe<Badma_Tournament_Participants_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Badma_Tournament_Participants_Max_Fields>;
  min?: Maybe<Badma_Tournament_Participants_Min_Fields>;
  stddev?: Maybe<Badma_Tournament_Participants_Stddev_Fields>;
  stddev_pop?: Maybe<Badma_Tournament_Participants_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Badma_Tournament_Participants_Stddev_Samp_Fields>;
  sum?: Maybe<Badma_Tournament_Participants_Sum_Fields>;
  var_pop?: Maybe<Badma_Tournament_Participants_Var_Pop_Fields>;
  var_samp?: Maybe<Badma_Tournament_Participants_Var_Samp_Fields>;
  variance?: Maybe<Badma_Tournament_Participants_Variance_Fields>;
};

/** aggregate fields of "badma.tournament_participants" */
export type Badma_Tournament_Participants_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Badma_Tournament_Participants_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "badma.tournament_participants" */
export type Badma_Tournament_Participants_Aggregate_Order_By = {
  avg?: InputMaybe<Badma_Tournament_Participants_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Badma_Tournament_Participants_Max_Order_By>;
  min?: InputMaybe<Badma_Tournament_Participants_Min_Order_By>;
  stddev?: InputMaybe<Badma_Tournament_Participants_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Badma_Tournament_Participants_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Badma_Tournament_Participants_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Badma_Tournament_Participants_Sum_Order_By>;
  var_pop?: InputMaybe<Badma_Tournament_Participants_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Badma_Tournament_Participants_Var_Samp_Order_By>;
  variance?: InputMaybe<Badma_Tournament_Participants_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "badma.tournament_participants" */
export type Badma_Tournament_Participants_Arr_Rel_Insert_Input = {
  data: Array<Badma_Tournament_Participants_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Tournament_Participants_On_Conflict>;
};

/** aggregate avg on columns */
export type Badma_Tournament_Participants_Avg_Fields = {
  __typename?: "badma_tournament_participants_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** 1 for join, 0 for leave */
  role?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "badma.tournament_participants" */
export type Badma_Tournament_Participants_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** 1 for join, 0 for leave */
  role?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "badma.tournament_participants". All fields are combined with a logical 'AND'. */
export type Badma_Tournament_Participants_Bool_Exp = {
  _and?: InputMaybe<Array<Badma_Tournament_Participants_Bool_Exp>>;
  _not?: InputMaybe<Badma_Tournament_Participants_Bool_Exp>;
  _or?: InputMaybe<Array<Badma_Tournament_Participants_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<Int_Comparison_Exp>;
  scores?: InputMaybe<Badma_Tournament_Scores_Bool_Exp>;
  scores_aggregate?: InputMaybe<Badma_Tournament_Scores_Aggregate_Bool_Exp>;
  tournament?: InputMaybe<Badma_Tournaments_Bool_Exp>;
  tournament_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "badma.tournament_participants" */
export enum Badma_Tournament_Participants_Constraint {
  /** unique or primary key constraint on columns "id" */
  TournamentParticipantsPkey = "tournament_participants_pkey",
}

/** input type for incrementing numeric columns in table "badma.tournament_participants" */
export type Badma_Tournament_Participants_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** 1 for join, 0 for leave */
  role?: InputMaybe<Scalars["Int"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "badma.tournament_participants" */
export type Badma_Tournament_Participants_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** 1 for join, 0 for leave */
  role?: InputMaybe<Scalars["Int"]["input"]>;
  scores?: InputMaybe<Badma_Tournament_Scores_Arr_Rel_Insert_Input>;
  tournament?: InputMaybe<Badma_Tournaments_Obj_Rel_Insert_Input>;
  tournament_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Badma_Tournament_Participants_Max_Fields = {
  __typename?: "badma_tournament_participants_max_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** 1 for join, 0 for leave */
  role?: Maybe<Scalars["Int"]["output"]>;
  tournament_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "badma.tournament_participants" */
export type Badma_Tournament_Participants_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 1 for join, 0 for leave */
  role?: InputMaybe<Order_By>;
  tournament_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Badma_Tournament_Participants_Min_Fields = {
  __typename?: "badma_tournament_participants_min_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** 1 for join, 0 for leave */
  role?: Maybe<Scalars["Int"]["output"]>;
  tournament_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "badma.tournament_participants" */
export type Badma_Tournament_Participants_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** 1 for join, 0 for leave */
  role?: InputMaybe<Order_By>;
  tournament_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "badma.tournament_participants" */
export type Badma_Tournament_Participants_Mutation_Response = {
  __typename?: "badma_tournament_participants_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Badma_Tournament_Participants>;
};

/** input type for inserting object relation for remote table "badma.tournament_participants" */
export type Badma_Tournament_Participants_Obj_Rel_Insert_Input = {
  data: Badma_Tournament_Participants_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Tournament_Participants_On_Conflict>;
};

/** on_conflict condition type for table "badma.tournament_participants" */
export type Badma_Tournament_Participants_On_Conflict = {
  constraint: Badma_Tournament_Participants_Constraint;
  update_columns?: Array<Badma_Tournament_Participants_Update_Column>;
  where?: InputMaybe<Badma_Tournament_Participants_Bool_Exp>;
};

/** Ordering options when selecting data from "badma.tournament_participants". */
export type Badma_Tournament_Participants_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  scores_aggregate?: InputMaybe<Badma_Tournament_Scores_Aggregate_Order_By>;
  tournament?: InputMaybe<Badma_Tournaments_Order_By>;
  tournament_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: badma.tournament_participants */
export type Badma_Tournament_Participants_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "badma.tournament_participants" */
export enum Badma_Tournament_Participants_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Role = "role",
  /** column name */
  TournamentId = "tournament_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "badma.tournament_participants" */
export type Badma_Tournament_Participants_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** 1 for join, 0 for leave */
  role?: InputMaybe<Scalars["Int"]["input"]>;
  tournament_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Badma_Tournament_Participants_Stddev_Fields = {
  __typename?: "badma_tournament_participants_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** 1 for join, 0 for leave */
  role?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "badma.tournament_participants" */
export type Badma_Tournament_Participants_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** 1 for join, 0 for leave */
  role?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Badma_Tournament_Participants_Stddev_Pop_Fields = {
  __typename?: "badma_tournament_participants_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** 1 for join, 0 for leave */
  role?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "badma.tournament_participants" */
export type Badma_Tournament_Participants_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** 1 for join, 0 for leave */
  role?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Badma_Tournament_Participants_Stddev_Samp_Fields = {
  __typename?: "badma_tournament_participants_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** 1 for join, 0 for leave */
  role?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "badma.tournament_participants" */
export type Badma_Tournament_Participants_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** 1 for join, 0 for leave */
  role?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "badma_tournament_participants" */
export type Badma_Tournament_Participants_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Badma_Tournament_Participants_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Badma_Tournament_Participants_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** 1 for join, 0 for leave */
  role?: InputMaybe<Scalars["Int"]["input"]>;
  tournament_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Badma_Tournament_Participants_Sum_Fields = {
  __typename?: "badma_tournament_participants_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** 1 for join, 0 for leave */
  role?: Maybe<Scalars["Int"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "badma.tournament_participants" */
export type Badma_Tournament_Participants_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** 1 for join, 0 for leave */
  role?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "badma.tournament_participants" */
export enum Badma_Tournament_Participants_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Role = "role",
  /** column name */
  TournamentId = "tournament_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Badma_Tournament_Participants_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Badma_Tournament_Participants_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Badma_Tournament_Participants_Set_Input>;
  /** filter the rows which have to be updated */
  where: Badma_Tournament_Participants_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Badma_Tournament_Participants_Var_Pop_Fields = {
  __typename?: "badma_tournament_participants_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** 1 for join, 0 for leave */
  role?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "badma.tournament_participants" */
export type Badma_Tournament_Participants_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** 1 for join, 0 for leave */
  role?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Badma_Tournament_Participants_Var_Samp_Fields = {
  __typename?: "badma_tournament_participants_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** 1 for join, 0 for leave */
  role?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "badma.tournament_participants" */
export type Badma_Tournament_Participants_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** 1 for join, 0 for leave */
  role?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Badma_Tournament_Participants_Variance_Fields = {
  __typename?: "badma_tournament_participants_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** 1 for join, 0 for leave */
  role?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "badma.tournament_participants" */
export type Badma_Tournament_Participants_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** 1 for join, 0 for leave */
  role?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "badma.tournament_scores" */
export type Badma_Tournament_Scores = {
  __typename?: "badma_tournament_scores";
  created_at: Scalars["bigint"]["output"];
  /** An object relationship */
  game: Badma_Games;
  game_id: Scalars["uuid"]["output"];
  id: Scalars["uuid"]["output"];
  score: Scalars["numeric"]["output"];
  tournament_participant_id: Scalars["uuid"]["output"];
  /** An object relationship */
  tournament_participation: Badma_Tournament_Participants;
  updated_at: Scalars["bigint"]["output"];
};

/** aggregated selection of "badma.tournament_scores" */
export type Badma_Tournament_Scores_Aggregate = {
  __typename?: "badma_tournament_scores_aggregate";
  aggregate?: Maybe<Badma_Tournament_Scores_Aggregate_Fields>;
  nodes: Array<Badma_Tournament_Scores>;
};

export type Badma_Tournament_Scores_Aggregate_Bool_Exp = {
  count?: InputMaybe<Badma_Tournament_Scores_Aggregate_Bool_Exp_Count>;
};

export type Badma_Tournament_Scores_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Badma_Tournament_Scores_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Badma_Tournament_Scores_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "badma.tournament_scores" */
export type Badma_Tournament_Scores_Aggregate_Fields = {
  __typename?: "badma_tournament_scores_aggregate_fields";
  avg?: Maybe<Badma_Tournament_Scores_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Badma_Tournament_Scores_Max_Fields>;
  min?: Maybe<Badma_Tournament_Scores_Min_Fields>;
  stddev?: Maybe<Badma_Tournament_Scores_Stddev_Fields>;
  stddev_pop?: Maybe<Badma_Tournament_Scores_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Badma_Tournament_Scores_Stddev_Samp_Fields>;
  sum?: Maybe<Badma_Tournament_Scores_Sum_Fields>;
  var_pop?: Maybe<Badma_Tournament_Scores_Var_Pop_Fields>;
  var_samp?: Maybe<Badma_Tournament_Scores_Var_Samp_Fields>;
  variance?: Maybe<Badma_Tournament_Scores_Variance_Fields>;
};

/** aggregate fields of "badma.tournament_scores" */
export type Badma_Tournament_Scores_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Badma_Tournament_Scores_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "badma.tournament_scores" */
export type Badma_Tournament_Scores_Aggregate_Order_By = {
  avg?: InputMaybe<Badma_Tournament_Scores_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Badma_Tournament_Scores_Max_Order_By>;
  min?: InputMaybe<Badma_Tournament_Scores_Min_Order_By>;
  stddev?: InputMaybe<Badma_Tournament_Scores_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Badma_Tournament_Scores_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Badma_Tournament_Scores_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Badma_Tournament_Scores_Sum_Order_By>;
  var_pop?: InputMaybe<Badma_Tournament_Scores_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Badma_Tournament_Scores_Var_Samp_Order_By>;
  variance?: InputMaybe<Badma_Tournament_Scores_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "badma.tournament_scores" */
export type Badma_Tournament_Scores_Arr_Rel_Insert_Input = {
  data: Array<Badma_Tournament_Scores_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Tournament_Scores_On_Conflict>;
};

/** aggregate avg on columns */
export type Badma_Tournament_Scores_Avg_Fields = {
  __typename?: "badma_tournament_scores_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  score?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "badma.tournament_scores" */
export type Badma_Tournament_Scores_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "badma.tournament_scores". All fields are combined with a logical 'AND'. */
export type Badma_Tournament_Scores_Bool_Exp = {
  _and?: InputMaybe<Array<Badma_Tournament_Scores_Bool_Exp>>;
  _not?: InputMaybe<Badma_Tournament_Scores_Bool_Exp>;
  _or?: InputMaybe<Array<Badma_Tournament_Scores_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  game?: InputMaybe<Badma_Games_Bool_Exp>;
  game_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  score?: InputMaybe<Numeric_Comparison_Exp>;
  tournament_participant_id?: InputMaybe<Uuid_Comparison_Exp>;
  tournament_participation?: InputMaybe<Badma_Tournament_Participants_Bool_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
};

/** unique or primary key constraints on table "badma.tournament_scores" */
export enum Badma_Tournament_Scores_Constraint {
  /** unique or primary key constraint on columns "id" */
  TournamentScoresPkey = "tournament_scores_pkey",
}

/** input type for incrementing numeric columns in table "badma.tournament_scores" */
export type Badma_Tournament_Scores_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  score?: InputMaybe<Scalars["numeric"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "badma.tournament_scores" */
export type Badma_Tournament_Scores_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  game?: InputMaybe<Badma_Games_Obj_Rel_Insert_Input>;
  game_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  score?: InputMaybe<Scalars["numeric"]["input"]>;
  tournament_participant_id?: InputMaybe<Scalars["uuid"]["input"]>;
  tournament_participation?: InputMaybe<Badma_Tournament_Participants_Obj_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate max on columns */
export type Badma_Tournament_Scores_Max_Fields = {
  __typename?: "badma_tournament_scores_max_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  game_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  score?: Maybe<Scalars["numeric"]["output"]>;
  tournament_participant_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by max() on columns of table "badma.tournament_scores" */
export type Badma_Tournament_Scores_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  game_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
  tournament_participant_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Badma_Tournament_Scores_Min_Fields = {
  __typename?: "badma_tournament_scores_min_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  game_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  score?: Maybe<Scalars["numeric"]["output"]>;
  tournament_participant_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by min() on columns of table "badma.tournament_scores" */
export type Badma_Tournament_Scores_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  game_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
  tournament_participant_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "badma.tournament_scores" */
export type Badma_Tournament_Scores_Mutation_Response = {
  __typename?: "badma_tournament_scores_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Badma_Tournament_Scores>;
};

/** on_conflict condition type for table "badma.tournament_scores" */
export type Badma_Tournament_Scores_On_Conflict = {
  constraint: Badma_Tournament_Scores_Constraint;
  update_columns?: Array<Badma_Tournament_Scores_Update_Column>;
  where?: InputMaybe<Badma_Tournament_Scores_Bool_Exp>;
};

/** Ordering options when selecting data from "badma.tournament_scores". */
export type Badma_Tournament_Scores_Order_By = {
  created_at?: InputMaybe<Order_By>;
  game?: InputMaybe<Badma_Games_Order_By>;
  game_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
  tournament_participant_id?: InputMaybe<Order_By>;
  tournament_participation?: InputMaybe<Badma_Tournament_Participants_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: badma.tournament_scores */
export type Badma_Tournament_Scores_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "badma.tournament_scores" */
export enum Badma_Tournament_Scores_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  GameId = "game_id",
  /** column name */
  Id = "id",
  /** column name */
  Score = "score",
  /** column name */
  TournamentParticipantId = "tournament_participant_id",
  /** column name */
  UpdatedAt = "updated_at",
}

/** input type for updating data in table "badma.tournament_scores" */
export type Badma_Tournament_Scores_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  game_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  score?: InputMaybe<Scalars["numeric"]["input"]>;
  tournament_participant_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate stddev on columns */
export type Badma_Tournament_Scores_Stddev_Fields = {
  __typename?: "badma_tournament_scores_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  score?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "badma.tournament_scores" */
export type Badma_Tournament_Scores_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Badma_Tournament_Scores_Stddev_Pop_Fields = {
  __typename?: "badma_tournament_scores_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  score?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "badma.tournament_scores" */
export type Badma_Tournament_Scores_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Badma_Tournament_Scores_Stddev_Samp_Fields = {
  __typename?: "badma_tournament_scores_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  score?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "badma.tournament_scores" */
export type Badma_Tournament_Scores_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "badma_tournament_scores" */
export type Badma_Tournament_Scores_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Badma_Tournament_Scores_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Badma_Tournament_Scores_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  game_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  score?: InputMaybe<Scalars["numeric"]["input"]>;
  tournament_participant_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate sum on columns */
export type Badma_Tournament_Scores_Sum_Fields = {
  __typename?: "badma_tournament_scores_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  score?: Maybe<Scalars["numeric"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "badma.tournament_scores" */
export type Badma_Tournament_Scores_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "badma.tournament_scores" */
export enum Badma_Tournament_Scores_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  GameId = "game_id",
  /** column name */
  Id = "id",
  /** column name */
  Score = "score",
  /** column name */
  TournamentParticipantId = "tournament_participant_id",
  /** column name */
  UpdatedAt = "updated_at",
}

export type Badma_Tournament_Scores_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Badma_Tournament_Scores_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Badma_Tournament_Scores_Set_Input>;
  /** filter the rows which have to be updated */
  where: Badma_Tournament_Scores_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Badma_Tournament_Scores_Var_Pop_Fields = {
  __typename?: "badma_tournament_scores_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  score?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "badma.tournament_scores" */
export type Badma_Tournament_Scores_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Badma_Tournament_Scores_Var_Samp_Fields = {
  __typename?: "badma_tournament_scores_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  score?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "badma.tournament_scores" */
export type Badma_Tournament_Scores_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Badma_Tournament_Scores_Variance_Fields = {
  __typename?: "badma_tournament_scores_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  score?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "badma.tournament_scores" */
export type Badma_Tournament_Scores_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "badma.tournaments" */
export type Badma_Tournaments = {
  __typename?: "badma_tournaments";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** Tournament-specific metadata (e.g., current round for Swiss, bracket for Knockout) */
  metadata?: Maybe<Scalars["jsonb"]["output"]>;
  /** An array relationship */
  participants: Array<Badma_Tournament_Participants>;
  /** An aggregate relationship */
  participants_aggregate: Badma_Tournament_Participants_Aggregate;
  status: Scalars["String"]["output"];
  /** An array relationship */
  tournament_games: Array<Badma_Tournament_Games>;
  /** An aggregate relationship */
  tournament_games_aggregate: Badma_Tournament_Games_Aggregate;
  type: Scalars["String"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "badma.tournaments" */
export type Badma_TournamentsMetadataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "badma.tournaments" */
export type Badma_TournamentsParticipantsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournament_Participants_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournament_Participants_Order_By>>;
  where?: InputMaybe<Badma_Tournament_Participants_Bool_Exp>;
};

/** columns and relationships of "badma.tournaments" */
export type Badma_TournamentsParticipants_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournament_Participants_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournament_Participants_Order_By>>;
  where?: InputMaybe<Badma_Tournament_Participants_Bool_Exp>;
};

/** columns and relationships of "badma.tournaments" */
export type Badma_TournamentsTournament_GamesArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournament_Games_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournament_Games_Order_By>>;
  where?: InputMaybe<Badma_Tournament_Games_Bool_Exp>;
};

/** columns and relationships of "badma.tournaments" */
export type Badma_TournamentsTournament_Games_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournament_Games_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournament_Games_Order_By>>;
  where?: InputMaybe<Badma_Tournament_Games_Bool_Exp>;
};

/** aggregated selection of "badma.tournaments" */
export type Badma_Tournaments_Aggregate = {
  __typename?: "badma_tournaments_aggregate";
  aggregate?: Maybe<Badma_Tournaments_Aggregate_Fields>;
  nodes: Array<Badma_Tournaments>;
};

export type Badma_Tournaments_Aggregate_Bool_Exp = {
  count?: InputMaybe<Badma_Tournaments_Aggregate_Bool_Exp_Count>;
};

export type Badma_Tournaments_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Badma_Tournaments_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Badma_Tournaments_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "badma.tournaments" */
export type Badma_Tournaments_Aggregate_Fields = {
  __typename?: "badma_tournaments_aggregate_fields";
  avg?: Maybe<Badma_Tournaments_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Badma_Tournaments_Max_Fields>;
  min?: Maybe<Badma_Tournaments_Min_Fields>;
  stddev?: Maybe<Badma_Tournaments_Stddev_Fields>;
  stddev_pop?: Maybe<Badma_Tournaments_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Badma_Tournaments_Stddev_Samp_Fields>;
  sum?: Maybe<Badma_Tournaments_Sum_Fields>;
  var_pop?: Maybe<Badma_Tournaments_Var_Pop_Fields>;
  var_samp?: Maybe<Badma_Tournaments_Var_Samp_Fields>;
  variance?: Maybe<Badma_Tournaments_Variance_Fields>;
};

/** aggregate fields of "badma.tournaments" */
export type Badma_Tournaments_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Badma_Tournaments_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "badma.tournaments" */
export type Badma_Tournaments_Aggregate_Order_By = {
  avg?: InputMaybe<Badma_Tournaments_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Badma_Tournaments_Max_Order_By>;
  min?: InputMaybe<Badma_Tournaments_Min_Order_By>;
  stddev?: InputMaybe<Badma_Tournaments_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Badma_Tournaments_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Badma_Tournaments_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Badma_Tournaments_Sum_Order_By>;
  var_pop?: InputMaybe<Badma_Tournaments_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Badma_Tournaments_Var_Samp_Order_By>;
  variance?: InputMaybe<Badma_Tournaments_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Badma_Tournaments_Append_Input = {
  /** Tournament-specific metadata (e.g., current round for Swiss, bracket for Knockout) */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "badma.tournaments" */
export type Badma_Tournaments_Arr_Rel_Insert_Input = {
  data: Array<Badma_Tournaments_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Tournaments_On_Conflict>;
};

/** aggregate avg on columns */
export type Badma_Tournaments_Avg_Fields = {
  __typename?: "badma_tournaments_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "badma.tournaments" */
export type Badma_Tournaments_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "badma.tournaments". All fields are combined with a logical 'AND'. */
export type Badma_Tournaments_Bool_Exp = {
  _and?: InputMaybe<Array<Badma_Tournaments_Bool_Exp>>;
  _hasyx_schema_name?: InputMaybe<String_Comparison_Exp>;
  _hasyx_table_name?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Badma_Tournaments_Bool_Exp>;
  _or?: InputMaybe<Array<Badma_Tournaments_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  participants?: InputMaybe<Badma_Tournament_Participants_Bool_Exp>;
  participants_aggregate?: InputMaybe<Badma_Tournament_Participants_Aggregate_Bool_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  tournament_games?: InputMaybe<Badma_Tournament_Games_Bool_Exp>;
  tournament_games_aggregate?: InputMaybe<Badma_Tournament_Games_Aggregate_Bool_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "badma.tournaments" */
export enum Badma_Tournaments_Constraint {
  /** unique or primary key constraint on columns "id" */
  TournamentsPkey = "tournaments_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Badma_Tournaments_Delete_At_Path_Input = {
  /** Tournament-specific metadata (e.g., current round for Swiss, bracket for Knockout) */
  metadata?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Badma_Tournaments_Delete_Elem_Input = {
  /** Tournament-specific metadata (e.g., current round for Swiss, bracket for Knockout) */
  metadata?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Badma_Tournaments_Delete_Key_Input = {
  /** Tournament-specific metadata (e.g., current round for Swiss, bracket for Knockout) */
  metadata?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "badma.tournaments" */
export type Badma_Tournaments_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "badma.tournaments" */
export type Badma_Tournaments_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Tournament-specific metadata (e.g., current round for Swiss, bracket for Knockout) */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  participants?: InputMaybe<Badma_Tournament_Participants_Arr_Rel_Insert_Input>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  tournament_games?: InputMaybe<Badma_Tournament_Games_Arr_Rel_Insert_Input>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Badma_Tournaments_Max_Fields = {
  __typename?: "badma_tournaments_max_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "badma.tournaments" */
export type Badma_Tournaments_Max_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Badma_Tournaments_Min_Fields = {
  __typename?: "badma_tournaments_min_fields";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "badma.tournaments" */
export type Badma_Tournaments_Min_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "badma.tournaments" */
export type Badma_Tournaments_Mutation_Response = {
  __typename?: "badma_tournaments_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Badma_Tournaments>;
};

/** input type for inserting object relation for remote table "badma.tournaments" */
export type Badma_Tournaments_Obj_Rel_Insert_Input = {
  data: Badma_Tournaments_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Badma_Tournaments_On_Conflict>;
};

/** on_conflict condition type for table "badma.tournaments" */
export type Badma_Tournaments_On_Conflict = {
  constraint: Badma_Tournaments_Constraint;
  update_columns?: Array<Badma_Tournaments_Update_Column>;
  where?: InputMaybe<Badma_Tournaments_Bool_Exp>;
};

/** Ordering options when selecting data from "badma.tournaments". */
export type Badma_Tournaments_Order_By = {
  _hasyx_schema_name?: InputMaybe<Order_By>;
  _hasyx_table_name?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  participants_aggregate?: InputMaybe<Badma_Tournament_Participants_Aggregate_Order_By>;
  status?: InputMaybe<Order_By>;
  tournament_games_aggregate?: InputMaybe<Badma_Tournament_Games_Aggregate_Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: badma.tournaments */
export type Badma_Tournaments_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Badma_Tournaments_Prepend_Input = {
  /** Tournament-specific metadata (e.g., current round for Swiss, bracket for Knockout) */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "badma.tournaments" */
export enum Badma_Tournaments_Select_Column {
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
  Status = "status",
  /** column name */
  Type = "type",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "badma.tournaments" */
export type Badma_Tournaments_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Tournament-specific metadata (e.g., current round for Swiss, bracket for Knockout) */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Badma_Tournaments_Stddev_Fields = {
  __typename?: "badma_tournaments_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "badma.tournaments" */
export type Badma_Tournaments_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Badma_Tournaments_Stddev_Pop_Fields = {
  __typename?: "badma_tournaments_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "badma.tournaments" */
export type Badma_Tournaments_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Badma_Tournaments_Stddev_Samp_Fields = {
  __typename?: "badma_tournaments_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "badma.tournaments" */
export type Badma_Tournaments_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "badma_tournaments" */
export type Badma_Tournaments_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Badma_Tournaments_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Badma_Tournaments_Stream_Cursor_Value_Input = {
  _hasyx_schema_name?: InputMaybe<Scalars["String"]["input"]>;
  _hasyx_table_name?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Tournament-specific metadata (e.g., current round for Swiss, bracket for Knockout) */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Badma_Tournaments_Sum_Fields = {
  __typename?: "badma_tournaments_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "badma.tournaments" */
export type Badma_Tournaments_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "badma.tournaments" */
export enum Badma_Tournaments_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Metadata = "metadata",
  /** column name */
  Status = "status",
  /** column name */
  Type = "type",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Badma_Tournaments_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Badma_Tournaments_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Badma_Tournaments_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Badma_Tournaments_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Badma_Tournaments_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Badma_Tournaments_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Badma_Tournaments_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Badma_Tournaments_Set_Input>;
  /** filter the rows which have to be updated */
  where: Badma_Tournaments_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Badma_Tournaments_Var_Pop_Fields = {
  __typename?: "badma_tournaments_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "badma.tournaments" */
export type Badma_Tournaments_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Badma_Tournaments_Var_Samp_Fields = {
  __typename?: "badma_tournaments_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "badma.tournaments" */
export type Badma_Tournaments_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Badma_Tournaments_Variance_Fields = {
  __typename?: "badma_tournaments_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "badma.tournaments" */
export type Badma_Tournaments_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
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

/** columns and relationships of "hasyx" */
export type Hasyx = {
  __typename?: "hasyx";
  /** An object relationship */
  badma_ais?: Maybe<Badma_Ais>;
  /** An object relationship */
  badma_clubs?: Maybe<Badma_Clubs>;
  /** An object relationship */
  badma_errors?: Maybe<Badma_Errors>;
  /** An object relationship */
  badma_games?: Maybe<Badma_Games>;
  /** An object relationship */
  badma_items?: Maybe<Badma_Items>;
  /** An object relationship */
  badma_joins?: Maybe<Badma_Joins>;
  /** An object relationship */
  badma_moves?: Maybe<Badma_Moves>;
  /** An object relationship */
  badma_servers?: Maybe<Badma_Servers>;
  /** An object relationship */
  badma_settings?: Maybe<Badma_Settings>;
  /** An object relationship */
  badma_tournaments?: Maybe<Badma_Tournaments>;
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
  public_notifications?: Maybe<Notifications>;
  /** An object relationship */
  public_users?: Maybe<Users>;
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
  badma_ais?: InputMaybe<Badma_Ais_Bool_Exp>;
  badma_clubs?: InputMaybe<Badma_Clubs_Bool_Exp>;
  badma_errors?: InputMaybe<Badma_Errors_Bool_Exp>;
  badma_games?: InputMaybe<Badma_Games_Bool_Exp>;
  badma_items?: InputMaybe<Badma_Items_Bool_Exp>;
  badma_joins?: InputMaybe<Badma_Joins_Bool_Exp>;
  badma_moves?: InputMaybe<Badma_Moves_Bool_Exp>;
  badma_servers?: InputMaybe<Badma_Servers_Bool_Exp>;
  badma_settings?: InputMaybe<Badma_Settings_Bool_Exp>;
  badma_tournaments?: InputMaybe<Badma_Tournaments_Bool_Exp>;
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
  public_notifications?: InputMaybe<Notifications_Bool_Exp>;
  public_users?: InputMaybe<Users_Bool_Exp>;
  schema?: InputMaybe<String_Comparison_Exp>;
  table?: InputMaybe<String_Comparison_Exp>;
};

/** input type for inserting data into table "hasyx" */
export type Hasyx_Insert_Input = {
  badma_ais?: InputMaybe<Badma_Ais_Obj_Rel_Insert_Input>;
  badma_clubs?: InputMaybe<Badma_Clubs_Obj_Rel_Insert_Input>;
  badma_errors?: InputMaybe<Badma_Errors_Obj_Rel_Insert_Input>;
  badma_games?: InputMaybe<Badma_Games_Obj_Rel_Insert_Input>;
  badma_items?: InputMaybe<Badma_Items_Obj_Rel_Insert_Input>;
  badma_joins?: InputMaybe<Badma_Joins_Obj_Rel_Insert_Input>;
  badma_moves?: InputMaybe<Badma_Moves_Obj_Rel_Insert_Input>;
  badma_servers?: InputMaybe<Badma_Servers_Obj_Rel_Insert_Input>;
  badma_settings?: InputMaybe<Badma_Settings_Obj_Rel_Insert_Input>;
  badma_tournaments?: InputMaybe<Badma_Tournaments_Obj_Rel_Insert_Input>;
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
  public_notifications?: InputMaybe<Notifications_Obj_Rel_Insert_Input>;
  public_users?: InputMaybe<Users_Obj_Rel_Insert_Input>;
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
  badma_ais?: InputMaybe<Badma_Ais_Order_By>;
  badma_clubs?: InputMaybe<Badma_Clubs_Order_By>;
  badma_errors?: InputMaybe<Badma_Errors_Order_By>;
  badma_games?: InputMaybe<Badma_Games_Order_By>;
  badma_items?: InputMaybe<Badma_Items_Order_By>;
  badma_joins?: InputMaybe<Badma_Joins_Order_By>;
  badma_moves?: InputMaybe<Badma_Moves_Order_By>;
  badma_servers?: InputMaybe<Badma_Servers_Order_By>;
  badma_settings?: InputMaybe<Badma_Settings_Order_By>;
  badma_tournaments?: InputMaybe<Badma_Tournaments_Order_By>;
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
  public_notifications?: InputMaybe<Notifications_Order_By>;
  public_users?: InputMaybe<Users_Order_By>;
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

/** mutation root */
export type Mutation_Root = {
  __typename?: "mutation_root";
  /** delete data from the table: "accounts" */
  delete_accounts?: Maybe<Accounts_Mutation_Response>;
  /** delete single row from the table: "accounts" */
  delete_accounts_by_pk?: Maybe<Accounts>;
  /** delete data from the table: "auth_jwt" */
  delete_auth_jwt?: Maybe<Auth_Jwt_Mutation_Response>;
  /** delete single row from the table: "auth_jwt" */
  delete_auth_jwt_by_pk?: Maybe<Auth_Jwt>;
  /** delete data from the table: "badma.ais" */
  delete_badma_ais?: Maybe<Badma_Ais_Mutation_Response>;
  /** delete single row from the table: "badma.ais" */
  delete_badma_ais_by_pk?: Maybe<Badma_Ais>;
  /** delete data from the table: "badma.clubs" */
  delete_badma_clubs?: Maybe<Badma_Clubs_Mutation_Response>;
  /** delete single row from the table: "badma.clubs" */
  delete_badma_clubs_by_pk?: Maybe<Badma_Clubs>;
  /** delete data from the table: "badma.errors" */
  delete_badma_errors?: Maybe<Badma_Errors_Mutation_Response>;
  /** delete single row from the table: "badma.errors" */
  delete_badma_errors_by_pk?: Maybe<Badma_Errors>;
  /** delete data from the table: "badma.games" */
  delete_badma_games?: Maybe<Badma_Games_Mutation_Response>;
  /** delete single row from the table: "badma.games" */
  delete_badma_games_by_pk?: Maybe<Badma_Games>;
  /** delete data from the table: "badma.in_clubs" */
  delete_badma_in_clubs?: Maybe<Badma_In_Clubs_Mutation_Response>;
  /** delete single row from the table: "badma.in_clubs" */
  delete_badma_in_clubs_by_pk?: Maybe<Badma_In_Clubs>;
  /** delete data from the table: "badma.items" */
  delete_badma_items?: Maybe<Badma_Items_Mutation_Response>;
  /** delete single row from the table: "badma.items" */
  delete_badma_items_by_pk?: Maybe<Badma_Items>;
  /** delete data from the table: "badma.joins" */
  delete_badma_joins?: Maybe<Badma_Joins_Mutation_Response>;
  /** delete single row from the table: "badma.joins" */
  delete_badma_joins_by_pk?: Maybe<Badma_Joins>;
  /** delete data from the table: "badma.moves" */
  delete_badma_moves?: Maybe<Badma_Moves_Mutation_Response>;
  /** delete single row from the table: "badma.moves" */
  delete_badma_moves_by_pk?: Maybe<Badma_Moves>;
  /** delete data from the table: "badma.servers" */
  delete_badma_servers?: Maybe<Badma_Servers_Mutation_Response>;
  /** delete single row from the table: "badma.servers" */
  delete_badma_servers_by_pk?: Maybe<Badma_Servers>;
  /** delete data from the table: "badma.settings" */
  delete_badma_settings?: Maybe<Badma_Settings_Mutation_Response>;
  /** delete single row from the table: "badma.settings" */
  delete_badma_settings_by_pk?: Maybe<Badma_Settings>;
  /** delete data from the table: "badma.tournament_games" */
  delete_badma_tournament_games?: Maybe<Badma_Tournament_Games_Mutation_Response>;
  /** delete single row from the table: "badma.tournament_games" */
  delete_badma_tournament_games_by_pk?: Maybe<Badma_Tournament_Games>;
  /** delete data from the table: "badma.tournament_participants" */
  delete_badma_tournament_participants?: Maybe<Badma_Tournament_Participants_Mutation_Response>;
  /** delete single row from the table: "badma.tournament_participants" */
  delete_badma_tournament_participants_by_pk?: Maybe<Badma_Tournament_Participants>;
  /** delete data from the table: "badma.tournament_scores" */
  delete_badma_tournament_scores?: Maybe<Badma_Tournament_Scores_Mutation_Response>;
  /** delete single row from the table: "badma.tournament_scores" */
  delete_badma_tournament_scores_by_pk?: Maybe<Badma_Tournament_Scores>;
  /** delete data from the table: "badma.tournaments" */
  delete_badma_tournaments?: Maybe<Badma_Tournaments_Mutation_Response>;
  /** delete single row from the table: "badma.tournaments" */
  delete_badma_tournaments_by_pk?: Maybe<Badma_Tournaments>;
  /** delete data from the table: "debug" */
  delete_debug?: Maybe<Debug_Mutation_Response>;
  /** delete single row from the table: "debug" */
  delete_debug_by_pk?: Maybe<Debug>;
  /** delete data from the table: "logs.diffs" */
  delete_logs_diffs?: Maybe<Logs_Diffs_Mutation_Response>;
  /** delete single row from the table: "logs.diffs" */
  delete_logs_diffs_by_pk?: Maybe<Logs_Diffs>;
  /** delete data from the table: "logs.states" */
  delete_logs_states?: Maybe<Logs_States_Mutation_Response>;
  /** delete single row from the table: "logs.states" */
  delete_logs_states_by_pk?: Maybe<Logs_States>;
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
  /** delete data from the table: "users" */
  delete_users?: Maybe<Users_Mutation_Response>;
  /** delete single row from the table: "users" */
  delete_users_by_pk?: Maybe<Users>;
  /** insert data into the table: "accounts" */
  insert_accounts?: Maybe<Accounts_Mutation_Response>;
  /** insert a single row into the table: "accounts" */
  insert_accounts_one?: Maybe<Accounts>;
  /** insert data into the table: "auth_jwt" */
  insert_auth_jwt?: Maybe<Auth_Jwt_Mutation_Response>;
  /** insert a single row into the table: "auth_jwt" */
  insert_auth_jwt_one?: Maybe<Auth_Jwt>;
  /** insert data into the table: "badma.ais" */
  insert_badma_ais?: Maybe<Badma_Ais_Mutation_Response>;
  /** insert a single row into the table: "badma.ais" */
  insert_badma_ais_one?: Maybe<Badma_Ais>;
  /** insert data into the table: "badma.clubs" */
  insert_badma_clubs?: Maybe<Badma_Clubs_Mutation_Response>;
  /** insert a single row into the table: "badma.clubs" */
  insert_badma_clubs_one?: Maybe<Badma_Clubs>;
  /** insert data into the table: "badma.errors" */
  insert_badma_errors?: Maybe<Badma_Errors_Mutation_Response>;
  /** insert a single row into the table: "badma.errors" */
  insert_badma_errors_one?: Maybe<Badma_Errors>;
  /** insert data into the table: "badma.games" */
  insert_badma_games?: Maybe<Badma_Games_Mutation_Response>;
  /** insert a single row into the table: "badma.games" */
  insert_badma_games_one?: Maybe<Badma_Games>;
  /** insert data into the table: "badma.in_clubs" */
  insert_badma_in_clubs?: Maybe<Badma_In_Clubs_Mutation_Response>;
  /** insert a single row into the table: "badma.in_clubs" */
  insert_badma_in_clubs_one?: Maybe<Badma_In_Clubs>;
  /** insert data into the table: "badma.items" */
  insert_badma_items?: Maybe<Badma_Items_Mutation_Response>;
  /** insert a single row into the table: "badma.items" */
  insert_badma_items_one?: Maybe<Badma_Items>;
  /** insert data into the table: "badma.joins" */
  insert_badma_joins?: Maybe<Badma_Joins_Mutation_Response>;
  /** insert a single row into the table: "badma.joins" */
  insert_badma_joins_one?: Maybe<Badma_Joins>;
  /** insert data into the table: "badma.moves" */
  insert_badma_moves?: Maybe<Badma_Moves_Mutation_Response>;
  /** insert a single row into the table: "badma.moves" */
  insert_badma_moves_one?: Maybe<Badma_Moves>;
  /** insert data into the table: "badma.servers" */
  insert_badma_servers?: Maybe<Badma_Servers_Mutation_Response>;
  /** insert a single row into the table: "badma.servers" */
  insert_badma_servers_one?: Maybe<Badma_Servers>;
  /** insert data into the table: "badma.settings" */
  insert_badma_settings?: Maybe<Badma_Settings_Mutation_Response>;
  /** insert a single row into the table: "badma.settings" */
  insert_badma_settings_one?: Maybe<Badma_Settings>;
  /** insert data into the table: "badma.tournament_games" */
  insert_badma_tournament_games?: Maybe<Badma_Tournament_Games_Mutation_Response>;
  /** insert a single row into the table: "badma.tournament_games" */
  insert_badma_tournament_games_one?: Maybe<Badma_Tournament_Games>;
  /** insert data into the table: "badma.tournament_participants" */
  insert_badma_tournament_participants?: Maybe<Badma_Tournament_Participants_Mutation_Response>;
  /** insert a single row into the table: "badma.tournament_participants" */
  insert_badma_tournament_participants_one?: Maybe<Badma_Tournament_Participants>;
  /** insert data into the table: "badma.tournament_scores" */
  insert_badma_tournament_scores?: Maybe<Badma_Tournament_Scores_Mutation_Response>;
  /** insert a single row into the table: "badma.tournament_scores" */
  insert_badma_tournament_scores_one?: Maybe<Badma_Tournament_Scores>;
  /** insert data into the table: "badma.tournaments" */
  insert_badma_tournaments?: Maybe<Badma_Tournaments_Mutation_Response>;
  /** insert a single row into the table: "badma.tournaments" */
  insert_badma_tournaments_one?: Maybe<Badma_Tournaments>;
  /** insert data into the table: "debug" */
  insert_debug?: Maybe<Debug_Mutation_Response>;
  /** insert a single row into the table: "debug" */
  insert_debug_one?: Maybe<Debug>;
  /** insert data into the table: "logs.diffs" */
  insert_logs_diffs?: Maybe<Logs_Diffs_Mutation_Response>;
  /** insert a single row into the table: "logs.diffs" */
  insert_logs_diffs_one?: Maybe<Logs_Diffs>;
  /** insert data into the table: "logs.states" */
  insert_logs_states?: Maybe<Logs_States_Mutation_Response>;
  /** insert a single row into the table: "logs.states" */
  insert_logs_states_one?: Maybe<Logs_States>;
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
  /** insert data into the table: "users" */
  insert_users?: Maybe<Users_Mutation_Response>;
  /** insert a single row into the table: "users" */
  insert_users_one?: Maybe<Users>;
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
  /** update data of the table: "badma.ais" */
  update_badma_ais?: Maybe<Badma_Ais_Mutation_Response>;
  /** update single row of the table: "badma.ais" */
  update_badma_ais_by_pk?: Maybe<Badma_Ais>;
  /** update multiples rows of table: "badma.ais" */
  update_badma_ais_many?: Maybe<Array<Maybe<Badma_Ais_Mutation_Response>>>;
  /** update data of the table: "badma.clubs" */
  update_badma_clubs?: Maybe<Badma_Clubs_Mutation_Response>;
  /** update single row of the table: "badma.clubs" */
  update_badma_clubs_by_pk?: Maybe<Badma_Clubs>;
  /** update multiples rows of table: "badma.clubs" */
  update_badma_clubs_many?: Maybe<Array<Maybe<Badma_Clubs_Mutation_Response>>>;
  /** update data of the table: "badma.errors" */
  update_badma_errors?: Maybe<Badma_Errors_Mutation_Response>;
  /** update single row of the table: "badma.errors" */
  update_badma_errors_by_pk?: Maybe<Badma_Errors>;
  /** update multiples rows of table: "badma.errors" */
  update_badma_errors_many?: Maybe<
    Array<Maybe<Badma_Errors_Mutation_Response>>
  >;
  /** update data of the table: "badma.games" */
  update_badma_games?: Maybe<Badma_Games_Mutation_Response>;
  /** update single row of the table: "badma.games" */
  update_badma_games_by_pk?: Maybe<Badma_Games>;
  /** update multiples rows of table: "badma.games" */
  update_badma_games_many?: Maybe<Array<Maybe<Badma_Games_Mutation_Response>>>;
  /** update data of the table: "badma.in_clubs" */
  update_badma_in_clubs?: Maybe<Badma_In_Clubs_Mutation_Response>;
  /** update single row of the table: "badma.in_clubs" */
  update_badma_in_clubs_by_pk?: Maybe<Badma_In_Clubs>;
  /** update multiples rows of table: "badma.in_clubs" */
  update_badma_in_clubs_many?: Maybe<
    Array<Maybe<Badma_In_Clubs_Mutation_Response>>
  >;
  /** update data of the table: "badma.items" */
  update_badma_items?: Maybe<Badma_Items_Mutation_Response>;
  /** update single row of the table: "badma.items" */
  update_badma_items_by_pk?: Maybe<Badma_Items>;
  /** update multiples rows of table: "badma.items" */
  update_badma_items_many?: Maybe<Array<Maybe<Badma_Items_Mutation_Response>>>;
  /** update data of the table: "badma.joins" */
  update_badma_joins?: Maybe<Badma_Joins_Mutation_Response>;
  /** update single row of the table: "badma.joins" */
  update_badma_joins_by_pk?: Maybe<Badma_Joins>;
  /** update multiples rows of table: "badma.joins" */
  update_badma_joins_many?: Maybe<Array<Maybe<Badma_Joins_Mutation_Response>>>;
  /** update data of the table: "badma.moves" */
  update_badma_moves?: Maybe<Badma_Moves_Mutation_Response>;
  /** update single row of the table: "badma.moves" */
  update_badma_moves_by_pk?: Maybe<Badma_Moves>;
  /** update multiples rows of table: "badma.moves" */
  update_badma_moves_many?: Maybe<Array<Maybe<Badma_Moves_Mutation_Response>>>;
  /** update data of the table: "badma.servers" */
  update_badma_servers?: Maybe<Badma_Servers_Mutation_Response>;
  /** update single row of the table: "badma.servers" */
  update_badma_servers_by_pk?: Maybe<Badma_Servers>;
  /** update multiples rows of table: "badma.servers" */
  update_badma_servers_many?: Maybe<
    Array<Maybe<Badma_Servers_Mutation_Response>>
  >;
  /** update data of the table: "badma.settings" */
  update_badma_settings?: Maybe<Badma_Settings_Mutation_Response>;
  /** update single row of the table: "badma.settings" */
  update_badma_settings_by_pk?: Maybe<Badma_Settings>;
  /** update multiples rows of table: "badma.settings" */
  update_badma_settings_many?: Maybe<
    Array<Maybe<Badma_Settings_Mutation_Response>>
  >;
  /** update data of the table: "badma.tournament_games" */
  update_badma_tournament_games?: Maybe<Badma_Tournament_Games_Mutation_Response>;
  /** update single row of the table: "badma.tournament_games" */
  update_badma_tournament_games_by_pk?: Maybe<Badma_Tournament_Games>;
  /** update multiples rows of table: "badma.tournament_games" */
  update_badma_tournament_games_many?: Maybe<
    Array<Maybe<Badma_Tournament_Games_Mutation_Response>>
  >;
  /** update data of the table: "badma.tournament_participants" */
  update_badma_tournament_participants?: Maybe<Badma_Tournament_Participants_Mutation_Response>;
  /** update single row of the table: "badma.tournament_participants" */
  update_badma_tournament_participants_by_pk?: Maybe<Badma_Tournament_Participants>;
  /** update multiples rows of table: "badma.tournament_participants" */
  update_badma_tournament_participants_many?: Maybe<
    Array<Maybe<Badma_Tournament_Participants_Mutation_Response>>
  >;
  /** update data of the table: "badma.tournament_scores" */
  update_badma_tournament_scores?: Maybe<Badma_Tournament_Scores_Mutation_Response>;
  /** update single row of the table: "badma.tournament_scores" */
  update_badma_tournament_scores_by_pk?: Maybe<Badma_Tournament_Scores>;
  /** update multiples rows of table: "badma.tournament_scores" */
  update_badma_tournament_scores_many?: Maybe<
    Array<Maybe<Badma_Tournament_Scores_Mutation_Response>>
  >;
  /** update data of the table: "badma.tournaments" */
  update_badma_tournaments?: Maybe<Badma_Tournaments_Mutation_Response>;
  /** update single row of the table: "badma.tournaments" */
  update_badma_tournaments_by_pk?: Maybe<Badma_Tournaments>;
  /** update multiples rows of table: "badma.tournaments" */
  update_badma_tournaments_many?: Maybe<
    Array<Maybe<Badma_Tournaments_Mutation_Response>>
  >;
  /** update data of the table: "debug" */
  update_debug?: Maybe<Debug_Mutation_Response>;
  /** update single row of the table: "debug" */
  update_debug_by_pk?: Maybe<Debug>;
  /** update multiples rows of table: "debug" */
  update_debug_many?: Maybe<Array<Maybe<Debug_Mutation_Response>>>;
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
  /** update data of the table: "users" */
  update_users?: Maybe<Users_Mutation_Response>;
  /** update single row of the table: "users" */
  update_users_by_pk?: Maybe<Users>;
  /** update multiples rows of table: "users" */
  update_users_many?: Maybe<Array<Maybe<Users_Mutation_Response>>>;
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
export type Mutation_RootDelete_Badma_AisArgs = {
  where: Badma_Ais_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Badma_Ais_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Badma_ClubsArgs = {
  where: Badma_Clubs_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Badma_Clubs_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Badma_ErrorsArgs = {
  where: Badma_Errors_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Badma_Errors_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Badma_GamesArgs = {
  where: Badma_Games_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Badma_Games_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Badma_In_ClubsArgs = {
  where: Badma_In_Clubs_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Badma_In_Clubs_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Badma_ItemsArgs = {
  where: Badma_Items_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Badma_Items_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Badma_JoinsArgs = {
  where: Badma_Joins_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Badma_Joins_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Badma_MovesArgs = {
  where: Badma_Moves_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Badma_Moves_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Badma_ServersArgs = {
  where: Badma_Servers_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Badma_Servers_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Badma_SettingsArgs = {
  where: Badma_Settings_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Badma_Settings_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Badma_Tournament_GamesArgs = {
  where: Badma_Tournament_Games_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Badma_Tournament_Games_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Badma_Tournament_ParticipantsArgs = {
  where: Badma_Tournament_Participants_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Badma_Tournament_Participants_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Badma_Tournament_ScoresArgs = {
  where: Badma_Tournament_Scores_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Badma_Tournament_Scores_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Badma_TournamentsArgs = {
  where: Badma_Tournaments_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Badma_Tournaments_By_PkArgs = {
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
export type Mutation_RootDelete_UsersArgs = {
  where: Users_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Users_By_PkArgs = {
  id: Scalars["uuid"]["input"];
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
export type Mutation_RootInsert_Badma_AisArgs = {
  objects: Array<Badma_Ais_Insert_Input>;
  on_conflict?: InputMaybe<Badma_Ais_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_Ais_OneArgs = {
  object: Badma_Ais_Insert_Input;
  on_conflict?: InputMaybe<Badma_Ais_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_ClubsArgs = {
  objects: Array<Badma_Clubs_Insert_Input>;
  on_conflict?: InputMaybe<Badma_Clubs_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_Clubs_OneArgs = {
  object: Badma_Clubs_Insert_Input;
  on_conflict?: InputMaybe<Badma_Clubs_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_ErrorsArgs = {
  objects: Array<Badma_Errors_Insert_Input>;
  on_conflict?: InputMaybe<Badma_Errors_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_Errors_OneArgs = {
  object: Badma_Errors_Insert_Input;
  on_conflict?: InputMaybe<Badma_Errors_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_GamesArgs = {
  objects: Array<Badma_Games_Insert_Input>;
  on_conflict?: InputMaybe<Badma_Games_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_Games_OneArgs = {
  object: Badma_Games_Insert_Input;
  on_conflict?: InputMaybe<Badma_Games_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_In_ClubsArgs = {
  objects: Array<Badma_In_Clubs_Insert_Input>;
  on_conflict?: InputMaybe<Badma_In_Clubs_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_In_Clubs_OneArgs = {
  object: Badma_In_Clubs_Insert_Input;
  on_conflict?: InputMaybe<Badma_In_Clubs_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_ItemsArgs = {
  objects: Array<Badma_Items_Insert_Input>;
  on_conflict?: InputMaybe<Badma_Items_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_Items_OneArgs = {
  object: Badma_Items_Insert_Input;
  on_conflict?: InputMaybe<Badma_Items_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_JoinsArgs = {
  objects: Array<Badma_Joins_Insert_Input>;
  on_conflict?: InputMaybe<Badma_Joins_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_Joins_OneArgs = {
  object: Badma_Joins_Insert_Input;
  on_conflict?: InputMaybe<Badma_Joins_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_MovesArgs = {
  objects: Array<Badma_Moves_Insert_Input>;
  on_conflict?: InputMaybe<Badma_Moves_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_Moves_OneArgs = {
  object: Badma_Moves_Insert_Input;
  on_conflict?: InputMaybe<Badma_Moves_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_ServersArgs = {
  objects: Array<Badma_Servers_Insert_Input>;
  on_conflict?: InputMaybe<Badma_Servers_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_Servers_OneArgs = {
  object: Badma_Servers_Insert_Input;
  on_conflict?: InputMaybe<Badma_Servers_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_SettingsArgs = {
  objects: Array<Badma_Settings_Insert_Input>;
  on_conflict?: InputMaybe<Badma_Settings_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_Settings_OneArgs = {
  object: Badma_Settings_Insert_Input;
  on_conflict?: InputMaybe<Badma_Settings_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_Tournament_GamesArgs = {
  objects: Array<Badma_Tournament_Games_Insert_Input>;
  on_conflict?: InputMaybe<Badma_Tournament_Games_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_Tournament_Games_OneArgs = {
  object: Badma_Tournament_Games_Insert_Input;
  on_conflict?: InputMaybe<Badma_Tournament_Games_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_Tournament_ParticipantsArgs = {
  objects: Array<Badma_Tournament_Participants_Insert_Input>;
  on_conflict?: InputMaybe<Badma_Tournament_Participants_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_Tournament_Participants_OneArgs = {
  object: Badma_Tournament_Participants_Insert_Input;
  on_conflict?: InputMaybe<Badma_Tournament_Participants_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_Tournament_ScoresArgs = {
  objects: Array<Badma_Tournament_Scores_Insert_Input>;
  on_conflict?: InputMaybe<Badma_Tournament_Scores_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_Tournament_Scores_OneArgs = {
  object: Badma_Tournament_Scores_Insert_Input;
  on_conflict?: InputMaybe<Badma_Tournament_Scores_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_TournamentsArgs = {
  objects: Array<Badma_Tournaments_Insert_Input>;
  on_conflict?: InputMaybe<Badma_Tournaments_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Badma_Tournaments_OneArgs = {
  object: Badma_Tournaments_Insert_Input;
  on_conflict?: InputMaybe<Badma_Tournaments_On_Conflict>;
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
export type Mutation_RootUpdate_Badma_AisArgs = {
  _append?: InputMaybe<Badma_Ais_Append_Input>;
  _delete_at_path?: InputMaybe<Badma_Ais_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Badma_Ais_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Badma_Ais_Delete_Key_Input>;
  _inc?: InputMaybe<Badma_Ais_Inc_Input>;
  _prepend?: InputMaybe<Badma_Ais_Prepend_Input>;
  _set?: InputMaybe<Badma_Ais_Set_Input>;
  where: Badma_Ais_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Ais_By_PkArgs = {
  _append?: InputMaybe<Badma_Ais_Append_Input>;
  _delete_at_path?: InputMaybe<Badma_Ais_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Badma_Ais_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Badma_Ais_Delete_Key_Input>;
  _inc?: InputMaybe<Badma_Ais_Inc_Input>;
  _prepend?: InputMaybe<Badma_Ais_Prepend_Input>;
  _set?: InputMaybe<Badma_Ais_Set_Input>;
  pk_columns: Badma_Ais_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Ais_ManyArgs = {
  updates: Array<Badma_Ais_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_ClubsArgs = {
  _inc?: InputMaybe<Badma_Clubs_Inc_Input>;
  _set?: InputMaybe<Badma_Clubs_Set_Input>;
  where: Badma_Clubs_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Clubs_By_PkArgs = {
  _inc?: InputMaybe<Badma_Clubs_Inc_Input>;
  _set?: InputMaybe<Badma_Clubs_Set_Input>;
  pk_columns: Badma_Clubs_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Clubs_ManyArgs = {
  updates: Array<Badma_Clubs_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_ErrorsArgs = {
  _append?: InputMaybe<Badma_Errors_Append_Input>;
  _delete_at_path?: InputMaybe<Badma_Errors_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Badma_Errors_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Badma_Errors_Delete_Key_Input>;
  _inc?: InputMaybe<Badma_Errors_Inc_Input>;
  _prepend?: InputMaybe<Badma_Errors_Prepend_Input>;
  _set?: InputMaybe<Badma_Errors_Set_Input>;
  where: Badma_Errors_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Errors_By_PkArgs = {
  _append?: InputMaybe<Badma_Errors_Append_Input>;
  _delete_at_path?: InputMaybe<Badma_Errors_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Badma_Errors_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Badma_Errors_Delete_Key_Input>;
  _inc?: InputMaybe<Badma_Errors_Inc_Input>;
  _prepend?: InputMaybe<Badma_Errors_Prepend_Input>;
  _set?: InputMaybe<Badma_Errors_Set_Input>;
  pk_columns: Badma_Errors_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Errors_ManyArgs = {
  updates: Array<Badma_Errors_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_GamesArgs = {
  _inc?: InputMaybe<Badma_Games_Inc_Input>;
  _set?: InputMaybe<Badma_Games_Set_Input>;
  where: Badma_Games_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Games_By_PkArgs = {
  _inc?: InputMaybe<Badma_Games_Inc_Input>;
  _set?: InputMaybe<Badma_Games_Set_Input>;
  pk_columns: Badma_Games_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Games_ManyArgs = {
  updates: Array<Badma_Games_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_In_ClubsArgs = {
  _inc?: InputMaybe<Badma_In_Clubs_Inc_Input>;
  _set?: InputMaybe<Badma_In_Clubs_Set_Input>;
  where: Badma_In_Clubs_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_In_Clubs_By_PkArgs = {
  _inc?: InputMaybe<Badma_In_Clubs_Inc_Input>;
  _set?: InputMaybe<Badma_In_Clubs_Set_Input>;
  pk_columns: Badma_In_Clubs_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_In_Clubs_ManyArgs = {
  updates: Array<Badma_In_Clubs_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_ItemsArgs = {
  _inc?: InputMaybe<Badma_Items_Inc_Input>;
  _set?: InputMaybe<Badma_Items_Set_Input>;
  where: Badma_Items_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Items_By_PkArgs = {
  _inc?: InputMaybe<Badma_Items_Inc_Input>;
  _set?: InputMaybe<Badma_Items_Set_Input>;
  pk_columns: Badma_Items_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Items_ManyArgs = {
  updates: Array<Badma_Items_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_JoinsArgs = {
  _inc?: InputMaybe<Badma_Joins_Inc_Input>;
  _set?: InputMaybe<Badma_Joins_Set_Input>;
  where: Badma_Joins_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Joins_By_PkArgs = {
  _inc?: InputMaybe<Badma_Joins_Inc_Input>;
  _set?: InputMaybe<Badma_Joins_Set_Input>;
  pk_columns: Badma_Joins_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Joins_ManyArgs = {
  updates: Array<Badma_Joins_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_MovesArgs = {
  _inc?: InputMaybe<Badma_Moves_Inc_Input>;
  _set?: InputMaybe<Badma_Moves_Set_Input>;
  where: Badma_Moves_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Moves_By_PkArgs = {
  _inc?: InputMaybe<Badma_Moves_Inc_Input>;
  _set?: InputMaybe<Badma_Moves_Set_Input>;
  pk_columns: Badma_Moves_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Moves_ManyArgs = {
  updates: Array<Badma_Moves_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_ServersArgs = {
  _inc?: InputMaybe<Badma_Servers_Inc_Input>;
  _set?: InputMaybe<Badma_Servers_Set_Input>;
  where: Badma_Servers_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Servers_By_PkArgs = {
  _inc?: InputMaybe<Badma_Servers_Inc_Input>;
  _set?: InputMaybe<Badma_Servers_Set_Input>;
  pk_columns: Badma_Servers_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Servers_ManyArgs = {
  updates: Array<Badma_Servers_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_SettingsArgs = {
  _inc?: InputMaybe<Badma_Settings_Inc_Input>;
  _set?: InputMaybe<Badma_Settings_Set_Input>;
  where: Badma_Settings_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Settings_By_PkArgs = {
  _inc?: InputMaybe<Badma_Settings_Inc_Input>;
  _set?: InputMaybe<Badma_Settings_Set_Input>;
  pk_columns: Badma_Settings_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Settings_ManyArgs = {
  updates: Array<Badma_Settings_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Tournament_GamesArgs = {
  _inc?: InputMaybe<Badma_Tournament_Games_Inc_Input>;
  _set?: InputMaybe<Badma_Tournament_Games_Set_Input>;
  where: Badma_Tournament_Games_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Tournament_Games_By_PkArgs = {
  _inc?: InputMaybe<Badma_Tournament_Games_Inc_Input>;
  _set?: InputMaybe<Badma_Tournament_Games_Set_Input>;
  pk_columns: Badma_Tournament_Games_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Tournament_Games_ManyArgs = {
  updates: Array<Badma_Tournament_Games_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Tournament_ParticipantsArgs = {
  _inc?: InputMaybe<Badma_Tournament_Participants_Inc_Input>;
  _set?: InputMaybe<Badma_Tournament_Participants_Set_Input>;
  where: Badma_Tournament_Participants_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Tournament_Participants_By_PkArgs = {
  _inc?: InputMaybe<Badma_Tournament_Participants_Inc_Input>;
  _set?: InputMaybe<Badma_Tournament_Participants_Set_Input>;
  pk_columns: Badma_Tournament_Participants_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Tournament_Participants_ManyArgs = {
  updates: Array<Badma_Tournament_Participants_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Tournament_ScoresArgs = {
  _inc?: InputMaybe<Badma_Tournament_Scores_Inc_Input>;
  _set?: InputMaybe<Badma_Tournament_Scores_Set_Input>;
  where: Badma_Tournament_Scores_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Tournament_Scores_By_PkArgs = {
  _inc?: InputMaybe<Badma_Tournament_Scores_Inc_Input>;
  _set?: InputMaybe<Badma_Tournament_Scores_Set_Input>;
  pk_columns: Badma_Tournament_Scores_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Tournament_Scores_ManyArgs = {
  updates: Array<Badma_Tournament_Scores_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_TournamentsArgs = {
  _append?: InputMaybe<Badma_Tournaments_Append_Input>;
  _delete_at_path?: InputMaybe<Badma_Tournaments_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Badma_Tournaments_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Badma_Tournaments_Delete_Key_Input>;
  _inc?: InputMaybe<Badma_Tournaments_Inc_Input>;
  _prepend?: InputMaybe<Badma_Tournaments_Prepend_Input>;
  _set?: InputMaybe<Badma_Tournaments_Set_Input>;
  where: Badma_Tournaments_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Tournaments_By_PkArgs = {
  _append?: InputMaybe<Badma_Tournaments_Append_Input>;
  _delete_at_path?: InputMaybe<Badma_Tournaments_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Badma_Tournaments_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Badma_Tournaments_Delete_Key_Input>;
  _inc?: InputMaybe<Badma_Tournaments_Inc_Input>;
  _prepend?: InputMaybe<Badma_Tournaments_Prepend_Input>;
  _set?: InputMaybe<Badma_Tournaments_Set_Input>;
  pk_columns: Badma_Tournaments_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Badma_Tournaments_ManyArgs = {
  updates: Array<Badma_Tournaments_Updates>;
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
  /** fetch data from the table: "badma.ais" */
  badma_ais: Array<Badma_Ais>;
  /** fetch aggregated fields from the table: "badma.ais" */
  badma_ais_aggregate: Badma_Ais_Aggregate;
  /** fetch data from the table: "badma.ais" using primary key columns */
  badma_ais_by_pk?: Maybe<Badma_Ais>;
  /** fetch data from the table: "badma.clubs" */
  badma_clubs: Array<Badma_Clubs>;
  /** fetch aggregated fields from the table: "badma.clubs" */
  badma_clubs_aggregate: Badma_Clubs_Aggregate;
  /** fetch data from the table: "badma.clubs" using primary key columns */
  badma_clubs_by_pk?: Maybe<Badma_Clubs>;
  /** fetch data from the table: "badma.errors" */
  badma_errors: Array<Badma_Errors>;
  /** fetch aggregated fields from the table: "badma.errors" */
  badma_errors_aggregate: Badma_Errors_Aggregate;
  /** fetch data from the table: "badma.errors" using primary key columns */
  badma_errors_by_pk?: Maybe<Badma_Errors>;
  /** fetch data from the table: "badma.games" */
  badma_games: Array<Badma_Games>;
  /** fetch aggregated fields from the table: "badma.games" */
  badma_games_aggregate: Badma_Games_Aggregate;
  /** fetch data from the table: "badma.games" using primary key columns */
  badma_games_by_pk?: Maybe<Badma_Games>;
  /** fetch data from the table: "badma.in_clubs" */
  badma_in_clubs: Array<Badma_In_Clubs>;
  /** fetch aggregated fields from the table: "badma.in_clubs" */
  badma_in_clubs_aggregate: Badma_In_Clubs_Aggregate;
  /** fetch data from the table: "badma.in_clubs" using primary key columns */
  badma_in_clubs_by_pk?: Maybe<Badma_In_Clubs>;
  /** fetch data from the table: "badma.items" */
  badma_items: Array<Badma_Items>;
  /** fetch aggregated fields from the table: "badma.items" */
  badma_items_aggregate: Badma_Items_Aggregate;
  /** fetch data from the table: "badma.items" using primary key columns */
  badma_items_by_pk?: Maybe<Badma_Items>;
  /** fetch data from the table: "badma.joins" */
  badma_joins: Array<Badma_Joins>;
  /** fetch aggregated fields from the table: "badma.joins" */
  badma_joins_aggregate: Badma_Joins_Aggregate;
  /** fetch data from the table: "badma.joins" using primary key columns */
  badma_joins_by_pk?: Maybe<Badma_Joins>;
  /** fetch data from the table: "badma.moves" */
  badma_moves: Array<Badma_Moves>;
  /** fetch aggregated fields from the table: "badma.moves" */
  badma_moves_aggregate: Badma_Moves_Aggregate;
  /** fetch data from the table: "badma.moves" using primary key columns */
  badma_moves_by_pk?: Maybe<Badma_Moves>;
  /** fetch data from the table: "badma.servers" */
  badma_servers: Array<Badma_Servers>;
  /** fetch aggregated fields from the table: "badma.servers" */
  badma_servers_aggregate: Badma_Servers_Aggregate;
  /** fetch data from the table: "badma.servers" using primary key columns */
  badma_servers_by_pk?: Maybe<Badma_Servers>;
  /** fetch data from the table: "badma.settings" */
  badma_settings: Array<Badma_Settings>;
  /** fetch aggregated fields from the table: "badma.settings" */
  badma_settings_aggregate: Badma_Settings_Aggregate;
  /** fetch data from the table: "badma.settings" using primary key columns */
  badma_settings_by_pk?: Maybe<Badma_Settings>;
  /** fetch data from the table: "badma.tournament_games" */
  badma_tournament_games: Array<Badma_Tournament_Games>;
  /** fetch aggregated fields from the table: "badma.tournament_games" */
  badma_tournament_games_aggregate: Badma_Tournament_Games_Aggregate;
  /** fetch data from the table: "badma.tournament_games" using primary key columns */
  badma_tournament_games_by_pk?: Maybe<Badma_Tournament_Games>;
  /** fetch data from the table: "badma.tournament_participants" */
  badma_tournament_participants: Array<Badma_Tournament_Participants>;
  /** fetch aggregated fields from the table: "badma.tournament_participants" */
  badma_tournament_participants_aggregate: Badma_Tournament_Participants_Aggregate;
  /** fetch data from the table: "badma.tournament_participants" using primary key columns */
  badma_tournament_participants_by_pk?: Maybe<Badma_Tournament_Participants>;
  /** fetch data from the table: "badma.tournament_scores" */
  badma_tournament_scores: Array<Badma_Tournament_Scores>;
  /** fetch aggregated fields from the table: "badma.tournament_scores" */
  badma_tournament_scores_aggregate: Badma_Tournament_Scores_Aggregate;
  /** fetch data from the table: "badma.tournament_scores" using primary key columns */
  badma_tournament_scores_by_pk?: Maybe<Badma_Tournament_Scores>;
  /** fetch data from the table: "badma.tournaments" */
  badma_tournaments: Array<Badma_Tournaments>;
  /** fetch aggregated fields from the table: "badma.tournaments" */
  badma_tournaments_aggregate: Badma_Tournaments_Aggregate;
  /** fetch data from the table: "badma.tournaments" using primary key columns */
  badma_tournaments_by_pk?: Maybe<Badma_Tournaments>;
  /** fetch data from the table: "debug" */
  debug: Array<Debug>;
  /** fetch aggregated fields from the table: "debug" */
  debug_aggregate: Debug_Aggregate;
  /** fetch data from the table: "debug" using primary key columns */
  debug_by_pk?: Maybe<Debug>;
  /** fetch data from the table: "hasyx" */
  hasyx: Array<Hasyx>;
  /** fetch aggregated fields from the table: "hasyx" */
  hasyx_aggregate: Hasyx_Aggregate;
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
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
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

export type Query_RootBadma_AisArgs = {
  distinct_on?: InputMaybe<Array<Badma_Ais_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Ais_Order_By>>;
  where?: InputMaybe<Badma_Ais_Bool_Exp>;
};

export type Query_RootBadma_Ais_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Ais_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Ais_Order_By>>;
  where?: InputMaybe<Badma_Ais_Bool_Exp>;
};

export type Query_RootBadma_Ais_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootBadma_ClubsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Clubs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Clubs_Order_By>>;
  where?: InputMaybe<Badma_Clubs_Bool_Exp>;
};

export type Query_RootBadma_Clubs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Clubs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Clubs_Order_By>>;
  where?: InputMaybe<Badma_Clubs_Bool_Exp>;
};

export type Query_RootBadma_Clubs_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootBadma_ErrorsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Errors_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Errors_Order_By>>;
  where?: InputMaybe<Badma_Errors_Bool_Exp>;
};

export type Query_RootBadma_Errors_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Errors_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Errors_Order_By>>;
  where?: InputMaybe<Badma_Errors_Bool_Exp>;
};

export type Query_RootBadma_Errors_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootBadma_GamesArgs = {
  distinct_on?: InputMaybe<Array<Badma_Games_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Games_Order_By>>;
  where?: InputMaybe<Badma_Games_Bool_Exp>;
};

export type Query_RootBadma_Games_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Games_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Games_Order_By>>;
  where?: InputMaybe<Badma_Games_Bool_Exp>;
};

export type Query_RootBadma_Games_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootBadma_In_ClubsArgs = {
  distinct_on?: InputMaybe<Array<Badma_In_Clubs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_In_Clubs_Order_By>>;
  where?: InputMaybe<Badma_In_Clubs_Bool_Exp>;
};

export type Query_RootBadma_In_Clubs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_In_Clubs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_In_Clubs_Order_By>>;
  where?: InputMaybe<Badma_In_Clubs_Bool_Exp>;
};

export type Query_RootBadma_In_Clubs_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootBadma_ItemsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Items_Order_By>>;
  where?: InputMaybe<Badma_Items_Bool_Exp>;
};

export type Query_RootBadma_Items_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Items_Order_By>>;
  where?: InputMaybe<Badma_Items_Bool_Exp>;
};

export type Query_RootBadma_Items_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootBadma_JoinsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Joins_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Joins_Order_By>>;
  where?: InputMaybe<Badma_Joins_Bool_Exp>;
};

export type Query_RootBadma_Joins_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Joins_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Joins_Order_By>>;
  where?: InputMaybe<Badma_Joins_Bool_Exp>;
};

export type Query_RootBadma_Joins_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootBadma_MovesArgs = {
  distinct_on?: InputMaybe<Array<Badma_Moves_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Moves_Order_By>>;
  where?: InputMaybe<Badma_Moves_Bool_Exp>;
};

export type Query_RootBadma_Moves_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Moves_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Moves_Order_By>>;
  where?: InputMaybe<Badma_Moves_Bool_Exp>;
};

export type Query_RootBadma_Moves_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootBadma_ServersArgs = {
  distinct_on?: InputMaybe<Array<Badma_Servers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Servers_Order_By>>;
  where?: InputMaybe<Badma_Servers_Bool_Exp>;
};

export type Query_RootBadma_Servers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Servers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Servers_Order_By>>;
  where?: InputMaybe<Badma_Servers_Bool_Exp>;
};

export type Query_RootBadma_Servers_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootBadma_SettingsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Settings_Order_By>>;
  where?: InputMaybe<Badma_Settings_Bool_Exp>;
};

export type Query_RootBadma_Settings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Settings_Order_By>>;
  where?: InputMaybe<Badma_Settings_Bool_Exp>;
};

export type Query_RootBadma_Settings_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootBadma_Tournament_GamesArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournament_Games_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournament_Games_Order_By>>;
  where?: InputMaybe<Badma_Tournament_Games_Bool_Exp>;
};

export type Query_RootBadma_Tournament_Games_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournament_Games_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournament_Games_Order_By>>;
  where?: InputMaybe<Badma_Tournament_Games_Bool_Exp>;
};

export type Query_RootBadma_Tournament_Games_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootBadma_Tournament_ParticipantsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournament_Participants_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournament_Participants_Order_By>>;
  where?: InputMaybe<Badma_Tournament_Participants_Bool_Exp>;
};

export type Query_RootBadma_Tournament_Participants_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournament_Participants_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournament_Participants_Order_By>>;
  where?: InputMaybe<Badma_Tournament_Participants_Bool_Exp>;
};

export type Query_RootBadma_Tournament_Participants_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootBadma_Tournament_ScoresArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournament_Scores_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournament_Scores_Order_By>>;
  where?: InputMaybe<Badma_Tournament_Scores_Bool_Exp>;
};

export type Query_RootBadma_Tournament_Scores_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournament_Scores_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournament_Scores_Order_By>>;
  where?: InputMaybe<Badma_Tournament_Scores_Bool_Exp>;
};

export type Query_RootBadma_Tournament_Scores_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootBadma_TournamentsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournaments_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournaments_Order_By>>;
  where?: InputMaybe<Badma_Tournaments_Bool_Exp>;
};

export type Query_RootBadma_Tournaments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournaments_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournaments_Order_By>>;
  where?: InputMaybe<Badma_Tournaments_Bool_Exp>;
};

export type Query_RootBadma_Tournaments_By_PkArgs = {
  id: Scalars["uuid"]["input"];
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
  /** fetch data from the table: "badma.ais" */
  badma_ais: Array<Badma_Ais>;
  /** fetch aggregated fields from the table: "badma.ais" */
  badma_ais_aggregate: Badma_Ais_Aggregate;
  /** fetch data from the table: "badma.ais" using primary key columns */
  badma_ais_by_pk?: Maybe<Badma_Ais>;
  /** fetch data from the table in a streaming manner: "badma.ais" */
  badma_ais_stream: Array<Badma_Ais>;
  /** fetch data from the table: "badma.clubs" */
  badma_clubs: Array<Badma_Clubs>;
  /** fetch aggregated fields from the table: "badma.clubs" */
  badma_clubs_aggregate: Badma_Clubs_Aggregate;
  /** fetch data from the table: "badma.clubs" using primary key columns */
  badma_clubs_by_pk?: Maybe<Badma_Clubs>;
  /** fetch data from the table in a streaming manner: "badma.clubs" */
  badma_clubs_stream: Array<Badma_Clubs>;
  /** fetch data from the table: "badma.errors" */
  badma_errors: Array<Badma_Errors>;
  /** fetch aggregated fields from the table: "badma.errors" */
  badma_errors_aggregate: Badma_Errors_Aggregate;
  /** fetch data from the table: "badma.errors" using primary key columns */
  badma_errors_by_pk?: Maybe<Badma_Errors>;
  /** fetch data from the table in a streaming manner: "badma.errors" */
  badma_errors_stream: Array<Badma_Errors>;
  /** fetch data from the table: "badma.games" */
  badma_games: Array<Badma_Games>;
  /** fetch aggregated fields from the table: "badma.games" */
  badma_games_aggregate: Badma_Games_Aggregate;
  /** fetch data from the table: "badma.games" using primary key columns */
  badma_games_by_pk?: Maybe<Badma_Games>;
  /** fetch data from the table in a streaming manner: "badma.games" */
  badma_games_stream: Array<Badma_Games>;
  /** fetch data from the table: "badma.in_clubs" */
  badma_in_clubs: Array<Badma_In_Clubs>;
  /** fetch aggregated fields from the table: "badma.in_clubs" */
  badma_in_clubs_aggregate: Badma_In_Clubs_Aggregate;
  /** fetch data from the table: "badma.in_clubs" using primary key columns */
  badma_in_clubs_by_pk?: Maybe<Badma_In_Clubs>;
  /** fetch data from the table in a streaming manner: "badma.in_clubs" */
  badma_in_clubs_stream: Array<Badma_In_Clubs>;
  /** fetch data from the table: "badma.items" */
  badma_items: Array<Badma_Items>;
  /** fetch aggregated fields from the table: "badma.items" */
  badma_items_aggregate: Badma_Items_Aggregate;
  /** fetch data from the table: "badma.items" using primary key columns */
  badma_items_by_pk?: Maybe<Badma_Items>;
  /** fetch data from the table in a streaming manner: "badma.items" */
  badma_items_stream: Array<Badma_Items>;
  /** fetch data from the table: "badma.joins" */
  badma_joins: Array<Badma_Joins>;
  /** fetch aggregated fields from the table: "badma.joins" */
  badma_joins_aggregate: Badma_Joins_Aggregate;
  /** fetch data from the table: "badma.joins" using primary key columns */
  badma_joins_by_pk?: Maybe<Badma_Joins>;
  /** fetch data from the table in a streaming manner: "badma.joins" */
  badma_joins_stream: Array<Badma_Joins>;
  /** fetch data from the table: "badma.moves" */
  badma_moves: Array<Badma_Moves>;
  /** fetch aggregated fields from the table: "badma.moves" */
  badma_moves_aggregate: Badma_Moves_Aggregate;
  /** fetch data from the table: "badma.moves" using primary key columns */
  badma_moves_by_pk?: Maybe<Badma_Moves>;
  /** fetch data from the table in a streaming manner: "badma.moves" */
  badma_moves_stream: Array<Badma_Moves>;
  /** fetch data from the table: "badma.servers" */
  badma_servers: Array<Badma_Servers>;
  /** fetch aggregated fields from the table: "badma.servers" */
  badma_servers_aggregate: Badma_Servers_Aggregate;
  /** fetch data from the table: "badma.servers" using primary key columns */
  badma_servers_by_pk?: Maybe<Badma_Servers>;
  /** fetch data from the table in a streaming manner: "badma.servers" */
  badma_servers_stream: Array<Badma_Servers>;
  /** fetch data from the table: "badma.settings" */
  badma_settings: Array<Badma_Settings>;
  /** fetch aggregated fields from the table: "badma.settings" */
  badma_settings_aggregate: Badma_Settings_Aggregate;
  /** fetch data from the table: "badma.settings" using primary key columns */
  badma_settings_by_pk?: Maybe<Badma_Settings>;
  /** fetch data from the table in a streaming manner: "badma.settings" */
  badma_settings_stream: Array<Badma_Settings>;
  /** fetch data from the table: "badma.tournament_games" */
  badma_tournament_games: Array<Badma_Tournament_Games>;
  /** fetch aggregated fields from the table: "badma.tournament_games" */
  badma_tournament_games_aggregate: Badma_Tournament_Games_Aggregate;
  /** fetch data from the table: "badma.tournament_games" using primary key columns */
  badma_tournament_games_by_pk?: Maybe<Badma_Tournament_Games>;
  /** fetch data from the table in a streaming manner: "badma.tournament_games" */
  badma_tournament_games_stream: Array<Badma_Tournament_Games>;
  /** fetch data from the table: "badma.tournament_participants" */
  badma_tournament_participants: Array<Badma_Tournament_Participants>;
  /** fetch aggregated fields from the table: "badma.tournament_participants" */
  badma_tournament_participants_aggregate: Badma_Tournament_Participants_Aggregate;
  /** fetch data from the table: "badma.tournament_participants" using primary key columns */
  badma_tournament_participants_by_pk?: Maybe<Badma_Tournament_Participants>;
  /** fetch data from the table in a streaming manner: "badma.tournament_participants" */
  badma_tournament_participants_stream: Array<Badma_Tournament_Participants>;
  /** fetch data from the table: "badma.tournament_scores" */
  badma_tournament_scores: Array<Badma_Tournament_Scores>;
  /** fetch aggregated fields from the table: "badma.tournament_scores" */
  badma_tournament_scores_aggregate: Badma_Tournament_Scores_Aggregate;
  /** fetch data from the table: "badma.tournament_scores" using primary key columns */
  badma_tournament_scores_by_pk?: Maybe<Badma_Tournament_Scores>;
  /** fetch data from the table in a streaming manner: "badma.tournament_scores" */
  badma_tournament_scores_stream: Array<Badma_Tournament_Scores>;
  /** fetch data from the table: "badma.tournaments" */
  badma_tournaments: Array<Badma_Tournaments>;
  /** fetch aggregated fields from the table: "badma.tournaments" */
  badma_tournaments_aggregate: Badma_Tournaments_Aggregate;
  /** fetch data from the table: "badma.tournaments" using primary key columns */
  badma_tournaments_by_pk?: Maybe<Badma_Tournaments>;
  /** fetch data from the table in a streaming manner: "badma.tournaments" */
  badma_tournaments_stream: Array<Badma_Tournaments>;
  /** fetch data from the table: "debug" */
  debug: Array<Debug>;
  /** fetch aggregated fields from the table: "debug" */
  debug_aggregate: Debug_Aggregate;
  /** fetch data from the table: "debug" using primary key columns */
  debug_by_pk?: Maybe<Debug>;
  /** fetch data from the table in a streaming manner: "debug" */
  debug_stream: Array<Debug>;
  /** fetch data from the table: "hasyx" */
  hasyx: Array<Hasyx>;
  /** fetch aggregated fields from the table: "hasyx" */
  hasyx_aggregate: Hasyx_Aggregate;
  /** fetch data from the table in a streaming manner: "hasyx" */
  hasyx_stream: Array<Hasyx>;
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
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
  /** fetch data from the table in a streaming manner: "users" */
  users_stream: Array<Users>;
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

export type Subscription_RootBadma_AisArgs = {
  distinct_on?: InputMaybe<Array<Badma_Ais_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Ais_Order_By>>;
  where?: InputMaybe<Badma_Ais_Bool_Exp>;
};

export type Subscription_RootBadma_Ais_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Ais_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Ais_Order_By>>;
  where?: InputMaybe<Badma_Ais_Bool_Exp>;
};

export type Subscription_RootBadma_Ais_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootBadma_Ais_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Badma_Ais_Stream_Cursor_Input>>;
  where?: InputMaybe<Badma_Ais_Bool_Exp>;
};

export type Subscription_RootBadma_ClubsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Clubs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Clubs_Order_By>>;
  where?: InputMaybe<Badma_Clubs_Bool_Exp>;
};

export type Subscription_RootBadma_Clubs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Clubs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Clubs_Order_By>>;
  where?: InputMaybe<Badma_Clubs_Bool_Exp>;
};

export type Subscription_RootBadma_Clubs_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootBadma_Clubs_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Badma_Clubs_Stream_Cursor_Input>>;
  where?: InputMaybe<Badma_Clubs_Bool_Exp>;
};

export type Subscription_RootBadma_ErrorsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Errors_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Errors_Order_By>>;
  where?: InputMaybe<Badma_Errors_Bool_Exp>;
};

export type Subscription_RootBadma_Errors_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Errors_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Errors_Order_By>>;
  where?: InputMaybe<Badma_Errors_Bool_Exp>;
};

export type Subscription_RootBadma_Errors_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootBadma_Errors_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Badma_Errors_Stream_Cursor_Input>>;
  where?: InputMaybe<Badma_Errors_Bool_Exp>;
};

export type Subscription_RootBadma_GamesArgs = {
  distinct_on?: InputMaybe<Array<Badma_Games_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Games_Order_By>>;
  where?: InputMaybe<Badma_Games_Bool_Exp>;
};

export type Subscription_RootBadma_Games_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Games_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Games_Order_By>>;
  where?: InputMaybe<Badma_Games_Bool_Exp>;
};

export type Subscription_RootBadma_Games_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootBadma_Games_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Badma_Games_Stream_Cursor_Input>>;
  where?: InputMaybe<Badma_Games_Bool_Exp>;
};

export type Subscription_RootBadma_In_ClubsArgs = {
  distinct_on?: InputMaybe<Array<Badma_In_Clubs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_In_Clubs_Order_By>>;
  where?: InputMaybe<Badma_In_Clubs_Bool_Exp>;
};

export type Subscription_RootBadma_In_Clubs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_In_Clubs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_In_Clubs_Order_By>>;
  where?: InputMaybe<Badma_In_Clubs_Bool_Exp>;
};

export type Subscription_RootBadma_In_Clubs_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootBadma_In_Clubs_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Badma_In_Clubs_Stream_Cursor_Input>>;
  where?: InputMaybe<Badma_In_Clubs_Bool_Exp>;
};

export type Subscription_RootBadma_ItemsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Items_Order_By>>;
  where?: InputMaybe<Badma_Items_Bool_Exp>;
};

export type Subscription_RootBadma_Items_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Items_Order_By>>;
  where?: InputMaybe<Badma_Items_Bool_Exp>;
};

export type Subscription_RootBadma_Items_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootBadma_Items_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Badma_Items_Stream_Cursor_Input>>;
  where?: InputMaybe<Badma_Items_Bool_Exp>;
};

export type Subscription_RootBadma_JoinsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Joins_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Joins_Order_By>>;
  where?: InputMaybe<Badma_Joins_Bool_Exp>;
};

export type Subscription_RootBadma_Joins_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Joins_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Joins_Order_By>>;
  where?: InputMaybe<Badma_Joins_Bool_Exp>;
};

export type Subscription_RootBadma_Joins_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootBadma_Joins_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Badma_Joins_Stream_Cursor_Input>>;
  where?: InputMaybe<Badma_Joins_Bool_Exp>;
};

export type Subscription_RootBadma_MovesArgs = {
  distinct_on?: InputMaybe<Array<Badma_Moves_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Moves_Order_By>>;
  where?: InputMaybe<Badma_Moves_Bool_Exp>;
};

export type Subscription_RootBadma_Moves_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Moves_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Moves_Order_By>>;
  where?: InputMaybe<Badma_Moves_Bool_Exp>;
};

export type Subscription_RootBadma_Moves_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootBadma_Moves_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Badma_Moves_Stream_Cursor_Input>>;
  where?: InputMaybe<Badma_Moves_Bool_Exp>;
};

export type Subscription_RootBadma_ServersArgs = {
  distinct_on?: InputMaybe<Array<Badma_Servers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Servers_Order_By>>;
  where?: InputMaybe<Badma_Servers_Bool_Exp>;
};

export type Subscription_RootBadma_Servers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Servers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Servers_Order_By>>;
  where?: InputMaybe<Badma_Servers_Bool_Exp>;
};

export type Subscription_RootBadma_Servers_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootBadma_Servers_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Badma_Servers_Stream_Cursor_Input>>;
  where?: InputMaybe<Badma_Servers_Bool_Exp>;
};

export type Subscription_RootBadma_SettingsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Settings_Order_By>>;
  where?: InputMaybe<Badma_Settings_Bool_Exp>;
};

export type Subscription_RootBadma_Settings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Settings_Order_By>>;
  where?: InputMaybe<Badma_Settings_Bool_Exp>;
};

export type Subscription_RootBadma_Settings_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootBadma_Settings_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Badma_Settings_Stream_Cursor_Input>>;
  where?: InputMaybe<Badma_Settings_Bool_Exp>;
};

export type Subscription_RootBadma_Tournament_GamesArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournament_Games_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournament_Games_Order_By>>;
  where?: InputMaybe<Badma_Tournament_Games_Bool_Exp>;
};

export type Subscription_RootBadma_Tournament_Games_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournament_Games_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournament_Games_Order_By>>;
  where?: InputMaybe<Badma_Tournament_Games_Bool_Exp>;
};

export type Subscription_RootBadma_Tournament_Games_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootBadma_Tournament_Games_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Badma_Tournament_Games_Stream_Cursor_Input>>;
  where?: InputMaybe<Badma_Tournament_Games_Bool_Exp>;
};

export type Subscription_RootBadma_Tournament_ParticipantsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournament_Participants_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournament_Participants_Order_By>>;
  where?: InputMaybe<Badma_Tournament_Participants_Bool_Exp>;
};

export type Subscription_RootBadma_Tournament_Participants_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournament_Participants_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournament_Participants_Order_By>>;
  where?: InputMaybe<Badma_Tournament_Participants_Bool_Exp>;
};

export type Subscription_RootBadma_Tournament_Participants_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootBadma_Tournament_Participants_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Badma_Tournament_Participants_Stream_Cursor_Input>>;
  where?: InputMaybe<Badma_Tournament_Participants_Bool_Exp>;
};

export type Subscription_RootBadma_Tournament_ScoresArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournament_Scores_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournament_Scores_Order_By>>;
  where?: InputMaybe<Badma_Tournament_Scores_Bool_Exp>;
};

export type Subscription_RootBadma_Tournament_Scores_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournament_Scores_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournament_Scores_Order_By>>;
  where?: InputMaybe<Badma_Tournament_Scores_Bool_Exp>;
};

export type Subscription_RootBadma_Tournament_Scores_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootBadma_Tournament_Scores_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Badma_Tournament_Scores_Stream_Cursor_Input>>;
  where?: InputMaybe<Badma_Tournament_Scores_Bool_Exp>;
};

export type Subscription_RootBadma_TournamentsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournaments_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournaments_Order_By>>;
  where?: InputMaybe<Badma_Tournaments_Bool_Exp>;
};

export type Subscription_RootBadma_Tournaments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournaments_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournaments_Order_By>>;
  where?: InputMaybe<Badma_Tournaments_Bool_Exp>;
};

export type Subscription_RootBadma_Tournaments_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootBadma_Tournaments_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Badma_Tournaments_Stream_Cursor_Input>>;
  where?: InputMaybe<Badma_Tournaments_Bool_Exp>;
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

/** columns and relationships of "users" */
export type Users = {
  __typename?: "users";
  _hasyx_schema_name?: Maybe<Scalars["String"]["output"]>;
  _hasyx_table_name?: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  accounts: Array<Accounts>;
  /** An aggregate relationship */
  accounts_aggregate: Accounts_Aggregate;
  /** An array relationship */
  ais: Array<Badma_Ais>;
  /** An aggregate relationship */
  ais_aggregate: Badma_Ais_Aggregate;
  created_at: Scalars["bigint"]["output"];
  /** An array relationship */
  created_in_clubs: Array<Badma_In_Clubs>;
  /** An aggregate relationship */
  created_in_clubs_aggregate: Badma_In_Clubs_Aggregate;
  /** User email address */
  email?: Maybe<Scalars["String"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["bigint"]["output"]>;
  /** An array relationship */
  errors: Array<Badma_Errors>;
  /** An aggregate relationship */
  errors_aggregate: Badma_Errors_Aggregate;
  /** An array relationship */
  games: Array<Badma_Games>;
  /** An aggregate relationship */
  games_aggregate: Badma_Games_Aggregate;
  /** Hasura role for permissions */
  hasura_role?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  hasyx?: Maybe<Hasyx>;
  id: Scalars["uuid"]["output"];
  /** User profile image URL */
  image?: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  in_clubs: Array<Badma_In_Clubs>;
  /** An aggregate relationship */
  in_clubs_aggregate: Badma_In_Clubs_Aggregate;
  /** Admin flag */
  is_admin?: Maybe<Scalars["Boolean"]["output"]>;
  /** An array relationship */
  items: Array<Badma_Items>;
  /** An aggregate relationship */
  items_aggregate: Badma_Items_Aggregate;
  /** An array relationship */
  joins: Array<Badma_Joins>;
  /** An aggregate relationship */
  joins_aggregate: Badma_Joins_Aggregate;
  /** An array relationship */
  moves: Array<Badma_Moves>;
  /** An aggregate relationship */
  moves_aggregate: Badma_Moves_Aggregate;
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
  /** An array relationship */
  owned_clubs: Array<Badma_Clubs>;
  /** An aggregate relationship */
  owned_clubs_aggregate: Badma_Clubs_Aggregate;
  /** User password hash */
  password?: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  settings: Array<Badma_Settings>;
  /** An aggregate relationship */
  settings_aggregate: Badma_Settings_Aggregate;
  /** An array relationship */
  tournament_participants: Array<Badma_Tournament_Participants>;
  /** An aggregate relationship */
  tournament_participants_aggregate: Badma_Tournament_Participants_Aggregate;
  /** An array relationship */
  tournaments: Array<Badma_Tournaments>;
  /** An aggregate relationship */
  tournaments_aggregate: Badma_Tournaments_Aggregate;
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
export type UsersAisArgs = {
  distinct_on?: InputMaybe<Array<Badma_Ais_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Ais_Order_By>>;
  where?: InputMaybe<Badma_Ais_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersAis_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Ais_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Ais_Order_By>>;
  where?: InputMaybe<Badma_Ais_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersCreated_In_ClubsArgs = {
  distinct_on?: InputMaybe<Array<Badma_In_Clubs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_In_Clubs_Order_By>>;
  where?: InputMaybe<Badma_In_Clubs_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersCreated_In_Clubs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_In_Clubs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_In_Clubs_Order_By>>;
  where?: InputMaybe<Badma_In_Clubs_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersErrorsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Errors_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Errors_Order_By>>;
  where?: InputMaybe<Badma_Errors_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersErrors_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Errors_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Errors_Order_By>>;
  where?: InputMaybe<Badma_Errors_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersGamesArgs = {
  distinct_on?: InputMaybe<Array<Badma_Games_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Games_Order_By>>;
  where?: InputMaybe<Badma_Games_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersGames_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Games_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Games_Order_By>>;
  where?: InputMaybe<Badma_Games_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersIn_ClubsArgs = {
  distinct_on?: InputMaybe<Array<Badma_In_Clubs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_In_Clubs_Order_By>>;
  where?: InputMaybe<Badma_In_Clubs_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersIn_Clubs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_In_Clubs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_In_Clubs_Order_By>>;
  where?: InputMaybe<Badma_In_Clubs_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersItemsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Items_Order_By>>;
  where?: InputMaybe<Badma_Items_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersItems_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Items_Order_By>>;
  where?: InputMaybe<Badma_Items_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersJoinsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Joins_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Joins_Order_By>>;
  where?: InputMaybe<Badma_Joins_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersJoins_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Joins_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Joins_Order_By>>;
  where?: InputMaybe<Badma_Joins_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersMovesArgs = {
  distinct_on?: InputMaybe<Array<Badma_Moves_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Moves_Order_By>>;
  where?: InputMaybe<Badma_Moves_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersMoves_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Moves_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Moves_Order_By>>;
  where?: InputMaybe<Badma_Moves_Bool_Exp>;
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

/** columns and relationships of "users" */
export type UsersOwned_ClubsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Clubs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Clubs_Order_By>>;
  where?: InputMaybe<Badma_Clubs_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersOwned_Clubs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Clubs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Clubs_Order_By>>;
  where?: InputMaybe<Badma_Clubs_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersSettingsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Settings_Order_By>>;
  where?: InputMaybe<Badma_Settings_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersSettings_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Settings_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Settings_Order_By>>;
  where?: InputMaybe<Badma_Settings_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersTournament_ParticipantsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournament_Participants_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournament_Participants_Order_By>>;
  where?: InputMaybe<Badma_Tournament_Participants_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersTournament_Participants_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournament_Participants_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournament_Participants_Order_By>>;
  where?: InputMaybe<Badma_Tournament_Participants_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersTournamentsArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournaments_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournaments_Order_By>>;
  where?: InputMaybe<Badma_Tournaments_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersTournaments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Badma_Tournaments_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Badma_Tournaments_Order_By>>;
  where?: InputMaybe<Badma_Tournaments_Bool_Exp>;
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
  ais?: InputMaybe<Badma_Ais_Bool_Exp>;
  ais_aggregate?: InputMaybe<Badma_Ais_Aggregate_Bool_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  created_in_clubs?: InputMaybe<Badma_In_Clubs_Bool_Exp>;
  created_in_clubs_aggregate?: InputMaybe<Badma_In_Clubs_Aggregate_Bool_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  email_verified?: InputMaybe<Bigint_Comparison_Exp>;
  errors?: InputMaybe<Badma_Errors_Bool_Exp>;
  errors_aggregate?: InputMaybe<Badma_Errors_Aggregate_Bool_Exp>;
  games?: InputMaybe<Badma_Games_Bool_Exp>;
  games_aggregate?: InputMaybe<Badma_Games_Aggregate_Bool_Exp>;
  hasura_role?: InputMaybe<String_Comparison_Exp>;
  hasyx?: InputMaybe<Hasyx_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  image?: InputMaybe<String_Comparison_Exp>;
  in_clubs?: InputMaybe<Badma_In_Clubs_Bool_Exp>;
  in_clubs_aggregate?: InputMaybe<Badma_In_Clubs_Aggregate_Bool_Exp>;
  is_admin?: InputMaybe<Boolean_Comparison_Exp>;
  items?: InputMaybe<Badma_Items_Bool_Exp>;
  items_aggregate?: InputMaybe<Badma_Items_Aggregate_Bool_Exp>;
  joins?: InputMaybe<Badma_Joins_Bool_Exp>;
  joins_aggregate?: InputMaybe<Badma_Joins_Aggregate_Bool_Exp>;
  moves?: InputMaybe<Badma_Moves_Bool_Exp>;
  moves_aggregate?: InputMaybe<Badma_Moves_Aggregate_Bool_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  notification_messages?: InputMaybe<Notification_Messages_Bool_Exp>;
  notification_messages_aggregate?: InputMaybe<Notification_Messages_Aggregate_Bool_Exp>;
  notification_permissions?: InputMaybe<Notification_Permissions_Bool_Exp>;
  notification_permissions_aggregate?: InputMaybe<Notification_Permissions_Aggregate_Bool_Exp>;
  owned_clubs?: InputMaybe<Badma_Clubs_Bool_Exp>;
  owned_clubs_aggregate?: InputMaybe<Badma_Clubs_Aggregate_Bool_Exp>;
  password?: InputMaybe<String_Comparison_Exp>;
  settings?: InputMaybe<Badma_Settings_Bool_Exp>;
  settings_aggregate?: InputMaybe<Badma_Settings_Aggregate_Bool_Exp>;
  tournament_participants?: InputMaybe<Badma_Tournament_Participants_Bool_Exp>;
  tournament_participants_aggregate?: InputMaybe<Badma_Tournament_Participants_Aggregate_Bool_Exp>;
  tournaments?: InputMaybe<Badma_Tournaments_Bool_Exp>;
  tournaments_aggregate?: InputMaybe<Badma_Tournaments_Aggregate_Bool_Exp>;
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
  ais?: InputMaybe<Badma_Ais_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  created_in_clubs?: InputMaybe<Badma_In_Clubs_Arr_Rel_Insert_Input>;
  /** User email address */
  email?: InputMaybe<Scalars["String"]["input"]>;
  /** Email verification timestamp */
  email_verified?: InputMaybe<Scalars["bigint"]["input"]>;
  errors?: InputMaybe<Badma_Errors_Arr_Rel_Insert_Input>;
  games?: InputMaybe<Badma_Games_Arr_Rel_Insert_Input>;
  /** Hasura role for permissions */
  hasura_role?: InputMaybe<Scalars["String"]["input"]>;
  hasyx?: InputMaybe<Hasyx_Obj_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** User profile image URL */
  image?: InputMaybe<Scalars["String"]["input"]>;
  in_clubs?: InputMaybe<Badma_In_Clubs_Arr_Rel_Insert_Input>;
  /** Admin flag */
  is_admin?: InputMaybe<Scalars["Boolean"]["input"]>;
  items?: InputMaybe<Badma_Items_Arr_Rel_Insert_Input>;
  joins?: InputMaybe<Badma_Joins_Arr_Rel_Insert_Input>;
  moves?: InputMaybe<Badma_Moves_Arr_Rel_Insert_Input>;
  /** User display name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  notification_messages?: InputMaybe<Notification_Messages_Arr_Rel_Insert_Input>;
  notification_permissions?: InputMaybe<Notification_Permissions_Arr_Rel_Insert_Input>;
  owned_clubs?: InputMaybe<Badma_Clubs_Arr_Rel_Insert_Input>;
  /** User password hash */
  password?: InputMaybe<Scalars["String"]["input"]>;
  settings?: InputMaybe<Badma_Settings_Arr_Rel_Insert_Input>;
  tournament_participants?: InputMaybe<Badma_Tournament_Participants_Arr_Rel_Insert_Input>;
  tournaments?: InputMaybe<Badma_Tournaments_Arr_Rel_Insert_Input>;
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
  /** User password hash */
  password?: Maybe<Scalars["String"]["output"]>;
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
  /** User password hash */
  password?: Maybe<Scalars["String"]["output"]>;
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
  ais_aggregate?: InputMaybe<Badma_Ais_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_in_clubs_aggregate?: InputMaybe<Badma_In_Clubs_Aggregate_Order_By>;
  email?: InputMaybe<Order_By>;
  email_verified?: InputMaybe<Order_By>;
  errors_aggregate?: InputMaybe<Badma_Errors_Aggregate_Order_By>;
  games_aggregate?: InputMaybe<Badma_Games_Aggregate_Order_By>;
  hasura_role?: InputMaybe<Order_By>;
  hasyx?: InputMaybe<Hasyx_Order_By>;
  id?: InputMaybe<Order_By>;
  image?: InputMaybe<Order_By>;
  in_clubs_aggregate?: InputMaybe<Badma_In_Clubs_Aggregate_Order_By>;
  is_admin?: InputMaybe<Order_By>;
  items_aggregate?: InputMaybe<Badma_Items_Aggregate_Order_By>;
  joins_aggregate?: InputMaybe<Badma_Joins_Aggregate_Order_By>;
  moves_aggregate?: InputMaybe<Badma_Moves_Aggregate_Order_By>;
  name?: InputMaybe<Order_By>;
  notification_messages_aggregate?: InputMaybe<Notification_Messages_Aggregate_Order_By>;
  notification_permissions_aggregate?: InputMaybe<Notification_Permissions_Aggregate_Order_By>;
  owned_clubs_aggregate?: InputMaybe<Badma_Clubs_Aggregate_Order_By>;
  password?: InputMaybe<Order_By>;
  settings_aggregate?: InputMaybe<Badma_Settings_Aggregate_Order_By>;
  tournament_participants_aggregate?: InputMaybe<Badma_Tournament_Participants_Aggregate_Order_By>;
  tournaments_aggregate?: InputMaybe<Badma_Tournaments_Aggregate_Order_By>;
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
  Password = "password",
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
  /** User password hash */
  password?: InputMaybe<Scalars["String"]["input"]>;
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
  /** User password hash */
  password?: InputMaybe<Scalars["String"]["input"]>;
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
  Password = "password",
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
