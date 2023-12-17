export type BaseModel = {
  id: number
  created_at: Date
  updated_at: Date
}

export type SoftDeletableBaseModel = BaseModel & {
  deleted: boolean
  deleted_at?: Date
}

/* Metropolis Entity Types */

export enum MetropolisEntityType {
  AGENT = 'agent',
  GROUP = 'group',
  CLIENT = 'client',
}

/**
 * Represents a base entity that can be an agent, a group or a client
 * @typedef {Object} BaseMetropolisEntity
 * @property {string} name - The name of the entity
 * @property {MetropolisEntityType} entity_type - The type of the entity
 */
export type BaseMetropolisEntity = SoftDeletableBaseModel & {
  name: string
  entity_type: MetropolisEntityType
}

export enum AgentType {
  PERSON = 'person',
  BOT = 'bot',
}

/**
 * Represents an agent entity
 * @typedef {Object} AgentMetropolisEntity
 * @property {MetropolisEntityType} entity_type - The type of the entity
 * @property {AgentType} agent_type - The type of the agent
 * @property {string} motivation - The motivation of the agent
 */
export type AgentMetropolisEntity = BaseMetropolisEntity & {
  entity_type: MetropolisEntityType.AGENT
  agent_type: AgentType
  motivation: string
}

export enum GroupType {
  GUILD = 'guild',
  ALLIANCE = 'alliance',
  TRIO = 'trio',
  TRIBE = 'tribe',
  SQUAD = 'squad',
  CHAPTER = 'chapter',
}

/**
 * Represents a group entity
 * @typedef {Object} GroupMetropolisEntity
 * @property {MetropolisEntityType} entity_type - The type of the entity
 * @property {GroupType} group_type - The type of the group
 * @property {string} mission - The mission of the group
 */
export type GroupMetropolisEntity = BaseMetropolisEntity & {
  entity_type: MetropolisEntityType.GROUP
  group_type: GroupType
  mission: string
}

/**
 * Represents an address
 * @typedef {Object} Address
 * @property {string} street - The street of the address
 * @property {string} number - The number of the address
 * @property {string} postal_code - The postal code of the address
 * @property {string} city - The city of the address
 * @property {string} country - The country of the address
 */
export type Address = {
  street: string
  number: string
  postal_code: string
  city: string
  country: string
}

/**
 * Represents a the information of a client
 * @typedef {Object} ClientInformation
 * @property {string} company_name - The name of the company
 * @property {string} person_name - The name of the person
 * @property {string} person_email - The email of the person
 * @property {Address} address - The address of the company
 * @property {string} phone_number - The phone number of the company
 */
export type ClientInformation = {
  company_name: string
  person_name?: string
  person_email?: string
  address: Address
  phone_number: string
}

/**
 * Represents a client entity
 * @typedef {Object} ClientMetropolisEntity
 * @property {MetropolisEntityType} entity_type - The type of the entity
 * @property {ClientInformation} information - The information of the client
 */
export type ClientMetropolisEntity = BaseMetropolisEntity & {
  entity_type: MetropolisEntityType.CLIENT
  information: ClientInformation
}

/**
 * Represents the relation of an agent being the head of a group
 * @typedef {Object} HeadOfRelation
 * @property {AgentMetropolisEntity} agent - The agent that is the head of the group
 * @property {GroupMetropolisEntity} group - The group that the agent is the head of
 */
export type HeadOfRelation = {
  agent: AgentMetropolisEntity
  group: GroupMetropolisEntity
}

/**
 * Represents the relation of an agent being a member of a group
 * @typedef {Object} GroupMembershipRelation
 * @property {AgentMetropolisEntity} agent - The agent that is a member of the group
 * @property {GroupMetropolisEntity} group - The group that the agent is a member of
 */
export type GroupMembershipRelation = {
  agent: AgentMetropolisEntity
  group: GroupMetropolisEntity
}

/**
 * Represents the relation of a group being a subgroup of another group
 * only lower groups can be subgroups of other groups
 * guilds cannot have subgroups
 * @typedef {Object} SubGroupRelation
 * @property {GroupMetropolisEntity} parent - The group that is the parent of the subgroup
 * @property {GroupMetropolisEntity} child - The group that is the child of the parent group
 */
export type SubGroupRelation = {
  parent: GroupMetropolisEntity
  child: GroupMetropolisEntity
}

/**
 * Represents the relation of an agent being a point of contact of a client
 * @typedef {Object} PointOfContactRelation
 * @property {AgentMetropolisEntity} agent - The agent that is the point of contact of the client
 * @property {ClientMetropolisEntity} client - The client that the agent is the point of contact of
 */
export type PointOfContactRelation = {
  agent: AgentMetropolisEntity
  client: ClientMetropolisEntity
}

/**
 * Represents the relation of an alliance with a client
 * @typedef {Object} RelatedClientRelation
 * @property {GroupMetropolisEntity} alliance - The alliance that is related to the client
 * @property {ClientMetropolisEntity} client - The client that is related to the alliance
 */
export type RelatedClientRelation = {
  alliance: GroupMetropolisEntity
  client: ClientMetropolisEntity
}

/* PoolOrAccount */

export enum PoolOrAccountType {
  POOL = 'pool',
  ACCOUNT = 'account',
}

/**
 * Represents a pool or account
 * @typedef {Object} PoolOrAccount
 * @property {string} name - The name of the pool or account
 * @property {PoolOrAccountType} type - The type of the pool or account
 */
export type PoolOrAccount = SoftDeletableBaseModel & {
  name: string
  type: PoolOrAccountType
}

/**
 * Represents the relation of an agent being the owner of a pool or account
 * @typedef {Object} PoolOrAccountOwnerRelation
 * @property {BaseMetropolisEntity} owner - The metropolis entity that is the owner of the pool or account
 * @property {PoolOrAccount} pool_or_account - The pool or account that the metropolis entity is the owner of
 */
export type PoolOrAccountOwnerRelation = {
  owner: BaseMetropolisEntity
  pool_or_account: PoolOrAccount
}

/* Task, Review, Activity */

/**
 * Represents a review
 * @typedef {Object} Review
 * @property {string} comments - The comments of the review
 */
export type Review = SoftDeletableBaseModel & {
  comments: string
}

/**
 * Represents the relation of an agent being the reviewer of a review
 * @typedef {Object} ReviewerRelation
 * @property {AgentMetropolisEntity} reviewer - The agent that is the reviewer of the review
 * @property {Review} review - The review that the agent is the reviewer of
 */
export type ReviewerRelation = {
  reviewer: AgentMetropolisEntity
  review: Review
}

/**
 * Represents an activity
 * @typedef {Object} Activity
 * @property {number} start - The start time of the activity
 * @property {number} end - The end time of the activity
 * @property {number} breaks - The amount of time taken for breaks during the activity
 */
export type Activity = SoftDeletableBaseModel & {
  start: number
  end: number
  breaks: number
}

/**
 * Represents the relation of an agent being the performer of an activity
 * @typedef {Object} ActivityPerformerRelation
 * @property {AgentMetropolisEntity} performer - The agent that is the performer of the activity
 * @property {Activity} activity - The activity that the agent is the performer of
 */
export type ActivityPerformerRelation = {
  performer: AgentMetropolisEntity
  activity: Activity
}

export enum LifecycleStateType {
  NOT_STARTED = 'not started',
  IN_PROGRESS = 'in progress',
  AWAITING_REVIEW = 'awaiting review',
  CHANGES_REQUESTED = 'changes requested',
  APPROVED = 'approved',
  GAVE_UP = 'gave up',
  DONE = 'done',
}

/**
 * Represents a task
 * @typedef {Object} Task
 * @property {string} name - The name of the task
 * @property {string} description - The description of the task
 * @property {number} weight - The weight of the task
 * @property {number} performance - The performance of the task
 * @property {LifecycleStateType} lifecycle_state - The lifecycle state of the task
 */
export type Task = SoftDeletableBaseModel & {
  name: string
  description: string
  requestor: AgentMetropolisEntity | GroupMetropolisEntity
  provider: AgentMetropolisEntity | GroupMetropolisEntity
  weight: number
  performance: number
  lifecycle_state: LifecycleStateType
  due_date: Date
}

/**
 * Represents the relation of a task being a parent of another task
 * @typedef {Object} ParentTaskRelation
 * @property {Task} parent - The task that is the parent of the child task
 * @property {Task} child - The task that is the child of the parent task
 */
export type ParentTaskRelation = {
  parent: Task
  child: Task
}

/**
 * Represents the relation of a task blocking another task
 * @typedef {Object} BlockerTaskRelation
 * @property {Task} blocker - The task that is blocking the blocked task
 * @property {Task} blocked - The task that is blocked by the blocker task
 */
export type BlockerTaskRelation = {
  blocker: Task
  blocked: Task
}

/**
 * Represents the relation of a review being related to a task
 * @typedef {Object} TaskReviewRelation
 * @property {Task} task - The task that is related to the review
 * @property {Review} review - The review that is related to the task
 */
export type TaskReviewRelation = {
  task: Task
  review: Review
}

/**
 * Represents the relation of an activity being related to a task
 * @typedef {Object} TaskActivityRelation
 * @property {Task} task - The task that is related to the activity
 * @property {Activity} activity - The activity that is related to the task
 */
export type TaskActivityRelation = {
  task: Task
  activity: Activity
}

/* Transaction */

export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TransactionStrategy {
  MONEY = 'money',
  STATIC_PERCENTAGE = 'static percentage',
  DYNAMIC_PERCENTAGE = 'dynamic percentage',
}

export enum TransactionType {
  REVENUE = 'revenue',
  INTERNAL_TRANSFER = 'internal transfer',
  EXPENSE = 'expense',
  BALANCE = 'balance',
  EQUITY = 'equity',
}

export enum TransactionCategory {
  CLIENT_PAYMENT = 'client payment',
  LOAN = 'loan',
  DAD_TAX = 'dad tax',
  GUILD_SERVICE = 'guild service',
  HEAD_PAYMENT = 'head payment',
  TASK_PAYMENT = 'task payment',
  LOAN_PAYMENT = 'loan payment',
  AD_HOC_PAYMENT = 'ad hoc payment',
}

/**
 * Represents a transaction
 * @typedef {Object} Transaction
 * @property {string} name - The name of the transaction
 * @property {TransactionStatus} status - The status of the transaction
 * @property {Date} date - The date of the transaction
 * @property {TransactionStrategy} strategy - The strategy of the transaction
 * @property {TransactionType} type - The type of the transaction
 * @property {TransactionCategory} category - The category of the transaction
 * @property {string} additional_context - The additional context of the transaction
 */
export type BaseTransaction = SoftDeletableBaseModel & {
  name: string
  from: PoolOrAccount
  to: PoolOrAccount
  status: TransactionStatus
  date: Date
  strategy: TransactionStrategy
  type: TransactionType
  category: TransactionCategory
  additional_context?: string
}

/**
 * Represents a money transaction
 * @typedef {Object} MoneyTransaction
 * @property {TransactionStrategy} strategy - The strategy of the transaction
 * @property {number} amount - The amount of the transaction
 * @property {string} currency - The currency of the transaction
 */
export type MoneyTransaction = BaseTransaction & {
  strategy: TransactionStrategy.MONEY
  amount: number
  currency: string
}

/**
 * Represents a percentage transaction
 * @typedef {Object} PercentageTransaction
 * @property {TransactionStrategy} strategy - The strategy of the transaction
 * @property {number} percentage - The percentage of the transaction
 */
export type PercentageTransaction = BaseTransaction & {
  strategy: TransactionStrategy.STATIC_PERCENTAGE | TransactionStrategy.DYNAMIC_PERCENTAGE
  percentage: number
}
