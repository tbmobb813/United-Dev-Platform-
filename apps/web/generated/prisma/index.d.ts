
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model VerificationToken
 * 
 */
export type VerificationToken = $Result.DefaultSelection<Prisma.$VerificationTokenPayload>
/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model ProjectMember
 * 
 */
export type ProjectMember = $Result.DefaultSelection<Prisma.$ProjectMemberPayload>
/**
 * Model ProjectFile
 * 
 */
export type ProjectFile = $Result.DefaultSelection<Prisma.$ProjectFilePayload>
/**
 * Model FileActivity
 * 
 */
export type FileActivity = $Result.DefaultSelection<Prisma.$FileActivityPayload>
/**
 * Model CollaborationSession
 * 
 */
export type CollaborationSession = $Result.DefaultSelection<Prisma.$CollaborationSessionPayload>
/**
 * Model SessionParticipant
 * 
 */
export type SessionParticipant = $Result.DefaultSelection<Prisma.$SessionParticipantPayload>
/**
 * Model AiChatSession
 * 
 */
export type AiChatSession = $Result.DefaultSelection<Prisma.$AiChatSessionPayload>
/**
 * Model AiMessage
 * 
 */
export type AiMessage = $Result.DefaultSelection<Prisma.$AiMessagePayload>
/**
 * Model GitRepository
 * 
 */
export type GitRepository = $Result.DefaultSelection<Prisma.$GitRepositoryPayload>
/**
 * Model GitCommit
 * 
 */
export type GitCommit = $Result.DefaultSelection<Prisma.$GitCommitPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ProjectVisibility: {
  PRIVATE: 'PRIVATE',
  PUBLIC: 'PUBLIC',
  TEAM: 'TEAM'
};

export type ProjectVisibility = (typeof ProjectVisibility)[keyof typeof ProjectVisibility]


export const ProjectRole: {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  DEVELOPER: 'DEVELOPER',
  VIEWER: 'VIEWER'
};

export type ProjectRole = (typeof ProjectRole)[keyof typeof ProjectRole]


export const FileType: {
  FILE: 'FILE',
  DIRECTORY: 'DIRECTORY'
};

export type FileType = (typeof FileType)[keyof typeof FileType]


export const FileAction: {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  RENAME: 'RENAME',
  MOVE: 'MOVE',
  VIEW: 'VIEW'
};

export type FileAction = (typeof FileAction)[keyof typeof FileAction]


export const AiContext: {
  GENERAL: 'GENERAL',
  CODE_REVIEW: 'CODE_REVIEW',
  DEBUGGING: 'DEBUGGING',
  ARCHITECTURE: 'ARCHITECTURE',
  DOCUMENTATION: 'DOCUMENTATION'
};

export type AiContext = (typeof AiContext)[keyof typeof AiContext]


export const MessageRole: {
  USER: 'USER',
  ASSISTANT: 'ASSISTANT',
  SYSTEM: 'SYSTEM'
};

export type MessageRole = (typeof MessageRole)[keyof typeof MessageRole]


export const SyncStatus: {
  PENDING: 'PENDING',
  SYNCING: 'SYNCING',
  SYNCED: 'SYNCED',
  ERROR: 'ERROR'
};

export type SyncStatus = (typeof SyncStatus)[keyof typeof SyncStatus]

}

export type ProjectVisibility = $Enums.ProjectVisibility

export const ProjectVisibility: typeof $Enums.ProjectVisibility

export type ProjectRole = $Enums.ProjectRole

export const ProjectRole: typeof $Enums.ProjectRole

export type FileType = $Enums.FileType

export const FileType: typeof $Enums.FileType

export type FileAction = $Enums.FileAction

export const FileAction: typeof $Enums.FileAction

export type AiContext = $Enums.AiContext

export const AiContext: typeof $Enums.AiContext

export type MessageRole = $Enums.MessageRole

export const MessageRole: typeof $Enums.MessageRole

export type SyncStatus = $Enums.SyncStatus

export const SyncStatus: typeof $Enums.SyncStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verificationToken`: Exposes CRUD operations for the **VerificationToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VerificationTokens
    * const verificationTokens = await prisma.verificationToken.findMany()
    * ```
    */
  get verificationToken(): Prisma.VerificationTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.projectMember`: Exposes CRUD operations for the **ProjectMember** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProjectMembers
    * const projectMembers = await prisma.projectMember.findMany()
    * ```
    */
  get projectMember(): Prisma.ProjectMemberDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.projectFile`: Exposes CRUD operations for the **ProjectFile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProjectFiles
    * const projectFiles = await prisma.projectFile.findMany()
    * ```
    */
  get projectFile(): Prisma.ProjectFileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.fileActivity`: Exposes CRUD operations for the **FileActivity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FileActivities
    * const fileActivities = await prisma.fileActivity.findMany()
    * ```
    */
  get fileActivity(): Prisma.FileActivityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.collaborationSession`: Exposes CRUD operations for the **CollaborationSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CollaborationSessions
    * const collaborationSessions = await prisma.collaborationSession.findMany()
    * ```
    */
  get collaborationSession(): Prisma.CollaborationSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sessionParticipant`: Exposes CRUD operations for the **SessionParticipant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SessionParticipants
    * const sessionParticipants = await prisma.sessionParticipant.findMany()
    * ```
    */
  get sessionParticipant(): Prisma.SessionParticipantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aiChatSession`: Exposes CRUD operations for the **AiChatSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiChatSessions
    * const aiChatSessions = await prisma.aiChatSession.findMany()
    * ```
    */
  get aiChatSession(): Prisma.AiChatSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aiMessage`: Exposes CRUD operations for the **AiMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiMessages
    * const aiMessages = await prisma.aiMessage.findMany()
    * ```
    */
  get aiMessage(): Prisma.AiMessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gitRepository`: Exposes CRUD operations for the **GitRepository** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GitRepositories
    * const gitRepositories = await prisma.gitRepository.findMany()
    * ```
    */
  get gitRepository(): Prisma.GitRepositoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gitCommit`: Exposes CRUD operations for the **GitCommit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GitCommits
    * const gitCommits = await prisma.gitCommit.findMany()
    * ```
    */
  get gitCommit(): Prisma.GitCommitDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.17.1
   * Query Engine version: 272a37d34178c2894197e17273bf937f25acdeac
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Account: 'Account',
    Session: 'Session',
    VerificationToken: 'VerificationToken',
    Project: 'Project',
    ProjectMember: 'ProjectMember',
    ProjectFile: 'ProjectFile',
    FileActivity: 'FileActivity',
    CollaborationSession: 'CollaborationSession',
    SessionParticipant: 'SessionParticipant',
    AiChatSession: 'AiChatSession',
    AiMessage: 'AiMessage',
    GitRepository: 'GitRepository',
    GitCommit: 'GitCommit'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "account" | "session" | "verificationToken" | "project" | "projectMember" | "projectFile" | "fileActivity" | "collaborationSession" | "sessionParticipant" | "aiChatSession" | "aiMessage" | "gitRepository" | "gitCommit"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      VerificationToken: {
        payload: Prisma.$VerificationTokenPayload<ExtArgs>
        fields: Prisma.VerificationTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findFirst: {
            args: Prisma.VerificationTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findMany: {
            args: Prisma.VerificationTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          create: {
            args: Prisma.VerificationTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          createMany: {
            args: Prisma.VerificationTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          delete: {
            args: Prisma.VerificationTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          update: {
            args: Prisma.VerificationTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          deleteMany: {
            args: Prisma.VerificationTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VerificationTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          upsert: {
            args: Prisma.VerificationTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          aggregate: {
            args: Prisma.VerificationTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerificationToken>
          }
          groupBy: {
            args: Prisma.VerificationTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationTokenCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenCountAggregateOutputType> | number
          }
        }
      }
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      ProjectMember: {
        payload: Prisma.$ProjectMemberPayload<ExtArgs>
        fields: Prisma.ProjectMemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectMemberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectMemberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>
          }
          findFirst: {
            args: Prisma.ProjectMemberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectMemberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>
          }
          findMany: {
            args: Prisma.ProjectMemberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>[]
          }
          create: {
            args: Prisma.ProjectMemberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>
          }
          createMany: {
            args: Prisma.ProjectMemberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectMemberCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>[]
          }
          delete: {
            args: Prisma.ProjectMemberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>
          }
          update: {
            args: Prisma.ProjectMemberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>
          }
          deleteMany: {
            args: Prisma.ProjectMemberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectMemberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectMemberUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>[]
          }
          upsert: {
            args: Prisma.ProjectMemberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectMemberPayload>
          }
          aggregate: {
            args: Prisma.ProjectMemberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectMember>
          }
          groupBy: {
            args: Prisma.ProjectMemberGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectMemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectMemberCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectMemberCountAggregateOutputType> | number
          }
        }
      }
      ProjectFile: {
        payload: Prisma.$ProjectFilePayload<ExtArgs>
        fields: Prisma.ProjectFileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          findFirst: {
            args: Prisma.ProjectFileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          findMany: {
            args: Prisma.ProjectFileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>[]
          }
          create: {
            args: Prisma.ProjectFileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          createMany: {
            args: Prisma.ProjectFileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectFileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>[]
          }
          delete: {
            args: Prisma.ProjectFileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          update: {
            args: Prisma.ProjectFileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          deleteMany: {
            args: Prisma.ProjectFileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectFileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectFileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>[]
          }
          upsert: {
            args: Prisma.ProjectFileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          aggregate: {
            args: Prisma.ProjectFileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectFile>
          }
          groupBy: {
            args: Prisma.ProjectFileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectFileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectFileCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectFileCountAggregateOutputType> | number
          }
        }
      }
      FileActivity: {
        payload: Prisma.$FileActivityPayload<ExtArgs>
        fields: Prisma.FileActivityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FileActivityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileActivityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FileActivityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileActivityPayload>
          }
          findFirst: {
            args: Prisma.FileActivityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileActivityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FileActivityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileActivityPayload>
          }
          findMany: {
            args: Prisma.FileActivityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileActivityPayload>[]
          }
          create: {
            args: Prisma.FileActivityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileActivityPayload>
          }
          createMany: {
            args: Prisma.FileActivityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FileActivityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileActivityPayload>[]
          }
          delete: {
            args: Prisma.FileActivityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileActivityPayload>
          }
          update: {
            args: Prisma.FileActivityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileActivityPayload>
          }
          deleteMany: {
            args: Prisma.FileActivityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FileActivityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FileActivityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileActivityPayload>[]
          }
          upsert: {
            args: Prisma.FileActivityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileActivityPayload>
          }
          aggregate: {
            args: Prisma.FileActivityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFileActivity>
          }
          groupBy: {
            args: Prisma.FileActivityGroupByArgs<ExtArgs>
            result: $Utils.Optional<FileActivityGroupByOutputType>[]
          }
          count: {
            args: Prisma.FileActivityCountArgs<ExtArgs>
            result: $Utils.Optional<FileActivityCountAggregateOutputType> | number
          }
        }
      }
      CollaborationSession: {
        payload: Prisma.$CollaborationSessionPayload<ExtArgs>
        fields: Prisma.CollaborationSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CollaborationSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollaborationSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CollaborationSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollaborationSessionPayload>
          }
          findFirst: {
            args: Prisma.CollaborationSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollaborationSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CollaborationSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollaborationSessionPayload>
          }
          findMany: {
            args: Prisma.CollaborationSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollaborationSessionPayload>[]
          }
          create: {
            args: Prisma.CollaborationSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollaborationSessionPayload>
          }
          createMany: {
            args: Prisma.CollaborationSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CollaborationSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollaborationSessionPayload>[]
          }
          delete: {
            args: Prisma.CollaborationSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollaborationSessionPayload>
          }
          update: {
            args: Prisma.CollaborationSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollaborationSessionPayload>
          }
          deleteMany: {
            args: Prisma.CollaborationSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CollaborationSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CollaborationSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollaborationSessionPayload>[]
          }
          upsert: {
            args: Prisma.CollaborationSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollaborationSessionPayload>
          }
          aggregate: {
            args: Prisma.CollaborationSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCollaborationSession>
          }
          groupBy: {
            args: Prisma.CollaborationSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<CollaborationSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.CollaborationSessionCountArgs<ExtArgs>
            result: $Utils.Optional<CollaborationSessionCountAggregateOutputType> | number
          }
        }
      }
      SessionParticipant: {
        payload: Prisma.$SessionParticipantPayload<ExtArgs>
        fields: Prisma.SessionParticipantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionParticipantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionParticipantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionParticipantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionParticipantPayload>
          }
          findFirst: {
            args: Prisma.SessionParticipantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionParticipantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionParticipantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionParticipantPayload>
          }
          findMany: {
            args: Prisma.SessionParticipantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionParticipantPayload>[]
          }
          create: {
            args: Prisma.SessionParticipantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionParticipantPayload>
          }
          createMany: {
            args: Prisma.SessionParticipantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionParticipantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionParticipantPayload>[]
          }
          delete: {
            args: Prisma.SessionParticipantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionParticipantPayload>
          }
          update: {
            args: Prisma.SessionParticipantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionParticipantPayload>
          }
          deleteMany: {
            args: Prisma.SessionParticipantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionParticipantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionParticipantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionParticipantPayload>[]
          }
          upsert: {
            args: Prisma.SessionParticipantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionParticipantPayload>
          }
          aggregate: {
            args: Prisma.SessionParticipantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSessionParticipant>
          }
          groupBy: {
            args: Prisma.SessionParticipantGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionParticipantGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionParticipantCountArgs<ExtArgs>
            result: $Utils.Optional<SessionParticipantCountAggregateOutputType> | number
          }
        }
      }
      AiChatSession: {
        payload: Prisma.$AiChatSessionPayload<ExtArgs>
        fields: Prisma.AiChatSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiChatSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiChatSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiChatSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiChatSessionPayload>
          }
          findFirst: {
            args: Prisma.AiChatSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiChatSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiChatSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiChatSessionPayload>
          }
          findMany: {
            args: Prisma.AiChatSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiChatSessionPayload>[]
          }
          create: {
            args: Prisma.AiChatSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiChatSessionPayload>
          }
          createMany: {
            args: Prisma.AiChatSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiChatSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiChatSessionPayload>[]
          }
          delete: {
            args: Prisma.AiChatSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiChatSessionPayload>
          }
          update: {
            args: Prisma.AiChatSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiChatSessionPayload>
          }
          deleteMany: {
            args: Prisma.AiChatSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiChatSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AiChatSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiChatSessionPayload>[]
          }
          upsert: {
            args: Prisma.AiChatSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiChatSessionPayload>
          }
          aggregate: {
            args: Prisma.AiChatSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiChatSession>
          }
          groupBy: {
            args: Prisma.AiChatSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiChatSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiChatSessionCountArgs<ExtArgs>
            result: $Utils.Optional<AiChatSessionCountAggregateOutputType> | number
          }
        }
      }
      AiMessage: {
        payload: Prisma.$AiMessagePayload<ExtArgs>
        fields: Prisma.AiMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMessagePayload>
          }
          findFirst: {
            args: Prisma.AiMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMessagePayload>
          }
          findMany: {
            args: Prisma.AiMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMessagePayload>[]
          }
          create: {
            args: Prisma.AiMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMessagePayload>
          }
          createMany: {
            args: Prisma.AiMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMessagePayload>[]
          }
          delete: {
            args: Prisma.AiMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMessagePayload>
          }
          update: {
            args: Prisma.AiMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMessagePayload>
          }
          deleteMany: {
            args: Prisma.AiMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AiMessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMessagePayload>[]
          }
          upsert: {
            args: Prisma.AiMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMessagePayload>
          }
          aggregate: {
            args: Prisma.AiMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiMessage>
          }
          groupBy: {
            args: Prisma.AiMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiMessageCountArgs<ExtArgs>
            result: $Utils.Optional<AiMessageCountAggregateOutputType> | number
          }
        }
      }
      GitRepository: {
        payload: Prisma.$GitRepositoryPayload<ExtArgs>
        fields: Prisma.GitRepositoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GitRepositoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GitRepositoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GitRepositoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GitRepositoryPayload>
          }
          findFirst: {
            args: Prisma.GitRepositoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GitRepositoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GitRepositoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GitRepositoryPayload>
          }
          findMany: {
            args: Prisma.GitRepositoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GitRepositoryPayload>[]
          }
          create: {
            args: Prisma.GitRepositoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GitRepositoryPayload>
          }
          createMany: {
            args: Prisma.GitRepositoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GitRepositoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GitRepositoryPayload>[]
          }
          delete: {
            args: Prisma.GitRepositoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GitRepositoryPayload>
          }
          update: {
            args: Prisma.GitRepositoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GitRepositoryPayload>
          }
          deleteMany: {
            args: Prisma.GitRepositoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GitRepositoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GitRepositoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GitRepositoryPayload>[]
          }
          upsert: {
            args: Prisma.GitRepositoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GitRepositoryPayload>
          }
          aggregate: {
            args: Prisma.GitRepositoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGitRepository>
          }
          groupBy: {
            args: Prisma.GitRepositoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<GitRepositoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.GitRepositoryCountArgs<ExtArgs>
            result: $Utils.Optional<GitRepositoryCountAggregateOutputType> | number
          }
        }
      }
      GitCommit: {
        payload: Prisma.$GitCommitPayload<ExtArgs>
        fields: Prisma.GitCommitFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GitCommitFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GitCommitPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GitCommitFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GitCommitPayload>
          }
          findFirst: {
            args: Prisma.GitCommitFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GitCommitPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GitCommitFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GitCommitPayload>
          }
          findMany: {
            args: Prisma.GitCommitFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GitCommitPayload>[]
          }
          create: {
            args: Prisma.GitCommitCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GitCommitPayload>
          }
          createMany: {
            args: Prisma.GitCommitCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GitCommitCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GitCommitPayload>[]
          }
          delete: {
            args: Prisma.GitCommitDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GitCommitPayload>
          }
          update: {
            args: Prisma.GitCommitUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GitCommitPayload>
          }
          deleteMany: {
            args: Prisma.GitCommitDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GitCommitUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GitCommitUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GitCommitPayload>[]
          }
          upsert: {
            args: Prisma.GitCommitUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GitCommitPayload>
          }
          aggregate: {
            args: Prisma.GitCommitAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGitCommit>
          }
          groupBy: {
            args: Prisma.GitCommitGroupByArgs<ExtArgs>
            result: $Utils.Optional<GitCommitGroupByOutputType>[]
          }
          count: {
            args: Prisma.GitCommitCountArgs<ExtArgs>
            result: $Utils.Optional<GitCommitCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    account?: AccountOmit
    session?: SessionOmit
    verificationToken?: VerificationTokenOmit
    project?: ProjectOmit
    projectMember?: ProjectMemberOmit
    projectFile?: ProjectFileOmit
    fileActivity?: FileActivityOmit
    collaborationSession?: CollaborationSessionOmit
    sessionParticipant?: SessionParticipantOmit
    aiChatSession?: AiChatSessionOmit
    aiMessage?: AiMessageOmit
    gitRepository?: GitRepositoryOmit
    gitCommit?: GitCommitOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    ownedProjects: number
    memberships: number
    aiSessions: number
    fileActivities: number
    sessionParticipations: number
    accounts: number
    sessions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ownedProjects?: boolean | UserCountOutputTypeCountOwnedProjectsArgs
    memberships?: boolean | UserCountOutputTypeCountMembershipsArgs
    aiSessions?: boolean | UserCountOutputTypeCountAiSessionsArgs
    fileActivities?: boolean | UserCountOutputTypeCountFileActivitiesArgs
    sessionParticipations?: boolean | UserCountOutputTypeCountSessionParticipationsArgs
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOwnedProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMembershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectMemberWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAiSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiChatSessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFileActivitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileActivityWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionParticipationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionParticipantWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }


  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    files: number
    members: number
    sessions: number
    aiSessions: number
  }

  export type ProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    files?: boolean | ProjectCountOutputTypeCountFilesArgs
    members?: boolean | ProjectCountOutputTypeCountMembersArgs
    sessions?: boolean | ProjectCountOutputTypeCountSessionsArgs
    aiSessions?: boolean | ProjectCountOutputTypeCountAiSessionsArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectFileWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectMemberWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CollaborationSessionWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountAiSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiChatSessionWhereInput
  }


  /**
   * Count Type ProjectFileCountOutputType
   */

  export type ProjectFileCountOutputType = {
    activities: number
  }

  export type ProjectFileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    activities?: boolean | ProjectFileCountOutputTypeCountActivitiesArgs
  }

  // Custom InputTypes
  /**
   * ProjectFileCountOutputType without action
   */
  export type ProjectFileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFileCountOutputType
     */
    select?: ProjectFileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectFileCountOutputType without action
   */
  export type ProjectFileCountOutputTypeCountActivitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileActivityWhereInput
  }


  /**
   * Count Type CollaborationSessionCountOutputType
   */

  export type CollaborationSessionCountOutputType = {
    participants: number
  }

  export type CollaborationSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | CollaborationSessionCountOutputTypeCountParticipantsArgs
  }

  // Custom InputTypes
  /**
   * CollaborationSessionCountOutputType without action
   */
  export type CollaborationSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollaborationSessionCountOutputType
     */
    select?: CollaborationSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CollaborationSessionCountOutputType without action
   */
  export type CollaborationSessionCountOutputTypeCountParticipantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionParticipantWhereInput
  }


  /**
   * Count Type AiChatSessionCountOutputType
   */

  export type AiChatSessionCountOutputType = {
    messages: number
  }

  export type AiChatSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | AiChatSessionCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * AiChatSessionCountOutputType without action
   */
  export type AiChatSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiChatSessionCountOutputType
     */
    select?: AiChatSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AiChatSessionCountOutputType without action
   */
  export type AiChatSessionCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiMessageWhereInput
  }


  /**
   * Count Type GitRepositoryCountOutputType
   */

  export type GitRepositoryCountOutputType = {
    commits: number
  }

  export type GitRepositoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    commits?: boolean | GitRepositoryCountOutputTypeCountCommitsArgs
  }

  // Custom InputTypes
  /**
   * GitRepositoryCountOutputType without action
   */
  export type GitRepositoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitRepositoryCountOutputType
     */
    select?: GitRepositoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GitRepositoryCountOutputType without action
   */
  export type GitRepositoryCountOutputTypeCountCommitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GitCommitWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    name: string | null
    avatar: string | null
    githubId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    image: string | null
    emailVerified: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    name: string | null
    avatar: string | null
    githubId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    image: string | null
    emailVerified: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    username: number
    name: number
    avatar: number
    githubId: number
    createdAt: number
    updatedAt: number
    image: number
    emailVerified: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    username?: true
    name?: true
    avatar?: true
    githubId?: true
    createdAt?: true
    updatedAt?: true
    image?: true
    emailVerified?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    username?: true
    name?: true
    avatar?: true
    githubId?: true
    createdAt?: true
    updatedAt?: true
    image?: true
    emailVerified?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    username?: true
    name?: true
    avatar?: true
    githubId?: true
    createdAt?: true
    updatedAt?: true
    image?: true
    emailVerified?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    username: string
    name: string | null
    avatar: string | null
    githubId: string | null
    createdAt: Date
    updatedAt: Date
    image: string | null
    emailVerified: Date | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    name?: boolean
    avatar?: boolean
    githubId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    image?: boolean
    emailVerified?: boolean
    ownedProjects?: boolean | User$ownedProjectsArgs<ExtArgs>
    memberships?: boolean | User$membershipsArgs<ExtArgs>
    aiSessions?: boolean | User$aiSessionsArgs<ExtArgs>
    fileActivities?: boolean | User$fileActivitiesArgs<ExtArgs>
    sessionParticipations?: boolean | User$sessionParticipationsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    name?: boolean
    avatar?: boolean
    githubId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    image?: boolean
    emailVerified?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    name?: boolean
    avatar?: boolean
    githubId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    image?: boolean
    emailVerified?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    username?: boolean
    name?: boolean
    avatar?: boolean
    githubId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    image?: boolean
    emailVerified?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "username" | "name" | "avatar" | "githubId" | "createdAt" | "updatedAt" | "image" | "emailVerified", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ownedProjects?: boolean | User$ownedProjectsArgs<ExtArgs>
    memberships?: boolean | User$membershipsArgs<ExtArgs>
    aiSessions?: boolean | User$aiSessionsArgs<ExtArgs>
    fileActivities?: boolean | User$fileActivitiesArgs<ExtArgs>
    sessionParticipations?: boolean | User$sessionParticipationsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      ownedProjects: Prisma.$ProjectPayload<ExtArgs>[]
      memberships: Prisma.$ProjectMemberPayload<ExtArgs>[]
      aiSessions: Prisma.$AiChatSessionPayload<ExtArgs>[]
      fileActivities: Prisma.$FileActivityPayload<ExtArgs>[]
      sessionParticipations: Prisma.$SessionParticipantPayload<ExtArgs>[]
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      username: string
      name: string | null
      avatar: string | null
      githubId: string | null
      createdAt: Date
      updatedAt: Date
      image: string | null
      emailVerified: Date | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ownedProjects<T extends User$ownedProjectsArgs<ExtArgs> = {}>(args?: Subset<T, User$ownedProjectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    memberships<T extends User$membershipsArgs<ExtArgs> = {}>(args?: Subset<T, User$membershipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    aiSessions<T extends User$aiSessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$aiSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiChatSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    fileActivities<T extends User$fileActivitiesArgs<ExtArgs> = {}>(args?: Subset<T, User$fileActivitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessionParticipations<T extends User$sessionParticipationsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionParticipationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly githubId: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly image: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.ownedProjects
   */
  export type User$ownedProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * User.memberships
   */
  export type User$membershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    where?: ProjectMemberWhereInput
    orderBy?: ProjectMemberOrderByWithRelationInput | ProjectMemberOrderByWithRelationInput[]
    cursor?: ProjectMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectMemberScalarFieldEnum | ProjectMemberScalarFieldEnum[]
  }

  /**
   * User.aiSessions
   */
  export type User$aiSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiChatSession
     */
    select?: AiChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiChatSession
     */
    omit?: AiChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiChatSessionInclude<ExtArgs> | null
    where?: AiChatSessionWhereInput
    orderBy?: AiChatSessionOrderByWithRelationInput | AiChatSessionOrderByWithRelationInput[]
    cursor?: AiChatSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AiChatSessionScalarFieldEnum | AiChatSessionScalarFieldEnum[]
  }

  /**
   * User.fileActivities
   */
  export type User$fileActivitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileActivity
     */
    select?: FileActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileActivity
     */
    omit?: FileActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileActivityInclude<ExtArgs> | null
    where?: FileActivityWhereInput
    orderBy?: FileActivityOrderByWithRelationInput | FileActivityOrderByWithRelationInput[]
    cursor?: FileActivityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FileActivityScalarFieldEnum | FileActivityScalarFieldEnum[]
  }

  /**
   * User.sessionParticipations
   */
  export type User$sessionParticipationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionParticipant
     */
    select?: SessionParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionParticipant
     */
    omit?: SessionParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionParticipantInclude<ExtArgs> | null
    where?: SessionParticipantWhereInput
    orderBy?: SessionParticipantOrderByWithRelationInput | SessionParticipantOrderByWithRelationInput[]
    cursor?: SessionParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionParticipantScalarFieldEnum | SessionParticipantScalarFieldEnum[]
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountAvgAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountSumAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    provider: number
    providerAccountId: number
    refresh_token: number
    access_token: number
    expires_at: number
    token_type: number
    scope: number
    id_token: number
    session_state: number
    _all: number
  }


  export type AccountAvgAggregateInputType = {
    expires_at?: true
  }

  export type AccountSumAggregateInputType = {
    expires_at?: true
  }

  export type AccountMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _avg?: AccountAvgAggregateInputType
    _sum?: AccountSumAggregateInputType
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "provider" | "providerAccountId" | "refresh_token" | "access_token" | "expires_at" | "token_type" | "scope" | "id_token" | "session_state", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      provider: string
      providerAccountId: string
      refresh_token: string | null
      access_token: string | null
      expires_at: number | null
      token_type: string | null
      scope: string | null
      id_token: string | null
      session_state: string | null
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly type: FieldRef<"Account", 'String'>
    readonly provider: FieldRef<"Account", 'String'>
    readonly providerAccountId: FieldRef<"Account", 'String'>
    readonly refresh_token: FieldRef<"Account", 'String'>
    readonly access_token: FieldRef<"Account", 'String'>
    readonly expires_at: FieldRef<"Account", 'Int'>
    readonly token_type: FieldRef<"Account", 'String'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly id_token: FieldRef<"Account", 'String'>
    readonly session_state: FieldRef<"Account", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    sessionToken: number
    userId: number
    expires: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    sessionToken: string
    userId: string
    expires: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionToken" | "userId" | "expires", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionToken: string
      userId: string
      expires: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly sessionToken: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly expires: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model VerificationToken
   */

  export type AggregateVerificationToken = {
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  export type VerificationTokenMinAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenMaxAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenCountAggregateOutputType = {
    identifier: number
    token: number
    expires: number
    _all: number
  }


  export type VerificationTokenMinAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenMaxAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenCountAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
    _all?: true
  }

  export type VerificationTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationToken to aggregate.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VerificationTokens
    **/
    _count?: true | VerificationTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type GetVerificationTokenAggregateType<T extends VerificationTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateVerificationToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerificationToken[P]>
      : GetScalarType<T[P], AggregateVerificationToken[P]>
  }




  export type VerificationTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationTokenWhereInput
    orderBy?: VerificationTokenOrderByWithAggregationInput | VerificationTokenOrderByWithAggregationInput[]
    by: VerificationTokenScalarFieldEnum[] | VerificationTokenScalarFieldEnum
    having?: VerificationTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationTokenCountAggregateInputType | true
    _min?: VerificationTokenMinAggregateInputType
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type VerificationTokenGroupByOutputType = {
    identifier: string
    token: string
    expires: Date
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  type GetVerificationTokenGroupByPayload<T extends VerificationTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
        }
      >
    >


  export type VerificationTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectScalar = {
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }

  export type VerificationTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"identifier" | "token" | "expires", ExtArgs["result"]["verificationToken"]>

  export type $VerificationTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VerificationToken"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      identifier: string
      token: string
      expires: Date
    }, ExtArgs["result"]["verificationToken"]>
    composites: {}
  }

  type VerificationTokenGetPayload<S extends boolean | null | undefined | VerificationTokenDefaultArgs> = $Result.GetResult<Prisma.$VerificationTokenPayload, S>

  type VerificationTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationTokenCountAggregateInputType | true
    }

  export interface VerificationTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VerificationToken'], meta: { name: 'VerificationToken' } }
    /**
     * Find zero or one VerificationToken that matches the filter.
     * @param {VerificationTokenFindUniqueArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationTokenFindUniqueArgs>(args: SelectSubset<T, VerificationTokenFindUniqueArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VerificationToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationTokenFindUniqueOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationTokenFindFirstArgs>(args?: SelectSubset<T, VerificationTokenFindFirstArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VerificationTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany()
     * 
     * // Get first 10 VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany({ take: 10 })
     * 
     * // Only select the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.findMany({ select: { identifier: true } })
     * 
     */
    findMany<T extends VerificationTokenFindManyArgs>(args?: SelectSubset<T, VerificationTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VerificationToken.
     * @param {VerificationTokenCreateArgs} args - Arguments to create a VerificationToken.
     * @example
     * // Create one VerificationToken
     * const VerificationToken = await prisma.verificationToken.create({
     *   data: {
     *     // ... data to create a VerificationToken
     *   }
     * })
     * 
     */
    create<T extends VerificationTokenCreateArgs>(args: SelectSubset<T, VerificationTokenCreateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VerificationTokens.
     * @param {VerificationTokenCreateManyArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationTokenCreateManyArgs>(args?: SelectSubset<T, VerificationTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VerificationTokens and returns the data saved in the database.
     * @param {VerificationTokenCreateManyAndReturnArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VerificationTokens and only return the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.createManyAndReturn({
     *   select: { identifier: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VerificationToken.
     * @param {VerificationTokenDeleteArgs} args - Arguments to delete one VerificationToken.
     * @example
     * // Delete one VerificationToken
     * const VerificationToken = await prisma.verificationToken.delete({
     *   where: {
     *     // ... filter to delete one VerificationToken
     *   }
     * })
     * 
     */
    delete<T extends VerificationTokenDeleteArgs>(args: SelectSubset<T, VerificationTokenDeleteArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VerificationToken.
     * @param {VerificationTokenUpdateArgs} args - Arguments to update one VerificationToken.
     * @example
     * // Update one VerificationToken
     * const verificationToken = await prisma.verificationToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationTokenUpdateArgs>(args: SelectSubset<T, VerificationTokenUpdateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VerificationTokens.
     * @param {VerificationTokenDeleteManyArgs} args - Arguments to filter VerificationTokens to delete.
     * @example
     * // Delete a few VerificationTokens
     * const { count } = await prisma.verificationToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationTokenDeleteManyArgs>(args?: SelectSubset<T, VerificationTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationTokenUpdateManyArgs>(args: SelectSubset<T, VerificationTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens and returns the data updated in the database.
     * @param {VerificationTokenUpdateManyAndReturnArgs} args - Arguments to update many VerificationTokens.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VerificationTokens and only return the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.updateManyAndReturn({
     *   select: { identifier: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VerificationTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, VerificationTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VerificationToken.
     * @param {VerificationTokenUpsertArgs} args - Arguments to update or create a VerificationToken.
     * @example
     * // Update or create a VerificationToken
     * const verificationToken = await prisma.verificationToken.upsert({
     *   create: {
     *     // ... data to create a VerificationToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VerificationToken we want to update
     *   }
     * })
     */
    upsert<T extends VerificationTokenUpsertArgs>(args: SelectSubset<T, VerificationTokenUpsertArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenCountArgs} args - Arguments to filter VerificationTokens to count.
     * @example
     * // Count the number of VerificationTokens
     * const count = await prisma.verificationToken.count({
     *   where: {
     *     // ... the filter for the VerificationTokens we want to count
     *   }
     * })
    **/
    count<T extends VerificationTokenCountArgs>(
      args?: Subset<T, VerificationTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VerificationTokenAggregateArgs>(args: Subset<T, VerificationTokenAggregateArgs>): Prisma.PrismaPromise<GetVerificationTokenAggregateType<T>>

    /**
     * Group by VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VerificationTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationTokenGroupByArgs['orderBy'] }
        : { orderBy?: VerificationTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VerificationTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VerificationToken model
   */
  readonly fields: VerificationTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VerificationToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VerificationToken model
   */
  interface VerificationTokenFieldRefs {
    readonly identifier: FieldRef<"VerificationToken", 'String'>
    readonly token: FieldRef<"VerificationToken", 'String'>
    readonly expires: FieldRef<"VerificationToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VerificationToken findUnique
   */
  export type VerificationTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findUniqueOrThrow
   */
  export type VerificationTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findFirst
   */
  export type VerificationTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findFirstOrThrow
   */
  export type VerificationTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findMany
   */
  export type VerificationTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationTokens to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken create
   */
  export type VerificationTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data needed to create a VerificationToken.
     */
    data: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
  }

  /**
   * VerificationToken createMany
   */
  export type VerificationTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationToken createManyAndReturn
   */
  export type VerificationTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationToken update
   */
  export type VerificationTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data needed to update a VerificationToken.
     */
    data: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
    /**
     * Choose, which VerificationToken to update.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken updateMany
   */
  export type VerificationTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to update.
     */
    limit?: number
  }

  /**
   * VerificationToken updateManyAndReturn
   */
  export type VerificationTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to update.
     */
    limit?: number
  }

  /**
   * VerificationToken upsert
   */
  export type VerificationTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The filter to search for the VerificationToken to update in case it exists.
     */
    where: VerificationTokenWhereUniqueInput
    /**
     * In case the VerificationToken found by the `where` argument doesn't exist, create a new VerificationToken with this data.
     */
    create: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
    /**
     * In case the VerificationToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
  }

  /**
   * VerificationToken delete
   */
  export type VerificationTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter which VerificationToken to delete.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken deleteMany
   */
  export type VerificationTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationTokens to delete
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to delete.
     */
    limit?: number
  }

  /**
   * VerificationToken without action
   */
  export type VerificationTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
  }


  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    visibility: $Enums.ProjectVisibility | null
    repositoryUrl: string | null
    ownerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    visibility: $Enums.ProjectVisibility | null
    repositoryUrl: string | null
    ownerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    name: number
    description: number
    visibility: number
    repositoryUrl: number
    ownerId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProjectMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    visibility?: true
    repositoryUrl?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    visibility?: true
    repositoryUrl?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    visibility?: true
    repositoryUrl?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    name: string
    description: string | null
    visibility: $Enums.ProjectVisibility
    repositoryUrl: string | null
    ownerId: string
    createdAt: Date
    updatedAt: Date
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    visibility?: boolean
    repositoryUrl?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    files?: boolean | Project$filesArgs<ExtArgs>
    members?: boolean | Project$membersArgs<ExtArgs>
    sessions?: boolean | Project$sessionsArgs<ExtArgs>
    aiSessions?: boolean | Project$aiSessionsArgs<ExtArgs>
    gitRepository?: boolean | Project$gitRepositoryArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    visibility?: boolean
    repositoryUrl?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    visibility?: boolean
    repositoryUrl?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    visibility?: boolean
    repositoryUrl?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "visibility" | "repositoryUrl" | "ownerId" | "createdAt" | "updatedAt", ExtArgs["result"]["project"]>
  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    files?: boolean | Project$filesArgs<ExtArgs>
    members?: boolean | Project$membersArgs<ExtArgs>
    sessions?: boolean | Project$sessionsArgs<ExtArgs>
    aiSessions?: boolean | Project$aiSessionsArgs<ExtArgs>
    gitRepository?: boolean | Project$gitRepositoryArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      owner: Prisma.$UserPayload<ExtArgs>
      files: Prisma.$ProjectFilePayload<ExtArgs>[]
      members: Prisma.$ProjectMemberPayload<ExtArgs>[]
      sessions: Prisma.$CollaborationSessionPayload<ExtArgs>[]
      aiSessions: Prisma.$AiChatSessionPayload<ExtArgs>[]
      gitRepository: Prisma.$GitRepositoryPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      visibility: $Enums.ProjectVisibility
      repositoryUrl: string | null
      ownerId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects and returns the data updated in the database.
     * @param {ProjectUpdateManyAndReturnArgs} args - Arguments to update many Projects.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    owner<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    files<T extends Project$filesArgs<ExtArgs> = {}>(args?: Subset<T, Project$filesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    members<T extends Project$membersArgs<ExtArgs> = {}>(args?: Subset<T, Project$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends Project$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, Project$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollaborationSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    aiSessions<T extends Project$aiSessionsArgs<ExtArgs> = {}>(args?: Subset<T, Project$aiSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiChatSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    gitRepository<T extends Project$gitRepositoryArgs<ExtArgs> = {}>(args?: Subset<T, Project$gitRepositoryArgs<ExtArgs>>): Prisma__GitRepositoryClient<$Result.GetResult<Prisma.$GitRepositoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Project model
   */
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'String'>
    readonly name: FieldRef<"Project", 'String'>
    readonly description: FieldRef<"Project", 'String'>
    readonly visibility: FieldRef<"Project", 'ProjectVisibility'>
    readonly repositoryUrl: FieldRef<"Project", 'String'>
    readonly ownerId: FieldRef<"Project", 'String'>
    readonly createdAt: FieldRef<"Project", 'DateTime'>
    readonly updatedAt: FieldRef<"Project", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project updateManyAndReturn
   */
  export type ProjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to delete.
     */
    limit?: number
  }

  /**
   * Project.files
   */
  export type Project$filesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    where?: ProjectFileWhereInput
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    cursor?: ProjectFileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * Project.members
   */
  export type Project$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    where?: ProjectMemberWhereInput
    orderBy?: ProjectMemberOrderByWithRelationInput | ProjectMemberOrderByWithRelationInput[]
    cursor?: ProjectMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectMemberScalarFieldEnum | ProjectMemberScalarFieldEnum[]
  }

  /**
   * Project.sessions
   */
  export type Project$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollaborationSession
     */
    select?: CollaborationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollaborationSession
     */
    omit?: CollaborationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaborationSessionInclude<ExtArgs> | null
    where?: CollaborationSessionWhereInput
    orderBy?: CollaborationSessionOrderByWithRelationInput | CollaborationSessionOrderByWithRelationInput[]
    cursor?: CollaborationSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CollaborationSessionScalarFieldEnum | CollaborationSessionScalarFieldEnum[]
  }

  /**
   * Project.aiSessions
   */
  export type Project$aiSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiChatSession
     */
    select?: AiChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiChatSession
     */
    omit?: AiChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiChatSessionInclude<ExtArgs> | null
    where?: AiChatSessionWhereInput
    orderBy?: AiChatSessionOrderByWithRelationInput | AiChatSessionOrderByWithRelationInput[]
    cursor?: AiChatSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AiChatSessionScalarFieldEnum | AiChatSessionScalarFieldEnum[]
  }

  /**
   * Project.gitRepository
   */
  export type Project$gitRepositoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitRepository
     */
    select?: GitRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GitRepository
     */
    omit?: GitRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitRepositoryInclude<ExtArgs> | null
    where?: GitRepositoryWhereInput
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Model ProjectMember
   */

  export type AggregateProjectMember = {
    _count: ProjectMemberCountAggregateOutputType | null
    _min: ProjectMemberMinAggregateOutputType | null
    _max: ProjectMemberMaxAggregateOutputType | null
  }

  export type ProjectMemberMinAggregateOutputType = {
    id: string | null
    role: $Enums.ProjectRole | null
    userId: string | null
    projectId: string | null
    joinedAt: Date | null
  }

  export type ProjectMemberMaxAggregateOutputType = {
    id: string | null
    role: $Enums.ProjectRole | null
    userId: string | null
    projectId: string | null
    joinedAt: Date | null
  }

  export type ProjectMemberCountAggregateOutputType = {
    id: number
    role: number
    userId: number
    projectId: number
    joinedAt: number
    _all: number
  }


  export type ProjectMemberMinAggregateInputType = {
    id?: true
    role?: true
    userId?: true
    projectId?: true
    joinedAt?: true
  }

  export type ProjectMemberMaxAggregateInputType = {
    id?: true
    role?: true
    userId?: true
    projectId?: true
    joinedAt?: true
  }

  export type ProjectMemberCountAggregateInputType = {
    id?: true
    role?: true
    userId?: true
    projectId?: true
    joinedAt?: true
    _all?: true
  }

  export type ProjectMemberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectMember to aggregate.
     */
    where?: ProjectMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectMembers to fetch.
     */
    orderBy?: ProjectMemberOrderByWithRelationInput | ProjectMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProjectMembers
    **/
    _count?: true | ProjectMemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMemberMaxAggregateInputType
  }

  export type GetProjectMemberAggregateType<T extends ProjectMemberAggregateArgs> = {
        [P in keyof T & keyof AggregateProjectMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectMember[P]>
      : GetScalarType<T[P], AggregateProjectMember[P]>
  }




  export type ProjectMemberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectMemberWhereInput
    orderBy?: ProjectMemberOrderByWithAggregationInput | ProjectMemberOrderByWithAggregationInput[]
    by: ProjectMemberScalarFieldEnum[] | ProjectMemberScalarFieldEnum
    having?: ProjectMemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectMemberCountAggregateInputType | true
    _min?: ProjectMemberMinAggregateInputType
    _max?: ProjectMemberMaxAggregateInputType
  }

  export type ProjectMemberGroupByOutputType = {
    id: string
    role: $Enums.ProjectRole
    userId: string
    projectId: string
    joinedAt: Date
    _count: ProjectMemberCountAggregateOutputType | null
    _min: ProjectMemberMinAggregateOutputType | null
    _max: ProjectMemberMaxAggregateOutputType | null
  }

  type GetProjectMemberGroupByPayload<T extends ProjectMemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectMemberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectMemberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectMemberGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectMemberGroupByOutputType[P]>
        }
      >
    >


  export type ProjectMemberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    userId?: boolean
    projectId?: boolean
    joinedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectMember"]>

  export type ProjectMemberSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    userId?: boolean
    projectId?: boolean
    joinedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectMember"]>

  export type ProjectMemberSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    userId?: boolean
    projectId?: boolean
    joinedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectMember"]>

  export type ProjectMemberSelectScalar = {
    id?: boolean
    role?: boolean
    userId?: boolean
    projectId?: boolean
    joinedAt?: boolean
  }

  export type ProjectMemberOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "role" | "userId" | "projectId" | "joinedAt", ExtArgs["result"]["projectMember"]>
  export type ProjectMemberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectMemberIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectMemberIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $ProjectMemberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProjectMember"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      role: $Enums.ProjectRole
      userId: string
      projectId: string
      joinedAt: Date
    }, ExtArgs["result"]["projectMember"]>
    composites: {}
  }

  type ProjectMemberGetPayload<S extends boolean | null | undefined | ProjectMemberDefaultArgs> = $Result.GetResult<Prisma.$ProjectMemberPayload, S>

  type ProjectMemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectMemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectMemberCountAggregateInputType | true
    }

  export interface ProjectMemberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProjectMember'], meta: { name: 'ProjectMember' } }
    /**
     * Find zero or one ProjectMember that matches the filter.
     * @param {ProjectMemberFindUniqueArgs} args - Arguments to find a ProjectMember
     * @example
     * // Get one ProjectMember
     * const projectMember = await prisma.projectMember.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectMemberFindUniqueArgs>(args: SelectSubset<T, ProjectMemberFindUniqueArgs<ExtArgs>>): Prisma__ProjectMemberClient<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProjectMember that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectMemberFindUniqueOrThrowArgs} args - Arguments to find a ProjectMember
     * @example
     * // Get one ProjectMember
     * const projectMember = await prisma.projectMember.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectMemberFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectMemberClient<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectMember that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMemberFindFirstArgs} args - Arguments to find a ProjectMember
     * @example
     * // Get one ProjectMember
     * const projectMember = await prisma.projectMember.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectMemberFindFirstArgs>(args?: SelectSubset<T, ProjectMemberFindFirstArgs<ExtArgs>>): Prisma__ProjectMemberClient<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectMember that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMemberFindFirstOrThrowArgs} args - Arguments to find a ProjectMember
     * @example
     * // Get one ProjectMember
     * const projectMember = await prisma.projectMember.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectMemberFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectMemberClient<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProjectMembers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectMembers
     * const projectMembers = await prisma.projectMember.findMany()
     * 
     * // Get first 10 ProjectMembers
     * const projectMembers = await prisma.projectMember.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectMemberWithIdOnly = await prisma.projectMember.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectMemberFindManyArgs>(args?: SelectSubset<T, ProjectMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProjectMember.
     * @param {ProjectMemberCreateArgs} args - Arguments to create a ProjectMember.
     * @example
     * // Create one ProjectMember
     * const ProjectMember = await prisma.projectMember.create({
     *   data: {
     *     // ... data to create a ProjectMember
     *   }
     * })
     * 
     */
    create<T extends ProjectMemberCreateArgs>(args: SelectSubset<T, ProjectMemberCreateArgs<ExtArgs>>): Prisma__ProjectMemberClient<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProjectMembers.
     * @param {ProjectMemberCreateManyArgs} args - Arguments to create many ProjectMembers.
     * @example
     * // Create many ProjectMembers
     * const projectMember = await prisma.projectMember.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectMemberCreateManyArgs>(args?: SelectSubset<T, ProjectMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectMembers and returns the data saved in the database.
     * @param {ProjectMemberCreateManyAndReturnArgs} args - Arguments to create many ProjectMembers.
     * @example
     * // Create many ProjectMembers
     * const projectMember = await prisma.projectMember.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProjectMembers and only return the `id`
     * const projectMemberWithIdOnly = await prisma.projectMember.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectMemberCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectMemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProjectMember.
     * @param {ProjectMemberDeleteArgs} args - Arguments to delete one ProjectMember.
     * @example
     * // Delete one ProjectMember
     * const ProjectMember = await prisma.projectMember.delete({
     *   where: {
     *     // ... filter to delete one ProjectMember
     *   }
     * })
     * 
     */
    delete<T extends ProjectMemberDeleteArgs>(args: SelectSubset<T, ProjectMemberDeleteArgs<ExtArgs>>): Prisma__ProjectMemberClient<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProjectMember.
     * @param {ProjectMemberUpdateArgs} args - Arguments to update one ProjectMember.
     * @example
     * // Update one ProjectMember
     * const projectMember = await prisma.projectMember.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectMemberUpdateArgs>(args: SelectSubset<T, ProjectMemberUpdateArgs<ExtArgs>>): Prisma__ProjectMemberClient<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProjectMembers.
     * @param {ProjectMemberDeleteManyArgs} args - Arguments to filter ProjectMembers to delete.
     * @example
     * // Delete a few ProjectMembers
     * const { count } = await prisma.projectMember.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectMemberDeleteManyArgs>(args?: SelectSubset<T, ProjectMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectMembers
     * const projectMember = await prisma.projectMember.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectMemberUpdateManyArgs>(args: SelectSubset<T, ProjectMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectMembers and returns the data updated in the database.
     * @param {ProjectMemberUpdateManyAndReturnArgs} args - Arguments to update many ProjectMembers.
     * @example
     * // Update many ProjectMembers
     * const projectMember = await prisma.projectMember.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProjectMembers and only return the `id`
     * const projectMemberWithIdOnly = await prisma.projectMember.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectMemberUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectMemberUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProjectMember.
     * @param {ProjectMemberUpsertArgs} args - Arguments to update or create a ProjectMember.
     * @example
     * // Update or create a ProjectMember
     * const projectMember = await prisma.projectMember.upsert({
     *   create: {
     *     // ... data to create a ProjectMember
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectMember we want to update
     *   }
     * })
     */
    upsert<T extends ProjectMemberUpsertArgs>(args: SelectSubset<T, ProjectMemberUpsertArgs<ExtArgs>>): Prisma__ProjectMemberClient<$Result.GetResult<Prisma.$ProjectMemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProjectMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMemberCountArgs} args - Arguments to filter ProjectMembers to count.
     * @example
     * // Count the number of ProjectMembers
     * const count = await prisma.projectMember.count({
     *   where: {
     *     // ... the filter for the ProjectMembers we want to count
     *   }
     * })
    **/
    count<T extends ProjectMemberCountArgs>(
      args?: Subset<T, ProjectMemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectMemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectMemberAggregateArgs>(args: Subset<T, ProjectMemberAggregateArgs>): Prisma.PrismaPromise<GetProjectMemberAggregateType<T>>

    /**
     * Group by ProjectMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectMemberGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectMemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectMemberGroupByArgs['orderBy'] }
        : { orderBy?: ProjectMemberGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProjectMember model
   */
  readonly fields: ProjectMemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectMember.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectMemberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProjectMember model
   */
  interface ProjectMemberFieldRefs {
    readonly id: FieldRef<"ProjectMember", 'String'>
    readonly role: FieldRef<"ProjectMember", 'ProjectRole'>
    readonly userId: FieldRef<"ProjectMember", 'String'>
    readonly projectId: FieldRef<"ProjectMember", 'String'>
    readonly joinedAt: FieldRef<"ProjectMember", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProjectMember findUnique
   */
  export type ProjectMemberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMember to fetch.
     */
    where: ProjectMemberWhereUniqueInput
  }

  /**
   * ProjectMember findUniqueOrThrow
   */
  export type ProjectMemberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMember to fetch.
     */
    where: ProjectMemberWhereUniqueInput
  }

  /**
   * ProjectMember findFirst
   */
  export type ProjectMemberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMember to fetch.
     */
    where?: ProjectMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectMembers to fetch.
     */
    orderBy?: ProjectMemberOrderByWithRelationInput | ProjectMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectMembers.
     */
    cursor?: ProjectMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectMembers.
     */
    distinct?: ProjectMemberScalarFieldEnum | ProjectMemberScalarFieldEnum[]
  }

  /**
   * ProjectMember findFirstOrThrow
   */
  export type ProjectMemberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMember to fetch.
     */
    where?: ProjectMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectMembers to fetch.
     */
    orderBy?: ProjectMemberOrderByWithRelationInput | ProjectMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectMembers.
     */
    cursor?: ProjectMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectMembers.
     */
    distinct?: ProjectMemberScalarFieldEnum | ProjectMemberScalarFieldEnum[]
  }

  /**
   * ProjectMember findMany
   */
  export type ProjectMemberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * Filter, which ProjectMembers to fetch.
     */
    where?: ProjectMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectMembers to fetch.
     */
    orderBy?: ProjectMemberOrderByWithRelationInput | ProjectMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProjectMembers.
     */
    cursor?: ProjectMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectMembers.
     */
    skip?: number
    distinct?: ProjectMemberScalarFieldEnum | ProjectMemberScalarFieldEnum[]
  }

  /**
   * ProjectMember create
   */
  export type ProjectMemberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectMember.
     */
    data: XOR<ProjectMemberCreateInput, ProjectMemberUncheckedCreateInput>
  }

  /**
   * ProjectMember createMany
   */
  export type ProjectMemberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProjectMembers.
     */
    data: ProjectMemberCreateManyInput | ProjectMemberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProjectMember createManyAndReturn
   */
  export type ProjectMemberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * The data used to create many ProjectMembers.
     */
    data: ProjectMemberCreateManyInput | ProjectMemberCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectMember update
   */
  export type ProjectMemberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectMember.
     */
    data: XOR<ProjectMemberUpdateInput, ProjectMemberUncheckedUpdateInput>
    /**
     * Choose, which ProjectMember to update.
     */
    where: ProjectMemberWhereUniqueInput
  }

  /**
   * ProjectMember updateMany
   */
  export type ProjectMemberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProjectMembers.
     */
    data: XOR<ProjectMemberUpdateManyMutationInput, ProjectMemberUncheckedUpdateManyInput>
    /**
     * Filter which ProjectMembers to update
     */
    where?: ProjectMemberWhereInput
    /**
     * Limit how many ProjectMembers to update.
     */
    limit?: number
  }

  /**
   * ProjectMember updateManyAndReturn
   */
  export type ProjectMemberUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * The data used to update ProjectMembers.
     */
    data: XOR<ProjectMemberUpdateManyMutationInput, ProjectMemberUncheckedUpdateManyInput>
    /**
     * Filter which ProjectMembers to update
     */
    where?: ProjectMemberWhereInput
    /**
     * Limit how many ProjectMembers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectMember upsert
   */
  export type ProjectMemberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectMember to update in case it exists.
     */
    where: ProjectMemberWhereUniqueInput
    /**
     * In case the ProjectMember found by the `where` argument doesn't exist, create a new ProjectMember with this data.
     */
    create: XOR<ProjectMemberCreateInput, ProjectMemberUncheckedCreateInput>
    /**
     * In case the ProjectMember was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectMemberUpdateInput, ProjectMemberUncheckedUpdateInput>
  }

  /**
   * ProjectMember delete
   */
  export type ProjectMemberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
    /**
     * Filter which ProjectMember to delete.
     */
    where: ProjectMemberWhereUniqueInput
  }

  /**
   * ProjectMember deleteMany
   */
  export type ProjectMemberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectMembers to delete
     */
    where?: ProjectMemberWhereInput
    /**
     * Limit how many ProjectMembers to delete.
     */
    limit?: number
  }

  /**
   * ProjectMember without action
   */
  export type ProjectMemberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectMember
     */
    select?: ProjectMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectMember
     */
    omit?: ProjectMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectMemberInclude<ExtArgs> | null
  }


  /**
   * Model ProjectFile
   */

  export type AggregateProjectFile = {
    _count: ProjectFileCountAggregateOutputType | null
    _avg: ProjectFileAvgAggregateOutputType | null
    _sum: ProjectFileSumAggregateOutputType | null
    _min: ProjectFileMinAggregateOutputType | null
    _max: ProjectFileMaxAggregateOutputType | null
  }

  export type ProjectFileAvgAggregateOutputType = {
    size: number | null
  }

  export type ProjectFileSumAggregateOutputType = {
    size: number | null
  }

  export type ProjectFileMinAggregateOutputType = {
    id: string | null
    path: string | null
    name: string | null
    type: $Enums.FileType | null
    content: string | null
    size: number | null
    mimeType: string | null
    projectId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectFileMaxAggregateOutputType = {
    id: string | null
    path: string | null
    name: string | null
    type: $Enums.FileType | null
    content: string | null
    size: number | null
    mimeType: string | null
    projectId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectFileCountAggregateOutputType = {
    id: number
    path: number
    name: number
    type: number
    content: number
    size: number
    mimeType: number
    projectId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProjectFileAvgAggregateInputType = {
    size?: true
  }

  export type ProjectFileSumAggregateInputType = {
    size?: true
  }

  export type ProjectFileMinAggregateInputType = {
    id?: true
    path?: true
    name?: true
    type?: true
    content?: true
    size?: true
    mimeType?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectFileMaxAggregateInputType = {
    id?: true
    path?: true
    name?: true
    type?: true
    content?: true
    size?: true
    mimeType?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectFileCountAggregateInputType = {
    id?: true
    path?: true
    name?: true
    type?: true
    content?: true
    size?: true
    mimeType?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProjectFileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectFile to aggregate.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProjectFiles
    **/
    _count?: true | ProjectFileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProjectFileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProjectFileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectFileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectFileMaxAggregateInputType
  }

  export type GetProjectFileAggregateType<T extends ProjectFileAggregateArgs> = {
        [P in keyof T & keyof AggregateProjectFile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectFile[P]>
      : GetScalarType<T[P], AggregateProjectFile[P]>
  }




  export type ProjectFileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectFileWhereInput
    orderBy?: ProjectFileOrderByWithAggregationInput | ProjectFileOrderByWithAggregationInput[]
    by: ProjectFileScalarFieldEnum[] | ProjectFileScalarFieldEnum
    having?: ProjectFileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectFileCountAggregateInputType | true
    _avg?: ProjectFileAvgAggregateInputType
    _sum?: ProjectFileSumAggregateInputType
    _min?: ProjectFileMinAggregateInputType
    _max?: ProjectFileMaxAggregateInputType
  }

  export type ProjectFileGroupByOutputType = {
    id: string
    path: string
    name: string
    type: $Enums.FileType
    content: string | null
    size: number
    mimeType: string | null
    projectId: string
    createdAt: Date
    updatedAt: Date
    _count: ProjectFileCountAggregateOutputType | null
    _avg: ProjectFileAvgAggregateOutputType | null
    _sum: ProjectFileSumAggregateOutputType | null
    _min: ProjectFileMinAggregateOutputType | null
    _max: ProjectFileMaxAggregateOutputType | null
  }

  type GetProjectFileGroupByPayload<T extends ProjectFileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectFileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectFileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectFileGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectFileGroupByOutputType[P]>
        }
      >
    >


  export type ProjectFileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    path?: boolean
    name?: boolean
    type?: boolean
    content?: boolean
    size?: boolean
    mimeType?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    activities?: boolean | ProjectFile$activitiesArgs<ExtArgs>
    _count?: boolean | ProjectFileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectFile"]>

  export type ProjectFileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    path?: boolean
    name?: boolean
    type?: boolean
    content?: boolean
    size?: boolean
    mimeType?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectFile"]>

  export type ProjectFileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    path?: boolean
    name?: boolean
    type?: boolean
    content?: boolean
    size?: boolean
    mimeType?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectFile"]>

  export type ProjectFileSelectScalar = {
    id?: boolean
    path?: boolean
    name?: boolean
    type?: boolean
    content?: boolean
    size?: boolean
    mimeType?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProjectFileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "path" | "name" | "type" | "content" | "size" | "mimeType" | "projectId" | "createdAt" | "updatedAt", ExtArgs["result"]["projectFile"]>
  export type ProjectFileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    activities?: boolean | ProjectFile$activitiesArgs<ExtArgs>
    _count?: boolean | ProjectFileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectFileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectFileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $ProjectFilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProjectFile"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      activities: Prisma.$FileActivityPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      path: string
      name: string
      type: $Enums.FileType
      content: string | null
      size: number
      mimeType: string | null
      projectId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["projectFile"]>
    composites: {}
  }

  type ProjectFileGetPayload<S extends boolean | null | undefined | ProjectFileDefaultArgs> = $Result.GetResult<Prisma.$ProjectFilePayload, S>

  type ProjectFileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectFileCountAggregateInputType | true
    }

  export interface ProjectFileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProjectFile'], meta: { name: 'ProjectFile' } }
    /**
     * Find zero or one ProjectFile that matches the filter.
     * @param {ProjectFileFindUniqueArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFileFindUniqueArgs>(args: SelectSubset<T, ProjectFileFindUniqueArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProjectFile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFileFindUniqueOrThrowArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFileFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectFile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileFindFirstArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFileFindFirstArgs>(args?: SelectSubset<T, ProjectFileFindFirstArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectFile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileFindFirstOrThrowArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFileFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFileFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProjectFiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectFiles
     * const projectFiles = await prisma.projectFile.findMany()
     * 
     * // Get first 10 ProjectFiles
     * const projectFiles = await prisma.projectFile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectFileWithIdOnly = await prisma.projectFile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFileFindManyArgs>(args?: SelectSubset<T, ProjectFileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProjectFile.
     * @param {ProjectFileCreateArgs} args - Arguments to create a ProjectFile.
     * @example
     * // Create one ProjectFile
     * const ProjectFile = await prisma.projectFile.create({
     *   data: {
     *     // ... data to create a ProjectFile
     *   }
     * })
     * 
     */
    create<T extends ProjectFileCreateArgs>(args: SelectSubset<T, ProjectFileCreateArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProjectFiles.
     * @param {ProjectFileCreateManyArgs} args - Arguments to create many ProjectFiles.
     * @example
     * // Create many ProjectFiles
     * const projectFile = await prisma.projectFile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectFileCreateManyArgs>(args?: SelectSubset<T, ProjectFileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectFiles and returns the data saved in the database.
     * @param {ProjectFileCreateManyAndReturnArgs} args - Arguments to create many ProjectFiles.
     * @example
     * // Create many ProjectFiles
     * const projectFile = await prisma.projectFile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProjectFiles and only return the `id`
     * const projectFileWithIdOnly = await prisma.projectFile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectFileCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectFileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProjectFile.
     * @param {ProjectFileDeleteArgs} args - Arguments to delete one ProjectFile.
     * @example
     * // Delete one ProjectFile
     * const ProjectFile = await prisma.projectFile.delete({
     *   where: {
     *     // ... filter to delete one ProjectFile
     *   }
     * })
     * 
     */
    delete<T extends ProjectFileDeleteArgs>(args: SelectSubset<T, ProjectFileDeleteArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProjectFile.
     * @param {ProjectFileUpdateArgs} args - Arguments to update one ProjectFile.
     * @example
     * // Update one ProjectFile
     * const projectFile = await prisma.projectFile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectFileUpdateArgs>(args: SelectSubset<T, ProjectFileUpdateArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProjectFiles.
     * @param {ProjectFileDeleteManyArgs} args - Arguments to filter ProjectFiles to delete.
     * @example
     * // Delete a few ProjectFiles
     * const { count } = await prisma.projectFile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectFileDeleteManyArgs>(args?: SelectSubset<T, ProjectFileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectFiles
     * const projectFile = await prisma.projectFile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectFileUpdateManyArgs>(args: SelectSubset<T, ProjectFileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectFiles and returns the data updated in the database.
     * @param {ProjectFileUpdateManyAndReturnArgs} args - Arguments to update many ProjectFiles.
     * @example
     * // Update many ProjectFiles
     * const projectFile = await prisma.projectFile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProjectFiles and only return the `id`
     * const projectFileWithIdOnly = await prisma.projectFile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectFileUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectFileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProjectFile.
     * @param {ProjectFileUpsertArgs} args - Arguments to update or create a ProjectFile.
     * @example
     * // Update or create a ProjectFile
     * const projectFile = await prisma.projectFile.upsert({
     *   create: {
     *     // ... data to create a ProjectFile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectFile we want to update
     *   }
     * })
     */
    upsert<T extends ProjectFileUpsertArgs>(args: SelectSubset<T, ProjectFileUpsertArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProjectFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileCountArgs} args - Arguments to filter ProjectFiles to count.
     * @example
     * // Count the number of ProjectFiles
     * const count = await prisma.projectFile.count({
     *   where: {
     *     // ... the filter for the ProjectFiles we want to count
     *   }
     * })
    **/
    count<T extends ProjectFileCountArgs>(
      args?: Subset<T, ProjectFileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectFileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectFileAggregateArgs>(args: Subset<T, ProjectFileAggregateArgs>): Prisma.PrismaPromise<GetProjectFileAggregateType<T>>

    /**
     * Group by ProjectFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectFileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectFileGroupByArgs['orderBy'] }
        : { orderBy?: ProjectFileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectFileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectFileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProjectFile model
   */
  readonly fields: ProjectFileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectFile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectFileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    activities<T extends ProjectFile$activitiesArgs<ExtArgs> = {}>(args?: Subset<T, ProjectFile$activitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProjectFile model
   */
  interface ProjectFileFieldRefs {
    readonly id: FieldRef<"ProjectFile", 'String'>
    readonly path: FieldRef<"ProjectFile", 'String'>
    readonly name: FieldRef<"ProjectFile", 'String'>
    readonly type: FieldRef<"ProjectFile", 'FileType'>
    readonly content: FieldRef<"ProjectFile", 'String'>
    readonly size: FieldRef<"ProjectFile", 'Int'>
    readonly mimeType: FieldRef<"ProjectFile", 'String'>
    readonly projectId: FieldRef<"ProjectFile", 'String'>
    readonly createdAt: FieldRef<"ProjectFile", 'DateTime'>
    readonly updatedAt: FieldRef<"ProjectFile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProjectFile findUnique
   */
  export type ProjectFileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile findUniqueOrThrow
   */
  export type ProjectFileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile findFirst
   */
  export type ProjectFileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectFiles.
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectFiles.
     */
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * ProjectFile findFirstOrThrow
   */
  export type ProjectFileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectFiles.
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectFiles.
     */
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * ProjectFile findMany
   */
  export type ProjectFileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFiles to fetch.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProjectFiles.
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * ProjectFile create
   */
  export type ProjectFileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectFile.
     */
    data: XOR<ProjectFileCreateInput, ProjectFileUncheckedCreateInput>
  }

  /**
   * ProjectFile createMany
   */
  export type ProjectFileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProjectFiles.
     */
    data: ProjectFileCreateManyInput | ProjectFileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProjectFile createManyAndReturn
   */
  export type ProjectFileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * The data used to create many ProjectFiles.
     */
    data: ProjectFileCreateManyInput | ProjectFileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectFile update
   */
  export type ProjectFileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectFile.
     */
    data: XOR<ProjectFileUpdateInput, ProjectFileUncheckedUpdateInput>
    /**
     * Choose, which ProjectFile to update.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile updateMany
   */
  export type ProjectFileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProjectFiles.
     */
    data: XOR<ProjectFileUpdateManyMutationInput, ProjectFileUncheckedUpdateManyInput>
    /**
     * Filter which ProjectFiles to update
     */
    where?: ProjectFileWhereInput
    /**
     * Limit how many ProjectFiles to update.
     */
    limit?: number
  }

  /**
   * ProjectFile updateManyAndReturn
   */
  export type ProjectFileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * The data used to update ProjectFiles.
     */
    data: XOR<ProjectFileUpdateManyMutationInput, ProjectFileUncheckedUpdateManyInput>
    /**
     * Filter which ProjectFiles to update
     */
    where?: ProjectFileWhereInput
    /**
     * Limit how many ProjectFiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectFile upsert
   */
  export type ProjectFileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectFile to update in case it exists.
     */
    where: ProjectFileWhereUniqueInput
    /**
     * In case the ProjectFile found by the `where` argument doesn't exist, create a new ProjectFile with this data.
     */
    create: XOR<ProjectFileCreateInput, ProjectFileUncheckedCreateInput>
    /**
     * In case the ProjectFile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectFileUpdateInput, ProjectFileUncheckedUpdateInput>
  }

  /**
   * ProjectFile delete
   */
  export type ProjectFileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter which ProjectFile to delete.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile deleteMany
   */
  export type ProjectFileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectFiles to delete
     */
    where?: ProjectFileWhereInput
    /**
     * Limit how many ProjectFiles to delete.
     */
    limit?: number
  }

  /**
   * ProjectFile.activities
   */
  export type ProjectFile$activitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileActivity
     */
    select?: FileActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileActivity
     */
    omit?: FileActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileActivityInclude<ExtArgs> | null
    where?: FileActivityWhereInput
    orderBy?: FileActivityOrderByWithRelationInput | FileActivityOrderByWithRelationInput[]
    cursor?: FileActivityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FileActivityScalarFieldEnum | FileActivityScalarFieldEnum[]
  }

  /**
   * ProjectFile without action
   */
  export type ProjectFileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
  }


  /**
   * Model FileActivity
   */

  export type AggregateFileActivity = {
    _count: FileActivityCountAggregateOutputType | null
    _min: FileActivityMinAggregateOutputType | null
    _max: FileActivityMaxAggregateOutputType | null
  }

  export type FileActivityMinAggregateOutputType = {
    id: string | null
    action: $Enums.FileAction | null
    fileId: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type FileActivityMaxAggregateOutputType = {
    id: string | null
    action: $Enums.FileAction | null
    fileId: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type FileActivityCountAggregateOutputType = {
    id: number
    action: number
    changes: number
    fileId: number
    userId: number
    createdAt: number
    _all: number
  }


  export type FileActivityMinAggregateInputType = {
    id?: true
    action?: true
    fileId?: true
    userId?: true
    createdAt?: true
  }

  export type FileActivityMaxAggregateInputType = {
    id?: true
    action?: true
    fileId?: true
    userId?: true
    createdAt?: true
  }

  export type FileActivityCountAggregateInputType = {
    id?: true
    action?: true
    changes?: true
    fileId?: true
    userId?: true
    createdAt?: true
    _all?: true
  }

  export type FileActivityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FileActivity to aggregate.
     */
    where?: FileActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileActivities to fetch.
     */
    orderBy?: FileActivityOrderByWithRelationInput | FileActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FileActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FileActivities
    **/
    _count?: true | FileActivityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FileActivityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FileActivityMaxAggregateInputType
  }

  export type GetFileActivityAggregateType<T extends FileActivityAggregateArgs> = {
        [P in keyof T & keyof AggregateFileActivity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFileActivity[P]>
      : GetScalarType<T[P], AggregateFileActivity[P]>
  }




  export type FileActivityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileActivityWhereInput
    orderBy?: FileActivityOrderByWithAggregationInput | FileActivityOrderByWithAggregationInput[]
    by: FileActivityScalarFieldEnum[] | FileActivityScalarFieldEnum
    having?: FileActivityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FileActivityCountAggregateInputType | true
    _min?: FileActivityMinAggregateInputType
    _max?: FileActivityMaxAggregateInputType
  }

  export type FileActivityGroupByOutputType = {
    id: string
    action: $Enums.FileAction
    changes: JsonValue | null
    fileId: string
    userId: string
    createdAt: Date
    _count: FileActivityCountAggregateOutputType | null
    _min: FileActivityMinAggregateOutputType | null
    _max: FileActivityMaxAggregateOutputType | null
  }

  type GetFileActivityGroupByPayload<T extends FileActivityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FileActivityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FileActivityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FileActivityGroupByOutputType[P]>
            : GetScalarType<T[P], FileActivityGroupByOutputType[P]>
        }
      >
    >


  export type FileActivitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    changes?: boolean
    fileId?: boolean
    userId?: boolean
    createdAt?: boolean
    file?: boolean | ProjectFileDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fileActivity"]>

  export type FileActivitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    changes?: boolean
    fileId?: boolean
    userId?: boolean
    createdAt?: boolean
    file?: boolean | ProjectFileDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fileActivity"]>

  export type FileActivitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    changes?: boolean
    fileId?: boolean
    userId?: boolean
    createdAt?: boolean
    file?: boolean | ProjectFileDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fileActivity"]>

  export type FileActivitySelectScalar = {
    id?: boolean
    action?: boolean
    changes?: boolean
    fileId?: boolean
    userId?: boolean
    createdAt?: boolean
  }

  export type FileActivityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "action" | "changes" | "fileId" | "userId" | "createdAt", ExtArgs["result"]["fileActivity"]>
  export type FileActivityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    file?: boolean | ProjectFileDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FileActivityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    file?: boolean | ProjectFileDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FileActivityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    file?: boolean | ProjectFileDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $FileActivityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FileActivity"
    objects: {
      file: Prisma.$ProjectFilePayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      action: $Enums.FileAction
      changes: Prisma.JsonValue | null
      fileId: string
      userId: string
      createdAt: Date
    }, ExtArgs["result"]["fileActivity"]>
    composites: {}
  }

  type FileActivityGetPayload<S extends boolean | null | undefined | FileActivityDefaultArgs> = $Result.GetResult<Prisma.$FileActivityPayload, S>

  type FileActivityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FileActivityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FileActivityCountAggregateInputType | true
    }

  export interface FileActivityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FileActivity'], meta: { name: 'FileActivity' } }
    /**
     * Find zero or one FileActivity that matches the filter.
     * @param {FileActivityFindUniqueArgs} args - Arguments to find a FileActivity
     * @example
     * // Get one FileActivity
     * const fileActivity = await prisma.fileActivity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FileActivityFindUniqueArgs>(args: SelectSubset<T, FileActivityFindUniqueArgs<ExtArgs>>): Prisma__FileActivityClient<$Result.GetResult<Prisma.$FileActivityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FileActivity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FileActivityFindUniqueOrThrowArgs} args - Arguments to find a FileActivity
     * @example
     * // Get one FileActivity
     * const fileActivity = await prisma.fileActivity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FileActivityFindUniqueOrThrowArgs>(args: SelectSubset<T, FileActivityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FileActivityClient<$Result.GetResult<Prisma.$FileActivityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FileActivity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileActivityFindFirstArgs} args - Arguments to find a FileActivity
     * @example
     * // Get one FileActivity
     * const fileActivity = await prisma.fileActivity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FileActivityFindFirstArgs>(args?: SelectSubset<T, FileActivityFindFirstArgs<ExtArgs>>): Prisma__FileActivityClient<$Result.GetResult<Prisma.$FileActivityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FileActivity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileActivityFindFirstOrThrowArgs} args - Arguments to find a FileActivity
     * @example
     * // Get one FileActivity
     * const fileActivity = await prisma.fileActivity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FileActivityFindFirstOrThrowArgs>(args?: SelectSubset<T, FileActivityFindFirstOrThrowArgs<ExtArgs>>): Prisma__FileActivityClient<$Result.GetResult<Prisma.$FileActivityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FileActivities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileActivityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FileActivities
     * const fileActivities = await prisma.fileActivity.findMany()
     * 
     * // Get first 10 FileActivities
     * const fileActivities = await prisma.fileActivity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fileActivityWithIdOnly = await prisma.fileActivity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FileActivityFindManyArgs>(args?: SelectSubset<T, FileActivityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FileActivity.
     * @param {FileActivityCreateArgs} args - Arguments to create a FileActivity.
     * @example
     * // Create one FileActivity
     * const FileActivity = await prisma.fileActivity.create({
     *   data: {
     *     // ... data to create a FileActivity
     *   }
     * })
     * 
     */
    create<T extends FileActivityCreateArgs>(args: SelectSubset<T, FileActivityCreateArgs<ExtArgs>>): Prisma__FileActivityClient<$Result.GetResult<Prisma.$FileActivityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FileActivities.
     * @param {FileActivityCreateManyArgs} args - Arguments to create many FileActivities.
     * @example
     * // Create many FileActivities
     * const fileActivity = await prisma.fileActivity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FileActivityCreateManyArgs>(args?: SelectSubset<T, FileActivityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FileActivities and returns the data saved in the database.
     * @param {FileActivityCreateManyAndReturnArgs} args - Arguments to create many FileActivities.
     * @example
     * // Create many FileActivities
     * const fileActivity = await prisma.fileActivity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FileActivities and only return the `id`
     * const fileActivityWithIdOnly = await prisma.fileActivity.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FileActivityCreateManyAndReturnArgs>(args?: SelectSubset<T, FileActivityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileActivityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FileActivity.
     * @param {FileActivityDeleteArgs} args - Arguments to delete one FileActivity.
     * @example
     * // Delete one FileActivity
     * const FileActivity = await prisma.fileActivity.delete({
     *   where: {
     *     // ... filter to delete one FileActivity
     *   }
     * })
     * 
     */
    delete<T extends FileActivityDeleteArgs>(args: SelectSubset<T, FileActivityDeleteArgs<ExtArgs>>): Prisma__FileActivityClient<$Result.GetResult<Prisma.$FileActivityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FileActivity.
     * @param {FileActivityUpdateArgs} args - Arguments to update one FileActivity.
     * @example
     * // Update one FileActivity
     * const fileActivity = await prisma.fileActivity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FileActivityUpdateArgs>(args: SelectSubset<T, FileActivityUpdateArgs<ExtArgs>>): Prisma__FileActivityClient<$Result.GetResult<Prisma.$FileActivityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FileActivities.
     * @param {FileActivityDeleteManyArgs} args - Arguments to filter FileActivities to delete.
     * @example
     * // Delete a few FileActivities
     * const { count } = await prisma.fileActivity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FileActivityDeleteManyArgs>(args?: SelectSubset<T, FileActivityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FileActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileActivityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FileActivities
     * const fileActivity = await prisma.fileActivity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FileActivityUpdateManyArgs>(args: SelectSubset<T, FileActivityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FileActivities and returns the data updated in the database.
     * @param {FileActivityUpdateManyAndReturnArgs} args - Arguments to update many FileActivities.
     * @example
     * // Update many FileActivities
     * const fileActivity = await prisma.fileActivity.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FileActivities and only return the `id`
     * const fileActivityWithIdOnly = await prisma.fileActivity.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FileActivityUpdateManyAndReturnArgs>(args: SelectSubset<T, FileActivityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileActivityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FileActivity.
     * @param {FileActivityUpsertArgs} args - Arguments to update or create a FileActivity.
     * @example
     * // Update or create a FileActivity
     * const fileActivity = await prisma.fileActivity.upsert({
     *   create: {
     *     // ... data to create a FileActivity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FileActivity we want to update
     *   }
     * })
     */
    upsert<T extends FileActivityUpsertArgs>(args: SelectSubset<T, FileActivityUpsertArgs<ExtArgs>>): Prisma__FileActivityClient<$Result.GetResult<Prisma.$FileActivityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FileActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileActivityCountArgs} args - Arguments to filter FileActivities to count.
     * @example
     * // Count the number of FileActivities
     * const count = await prisma.fileActivity.count({
     *   where: {
     *     // ... the filter for the FileActivities we want to count
     *   }
     * })
    **/
    count<T extends FileActivityCountArgs>(
      args?: Subset<T, FileActivityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FileActivityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FileActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileActivityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FileActivityAggregateArgs>(args: Subset<T, FileActivityAggregateArgs>): Prisma.PrismaPromise<GetFileActivityAggregateType<T>>

    /**
     * Group by FileActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileActivityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FileActivityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FileActivityGroupByArgs['orderBy'] }
        : { orderBy?: FileActivityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FileActivityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFileActivityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FileActivity model
   */
  readonly fields: FileActivityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FileActivity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FileActivityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    file<T extends ProjectFileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectFileDefaultArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FileActivity model
   */
  interface FileActivityFieldRefs {
    readonly id: FieldRef<"FileActivity", 'String'>
    readonly action: FieldRef<"FileActivity", 'FileAction'>
    readonly changes: FieldRef<"FileActivity", 'Json'>
    readonly fileId: FieldRef<"FileActivity", 'String'>
    readonly userId: FieldRef<"FileActivity", 'String'>
    readonly createdAt: FieldRef<"FileActivity", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FileActivity findUnique
   */
  export type FileActivityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileActivity
     */
    select?: FileActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileActivity
     */
    omit?: FileActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileActivityInclude<ExtArgs> | null
    /**
     * Filter, which FileActivity to fetch.
     */
    where: FileActivityWhereUniqueInput
  }

  /**
   * FileActivity findUniqueOrThrow
   */
  export type FileActivityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileActivity
     */
    select?: FileActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileActivity
     */
    omit?: FileActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileActivityInclude<ExtArgs> | null
    /**
     * Filter, which FileActivity to fetch.
     */
    where: FileActivityWhereUniqueInput
  }

  /**
   * FileActivity findFirst
   */
  export type FileActivityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileActivity
     */
    select?: FileActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileActivity
     */
    omit?: FileActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileActivityInclude<ExtArgs> | null
    /**
     * Filter, which FileActivity to fetch.
     */
    where?: FileActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileActivities to fetch.
     */
    orderBy?: FileActivityOrderByWithRelationInput | FileActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FileActivities.
     */
    cursor?: FileActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileActivities.
     */
    distinct?: FileActivityScalarFieldEnum | FileActivityScalarFieldEnum[]
  }

  /**
   * FileActivity findFirstOrThrow
   */
  export type FileActivityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileActivity
     */
    select?: FileActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileActivity
     */
    omit?: FileActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileActivityInclude<ExtArgs> | null
    /**
     * Filter, which FileActivity to fetch.
     */
    where?: FileActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileActivities to fetch.
     */
    orderBy?: FileActivityOrderByWithRelationInput | FileActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FileActivities.
     */
    cursor?: FileActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileActivities.
     */
    distinct?: FileActivityScalarFieldEnum | FileActivityScalarFieldEnum[]
  }

  /**
   * FileActivity findMany
   */
  export type FileActivityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileActivity
     */
    select?: FileActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileActivity
     */
    omit?: FileActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileActivityInclude<ExtArgs> | null
    /**
     * Filter, which FileActivities to fetch.
     */
    where?: FileActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileActivities to fetch.
     */
    orderBy?: FileActivityOrderByWithRelationInput | FileActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FileActivities.
     */
    cursor?: FileActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileActivities.
     */
    skip?: number
    distinct?: FileActivityScalarFieldEnum | FileActivityScalarFieldEnum[]
  }

  /**
   * FileActivity create
   */
  export type FileActivityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileActivity
     */
    select?: FileActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileActivity
     */
    omit?: FileActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileActivityInclude<ExtArgs> | null
    /**
     * The data needed to create a FileActivity.
     */
    data: XOR<FileActivityCreateInput, FileActivityUncheckedCreateInput>
  }

  /**
   * FileActivity createMany
   */
  export type FileActivityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FileActivities.
     */
    data: FileActivityCreateManyInput | FileActivityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FileActivity createManyAndReturn
   */
  export type FileActivityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileActivity
     */
    select?: FileActivitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FileActivity
     */
    omit?: FileActivityOmit<ExtArgs> | null
    /**
     * The data used to create many FileActivities.
     */
    data: FileActivityCreateManyInput | FileActivityCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileActivityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FileActivity update
   */
  export type FileActivityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileActivity
     */
    select?: FileActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileActivity
     */
    omit?: FileActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileActivityInclude<ExtArgs> | null
    /**
     * The data needed to update a FileActivity.
     */
    data: XOR<FileActivityUpdateInput, FileActivityUncheckedUpdateInput>
    /**
     * Choose, which FileActivity to update.
     */
    where: FileActivityWhereUniqueInput
  }

  /**
   * FileActivity updateMany
   */
  export type FileActivityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FileActivities.
     */
    data: XOR<FileActivityUpdateManyMutationInput, FileActivityUncheckedUpdateManyInput>
    /**
     * Filter which FileActivities to update
     */
    where?: FileActivityWhereInput
    /**
     * Limit how many FileActivities to update.
     */
    limit?: number
  }

  /**
   * FileActivity updateManyAndReturn
   */
  export type FileActivityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileActivity
     */
    select?: FileActivitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FileActivity
     */
    omit?: FileActivityOmit<ExtArgs> | null
    /**
     * The data used to update FileActivities.
     */
    data: XOR<FileActivityUpdateManyMutationInput, FileActivityUncheckedUpdateManyInput>
    /**
     * Filter which FileActivities to update
     */
    where?: FileActivityWhereInput
    /**
     * Limit how many FileActivities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileActivityIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FileActivity upsert
   */
  export type FileActivityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileActivity
     */
    select?: FileActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileActivity
     */
    omit?: FileActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileActivityInclude<ExtArgs> | null
    /**
     * The filter to search for the FileActivity to update in case it exists.
     */
    where: FileActivityWhereUniqueInput
    /**
     * In case the FileActivity found by the `where` argument doesn't exist, create a new FileActivity with this data.
     */
    create: XOR<FileActivityCreateInput, FileActivityUncheckedCreateInput>
    /**
     * In case the FileActivity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FileActivityUpdateInput, FileActivityUncheckedUpdateInput>
  }

  /**
   * FileActivity delete
   */
  export type FileActivityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileActivity
     */
    select?: FileActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileActivity
     */
    omit?: FileActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileActivityInclude<ExtArgs> | null
    /**
     * Filter which FileActivity to delete.
     */
    where: FileActivityWhereUniqueInput
  }

  /**
   * FileActivity deleteMany
   */
  export type FileActivityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FileActivities to delete
     */
    where?: FileActivityWhereInput
    /**
     * Limit how many FileActivities to delete.
     */
    limit?: number
  }

  /**
   * FileActivity without action
   */
  export type FileActivityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileActivity
     */
    select?: FileActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the FileActivity
     */
    omit?: FileActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileActivityInclude<ExtArgs> | null
  }


  /**
   * Model CollaborationSession
   */

  export type AggregateCollaborationSession = {
    _count: CollaborationSessionCountAggregateOutputType | null
    _min: CollaborationSessionMinAggregateOutputType | null
    _max: CollaborationSessionMaxAggregateOutputType | null
  }

  export type CollaborationSessionMinAggregateOutputType = {
    id: string | null
    name: string | null
    isActive: boolean | null
    projectId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    endedAt: Date | null
  }

  export type CollaborationSessionMaxAggregateOutputType = {
    id: string | null
    name: string | null
    isActive: boolean | null
    projectId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    endedAt: Date | null
  }

  export type CollaborationSessionCountAggregateOutputType = {
    id: number
    name: number
    isActive: number
    projectId: number
    createdAt: number
    updatedAt: number
    endedAt: number
    _all: number
  }


  export type CollaborationSessionMinAggregateInputType = {
    id?: true
    name?: true
    isActive?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
    endedAt?: true
  }

  export type CollaborationSessionMaxAggregateInputType = {
    id?: true
    name?: true
    isActive?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
    endedAt?: true
  }

  export type CollaborationSessionCountAggregateInputType = {
    id?: true
    name?: true
    isActive?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
    endedAt?: true
    _all?: true
  }

  export type CollaborationSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CollaborationSession to aggregate.
     */
    where?: CollaborationSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CollaborationSessions to fetch.
     */
    orderBy?: CollaborationSessionOrderByWithRelationInput | CollaborationSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CollaborationSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CollaborationSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CollaborationSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CollaborationSessions
    **/
    _count?: true | CollaborationSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CollaborationSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CollaborationSessionMaxAggregateInputType
  }

  export type GetCollaborationSessionAggregateType<T extends CollaborationSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateCollaborationSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCollaborationSession[P]>
      : GetScalarType<T[P], AggregateCollaborationSession[P]>
  }




  export type CollaborationSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CollaborationSessionWhereInput
    orderBy?: CollaborationSessionOrderByWithAggregationInput | CollaborationSessionOrderByWithAggregationInput[]
    by: CollaborationSessionScalarFieldEnum[] | CollaborationSessionScalarFieldEnum
    having?: CollaborationSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CollaborationSessionCountAggregateInputType | true
    _min?: CollaborationSessionMinAggregateInputType
    _max?: CollaborationSessionMaxAggregateInputType
  }

  export type CollaborationSessionGroupByOutputType = {
    id: string
    name: string
    isActive: boolean
    projectId: string
    createdAt: Date
    updatedAt: Date
    endedAt: Date | null
    _count: CollaborationSessionCountAggregateOutputType | null
    _min: CollaborationSessionMinAggregateOutputType | null
    _max: CollaborationSessionMaxAggregateOutputType | null
  }

  type GetCollaborationSessionGroupByPayload<T extends CollaborationSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CollaborationSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CollaborationSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CollaborationSessionGroupByOutputType[P]>
            : GetScalarType<T[P], CollaborationSessionGroupByOutputType[P]>
        }
      >
    >


  export type CollaborationSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isActive?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    endedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    participants?: boolean | CollaborationSession$participantsArgs<ExtArgs>
    _count?: boolean | CollaborationSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["collaborationSession"]>

  export type CollaborationSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isActive?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    endedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["collaborationSession"]>

  export type CollaborationSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isActive?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    endedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["collaborationSession"]>

  export type CollaborationSessionSelectScalar = {
    id?: boolean
    name?: boolean
    isActive?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    endedAt?: boolean
  }

  export type CollaborationSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "isActive" | "projectId" | "createdAt" | "updatedAt" | "endedAt", ExtArgs["result"]["collaborationSession"]>
  export type CollaborationSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    participants?: boolean | CollaborationSession$participantsArgs<ExtArgs>
    _count?: boolean | CollaborationSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CollaborationSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type CollaborationSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $CollaborationSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CollaborationSession"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      participants: Prisma.$SessionParticipantPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      isActive: boolean
      projectId: string
      createdAt: Date
      updatedAt: Date
      endedAt: Date | null
    }, ExtArgs["result"]["collaborationSession"]>
    composites: {}
  }

  type CollaborationSessionGetPayload<S extends boolean | null | undefined | CollaborationSessionDefaultArgs> = $Result.GetResult<Prisma.$CollaborationSessionPayload, S>

  type CollaborationSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CollaborationSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CollaborationSessionCountAggregateInputType | true
    }

  export interface CollaborationSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CollaborationSession'], meta: { name: 'CollaborationSession' } }
    /**
     * Find zero or one CollaborationSession that matches the filter.
     * @param {CollaborationSessionFindUniqueArgs} args - Arguments to find a CollaborationSession
     * @example
     * // Get one CollaborationSession
     * const collaborationSession = await prisma.collaborationSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CollaborationSessionFindUniqueArgs>(args: SelectSubset<T, CollaborationSessionFindUniqueArgs<ExtArgs>>): Prisma__CollaborationSessionClient<$Result.GetResult<Prisma.$CollaborationSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CollaborationSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CollaborationSessionFindUniqueOrThrowArgs} args - Arguments to find a CollaborationSession
     * @example
     * // Get one CollaborationSession
     * const collaborationSession = await prisma.collaborationSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CollaborationSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, CollaborationSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CollaborationSessionClient<$Result.GetResult<Prisma.$CollaborationSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CollaborationSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollaborationSessionFindFirstArgs} args - Arguments to find a CollaborationSession
     * @example
     * // Get one CollaborationSession
     * const collaborationSession = await prisma.collaborationSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CollaborationSessionFindFirstArgs>(args?: SelectSubset<T, CollaborationSessionFindFirstArgs<ExtArgs>>): Prisma__CollaborationSessionClient<$Result.GetResult<Prisma.$CollaborationSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CollaborationSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollaborationSessionFindFirstOrThrowArgs} args - Arguments to find a CollaborationSession
     * @example
     * // Get one CollaborationSession
     * const collaborationSession = await prisma.collaborationSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CollaborationSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, CollaborationSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__CollaborationSessionClient<$Result.GetResult<Prisma.$CollaborationSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CollaborationSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollaborationSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CollaborationSessions
     * const collaborationSessions = await prisma.collaborationSession.findMany()
     * 
     * // Get first 10 CollaborationSessions
     * const collaborationSessions = await prisma.collaborationSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const collaborationSessionWithIdOnly = await prisma.collaborationSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CollaborationSessionFindManyArgs>(args?: SelectSubset<T, CollaborationSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollaborationSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CollaborationSession.
     * @param {CollaborationSessionCreateArgs} args - Arguments to create a CollaborationSession.
     * @example
     * // Create one CollaborationSession
     * const CollaborationSession = await prisma.collaborationSession.create({
     *   data: {
     *     // ... data to create a CollaborationSession
     *   }
     * })
     * 
     */
    create<T extends CollaborationSessionCreateArgs>(args: SelectSubset<T, CollaborationSessionCreateArgs<ExtArgs>>): Prisma__CollaborationSessionClient<$Result.GetResult<Prisma.$CollaborationSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CollaborationSessions.
     * @param {CollaborationSessionCreateManyArgs} args - Arguments to create many CollaborationSessions.
     * @example
     * // Create many CollaborationSessions
     * const collaborationSession = await prisma.collaborationSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CollaborationSessionCreateManyArgs>(args?: SelectSubset<T, CollaborationSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CollaborationSessions and returns the data saved in the database.
     * @param {CollaborationSessionCreateManyAndReturnArgs} args - Arguments to create many CollaborationSessions.
     * @example
     * // Create many CollaborationSessions
     * const collaborationSession = await prisma.collaborationSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CollaborationSessions and only return the `id`
     * const collaborationSessionWithIdOnly = await prisma.collaborationSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CollaborationSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, CollaborationSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollaborationSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CollaborationSession.
     * @param {CollaborationSessionDeleteArgs} args - Arguments to delete one CollaborationSession.
     * @example
     * // Delete one CollaborationSession
     * const CollaborationSession = await prisma.collaborationSession.delete({
     *   where: {
     *     // ... filter to delete one CollaborationSession
     *   }
     * })
     * 
     */
    delete<T extends CollaborationSessionDeleteArgs>(args: SelectSubset<T, CollaborationSessionDeleteArgs<ExtArgs>>): Prisma__CollaborationSessionClient<$Result.GetResult<Prisma.$CollaborationSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CollaborationSession.
     * @param {CollaborationSessionUpdateArgs} args - Arguments to update one CollaborationSession.
     * @example
     * // Update one CollaborationSession
     * const collaborationSession = await prisma.collaborationSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CollaborationSessionUpdateArgs>(args: SelectSubset<T, CollaborationSessionUpdateArgs<ExtArgs>>): Prisma__CollaborationSessionClient<$Result.GetResult<Prisma.$CollaborationSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CollaborationSessions.
     * @param {CollaborationSessionDeleteManyArgs} args - Arguments to filter CollaborationSessions to delete.
     * @example
     * // Delete a few CollaborationSessions
     * const { count } = await prisma.collaborationSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CollaborationSessionDeleteManyArgs>(args?: SelectSubset<T, CollaborationSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CollaborationSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollaborationSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CollaborationSessions
     * const collaborationSession = await prisma.collaborationSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CollaborationSessionUpdateManyArgs>(args: SelectSubset<T, CollaborationSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CollaborationSessions and returns the data updated in the database.
     * @param {CollaborationSessionUpdateManyAndReturnArgs} args - Arguments to update many CollaborationSessions.
     * @example
     * // Update many CollaborationSessions
     * const collaborationSession = await prisma.collaborationSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CollaborationSessions and only return the `id`
     * const collaborationSessionWithIdOnly = await prisma.collaborationSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CollaborationSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, CollaborationSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollaborationSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CollaborationSession.
     * @param {CollaborationSessionUpsertArgs} args - Arguments to update or create a CollaborationSession.
     * @example
     * // Update or create a CollaborationSession
     * const collaborationSession = await prisma.collaborationSession.upsert({
     *   create: {
     *     // ... data to create a CollaborationSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CollaborationSession we want to update
     *   }
     * })
     */
    upsert<T extends CollaborationSessionUpsertArgs>(args: SelectSubset<T, CollaborationSessionUpsertArgs<ExtArgs>>): Prisma__CollaborationSessionClient<$Result.GetResult<Prisma.$CollaborationSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CollaborationSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollaborationSessionCountArgs} args - Arguments to filter CollaborationSessions to count.
     * @example
     * // Count the number of CollaborationSessions
     * const count = await prisma.collaborationSession.count({
     *   where: {
     *     // ... the filter for the CollaborationSessions we want to count
     *   }
     * })
    **/
    count<T extends CollaborationSessionCountArgs>(
      args?: Subset<T, CollaborationSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CollaborationSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CollaborationSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollaborationSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CollaborationSessionAggregateArgs>(args: Subset<T, CollaborationSessionAggregateArgs>): Prisma.PrismaPromise<GetCollaborationSessionAggregateType<T>>

    /**
     * Group by CollaborationSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollaborationSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CollaborationSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CollaborationSessionGroupByArgs['orderBy'] }
        : { orderBy?: CollaborationSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CollaborationSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCollaborationSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CollaborationSession model
   */
  readonly fields: CollaborationSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CollaborationSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CollaborationSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    participants<T extends CollaborationSession$participantsArgs<ExtArgs> = {}>(args?: Subset<T, CollaborationSession$participantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CollaborationSession model
   */
  interface CollaborationSessionFieldRefs {
    readonly id: FieldRef<"CollaborationSession", 'String'>
    readonly name: FieldRef<"CollaborationSession", 'String'>
    readonly isActive: FieldRef<"CollaborationSession", 'Boolean'>
    readonly projectId: FieldRef<"CollaborationSession", 'String'>
    readonly createdAt: FieldRef<"CollaborationSession", 'DateTime'>
    readonly updatedAt: FieldRef<"CollaborationSession", 'DateTime'>
    readonly endedAt: FieldRef<"CollaborationSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CollaborationSession findUnique
   */
  export type CollaborationSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollaborationSession
     */
    select?: CollaborationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollaborationSession
     */
    omit?: CollaborationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaborationSessionInclude<ExtArgs> | null
    /**
     * Filter, which CollaborationSession to fetch.
     */
    where: CollaborationSessionWhereUniqueInput
  }

  /**
   * CollaborationSession findUniqueOrThrow
   */
  export type CollaborationSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollaborationSession
     */
    select?: CollaborationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollaborationSession
     */
    omit?: CollaborationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaborationSessionInclude<ExtArgs> | null
    /**
     * Filter, which CollaborationSession to fetch.
     */
    where: CollaborationSessionWhereUniqueInput
  }

  /**
   * CollaborationSession findFirst
   */
  export type CollaborationSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollaborationSession
     */
    select?: CollaborationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollaborationSession
     */
    omit?: CollaborationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaborationSessionInclude<ExtArgs> | null
    /**
     * Filter, which CollaborationSession to fetch.
     */
    where?: CollaborationSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CollaborationSessions to fetch.
     */
    orderBy?: CollaborationSessionOrderByWithRelationInput | CollaborationSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CollaborationSessions.
     */
    cursor?: CollaborationSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CollaborationSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CollaborationSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CollaborationSessions.
     */
    distinct?: CollaborationSessionScalarFieldEnum | CollaborationSessionScalarFieldEnum[]
  }

  /**
   * CollaborationSession findFirstOrThrow
   */
  export type CollaborationSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollaborationSession
     */
    select?: CollaborationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollaborationSession
     */
    omit?: CollaborationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaborationSessionInclude<ExtArgs> | null
    /**
     * Filter, which CollaborationSession to fetch.
     */
    where?: CollaborationSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CollaborationSessions to fetch.
     */
    orderBy?: CollaborationSessionOrderByWithRelationInput | CollaborationSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CollaborationSessions.
     */
    cursor?: CollaborationSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CollaborationSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CollaborationSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CollaborationSessions.
     */
    distinct?: CollaborationSessionScalarFieldEnum | CollaborationSessionScalarFieldEnum[]
  }

  /**
   * CollaborationSession findMany
   */
  export type CollaborationSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollaborationSession
     */
    select?: CollaborationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollaborationSession
     */
    omit?: CollaborationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaborationSessionInclude<ExtArgs> | null
    /**
     * Filter, which CollaborationSessions to fetch.
     */
    where?: CollaborationSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CollaborationSessions to fetch.
     */
    orderBy?: CollaborationSessionOrderByWithRelationInput | CollaborationSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CollaborationSessions.
     */
    cursor?: CollaborationSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CollaborationSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CollaborationSessions.
     */
    skip?: number
    distinct?: CollaborationSessionScalarFieldEnum | CollaborationSessionScalarFieldEnum[]
  }

  /**
   * CollaborationSession create
   */
  export type CollaborationSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollaborationSession
     */
    select?: CollaborationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollaborationSession
     */
    omit?: CollaborationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaborationSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a CollaborationSession.
     */
    data: XOR<CollaborationSessionCreateInput, CollaborationSessionUncheckedCreateInput>
  }

  /**
   * CollaborationSession createMany
   */
  export type CollaborationSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CollaborationSessions.
     */
    data: CollaborationSessionCreateManyInput | CollaborationSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CollaborationSession createManyAndReturn
   */
  export type CollaborationSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollaborationSession
     */
    select?: CollaborationSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CollaborationSession
     */
    omit?: CollaborationSessionOmit<ExtArgs> | null
    /**
     * The data used to create many CollaborationSessions.
     */
    data: CollaborationSessionCreateManyInput | CollaborationSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaborationSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CollaborationSession update
   */
  export type CollaborationSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollaborationSession
     */
    select?: CollaborationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollaborationSession
     */
    omit?: CollaborationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaborationSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a CollaborationSession.
     */
    data: XOR<CollaborationSessionUpdateInput, CollaborationSessionUncheckedUpdateInput>
    /**
     * Choose, which CollaborationSession to update.
     */
    where: CollaborationSessionWhereUniqueInput
  }

  /**
   * CollaborationSession updateMany
   */
  export type CollaborationSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CollaborationSessions.
     */
    data: XOR<CollaborationSessionUpdateManyMutationInput, CollaborationSessionUncheckedUpdateManyInput>
    /**
     * Filter which CollaborationSessions to update
     */
    where?: CollaborationSessionWhereInput
    /**
     * Limit how many CollaborationSessions to update.
     */
    limit?: number
  }

  /**
   * CollaborationSession updateManyAndReturn
   */
  export type CollaborationSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollaborationSession
     */
    select?: CollaborationSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CollaborationSession
     */
    omit?: CollaborationSessionOmit<ExtArgs> | null
    /**
     * The data used to update CollaborationSessions.
     */
    data: XOR<CollaborationSessionUpdateManyMutationInput, CollaborationSessionUncheckedUpdateManyInput>
    /**
     * Filter which CollaborationSessions to update
     */
    where?: CollaborationSessionWhereInput
    /**
     * Limit how many CollaborationSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaborationSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CollaborationSession upsert
   */
  export type CollaborationSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollaborationSession
     */
    select?: CollaborationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollaborationSession
     */
    omit?: CollaborationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaborationSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the CollaborationSession to update in case it exists.
     */
    where: CollaborationSessionWhereUniqueInput
    /**
     * In case the CollaborationSession found by the `where` argument doesn't exist, create a new CollaborationSession with this data.
     */
    create: XOR<CollaborationSessionCreateInput, CollaborationSessionUncheckedCreateInput>
    /**
     * In case the CollaborationSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CollaborationSessionUpdateInput, CollaborationSessionUncheckedUpdateInput>
  }

  /**
   * CollaborationSession delete
   */
  export type CollaborationSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollaborationSession
     */
    select?: CollaborationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollaborationSession
     */
    omit?: CollaborationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaborationSessionInclude<ExtArgs> | null
    /**
     * Filter which CollaborationSession to delete.
     */
    where: CollaborationSessionWhereUniqueInput
  }

  /**
   * CollaborationSession deleteMany
   */
  export type CollaborationSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CollaborationSessions to delete
     */
    where?: CollaborationSessionWhereInput
    /**
     * Limit how many CollaborationSessions to delete.
     */
    limit?: number
  }

  /**
   * CollaborationSession.participants
   */
  export type CollaborationSession$participantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionParticipant
     */
    select?: SessionParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionParticipant
     */
    omit?: SessionParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionParticipantInclude<ExtArgs> | null
    where?: SessionParticipantWhereInput
    orderBy?: SessionParticipantOrderByWithRelationInput | SessionParticipantOrderByWithRelationInput[]
    cursor?: SessionParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionParticipantScalarFieldEnum | SessionParticipantScalarFieldEnum[]
  }

  /**
   * CollaborationSession without action
   */
  export type CollaborationSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollaborationSession
     */
    select?: CollaborationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CollaborationSession
     */
    omit?: CollaborationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaborationSessionInclude<ExtArgs> | null
  }


  /**
   * Model SessionParticipant
   */

  export type AggregateSessionParticipant = {
    _count: SessionParticipantCountAggregateOutputType | null
    _min: SessionParticipantMinAggregateOutputType | null
    _max: SessionParticipantMaxAggregateOutputType | null
  }

  export type SessionParticipantMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    userId: string | null
    isActive: boolean | null
    joinedAt: Date | null
    leftAt: Date | null
  }

  export type SessionParticipantMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    userId: string | null
    isActive: boolean | null
    joinedAt: Date | null
    leftAt: Date | null
  }

  export type SessionParticipantCountAggregateOutputType = {
    id: number
    sessionId: number
    userId: number
    cursor: number
    isActive: number
    joinedAt: number
    leftAt: number
    _all: number
  }


  export type SessionParticipantMinAggregateInputType = {
    id?: true
    sessionId?: true
    userId?: true
    isActive?: true
    joinedAt?: true
    leftAt?: true
  }

  export type SessionParticipantMaxAggregateInputType = {
    id?: true
    sessionId?: true
    userId?: true
    isActive?: true
    joinedAt?: true
    leftAt?: true
  }

  export type SessionParticipantCountAggregateInputType = {
    id?: true
    sessionId?: true
    userId?: true
    cursor?: true
    isActive?: true
    joinedAt?: true
    leftAt?: true
    _all?: true
  }

  export type SessionParticipantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SessionParticipant to aggregate.
     */
    where?: SessionParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SessionParticipants to fetch.
     */
    orderBy?: SessionParticipantOrderByWithRelationInput | SessionParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SessionParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SessionParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SessionParticipants
    **/
    _count?: true | SessionParticipantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionParticipantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionParticipantMaxAggregateInputType
  }

  export type GetSessionParticipantAggregateType<T extends SessionParticipantAggregateArgs> = {
        [P in keyof T & keyof AggregateSessionParticipant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSessionParticipant[P]>
      : GetScalarType<T[P], AggregateSessionParticipant[P]>
  }




  export type SessionParticipantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionParticipantWhereInput
    orderBy?: SessionParticipantOrderByWithAggregationInput | SessionParticipantOrderByWithAggregationInput[]
    by: SessionParticipantScalarFieldEnum[] | SessionParticipantScalarFieldEnum
    having?: SessionParticipantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionParticipantCountAggregateInputType | true
    _min?: SessionParticipantMinAggregateInputType
    _max?: SessionParticipantMaxAggregateInputType
  }

  export type SessionParticipantGroupByOutputType = {
    id: string
    sessionId: string
    userId: string
    cursor: JsonValue | null
    isActive: boolean
    joinedAt: Date
    leftAt: Date | null
    _count: SessionParticipantCountAggregateOutputType | null
    _min: SessionParticipantMinAggregateOutputType | null
    _max: SessionParticipantMaxAggregateOutputType | null
  }

  type GetSessionParticipantGroupByPayload<T extends SessionParticipantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionParticipantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionParticipantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionParticipantGroupByOutputType[P]>
            : GetScalarType<T[P], SessionParticipantGroupByOutputType[P]>
        }
      >
    >


  export type SessionParticipantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    userId?: boolean
    cursor?: boolean
    isActive?: boolean
    joinedAt?: boolean
    leftAt?: boolean
    session?: boolean | CollaborationSessionDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sessionParticipant"]>

  export type SessionParticipantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    userId?: boolean
    cursor?: boolean
    isActive?: boolean
    joinedAt?: boolean
    leftAt?: boolean
    session?: boolean | CollaborationSessionDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sessionParticipant"]>

  export type SessionParticipantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    userId?: boolean
    cursor?: boolean
    isActive?: boolean
    joinedAt?: boolean
    leftAt?: boolean
    session?: boolean | CollaborationSessionDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sessionParticipant"]>

  export type SessionParticipantSelectScalar = {
    id?: boolean
    sessionId?: boolean
    userId?: boolean
    cursor?: boolean
    isActive?: boolean
    joinedAt?: boolean
    leftAt?: boolean
  }

  export type SessionParticipantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "userId" | "cursor" | "isActive" | "joinedAt" | "leftAt", ExtArgs["result"]["sessionParticipant"]>
  export type SessionParticipantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | CollaborationSessionDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionParticipantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | CollaborationSessionDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionParticipantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | CollaborationSessionDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionParticipantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SessionParticipant"
    objects: {
      session: Prisma.$CollaborationSessionPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      userId: string
      cursor: Prisma.JsonValue | null
      isActive: boolean
      joinedAt: Date
      leftAt: Date | null
    }, ExtArgs["result"]["sessionParticipant"]>
    composites: {}
  }

  type SessionParticipantGetPayload<S extends boolean | null | undefined | SessionParticipantDefaultArgs> = $Result.GetResult<Prisma.$SessionParticipantPayload, S>

  type SessionParticipantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionParticipantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionParticipantCountAggregateInputType | true
    }

  export interface SessionParticipantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SessionParticipant'], meta: { name: 'SessionParticipant' } }
    /**
     * Find zero or one SessionParticipant that matches the filter.
     * @param {SessionParticipantFindUniqueArgs} args - Arguments to find a SessionParticipant
     * @example
     * // Get one SessionParticipant
     * const sessionParticipant = await prisma.sessionParticipant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionParticipantFindUniqueArgs>(args: SelectSubset<T, SessionParticipantFindUniqueArgs<ExtArgs>>): Prisma__SessionParticipantClient<$Result.GetResult<Prisma.$SessionParticipantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SessionParticipant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionParticipantFindUniqueOrThrowArgs} args - Arguments to find a SessionParticipant
     * @example
     * // Get one SessionParticipant
     * const sessionParticipant = await prisma.sessionParticipant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionParticipantFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionParticipantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionParticipantClient<$Result.GetResult<Prisma.$SessionParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SessionParticipant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionParticipantFindFirstArgs} args - Arguments to find a SessionParticipant
     * @example
     * // Get one SessionParticipant
     * const sessionParticipant = await prisma.sessionParticipant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionParticipantFindFirstArgs>(args?: SelectSubset<T, SessionParticipantFindFirstArgs<ExtArgs>>): Prisma__SessionParticipantClient<$Result.GetResult<Prisma.$SessionParticipantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SessionParticipant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionParticipantFindFirstOrThrowArgs} args - Arguments to find a SessionParticipant
     * @example
     * // Get one SessionParticipant
     * const sessionParticipant = await prisma.sessionParticipant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionParticipantFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionParticipantFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionParticipantClient<$Result.GetResult<Prisma.$SessionParticipantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SessionParticipants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionParticipantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SessionParticipants
     * const sessionParticipants = await prisma.sessionParticipant.findMany()
     * 
     * // Get first 10 SessionParticipants
     * const sessionParticipants = await prisma.sessionParticipant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionParticipantWithIdOnly = await prisma.sessionParticipant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionParticipantFindManyArgs>(args?: SelectSubset<T, SessionParticipantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SessionParticipant.
     * @param {SessionParticipantCreateArgs} args - Arguments to create a SessionParticipant.
     * @example
     * // Create one SessionParticipant
     * const SessionParticipant = await prisma.sessionParticipant.create({
     *   data: {
     *     // ... data to create a SessionParticipant
     *   }
     * })
     * 
     */
    create<T extends SessionParticipantCreateArgs>(args: SelectSubset<T, SessionParticipantCreateArgs<ExtArgs>>): Prisma__SessionParticipantClient<$Result.GetResult<Prisma.$SessionParticipantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SessionParticipants.
     * @param {SessionParticipantCreateManyArgs} args - Arguments to create many SessionParticipants.
     * @example
     * // Create many SessionParticipants
     * const sessionParticipant = await prisma.sessionParticipant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionParticipantCreateManyArgs>(args?: SelectSubset<T, SessionParticipantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SessionParticipants and returns the data saved in the database.
     * @param {SessionParticipantCreateManyAndReturnArgs} args - Arguments to create many SessionParticipants.
     * @example
     * // Create many SessionParticipants
     * const sessionParticipant = await prisma.sessionParticipant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SessionParticipants and only return the `id`
     * const sessionParticipantWithIdOnly = await prisma.sessionParticipant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionParticipantCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionParticipantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionParticipantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SessionParticipant.
     * @param {SessionParticipantDeleteArgs} args - Arguments to delete one SessionParticipant.
     * @example
     * // Delete one SessionParticipant
     * const SessionParticipant = await prisma.sessionParticipant.delete({
     *   where: {
     *     // ... filter to delete one SessionParticipant
     *   }
     * })
     * 
     */
    delete<T extends SessionParticipantDeleteArgs>(args: SelectSubset<T, SessionParticipantDeleteArgs<ExtArgs>>): Prisma__SessionParticipantClient<$Result.GetResult<Prisma.$SessionParticipantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SessionParticipant.
     * @param {SessionParticipantUpdateArgs} args - Arguments to update one SessionParticipant.
     * @example
     * // Update one SessionParticipant
     * const sessionParticipant = await prisma.sessionParticipant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionParticipantUpdateArgs>(args: SelectSubset<T, SessionParticipantUpdateArgs<ExtArgs>>): Prisma__SessionParticipantClient<$Result.GetResult<Prisma.$SessionParticipantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SessionParticipants.
     * @param {SessionParticipantDeleteManyArgs} args - Arguments to filter SessionParticipants to delete.
     * @example
     * // Delete a few SessionParticipants
     * const { count } = await prisma.sessionParticipant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionParticipantDeleteManyArgs>(args?: SelectSubset<T, SessionParticipantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SessionParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionParticipantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SessionParticipants
     * const sessionParticipant = await prisma.sessionParticipant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionParticipantUpdateManyArgs>(args: SelectSubset<T, SessionParticipantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SessionParticipants and returns the data updated in the database.
     * @param {SessionParticipantUpdateManyAndReturnArgs} args - Arguments to update many SessionParticipants.
     * @example
     * // Update many SessionParticipants
     * const sessionParticipant = await prisma.sessionParticipant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SessionParticipants and only return the `id`
     * const sessionParticipantWithIdOnly = await prisma.sessionParticipant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionParticipantUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionParticipantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionParticipantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SessionParticipant.
     * @param {SessionParticipantUpsertArgs} args - Arguments to update or create a SessionParticipant.
     * @example
     * // Update or create a SessionParticipant
     * const sessionParticipant = await prisma.sessionParticipant.upsert({
     *   create: {
     *     // ... data to create a SessionParticipant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SessionParticipant we want to update
     *   }
     * })
     */
    upsert<T extends SessionParticipantUpsertArgs>(args: SelectSubset<T, SessionParticipantUpsertArgs<ExtArgs>>): Prisma__SessionParticipantClient<$Result.GetResult<Prisma.$SessionParticipantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SessionParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionParticipantCountArgs} args - Arguments to filter SessionParticipants to count.
     * @example
     * // Count the number of SessionParticipants
     * const count = await prisma.sessionParticipant.count({
     *   where: {
     *     // ... the filter for the SessionParticipants we want to count
     *   }
     * })
    **/
    count<T extends SessionParticipantCountArgs>(
      args?: Subset<T, SessionParticipantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionParticipantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SessionParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionParticipantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionParticipantAggregateArgs>(args: Subset<T, SessionParticipantAggregateArgs>): Prisma.PrismaPromise<GetSessionParticipantAggregateType<T>>

    /**
     * Group by SessionParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionParticipantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionParticipantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionParticipantGroupByArgs['orderBy'] }
        : { orderBy?: SessionParticipantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionParticipantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionParticipantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SessionParticipant model
   */
  readonly fields: SessionParticipantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SessionParticipant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionParticipantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends CollaborationSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CollaborationSessionDefaultArgs<ExtArgs>>): Prisma__CollaborationSessionClient<$Result.GetResult<Prisma.$CollaborationSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SessionParticipant model
   */
  interface SessionParticipantFieldRefs {
    readonly id: FieldRef<"SessionParticipant", 'String'>
    readonly sessionId: FieldRef<"SessionParticipant", 'String'>
    readonly userId: FieldRef<"SessionParticipant", 'String'>
    readonly cursor: FieldRef<"SessionParticipant", 'Json'>
    readonly isActive: FieldRef<"SessionParticipant", 'Boolean'>
    readonly joinedAt: FieldRef<"SessionParticipant", 'DateTime'>
    readonly leftAt: FieldRef<"SessionParticipant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SessionParticipant findUnique
   */
  export type SessionParticipantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionParticipant
     */
    select?: SessionParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionParticipant
     */
    omit?: SessionParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionParticipantInclude<ExtArgs> | null
    /**
     * Filter, which SessionParticipant to fetch.
     */
    where: SessionParticipantWhereUniqueInput
  }

  /**
   * SessionParticipant findUniqueOrThrow
   */
  export type SessionParticipantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionParticipant
     */
    select?: SessionParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionParticipant
     */
    omit?: SessionParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionParticipantInclude<ExtArgs> | null
    /**
     * Filter, which SessionParticipant to fetch.
     */
    where: SessionParticipantWhereUniqueInput
  }

  /**
   * SessionParticipant findFirst
   */
  export type SessionParticipantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionParticipant
     */
    select?: SessionParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionParticipant
     */
    omit?: SessionParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionParticipantInclude<ExtArgs> | null
    /**
     * Filter, which SessionParticipant to fetch.
     */
    where?: SessionParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SessionParticipants to fetch.
     */
    orderBy?: SessionParticipantOrderByWithRelationInput | SessionParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SessionParticipants.
     */
    cursor?: SessionParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SessionParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SessionParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SessionParticipants.
     */
    distinct?: SessionParticipantScalarFieldEnum | SessionParticipantScalarFieldEnum[]
  }

  /**
   * SessionParticipant findFirstOrThrow
   */
  export type SessionParticipantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionParticipant
     */
    select?: SessionParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionParticipant
     */
    omit?: SessionParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionParticipantInclude<ExtArgs> | null
    /**
     * Filter, which SessionParticipant to fetch.
     */
    where?: SessionParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SessionParticipants to fetch.
     */
    orderBy?: SessionParticipantOrderByWithRelationInput | SessionParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SessionParticipants.
     */
    cursor?: SessionParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SessionParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SessionParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SessionParticipants.
     */
    distinct?: SessionParticipantScalarFieldEnum | SessionParticipantScalarFieldEnum[]
  }

  /**
   * SessionParticipant findMany
   */
  export type SessionParticipantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionParticipant
     */
    select?: SessionParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionParticipant
     */
    omit?: SessionParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionParticipantInclude<ExtArgs> | null
    /**
     * Filter, which SessionParticipants to fetch.
     */
    where?: SessionParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SessionParticipants to fetch.
     */
    orderBy?: SessionParticipantOrderByWithRelationInput | SessionParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SessionParticipants.
     */
    cursor?: SessionParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SessionParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SessionParticipants.
     */
    skip?: number
    distinct?: SessionParticipantScalarFieldEnum | SessionParticipantScalarFieldEnum[]
  }

  /**
   * SessionParticipant create
   */
  export type SessionParticipantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionParticipant
     */
    select?: SessionParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionParticipant
     */
    omit?: SessionParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionParticipantInclude<ExtArgs> | null
    /**
     * The data needed to create a SessionParticipant.
     */
    data: XOR<SessionParticipantCreateInput, SessionParticipantUncheckedCreateInput>
  }

  /**
   * SessionParticipant createMany
   */
  export type SessionParticipantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SessionParticipants.
     */
    data: SessionParticipantCreateManyInput | SessionParticipantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SessionParticipant createManyAndReturn
   */
  export type SessionParticipantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionParticipant
     */
    select?: SessionParticipantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SessionParticipant
     */
    omit?: SessionParticipantOmit<ExtArgs> | null
    /**
     * The data used to create many SessionParticipants.
     */
    data: SessionParticipantCreateManyInput | SessionParticipantCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionParticipantIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SessionParticipant update
   */
  export type SessionParticipantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionParticipant
     */
    select?: SessionParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionParticipant
     */
    omit?: SessionParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionParticipantInclude<ExtArgs> | null
    /**
     * The data needed to update a SessionParticipant.
     */
    data: XOR<SessionParticipantUpdateInput, SessionParticipantUncheckedUpdateInput>
    /**
     * Choose, which SessionParticipant to update.
     */
    where: SessionParticipantWhereUniqueInput
  }

  /**
   * SessionParticipant updateMany
   */
  export type SessionParticipantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SessionParticipants.
     */
    data: XOR<SessionParticipantUpdateManyMutationInput, SessionParticipantUncheckedUpdateManyInput>
    /**
     * Filter which SessionParticipants to update
     */
    where?: SessionParticipantWhereInput
    /**
     * Limit how many SessionParticipants to update.
     */
    limit?: number
  }

  /**
   * SessionParticipant updateManyAndReturn
   */
  export type SessionParticipantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionParticipant
     */
    select?: SessionParticipantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SessionParticipant
     */
    omit?: SessionParticipantOmit<ExtArgs> | null
    /**
     * The data used to update SessionParticipants.
     */
    data: XOR<SessionParticipantUpdateManyMutationInput, SessionParticipantUncheckedUpdateManyInput>
    /**
     * Filter which SessionParticipants to update
     */
    where?: SessionParticipantWhereInput
    /**
     * Limit how many SessionParticipants to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionParticipantIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SessionParticipant upsert
   */
  export type SessionParticipantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionParticipant
     */
    select?: SessionParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionParticipant
     */
    omit?: SessionParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionParticipantInclude<ExtArgs> | null
    /**
     * The filter to search for the SessionParticipant to update in case it exists.
     */
    where: SessionParticipantWhereUniqueInput
    /**
     * In case the SessionParticipant found by the `where` argument doesn't exist, create a new SessionParticipant with this data.
     */
    create: XOR<SessionParticipantCreateInput, SessionParticipantUncheckedCreateInput>
    /**
     * In case the SessionParticipant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionParticipantUpdateInput, SessionParticipantUncheckedUpdateInput>
  }

  /**
   * SessionParticipant delete
   */
  export type SessionParticipantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionParticipant
     */
    select?: SessionParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionParticipant
     */
    omit?: SessionParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionParticipantInclude<ExtArgs> | null
    /**
     * Filter which SessionParticipant to delete.
     */
    where: SessionParticipantWhereUniqueInput
  }

  /**
   * SessionParticipant deleteMany
   */
  export type SessionParticipantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SessionParticipants to delete
     */
    where?: SessionParticipantWhereInput
    /**
     * Limit how many SessionParticipants to delete.
     */
    limit?: number
  }

  /**
   * SessionParticipant without action
   */
  export type SessionParticipantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionParticipant
     */
    select?: SessionParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionParticipant
     */
    omit?: SessionParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionParticipantInclude<ExtArgs> | null
  }


  /**
   * Model AiChatSession
   */

  export type AggregateAiChatSession = {
    _count: AiChatSessionCountAggregateOutputType | null
    _min: AiChatSessionMinAggregateOutputType | null
    _max: AiChatSessionMaxAggregateOutputType | null
  }

  export type AiChatSessionMinAggregateOutputType = {
    id: string | null
    title: string | null
    context: $Enums.AiContext | null
    userId: string | null
    projectId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AiChatSessionMaxAggregateOutputType = {
    id: string | null
    title: string | null
    context: $Enums.AiContext | null
    userId: string | null
    projectId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AiChatSessionCountAggregateOutputType = {
    id: number
    title: number
    context: number
    userId: number
    projectId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AiChatSessionMinAggregateInputType = {
    id?: true
    title?: true
    context?: true
    userId?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AiChatSessionMaxAggregateInputType = {
    id?: true
    title?: true
    context?: true
    userId?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AiChatSessionCountAggregateInputType = {
    id?: true
    title?: true
    context?: true
    userId?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AiChatSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiChatSession to aggregate.
     */
    where?: AiChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiChatSessions to fetch.
     */
    orderBy?: AiChatSessionOrderByWithRelationInput | AiChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiChatSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiChatSessions
    **/
    _count?: true | AiChatSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiChatSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiChatSessionMaxAggregateInputType
  }

  export type GetAiChatSessionAggregateType<T extends AiChatSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateAiChatSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiChatSession[P]>
      : GetScalarType<T[P], AggregateAiChatSession[P]>
  }




  export type AiChatSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiChatSessionWhereInput
    orderBy?: AiChatSessionOrderByWithAggregationInput | AiChatSessionOrderByWithAggregationInput[]
    by: AiChatSessionScalarFieldEnum[] | AiChatSessionScalarFieldEnum
    having?: AiChatSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiChatSessionCountAggregateInputType | true
    _min?: AiChatSessionMinAggregateInputType
    _max?: AiChatSessionMaxAggregateInputType
  }

  export type AiChatSessionGroupByOutputType = {
    id: string
    title: string | null
    context: $Enums.AiContext
    userId: string
    projectId: string | null
    createdAt: Date
    updatedAt: Date
    _count: AiChatSessionCountAggregateOutputType | null
    _min: AiChatSessionMinAggregateOutputType | null
    _max: AiChatSessionMaxAggregateOutputType | null
  }

  type GetAiChatSessionGroupByPayload<T extends AiChatSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiChatSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiChatSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiChatSessionGroupByOutputType[P]>
            : GetScalarType<T[P], AiChatSessionGroupByOutputType[P]>
        }
      >
    >


  export type AiChatSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    context?: boolean
    userId?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | AiChatSession$projectArgs<ExtArgs>
    messages?: boolean | AiChatSession$messagesArgs<ExtArgs>
    _count?: boolean | AiChatSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiChatSession"]>

  export type AiChatSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    context?: boolean
    userId?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | AiChatSession$projectArgs<ExtArgs>
  }, ExtArgs["result"]["aiChatSession"]>

  export type AiChatSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    context?: boolean
    userId?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | AiChatSession$projectArgs<ExtArgs>
  }, ExtArgs["result"]["aiChatSession"]>

  export type AiChatSessionSelectScalar = {
    id?: boolean
    title?: boolean
    context?: boolean
    userId?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AiChatSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "context" | "userId" | "projectId" | "createdAt" | "updatedAt", ExtArgs["result"]["aiChatSession"]>
  export type AiChatSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | AiChatSession$projectArgs<ExtArgs>
    messages?: boolean | AiChatSession$messagesArgs<ExtArgs>
    _count?: boolean | AiChatSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AiChatSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | AiChatSession$projectArgs<ExtArgs>
  }
  export type AiChatSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | AiChatSession$projectArgs<ExtArgs>
  }

  export type $AiChatSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiChatSession"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      project: Prisma.$ProjectPayload<ExtArgs> | null
      messages: Prisma.$AiMessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string | null
      context: $Enums.AiContext
      userId: string
      projectId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["aiChatSession"]>
    composites: {}
  }

  type AiChatSessionGetPayload<S extends boolean | null | undefined | AiChatSessionDefaultArgs> = $Result.GetResult<Prisma.$AiChatSessionPayload, S>

  type AiChatSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AiChatSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AiChatSessionCountAggregateInputType | true
    }

  export interface AiChatSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiChatSession'], meta: { name: 'AiChatSession' } }
    /**
     * Find zero or one AiChatSession that matches the filter.
     * @param {AiChatSessionFindUniqueArgs} args - Arguments to find a AiChatSession
     * @example
     * // Get one AiChatSession
     * const aiChatSession = await prisma.aiChatSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiChatSessionFindUniqueArgs>(args: SelectSubset<T, AiChatSessionFindUniqueArgs<ExtArgs>>): Prisma__AiChatSessionClient<$Result.GetResult<Prisma.$AiChatSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AiChatSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AiChatSessionFindUniqueOrThrowArgs} args - Arguments to find a AiChatSession
     * @example
     * // Get one AiChatSession
     * const aiChatSession = await prisma.aiChatSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiChatSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, AiChatSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiChatSessionClient<$Result.GetResult<Prisma.$AiChatSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiChatSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiChatSessionFindFirstArgs} args - Arguments to find a AiChatSession
     * @example
     * // Get one AiChatSession
     * const aiChatSession = await prisma.aiChatSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiChatSessionFindFirstArgs>(args?: SelectSubset<T, AiChatSessionFindFirstArgs<ExtArgs>>): Prisma__AiChatSessionClient<$Result.GetResult<Prisma.$AiChatSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiChatSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiChatSessionFindFirstOrThrowArgs} args - Arguments to find a AiChatSession
     * @example
     * // Get one AiChatSession
     * const aiChatSession = await prisma.aiChatSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiChatSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, AiChatSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiChatSessionClient<$Result.GetResult<Prisma.$AiChatSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AiChatSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiChatSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiChatSessions
     * const aiChatSessions = await prisma.aiChatSession.findMany()
     * 
     * // Get first 10 AiChatSessions
     * const aiChatSessions = await prisma.aiChatSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiChatSessionWithIdOnly = await prisma.aiChatSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiChatSessionFindManyArgs>(args?: SelectSubset<T, AiChatSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiChatSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AiChatSession.
     * @param {AiChatSessionCreateArgs} args - Arguments to create a AiChatSession.
     * @example
     * // Create one AiChatSession
     * const AiChatSession = await prisma.aiChatSession.create({
     *   data: {
     *     // ... data to create a AiChatSession
     *   }
     * })
     * 
     */
    create<T extends AiChatSessionCreateArgs>(args: SelectSubset<T, AiChatSessionCreateArgs<ExtArgs>>): Prisma__AiChatSessionClient<$Result.GetResult<Prisma.$AiChatSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AiChatSessions.
     * @param {AiChatSessionCreateManyArgs} args - Arguments to create many AiChatSessions.
     * @example
     * // Create many AiChatSessions
     * const aiChatSession = await prisma.aiChatSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiChatSessionCreateManyArgs>(args?: SelectSubset<T, AiChatSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiChatSessions and returns the data saved in the database.
     * @param {AiChatSessionCreateManyAndReturnArgs} args - Arguments to create many AiChatSessions.
     * @example
     * // Create many AiChatSessions
     * const aiChatSession = await prisma.aiChatSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiChatSessions and only return the `id`
     * const aiChatSessionWithIdOnly = await prisma.aiChatSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiChatSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, AiChatSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiChatSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AiChatSession.
     * @param {AiChatSessionDeleteArgs} args - Arguments to delete one AiChatSession.
     * @example
     * // Delete one AiChatSession
     * const AiChatSession = await prisma.aiChatSession.delete({
     *   where: {
     *     // ... filter to delete one AiChatSession
     *   }
     * })
     * 
     */
    delete<T extends AiChatSessionDeleteArgs>(args: SelectSubset<T, AiChatSessionDeleteArgs<ExtArgs>>): Prisma__AiChatSessionClient<$Result.GetResult<Prisma.$AiChatSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AiChatSession.
     * @param {AiChatSessionUpdateArgs} args - Arguments to update one AiChatSession.
     * @example
     * // Update one AiChatSession
     * const aiChatSession = await prisma.aiChatSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiChatSessionUpdateArgs>(args: SelectSubset<T, AiChatSessionUpdateArgs<ExtArgs>>): Prisma__AiChatSessionClient<$Result.GetResult<Prisma.$AiChatSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AiChatSessions.
     * @param {AiChatSessionDeleteManyArgs} args - Arguments to filter AiChatSessions to delete.
     * @example
     * // Delete a few AiChatSessions
     * const { count } = await prisma.aiChatSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiChatSessionDeleteManyArgs>(args?: SelectSubset<T, AiChatSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiChatSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiChatSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiChatSessions
     * const aiChatSession = await prisma.aiChatSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiChatSessionUpdateManyArgs>(args: SelectSubset<T, AiChatSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiChatSessions and returns the data updated in the database.
     * @param {AiChatSessionUpdateManyAndReturnArgs} args - Arguments to update many AiChatSessions.
     * @example
     * // Update many AiChatSessions
     * const aiChatSession = await prisma.aiChatSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AiChatSessions and only return the `id`
     * const aiChatSessionWithIdOnly = await prisma.aiChatSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AiChatSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, AiChatSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiChatSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AiChatSession.
     * @param {AiChatSessionUpsertArgs} args - Arguments to update or create a AiChatSession.
     * @example
     * // Update or create a AiChatSession
     * const aiChatSession = await prisma.aiChatSession.upsert({
     *   create: {
     *     // ... data to create a AiChatSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiChatSession we want to update
     *   }
     * })
     */
    upsert<T extends AiChatSessionUpsertArgs>(args: SelectSubset<T, AiChatSessionUpsertArgs<ExtArgs>>): Prisma__AiChatSessionClient<$Result.GetResult<Prisma.$AiChatSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AiChatSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiChatSessionCountArgs} args - Arguments to filter AiChatSessions to count.
     * @example
     * // Count the number of AiChatSessions
     * const count = await prisma.aiChatSession.count({
     *   where: {
     *     // ... the filter for the AiChatSessions we want to count
     *   }
     * })
    **/
    count<T extends AiChatSessionCountArgs>(
      args?: Subset<T, AiChatSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiChatSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiChatSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiChatSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiChatSessionAggregateArgs>(args: Subset<T, AiChatSessionAggregateArgs>): Prisma.PrismaPromise<GetAiChatSessionAggregateType<T>>

    /**
     * Group by AiChatSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiChatSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiChatSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiChatSessionGroupByArgs['orderBy'] }
        : { orderBy?: AiChatSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiChatSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiChatSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiChatSession model
   */
  readonly fields: AiChatSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiChatSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiChatSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    project<T extends AiChatSession$projectArgs<ExtArgs> = {}>(args?: Subset<T, AiChatSession$projectArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    messages<T extends AiChatSession$messagesArgs<ExtArgs> = {}>(args?: Subset<T, AiChatSession$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiChatSession model
   */
  interface AiChatSessionFieldRefs {
    readonly id: FieldRef<"AiChatSession", 'String'>
    readonly title: FieldRef<"AiChatSession", 'String'>
    readonly context: FieldRef<"AiChatSession", 'AiContext'>
    readonly userId: FieldRef<"AiChatSession", 'String'>
    readonly projectId: FieldRef<"AiChatSession", 'String'>
    readonly createdAt: FieldRef<"AiChatSession", 'DateTime'>
    readonly updatedAt: FieldRef<"AiChatSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiChatSession findUnique
   */
  export type AiChatSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiChatSession
     */
    select?: AiChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiChatSession
     */
    omit?: AiChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which AiChatSession to fetch.
     */
    where: AiChatSessionWhereUniqueInput
  }

  /**
   * AiChatSession findUniqueOrThrow
   */
  export type AiChatSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiChatSession
     */
    select?: AiChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiChatSession
     */
    omit?: AiChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which AiChatSession to fetch.
     */
    where: AiChatSessionWhereUniqueInput
  }

  /**
   * AiChatSession findFirst
   */
  export type AiChatSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiChatSession
     */
    select?: AiChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiChatSession
     */
    omit?: AiChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which AiChatSession to fetch.
     */
    where?: AiChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiChatSessions to fetch.
     */
    orderBy?: AiChatSessionOrderByWithRelationInput | AiChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiChatSessions.
     */
    cursor?: AiChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiChatSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiChatSessions.
     */
    distinct?: AiChatSessionScalarFieldEnum | AiChatSessionScalarFieldEnum[]
  }

  /**
   * AiChatSession findFirstOrThrow
   */
  export type AiChatSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiChatSession
     */
    select?: AiChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiChatSession
     */
    omit?: AiChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which AiChatSession to fetch.
     */
    where?: AiChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiChatSessions to fetch.
     */
    orderBy?: AiChatSessionOrderByWithRelationInput | AiChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiChatSessions.
     */
    cursor?: AiChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiChatSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiChatSessions.
     */
    distinct?: AiChatSessionScalarFieldEnum | AiChatSessionScalarFieldEnum[]
  }

  /**
   * AiChatSession findMany
   */
  export type AiChatSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiChatSession
     */
    select?: AiChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiChatSession
     */
    omit?: AiChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which AiChatSessions to fetch.
     */
    where?: AiChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiChatSessions to fetch.
     */
    orderBy?: AiChatSessionOrderByWithRelationInput | AiChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiChatSessions.
     */
    cursor?: AiChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiChatSessions.
     */
    skip?: number
    distinct?: AiChatSessionScalarFieldEnum | AiChatSessionScalarFieldEnum[]
  }

  /**
   * AiChatSession create
   */
  export type AiChatSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiChatSession
     */
    select?: AiChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiChatSession
     */
    omit?: AiChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiChatSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a AiChatSession.
     */
    data: XOR<AiChatSessionCreateInput, AiChatSessionUncheckedCreateInput>
  }

  /**
   * AiChatSession createMany
   */
  export type AiChatSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiChatSessions.
     */
    data: AiChatSessionCreateManyInput | AiChatSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiChatSession createManyAndReturn
   */
  export type AiChatSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiChatSession
     */
    select?: AiChatSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiChatSession
     */
    omit?: AiChatSessionOmit<ExtArgs> | null
    /**
     * The data used to create many AiChatSessions.
     */
    data: AiChatSessionCreateManyInput | AiChatSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiChatSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AiChatSession update
   */
  export type AiChatSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiChatSession
     */
    select?: AiChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiChatSession
     */
    omit?: AiChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiChatSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a AiChatSession.
     */
    data: XOR<AiChatSessionUpdateInput, AiChatSessionUncheckedUpdateInput>
    /**
     * Choose, which AiChatSession to update.
     */
    where: AiChatSessionWhereUniqueInput
  }

  /**
   * AiChatSession updateMany
   */
  export type AiChatSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiChatSessions.
     */
    data: XOR<AiChatSessionUpdateManyMutationInput, AiChatSessionUncheckedUpdateManyInput>
    /**
     * Filter which AiChatSessions to update
     */
    where?: AiChatSessionWhereInput
    /**
     * Limit how many AiChatSessions to update.
     */
    limit?: number
  }

  /**
   * AiChatSession updateManyAndReturn
   */
  export type AiChatSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiChatSession
     */
    select?: AiChatSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiChatSession
     */
    omit?: AiChatSessionOmit<ExtArgs> | null
    /**
     * The data used to update AiChatSessions.
     */
    data: XOR<AiChatSessionUpdateManyMutationInput, AiChatSessionUncheckedUpdateManyInput>
    /**
     * Filter which AiChatSessions to update
     */
    where?: AiChatSessionWhereInput
    /**
     * Limit how many AiChatSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiChatSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AiChatSession upsert
   */
  export type AiChatSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiChatSession
     */
    select?: AiChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiChatSession
     */
    omit?: AiChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiChatSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the AiChatSession to update in case it exists.
     */
    where: AiChatSessionWhereUniqueInput
    /**
     * In case the AiChatSession found by the `where` argument doesn't exist, create a new AiChatSession with this data.
     */
    create: XOR<AiChatSessionCreateInput, AiChatSessionUncheckedCreateInput>
    /**
     * In case the AiChatSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiChatSessionUpdateInput, AiChatSessionUncheckedUpdateInput>
  }

  /**
   * AiChatSession delete
   */
  export type AiChatSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiChatSession
     */
    select?: AiChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiChatSession
     */
    omit?: AiChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiChatSessionInclude<ExtArgs> | null
    /**
     * Filter which AiChatSession to delete.
     */
    where: AiChatSessionWhereUniqueInput
  }

  /**
   * AiChatSession deleteMany
   */
  export type AiChatSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiChatSessions to delete
     */
    where?: AiChatSessionWhereInput
    /**
     * Limit how many AiChatSessions to delete.
     */
    limit?: number
  }

  /**
   * AiChatSession.project
   */
  export type AiChatSession$projectArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
  }

  /**
   * AiChatSession.messages
   */
  export type AiChatSession$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiMessage
     */
    omit?: AiMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageInclude<ExtArgs> | null
    where?: AiMessageWhereInput
    orderBy?: AiMessageOrderByWithRelationInput | AiMessageOrderByWithRelationInput[]
    cursor?: AiMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AiMessageScalarFieldEnum | AiMessageScalarFieldEnum[]
  }

  /**
   * AiChatSession without action
   */
  export type AiChatSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiChatSession
     */
    select?: AiChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiChatSession
     */
    omit?: AiChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiChatSessionInclude<ExtArgs> | null
  }


  /**
   * Model AiMessage
   */

  export type AggregateAiMessage = {
    _count: AiMessageCountAggregateOutputType | null
    _min: AiMessageMinAggregateOutputType | null
    _max: AiMessageMaxAggregateOutputType | null
  }

  export type AiMessageMinAggregateOutputType = {
    id: string | null
    role: $Enums.MessageRole | null
    content: string | null
    sessionId: string | null
    createdAt: Date | null
  }

  export type AiMessageMaxAggregateOutputType = {
    id: string | null
    role: $Enums.MessageRole | null
    content: string | null
    sessionId: string | null
    createdAt: Date | null
  }

  export type AiMessageCountAggregateOutputType = {
    id: number
    role: number
    content: number
    metadata: number
    sessionId: number
    createdAt: number
    _all: number
  }


  export type AiMessageMinAggregateInputType = {
    id?: true
    role?: true
    content?: true
    sessionId?: true
    createdAt?: true
  }

  export type AiMessageMaxAggregateInputType = {
    id?: true
    role?: true
    content?: true
    sessionId?: true
    createdAt?: true
  }

  export type AiMessageCountAggregateInputType = {
    id?: true
    role?: true
    content?: true
    metadata?: true
    sessionId?: true
    createdAt?: true
    _all?: true
  }

  export type AiMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiMessage to aggregate.
     */
    where?: AiMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiMessages to fetch.
     */
    orderBy?: AiMessageOrderByWithRelationInput | AiMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiMessages
    **/
    _count?: true | AiMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiMessageMaxAggregateInputType
  }

  export type GetAiMessageAggregateType<T extends AiMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateAiMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiMessage[P]>
      : GetScalarType<T[P], AggregateAiMessage[P]>
  }




  export type AiMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiMessageWhereInput
    orderBy?: AiMessageOrderByWithAggregationInput | AiMessageOrderByWithAggregationInput[]
    by: AiMessageScalarFieldEnum[] | AiMessageScalarFieldEnum
    having?: AiMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiMessageCountAggregateInputType | true
    _min?: AiMessageMinAggregateInputType
    _max?: AiMessageMaxAggregateInputType
  }

  export type AiMessageGroupByOutputType = {
    id: string
    role: $Enums.MessageRole
    content: string
    metadata: JsonValue | null
    sessionId: string
    createdAt: Date
    _count: AiMessageCountAggregateOutputType | null
    _min: AiMessageMinAggregateOutputType | null
    _max: AiMessageMaxAggregateOutputType | null
  }

  type GetAiMessageGroupByPayload<T extends AiMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiMessageGroupByOutputType[P]>
            : GetScalarType<T[P], AiMessageGroupByOutputType[P]>
        }
      >
    >


  export type AiMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    content?: boolean
    metadata?: boolean
    sessionId?: boolean
    createdAt?: boolean
    session?: boolean | AiChatSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiMessage"]>

  export type AiMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    content?: boolean
    metadata?: boolean
    sessionId?: boolean
    createdAt?: boolean
    session?: boolean | AiChatSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiMessage"]>

  export type AiMessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    content?: boolean
    metadata?: boolean
    sessionId?: boolean
    createdAt?: boolean
    session?: boolean | AiChatSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiMessage"]>

  export type AiMessageSelectScalar = {
    id?: boolean
    role?: boolean
    content?: boolean
    metadata?: boolean
    sessionId?: boolean
    createdAt?: boolean
  }

  export type AiMessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "role" | "content" | "metadata" | "sessionId" | "createdAt", ExtArgs["result"]["aiMessage"]>
  export type AiMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | AiChatSessionDefaultArgs<ExtArgs>
  }
  export type AiMessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | AiChatSessionDefaultArgs<ExtArgs>
  }
  export type AiMessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | AiChatSessionDefaultArgs<ExtArgs>
  }

  export type $AiMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiMessage"
    objects: {
      session: Prisma.$AiChatSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      role: $Enums.MessageRole
      content: string
      metadata: Prisma.JsonValue | null
      sessionId: string
      createdAt: Date
    }, ExtArgs["result"]["aiMessage"]>
    composites: {}
  }

  type AiMessageGetPayload<S extends boolean | null | undefined | AiMessageDefaultArgs> = $Result.GetResult<Prisma.$AiMessagePayload, S>

  type AiMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AiMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AiMessageCountAggregateInputType | true
    }

  export interface AiMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiMessage'], meta: { name: 'AiMessage' } }
    /**
     * Find zero or one AiMessage that matches the filter.
     * @param {AiMessageFindUniqueArgs} args - Arguments to find a AiMessage
     * @example
     * // Get one AiMessage
     * const aiMessage = await prisma.aiMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiMessageFindUniqueArgs>(args: SelectSubset<T, AiMessageFindUniqueArgs<ExtArgs>>): Prisma__AiMessageClient<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AiMessage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AiMessageFindUniqueOrThrowArgs} args - Arguments to find a AiMessage
     * @example
     * // Get one AiMessage
     * const aiMessage = await prisma.aiMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, AiMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiMessageClient<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiMessageFindFirstArgs} args - Arguments to find a AiMessage
     * @example
     * // Get one AiMessage
     * const aiMessage = await prisma.aiMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiMessageFindFirstArgs>(args?: SelectSubset<T, AiMessageFindFirstArgs<ExtArgs>>): Prisma__AiMessageClient<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiMessageFindFirstOrThrowArgs} args - Arguments to find a AiMessage
     * @example
     * // Get one AiMessage
     * const aiMessage = await prisma.aiMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, AiMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiMessageClient<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AiMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiMessages
     * const aiMessages = await prisma.aiMessage.findMany()
     * 
     * // Get first 10 AiMessages
     * const aiMessages = await prisma.aiMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiMessageWithIdOnly = await prisma.aiMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiMessageFindManyArgs>(args?: SelectSubset<T, AiMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AiMessage.
     * @param {AiMessageCreateArgs} args - Arguments to create a AiMessage.
     * @example
     * // Create one AiMessage
     * const AiMessage = await prisma.aiMessage.create({
     *   data: {
     *     // ... data to create a AiMessage
     *   }
     * })
     * 
     */
    create<T extends AiMessageCreateArgs>(args: SelectSubset<T, AiMessageCreateArgs<ExtArgs>>): Prisma__AiMessageClient<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AiMessages.
     * @param {AiMessageCreateManyArgs} args - Arguments to create many AiMessages.
     * @example
     * // Create many AiMessages
     * const aiMessage = await prisma.aiMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiMessageCreateManyArgs>(args?: SelectSubset<T, AiMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiMessages and returns the data saved in the database.
     * @param {AiMessageCreateManyAndReturnArgs} args - Arguments to create many AiMessages.
     * @example
     * // Create many AiMessages
     * const aiMessage = await prisma.aiMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiMessages and only return the `id`
     * const aiMessageWithIdOnly = await prisma.aiMessage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, AiMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AiMessage.
     * @param {AiMessageDeleteArgs} args - Arguments to delete one AiMessage.
     * @example
     * // Delete one AiMessage
     * const AiMessage = await prisma.aiMessage.delete({
     *   where: {
     *     // ... filter to delete one AiMessage
     *   }
     * })
     * 
     */
    delete<T extends AiMessageDeleteArgs>(args: SelectSubset<T, AiMessageDeleteArgs<ExtArgs>>): Prisma__AiMessageClient<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AiMessage.
     * @param {AiMessageUpdateArgs} args - Arguments to update one AiMessage.
     * @example
     * // Update one AiMessage
     * const aiMessage = await prisma.aiMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiMessageUpdateArgs>(args: SelectSubset<T, AiMessageUpdateArgs<ExtArgs>>): Prisma__AiMessageClient<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AiMessages.
     * @param {AiMessageDeleteManyArgs} args - Arguments to filter AiMessages to delete.
     * @example
     * // Delete a few AiMessages
     * const { count } = await prisma.aiMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiMessageDeleteManyArgs>(args?: SelectSubset<T, AiMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiMessages
     * const aiMessage = await prisma.aiMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiMessageUpdateManyArgs>(args: SelectSubset<T, AiMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiMessages and returns the data updated in the database.
     * @param {AiMessageUpdateManyAndReturnArgs} args - Arguments to update many AiMessages.
     * @example
     * // Update many AiMessages
     * const aiMessage = await prisma.aiMessage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AiMessages and only return the `id`
     * const aiMessageWithIdOnly = await prisma.aiMessage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AiMessageUpdateManyAndReturnArgs>(args: SelectSubset<T, AiMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AiMessage.
     * @param {AiMessageUpsertArgs} args - Arguments to update or create a AiMessage.
     * @example
     * // Update or create a AiMessage
     * const aiMessage = await prisma.aiMessage.upsert({
     *   create: {
     *     // ... data to create a AiMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiMessage we want to update
     *   }
     * })
     */
    upsert<T extends AiMessageUpsertArgs>(args: SelectSubset<T, AiMessageUpsertArgs<ExtArgs>>): Prisma__AiMessageClient<$Result.GetResult<Prisma.$AiMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AiMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiMessageCountArgs} args - Arguments to filter AiMessages to count.
     * @example
     * // Count the number of AiMessages
     * const count = await prisma.aiMessage.count({
     *   where: {
     *     // ... the filter for the AiMessages we want to count
     *   }
     * })
    **/
    count<T extends AiMessageCountArgs>(
      args?: Subset<T, AiMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiMessageAggregateArgs>(args: Subset<T, AiMessageAggregateArgs>): Prisma.PrismaPromise<GetAiMessageAggregateType<T>>

    /**
     * Group by AiMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiMessageGroupByArgs['orderBy'] }
        : { orderBy?: AiMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiMessage model
   */
  readonly fields: AiMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends AiChatSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AiChatSessionDefaultArgs<ExtArgs>>): Prisma__AiChatSessionClient<$Result.GetResult<Prisma.$AiChatSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiMessage model
   */
  interface AiMessageFieldRefs {
    readonly id: FieldRef<"AiMessage", 'String'>
    readonly role: FieldRef<"AiMessage", 'MessageRole'>
    readonly content: FieldRef<"AiMessage", 'String'>
    readonly metadata: FieldRef<"AiMessage", 'Json'>
    readonly sessionId: FieldRef<"AiMessage", 'String'>
    readonly createdAt: FieldRef<"AiMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiMessage findUnique
   */
  export type AiMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiMessage
     */
    omit?: AiMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageInclude<ExtArgs> | null
    /**
     * Filter, which AiMessage to fetch.
     */
    where: AiMessageWhereUniqueInput
  }

  /**
   * AiMessage findUniqueOrThrow
   */
  export type AiMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiMessage
     */
    omit?: AiMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageInclude<ExtArgs> | null
    /**
     * Filter, which AiMessage to fetch.
     */
    where: AiMessageWhereUniqueInput
  }

  /**
   * AiMessage findFirst
   */
  export type AiMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiMessage
     */
    omit?: AiMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageInclude<ExtArgs> | null
    /**
     * Filter, which AiMessage to fetch.
     */
    where?: AiMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiMessages to fetch.
     */
    orderBy?: AiMessageOrderByWithRelationInput | AiMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiMessages.
     */
    cursor?: AiMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiMessages.
     */
    distinct?: AiMessageScalarFieldEnum | AiMessageScalarFieldEnum[]
  }

  /**
   * AiMessage findFirstOrThrow
   */
  export type AiMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiMessage
     */
    omit?: AiMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageInclude<ExtArgs> | null
    /**
     * Filter, which AiMessage to fetch.
     */
    where?: AiMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiMessages to fetch.
     */
    orderBy?: AiMessageOrderByWithRelationInput | AiMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiMessages.
     */
    cursor?: AiMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiMessages.
     */
    distinct?: AiMessageScalarFieldEnum | AiMessageScalarFieldEnum[]
  }

  /**
   * AiMessage findMany
   */
  export type AiMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiMessage
     */
    omit?: AiMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageInclude<ExtArgs> | null
    /**
     * Filter, which AiMessages to fetch.
     */
    where?: AiMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiMessages to fetch.
     */
    orderBy?: AiMessageOrderByWithRelationInput | AiMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiMessages.
     */
    cursor?: AiMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiMessages.
     */
    skip?: number
    distinct?: AiMessageScalarFieldEnum | AiMessageScalarFieldEnum[]
  }

  /**
   * AiMessage create
   */
  export type AiMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiMessage
     */
    omit?: AiMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a AiMessage.
     */
    data: XOR<AiMessageCreateInput, AiMessageUncheckedCreateInput>
  }

  /**
   * AiMessage createMany
   */
  export type AiMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiMessages.
     */
    data: AiMessageCreateManyInput | AiMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiMessage createManyAndReturn
   */
  export type AiMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiMessage
     */
    omit?: AiMessageOmit<ExtArgs> | null
    /**
     * The data used to create many AiMessages.
     */
    data: AiMessageCreateManyInput | AiMessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AiMessage update
   */
  export type AiMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiMessage
     */
    omit?: AiMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a AiMessage.
     */
    data: XOR<AiMessageUpdateInput, AiMessageUncheckedUpdateInput>
    /**
     * Choose, which AiMessage to update.
     */
    where: AiMessageWhereUniqueInput
  }

  /**
   * AiMessage updateMany
   */
  export type AiMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiMessages.
     */
    data: XOR<AiMessageUpdateManyMutationInput, AiMessageUncheckedUpdateManyInput>
    /**
     * Filter which AiMessages to update
     */
    where?: AiMessageWhereInput
    /**
     * Limit how many AiMessages to update.
     */
    limit?: number
  }

  /**
   * AiMessage updateManyAndReturn
   */
  export type AiMessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiMessage
     */
    omit?: AiMessageOmit<ExtArgs> | null
    /**
     * The data used to update AiMessages.
     */
    data: XOR<AiMessageUpdateManyMutationInput, AiMessageUncheckedUpdateManyInput>
    /**
     * Filter which AiMessages to update
     */
    where?: AiMessageWhereInput
    /**
     * Limit how many AiMessages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AiMessage upsert
   */
  export type AiMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiMessage
     */
    omit?: AiMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the AiMessage to update in case it exists.
     */
    where: AiMessageWhereUniqueInput
    /**
     * In case the AiMessage found by the `where` argument doesn't exist, create a new AiMessage with this data.
     */
    create: XOR<AiMessageCreateInput, AiMessageUncheckedCreateInput>
    /**
     * In case the AiMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiMessageUpdateInput, AiMessageUncheckedUpdateInput>
  }

  /**
   * AiMessage delete
   */
  export type AiMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiMessage
     */
    omit?: AiMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageInclude<ExtArgs> | null
    /**
     * Filter which AiMessage to delete.
     */
    where: AiMessageWhereUniqueInput
  }

  /**
   * AiMessage deleteMany
   */
  export type AiMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiMessages to delete
     */
    where?: AiMessageWhereInput
    /**
     * Limit how many AiMessages to delete.
     */
    limit?: number
  }

  /**
   * AiMessage without action
   */
  export type AiMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMessage
     */
    select?: AiMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiMessage
     */
    omit?: AiMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiMessageInclude<ExtArgs> | null
  }


  /**
   * Model GitRepository
   */

  export type AggregateGitRepository = {
    _count: GitRepositoryCountAggregateOutputType | null
    _min: GitRepositoryMinAggregateOutputType | null
    _max: GitRepositoryMaxAggregateOutputType | null
  }

  export type GitRepositoryMinAggregateOutputType = {
    id: string | null
    url: string | null
    branch: string | null
    lastSync: Date | null
    syncStatus: $Enums.SyncStatus | null
    projectId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GitRepositoryMaxAggregateOutputType = {
    id: string | null
    url: string | null
    branch: string | null
    lastSync: Date | null
    syncStatus: $Enums.SyncStatus | null
    projectId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GitRepositoryCountAggregateOutputType = {
    id: number
    url: number
    branch: number
    lastSync: number
    syncStatus: number
    projectId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GitRepositoryMinAggregateInputType = {
    id?: true
    url?: true
    branch?: true
    lastSync?: true
    syncStatus?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GitRepositoryMaxAggregateInputType = {
    id?: true
    url?: true
    branch?: true
    lastSync?: true
    syncStatus?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GitRepositoryCountAggregateInputType = {
    id?: true
    url?: true
    branch?: true
    lastSync?: true
    syncStatus?: true
    projectId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GitRepositoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GitRepository to aggregate.
     */
    where?: GitRepositoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GitRepositories to fetch.
     */
    orderBy?: GitRepositoryOrderByWithRelationInput | GitRepositoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GitRepositoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GitRepositories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GitRepositories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GitRepositories
    **/
    _count?: true | GitRepositoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GitRepositoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GitRepositoryMaxAggregateInputType
  }

  export type GetGitRepositoryAggregateType<T extends GitRepositoryAggregateArgs> = {
        [P in keyof T & keyof AggregateGitRepository]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGitRepository[P]>
      : GetScalarType<T[P], AggregateGitRepository[P]>
  }




  export type GitRepositoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GitRepositoryWhereInput
    orderBy?: GitRepositoryOrderByWithAggregationInput | GitRepositoryOrderByWithAggregationInput[]
    by: GitRepositoryScalarFieldEnum[] | GitRepositoryScalarFieldEnum
    having?: GitRepositoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GitRepositoryCountAggregateInputType | true
    _min?: GitRepositoryMinAggregateInputType
    _max?: GitRepositoryMaxAggregateInputType
  }

  export type GitRepositoryGroupByOutputType = {
    id: string
    url: string
    branch: string
    lastSync: Date | null
    syncStatus: $Enums.SyncStatus
    projectId: string
    createdAt: Date
    updatedAt: Date
    _count: GitRepositoryCountAggregateOutputType | null
    _min: GitRepositoryMinAggregateOutputType | null
    _max: GitRepositoryMaxAggregateOutputType | null
  }

  type GetGitRepositoryGroupByPayload<T extends GitRepositoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GitRepositoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GitRepositoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GitRepositoryGroupByOutputType[P]>
            : GetScalarType<T[P], GitRepositoryGroupByOutputType[P]>
        }
      >
    >


  export type GitRepositorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    branch?: boolean
    lastSync?: boolean
    syncStatus?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    commits?: boolean | GitRepository$commitsArgs<ExtArgs>
    _count?: boolean | GitRepositoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gitRepository"]>

  export type GitRepositorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    branch?: boolean
    lastSync?: boolean
    syncStatus?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gitRepository"]>

  export type GitRepositorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    branch?: boolean
    lastSync?: boolean
    syncStatus?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gitRepository"]>

  export type GitRepositorySelectScalar = {
    id?: boolean
    url?: boolean
    branch?: boolean
    lastSync?: boolean
    syncStatus?: boolean
    projectId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GitRepositoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "url" | "branch" | "lastSync" | "syncStatus" | "projectId" | "createdAt" | "updatedAt", ExtArgs["result"]["gitRepository"]>
  export type GitRepositoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    commits?: boolean | GitRepository$commitsArgs<ExtArgs>
    _count?: boolean | GitRepositoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GitRepositoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type GitRepositoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $GitRepositoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GitRepository"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      commits: Prisma.$GitCommitPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      url: string
      branch: string
      lastSync: Date | null
      syncStatus: $Enums.SyncStatus
      projectId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["gitRepository"]>
    composites: {}
  }

  type GitRepositoryGetPayload<S extends boolean | null | undefined | GitRepositoryDefaultArgs> = $Result.GetResult<Prisma.$GitRepositoryPayload, S>

  type GitRepositoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GitRepositoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GitRepositoryCountAggregateInputType | true
    }

  export interface GitRepositoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GitRepository'], meta: { name: 'GitRepository' } }
    /**
     * Find zero or one GitRepository that matches the filter.
     * @param {GitRepositoryFindUniqueArgs} args - Arguments to find a GitRepository
     * @example
     * // Get one GitRepository
     * const gitRepository = await prisma.gitRepository.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GitRepositoryFindUniqueArgs>(args: SelectSubset<T, GitRepositoryFindUniqueArgs<ExtArgs>>): Prisma__GitRepositoryClient<$Result.GetResult<Prisma.$GitRepositoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GitRepository that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GitRepositoryFindUniqueOrThrowArgs} args - Arguments to find a GitRepository
     * @example
     * // Get one GitRepository
     * const gitRepository = await prisma.gitRepository.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GitRepositoryFindUniqueOrThrowArgs>(args: SelectSubset<T, GitRepositoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GitRepositoryClient<$Result.GetResult<Prisma.$GitRepositoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GitRepository that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GitRepositoryFindFirstArgs} args - Arguments to find a GitRepository
     * @example
     * // Get one GitRepository
     * const gitRepository = await prisma.gitRepository.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GitRepositoryFindFirstArgs>(args?: SelectSubset<T, GitRepositoryFindFirstArgs<ExtArgs>>): Prisma__GitRepositoryClient<$Result.GetResult<Prisma.$GitRepositoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GitRepository that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GitRepositoryFindFirstOrThrowArgs} args - Arguments to find a GitRepository
     * @example
     * // Get one GitRepository
     * const gitRepository = await prisma.gitRepository.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GitRepositoryFindFirstOrThrowArgs>(args?: SelectSubset<T, GitRepositoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__GitRepositoryClient<$Result.GetResult<Prisma.$GitRepositoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GitRepositories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GitRepositoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GitRepositories
     * const gitRepositories = await prisma.gitRepository.findMany()
     * 
     * // Get first 10 GitRepositories
     * const gitRepositories = await prisma.gitRepository.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gitRepositoryWithIdOnly = await prisma.gitRepository.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GitRepositoryFindManyArgs>(args?: SelectSubset<T, GitRepositoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GitRepositoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GitRepository.
     * @param {GitRepositoryCreateArgs} args - Arguments to create a GitRepository.
     * @example
     * // Create one GitRepository
     * const GitRepository = await prisma.gitRepository.create({
     *   data: {
     *     // ... data to create a GitRepository
     *   }
     * })
     * 
     */
    create<T extends GitRepositoryCreateArgs>(args: SelectSubset<T, GitRepositoryCreateArgs<ExtArgs>>): Prisma__GitRepositoryClient<$Result.GetResult<Prisma.$GitRepositoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GitRepositories.
     * @param {GitRepositoryCreateManyArgs} args - Arguments to create many GitRepositories.
     * @example
     * // Create many GitRepositories
     * const gitRepository = await prisma.gitRepository.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GitRepositoryCreateManyArgs>(args?: SelectSubset<T, GitRepositoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GitRepositories and returns the data saved in the database.
     * @param {GitRepositoryCreateManyAndReturnArgs} args - Arguments to create many GitRepositories.
     * @example
     * // Create many GitRepositories
     * const gitRepository = await prisma.gitRepository.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GitRepositories and only return the `id`
     * const gitRepositoryWithIdOnly = await prisma.gitRepository.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GitRepositoryCreateManyAndReturnArgs>(args?: SelectSubset<T, GitRepositoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GitRepositoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GitRepository.
     * @param {GitRepositoryDeleteArgs} args - Arguments to delete one GitRepository.
     * @example
     * // Delete one GitRepository
     * const GitRepository = await prisma.gitRepository.delete({
     *   where: {
     *     // ... filter to delete one GitRepository
     *   }
     * })
     * 
     */
    delete<T extends GitRepositoryDeleteArgs>(args: SelectSubset<T, GitRepositoryDeleteArgs<ExtArgs>>): Prisma__GitRepositoryClient<$Result.GetResult<Prisma.$GitRepositoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GitRepository.
     * @param {GitRepositoryUpdateArgs} args - Arguments to update one GitRepository.
     * @example
     * // Update one GitRepository
     * const gitRepository = await prisma.gitRepository.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GitRepositoryUpdateArgs>(args: SelectSubset<T, GitRepositoryUpdateArgs<ExtArgs>>): Prisma__GitRepositoryClient<$Result.GetResult<Prisma.$GitRepositoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GitRepositories.
     * @param {GitRepositoryDeleteManyArgs} args - Arguments to filter GitRepositories to delete.
     * @example
     * // Delete a few GitRepositories
     * const { count } = await prisma.gitRepository.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GitRepositoryDeleteManyArgs>(args?: SelectSubset<T, GitRepositoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GitRepositories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GitRepositoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GitRepositories
     * const gitRepository = await prisma.gitRepository.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GitRepositoryUpdateManyArgs>(args: SelectSubset<T, GitRepositoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GitRepositories and returns the data updated in the database.
     * @param {GitRepositoryUpdateManyAndReturnArgs} args - Arguments to update many GitRepositories.
     * @example
     * // Update many GitRepositories
     * const gitRepository = await prisma.gitRepository.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GitRepositories and only return the `id`
     * const gitRepositoryWithIdOnly = await prisma.gitRepository.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GitRepositoryUpdateManyAndReturnArgs>(args: SelectSubset<T, GitRepositoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GitRepositoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GitRepository.
     * @param {GitRepositoryUpsertArgs} args - Arguments to update or create a GitRepository.
     * @example
     * // Update or create a GitRepository
     * const gitRepository = await prisma.gitRepository.upsert({
     *   create: {
     *     // ... data to create a GitRepository
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GitRepository we want to update
     *   }
     * })
     */
    upsert<T extends GitRepositoryUpsertArgs>(args: SelectSubset<T, GitRepositoryUpsertArgs<ExtArgs>>): Prisma__GitRepositoryClient<$Result.GetResult<Prisma.$GitRepositoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GitRepositories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GitRepositoryCountArgs} args - Arguments to filter GitRepositories to count.
     * @example
     * // Count the number of GitRepositories
     * const count = await prisma.gitRepository.count({
     *   where: {
     *     // ... the filter for the GitRepositories we want to count
     *   }
     * })
    **/
    count<T extends GitRepositoryCountArgs>(
      args?: Subset<T, GitRepositoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GitRepositoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GitRepository.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GitRepositoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GitRepositoryAggregateArgs>(args: Subset<T, GitRepositoryAggregateArgs>): Prisma.PrismaPromise<GetGitRepositoryAggregateType<T>>

    /**
     * Group by GitRepository.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GitRepositoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GitRepositoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GitRepositoryGroupByArgs['orderBy'] }
        : { orderBy?: GitRepositoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GitRepositoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGitRepositoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GitRepository model
   */
  readonly fields: GitRepositoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GitRepository.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GitRepositoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    commits<T extends GitRepository$commitsArgs<ExtArgs> = {}>(args?: Subset<T, GitRepository$commitsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GitCommitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GitRepository model
   */
  interface GitRepositoryFieldRefs {
    readonly id: FieldRef<"GitRepository", 'String'>
    readonly url: FieldRef<"GitRepository", 'String'>
    readonly branch: FieldRef<"GitRepository", 'String'>
    readonly lastSync: FieldRef<"GitRepository", 'DateTime'>
    readonly syncStatus: FieldRef<"GitRepository", 'SyncStatus'>
    readonly projectId: FieldRef<"GitRepository", 'String'>
    readonly createdAt: FieldRef<"GitRepository", 'DateTime'>
    readonly updatedAt: FieldRef<"GitRepository", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GitRepository findUnique
   */
  export type GitRepositoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitRepository
     */
    select?: GitRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GitRepository
     */
    omit?: GitRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitRepositoryInclude<ExtArgs> | null
    /**
     * Filter, which GitRepository to fetch.
     */
    where: GitRepositoryWhereUniqueInput
  }

  /**
   * GitRepository findUniqueOrThrow
   */
  export type GitRepositoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitRepository
     */
    select?: GitRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GitRepository
     */
    omit?: GitRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitRepositoryInclude<ExtArgs> | null
    /**
     * Filter, which GitRepository to fetch.
     */
    where: GitRepositoryWhereUniqueInput
  }

  /**
   * GitRepository findFirst
   */
  export type GitRepositoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitRepository
     */
    select?: GitRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GitRepository
     */
    omit?: GitRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitRepositoryInclude<ExtArgs> | null
    /**
     * Filter, which GitRepository to fetch.
     */
    where?: GitRepositoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GitRepositories to fetch.
     */
    orderBy?: GitRepositoryOrderByWithRelationInput | GitRepositoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GitRepositories.
     */
    cursor?: GitRepositoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GitRepositories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GitRepositories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GitRepositories.
     */
    distinct?: GitRepositoryScalarFieldEnum | GitRepositoryScalarFieldEnum[]
  }

  /**
   * GitRepository findFirstOrThrow
   */
  export type GitRepositoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitRepository
     */
    select?: GitRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GitRepository
     */
    omit?: GitRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitRepositoryInclude<ExtArgs> | null
    /**
     * Filter, which GitRepository to fetch.
     */
    where?: GitRepositoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GitRepositories to fetch.
     */
    orderBy?: GitRepositoryOrderByWithRelationInput | GitRepositoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GitRepositories.
     */
    cursor?: GitRepositoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GitRepositories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GitRepositories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GitRepositories.
     */
    distinct?: GitRepositoryScalarFieldEnum | GitRepositoryScalarFieldEnum[]
  }

  /**
   * GitRepository findMany
   */
  export type GitRepositoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitRepository
     */
    select?: GitRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GitRepository
     */
    omit?: GitRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitRepositoryInclude<ExtArgs> | null
    /**
     * Filter, which GitRepositories to fetch.
     */
    where?: GitRepositoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GitRepositories to fetch.
     */
    orderBy?: GitRepositoryOrderByWithRelationInput | GitRepositoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GitRepositories.
     */
    cursor?: GitRepositoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GitRepositories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GitRepositories.
     */
    skip?: number
    distinct?: GitRepositoryScalarFieldEnum | GitRepositoryScalarFieldEnum[]
  }

  /**
   * GitRepository create
   */
  export type GitRepositoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitRepository
     */
    select?: GitRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GitRepository
     */
    omit?: GitRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitRepositoryInclude<ExtArgs> | null
    /**
     * The data needed to create a GitRepository.
     */
    data: XOR<GitRepositoryCreateInput, GitRepositoryUncheckedCreateInput>
  }

  /**
   * GitRepository createMany
   */
  export type GitRepositoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GitRepositories.
     */
    data: GitRepositoryCreateManyInput | GitRepositoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GitRepository createManyAndReturn
   */
  export type GitRepositoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitRepository
     */
    select?: GitRepositorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GitRepository
     */
    omit?: GitRepositoryOmit<ExtArgs> | null
    /**
     * The data used to create many GitRepositories.
     */
    data: GitRepositoryCreateManyInput | GitRepositoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitRepositoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GitRepository update
   */
  export type GitRepositoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitRepository
     */
    select?: GitRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GitRepository
     */
    omit?: GitRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitRepositoryInclude<ExtArgs> | null
    /**
     * The data needed to update a GitRepository.
     */
    data: XOR<GitRepositoryUpdateInput, GitRepositoryUncheckedUpdateInput>
    /**
     * Choose, which GitRepository to update.
     */
    where: GitRepositoryWhereUniqueInput
  }

  /**
   * GitRepository updateMany
   */
  export type GitRepositoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GitRepositories.
     */
    data: XOR<GitRepositoryUpdateManyMutationInput, GitRepositoryUncheckedUpdateManyInput>
    /**
     * Filter which GitRepositories to update
     */
    where?: GitRepositoryWhereInput
    /**
     * Limit how many GitRepositories to update.
     */
    limit?: number
  }

  /**
   * GitRepository updateManyAndReturn
   */
  export type GitRepositoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitRepository
     */
    select?: GitRepositorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GitRepository
     */
    omit?: GitRepositoryOmit<ExtArgs> | null
    /**
     * The data used to update GitRepositories.
     */
    data: XOR<GitRepositoryUpdateManyMutationInput, GitRepositoryUncheckedUpdateManyInput>
    /**
     * Filter which GitRepositories to update
     */
    where?: GitRepositoryWhereInput
    /**
     * Limit how many GitRepositories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitRepositoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GitRepository upsert
   */
  export type GitRepositoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitRepository
     */
    select?: GitRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GitRepository
     */
    omit?: GitRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitRepositoryInclude<ExtArgs> | null
    /**
     * The filter to search for the GitRepository to update in case it exists.
     */
    where: GitRepositoryWhereUniqueInput
    /**
     * In case the GitRepository found by the `where` argument doesn't exist, create a new GitRepository with this data.
     */
    create: XOR<GitRepositoryCreateInput, GitRepositoryUncheckedCreateInput>
    /**
     * In case the GitRepository was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GitRepositoryUpdateInput, GitRepositoryUncheckedUpdateInput>
  }

  /**
   * GitRepository delete
   */
  export type GitRepositoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitRepository
     */
    select?: GitRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GitRepository
     */
    omit?: GitRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitRepositoryInclude<ExtArgs> | null
    /**
     * Filter which GitRepository to delete.
     */
    where: GitRepositoryWhereUniqueInput
  }

  /**
   * GitRepository deleteMany
   */
  export type GitRepositoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GitRepositories to delete
     */
    where?: GitRepositoryWhereInput
    /**
     * Limit how many GitRepositories to delete.
     */
    limit?: number
  }

  /**
   * GitRepository.commits
   */
  export type GitRepository$commitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitCommit
     */
    select?: GitCommitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GitCommit
     */
    omit?: GitCommitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitCommitInclude<ExtArgs> | null
    where?: GitCommitWhereInput
    orderBy?: GitCommitOrderByWithRelationInput | GitCommitOrderByWithRelationInput[]
    cursor?: GitCommitWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GitCommitScalarFieldEnum | GitCommitScalarFieldEnum[]
  }

  /**
   * GitRepository without action
   */
  export type GitRepositoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitRepository
     */
    select?: GitRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GitRepository
     */
    omit?: GitRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitRepositoryInclude<ExtArgs> | null
  }


  /**
   * Model GitCommit
   */

  export type AggregateGitCommit = {
    _count: GitCommitCountAggregateOutputType | null
    _min: GitCommitMinAggregateOutputType | null
    _max: GitCommitMaxAggregateOutputType | null
  }

  export type GitCommitMinAggregateOutputType = {
    id: string | null
    hash: string | null
    message: string | null
    author: string | null
    authorEmail: string | null
    repoId: string | null
    committedAt: Date | null
    createdAt: Date | null
  }

  export type GitCommitMaxAggregateOutputType = {
    id: string | null
    hash: string | null
    message: string | null
    author: string | null
    authorEmail: string | null
    repoId: string | null
    committedAt: Date | null
    createdAt: Date | null
  }

  export type GitCommitCountAggregateOutputType = {
    id: number
    hash: number
    message: number
    author: number
    authorEmail: number
    repoId: number
    committedAt: number
    createdAt: number
    _all: number
  }


  export type GitCommitMinAggregateInputType = {
    id?: true
    hash?: true
    message?: true
    author?: true
    authorEmail?: true
    repoId?: true
    committedAt?: true
    createdAt?: true
  }

  export type GitCommitMaxAggregateInputType = {
    id?: true
    hash?: true
    message?: true
    author?: true
    authorEmail?: true
    repoId?: true
    committedAt?: true
    createdAt?: true
  }

  export type GitCommitCountAggregateInputType = {
    id?: true
    hash?: true
    message?: true
    author?: true
    authorEmail?: true
    repoId?: true
    committedAt?: true
    createdAt?: true
    _all?: true
  }

  export type GitCommitAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GitCommit to aggregate.
     */
    where?: GitCommitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GitCommits to fetch.
     */
    orderBy?: GitCommitOrderByWithRelationInput | GitCommitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GitCommitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GitCommits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GitCommits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GitCommits
    **/
    _count?: true | GitCommitCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GitCommitMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GitCommitMaxAggregateInputType
  }

  export type GetGitCommitAggregateType<T extends GitCommitAggregateArgs> = {
        [P in keyof T & keyof AggregateGitCommit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGitCommit[P]>
      : GetScalarType<T[P], AggregateGitCommit[P]>
  }




  export type GitCommitGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GitCommitWhereInput
    orderBy?: GitCommitOrderByWithAggregationInput | GitCommitOrderByWithAggregationInput[]
    by: GitCommitScalarFieldEnum[] | GitCommitScalarFieldEnum
    having?: GitCommitScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GitCommitCountAggregateInputType | true
    _min?: GitCommitMinAggregateInputType
    _max?: GitCommitMaxAggregateInputType
  }

  export type GitCommitGroupByOutputType = {
    id: string
    hash: string
    message: string
    author: string
    authorEmail: string
    repoId: string
    committedAt: Date
    createdAt: Date
    _count: GitCommitCountAggregateOutputType | null
    _min: GitCommitMinAggregateOutputType | null
    _max: GitCommitMaxAggregateOutputType | null
  }

  type GetGitCommitGroupByPayload<T extends GitCommitGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GitCommitGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GitCommitGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GitCommitGroupByOutputType[P]>
            : GetScalarType<T[P], GitCommitGroupByOutputType[P]>
        }
      >
    >


  export type GitCommitSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    hash?: boolean
    message?: boolean
    author?: boolean
    authorEmail?: boolean
    repoId?: boolean
    committedAt?: boolean
    createdAt?: boolean
    repository?: boolean | GitRepositoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gitCommit"]>

  export type GitCommitSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    hash?: boolean
    message?: boolean
    author?: boolean
    authorEmail?: boolean
    repoId?: boolean
    committedAt?: boolean
    createdAt?: boolean
    repository?: boolean | GitRepositoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gitCommit"]>

  export type GitCommitSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    hash?: boolean
    message?: boolean
    author?: boolean
    authorEmail?: boolean
    repoId?: boolean
    committedAt?: boolean
    createdAt?: boolean
    repository?: boolean | GitRepositoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gitCommit"]>

  export type GitCommitSelectScalar = {
    id?: boolean
    hash?: boolean
    message?: boolean
    author?: boolean
    authorEmail?: boolean
    repoId?: boolean
    committedAt?: boolean
    createdAt?: boolean
  }

  export type GitCommitOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "hash" | "message" | "author" | "authorEmail" | "repoId" | "committedAt" | "createdAt", ExtArgs["result"]["gitCommit"]>
  export type GitCommitInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repository?: boolean | GitRepositoryDefaultArgs<ExtArgs>
  }
  export type GitCommitIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repository?: boolean | GitRepositoryDefaultArgs<ExtArgs>
  }
  export type GitCommitIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repository?: boolean | GitRepositoryDefaultArgs<ExtArgs>
  }

  export type $GitCommitPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GitCommit"
    objects: {
      repository: Prisma.$GitRepositoryPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      hash: string
      message: string
      author: string
      authorEmail: string
      repoId: string
      committedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["gitCommit"]>
    composites: {}
  }

  type GitCommitGetPayload<S extends boolean | null | undefined | GitCommitDefaultArgs> = $Result.GetResult<Prisma.$GitCommitPayload, S>

  type GitCommitCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GitCommitFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GitCommitCountAggregateInputType | true
    }

  export interface GitCommitDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GitCommit'], meta: { name: 'GitCommit' } }
    /**
     * Find zero or one GitCommit that matches the filter.
     * @param {GitCommitFindUniqueArgs} args - Arguments to find a GitCommit
     * @example
     * // Get one GitCommit
     * const gitCommit = await prisma.gitCommit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GitCommitFindUniqueArgs>(args: SelectSubset<T, GitCommitFindUniqueArgs<ExtArgs>>): Prisma__GitCommitClient<$Result.GetResult<Prisma.$GitCommitPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GitCommit that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GitCommitFindUniqueOrThrowArgs} args - Arguments to find a GitCommit
     * @example
     * // Get one GitCommit
     * const gitCommit = await prisma.gitCommit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GitCommitFindUniqueOrThrowArgs>(args: SelectSubset<T, GitCommitFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GitCommitClient<$Result.GetResult<Prisma.$GitCommitPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GitCommit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GitCommitFindFirstArgs} args - Arguments to find a GitCommit
     * @example
     * // Get one GitCommit
     * const gitCommit = await prisma.gitCommit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GitCommitFindFirstArgs>(args?: SelectSubset<T, GitCommitFindFirstArgs<ExtArgs>>): Prisma__GitCommitClient<$Result.GetResult<Prisma.$GitCommitPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GitCommit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GitCommitFindFirstOrThrowArgs} args - Arguments to find a GitCommit
     * @example
     * // Get one GitCommit
     * const gitCommit = await prisma.gitCommit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GitCommitFindFirstOrThrowArgs>(args?: SelectSubset<T, GitCommitFindFirstOrThrowArgs<ExtArgs>>): Prisma__GitCommitClient<$Result.GetResult<Prisma.$GitCommitPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GitCommits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GitCommitFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GitCommits
     * const gitCommits = await prisma.gitCommit.findMany()
     * 
     * // Get first 10 GitCommits
     * const gitCommits = await prisma.gitCommit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gitCommitWithIdOnly = await prisma.gitCommit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GitCommitFindManyArgs>(args?: SelectSubset<T, GitCommitFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GitCommitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GitCommit.
     * @param {GitCommitCreateArgs} args - Arguments to create a GitCommit.
     * @example
     * // Create one GitCommit
     * const GitCommit = await prisma.gitCommit.create({
     *   data: {
     *     // ... data to create a GitCommit
     *   }
     * })
     * 
     */
    create<T extends GitCommitCreateArgs>(args: SelectSubset<T, GitCommitCreateArgs<ExtArgs>>): Prisma__GitCommitClient<$Result.GetResult<Prisma.$GitCommitPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GitCommits.
     * @param {GitCommitCreateManyArgs} args - Arguments to create many GitCommits.
     * @example
     * // Create many GitCommits
     * const gitCommit = await prisma.gitCommit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GitCommitCreateManyArgs>(args?: SelectSubset<T, GitCommitCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GitCommits and returns the data saved in the database.
     * @param {GitCommitCreateManyAndReturnArgs} args - Arguments to create many GitCommits.
     * @example
     * // Create many GitCommits
     * const gitCommit = await prisma.gitCommit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GitCommits and only return the `id`
     * const gitCommitWithIdOnly = await prisma.gitCommit.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GitCommitCreateManyAndReturnArgs>(args?: SelectSubset<T, GitCommitCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GitCommitPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GitCommit.
     * @param {GitCommitDeleteArgs} args - Arguments to delete one GitCommit.
     * @example
     * // Delete one GitCommit
     * const GitCommit = await prisma.gitCommit.delete({
     *   where: {
     *     // ... filter to delete one GitCommit
     *   }
     * })
     * 
     */
    delete<T extends GitCommitDeleteArgs>(args: SelectSubset<T, GitCommitDeleteArgs<ExtArgs>>): Prisma__GitCommitClient<$Result.GetResult<Prisma.$GitCommitPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GitCommit.
     * @param {GitCommitUpdateArgs} args - Arguments to update one GitCommit.
     * @example
     * // Update one GitCommit
     * const gitCommit = await prisma.gitCommit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GitCommitUpdateArgs>(args: SelectSubset<T, GitCommitUpdateArgs<ExtArgs>>): Prisma__GitCommitClient<$Result.GetResult<Prisma.$GitCommitPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GitCommits.
     * @param {GitCommitDeleteManyArgs} args - Arguments to filter GitCommits to delete.
     * @example
     * // Delete a few GitCommits
     * const { count } = await prisma.gitCommit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GitCommitDeleteManyArgs>(args?: SelectSubset<T, GitCommitDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GitCommits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GitCommitUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GitCommits
     * const gitCommit = await prisma.gitCommit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GitCommitUpdateManyArgs>(args: SelectSubset<T, GitCommitUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GitCommits and returns the data updated in the database.
     * @param {GitCommitUpdateManyAndReturnArgs} args - Arguments to update many GitCommits.
     * @example
     * // Update many GitCommits
     * const gitCommit = await prisma.gitCommit.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GitCommits and only return the `id`
     * const gitCommitWithIdOnly = await prisma.gitCommit.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GitCommitUpdateManyAndReturnArgs>(args: SelectSubset<T, GitCommitUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GitCommitPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GitCommit.
     * @param {GitCommitUpsertArgs} args - Arguments to update or create a GitCommit.
     * @example
     * // Update or create a GitCommit
     * const gitCommit = await prisma.gitCommit.upsert({
     *   create: {
     *     // ... data to create a GitCommit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GitCommit we want to update
     *   }
     * })
     */
    upsert<T extends GitCommitUpsertArgs>(args: SelectSubset<T, GitCommitUpsertArgs<ExtArgs>>): Prisma__GitCommitClient<$Result.GetResult<Prisma.$GitCommitPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GitCommits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GitCommitCountArgs} args - Arguments to filter GitCommits to count.
     * @example
     * // Count the number of GitCommits
     * const count = await prisma.gitCommit.count({
     *   where: {
     *     // ... the filter for the GitCommits we want to count
     *   }
     * })
    **/
    count<T extends GitCommitCountArgs>(
      args?: Subset<T, GitCommitCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GitCommitCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GitCommit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GitCommitAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GitCommitAggregateArgs>(args: Subset<T, GitCommitAggregateArgs>): Prisma.PrismaPromise<GetGitCommitAggregateType<T>>

    /**
     * Group by GitCommit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GitCommitGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GitCommitGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GitCommitGroupByArgs['orderBy'] }
        : { orderBy?: GitCommitGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GitCommitGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGitCommitGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GitCommit model
   */
  readonly fields: GitCommitFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GitCommit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GitCommitClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    repository<T extends GitRepositoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GitRepositoryDefaultArgs<ExtArgs>>): Prisma__GitRepositoryClient<$Result.GetResult<Prisma.$GitRepositoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GitCommit model
   */
  interface GitCommitFieldRefs {
    readonly id: FieldRef<"GitCommit", 'String'>
    readonly hash: FieldRef<"GitCommit", 'String'>
    readonly message: FieldRef<"GitCommit", 'String'>
    readonly author: FieldRef<"GitCommit", 'String'>
    readonly authorEmail: FieldRef<"GitCommit", 'String'>
    readonly repoId: FieldRef<"GitCommit", 'String'>
    readonly committedAt: FieldRef<"GitCommit", 'DateTime'>
    readonly createdAt: FieldRef<"GitCommit", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GitCommit findUnique
   */
  export type GitCommitFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitCommit
     */
    select?: GitCommitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GitCommit
     */
    omit?: GitCommitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitCommitInclude<ExtArgs> | null
    /**
     * Filter, which GitCommit to fetch.
     */
    where: GitCommitWhereUniqueInput
  }

  /**
   * GitCommit findUniqueOrThrow
   */
  export type GitCommitFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitCommit
     */
    select?: GitCommitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GitCommit
     */
    omit?: GitCommitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitCommitInclude<ExtArgs> | null
    /**
     * Filter, which GitCommit to fetch.
     */
    where: GitCommitWhereUniqueInput
  }

  /**
   * GitCommit findFirst
   */
  export type GitCommitFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitCommit
     */
    select?: GitCommitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GitCommit
     */
    omit?: GitCommitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitCommitInclude<ExtArgs> | null
    /**
     * Filter, which GitCommit to fetch.
     */
    where?: GitCommitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GitCommits to fetch.
     */
    orderBy?: GitCommitOrderByWithRelationInput | GitCommitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GitCommits.
     */
    cursor?: GitCommitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GitCommits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GitCommits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GitCommits.
     */
    distinct?: GitCommitScalarFieldEnum | GitCommitScalarFieldEnum[]
  }

  /**
   * GitCommit findFirstOrThrow
   */
  export type GitCommitFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitCommit
     */
    select?: GitCommitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GitCommit
     */
    omit?: GitCommitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitCommitInclude<ExtArgs> | null
    /**
     * Filter, which GitCommit to fetch.
     */
    where?: GitCommitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GitCommits to fetch.
     */
    orderBy?: GitCommitOrderByWithRelationInput | GitCommitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GitCommits.
     */
    cursor?: GitCommitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GitCommits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GitCommits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GitCommits.
     */
    distinct?: GitCommitScalarFieldEnum | GitCommitScalarFieldEnum[]
  }

  /**
   * GitCommit findMany
   */
  export type GitCommitFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitCommit
     */
    select?: GitCommitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GitCommit
     */
    omit?: GitCommitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitCommitInclude<ExtArgs> | null
    /**
     * Filter, which GitCommits to fetch.
     */
    where?: GitCommitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GitCommits to fetch.
     */
    orderBy?: GitCommitOrderByWithRelationInput | GitCommitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GitCommits.
     */
    cursor?: GitCommitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GitCommits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GitCommits.
     */
    skip?: number
    distinct?: GitCommitScalarFieldEnum | GitCommitScalarFieldEnum[]
  }

  /**
   * GitCommit create
   */
  export type GitCommitCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitCommit
     */
    select?: GitCommitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GitCommit
     */
    omit?: GitCommitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitCommitInclude<ExtArgs> | null
    /**
     * The data needed to create a GitCommit.
     */
    data: XOR<GitCommitCreateInput, GitCommitUncheckedCreateInput>
  }

  /**
   * GitCommit createMany
   */
  export type GitCommitCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GitCommits.
     */
    data: GitCommitCreateManyInput | GitCommitCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GitCommit createManyAndReturn
   */
  export type GitCommitCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitCommit
     */
    select?: GitCommitSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GitCommit
     */
    omit?: GitCommitOmit<ExtArgs> | null
    /**
     * The data used to create many GitCommits.
     */
    data: GitCommitCreateManyInput | GitCommitCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitCommitIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GitCommit update
   */
  export type GitCommitUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitCommit
     */
    select?: GitCommitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GitCommit
     */
    omit?: GitCommitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitCommitInclude<ExtArgs> | null
    /**
     * The data needed to update a GitCommit.
     */
    data: XOR<GitCommitUpdateInput, GitCommitUncheckedUpdateInput>
    /**
     * Choose, which GitCommit to update.
     */
    where: GitCommitWhereUniqueInput
  }

  /**
   * GitCommit updateMany
   */
  export type GitCommitUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GitCommits.
     */
    data: XOR<GitCommitUpdateManyMutationInput, GitCommitUncheckedUpdateManyInput>
    /**
     * Filter which GitCommits to update
     */
    where?: GitCommitWhereInput
    /**
     * Limit how many GitCommits to update.
     */
    limit?: number
  }

  /**
   * GitCommit updateManyAndReturn
   */
  export type GitCommitUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitCommit
     */
    select?: GitCommitSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GitCommit
     */
    omit?: GitCommitOmit<ExtArgs> | null
    /**
     * The data used to update GitCommits.
     */
    data: XOR<GitCommitUpdateManyMutationInput, GitCommitUncheckedUpdateManyInput>
    /**
     * Filter which GitCommits to update
     */
    where?: GitCommitWhereInput
    /**
     * Limit how many GitCommits to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitCommitIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GitCommit upsert
   */
  export type GitCommitUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitCommit
     */
    select?: GitCommitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GitCommit
     */
    omit?: GitCommitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitCommitInclude<ExtArgs> | null
    /**
     * The filter to search for the GitCommit to update in case it exists.
     */
    where: GitCommitWhereUniqueInput
    /**
     * In case the GitCommit found by the `where` argument doesn't exist, create a new GitCommit with this data.
     */
    create: XOR<GitCommitCreateInput, GitCommitUncheckedCreateInput>
    /**
     * In case the GitCommit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GitCommitUpdateInput, GitCommitUncheckedUpdateInput>
  }

  /**
   * GitCommit delete
   */
  export type GitCommitDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitCommit
     */
    select?: GitCommitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GitCommit
     */
    omit?: GitCommitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitCommitInclude<ExtArgs> | null
    /**
     * Filter which GitCommit to delete.
     */
    where: GitCommitWhereUniqueInput
  }

  /**
   * GitCommit deleteMany
   */
  export type GitCommitDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GitCommits to delete
     */
    where?: GitCommitWhereInput
    /**
     * Limit how many GitCommits to delete.
     */
    limit?: number
  }

  /**
   * GitCommit without action
   */
  export type GitCommitDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GitCommit
     */
    select?: GitCommitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GitCommit
     */
    omit?: GitCommitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GitCommitInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    username: 'username',
    name: 'name',
    avatar: 'avatar',
    githubId: 'githubId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    image: 'image',
    emailVerified: 'emailVerified'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    expires_at: 'expires_at',
    token_type: 'token_type',
    scope: 'scope',
    id_token: 'id_token',
    session_state: 'session_state'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    sessionToken: 'sessionToken',
    userId: 'userId',
    expires: 'expires'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const VerificationTokenScalarFieldEnum: {
    identifier: 'identifier',
    token: 'token',
    expires: 'expires'
  };

  export type VerificationTokenScalarFieldEnum = (typeof VerificationTokenScalarFieldEnum)[keyof typeof VerificationTokenScalarFieldEnum]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    visibility: 'visibility',
    repositoryUrl: 'repositoryUrl',
    ownerId: 'ownerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const ProjectMemberScalarFieldEnum: {
    id: 'id',
    role: 'role',
    userId: 'userId',
    projectId: 'projectId',
    joinedAt: 'joinedAt'
  };

  export type ProjectMemberScalarFieldEnum = (typeof ProjectMemberScalarFieldEnum)[keyof typeof ProjectMemberScalarFieldEnum]


  export const ProjectFileScalarFieldEnum: {
    id: 'id',
    path: 'path',
    name: 'name',
    type: 'type',
    content: 'content',
    size: 'size',
    mimeType: 'mimeType',
    projectId: 'projectId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProjectFileScalarFieldEnum = (typeof ProjectFileScalarFieldEnum)[keyof typeof ProjectFileScalarFieldEnum]


  export const FileActivityScalarFieldEnum: {
    id: 'id',
    action: 'action',
    changes: 'changes',
    fileId: 'fileId',
    userId: 'userId',
    createdAt: 'createdAt'
  };

  export type FileActivityScalarFieldEnum = (typeof FileActivityScalarFieldEnum)[keyof typeof FileActivityScalarFieldEnum]


  export const CollaborationSessionScalarFieldEnum: {
    id: 'id',
    name: 'name',
    isActive: 'isActive',
    projectId: 'projectId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    endedAt: 'endedAt'
  };

  export type CollaborationSessionScalarFieldEnum = (typeof CollaborationSessionScalarFieldEnum)[keyof typeof CollaborationSessionScalarFieldEnum]


  export const SessionParticipantScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    userId: 'userId',
    cursor: 'cursor',
    isActive: 'isActive',
    joinedAt: 'joinedAt',
    leftAt: 'leftAt'
  };

  export type SessionParticipantScalarFieldEnum = (typeof SessionParticipantScalarFieldEnum)[keyof typeof SessionParticipantScalarFieldEnum]


  export const AiChatSessionScalarFieldEnum: {
    id: 'id',
    title: 'title',
    context: 'context',
    userId: 'userId',
    projectId: 'projectId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AiChatSessionScalarFieldEnum = (typeof AiChatSessionScalarFieldEnum)[keyof typeof AiChatSessionScalarFieldEnum]


  export const AiMessageScalarFieldEnum: {
    id: 'id',
    role: 'role',
    content: 'content',
    metadata: 'metadata',
    sessionId: 'sessionId',
    createdAt: 'createdAt'
  };

  export type AiMessageScalarFieldEnum = (typeof AiMessageScalarFieldEnum)[keyof typeof AiMessageScalarFieldEnum]


  export const GitRepositoryScalarFieldEnum: {
    id: 'id',
    url: 'url',
    branch: 'branch',
    lastSync: 'lastSync',
    syncStatus: 'syncStatus',
    projectId: 'projectId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GitRepositoryScalarFieldEnum = (typeof GitRepositoryScalarFieldEnum)[keyof typeof GitRepositoryScalarFieldEnum]


  export const GitCommitScalarFieldEnum: {
    id: 'id',
    hash: 'hash',
    message: 'message',
    author: 'author',
    authorEmail: 'authorEmail',
    repoId: 'repoId',
    committedAt: 'committedAt',
    createdAt: 'createdAt'
  };

  export type GitCommitScalarFieldEnum = (typeof GitCommitScalarFieldEnum)[keyof typeof GitCommitScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'ProjectVisibility'
   */
  export type EnumProjectVisibilityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectVisibility'>
    


  /**
   * Reference to a field of type 'ProjectVisibility[]'
   */
  export type ListEnumProjectVisibilityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectVisibility[]'>
    


  /**
   * Reference to a field of type 'ProjectRole'
   */
  export type EnumProjectRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectRole'>
    


  /**
   * Reference to a field of type 'ProjectRole[]'
   */
  export type ListEnumProjectRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectRole[]'>
    


  /**
   * Reference to a field of type 'FileType'
   */
  export type EnumFileTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FileType'>
    


  /**
   * Reference to a field of type 'FileType[]'
   */
  export type ListEnumFileTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FileType[]'>
    


  /**
   * Reference to a field of type 'FileAction'
   */
  export type EnumFileActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FileAction'>
    


  /**
   * Reference to a field of type 'FileAction[]'
   */
  export type ListEnumFileActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FileAction[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'AiContext'
   */
  export type EnumAiContextFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AiContext'>
    


  /**
   * Reference to a field of type 'AiContext[]'
   */
  export type ListEnumAiContextFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AiContext[]'>
    


  /**
   * Reference to a field of type 'MessageRole'
   */
  export type EnumMessageRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageRole'>
    


  /**
   * Reference to a field of type 'MessageRole[]'
   */
  export type ListEnumMessageRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageRole[]'>
    


  /**
   * Reference to a field of type 'SyncStatus'
   */
  export type EnumSyncStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SyncStatus'>
    


  /**
   * Reference to a field of type 'SyncStatus[]'
   */
  export type ListEnumSyncStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SyncStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    githubId?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    image?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    ownedProjects?: ProjectListRelationFilter
    memberships?: ProjectMemberListRelationFilter
    aiSessions?: AiChatSessionListRelationFilter
    fileActivities?: FileActivityListRelationFilter
    sessionParticipations?: SessionParticipantListRelationFilter
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    name?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    githubId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    image?: SortOrderInput | SortOrder
    emailVerified?: SortOrderInput | SortOrder
    ownedProjects?: ProjectOrderByRelationAggregateInput
    memberships?: ProjectMemberOrderByRelationAggregateInput
    aiSessions?: AiChatSessionOrderByRelationAggregateInput
    fileActivities?: FileActivityOrderByRelationAggregateInput
    sessionParticipations?: SessionParticipantOrderByRelationAggregateInput
    accounts?: AccountOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    username?: string
    githubId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    image?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    ownedProjects?: ProjectListRelationFilter
    memberships?: ProjectMemberListRelationFilter
    aiSessions?: AiChatSessionListRelationFilter
    fileActivities?: FileActivityListRelationFilter
    sessionParticipations?: SessionParticipantListRelationFilter
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
  }, "id" | "email" | "username" | "githubId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    name?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    githubId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    image?: SortOrderInput | SortOrder
    emailVerified?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    githubId?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    emailVerified?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_providerAccountId?: AccountProviderProviderAccountIdCompoundUniqueInput
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "provider_providerAccountId">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    _count?: AccountCountOrderByAggregateInput
    _avg?: AccountAvgOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
    _sum?: AccountSumOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    type?: StringWithAggregatesFilter<"Account"> | string
    provider?: StringWithAggregatesFilter<"Account"> | string
    providerAccountId?: StringWithAggregatesFilter<"Account"> | string
    refresh_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    access_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    expires_at?: IntNullableWithAggregatesFilter<"Account"> | number | null
    token_type?: StringNullableWithAggregatesFilter<"Account"> | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    id_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    session_state?: StringNullableWithAggregatesFilter<"Account"> | string | null
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionToken?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "sessionToken">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    sessionToken?: StringWithAggregatesFilter<"Session"> | string
    userId?: StringWithAggregatesFilter<"Session"> | string
    expires?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type VerificationTokenWhereInput = {
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    token?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }

  export type VerificationTokenOrderByWithRelationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenWhereUniqueInput = Prisma.AtLeast<{
    token?: string
    identifier_token?: VerificationTokenIdentifierTokenCompoundUniqueInput
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }, "token" | "identifier_token">

  export type VerificationTokenOrderByWithAggregationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
    _count?: VerificationTokenCountOrderByAggregateInput
    _max?: VerificationTokenMaxOrderByAggregateInput
    _min?: VerificationTokenMinOrderByAggregateInput
  }

  export type VerificationTokenScalarWhereWithAggregatesInput = {
    AND?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    OR?: VerificationTokenScalarWhereWithAggregatesInput[]
    NOT?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    identifier?: StringWithAggregatesFilter<"VerificationToken"> | string
    token?: StringWithAggregatesFilter<"VerificationToken"> | string
    expires?: DateTimeWithAggregatesFilter<"VerificationToken"> | Date | string
  }

  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    visibility?: EnumProjectVisibilityFilter<"Project"> | $Enums.ProjectVisibility
    repositoryUrl?: StringNullableFilter<"Project"> | string | null
    ownerId?: StringFilter<"Project"> | string
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    files?: ProjectFileListRelationFilter
    members?: ProjectMemberListRelationFilter
    sessions?: CollaborationSessionListRelationFilter
    aiSessions?: AiChatSessionListRelationFilter
    gitRepository?: XOR<GitRepositoryNullableScalarRelationFilter, GitRepositoryWhereInput> | null
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    visibility?: SortOrder
    repositoryUrl?: SortOrderInput | SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    owner?: UserOrderByWithRelationInput
    files?: ProjectFileOrderByRelationAggregateInput
    members?: ProjectMemberOrderByRelationAggregateInput
    sessions?: CollaborationSessionOrderByRelationAggregateInput
    aiSessions?: AiChatSessionOrderByRelationAggregateInput
    gitRepository?: GitRepositoryOrderByWithRelationInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    name?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    visibility?: EnumProjectVisibilityFilter<"Project"> | $Enums.ProjectVisibility
    repositoryUrl?: StringNullableFilter<"Project"> | string | null
    ownerId?: StringFilter<"Project"> | string
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    files?: ProjectFileListRelationFilter
    members?: ProjectMemberListRelationFilter
    sessions?: CollaborationSessionListRelationFilter
    aiSessions?: AiChatSessionListRelationFilter
    gitRepository?: XOR<GitRepositoryNullableScalarRelationFilter, GitRepositoryWhereInput> | null
  }, "id">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    visibility?: SortOrder
    repositoryUrl?: SortOrderInput | SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Project"> | string
    name?: StringWithAggregatesFilter<"Project"> | string
    description?: StringNullableWithAggregatesFilter<"Project"> | string | null
    visibility?: EnumProjectVisibilityWithAggregatesFilter<"Project"> | $Enums.ProjectVisibility
    repositoryUrl?: StringNullableWithAggregatesFilter<"Project"> | string | null
    ownerId?: StringWithAggregatesFilter<"Project"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
  }

  export type ProjectMemberWhereInput = {
    AND?: ProjectMemberWhereInput | ProjectMemberWhereInput[]
    OR?: ProjectMemberWhereInput[]
    NOT?: ProjectMemberWhereInput | ProjectMemberWhereInput[]
    id?: StringFilter<"ProjectMember"> | string
    role?: EnumProjectRoleFilter<"ProjectMember"> | $Enums.ProjectRole
    userId?: StringFilter<"ProjectMember"> | string
    projectId?: StringFilter<"ProjectMember"> | string
    joinedAt?: DateTimeFilter<"ProjectMember"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type ProjectMemberOrderByWithRelationInput = {
    id?: SortOrder
    role?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    joinedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    project?: ProjectOrderByWithRelationInput
  }

  export type ProjectMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_projectId?: ProjectMemberUserIdProjectIdCompoundUniqueInput
    AND?: ProjectMemberWhereInput | ProjectMemberWhereInput[]
    OR?: ProjectMemberWhereInput[]
    NOT?: ProjectMemberWhereInput | ProjectMemberWhereInput[]
    role?: EnumProjectRoleFilter<"ProjectMember"> | $Enums.ProjectRole
    userId?: StringFilter<"ProjectMember"> | string
    projectId?: StringFilter<"ProjectMember"> | string
    joinedAt?: DateTimeFilter<"ProjectMember"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }, "id" | "userId_projectId">

  export type ProjectMemberOrderByWithAggregationInput = {
    id?: SortOrder
    role?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    joinedAt?: SortOrder
    _count?: ProjectMemberCountOrderByAggregateInput
    _max?: ProjectMemberMaxOrderByAggregateInput
    _min?: ProjectMemberMinOrderByAggregateInput
  }

  export type ProjectMemberScalarWhereWithAggregatesInput = {
    AND?: ProjectMemberScalarWhereWithAggregatesInput | ProjectMemberScalarWhereWithAggregatesInput[]
    OR?: ProjectMemberScalarWhereWithAggregatesInput[]
    NOT?: ProjectMemberScalarWhereWithAggregatesInput | ProjectMemberScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProjectMember"> | string
    role?: EnumProjectRoleWithAggregatesFilter<"ProjectMember"> | $Enums.ProjectRole
    userId?: StringWithAggregatesFilter<"ProjectMember"> | string
    projectId?: StringWithAggregatesFilter<"ProjectMember"> | string
    joinedAt?: DateTimeWithAggregatesFilter<"ProjectMember"> | Date | string
  }

  export type ProjectFileWhereInput = {
    AND?: ProjectFileWhereInput | ProjectFileWhereInput[]
    OR?: ProjectFileWhereInput[]
    NOT?: ProjectFileWhereInput | ProjectFileWhereInput[]
    id?: StringFilter<"ProjectFile"> | string
    path?: StringFilter<"ProjectFile"> | string
    name?: StringFilter<"ProjectFile"> | string
    type?: EnumFileTypeFilter<"ProjectFile"> | $Enums.FileType
    content?: StringNullableFilter<"ProjectFile"> | string | null
    size?: IntFilter<"ProjectFile"> | number
    mimeType?: StringNullableFilter<"ProjectFile"> | string | null
    projectId?: StringFilter<"ProjectFile"> | string
    createdAt?: DateTimeFilter<"ProjectFile"> | Date | string
    updatedAt?: DateTimeFilter<"ProjectFile"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    activities?: FileActivityListRelationFilter
  }

  export type ProjectFileOrderByWithRelationInput = {
    id?: SortOrder
    path?: SortOrder
    name?: SortOrder
    type?: SortOrder
    content?: SortOrderInput | SortOrder
    size?: SortOrder
    mimeType?: SortOrderInput | SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
    activities?: FileActivityOrderByRelationAggregateInput
  }

  export type ProjectFileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    projectId_path?: ProjectFileProjectIdPathCompoundUniqueInput
    AND?: ProjectFileWhereInput | ProjectFileWhereInput[]
    OR?: ProjectFileWhereInput[]
    NOT?: ProjectFileWhereInput | ProjectFileWhereInput[]
    path?: StringFilter<"ProjectFile"> | string
    name?: StringFilter<"ProjectFile"> | string
    type?: EnumFileTypeFilter<"ProjectFile"> | $Enums.FileType
    content?: StringNullableFilter<"ProjectFile"> | string | null
    size?: IntFilter<"ProjectFile"> | number
    mimeType?: StringNullableFilter<"ProjectFile"> | string | null
    projectId?: StringFilter<"ProjectFile"> | string
    createdAt?: DateTimeFilter<"ProjectFile"> | Date | string
    updatedAt?: DateTimeFilter<"ProjectFile"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    activities?: FileActivityListRelationFilter
  }, "id" | "projectId_path">

  export type ProjectFileOrderByWithAggregationInput = {
    id?: SortOrder
    path?: SortOrder
    name?: SortOrder
    type?: SortOrder
    content?: SortOrderInput | SortOrder
    size?: SortOrder
    mimeType?: SortOrderInput | SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProjectFileCountOrderByAggregateInput
    _avg?: ProjectFileAvgOrderByAggregateInput
    _max?: ProjectFileMaxOrderByAggregateInput
    _min?: ProjectFileMinOrderByAggregateInput
    _sum?: ProjectFileSumOrderByAggregateInput
  }

  export type ProjectFileScalarWhereWithAggregatesInput = {
    AND?: ProjectFileScalarWhereWithAggregatesInput | ProjectFileScalarWhereWithAggregatesInput[]
    OR?: ProjectFileScalarWhereWithAggregatesInput[]
    NOT?: ProjectFileScalarWhereWithAggregatesInput | ProjectFileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProjectFile"> | string
    path?: StringWithAggregatesFilter<"ProjectFile"> | string
    name?: StringWithAggregatesFilter<"ProjectFile"> | string
    type?: EnumFileTypeWithAggregatesFilter<"ProjectFile"> | $Enums.FileType
    content?: StringNullableWithAggregatesFilter<"ProjectFile"> | string | null
    size?: IntWithAggregatesFilter<"ProjectFile"> | number
    mimeType?: StringNullableWithAggregatesFilter<"ProjectFile"> | string | null
    projectId?: StringWithAggregatesFilter<"ProjectFile"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ProjectFile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProjectFile"> | Date | string
  }

  export type FileActivityWhereInput = {
    AND?: FileActivityWhereInput | FileActivityWhereInput[]
    OR?: FileActivityWhereInput[]
    NOT?: FileActivityWhereInput | FileActivityWhereInput[]
    id?: StringFilter<"FileActivity"> | string
    action?: EnumFileActionFilter<"FileActivity"> | $Enums.FileAction
    changes?: JsonNullableFilter<"FileActivity">
    fileId?: StringFilter<"FileActivity"> | string
    userId?: StringFilter<"FileActivity"> | string
    createdAt?: DateTimeFilter<"FileActivity"> | Date | string
    file?: XOR<ProjectFileScalarRelationFilter, ProjectFileWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type FileActivityOrderByWithRelationInput = {
    id?: SortOrder
    action?: SortOrder
    changes?: SortOrderInput | SortOrder
    fileId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    file?: ProjectFileOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type FileActivityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FileActivityWhereInput | FileActivityWhereInput[]
    OR?: FileActivityWhereInput[]
    NOT?: FileActivityWhereInput | FileActivityWhereInput[]
    action?: EnumFileActionFilter<"FileActivity"> | $Enums.FileAction
    changes?: JsonNullableFilter<"FileActivity">
    fileId?: StringFilter<"FileActivity"> | string
    userId?: StringFilter<"FileActivity"> | string
    createdAt?: DateTimeFilter<"FileActivity"> | Date | string
    file?: XOR<ProjectFileScalarRelationFilter, ProjectFileWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type FileActivityOrderByWithAggregationInput = {
    id?: SortOrder
    action?: SortOrder
    changes?: SortOrderInput | SortOrder
    fileId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    _count?: FileActivityCountOrderByAggregateInput
    _max?: FileActivityMaxOrderByAggregateInput
    _min?: FileActivityMinOrderByAggregateInput
  }

  export type FileActivityScalarWhereWithAggregatesInput = {
    AND?: FileActivityScalarWhereWithAggregatesInput | FileActivityScalarWhereWithAggregatesInput[]
    OR?: FileActivityScalarWhereWithAggregatesInput[]
    NOT?: FileActivityScalarWhereWithAggregatesInput | FileActivityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FileActivity"> | string
    action?: EnumFileActionWithAggregatesFilter<"FileActivity"> | $Enums.FileAction
    changes?: JsonNullableWithAggregatesFilter<"FileActivity">
    fileId?: StringWithAggregatesFilter<"FileActivity"> | string
    userId?: StringWithAggregatesFilter<"FileActivity"> | string
    createdAt?: DateTimeWithAggregatesFilter<"FileActivity"> | Date | string
  }

  export type CollaborationSessionWhereInput = {
    AND?: CollaborationSessionWhereInput | CollaborationSessionWhereInput[]
    OR?: CollaborationSessionWhereInput[]
    NOT?: CollaborationSessionWhereInput | CollaborationSessionWhereInput[]
    id?: StringFilter<"CollaborationSession"> | string
    name?: StringFilter<"CollaborationSession"> | string
    isActive?: BoolFilter<"CollaborationSession"> | boolean
    projectId?: StringFilter<"CollaborationSession"> | string
    createdAt?: DateTimeFilter<"CollaborationSession"> | Date | string
    updatedAt?: DateTimeFilter<"CollaborationSession"> | Date | string
    endedAt?: DateTimeNullableFilter<"CollaborationSession"> | Date | string | null
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    participants?: SessionParticipantListRelationFilter
  }

  export type CollaborationSessionOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    endedAt?: SortOrderInput | SortOrder
    project?: ProjectOrderByWithRelationInput
    participants?: SessionParticipantOrderByRelationAggregateInput
  }

  export type CollaborationSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CollaborationSessionWhereInput | CollaborationSessionWhereInput[]
    OR?: CollaborationSessionWhereInput[]
    NOT?: CollaborationSessionWhereInput | CollaborationSessionWhereInput[]
    name?: StringFilter<"CollaborationSession"> | string
    isActive?: BoolFilter<"CollaborationSession"> | boolean
    projectId?: StringFilter<"CollaborationSession"> | string
    createdAt?: DateTimeFilter<"CollaborationSession"> | Date | string
    updatedAt?: DateTimeFilter<"CollaborationSession"> | Date | string
    endedAt?: DateTimeNullableFilter<"CollaborationSession"> | Date | string | null
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    participants?: SessionParticipantListRelationFilter
  }, "id">

  export type CollaborationSessionOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    endedAt?: SortOrderInput | SortOrder
    _count?: CollaborationSessionCountOrderByAggregateInput
    _max?: CollaborationSessionMaxOrderByAggregateInput
    _min?: CollaborationSessionMinOrderByAggregateInput
  }

  export type CollaborationSessionScalarWhereWithAggregatesInput = {
    AND?: CollaborationSessionScalarWhereWithAggregatesInput | CollaborationSessionScalarWhereWithAggregatesInput[]
    OR?: CollaborationSessionScalarWhereWithAggregatesInput[]
    NOT?: CollaborationSessionScalarWhereWithAggregatesInput | CollaborationSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CollaborationSession"> | string
    name?: StringWithAggregatesFilter<"CollaborationSession"> | string
    isActive?: BoolWithAggregatesFilter<"CollaborationSession"> | boolean
    projectId?: StringWithAggregatesFilter<"CollaborationSession"> | string
    createdAt?: DateTimeWithAggregatesFilter<"CollaborationSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CollaborationSession"> | Date | string
    endedAt?: DateTimeNullableWithAggregatesFilter<"CollaborationSession"> | Date | string | null
  }

  export type SessionParticipantWhereInput = {
    AND?: SessionParticipantWhereInput | SessionParticipantWhereInput[]
    OR?: SessionParticipantWhereInput[]
    NOT?: SessionParticipantWhereInput | SessionParticipantWhereInput[]
    id?: StringFilter<"SessionParticipant"> | string
    sessionId?: StringFilter<"SessionParticipant"> | string
    userId?: StringFilter<"SessionParticipant"> | string
    cursor?: JsonNullableFilter<"SessionParticipant">
    isActive?: BoolFilter<"SessionParticipant"> | boolean
    joinedAt?: DateTimeFilter<"SessionParticipant"> | Date | string
    leftAt?: DateTimeNullableFilter<"SessionParticipant"> | Date | string | null
    session?: XOR<CollaborationSessionScalarRelationFilter, CollaborationSessionWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionParticipantOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
    cursor?: SortOrderInput | SortOrder
    isActive?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrderInput | SortOrder
    session?: CollaborationSessionOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type SessionParticipantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionId_userId?: SessionParticipantSessionIdUserIdCompoundUniqueInput
    AND?: SessionParticipantWhereInput | SessionParticipantWhereInput[]
    OR?: SessionParticipantWhereInput[]
    NOT?: SessionParticipantWhereInput | SessionParticipantWhereInput[]
    sessionId?: StringFilter<"SessionParticipant"> | string
    userId?: StringFilter<"SessionParticipant"> | string
    cursor?: JsonNullableFilter<"SessionParticipant">
    isActive?: BoolFilter<"SessionParticipant"> | boolean
    joinedAt?: DateTimeFilter<"SessionParticipant"> | Date | string
    leftAt?: DateTimeNullableFilter<"SessionParticipant"> | Date | string | null
    session?: XOR<CollaborationSessionScalarRelationFilter, CollaborationSessionWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "sessionId_userId">

  export type SessionParticipantOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
    cursor?: SortOrderInput | SortOrder
    isActive?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrderInput | SortOrder
    _count?: SessionParticipantCountOrderByAggregateInput
    _max?: SessionParticipantMaxOrderByAggregateInput
    _min?: SessionParticipantMinOrderByAggregateInput
  }

  export type SessionParticipantScalarWhereWithAggregatesInput = {
    AND?: SessionParticipantScalarWhereWithAggregatesInput | SessionParticipantScalarWhereWithAggregatesInput[]
    OR?: SessionParticipantScalarWhereWithAggregatesInput[]
    NOT?: SessionParticipantScalarWhereWithAggregatesInput | SessionParticipantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SessionParticipant"> | string
    sessionId?: StringWithAggregatesFilter<"SessionParticipant"> | string
    userId?: StringWithAggregatesFilter<"SessionParticipant"> | string
    cursor?: JsonNullableWithAggregatesFilter<"SessionParticipant">
    isActive?: BoolWithAggregatesFilter<"SessionParticipant"> | boolean
    joinedAt?: DateTimeWithAggregatesFilter<"SessionParticipant"> | Date | string
    leftAt?: DateTimeNullableWithAggregatesFilter<"SessionParticipant"> | Date | string | null
  }

  export type AiChatSessionWhereInput = {
    AND?: AiChatSessionWhereInput | AiChatSessionWhereInput[]
    OR?: AiChatSessionWhereInput[]
    NOT?: AiChatSessionWhereInput | AiChatSessionWhereInput[]
    id?: StringFilter<"AiChatSession"> | string
    title?: StringNullableFilter<"AiChatSession"> | string | null
    context?: EnumAiContextFilter<"AiChatSession"> | $Enums.AiContext
    userId?: StringFilter<"AiChatSession"> | string
    projectId?: StringNullableFilter<"AiChatSession"> | string | null
    createdAt?: DateTimeFilter<"AiChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"AiChatSession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    project?: XOR<ProjectNullableScalarRelationFilter, ProjectWhereInput> | null
    messages?: AiMessageListRelationFilter
  }

  export type AiChatSessionOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    context?: SortOrder
    userId?: SortOrder
    projectId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    project?: ProjectOrderByWithRelationInput
    messages?: AiMessageOrderByRelationAggregateInput
  }

  export type AiChatSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiChatSessionWhereInput | AiChatSessionWhereInput[]
    OR?: AiChatSessionWhereInput[]
    NOT?: AiChatSessionWhereInput | AiChatSessionWhereInput[]
    title?: StringNullableFilter<"AiChatSession"> | string | null
    context?: EnumAiContextFilter<"AiChatSession"> | $Enums.AiContext
    userId?: StringFilter<"AiChatSession"> | string
    projectId?: StringNullableFilter<"AiChatSession"> | string | null
    createdAt?: DateTimeFilter<"AiChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"AiChatSession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    project?: XOR<ProjectNullableScalarRelationFilter, ProjectWhereInput> | null
    messages?: AiMessageListRelationFilter
  }, "id">

  export type AiChatSessionOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrderInput | SortOrder
    context?: SortOrder
    userId?: SortOrder
    projectId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AiChatSessionCountOrderByAggregateInput
    _max?: AiChatSessionMaxOrderByAggregateInput
    _min?: AiChatSessionMinOrderByAggregateInput
  }

  export type AiChatSessionScalarWhereWithAggregatesInput = {
    AND?: AiChatSessionScalarWhereWithAggregatesInput | AiChatSessionScalarWhereWithAggregatesInput[]
    OR?: AiChatSessionScalarWhereWithAggregatesInput[]
    NOT?: AiChatSessionScalarWhereWithAggregatesInput | AiChatSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiChatSession"> | string
    title?: StringNullableWithAggregatesFilter<"AiChatSession"> | string | null
    context?: EnumAiContextWithAggregatesFilter<"AiChatSession"> | $Enums.AiContext
    userId?: StringWithAggregatesFilter<"AiChatSession"> | string
    projectId?: StringNullableWithAggregatesFilter<"AiChatSession"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AiChatSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AiChatSession"> | Date | string
  }

  export type AiMessageWhereInput = {
    AND?: AiMessageWhereInput | AiMessageWhereInput[]
    OR?: AiMessageWhereInput[]
    NOT?: AiMessageWhereInput | AiMessageWhereInput[]
    id?: StringFilter<"AiMessage"> | string
    role?: EnumMessageRoleFilter<"AiMessage"> | $Enums.MessageRole
    content?: StringFilter<"AiMessage"> | string
    metadata?: JsonNullableFilter<"AiMessage">
    sessionId?: StringFilter<"AiMessage"> | string
    createdAt?: DateTimeFilter<"AiMessage"> | Date | string
    session?: XOR<AiChatSessionScalarRelationFilter, AiChatSessionWhereInput>
  }

  export type AiMessageOrderByWithRelationInput = {
    id?: SortOrder
    role?: SortOrder
    content?: SortOrder
    metadata?: SortOrderInput | SortOrder
    sessionId?: SortOrder
    createdAt?: SortOrder
    session?: AiChatSessionOrderByWithRelationInput
  }

  export type AiMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiMessageWhereInput | AiMessageWhereInput[]
    OR?: AiMessageWhereInput[]
    NOT?: AiMessageWhereInput | AiMessageWhereInput[]
    role?: EnumMessageRoleFilter<"AiMessage"> | $Enums.MessageRole
    content?: StringFilter<"AiMessage"> | string
    metadata?: JsonNullableFilter<"AiMessage">
    sessionId?: StringFilter<"AiMessage"> | string
    createdAt?: DateTimeFilter<"AiMessage"> | Date | string
    session?: XOR<AiChatSessionScalarRelationFilter, AiChatSessionWhereInput>
  }, "id">

  export type AiMessageOrderByWithAggregationInput = {
    id?: SortOrder
    role?: SortOrder
    content?: SortOrder
    metadata?: SortOrderInput | SortOrder
    sessionId?: SortOrder
    createdAt?: SortOrder
    _count?: AiMessageCountOrderByAggregateInput
    _max?: AiMessageMaxOrderByAggregateInput
    _min?: AiMessageMinOrderByAggregateInput
  }

  export type AiMessageScalarWhereWithAggregatesInput = {
    AND?: AiMessageScalarWhereWithAggregatesInput | AiMessageScalarWhereWithAggregatesInput[]
    OR?: AiMessageScalarWhereWithAggregatesInput[]
    NOT?: AiMessageScalarWhereWithAggregatesInput | AiMessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiMessage"> | string
    role?: EnumMessageRoleWithAggregatesFilter<"AiMessage"> | $Enums.MessageRole
    content?: StringWithAggregatesFilter<"AiMessage"> | string
    metadata?: JsonNullableWithAggregatesFilter<"AiMessage">
    sessionId?: StringWithAggregatesFilter<"AiMessage"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AiMessage"> | Date | string
  }

  export type GitRepositoryWhereInput = {
    AND?: GitRepositoryWhereInput | GitRepositoryWhereInput[]
    OR?: GitRepositoryWhereInput[]
    NOT?: GitRepositoryWhereInput | GitRepositoryWhereInput[]
    id?: StringFilter<"GitRepository"> | string
    url?: StringFilter<"GitRepository"> | string
    branch?: StringFilter<"GitRepository"> | string
    lastSync?: DateTimeNullableFilter<"GitRepository"> | Date | string | null
    syncStatus?: EnumSyncStatusFilter<"GitRepository"> | $Enums.SyncStatus
    projectId?: StringFilter<"GitRepository"> | string
    createdAt?: DateTimeFilter<"GitRepository"> | Date | string
    updatedAt?: DateTimeFilter<"GitRepository"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    commits?: GitCommitListRelationFilter
  }

  export type GitRepositoryOrderByWithRelationInput = {
    id?: SortOrder
    url?: SortOrder
    branch?: SortOrder
    lastSync?: SortOrderInput | SortOrder
    syncStatus?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
    commits?: GitCommitOrderByRelationAggregateInput
  }

  export type GitRepositoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    url?: string
    projectId?: string
    AND?: GitRepositoryWhereInput | GitRepositoryWhereInput[]
    OR?: GitRepositoryWhereInput[]
    NOT?: GitRepositoryWhereInput | GitRepositoryWhereInput[]
    branch?: StringFilter<"GitRepository"> | string
    lastSync?: DateTimeNullableFilter<"GitRepository"> | Date | string | null
    syncStatus?: EnumSyncStatusFilter<"GitRepository"> | $Enums.SyncStatus
    createdAt?: DateTimeFilter<"GitRepository"> | Date | string
    updatedAt?: DateTimeFilter<"GitRepository"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    commits?: GitCommitListRelationFilter
  }, "id" | "url" | "projectId">

  export type GitRepositoryOrderByWithAggregationInput = {
    id?: SortOrder
    url?: SortOrder
    branch?: SortOrder
    lastSync?: SortOrderInput | SortOrder
    syncStatus?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GitRepositoryCountOrderByAggregateInput
    _max?: GitRepositoryMaxOrderByAggregateInput
    _min?: GitRepositoryMinOrderByAggregateInput
  }

  export type GitRepositoryScalarWhereWithAggregatesInput = {
    AND?: GitRepositoryScalarWhereWithAggregatesInput | GitRepositoryScalarWhereWithAggregatesInput[]
    OR?: GitRepositoryScalarWhereWithAggregatesInput[]
    NOT?: GitRepositoryScalarWhereWithAggregatesInput | GitRepositoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GitRepository"> | string
    url?: StringWithAggregatesFilter<"GitRepository"> | string
    branch?: StringWithAggregatesFilter<"GitRepository"> | string
    lastSync?: DateTimeNullableWithAggregatesFilter<"GitRepository"> | Date | string | null
    syncStatus?: EnumSyncStatusWithAggregatesFilter<"GitRepository"> | $Enums.SyncStatus
    projectId?: StringWithAggregatesFilter<"GitRepository"> | string
    createdAt?: DateTimeWithAggregatesFilter<"GitRepository"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"GitRepository"> | Date | string
  }

  export type GitCommitWhereInput = {
    AND?: GitCommitWhereInput | GitCommitWhereInput[]
    OR?: GitCommitWhereInput[]
    NOT?: GitCommitWhereInput | GitCommitWhereInput[]
    id?: StringFilter<"GitCommit"> | string
    hash?: StringFilter<"GitCommit"> | string
    message?: StringFilter<"GitCommit"> | string
    author?: StringFilter<"GitCommit"> | string
    authorEmail?: StringFilter<"GitCommit"> | string
    repoId?: StringFilter<"GitCommit"> | string
    committedAt?: DateTimeFilter<"GitCommit"> | Date | string
    createdAt?: DateTimeFilter<"GitCommit"> | Date | string
    repository?: XOR<GitRepositoryScalarRelationFilter, GitRepositoryWhereInput>
  }

  export type GitCommitOrderByWithRelationInput = {
    id?: SortOrder
    hash?: SortOrder
    message?: SortOrder
    author?: SortOrder
    authorEmail?: SortOrder
    repoId?: SortOrder
    committedAt?: SortOrder
    createdAt?: SortOrder
    repository?: GitRepositoryOrderByWithRelationInput
  }

  export type GitCommitWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    hash?: string
    AND?: GitCommitWhereInput | GitCommitWhereInput[]
    OR?: GitCommitWhereInput[]
    NOT?: GitCommitWhereInput | GitCommitWhereInput[]
    message?: StringFilter<"GitCommit"> | string
    author?: StringFilter<"GitCommit"> | string
    authorEmail?: StringFilter<"GitCommit"> | string
    repoId?: StringFilter<"GitCommit"> | string
    committedAt?: DateTimeFilter<"GitCommit"> | Date | string
    createdAt?: DateTimeFilter<"GitCommit"> | Date | string
    repository?: XOR<GitRepositoryScalarRelationFilter, GitRepositoryWhereInput>
  }, "id" | "hash">

  export type GitCommitOrderByWithAggregationInput = {
    id?: SortOrder
    hash?: SortOrder
    message?: SortOrder
    author?: SortOrder
    authorEmail?: SortOrder
    repoId?: SortOrder
    committedAt?: SortOrder
    createdAt?: SortOrder
    _count?: GitCommitCountOrderByAggregateInput
    _max?: GitCommitMaxOrderByAggregateInput
    _min?: GitCommitMinOrderByAggregateInput
  }

  export type GitCommitScalarWhereWithAggregatesInput = {
    AND?: GitCommitScalarWhereWithAggregatesInput | GitCommitScalarWhereWithAggregatesInput[]
    OR?: GitCommitScalarWhereWithAggregatesInput[]
    NOT?: GitCommitScalarWhereWithAggregatesInput | GitCommitScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GitCommit"> | string
    hash?: StringWithAggregatesFilter<"GitCommit"> | string
    message?: StringWithAggregatesFilter<"GitCommit"> | string
    author?: StringWithAggregatesFilter<"GitCommit"> | string
    authorEmail?: StringWithAggregatesFilter<"GitCommit"> | string
    repoId?: StringWithAggregatesFilter<"GitCommit"> | string
    committedAt?: DateTimeWithAggregatesFilter<"GitCommit"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"GitCommit"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    username: string
    name?: string | null
    avatar?: string | null
    githubId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    image?: string | null
    emailVerified?: Date | string | null
    ownedProjects?: ProjectCreateNestedManyWithoutOwnerInput
    memberships?: ProjectMemberCreateNestedManyWithoutUserInput
    aiSessions?: AiChatSessionCreateNestedManyWithoutUserInput
    fileActivities?: FileActivityCreateNestedManyWithoutUserInput
    sessionParticipations?: SessionParticipantCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    username: string
    name?: string | null
    avatar?: string | null
    githubId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    image?: string | null
    emailVerified?: Date | string | null
    ownedProjects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    memberships?: ProjectMemberUncheckedCreateNestedManyWithoutUserInput
    aiSessions?: AiChatSessionUncheckedCreateNestedManyWithoutUserInput
    fileActivities?: FileActivityUncheckedCreateNestedManyWithoutUserInput
    sessionParticipations?: SessionParticipantUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownedProjects?: ProjectUpdateManyWithoutOwnerNestedInput
    memberships?: ProjectMemberUpdateManyWithoutUserNestedInput
    aiSessions?: AiChatSessionUpdateManyWithoutUserNestedInput
    fileActivities?: FileActivityUpdateManyWithoutUserNestedInput
    sessionParticipations?: SessionParticipantUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownedProjects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    memberships?: ProjectMemberUncheckedUpdateManyWithoutUserNestedInput
    aiSessions?: AiChatSessionUncheckedUpdateManyWithoutUserNestedInput
    fileActivities?: FileActivityUncheckedUpdateManyWithoutUserNestedInput
    sessionParticipations?: SessionParticipantUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    username: string
    name?: string | null
    avatar?: string | null
    githubId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    image?: string | null
    emailVerified?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AccountCreateInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountCreateManyInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionCreateInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUncheckedCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateManyInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateManyMutationInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateManyInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateInput = {
    id?: string
    name: string
    description?: string | null
    visibility?: $Enums.ProjectVisibility
    repositoryUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutOwnedProjectsInput
    files?: ProjectFileCreateNestedManyWithoutProjectInput
    members?: ProjectMemberCreateNestedManyWithoutProjectInput
    sessions?: CollaborationSessionCreateNestedManyWithoutProjectInput
    aiSessions?: AiChatSessionCreateNestedManyWithoutProjectInput
    gitRepository?: GitRepositoryCreateNestedOneWithoutProjectInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    visibility?: $Enums.ProjectVisibility
    repositoryUrl?: string | null
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
    members?: ProjectMemberUncheckedCreateNestedManyWithoutProjectInput
    sessions?: CollaborationSessionUncheckedCreateNestedManyWithoutProjectInput
    aiSessions?: AiChatSessionUncheckedCreateNestedManyWithoutProjectInput
    gitRepository?: GitRepositoryUncheckedCreateNestedOneWithoutProjectInput
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: EnumProjectVisibilityFieldUpdateOperationsInput | $Enums.ProjectVisibility
    repositoryUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutOwnedProjectsNestedInput
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
    members?: ProjectMemberUpdateManyWithoutProjectNestedInput
    sessions?: CollaborationSessionUpdateManyWithoutProjectNestedInput
    aiSessions?: AiChatSessionUpdateManyWithoutProjectNestedInput
    gitRepository?: GitRepositoryUpdateOneWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: EnumProjectVisibilityFieldUpdateOperationsInput | $Enums.ProjectVisibility
    repositoryUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
    members?: ProjectMemberUncheckedUpdateManyWithoutProjectNestedInput
    sessions?: CollaborationSessionUncheckedUpdateManyWithoutProjectNestedInput
    aiSessions?: AiChatSessionUncheckedUpdateManyWithoutProjectNestedInput
    gitRepository?: GitRepositoryUncheckedUpdateOneWithoutProjectNestedInput
  }

  export type ProjectCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    visibility?: $Enums.ProjectVisibility
    repositoryUrl?: string | null
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: EnumProjectVisibilityFieldUpdateOperationsInput | $Enums.ProjectVisibility
    repositoryUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: EnumProjectVisibilityFieldUpdateOperationsInput | $Enums.ProjectVisibility
    repositoryUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectMemberCreateInput = {
    id?: string
    role?: $Enums.ProjectRole
    joinedAt?: Date | string
    user: UserCreateNestedOneWithoutMembershipsInput
    project: ProjectCreateNestedOneWithoutMembersInput
  }

  export type ProjectMemberUncheckedCreateInput = {
    id?: string
    role?: $Enums.ProjectRole
    userId: string
    projectId: string
    joinedAt?: Date | string
  }

  export type ProjectMemberUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumProjectRoleFieldUpdateOperationsInput | $Enums.ProjectRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMembershipsNestedInput
    project?: ProjectUpdateOneRequiredWithoutMembersNestedInput
  }

  export type ProjectMemberUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumProjectRoleFieldUpdateOperationsInput | $Enums.ProjectRole
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectMemberCreateManyInput = {
    id?: string
    role?: $Enums.ProjectRole
    userId: string
    projectId: string
    joinedAt?: Date | string
  }

  export type ProjectMemberUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumProjectRoleFieldUpdateOperationsInput | $Enums.ProjectRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectMemberUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumProjectRoleFieldUpdateOperationsInput | $Enums.ProjectRole
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFileCreateInput = {
    id?: string
    path: string
    name: string
    type?: $Enums.FileType
    content?: string | null
    size?: number
    mimeType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutFilesInput
    activities?: FileActivityCreateNestedManyWithoutFileInput
  }

  export type ProjectFileUncheckedCreateInput = {
    id?: string
    path: string
    name: string
    type?: $Enums.FileType
    content?: string | null
    size?: number
    mimeType?: string | null
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    activities?: FileActivityUncheckedCreateNestedManyWithoutFileInput
  }

  export type ProjectFileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumFileTypeFieldUpdateOperationsInput | $Enums.FileType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutFilesNestedInput
    activities?: FileActivityUpdateManyWithoutFileNestedInput
  }

  export type ProjectFileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumFileTypeFieldUpdateOperationsInput | $Enums.FileType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activities?: FileActivityUncheckedUpdateManyWithoutFileNestedInput
  }

  export type ProjectFileCreateManyInput = {
    id?: string
    path: string
    name: string
    type?: $Enums.FileType
    content?: string | null
    size?: number
    mimeType?: string | null
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectFileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumFileTypeFieldUpdateOperationsInput | $Enums.FileType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumFileTypeFieldUpdateOperationsInput | $Enums.FileType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileActivityCreateInput = {
    id?: string
    action: $Enums.FileAction
    changes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    file: ProjectFileCreateNestedOneWithoutActivitiesInput
    user: UserCreateNestedOneWithoutFileActivitiesInput
  }

  export type FileActivityUncheckedCreateInput = {
    id?: string
    action: $Enums.FileAction
    changes?: NullableJsonNullValueInput | InputJsonValue
    fileId: string
    userId: string
    createdAt?: Date | string
  }

  export type FileActivityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumFileActionFieldUpdateOperationsInput | $Enums.FileAction
    changes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    file?: ProjectFileUpdateOneRequiredWithoutActivitiesNestedInput
    user?: UserUpdateOneRequiredWithoutFileActivitiesNestedInput
  }

  export type FileActivityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumFileActionFieldUpdateOperationsInput | $Enums.FileAction
    changes?: NullableJsonNullValueInput | InputJsonValue
    fileId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileActivityCreateManyInput = {
    id?: string
    action: $Enums.FileAction
    changes?: NullableJsonNullValueInput | InputJsonValue
    fileId: string
    userId: string
    createdAt?: Date | string
  }

  export type FileActivityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumFileActionFieldUpdateOperationsInput | $Enums.FileAction
    changes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileActivityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumFileActionFieldUpdateOperationsInput | $Enums.FileAction
    changes?: NullableJsonNullValueInput | InputJsonValue
    fileId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollaborationSessionCreateInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    endedAt?: Date | string | null
    project: ProjectCreateNestedOneWithoutSessionsInput
    participants?: SessionParticipantCreateNestedManyWithoutSessionInput
  }

  export type CollaborationSessionUncheckedCreateInput = {
    id?: string
    name: string
    isActive?: boolean
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    endedAt?: Date | string | null
    participants?: SessionParticipantUncheckedCreateNestedManyWithoutSessionInput
  }

  export type CollaborationSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    project?: ProjectUpdateOneRequiredWithoutSessionsNestedInput
    participants?: SessionParticipantUpdateManyWithoutSessionNestedInput
  }

  export type CollaborationSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    participants?: SessionParticipantUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type CollaborationSessionCreateManyInput = {
    id?: string
    name: string
    isActive?: boolean
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    endedAt?: Date | string | null
  }

  export type CollaborationSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CollaborationSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SessionParticipantCreateInput = {
    id?: string
    cursor?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    joinedAt?: Date | string
    leftAt?: Date | string | null
    session: CollaborationSessionCreateNestedOneWithoutParticipantsInput
    user: UserCreateNestedOneWithoutSessionParticipationsInput
  }

  export type SessionParticipantUncheckedCreateInput = {
    id?: string
    sessionId: string
    userId: string
    cursor?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    joinedAt?: Date | string
    leftAt?: Date | string | null
  }

  export type SessionParticipantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cursor?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    session?: CollaborationSessionUpdateOneRequiredWithoutParticipantsNestedInput
    user?: UserUpdateOneRequiredWithoutSessionParticipationsNestedInput
  }

  export type SessionParticipantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    cursor?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SessionParticipantCreateManyInput = {
    id?: string
    sessionId: string
    userId: string
    cursor?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    joinedAt?: Date | string
    leftAt?: Date | string | null
  }

  export type SessionParticipantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cursor?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SessionParticipantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    cursor?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AiChatSessionCreateInput = {
    id?: string
    title?: string | null
    context?: $Enums.AiContext
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAiSessionsInput
    project?: ProjectCreateNestedOneWithoutAiSessionsInput
    messages?: AiMessageCreateNestedManyWithoutSessionInput
  }

  export type AiChatSessionUncheckedCreateInput = {
    id?: string
    title?: string | null
    context?: $Enums.AiContext
    userId: string
    projectId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: AiMessageUncheckedCreateNestedManyWithoutSessionInput
  }

  export type AiChatSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    context?: EnumAiContextFieldUpdateOperationsInput | $Enums.AiContext
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAiSessionsNestedInput
    project?: ProjectUpdateOneWithoutAiSessionsNestedInput
    messages?: AiMessageUpdateManyWithoutSessionNestedInput
  }

  export type AiChatSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    context?: EnumAiContextFieldUpdateOperationsInput | $Enums.AiContext
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: AiMessageUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type AiChatSessionCreateManyInput = {
    id?: string
    title?: string | null
    context?: $Enums.AiContext
    userId: string
    projectId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiChatSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    context?: EnumAiContextFieldUpdateOperationsInput | $Enums.AiContext
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiChatSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    context?: EnumAiContextFieldUpdateOperationsInput | $Enums.AiContext
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiMessageCreateInput = {
    id?: string
    role: $Enums.MessageRole
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    session: AiChatSessionCreateNestedOneWithoutMessagesInput
  }

  export type AiMessageUncheckedCreateInput = {
    id?: string
    role: $Enums.MessageRole
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    sessionId: string
    createdAt?: Date | string
  }

  export type AiMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: AiChatSessionUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type AiMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    sessionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiMessageCreateManyInput = {
    id?: string
    role: $Enums.MessageRole
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    sessionId: string
    createdAt?: Date | string
  }

  export type AiMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    sessionId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GitRepositoryCreateInput = {
    id?: string
    url: string
    branch?: string
    lastSync?: Date | string | null
    syncStatus?: $Enums.SyncStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutGitRepositoryInput
    commits?: GitCommitCreateNestedManyWithoutRepositoryInput
  }

  export type GitRepositoryUncheckedCreateInput = {
    id?: string
    url: string
    branch?: string
    lastSync?: Date | string | null
    syncStatus?: $Enums.SyncStatus
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commits?: GitCommitUncheckedCreateNestedManyWithoutRepositoryInput
  }

  export type GitRepositoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    branch?: StringFieldUpdateOperationsInput | string
    lastSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncStatus?: EnumSyncStatusFieldUpdateOperationsInput | $Enums.SyncStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutGitRepositoryNestedInput
    commits?: GitCommitUpdateManyWithoutRepositoryNestedInput
  }

  export type GitRepositoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    branch?: StringFieldUpdateOperationsInput | string
    lastSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncStatus?: EnumSyncStatusFieldUpdateOperationsInput | $Enums.SyncStatus
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commits?: GitCommitUncheckedUpdateManyWithoutRepositoryNestedInput
  }

  export type GitRepositoryCreateManyInput = {
    id?: string
    url: string
    branch?: string
    lastSync?: Date | string | null
    syncStatus?: $Enums.SyncStatus
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GitRepositoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    branch?: StringFieldUpdateOperationsInput | string
    lastSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncStatus?: EnumSyncStatusFieldUpdateOperationsInput | $Enums.SyncStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GitRepositoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    branch?: StringFieldUpdateOperationsInput | string
    lastSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncStatus?: EnumSyncStatusFieldUpdateOperationsInput | $Enums.SyncStatus
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GitCommitCreateInput = {
    id?: string
    hash: string
    message: string
    author: string
    authorEmail: string
    committedAt: Date | string
    createdAt?: Date | string
    repository: GitRepositoryCreateNestedOneWithoutCommitsInput
  }

  export type GitCommitUncheckedCreateInput = {
    id?: string
    hash: string
    message: string
    author: string
    authorEmail: string
    repoId: string
    committedAt: Date | string
    createdAt?: Date | string
  }

  export type GitCommitUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    authorEmail?: StringFieldUpdateOperationsInput | string
    committedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repository?: GitRepositoryUpdateOneRequiredWithoutCommitsNestedInput
  }

  export type GitCommitUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    authorEmail?: StringFieldUpdateOperationsInput | string
    repoId?: StringFieldUpdateOperationsInput | string
    committedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GitCommitCreateManyInput = {
    id?: string
    hash: string
    message: string
    author: string
    authorEmail: string
    repoId: string
    committedAt: Date | string
    createdAt?: Date | string
  }

  export type GitCommitUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    authorEmail?: StringFieldUpdateOperationsInput | string
    committedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GitCommitUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    authorEmail?: StringFieldUpdateOperationsInput | string
    repoId?: StringFieldUpdateOperationsInput | string
    committedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ProjectListRelationFilter = {
    every?: ProjectWhereInput
    some?: ProjectWhereInput
    none?: ProjectWhereInput
  }

  export type ProjectMemberListRelationFilter = {
    every?: ProjectMemberWhereInput
    some?: ProjectMemberWhereInput
    none?: ProjectMemberWhereInput
  }

  export type AiChatSessionListRelationFilter = {
    every?: AiChatSessionWhereInput
    some?: AiChatSessionWhereInput
    none?: AiChatSessionWhereInput
  }

  export type FileActivityListRelationFilter = {
    every?: FileActivityWhereInput
    some?: FileActivityWhereInput
    none?: FileActivityWhereInput
  }

  export type SessionParticipantListRelationFilter = {
    every?: SessionParticipantWhereInput
    some?: SessionParticipantWhereInput
    none?: SessionParticipantWhereInput
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProjectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectMemberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AiChatSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FileActivityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionParticipantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    name?: SortOrder
    avatar?: SortOrder
    githubId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    image?: SortOrder
    emailVerified?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    name?: SortOrder
    avatar?: SortOrder
    githubId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    image?: SortOrder
    emailVerified?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    name?: SortOrder
    avatar?: SortOrder
    githubId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    image?: SortOrder
    emailVerified?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type AccountProviderProviderAccountIdCompoundUniqueInput = {
    provider: string
    providerAccountId: string
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountAvgOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountSumOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenIdentifierTokenCompoundUniqueInput = {
    identifier: string
    token: string
  }

  export type VerificationTokenCountOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMaxOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMinOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type EnumProjectVisibilityFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectVisibility | EnumProjectVisibilityFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectVisibility[] | ListEnumProjectVisibilityFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectVisibility[] | ListEnumProjectVisibilityFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectVisibilityFilter<$PrismaModel> | $Enums.ProjectVisibility
  }

  export type ProjectFileListRelationFilter = {
    every?: ProjectFileWhereInput
    some?: ProjectFileWhereInput
    none?: ProjectFileWhereInput
  }

  export type CollaborationSessionListRelationFilter = {
    every?: CollaborationSessionWhereInput
    some?: CollaborationSessionWhereInput
    none?: CollaborationSessionWhereInput
  }

  export type GitRepositoryNullableScalarRelationFilter = {
    is?: GitRepositoryWhereInput | null
    isNot?: GitRepositoryWhereInput | null
  }

  export type ProjectFileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CollaborationSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    visibility?: SortOrder
    repositoryUrl?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    visibility?: SortOrder
    repositoryUrl?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    visibility?: SortOrder
    repositoryUrl?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumProjectVisibilityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectVisibility | EnumProjectVisibilityFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectVisibility[] | ListEnumProjectVisibilityFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectVisibility[] | ListEnumProjectVisibilityFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectVisibilityWithAggregatesFilter<$PrismaModel> | $Enums.ProjectVisibility
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectVisibilityFilter<$PrismaModel>
    _max?: NestedEnumProjectVisibilityFilter<$PrismaModel>
  }

  export type EnumProjectRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectRole | EnumProjectRoleFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectRole[] | ListEnumProjectRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectRole[] | ListEnumProjectRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectRoleFilter<$PrismaModel> | $Enums.ProjectRole
  }

  export type ProjectScalarRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type ProjectMemberUserIdProjectIdCompoundUniqueInput = {
    userId: string
    projectId: string
  }

  export type ProjectMemberCountOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    joinedAt?: SortOrder
  }

  export type ProjectMemberMaxOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    joinedAt?: SortOrder
  }

  export type ProjectMemberMinOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    joinedAt?: SortOrder
  }

  export type EnumProjectRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectRole | EnumProjectRoleFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectRole[] | ListEnumProjectRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectRole[] | ListEnumProjectRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectRoleWithAggregatesFilter<$PrismaModel> | $Enums.ProjectRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectRoleFilter<$PrismaModel>
    _max?: NestedEnumProjectRoleFilter<$PrismaModel>
  }

  export type EnumFileTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.FileType | EnumFileTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FileType[] | ListEnumFileTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FileType[] | ListEnumFileTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFileTypeFilter<$PrismaModel> | $Enums.FileType
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type ProjectFileProjectIdPathCompoundUniqueInput = {
    projectId: string
    path: string
  }

  export type ProjectFileCountOrderByAggregateInput = {
    id?: SortOrder
    path?: SortOrder
    name?: SortOrder
    type?: SortOrder
    content?: SortOrder
    size?: SortOrder
    mimeType?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectFileAvgOrderByAggregateInput = {
    size?: SortOrder
  }

  export type ProjectFileMaxOrderByAggregateInput = {
    id?: SortOrder
    path?: SortOrder
    name?: SortOrder
    type?: SortOrder
    content?: SortOrder
    size?: SortOrder
    mimeType?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectFileMinOrderByAggregateInput = {
    id?: SortOrder
    path?: SortOrder
    name?: SortOrder
    type?: SortOrder
    content?: SortOrder
    size?: SortOrder
    mimeType?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectFileSumOrderByAggregateInput = {
    size?: SortOrder
  }

  export type EnumFileTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FileType | EnumFileTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FileType[] | ListEnumFileTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FileType[] | ListEnumFileTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFileTypeWithAggregatesFilter<$PrismaModel> | $Enums.FileType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFileTypeFilter<$PrismaModel>
    _max?: NestedEnumFileTypeFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumFileActionFilter<$PrismaModel = never> = {
    equals?: $Enums.FileAction | EnumFileActionFieldRefInput<$PrismaModel>
    in?: $Enums.FileAction[] | ListEnumFileActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.FileAction[] | ListEnumFileActionFieldRefInput<$PrismaModel>
    not?: NestedEnumFileActionFilter<$PrismaModel> | $Enums.FileAction
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ProjectFileScalarRelationFilter = {
    is?: ProjectFileWhereInput
    isNot?: ProjectFileWhereInput
  }

  export type FileActivityCountOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    changes?: SortOrder
    fileId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type FileActivityMaxOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    fileId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type FileActivityMinOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    fileId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumFileActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FileAction | EnumFileActionFieldRefInput<$PrismaModel>
    in?: $Enums.FileAction[] | ListEnumFileActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.FileAction[] | ListEnumFileActionFieldRefInput<$PrismaModel>
    not?: NestedEnumFileActionWithAggregatesFilter<$PrismaModel> | $Enums.FileAction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFileActionFilter<$PrismaModel>
    _max?: NestedEnumFileActionFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type CollaborationSessionCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    endedAt?: SortOrder
  }

  export type CollaborationSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    endedAt?: SortOrder
  }

  export type CollaborationSessionMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    endedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type CollaborationSessionScalarRelationFilter = {
    is?: CollaborationSessionWhereInput
    isNot?: CollaborationSessionWhereInput
  }

  export type SessionParticipantSessionIdUserIdCompoundUniqueInput = {
    sessionId: string
    userId: string
  }

  export type SessionParticipantCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
    cursor?: SortOrder
    isActive?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrder
  }

  export type SessionParticipantMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
    isActive?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrder
  }

  export type SessionParticipantMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userId?: SortOrder
    isActive?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrder
  }

  export type EnumAiContextFilter<$PrismaModel = never> = {
    equals?: $Enums.AiContext | EnumAiContextFieldRefInput<$PrismaModel>
    in?: $Enums.AiContext[] | ListEnumAiContextFieldRefInput<$PrismaModel>
    notIn?: $Enums.AiContext[] | ListEnumAiContextFieldRefInput<$PrismaModel>
    not?: NestedEnumAiContextFilter<$PrismaModel> | $Enums.AiContext
  }

  export type ProjectNullableScalarRelationFilter = {
    is?: ProjectWhereInput | null
    isNot?: ProjectWhereInput | null
  }

  export type AiMessageListRelationFilter = {
    every?: AiMessageWhereInput
    some?: AiMessageWhereInput
    none?: AiMessageWhereInput
  }

  export type AiMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AiChatSessionCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    context?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiChatSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    context?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiChatSessionMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    context?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumAiContextWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AiContext | EnumAiContextFieldRefInput<$PrismaModel>
    in?: $Enums.AiContext[] | ListEnumAiContextFieldRefInput<$PrismaModel>
    notIn?: $Enums.AiContext[] | ListEnumAiContextFieldRefInput<$PrismaModel>
    not?: NestedEnumAiContextWithAggregatesFilter<$PrismaModel> | $Enums.AiContext
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAiContextFilter<$PrismaModel>
    _max?: NestedEnumAiContextFilter<$PrismaModel>
  }

  export type EnumMessageRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageRoleFilter<$PrismaModel> | $Enums.MessageRole
  }

  export type AiChatSessionScalarRelationFilter = {
    is?: AiChatSessionWhereInput
    isNot?: AiChatSessionWhereInput
  }

  export type AiMessageCountOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    content?: SortOrder
    metadata?: SortOrder
    sessionId?: SortOrder
    createdAt?: SortOrder
  }

  export type AiMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    content?: SortOrder
    sessionId?: SortOrder
    createdAt?: SortOrder
  }

  export type AiMessageMinOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    content?: SortOrder
    sessionId?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumMessageRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageRoleWithAggregatesFilter<$PrismaModel> | $Enums.MessageRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageRoleFilter<$PrismaModel>
    _max?: NestedEnumMessageRoleFilter<$PrismaModel>
  }

  export type EnumSyncStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SyncStatus | EnumSyncStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SyncStatus[] | ListEnumSyncStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SyncStatus[] | ListEnumSyncStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSyncStatusFilter<$PrismaModel> | $Enums.SyncStatus
  }

  export type GitCommitListRelationFilter = {
    every?: GitCommitWhereInput
    some?: GitCommitWhereInput
    none?: GitCommitWhereInput
  }

  export type GitCommitOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GitRepositoryCountOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    branch?: SortOrder
    lastSync?: SortOrder
    syncStatus?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GitRepositoryMaxOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    branch?: SortOrder
    lastSync?: SortOrder
    syncStatus?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GitRepositoryMinOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    branch?: SortOrder
    lastSync?: SortOrder
    syncStatus?: SortOrder
    projectId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumSyncStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SyncStatus | EnumSyncStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SyncStatus[] | ListEnumSyncStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SyncStatus[] | ListEnumSyncStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSyncStatusWithAggregatesFilter<$PrismaModel> | $Enums.SyncStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSyncStatusFilter<$PrismaModel>
    _max?: NestedEnumSyncStatusFilter<$PrismaModel>
  }

  export type GitRepositoryScalarRelationFilter = {
    is?: GitRepositoryWhereInput
    isNot?: GitRepositoryWhereInput
  }

  export type GitCommitCountOrderByAggregateInput = {
    id?: SortOrder
    hash?: SortOrder
    message?: SortOrder
    author?: SortOrder
    authorEmail?: SortOrder
    repoId?: SortOrder
    committedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type GitCommitMaxOrderByAggregateInput = {
    id?: SortOrder
    hash?: SortOrder
    message?: SortOrder
    author?: SortOrder
    authorEmail?: SortOrder
    repoId?: SortOrder
    committedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type GitCommitMinOrderByAggregateInput = {
    id?: SortOrder
    hash?: SortOrder
    message?: SortOrder
    author?: SortOrder
    authorEmail?: SortOrder
    repoId?: SortOrder
    committedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectCreateNestedManyWithoutOwnerInput = {
    create?: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput> | ProjectCreateWithoutOwnerInput[] | ProjectUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutOwnerInput | ProjectCreateOrConnectWithoutOwnerInput[]
    createMany?: ProjectCreateManyOwnerInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type ProjectMemberCreateNestedManyWithoutUserInput = {
    create?: XOR<ProjectMemberCreateWithoutUserInput, ProjectMemberUncheckedCreateWithoutUserInput> | ProjectMemberCreateWithoutUserInput[] | ProjectMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectMemberCreateOrConnectWithoutUserInput | ProjectMemberCreateOrConnectWithoutUserInput[]
    createMany?: ProjectMemberCreateManyUserInputEnvelope
    connect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
  }

  export type AiChatSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<AiChatSessionCreateWithoutUserInput, AiChatSessionUncheckedCreateWithoutUserInput> | AiChatSessionCreateWithoutUserInput[] | AiChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AiChatSessionCreateOrConnectWithoutUserInput | AiChatSessionCreateOrConnectWithoutUserInput[]
    createMany?: AiChatSessionCreateManyUserInputEnvelope
    connect?: AiChatSessionWhereUniqueInput | AiChatSessionWhereUniqueInput[]
  }

  export type FileActivityCreateNestedManyWithoutUserInput = {
    create?: XOR<FileActivityCreateWithoutUserInput, FileActivityUncheckedCreateWithoutUserInput> | FileActivityCreateWithoutUserInput[] | FileActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FileActivityCreateOrConnectWithoutUserInput | FileActivityCreateOrConnectWithoutUserInput[]
    createMany?: FileActivityCreateManyUserInputEnvelope
    connect?: FileActivityWhereUniqueInput | FileActivityWhereUniqueInput[]
  }

  export type SessionParticipantCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionParticipantCreateWithoutUserInput, SessionParticipantUncheckedCreateWithoutUserInput> | SessionParticipantCreateWithoutUserInput[] | SessionParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionParticipantCreateOrConnectWithoutUserInput | SessionParticipantCreateOrConnectWithoutUserInput[]
    createMany?: SessionParticipantCreateManyUserInputEnvelope
    connect?: SessionParticipantWhereUniqueInput | SessionParticipantWhereUniqueInput[]
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput> | ProjectCreateWithoutOwnerInput[] | ProjectUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutOwnerInput | ProjectCreateOrConnectWithoutOwnerInput[]
    createMany?: ProjectCreateManyOwnerInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type ProjectMemberUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ProjectMemberCreateWithoutUserInput, ProjectMemberUncheckedCreateWithoutUserInput> | ProjectMemberCreateWithoutUserInput[] | ProjectMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectMemberCreateOrConnectWithoutUserInput | ProjectMemberCreateOrConnectWithoutUserInput[]
    createMany?: ProjectMemberCreateManyUserInputEnvelope
    connect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
  }

  export type AiChatSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AiChatSessionCreateWithoutUserInput, AiChatSessionUncheckedCreateWithoutUserInput> | AiChatSessionCreateWithoutUserInput[] | AiChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AiChatSessionCreateOrConnectWithoutUserInput | AiChatSessionCreateOrConnectWithoutUserInput[]
    createMany?: AiChatSessionCreateManyUserInputEnvelope
    connect?: AiChatSessionWhereUniqueInput | AiChatSessionWhereUniqueInput[]
  }

  export type FileActivityUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<FileActivityCreateWithoutUserInput, FileActivityUncheckedCreateWithoutUserInput> | FileActivityCreateWithoutUserInput[] | FileActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FileActivityCreateOrConnectWithoutUserInput | FileActivityCreateOrConnectWithoutUserInput[]
    createMany?: FileActivityCreateManyUserInputEnvelope
    connect?: FileActivityWhereUniqueInput | FileActivityWhereUniqueInput[]
  }

  export type SessionParticipantUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionParticipantCreateWithoutUserInput, SessionParticipantUncheckedCreateWithoutUserInput> | SessionParticipantCreateWithoutUserInput[] | SessionParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionParticipantCreateOrConnectWithoutUserInput | SessionParticipantCreateOrConnectWithoutUserInput[]
    createMany?: SessionParticipantCreateManyUserInputEnvelope
    connect?: SessionParticipantWhereUniqueInput | SessionParticipantWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ProjectUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput> | ProjectCreateWithoutOwnerInput[] | ProjectUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutOwnerInput | ProjectCreateOrConnectWithoutOwnerInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutOwnerInput | ProjectUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: ProjectCreateManyOwnerInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutOwnerInput | ProjectUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutOwnerInput | ProjectUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type ProjectMemberUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProjectMemberCreateWithoutUserInput, ProjectMemberUncheckedCreateWithoutUserInput> | ProjectMemberCreateWithoutUserInput[] | ProjectMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectMemberCreateOrConnectWithoutUserInput | ProjectMemberCreateOrConnectWithoutUserInput[]
    upsert?: ProjectMemberUpsertWithWhereUniqueWithoutUserInput | ProjectMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProjectMemberCreateManyUserInputEnvelope
    set?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    disconnect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    delete?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    connect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    update?: ProjectMemberUpdateWithWhereUniqueWithoutUserInput | ProjectMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProjectMemberUpdateManyWithWhereWithoutUserInput | ProjectMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProjectMemberScalarWhereInput | ProjectMemberScalarWhereInput[]
  }

  export type AiChatSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<AiChatSessionCreateWithoutUserInput, AiChatSessionUncheckedCreateWithoutUserInput> | AiChatSessionCreateWithoutUserInput[] | AiChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AiChatSessionCreateOrConnectWithoutUserInput | AiChatSessionCreateOrConnectWithoutUserInput[]
    upsert?: AiChatSessionUpsertWithWhereUniqueWithoutUserInput | AiChatSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AiChatSessionCreateManyUserInputEnvelope
    set?: AiChatSessionWhereUniqueInput | AiChatSessionWhereUniqueInput[]
    disconnect?: AiChatSessionWhereUniqueInput | AiChatSessionWhereUniqueInput[]
    delete?: AiChatSessionWhereUniqueInput | AiChatSessionWhereUniqueInput[]
    connect?: AiChatSessionWhereUniqueInput | AiChatSessionWhereUniqueInput[]
    update?: AiChatSessionUpdateWithWhereUniqueWithoutUserInput | AiChatSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AiChatSessionUpdateManyWithWhereWithoutUserInput | AiChatSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AiChatSessionScalarWhereInput | AiChatSessionScalarWhereInput[]
  }

  export type FileActivityUpdateManyWithoutUserNestedInput = {
    create?: XOR<FileActivityCreateWithoutUserInput, FileActivityUncheckedCreateWithoutUserInput> | FileActivityCreateWithoutUserInput[] | FileActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FileActivityCreateOrConnectWithoutUserInput | FileActivityCreateOrConnectWithoutUserInput[]
    upsert?: FileActivityUpsertWithWhereUniqueWithoutUserInput | FileActivityUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FileActivityCreateManyUserInputEnvelope
    set?: FileActivityWhereUniqueInput | FileActivityWhereUniqueInput[]
    disconnect?: FileActivityWhereUniqueInput | FileActivityWhereUniqueInput[]
    delete?: FileActivityWhereUniqueInput | FileActivityWhereUniqueInput[]
    connect?: FileActivityWhereUniqueInput | FileActivityWhereUniqueInput[]
    update?: FileActivityUpdateWithWhereUniqueWithoutUserInput | FileActivityUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FileActivityUpdateManyWithWhereWithoutUserInput | FileActivityUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FileActivityScalarWhereInput | FileActivityScalarWhereInput[]
  }

  export type SessionParticipantUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionParticipantCreateWithoutUserInput, SessionParticipantUncheckedCreateWithoutUserInput> | SessionParticipantCreateWithoutUserInput[] | SessionParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionParticipantCreateOrConnectWithoutUserInput | SessionParticipantCreateOrConnectWithoutUserInput[]
    upsert?: SessionParticipantUpsertWithWhereUniqueWithoutUserInput | SessionParticipantUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionParticipantCreateManyUserInputEnvelope
    set?: SessionParticipantWhereUniqueInput | SessionParticipantWhereUniqueInput[]
    disconnect?: SessionParticipantWhereUniqueInput | SessionParticipantWhereUniqueInput[]
    delete?: SessionParticipantWhereUniqueInput | SessionParticipantWhereUniqueInput[]
    connect?: SessionParticipantWhereUniqueInput | SessionParticipantWhereUniqueInput[]
    update?: SessionParticipantUpdateWithWhereUniqueWithoutUserInput | SessionParticipantUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionParticipantUpdateManyWithWhereWithoutUserInput | SessionParticipantUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionParticipantScalarWhereInput | SessionParticipantScalarWhereInput[]
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput> | ProjectCreateWithoutOwnerInput[] | ProjectUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutOwnerInput | ProjectCreateOrConnectWithoutOwnerInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutOwnerInput | ProjectUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: ProjectCreateManyOwnerInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutOwnerInput | ProjectUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutOwnerInput | ProjectUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type ProjectMemberUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProjectMemberCreateWithoutUserInput, ProjectMemberUncheckedCreateWithoutUserInput> | ProjectMemberCreateWithoutUserInput[] | ProjectMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectMemberCreateOrConnectWithoutUserInput | ProjectMemberCreateOrConnectWithoutUserInput[]
    upsert?: ProjectMemberUpsertWithWhereUniqueWithoutUserInput | ProjectMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProjectMemberCreateManyUserInputEnvelope
    set?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    disconnect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    delete?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    connect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    update?: ProjectMemberUpdateWithWhereUniqueWithoutUserInput | ProjectMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProjectMemberUpdateManyWithWhereWithoutUserInput | ProjectMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProjectMemberScalarWhereInput | ProjectMemberScalarWhereInput[]
  }

  export type AiChatSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AiChatSessionCreateWithoutUserInput, AiChatSessionUncheckedCreateWithoutUserInput> | AiChatSessionCreateWithoutUserInput[] | AiChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AiChatSessionCreateOrConnectWithoutUserInput | AiChatSessionCreateOrConnectWithoutUserInput[]
    upsert?: AiChatSessionUpsertWithWhereUniqueWithoutUserInput | AiChatSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AiChatSessionCreateManyUserInputEnvelope
    set?: AiChatSessionWhereUniqueInput | AiChatSessionWhereUniqueInput[]
    disconnect?: AiChatSessionWhereUniqueInput | AiChatSessionWhereUniqueInput[]
    delete?: AiChatSessionWhereUniqueInput | AiChatSessionWhereUniqueInput[]
    connect?: AiChatSessionWhereUniqueInput | AiChatSessionWhereUniqueInput[]
    update?: AiChatSessionUpdateWithWhereUniqueWithoutUserInput | AiChatSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AiChatSessionUpdateManyWithWhereWithoutUserInput | AiChatSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AiChatSessionScalarWhereInput | AiChatSessionScalarWhereInput[]
  }

  export type FileActivityUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<FileActivityCreateWithoutUserInput, FileActivityUncheckedCreateWithoutUserInput> | FileActivityCreateWithoutUserInput[] | FileActivityUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FileActivityCreateOrConnectWithoutUserInput | FileActivityCreateOrConnectWithoutUserInput[]
    upsert?: FileActivityUpsertWithWhereUniqueWithoutUserInput | FileActivityUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FileActivityCreateManyUserInputEnvelope
    set?: FileActivityWhereUniqueInput | FileActivityWhereUniqueInput[]
    disconnect?: FileActivityWhereUniqueInput | FileActivityWhereUniqueInput[]
    delete?: FileActivityWhereUniqueInput | FileActivityWhereUniqueInput[]
    connect?: FileActivityWhereUniqueInput | FileActivityWhereUniqueInput[]
    update?: FileActivityUpdateWithWhereUniqueWithoutUserInput | FileActivityUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FileActivityUpdateManyWithWhereWithoutUserInput | FileActivityUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FileActivityScalarWhereInput | FileActivityScalarWhereInput[]
  }

  export type SessionParticipantUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionParticipantCreateWithoutUserInput, SessionParticipantUncheckedCreateWithoutUserInput> | SessionParticipantCreateWithoutUserInput[] | SessionParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionParticipantCreateOrConnectWithoutUserInput | SessionParticipantCreateOrConnectWithoutUserInput[]
    upsert?: SessionParticipantUpsertWithWhereUniqueWithoutUserInput | SessionParticipantUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionParticipantCreateManyUserInputEnvelope
    set?: SessionParticipantWhereUniqueInput | SessionParticipantWhereUniqueInput[]
    disconnect?: SessionParticipantWhereUniqueInput | SessionParticipantWhereUniqueInput[]
    delete?: SessionParticipantWhereUniqueInput | SessionParticipantWhereUniqueInput[]
    connect?: SessionParticipantWhereUniqueInput | SessionParticipantWhereUniqueInput[]
    update?: SessionParticipantUpdateWithWhereUniqueWithoutUserInput | SessionParticipantUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionParticipantUpdateManyWithWhereWithoutUserInput | SessionParticipantUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionParticipantScalarWhereInput | SessionParticipantScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserCreateNestedOneWithoutOwnedProjectsInput = {
    create?: XOR<UserCreateWithoutOwnedProjectsInput, UserUncheckedCreateWithoutOwnedProjectsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwnedProjectsInput
    connect?: UserWhereUniqueInput
  }

  export type ProjectFileCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput> | ProjectFileCreateWithoutProjectInput[] | ProjectFileUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutProjectInput | ProjectFileCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectFileCreateManyProjectInputEnvelope
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
  }

  export type ProjectMemberCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectMemberCreateWithoutProjectInput, ProjectMemberUncheckedCreateWithoutProjectInput> | ProjectMemberCreateWithoutProjectInput[] | ProjectMemberUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectMemberCreateOrConnectWithoutProjectInput | ProjectMemberCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectMemberCreateManyProjectInputEnvelope
    connect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
  }

  export type CollaborationSessionCreateNestedManyWithoutProjectInput = {
    create?: XOR<CollaborationSessionCreateWithoutProjectInput, CollaborationSessionUncheckedCreateWithoutProjectInput> | CollaborationSessionCreateWithoutProjectInput[] | CollaborationSessionUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: CollaborationSessionCreateOrConnectWithoutProjectInput | CollaborationSessionCreateOrConnectWithoutProjectInput[]
    createMany?: CollaborationSessionCreateManyProjectInputEnvelope
    connect?: CollaborationSessionWhereUniqueInput | CollaborationSessionWhereUniqueInput[]
  }

  export type AiChatSessionCreateNestedManyWithoutProjectInput = {
    create?: XOR<AiChatSessionCreateWithoutProjectInput, AiChatSessionUncheckedCreateWithoutProjectInput> | AiChatSessionCreateWithoutProjectInput[] | AiChatSessionUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: AiChatSessionCreateOrConnectWithoutProjectInput | AiChatSessionCreateOrConnectWithoutProjectInput[]
    createMany?: AiChatSessionCreateManyProjectInputEnvelope
    connect?: AiChatSessionWhereUniqueInput | AiChatSessionWhereUniqueInput[]
  }

  export type GitRepositoryCreateNestedOneWithoutProjectInput = {
    create?: XOR<GitRepositoryCreateWithoutProjectInput, GitRepositoryUncheckedCreateWithoutProjectInput>
    connectOrCreate?: GitRepositoryCreateOrConnectWithoutProjectInput
    connect?: GitRepositoryWhereUniqueInput
  }

  export type ProjectFileUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput> | ProjectFileCreateWithoutProjectInput[] | ProjectFileUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutProjectInput | ProjectFileCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectFileCreateManyProjectInputEnvelope
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
  }

  export type ProjectMemberUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectMemberCreateWithoutProjectInput, ProjectMemberUncheckedCreateWithoutProjectInput> | ProjectMemberCreateWithoutProjectInput[] | ProjectMemberUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectMemberCreateOrConnectWithoutProjectInput | ProjectMemberCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectMemberCreateManyProjectInputEnvelope
    connect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
  }

  export type CollaborationSessionUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<CollaborationSessionCreateWithoutProjectInput, CollaborationSessionUncheckedCreateWithoutProjectInput> | CollaborationSessionCreateWithoutProjectInput[] | CollaborationSessionUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: CollaborationSessionCreateOrConnectWithoutProjectInput | CollaborationSessionCreateOrConnectWithoutProjectInput[]
    createMany?: CollaborationSessionCreateManyProjectInputEnvelope
    connect?: CollaborationSessionWhereUniqueInput | CollaborationSessionWhereUniqueInput[]
  }

  export type AiChatSessionUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<AiChatSessionCreateWithoutProjectInput, AiChatSessionUncheckedCreateWithoutProjectInput> | AiChatSessionCreateWithoutProjectInput[] | AiChatSessionUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: AiChatSessionCreateOrConnectWithoutProjectInput | AiChatSessionCreateOrConnectWithoutProjectInput[]
    createMany?: AiChatSessionCreateManyProjectInputEnvelope
    connect?: AiChatSessionWhereUniqueInput | AiChatSessionWhereUniqueInput[]
  }

  export type GitRepositoryUncheckedCreateNestedOneWithoutProjectInput = {
    create?: XOR<GitRepositoryCreateWithoutProjectInput, GitRepositoryUncheckedCreateWithoutProjectInput>
    connectOrCreate?: GitRepositoryCreateOrConnectWithoutProjectInput
    connect?: GitRepositoryWhereUniqueInput
  }

  export type EnumProjectVisibilityFieldUpdateOperationsInput = {
    set?: $Enums.ProjectVisibility
  }

  export type UserUpdateOneRequiredWithoutOwnedProjectsNestedInput = {
    create?: XOR<UserCreateWithoutOwnedProjectsInput, UserUncheckedCreateWithoutOwnedProjectsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwnedProjectsInput
    upsert?: UserUpsertWithoutOwnedProjectsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOwnedProjectsInput, UserUpdateWithoutOwnedProjectsInput>, UserUncheckedUpdateWithoutOwnedProjectsInput>
  }

  export type ProjectFileUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput> | ProjectFileCreateWithoutProjectInput[] | ProjectFileUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutProjectInput | ProjectFileCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectFileUpsertWithWhereUniqueWithoutProjectInput | ProjectFileUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectFileCreateManyProjectInputEnvelope
    set?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    disconnect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    delete?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    update?: ProjectFileUpdateWithWhereUniqueWithoutProjectInput | ProjectFileUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectFileUpdateManyWithWhereWithoutProjectInput | ProjectFileUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
  }

  export type ProjectMemberUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectMemberCreateWithoutProjectInput, ProjectMemberUncheckedCreateWithoutProjectInput> | ProjectMemberCreateWithoutProjectInput[] | ProjectMemberUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectMemberCreateOrConnectWithoutProjectInput | ProjectMemberCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectMemberUpsertWithWhereUniqueWithoutProjectInput | ProjectMemberUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectMemberCreateManyProjectInputEnvelope
    set?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    disconnect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    delete?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    connect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    update?: ProjectMemberUpdateWithWhereUniqueWithoutProjectInput | ProjectMemberUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectMemberUpdateManyWithWhereWithoutProjectInput | ProjectMemberUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectMemberScalarWhereInput | ProjectMemberScalarWhereInput[]
  }

  export type CollaborationSessionUpdateManyWithoutProjectNestedInput = {
    create?: XOR<CollaborationSessionCreateWithoutProjectInput, CollaborationSessionUncheckedCreateWithoutProjectInput> | CollaborationSessionCreateWithoutProjectInput[] | CollaborationSessionUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: CollaborationSessionCreateOrConnectWithoutProjectInput | CollaborationSessionCreateOrConnectWithoutProjectInput[]
    upsert?: CollaborationSessionUpsertWithWhereUniqueWithoutProjectInput | CollaborationSessionUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: CollaborationSessionCreateManyProjectInputEnvelope
    set?: CollaborationSessionWhereUniqueInput | CollaborationSessionWhereUniqueInput[]
    disconnect?: CollaborationSessionWhereUniqueInput | CollaborationSessionWhereUniqueInput[]
    delete?: CollaborationSessionWhereUniqueInput | CollaborationSessionWhereUniqueInput[]
    connect?: CollaborationSessionWhereUniqueInput | CollaborationSessionWhereUniqueInput[]
    update?: CollaborationSessionUpdateWithWhereUniqueWithoutProjectInput | CollaborationSessionUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: CollaborationSessionUpdateManyWithWhereWithoutProjectInput | CollaborationSessionUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: CollaborationSessionScalarWhereInput | CollaborationSessionScalarWhereInput[]
  }

  export type AiChatSessionUpdateManyWithoutProjectNestedInput = {
    create?: XOR<AiChatSessionCreateWithoutProjectInput, AiChatSessionUncheckedCreateWithoutProjectInput> | AiChatSessionCreateWithoutProjectInput[] | AiChatSessionUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: AiChatSessionCreateOrConnectWithoutProjectInput | AiChatSessionCreateOrConnectWithoutProjectInput[]
    upsert?: AiChatSessionUpsertWithWhereUniqueWithoutProjectInput | AiChatSessionUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: AiChatSessionCreateManyProjectInputEnvelope
    set?: AiChatSessionWhereUniqueInput | AiChatSessionWhereUniqueInput[]
    disconnect?: AiChatSessionWhereUniqueInput | AiChatSessionWhereUniqueInput[]
    delete?: AiChatSessionWhereUniqueInput | AiChatSessionWhereUniqueInput[]
    connect?: AiChatSessionWhereUniqueInput | AiChatSessionWhereUniqueInput[]
    update?: AiChatSessionUpdateWithWhereUniqueWithoutProjectInput | AiChatSessionUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: AiChatSessionUpdateManyWithWhereWithoutProjectInput | AiChatSessionUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: AiChatSessionScalarWhereInput | AiChatSessionScalarWhereInput[]
  }

  export type GitRepositoryUpdateOneWithoutProjectNestedInput = {
    create?: XOR<GitRepositoryCreateWithoutProjectInput, GitRepositoryUncheckedCreateWithoutProjectInput>
    connectOrCreate?: GitRepositoryCreateOrConnectWithoutProjectInput
    upsert?: GitRepositoryUpsertWithoutProjectInput
    disconnect?: GitRepositoryWhereInput | boolean
    delete?: GitRepositoryWhereInput | boolean
    connect?: GitRepositoryWhereUniqueInput
    update?: XOR<XOR<GitRepositoryUpdateToOneWithWhereWithoutProjectInput, GitRepositoryUpdateWithoutProjectInput>, GitRepositoryUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectFileUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput> | ProjectFileCreateWithoutProjectInput[] | ProjectFileUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutProjectInput | ProjectFileCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectFileUpsertWithWhereUniqueWithoutProjectInput | ProjectFileUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectFileCreateManyProjectInputEnvelope
    set?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    disconnect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    delete?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    update?: ProjectFileUpdateWithWhereUniqueWithoutProjectInput | ProjectFileUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectFileUpdateManyWithWhereWithoutProjectInput | ProjectFileUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
  }

  export type ProjectMemberUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectMemberCreateWithoutProjectInput, ProjectMemberUncheckedCreateWithoutProjectInput> | ProjectMemberCreateWithoutProjectInput[] | ProjectMemberUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectMemberCreateOrConnectWithoutProjectInput | ProjectMemberCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectMemberUpsertWithWhereUniqueWithoutProjectInput | ProjectMemberUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectMemberCreateManyProjectInputEnvelope
    set?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    disconnect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    delete?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    connect?: ProjectMemberWhereUniqueInput | ProjectMemberWhereUniqueInput[]
    update?: ProjectMemberUpdateWithWhereUniqueWithoutProjectInput | ProjectMemberUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectMemberUpdateManyWithWhereWithoutProjectInput | ProjectMemberUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectMemberScalarWhereInput | ProjectMemberScalarWhereInput[]
  }

  export type CollaborationSessionUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<CollaborationSessionCreateWithoutProjectInput, CollaborationSessionUncheckedCreateWithoutProjectInput> | CollaborationSessionCreateWithoutProjectInput[] | CollaborationSessionUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: CollaborationSessionCreateOrConnectWithoutProjectInput | CollaborationSessionCreateOrConnectWithoutProjectInput[]
    upsert?: CollaborationSessionUpsertWithWhereUniqueWithoutProjectInput | CollaborationSessionUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: CollaborationSessionCreateManyProjectInputEnvelope
    set?: CollaborationSessionWhereUniqueInput | CollaborationSessionWhereUniqueInput[]
    disconnect?: CollaborationSessionWhereUniqueInput | CollaborationSessionWhereUniqueInput[]
    delete?: CollaborationSessionWhereUniqueInput | CollaborationSessionWhereUniqueInput[]
    connect?: CollaborationSessionWhereUniqueInput | CollaborationSessionWhereUniqueInput[]
    update?: CollaborationSessionUpdateWithWhereUniqueWithoutProjectInput | CollaborationSessionUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: CollaborationSessionUpdateManyWithWhereWithoutProjectInput | CollaborationSessionUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: CollaborationSessionScalarWhereInput | CollaborationSessionScalarWhereInput[]
  }

  export type AiChatSessionUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<AiChatSessionCreateWithoutProjectInput, AiChatSessionUncheckedCreateWithoutProjectInput> | AiChatSessionCreateWithoutProjectInput[] | AiChatSessionUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: AiChatSessionCreateOrConnectWithoutProjectInput | AiChatSessionCreateOrConnectWithoutProjectInput[]
    upsert?: AiChatSessionUpsertWithWhereUniqueWithoutProjectInput | AiChatSessionUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: AiChatSessionCreateManyProjectInputEnvelope
    set?: AiChatSessionWhereUniqueInput | AiChatSessionWhereUniqueInput[]
    disconnect?: AiChatSessionWhereUniqueInput | AiChatSessionWhereUniqueInput[]
    delete?: AiChatSessionWhereUniqueInput | AiChatSessionWhereUniqueInput[]
    connect?: AiChatSessionWhereUniqueInput | AiChatSessionWhereUniqueInput[]
    update?: AiChatSessionUpdateWithWhereUniqueWithoutProjectInput | AiChatSessionUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: AiChatSessionUpdateManyWithWhereWithoutProjectInput | AiChatSessionUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: AiChatSessionScalarWhereInput | AiChatSessionScalarWhereInput[]
  }

  export type GitRepositoryUncheckedUpdateOneWithoutProjectNestedInput = {
    create?: XOR<GitRepositoryCreateWithoutProjectInput, GitRepositoryUncheckedCreateWithoutProjectInput>
    connectOrCreate?: GitRepositoryCreateOrConnectWithoutProjectInput
    upsert?: GitRepositoryUpsertWithoutProjectInput
    disconnect?: GitRepositoryWhereInput | boolean
    delete?: GitRepositoryWhereInput | boolean
    connect?: GitRepositoryWhereUniqueInput
    update?: XOR<XOR<GitRepositoryUpdateToOneWithWhereWithoutProjectInput, GitRepositoryUpdateWithoutProjectInput>, GitRepositoryUncheckedUpdateWithoutProjectInput>
  }

  export type UserCreateNestedOneWithoutMembershipsInput = {
    create?: XOR<UserCreateWithoutMembershipsInput, UserUncheckedCreateWithoutMembershipsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMembershipsInput
    connect?: UserWhereUniqueInput
  }

  export type ProjectCreateNestedOneWithoutMembersInput = {
    create?: XOR<ProjectCreateWithoutMembersInput, ProjectUncheckedCreateWithoutMembersInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutMembersInput
    connect?: ProjectWhereUniqueInput
  }

  export type EnumProjectRoleFieldUpdateOperationsInput = {
    set?: $Enums.ProjectRole
  }

  export type UserUpdateOneRequiredWithoutMembershipsNestedInput = {
    create?: XOR<UserCreateWithoutMembershipsInput, UserUncheckedCreateWithoutMembershipsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMembershipsInput
    upsert?: UserUpsertWithoutMembershipsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMembershipsInput, UserUpdateWithoutMembershipsInput>, UserUncheckedUpdateWithoutMembershipsInput>
  }

  export type ProjectUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<ProjectCreateWithoutMembersInput, ProjectUncheckedCreateWithoutMembersInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutMembersInput
    upsert?: ProjectUpsertWithoutMembersInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutMembersInput, ProjectUpdateWithoutMembersInput>, ProjectUncheckedUpdateWithoutMembersInput>
  }

  export type ProjectCreateNestedOneWithoutFilesInput = {
    create?: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutFilesInput
    connect?: ProjectWhereUniqueInput
  }

  export type FileActivityCreateNestedManyWithoutFileInput = {
    create?: XOR<FileActivityCreateWithoutFileInput, FileActivityUncheckedCreateWithoutFileInput> | FileActivityCreateWithoutFileInput[] | FileActivityUncheckedCreateWithoutFileInput[]
    connectOrCreate?: FileActivityCreateOrConnectWithoutFileInput | FileActivityCreateOrConnectWithoutFileInput[]
    createMany?: FileActivityCreateManyFileInputEnvelope
    connect?: FileActivityWhereUniqueInput | FileActivityWhereUniqueInput[]
  }

  export type FileActivityUncheckedCreateNestedManyWithoutFileInput = {
    create?: XOR<FileActivityCreateWithoutFileInput, FileActivityUncheckedCreateWithoutFileInput> | FileActivityCreateWithoutFileInput[] | FileActivityUncheckedCreateWithoutFileInput[]
    connectOrCreate?: FileActivityCreateOrConnectWithoutFileInput | FileActivityCreateOrConnectWithoutFileInput[]
    createMany?: FileActivityCreateManyFileInputEnvelope
    connect?: FileActivityWhereUniqueInput | FileActivityWhereUniqueInput[]
  }

  export type EnumFileTypeFieldUpdateOperationsInput = {
    set?: $Enums.FileType
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProjectUpdateOneRequiredWithoutFilesNestedInput = {
    create?: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutFilesInput
    upsert?: ProjectUpsertWithoutFilesInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutFilesInput, ProjectUpdateWithoutFilesInput>, ProjectUncheckedUpdateWithoutFilesInput>
  }

  export type FileActivityUpdateManyWithoutFileNestedInput = {
    create?: XOR<FileActivityCreateWithoutFileInput, FileActivityUncheckedCreateWithoutFileInput> | FileActivityCreateWithoutFileInput[] | FileActivityUncheckedCreateWithoutFileInput[]
    connectOrCreate?: FileActivityCreateOrConnectWithoutFileInput | FileActivityCreateOrConnectWithoutFileInput[]
    upsert?: FileActivityUpsertWithWhereUniqueWithoutFileInput | FileActivityUpsertWithWhereUniqueWithoutFileInput[]
    createMany?: FileActivityCreateManyFileInputEnvelope
    set?: FileActivityWhereUniqueInput | FileActivityWhereUniqueInput[]
    disconnect?: FileActivityWhereUniqueInput | FileActivityWhereUniqueInput[]
    delete?: FileActivityWhereUniqueInput | FileActivityWhereUniqueInput[]
    connect?: FileActivityWhereUniqueInput | FileActivityWhereUniqueInput[]
    update?: FileActivityUpdateWithWhereUniqueWithoutFileInput | FileActivityUpdateWithWhereUniqueWithoutFileInput[]
    updateMany?: FileActivityUpdateManyWithWhereWithoutFileInput | FileActivityUpdateManyWithWhereWithoutFileInput[]
    deleteMany?: FileActivityScalarWhereInput | FileActivityScalarWhereInput[]
  }

  export type FileActivityUncheckedUpdateManyWithoutFileNestedInput = {
    create?: XOR<FileActivityCreateWithoutFileInput, FileActivityUncheckedCreateWithoutFileInput> | FileActivityCreateWithoutFileInput[] | FileActivityUncheckedCreateWithoutFileInput[]
    connectOrCreate?: FileActivityCreateOrConnectWithoutFileInput | FileActivityCreateOrConnectWithoutFileInput[]
    upsert?: FileActivityUpsertWithWhereUniqueWithoutFileInput | FileActivityUpsertWithWhereUniqueWithoutFileInput[]
    createMany?: FileActivityCreateManyFileInputEnvelope
    set?: FileActivityWhereUniqueInput | FileActivityWhereUniqueInput[]
    disconnect?: FileActivityWhereUniqueInput | FileActivityWhereUniqueInput[]
    delete?: FileActivityWhereUniqueInput | FileActivityWhereUniqueInput[]
    connect?: FileActivityWhereUniqueInput | FileActivityWhereUniqueInput[]
    update?: FileActivityUpdateWithWhereUniqueWithoutFileInput | FileActivityUpdateWithWhereUniqueWithoutFileInput[]
    updateMany?: FileActivityUpdateManyWithWhereWithoutFileInput | FileActivityUpdateManyWithWhereWithoutFileInput[]
    deleteMany?: FileActivityScalarWhereInput | FileActivityScalarWhereInput[]
  }

  export type ProjectFileCreateNestedOneWithoutActivitiesInput = {
    create?: XOR<ProjectFileCreateWithoutActivitiesInput, ProjectFileUncheckedCreateWithoutActivitiesInput>
    connectOrCreate?: ProjectFileCreateOrConnectWithoutActivitiesInput
    connect?: ProjectFileWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutFileActivitiesInput = {
    create?: XOR<UserCreateWithoutFileActivitiesInput, UserUncheckedCreateWithoutFileActivitiesInput>
    connectOrCreate?: UserCreateOrConnectWithoutFileActivitiesInput
    connect?: UserWhereUniqueInput
  }

  export type EnumFileActionFieldUpdateOperationsInput = {
    set?: $Enums.FileAction
  }

  export type ProjectFileUpdateOneRequiredWithoutActivitiesNestedInput = {
    create?: XOR<ProjectFileCreateWithoutActivitiesInput, ProjectFileUncheckedCreateWithoutActivitiesInput>
    connectOrCreate?: ProjectFileCreateOrConnectWithoutActivitiesInput
    upsert?: ProjectFileUpsertWithoutActivitiesInput
    connect?: ProjectFileWhereUniqueInput
    update?: XOR<XOR<ProjectFileUpdateToOneWithWhereWithoutActivitiesInput, ProjectFileUpdateWithoutActivitiesInput>, ProjectFileUncheckedUpdateWithoutActivitiesInput>
  }

  export type UserUpdateOneRequiredWithoutFileActivitiesNestedInput = {
    create?: XOR<UserCreateWithoutFileActivitiesInput, UserUncheckedCreateWithoutFileActivitiesInput>
    connectOrCreate?: UserCreateOrConnectWithoutFileActivitiesInput
    upsert?: UserUpsertWithoutFileActivitiesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFileActivitiesInput, UserUpdateWithoutFileActivitiesInput>, UserUncheckedUpdateWithoutFileActivitiesInput>
  }

  export type ProjectCreateNestedOneWithoutSessionsInput = {
    create?: XOR<ProjectCreateWithoutSessionsInput, ProjectUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutSessionsInput
    connect?: ProjectWhereUniqueInput
  }

  export type SessionParticipantCreateNestedManyWithoutSessionInput = {
    create?: XOR<SessionParticipantCreateWithoutSessionInput, SessionParticipantUncheckedCreateWithoutSessionInput> | SessionParticipantCreateWithoutSessionInput[] | SessionParticipantUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: SessionParticipantCreateOrConnectWithoutSessionInput | SessionParticipantCreateOrConnectWithoutSessionInput[]
    createMany?: SessionParticipantCreateManySessionInputEnvelope
    connect?: SessionParticipantWhereUniqueInput | SessionParticipantWhereUniqueInput[]
  }

  export type SessionParticipantUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<SessionParticipantCreateWithoutSessionInput, SessionParticipantUncheckedCreateWithoutSessionInput> | SessionParticipantCreateWithoutSessionInput[] | SessionParticipantUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: SessionParticipantCreateOrConnectWithoutSessionInput | SessionParticipantCreateOrConnectWithoutSessionInput[]
    createMany?: SessionParticipantCreateManySessionInputEnvelope
    connect?: SessionParticipantWhereUniqueInput | SessionParticipantWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ProjectUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<ProjectCreateWithoutSessionsInput, ProjectUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutSessionsInput
    upsert?: ProjectUpsertWithoutSessionsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutSessionsInput, ProjectUpdateWithoutSessionsInput>, ProjectUncheckedUpdateWithoutSessionsInput>
  }

  export type SessionParticipantUpdateManyWithoutSessionNestedInput = {
    create?: XOR<SessionParticipantCreateWithoutSessionInput, SessionParticipantUncheckedCreateWithoutSessionInput> | SessionParticipantCreateWithoutSessionInput[] | SessionParticipantUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: SessionParticipantCreateOrConnectWithoutSessionInput | SessionParticipantCreateOrConnectWithoutSessionInput[]
    upsert?: SessionParticipantUpsertWithWhereUniqueWithoutSessionInput | SessionParticipantUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: SessionParticipantCreateManySessionInputEnvelope
    set?: SessionParticipantWhereUniqueInput | SessionParticipantWhereUniqueInput[]
    disconnect?: SessionParticipantWhereUniqueInput | SessionParticipantWhereUniqueInput[]
    delete?: SessionParticipantWhereUniqueInput | SessionParticipantWhereUniqueInput[]
    connect?: SessionParticipantWhereUniqueInput | SessionParticipantWhereUniqueInput[]
    update?: SessionParticipantUpdateWithWhereUniqueWithoutSessionInput | SessionParticipantUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: SessionParticipantUpdateManyWithWhereWithoutSessionInput | SessionParticipantUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: SessionParticipantScalarWhereInput | SessionParticipantScalarWhereInput[]
  }

  export type SessionParticipantUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<SessionParticipantCreateWithoutSessionInput, SessionParticipantUncheckedCreateWithoutSessionInput> | SessionParticipantCreateWithoutSessionInput[] | SessionParticipantUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: SessionParticipantCreateOrConnectWithoutSessionInput | SessionParticipantCreateOrConnectWithoutSessionInput[]
    upsert?: SessionParticipantUpsertWithWhereUniqueWithoutSessionInput | SessionParticipantUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: SessionParticipantCreateManySessionInputEnvelope
    set?: SessionParticipantWhereUniqueInput | SessionParticipantWhereUniqueInput[]
    disconnect?: SessionParticipantWhereUniqueInput | SessionParticipantWhereUniqueInput[]
    delete?: SessionParticipantWhereUniqueInput | SessionParticipantWhereUniqueInput[]
    connect?: SessionParticipantWhereUniqueInput | SessionParticipantWhereUniqueInput[]
    update?: SessionParticipantUpdateWithWhereUniqueWithoutSessionInput | SessionParticipantUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: SessionParticipantUpdateManyWithWhereWithoutSessionInput | SessionParticipantUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: SessionParticipantScalarWhereInput | SessionParticipantScalarWhereInput[]
  }

  export type CollaborationSessionCreateNestedOneWithoutParticipantsInput = {
    create?: XOR<CollaborationSessionCreateWithoutParticipantsInput, CollaborationSessionUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: CollaborationSessionCreateOrConnectWithoutParticipantsInput
    connect?: CollaborationSessionWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutSessionParticipationsInput = {
    create?: XOR<UserCreateWithoutSessionParticipationsInput, UserUncheckedCreateWithoutSessionParticipationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionParticipationsInput
    connect?: UserWhereUniqueInput
  }

  export type CollaborationSessionUpdateOneRequiredWithoutParticipantsNestedInput = {
    create?: XOR<CollaborationSessionCreateWithoutParticipantsInput, CollaborationSessionUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: CollaborationSessionCreateOrConnectWithoutParticipantsInput
    upsert?: CollaborationSessionUpsertWithoutParticipantsInput
    connect?: CollaborationSessionWhereUniqueInput
    update?: XOR<XOR<CollaborationSessionUpdateToOneWithWhereWithoutParticipantsInput, CollaborationSessionUpdateWithoutParticipantsInput>, CollaborationSessionUncheckedUpdateWithoutParticipantsInput>
  }

  export type UserUpdateOneRequiredWithoutSessionParticipationsNestedInput = {
    create?: XOR<UserCreateWithoutSessionParticipationsInput, UserUncheckedCreateWithoutSessionParticipationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionParticipationsInput
    upsert?: UserUpsertWithoutSessionParticipationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionParticipationsInput, UserUpdateWithoutSessionParticipationsInput>, UserUncheckedUpdateWithoutSessionParticipationsInput>
  }

  export type UserCreateNestedOneWithoutAiSessionsInput = {
    create?: XOR<UserCreateWithoutAiSessionsInput, UserUncheckedCreateWithoutAiSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAiSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type ProjectCreateNestedOneWithoutAiSessionsInput = {
    create?: XOR<ProjectCreateWithoutAiSessionsInput, ProjectUncheckedCreateWithoutAiSessionsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutAiSessionsInput
    connect?: ProjectWhereUniqueInput
  }

  export type AiMessageCreateNestedManyWithoutSessionInput = {
    create?: XOR<AiMessageCreateWithoutSessionInput, AiMessageUncheckedCreateWithoutSessionInput> | AiMessageCreateWithoutSessionInput[] | AiMessageUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: AiMessageCreateOrConnectWithoutSessionInput | AiMessageCreateOrConnectWithoutSessionInput[]
    createMany?: AiMessageCreateManySessionInputEnvelope
    connect?: AiMessageWhereUniqueInput | AiMessageWhereUniqueInput[]
  }

  export type AiMessageUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<AiMessageCreateWithoutSessionInput, AiMessageUncheckedCreateWithoutSessionInput> | AiMessageCreateWithoutSessionInput[] | AiMessageUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: AiMessageCreateOrConnectWithoutSessionInput | AiMessageCreateOrConnectWithoutSessionInput[]
    createMany?: AiMessageCreateManySessionInputEnvelope
    connect?: AiMessageWhereUniqueInput | AiMessageWhereUniqueInput[]
  }

  export type EnumAiContextFieldUpdateOperationsInput = {
    set?: $Enums.AiContext
  }

  export type UserUpdateOneRequiredWithoutAiSessionsNestedInput = {
    create?: XOR<UserCreateWithoutAiSessionsInput, UserUncheckedCreateWithoutAiSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAiSessionsInput
    upsert?: UserUpsertWithoutAiSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAiSessionsInput, UserUpdateWithoutAiSessionsInput>, UserUncheckedUpdateWithoutAiSessionsInput>
  }

  export type ProjectUpdateOneWithoutAiSessionsNestedInput = {
    create?: XOR<ProjectCreateWithoutAiSessionsInput, ProjectUncheckedCreateWithoutAiSessionsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutAiSessionsInput
    upsert?: ProjectUpsertWithoutAiSessionsInput
    disconnect?: ProjectWhereInput | boolean
    delete?: ProjectWhereInput | boolean
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutAiSessionsInput, ProjectUpdateWithoutAiSessionsInput>, ProjectUncheckedUpdateWithoutAiSessionsInput>
  }

  export type AiMessageUpdateManyWithoutSessionNestedInput = {
    create?: XOR<AiMessageCreateWithoutSessionInput, AiMessageUncheckedCreateWithoutSessionInput> | AiMessageCreateWithoutSessionInput[] | AiMessageUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: AiMessageCreateOrConnectWithoutSessionInput | AiMessageCreateOrConnectWithoutSessionInput[]
    upsert?: AiMessageUpsertWithWhereUniqueWithoutSessionInput | AiMessageUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: AiMessageCreateManySessionInputEnvelope
    set?: AiMessageWhereUniqueInput | AiMessageWhereUniqueInput[]
    disconnect?: AiMessageWhereUniqueInput | AiMessageWhereUniqueInput[]
    delete?: AiMessageWhereUniqueInput | AiMessageWhereUniqueInput[]
    connect?: AiMessageWhereUniqueInput | AiMessageWhereUniqueInput[]
    update?: AiMessageUpdateWithWhereUniqueWithoutSessionInput | AiMessageUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: AiMessageUpdateManyWithWhereWithoutSessionInput | AiMessageUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: AiMessageScalarWhereInput | AiMessageScalarWhereInput[]
  }

  export type AiMessageUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<AiMessageCreateWithoutSessionInput, AiMessageUncheckedCreateWithoutSessionInput> | AiMessageCreateWithoutSessionInput[] | AiMessageUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: AiMessageCreateOrConnectWithoutSessionInput | AiMessageCreateOrConnectWithoutSessionInput[]
    upsert?: AiMessageUpsertWithWhereUniqueWithoutSessionInput | AiMessageUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: AiMessageCreateManySessionInputEnvelope
    set?: AiMessageWhereUniqueInput | AiMessageWhereUniqueInput[]
    disconnect?: AiMessageWhereUniqueInput | AiMessageWhereUniqueInput[]
    delete?: AiMessageWhereUniqueInput | AiMessageWhereUniqueInput[]
    connect?: AiMessageWhereUniqueInput | AiMessageWhereUniqueInput[]
    update?: AiMessageUpdateWithWhereUniqueWithoutSessionInput | AiMessageUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: AiMessageUpdateManyWithWhereWithoutSessionInput | AiMessageUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: AiMessageScalarWhereInput | AiMessageScalarWhereInput[]
  }

  export type AiChatSessionCreateNestedOneWithoutMessagesInput = {
    create?: XOR<AiChatSessionCreateWithoutMessagesInput, AiChatSessionUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: AiChatSessionCreateOrConnectWithoutMessagesInput
    connect?: AiChatSessionWhereUniqueInput
  }

  export type EnumMessageRoleFieldUpdateOperationsInput = {
    set?: $Enums.MessageRole
  }

  export type AiChatSessionUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<AiChatSessionCreateWithoutMessagesInput, AiChatSessionUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: AiChatSessionCreateOrConnectWithoutMessagesInput
    upsert?: AiChatSessionUpsertWithoutMessagesInput
    connect?: AiChatSessionWhereUniqueInput
    update?: XOR<XOR<AiChatSessionUpdateToOneWithWhereWithoutMessagesInput, AiChatSessionUpdateWithoutMessagesInput>, AiChatSessionUncheckedUpdateWithoutMessagesInput>
  }

  export type ProjectCreateNestedOneWithoutGitRepositoryInput = {
    create?: XOR<ProjectCreateWithoutGitRepositoryInput, ProjectUncheckedCreateWithoutGitRepositoryInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutGitRepositoryInput
    connect?: ProjectWhereUniqueInput
  }

  export type GitCommitCreateNestedManyWithoutRepositoryInput = {
    create?: XOR<GitCommitCreateWithoutRepositoryInput, GitCommitUncheckedCreateWithoutRepositoryInput> | GitCommitCreateWithoutRepositoryInput[] | GitCommitUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: GitCommitCreateOrConnectWithoutRepositoryInput | GitCommitCreateOrConnectWithoutRepositoryInput[]
    createMany?: GitCommitCreateManyRepositoryInputEnvelope
    connect?: GitCommitWhereUniqueInput | GitCommitWhereUniqueInput[]
  }

  export type GitCommitUncheckedCreateNestedManyWithoutRepositoryInput = {
    create?: XOR<GitCommitCreateWithoutRepositoryInput, GitCommitUncheckedCreateWithoutRepositoryInput> | GitCommitCreateWithoutRepositoryInput[] | GitCommitUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: GitCommitCreateOrConnectWithoutRepositoryInput | GitCommitCreateOrConnectWithoutRepositoryInput[]
    createMany?: GitCommitCreateManyRepositoryInputEnvelope
    connect?: GitCommitWhereUniqueInput | GitCommitWhereUniqueInput[]
  }

  export type EnumSyncStatusFieldUpdateOperationsInput = {
    set?: $Enums.SyncStatus
  }

  export type ProjectUpdateOneRequiredWithoutGitRepositoryNestedInput = {
    create?: XOR<ProjectCreateWithoutGitRepositoryInput, ProjectUncheckedCreateWithoutGitRepositoryInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutGitRepositoryInput
    upsert?: ProjectUpsertWithoutGitRepositoryInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutGitRepositoryInput, ProjectUpdateWithoutGitRepositoryInput>, ProjectUncheckedUpdateWithoutGitRepositoryInput>
  }

  export type GitCommitUpdateManyWithoutRepositoryNestedInput = {
    create?: XOR<GitCommitCreateWithoutRepositoryInput, GitCommitUncheckedCreateWithoutRepositoryInput> | GitCommitCreateWithoutRepositoryInput[] | GitCommitUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: GitCommitCreateOrConnectWithoutRepositoryInput | GitCommitCreateOrConnectWithoutRepositoryInput[]
    upsert?: GitCommitUpsertWithWhereUniqueWithoutRepositoryInput | GitCommitUpsertWithWhereUniqueWithoutRepositoryInput[]
    createMany?: GitCommitCreateManyRepositoryInputEnvelope
    set?: GitCommitWhereUniqueInput | GitCommitWhereUniqueInput[]
    disconnect?: GitCommitWhereUniqueInput | GitCommitWhereUniqueInput[]
    delete?: GitCommitWhereUniqueInput | GitCommitWhereUniqueInput[]
    connect?: GitCommitWhereUniqueInput | GitCommitWhereUniqueInput[]
    update?: GitCommitUpdateWithWhereUniqueWithoutRepositoryInput | GitCommitUpdateWithWhereUniqueWithoutRepositoryInput[]
    updateMany?: GitCommitUpdateManyWithWhereWithoutRepositoryInput | GitCommitUpdateManyWithWhereWithoutRepositoryInput[]
    deleteMany?: GitCommitScalarWhereInput | GitCommitScalarWhereInput[]
  }

  export type GitCommitUncheckedUpdateManyWithoutRepositoryNestedInput = {
    create?: XOR<GitCommitCreateWithoutRepositoryInput, GitCommitUncheckedCreateWithoutRepositoryInput> | GitCommitCreateWithoutRepositoryInput[] | GitCommitUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: GitCommitCreateOrConnectWithoutRepositoryInput | GitCommitCreateOrConnectWithoutRepositoryInput[]
    upsert?: GitCommitUpsertWithWhereUniqueWithoutRepositoryInput | GitCommitUpsertWithWhereUniqueWithoutRepositoryInput[]
    createMany?: GitCommitCreateManyRepositoryInputEnvelope
    set?: GitCommitWhereUniqueInput | GitCommitWhereUniqueInput[]
    disconnect?: GitCommitWhereUniqueInput | GitCommitWhereUniqueInput[]
    delete?: GitCommitWhereUniqueInput | GitCommitWhereUniqueInput[]
    connect?: GitCommitWhereUniqueInput | GitCommitWhereUniqueInput[]
    update?: GitCommitUpdateWithWhereUniqueWithoutRepositoryInput | GitCommitUpdateWithWhereUniqueWithoutRepositoryInput[]
    updateMany?: GitCommitUpdateManyWithWhereWithoutRepositoryInput | GitCommitUpdateManyWithWhereWithoutRepositoryInput[]
    deleteMany?: GitCommitScalarWhereInput | GitCommitScalarWhereInput[]
  }

  export type GitRepositoryCreateNestedOneWithoutCommitsInput = {
    create?: XOR<GitRepositoryCreateWithoutCommitsInput, GitRepositoryUncheckedCreateWithoutCommitsInput>
    connectOrCreate?: GitRepositoryCreateOrConnectWithoutCommitsInput
    connect?: GitRepositoryWhereUniqueInput
  }

  export type GitRepositoryUpdateOneRequiredWithoutCommitsNestedInput = {
    create?: XOR<GitRepositoryCreateWithoutCommitsInput, GitRepositoryUncheckedCreateWithoutCommitsInput>
    connectOrCreate?: GitRepositoryCreateOrConnectWithoutCommitsInput
    upsert?: GitRepositoryUpsertWithoutCommitsInput
    connect?: GitRepositoryWhereUniqueInput
    update?: XOR<XOR<GitRepositoryUpdateToOneWithWhereWithoutCommitsInput, GitRepositoryUpdateWithoutCommitsInput>, GitRepositoryUncheckedUpdateWithoutCommitsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumProjectVisibilityFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectVisibility | EnumProjectVisibilityFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectVisibility[] | ListEnumProjectVisibilityFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectVisibility[] | ListEnumProjectVisibilityFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectVisibilityFilter<$PrismaModel> | $Enums.ProjectVisibility
  }

  export type NestedEnumProjectVisibilityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectVisibility | EnumProjectVisibilityFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectVisibility[] | ListEnumProjectVisibilityFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectVisibility[] | ListEnumProjectVisibilityFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectVisibilityWithAggregatesFilter<$PrismaModel> | $Enums.ProjectVisibility
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectVisibilityFilter<$PrismaModel>
    _max?: NestedEnumProjectVisibilityFilter<$PrismaModel>
  }

  export type NestedEnumProjectRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectRole | EnumProjectRoleFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectRole[] | ListEnumProjectRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectRole[] | ListEnumProjectRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectRoleFilter<$PrismaModel> | $Enums.ProjectRole
  }

  export type NestedEnumProjectRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectRole | EnumProjectRoleFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectRole[] | ListEnumProjectRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectRole[] | ListEnumProjectRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectRoleWithAggregatesFilter<$PrismaModel> | $Enums.ProjectRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectRoleFilter<$PrismaModel>
    _max?: NestedEnumProjectRoleFilter<$PrismaModel>
  }

  export type NestedEnumFileTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.FileType | EnumFileTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FileType[] | ListEnumFileTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FileType[] | ListEnumFileTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFileTypeFilter<$PrismaModel> | $Enums.FileType
  }

  export type NestedEnumFileTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FileType | EnumFileTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FileType[] | ListEnumFileTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FileType[] | ListEnumFileTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFileTypeWithAggregatesFilter<$PrismaModel> | $Enums.FileType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFileTypeFilter<$PrismaModel>
    _max?: NestedEnumFileTypeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumFileActionFilter<$PrismaModel = never> = {
    equals?: $Enums.FileAction | EnumFileActionFieldRefInput<$PrismaModel>
    in?: $Enums.FileAction[] | ListEnumFileActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.FileAction[] | ListEnumFileActionFieldRefInput<$PrismaModel>
    not?: NestedEnumFileActionFilter<$PrismaModel> | $Enums.FileAction
  }

  export type NestedEnumFileActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FileAction | EnumFileActionFieldRefInput<$PrismaModel>
    in?: $Enums.FileAction[] | ListEnumFileActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.FileAction[] | ListEnumFileActionFieldRefInput<$PrismaModel>
    not?: NestedEnumFileActionWithAggregatesFilter<$PrismaModel> | $Enums.FileAction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFileActionFilter<$PrismaModel>
    _max?: NestedEnumFileActionFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumAiContextFilter<$PrismaModel = never> = {
    equals?: $Enums.AiContext | EnumAiContextFieldRefInput<$PrismaModel>
    in?: $Enums.AiContext[] | ListEnumAiContextFieldRefInput<$PrismaModel>
    notIn?: $Enums.AiContext[] | ListEnumAiContextFieldRefInput<$PrismaModel>
    not?: NestedEnumAiContextFilter<$PrismaModel> | $Enums.AiContext
  }

  export type NestedEnumAiContextWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AiContext | EnumAiContextFieldRefInput<$PrismaModel>
    in?: $Enums.AiContext[] | ListEnumAiContextFieldRefInput<$PrismaModel>
    notIn?: $Enums.AiContext[] | ListEnumAiContextFieldRefInput<$PrismaModel>
    not?: NestedEnumAiContextWithAggregatesFilter<$PrismaModel> | $Enums.AiContext
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAiContextFilter<$PrismaModel>
    _max?: NestedEnumAiContextFilter<$PrismaModel>
  }

  export type NestedEnumMessageRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageRoleFilter<$PrismaModel> | $Enums.MessageRole
  }

  export type NestedEnumMessageRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageRole | EnumMessageRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageRole[] | ListEnumMessageRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageRoleWithAggregatesFilter<$PrismaModel> | $Enums.MessageRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageRoleFilter<$PrismaModel>
    _max?: NestedEnumMessageRoleFilter<$PrismaModel>
  }

  export type NestedEnumSyncStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SyncStatus | EnumSyncStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SyncStatus[] | ListEnumSyncStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SyncStatus[] | ListEnumSyncStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSyncStatusFilter<$PrismaModel> | $Enums.SyncStatus
  }

  export type NestedEnumSyncStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SyncStatus | EnumSyncStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SyncStatus[] | ListEnumSyncStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SyncStatus[] | ListEnumSyncStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSyncStatusWithAggregatesFilter<$PrismaModel> | $Enums.SyncStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSyncStatusFilter<$PrismaModel>
    _max?: NestedEnumSyncStatusFilter<$PrismaModel>
  }

  export type ProjectCreateWithoutOwnerInput = {
    id?: string
    name: string
    description?: string | null
    visibility?: $Enums.ProjectVisibility
    repositoryUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    files?: ProjectFileCreateNestedManyWithoutProjectInput
    members?: ProjectMemberCreateNestedManyWithoutProjectInput
    sessions?: CollaborationSessionCreateNestedManyWithoutProjectInput
    aiSessions?: AiChatSessionCreateNestedManyWithoutProjectInput
    gitRepository?: GitRepositoryCreateNestedOneWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutOwnerInput = {
    id?: string
    name: string
    description?: string | null
    visibility?: $Enums.ProjectVisibility
    repositoryUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
    members?: ProjectMemberUncheckedCreateNestedManyWithoutProjectInput
    sessions?: CollaborationSessionUncheckedCreateNestedManyWithoutProjectInput
    aiSessions?: AiChatSessionUncheckedCreateNestedManyWithoutProjectInput
    gitRepository?: GitRepositoryUncheckedCreateNestedOneWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutOwnerInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput>
  }

  export type ProjectCreateManyOwnerInputEnvelope = {
    data: ProjectCreateManyOwnerInput | ProjectCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type ProjectMemberCreateWithoutUserInput = {
    id?: string
    role?: $Enums.ProjectRole
    joinedAt?: Date | string
    project: ProjectCreateNestedOneWithoutMembersInput
  }

  export type ProjectMemberUncheckedCreateWithoutUserInput = {
    id?: string
    role?: $Enums.ProjectRole
    projectId: string
    joinedAt?: Date | string
  }

  export type ProjectMemberCreateOrConnectWithoutUserInput = {
    where: ProjectMemberWhereUniqueInput
    create: XOR<ProjectMemberCreateWithoutUserInput, ProjectMemberUncheckedCreateWithoutUserInput>
  }

  export type ProjectMemberCreateManyUserInputEnvelope = {
    data: ProjectMemberCreateManyUserInput | ProjectMemberCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AiChatSessionCreateWithoutUserInput = {
    id?: string
    title?: string | null
    context?: $Enums.AiContext
    createdAt?: Date | string
    updatedAt?: Date | string
    project?: ProjectCreateNestedOneWithoutAiSessionsInput
    messages?: AiMessageCreateNestedManyWithoutSessionInput
  }

  export type AiChatSessionUncheckedCreateWithoutUserInput = {
    id?: string
    title?: string | null
    context?: $Enums.AiContext
    projectId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: AiMessageUncheckedCreateNestedManyWithoutSessionInput
  }

  export type AiChatSessionCreateOrConnectWithoutUserInput = {
    where: AiChatSessionWhereUniqueInput
    create: XOR<AiChatSessionCreateWithoutUserInput, AiChatSessionUncheckedCreateWithoutUserInput>
  }

  export type AiChatSessionCreateManyUserInputEnvelope = {
    data: AiChatSessionCreateManyUserInput | AiChatSessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type FileActivityCreateWithoutUserInput = {
    id?: string
    action: $Enums.FileAction
    changes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    file: ProjectFileCreateNestedOneWithoutActivitiesInput
  }

  export type FileActivityUncheckedCreateWithoutUserInput = {
    id?: string
    action: $Enums.FileAction
    changes?: NullableJsonNullValueInput | InputJsonValue
    fileId: string
    createdAt?: Date | string
  }

  export type FileActivityCreateOrConnectWithoutUserInput = {
    where: FileActivityWhereUniqueInput
    create: XOR<FileActivityCreateWithoutUserInput, FileActivityUncheckedCreateWithoutUserInput>
  }

  export type FileActivityCreateManyUserInputEnvelope = {
    data: FileActivityCreateManyUserInput | FileActivityCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionParticipantCreateWithoutUserInput = {
    id?: string
    cursor?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    joinedAt?: Date | string
    leftAt?: Date | string | null
    session: CollaborationSessionCreateNestedOneWithoutParticipantsInput
  }

  export type SessionParticipantUncheckedCreateWithoutUserInput = {
    id?: string
    sessionId: string
    cursor?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    joinedAt?: Date | string
    leftAt?: Date | string | null
  }

  export type SessionParticipantCreateOrConnectWithoutUserInput = {
    where: SessionParticipantWhereUniqueInput
    create: XOR<SessionParticipantCreateWithoutUserInput, SessionParticipantUncheckedCreateWithoutUserInput>
  }

  export type SessionParticipantCreateManyUserInputEnvelope = {
    data: SessionParticipantCreateManyUserInput | SessionParticipantCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithWhereUniqueWithoutOwnerInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutOwnerInput, ProjectUncheckedUpdateWithoutOwnerInput>
    create: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutOwnerInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutOwnerInput, ProjectUncheckedUpdateWithoutOwnerInput>
  }

  export type ProjectUpdateManyWithWhereWithoutOwnerInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutOwnerInput>
  }

  export type ProjectScalarWhereInput = {
    AND?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    OR?: ProjectScalarWhereInput[]
    NOT?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    id?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    visibility?: EnumProjectVisibilityFilter<"Project"> | $Enums.ProjectVisibility
    repositoryUrl?: StringNullableFilter<"Project"> | string | null
    ownerId?: StringFilter<"Project"> | string
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
  }

  export type ProjectMemberUpsertWithWhereUniqueWithoutUserInput = {
    where: ProjectMemberWhereUniqueInput
    update: XOR<ProjectMemberUpdateWithoutUserInput, ProjectMemberUncheckedUpdateWithoutUserInput>
    create: XOR<ProjectMemberCreateWithoutUserInput, ProjectMemberUncheckedCreateWithoutUserInput>
  }

  export type ProjectMemberUpdateWithWhereUniqueWithoutUserInput = {
    where: ProjectMemberWhereUniqueInput
    data: XOR<ProjectMemberUpdateWithoutUserInput, ProjectMemberUncheckedUpdateWithoutUserInput>
  }

  export type ProjectMemberUpdateManyWithWhereWithoutUserInput = {
    where: ProjectMemberScalarWhereInput
    data: XOR<ProjectMemberUpdateManyMutationInput, ProjectMemberUncheckedUpdateManyWithoutUserInput>
  }

  export type ProjectMemberScalarWhereInput = {
    AND?: ProjectMemberScalarWhereInput | ProjectMemberScalarWhereInput[]
    OR?: ProjectMemberScalarWhereInput[]
    NOT?: ProjectMemberScalarWhereInput | ProjectMemberScalarWhereInput[]
    id?: StringFilter<"ProjectMember"> | string
    role?: EnumProjectRoleFilter<"ProjectMember"> | $Enums.ProjectRole
    userId?: StringFilter<"ProjectMember"> | string
    projectId?: StringFilter<"ProjectMember"> | string
    joinedAt?: DateTimeFilter<"ProjectMember"> | Date | string
  }

  export type AiChatSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: AiChatSessionWhereUniqueInput
    update: XOR<AiChatSessionUpdateWithoutUserInput, AiChatSessionUncheckedUpdateWithoutUserInput>
    create: XOR<AiChatSessionCreateWithoutUserInput, AiChatSessionUncheckedCreateWithoutUserInput>
  }

  export type AiChatSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: AiChatSessionWhereUniqueInput
    data: XOR<AiChatSessionUpdateWithoutUserInput, AiChatSessionUncheckedUpdateWithoutUserInput>
  }

  export type AiChatSessionUpdateManyWithWhereWithoutUserInput = {
    where: AiChatSessionScalarWhereInput
    data: XOR<AiChatSessionUpdateManyMutationInput, AiChatSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type AiChatSessionScalarWhereInput = {
    AND?: AiChatSessionScalarWhereInput | AiChatSessionScalarWhereInput[]
    OR?: AiChatSessionScalarWhereInput[]
    NOT?: AiChatSessionScalarWhereInput | AiChatSessionScalarWhereInput[]
    id?: StringFilter<"AiChatSession"> | string
    title?: StringNullableFilter<"AiChatSession"> | string | null
    context?: EnumAiContextFilter<"AiChatSession"> | $Enums.AiContext
    userId?: StringFilter<"AiChatSession"> | string
    projectId?: StringNullableFilter<"AiChatSession"> | string | null
    createdAt?: DateTimeFilter<"AiChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"AiChatSession"> | Date | string
  }

  export type FileActivityUpsertWithWhereUniqueWithoutUserInput = {
    where: FileActivityWhereUniqueInput
    update: XOR<FileActivityUpdateWithoutUserInput, FileActivityUncheckedUpdateWithoutUserInput>
    create: XOR<FileActivityCreateWithoutUserInput, FileActivityUncheckedCreateWithoutUserInput>
  }

  export type FileActivityUpdateWithWhereUniqueWithoutUserInput = {
    where: FileActivityWhereUniqueInput
    data: XOR<FileActivityUpdateWithoutUserInput, FileActivityUncheckedUpdateWithoutUserInput>
  }

  export type FileActivityUpdateManyWithWhereWithoutUserInput = {
    where: FileActivityScalarWhereInput
    data: XOR<FileActivityUpdateManyMutationInput, FileActivityUncheckedUpdateManyWithoutUserInput>
  }

  export type FileActivityScalarWhereInput = {
    AND?: FileActivityScalarWhereInput | FileActivityScalarWhereInput[]
    OR?: FileActivityScalarWhereInput[]
    NOT?: FileActivityScalarWhereInput | FileActivityScalarWhereInput[]
    id?: StringFilter<"FileActivity"> | string
    action?: EnumFileActionFilter<"FileActivity"> | $Enums.FileAction
    changes?: JsonNullableFilter<"FileActivity">
    fileId?: StringFilter<"FileActivity"> | string
    userId?: StringFilter<"FileActivity"> | string
    createdAt?: DateTimeFilter<"FileActivity"> | Date | string
  }

  export type SessionParticipantUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionParticipantWhereUniqueInput
    update: XOR<SessionParticipantUpdateWithoutUserInput, SessionParticipantUncheckedUpdateWithoutUserInput>
    create: XOR<SessionParticipantCreateWithoutUserInput, SessionParticipantUncheckedCreateWithoutUserInput>
  }

  export type SessionParticipantUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionParticipantWhereUniqueInput
    data: XOR<SessionParticipantUpdateWithoutUserInput, SessionParticipantUncheckedUpdateWithoutUserInput>
  }

  export type SessionParticipantUpdateManyWithWhereWithoutUserInput = {
    where: SessionParticipantScalarWhereInput
    data: XOR<SessionParticipantUpdateManyMutationInput, SessionParticipantUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionParticipantScalarWhereInput = {
    AND?: SessionParticipantScalarWhereInput | SessionParticipantScalarWhereInput[]
    OR?: SessionParticipantScalarWhereInput[]
    NOT?: SessionParticipantScalarWhereInput | SessionParticipantScalarWhereInput[]
    id?: StringFilter<"SessionParticipant"> | string
    sessionId?: StringFilter<"SessionParticipant"> | string
    userId?: StringFilter<"SessionParticipant"> | string
    cursor?: JsonNullableFilter<"SessionParticipant">
    isActive?: BoolFilter<"SessionParticipant"> | boolean
    joinedAt?: DateTimeFilter<"SessionParticipant"> | Date | string
    leftAt?: DateTimeNullableFilter<"SessionParticipant"> | Date | string | null
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
  }

  export type UserCreateWithoutAccountsInput = {
    id?: string
    email: string
    username: string
    name?: string | null
    avatar?: string | null
    githubId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    image?: string | null
    emailVerified?: Date | string | null
    ownedProjects?: ProjectCreateNestedManyWithoutOwnerInput
    memberships?: ProjectMemberCreateNestedManyWithoutUserInput
    aiSessions?: AiChatSessionCreateNestedManyWithoutUserInput
    fileActivities?: FileActivityCreateNestedManyWithoutUserInput
    sessionParticipations?: SessionParticipantCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string
    email: string
    username: string
    name?: string | null
    avatar?: string | null
    githubId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    image?: string | null
    emailVerified?: Date | string | null
    ownedProjects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    memberships?: ProjectMemberUncheckedCreateNestedManyWithoutUserInput
    aiSessions?: AiChatSessionUncheckedCreateNestedManyWithoutUserInput
    fileActivities?: FileActivityUncheckedCreateNestedManyWithoutUserInput
    sessionParticipations?: SessionParticipantUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownedProjects?: ProjectUpdateManyWithoutOwnerNestedInput
    memberships?: ProjectMemberUpdateManyWithoutUserNestedInput
    aiSessions?: AiChatSessionUpdateManyWithoutUserNestedInput
    fileActivities?: FileActivityUpdateManyWithoutUserNestedInput
    sessionParticipations?: SessionParticipantUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownedProjects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    memberships?: ProjectMemberUncheckedUpdateManyWithoutUserNestedInput
    aiSessions?: AiChatSessionUncheckedUpdateManyWithoutUserNestedInput
    fileActivities?: FileActivityUncheckedUpdateManyWithoutUserNestedInput
    sessionParticipations?: SessionParticipantUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    email: string
    username: string
    name?: string | null
    avatar?: string | null
    githubId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    image?: string | null
    emailVerified?: Date | string | null
    ownedProjects?: ProjectCreateNestedManyWithoutOwnerInput
    memberships?: ProjectMemberCreateNestedManyWithoutUserInput
    aiSessions?: AiChatSessionCreateNestedManyWithoutUserInput
    fileActivities?: FileActivityCreateNestedManyWithoutUserInput
    sessionParticipations?: SessionParticipantCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    email: string
    username: string
    name?: string | null
    avatar?: string | null
    githubId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    image?: string | null
    emailVerified?: Date | string | null
    ownedProjects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    memberships?: ProjectMemberUncheckedCreateNestedManyWithoutUserInput
    aiSessions?: AiChatSessionUncheckedCreateNestedManyWithoutUserInput
    fileActivities?: FileActivityUncheckedCreateNestedManyWithoutUserInput
    sessionParticipations?: SessionParticipantUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownedProjects?: ProjectUpdateManyWithoutOwnerNestedInput
    memberships?: ProjectMemberUpdateManyWithoutUserNestedInput
    aiSessions?: AiChatSessionUpdateManyWithoutUserNestedInput
    fileActivities?: FileActivityUpdateManyWithoutUserNestedInput
    sessionParticipations?: SessionParticipantUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownedProjects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    memberships?: ProjectMemberUncheckedUpdateManyWithoutUserNestedInput
    aiSessions?: AiChatSessionUncheckedUpdateManyWithoutUserNestedInput
    fileActivities?: FileActivityUncheckedUpdateManyWithoutUserNestedInput
    sessionParticipations?: SessionParticipantUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutOwnedProjectsInput = {
    id?: string
    email: string
    username: string
    name?: string | null
    avatar?: string | null
    githubId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    image?: string | null
    emailVerified?: Date | string | null
    memberships?: ProjectMemberCreateNestedManyWithoutUserInput
    aiSessions?: AiChatSessionCreateNestedManyWithoutUserInput
    fileActivities?: FileActivityCreateNestedManyWithoutUserInput
    sessionParticipations?: SessionParticipantCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOwnedProjectsInput = {
    id?: string
    email: string
    username: string
    name?: string | null
    avatar?: string | null
    githubId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    image?: string | null
    emailVerified?: Date | string | null
    memberships?: ProjectMemberUncheckedCreateNestedManyWithoutUserInput
    aiSessions?: AiChatSessionUncheckedCreateNestedManyWithoutUserInput
    fileActivities?: FileActivityUncheckedCreateNestedManyWithoutUserInput
    sessionParticipations?: SessionParticipantUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOwnedProjectsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOwnedProjectsInput, UserUncheckedCreateWithoutOwnedProjectsInput>
  }

  export type ProjectFileCreateWithoutProjectInput = {
    id?: string
    path: string
    name: string
    type?: $Enums.FileType
    content?: string | null
    size?: number
    mimeType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    activities?: FileActivityCreateNestedManyWithoutFileInput
  }

  export type ProjectFileUncheckedCreateWithoutProjectInput = {
    id?: string
    path: string
    name: string
    type?: $Enums.FileType
    content?: string | null
    size?: number
    mimeType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    activities?: FileActivityUncheckedCreateNestedManyWithoutFileInput
  }

  export type ProjectFileCreateOrConnectWithoutProjectInput = {
    where: ProjectFileWhereUniqueInput
    create: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput>
  }

  export type ProjectFileCreateManyProjectInputEnvelope = {
    data: ProjectFileCreateManyProjectInput | ProjectFileCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type ProjectMemberCreateWithoutProjectInput = {
    id?: string
    role?: $Enums.ProjectRole
    joinedAt?: Date | string
    user: UserCreateNestedOneWithoutMembershipsInput
  }

  export type ProjectMemberUncheckedCreateWithoutProjectInput = {
    id?: string
    role?: $Enums.ProjectRole
    userId: string
    joinedAt?: Date | string
  }

  export type ProjectMemberCreateOrConnectWithoutProjectInput = {
    where: ProjectMemberWhereUniqueInput
    create: XOR<ProjectMemberCreateWithoutProjectInput, ProjectMemberUncheckedCreateWithoutProjectInput>
  }

  export type ProjectMemberCreateManyProjectInputEnvelope = {
    data: ProjectMemberCreateManyProjectInput | ProjectMemberCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type CollaborationSessionCreateWithoutProjectInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    endedAt?: Date | string | null
    participants?: SessionParticipantCreateNestedManyWithoutSessionInput
  }

  export type CollaborationSessionUncheckedCreateWithoutProjectInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    endedAt?: Date | string | null
    participants?: SessionParticipantUncheckedCreateNestedManyWithoutSessionInput
  }

  export type CollaborationSessionCreateOrConnectWithoutProjectInput = {
    where: CollaborationSessionWhereUniqueInput
    create: XOR<CollaborationSessionCreateWithoutProjectInput, CollaborationSessionUncheckedCreateWithoutProjectInput>
  }

  export type CollaborationSessionCreateManyProjectInputEnvelope = {
    data: CollaborationSessionCreateManyProjectInput | CollaborationSessionCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type AiChatSessionCreateWithoutProjectInput = {
    id?: string
    title?: string | null
    context?: $Enums.AiContext
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAiSessionsInput
    messages?: AiMessageCreateNestedManyWithoutSessionInput
  }

  export type AiChatSessionUncheckedCreateWithoutProjectInput = {
    id?: string
    title?: string | null
    context?: $Enums.AiContext
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: AiMessageUncheckedCreateNestedManyWithoutSessionInput
  }

  export type AiChatSessionCreateOrConnectWithoutProjectInput = {
    where: AiChatSessionWhereUniqueInput
    create: XOR<AiChatSessionCreateWithoutProjectInput, AiChatSessionUncheckedCreateWithoutProjectInput>
  }

  export type AiChatSessionCreateManyProjectInputEnvelope = {
    data: AiChatSessionCreateManyProjectInput | AiChatSessionCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type GitRepositoryCreateWithoutProjectInput = {
    id?: string
    url: string
    branch?: string
    lastSync?: Date | string | null
    syncStatus?: $Enums.SyncStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    commits?: GitCommitCreateNestedManyWithoutRepositoryInput
  }

  export type GitRepositoryUncheckedCreateWithoutProjectInput = {
    id?: string
    url: string
    branch?: string
    lastSync?: Date | string | null
    syncStatus?: $Enums.SyncStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    commits?: GitCommitUncheckedCreateNestedManyWithoutRepositoryInput
  }

  export type GitRepositoryCreateOrConnectWithoutProjectInput = {
    where: GitRepositoryWhereUniqueInput
    create: XOR<GitRepositoryCreateWithoutProjectInput, GitRepositoryUncheckedCreateWithoutProjectInput>
  }

  export type UserUpsertWithoutOwnedProjectsInput = {
    update: XOR<UserUpdateWithoutOwnedProjectsInput, UserUncheckedUpdateWithoutOwnedProjectsInput>
    create: XOR<UserCreateWithoutOwnedProjectsInput, UserUncheckedCreateWithoutOwnedProjectsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOwnedProjectsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOwnedProjectsInput, UserUncheckedUpdateWithoutOwnedProjectsInput>
  }

  export type UserUpdateWithoutOwnedProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    memberships?: ProjectMemberUpdateManyWithoutUserNestedInput
    aiSessions?: AiChatSessionUpdateManyWithoutUserNestedInput
    fileActivities?: FileActivityUpdateManyWithoutUserNestedInput
    sessionParticipations?: SessionParticipantUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOwnedProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    memberships?: ProjectMemberUncheckedUpdateManyWithoutUserNestedInput
    aiSessions?: AiChatSessionUncheckedUpdateManyWithoutUserNestedInput
    fileActivities?: FileActivityUncheckedUpdateManyWithoutUserNestedInput
    sessionParticipations?: SessionParticipantUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProjectFileUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProjectFileWhereUniqueInput
    update: XOR<ProjectFileUpdateWithoutProjectInput, ProjectFileUncheckedUpdateWithoutProjectInput>
    create: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput>
  }

  export type ProjectFileUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProjectFileWhereUniqueInput
    data: XOR<ProjectFileUpdateWithoutProjectInput, ProjectFileUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectFileUpdateManyWithWhereWithoutProjectInput = {
    where: ProjectFileScalarWhereInput
    data: XOR<ProjectFileUpdateManyMutationInput, ProjectFileUncheckedUpdateManyWithoutProjectInput>
  }

  export type ProjectFileScalarWhereInput = {
    AND?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
    OR?: ProjectFileScalarWhereInput[]
    NOT?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
    id?: StringFilter<"ProjectFile"> | string
    path?: StringFilter<"ProjectFile"> | string
    name?: StringFilter<"ProjectFile"> | string
    type?: EnumFileTypeFilter<"ProjectFile"> | $Enums.FileType
    content?: StringNullableFilter<"ProjectFile"> | string | null
    size?: IntFilter<"ProjectFile"> | number
    mimeType?: StringNullableFilter<"ProjectFile"> | string | null
    projectId?: StringFilter<"ProjectFile"> | string
    createdAt?: DateTimeFilter<"ProjectFile"> | Date | string
    updatedAt?: DateTimeFilter<"ProjectFile"> | Date | string
  }

  export type ProjectMemberUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProjectMemberWhereUniqueInput
    update: XOR<ProjectMemberUpdateWithoutProjectInput, ProjectMemberUncheckedUpdateWithoutProjectInput>
    create: XOR<ProjectMemberCreateWithoutProjectInput, ProjectMemberUncheckedCreateWithoutProjectInput>
  }

  export type ProjectMemberUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProjectMemberWhereUniqueInput
    data: XOR<ProjectMemberUpdateWithoutProjectInput, ProjectMemberUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectMemberUpdateManyWithWhereWithoutProjectInput = {
    where: ProjectMemberScalarWhereInput
    data: XOR<ProjectMemberUpdateManyMutationInput, ProjectMemberUncheckedUpdateManyWithoutProjectInput>
  }

  export type CollaborationSessionUpsertWithWhereUniqueWithoutProjectInput = {
    where: CollaborationSessionWhereUniqueInput
    update: XOR<CollaborationSessionUpdateWithoutProjectInput, CollaborationSessionUncheckedUpdateWithoutProjectInput>
    create: XOR<CollaborationSessionCreateWithoutProjectInput, CollaborationSessionUncheckedCreateWithoutProjectInput>
  }

  export type CollaborationSessionUpdateWithWhereUniqueWithoutProjectInput = {
    where: CollaborationSessionWhereUniqueInput
    data: XOR<CollaborationSessionUpdateWithoutProjectInput, CollaborationSessionUncheckedUpdateWithoutProjectInput>
  }

  export type CollaborationSessionUpdateManyWithWhereWithoutProjectInput = {
    where: CollaborationSessionScalarWhereInput
    data: XOR<CollaborationSessionUpdateManyMutationInput, CollaborationSessionUncheckedUpdateManyWithoutProjectInput>
  }

  export type CollaborationSessionScalarWhereInput = {
    AND?: CollaborationSessionScalarWhereInput | CollaborationSessionScalarWhereInput[]
    OR?: CollaborationSessionScalarWhereInput[]
    NOT?: CollaborationSessionScalarWhereInput | CollaborationSessionScalarWhereInput[]
    id?: StringFilter<"CollaborationSession"> | string
    name?: StringFilter<"CollaborationSession"> | string
    isActive?: BoolFilter<"CollaborationSession"> | boolean
    projectId?: StringFilter<"CollaborationSession"> | string
    createdAt?: DateTimeFilter<"CollaborationSession"> | Date | string
    updatedAt?: DateTimeFilter<"CollaborationSession"> | Date | string
    endedAt?: DateTimeNullableFilter<"CollaborationSession"> | Date | string | null
  }

  export type AiChatSessionUpsertWithWhereUniqueWithoutProjectInput = {
    where: AiChatSessionWhereUniqueInput
    update: XOR<AiChatSessionUpdateWithoutProjectInput, AiChatSessionUncheckedUpdateWithoutProjectInput>
    create: XOR<AiChatSessionCreateWithoutProjectInput, AiChatSessionUncheckedCreateWithoutProjectInput>
  }

  export type AiChatSessionUpdateWithWhereUniqueWithoutProjectInput = {
    where: AiChatSessionWhereUniqueInput
    data: XOR<AiChatSessionUpdateWithoutProjectInput, AiChatSessionUncheckedUpdateWithoutProjectInput>
  }

  export type AiChatSessionUpdateManyWithWhereWithoutProjectInput = {
    where: AiChatSessionScalarWhereInput
    data: XOR<AiChatSessionUpdateManyMutationInput, AiChatSessionUncheckedUpdateManyWithoutProjectInput>
  }

  export type GitRepositoryUpsertWithoutProjectInput = {
    update: XOR<GitRepositoryUpdateWithoutProjectInput, GitRepositoryUncheckedUpdateWithoutProjectInput>
    create: XOR<GitRepositoryCreateWithoutProjectInput, GitRepositoryUncheckedCreateWithoutProjectInput>
    where?: GitRepositoryWhereInput
  }

  export type GitRepositoryUpdateToOneWithWhereWithoutProjectInput = {
    where?: GitRepositoryWhereInput
    data: XOR<GitRepositoryUpdateWithoutProjectInput, GitRepositoryUncheckedUpdateWithoutProjectInput>
  }

  export type GitRepositoryUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    branch?: StringFieldUpdateOperationsInput | string
    lastSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncStatus?: EnumSyncStatusFieldUpdateOperationsInput | $Enums.SyncStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commits?: GitCommitUpdateManyWithoutRepositoryNestedInput
  }

  export type GitRepositoryUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    branch?: StringFieldUpdateOperationsInput | string
    lastSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncStatus?: EnumSyncStatusFieldUpdateOperationsInput | $Enums.SyncStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commits?: GitCommitUncheckedUpdateManyWithoutRepositoryNestedInput
  }

  export type UserCreateWithoutMembershipsInput = {
    id?: string
    email: string
    username: string
    name?: string | null
    avatar?: string | null
    githubId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    image?: string | null
    emailVerified?: Date | string | null
    ownedProjects?: ProjectCreateNestedManyWithoutOwnerInput
    aiSessions?: AiChatSessionCreateNestedManyWithoutUserInput
    fileActivities?: FileActivityCreateNestedManyWithoutUserInput
    sessionParticipations?: SessionParticipantCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMembershipsInput = {
    id?: string
    email: string
    username: string
    name?: string | null
    avatar?: string | null
    githubId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    image?: string | null
    emailVerified?: Date | string | null
    ownedProjects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    aiSessions?: AiChatSessionUncheckedCreateNestedManyWithoutUserInput
    fileActivities?: FileActivityUncheckedCreateNestedManyWithoutUserInput
    sessionParticipations?: SessionParticipantUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMembershipsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMembershipsInput, UserUncheckedCreateWithoutMembershipsInput>
  }

  export type ProjectCreateWithoutMembersInput = {
    id?: string
    name: string
    description?: string | null
    visibility?: $Enums.ProjectVisibility
    repositoryUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutOwnedProjectsInput
    files?: ProjectFileCreateNestedManyWithoutProjectInput
    sessions?: CollaborationSessionCreateNestedManyWithoutProjectInput
    aiSessions?: AiChatSessionCreateNestedManyWithoutProjectInput
    gitRepository?: GitRepositoryCreateNestedOneWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutMembersInput = {
    id?: string
    name: string
    description?: string | null
    visibility?: $Enums.ProjectVisibility
    repositoryUrl?: string | null
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
    sessions?: CollaborationSessionUncheckedCreateNestedManyWithoutProjectInput
    aiSessions?: AiChatSessionUncheckedCreateNestedManyWithoutProjectInput
    gitRepository?: GitRepositoryUncheckedCreateNestedOneWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutMembersInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutMembersInput, ProjectUncheckedCreateWithoutMembersInput>
  }

  export type UserUpsertWithoutMembershipsInput = {
    update: XOR<UserUpdateWithoutMembershipsInput, UserUncheckedUpdateWithoutMembershipsInput>
    create: XOR<UserCreateWithoutMembershipsInput, UserUncheckedCreateWithoutMembershipsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMembershipsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMembershipsInput, UserUncheckedUpdateWithoutMembershipsInput>
  }

  export type UserUpdateWithoutMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownedProjects?: ProjectUpdateManyWithoutOwnerNestedInput
    aiSessions?: AiChatSessionUpdateManyWithoutUserNestedInput
    fileActivities?: FileActivityUpdateManyWithoutUserNestedInput
    sessionParticipations?: SessionParticipantUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownedProjects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    aiSessions?: AiChatSessionUncheckedUpdateManyWithoutUserNestedInput
    fileActivities?: FileActivityUncheckedUpdateManyWithoutUserNestedInput
    sessionParticipations?: SessionParticipantUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProjectUpsertWithoutMembersInput = {
    update: XOR<ProjectUpdateWithoutMembersInput, ProjectUncheckedUpdateWithoutMembersInput>
    create: XOR<ProjectCreateWithoutMembersInput, ProjectUncheckedCreateWithoutMembersInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutMembersInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutMembersInput, ProjectUncheckedUpdateWithoutMembersInput>
  }

  export type ProjectUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: EnumProjectVisibilityFieldUpdateOperationsInput | $Enums.ProjectVisibility
    repositoryUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutOwnedProjectsNestedInput
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
    sessions?: CollaborationSessionUpdateManyWithoutProjectNestedInput
    aiSessions?: AiChatSessionUpdateManyWithoutProjectNestedInput
    gitRepository?: GitRepositoryUpdateOneWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: EnumProjectVisibilityFieldUpdateOperationsInput | $Enums.ProjectVisibility
    repositoryUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
    sessions?: CollaborationSessionUncheckedUpdateManyWithoutProjectNestedInput
    aiSessions?: AiChatSessionUncheckedUpdateManyWithoutProjectNestedInput
    gitRepository?: GitRepositoryUncheckedUpdateOneWithoutProjectNestedInput
  }

  export type ProjectCreateWithoutFilesInput = {
    id?: string
    name: string
    description?: string | null
    visibility?: $Enums.ProjectVisibility
    repositoryUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutOwnedProjectsInput
    members?: ProjectMemberCreateNestedManyWithoutProjectInput
    sessions?: CollaborationSessionCreateNestedManyWithoutProjectInput
    aiSessions?: AiChatSessionCreateNestedManyWithoutProjectInput
    gitRepository?: GitRepositoryCreateNestedOneWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutFilesInput = {
    id?: string
    name: string
    description?: string | null
    visibility?: $Enums.ProjectVisibility
    repositoryUrl?: string | null
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: ProjectMemberUncheckedCreateNestedManyWithoutProjectInput
    sessions?: CollaborationSessionUncheckedCreateNestedManyWithoutProjectInput
    aiSessions?: AiChatSessionUncheckedCreateNestedManyWithoutProjectInput
    gitRepository?: GitRepositoryUncheckedCreateNestedOneWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutFilesInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
  }

  export type FileActivityCreateWithoutFileInput = {
    id?: string
    action: $Enums.FileAction
    changes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutFileActivitiesInput
  }

  export type FileActivityUncheckedCreateWithoutFileInput = {
    id?: string
    action: $Enums.FileAction
    changes?: NullableJsonNullValueInput | InputJsonValue
    userId: string
    createdAt?: Date | string
  }

  export type FileActivityCreateOrConnectWithoutFileInput = {
    where: FileActivityWhereUniqueInput
    create: XOR<FileActivityCreateWithoutFileInput, FileActivityUncheckedCreateWithoutFileInput>
  }

  export type FileActivityCreateManyFileInputEnvelope = {
    data: FileActivityCreateManyFileInput | FileActivityCreateManyFileInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithoutFilesInput = {
    update: XOR<ProjectUpdateWithoutFilesInput, ProjectUncheckedUpdateWithoutFilesInput>
    create: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutFilesInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutFilesInput, ProjectUncheckedUpdateWithoutFilesInput>
  }

  export type ProjectUpdateWithoutFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: EnumProjectVisibilityFieldUpdateOperationsInput | $Enums.ProjectVisibility
    repositoryUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutOwnedProjectsNestedInput
    members?: ProjectMemberUpdateManyWithoutProjectNestedInput
    sessions?: CollaborationSessionUpdateManyWithoutProjectNestedInput
    aiSessions?: AiChatSessionUpdateManyWithoutProjectNestedInput
    gitRepository?: GitRepositoryUpdateOneWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: EnumProjectVisibilityFieldUpdateOperationsInput | $Enums.ProjectVisibility
    repositoryUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: ProjectMemberUncheckedUpdateManyWithoutProjectNestedInput
    sessions?: CollaborationSessionUncheckedUpdateManyWithoutProjectNestedInput
    aiSessions?: AiChatSessionUncheckedUpdateManyWithoutProjectNestedInput
    gitRepository?: GitRepositoryUncheckedUpdateOneWithoutProjectNestedInput
  }

  export type FileActivityUpsertWithWhereUniqueWithoutFileInput = {
    where: FileActivityWhereUniqueInput
    update: XOR<FileActivityUpdateWithoutFileInput, FileActivityUncheckedUpdateWithoutFileInput>
    create: XOR<FileActivityCreateWithoutFileInput, FileActivityUncheckedCreateWithoutFileInput>
  }

  export type FileActivityUpdateWithWhereUniqueWithoutFileInput = {
    where: FileActivityWhereUniqueInput
    data: XOR<FileActivityUpdateWithoutFileInput, FileActivityUncheckedUpdateWithoutFileInput>
  }

  export type FileActivityUpdateManyWithWhereWithoutFileInput = {
    where: FileActivityScalarWhereInput
    data: XOR<FileActivityUpdateManyMutationInput, FileActivityUncheckedUpdateManyWithoutFileInput>
  }

  export type ProjectFileCreateWithoutActivitiesInput = {
    id?: string
    path: string
    name: string
    type?: $Enums.FileType
    content?: string | null
    size?: number
    mimeType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutFilesInput
  }

  export type ProjectFileUncheckedCreateWithoutActivitiesInput = {
    id?: string
    path: string
    name: string
    type?: $Enums.FileType
    content?: string | null
    size?: number
    mimeType?: string | null
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectFileCreateOrConnectWithoutActivitiesInput = {
    where: ProjectFileWhereUniqueInput
    create: XOR<ProjectFileCreateWithoutActivitiesInput, ProjectFileUncheckedCreateWithoutActivitiesInput>
  }

  export type UserCreateWithoutFileActivitiesInput = {
    id?: string
    email: string
    username: string
    name?: string | null
    avatar?: string | null
    githubId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    image?: string | null
    emailVerified?: Date | string | null
    ownedProjects?: ProjectCreateNestedManyWithoutOwnerInput
    memberships?: ProjectMemberCreateNestedManyWithoutUserInput
    aiSessions?: AiChatSessionCreateNestedManyWithoutUserInput
    sessionParticipations?: SessionParticipantCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutFileActivitiesInput = {
    id?: string
    email: string
    username: string
    name?: string | null
    avatar?: string | null
    githubId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    image?: string | null
    emailVerified?: Date | string | null
    ownedProjects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    memberships?: ProjectMemberUncheckedCreateNestedManyWithoutUserInput
    aiSessions?: AiChatSessionUncheckedCreateNestedManyWithoutUserInput
    sessionParticipations?: SessionParticipantUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutFileActivitiesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFileActivitiesInput, UserUncheckedCreateWithoutFileActivitiesInput>
  }

  export type ProjectFileUpsertWithoutActivitiesInput = {
    update: XOR<ProjectFileUpdateWithoutActivitiesInput, ProjectFileUncheckedUpdateWithoutActivitiesInput>
    create: XOR<ProjectFileCreateWithoutActivitiesInput, ProjectFileUncheckedCreateWithoutActivitiesInput>
    where?: ProjectFileWhereInput
  }

  export type ProjectFileUpdateToOneWithWhereWithoutActivitiesInput = {
    where?: ProjectFileWhereInput
    data: XOR<ProjectFileUpdateWithoutActivitiesInput, ProjectFileUncheckedUpdateWithoutActivitiesInput>
  }

  export type ProjectFileUpdateWithoutActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumFileTypeFieldUpdateOperationsInput | $Enums.FileType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutFilesNestedInput
  }

  export type ProjectFileUncheckedUpdateWithoutActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumFileTypeFieldUpdateOperationsInput | $Enums.FileType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutFileActivitiesInput = {
    update: XOR<UserUpdateWithoutFileActivitiesInput, UserUncheckedUpdateWithoutFileActivitiesInput>
    create: XOR<UserCreateWithoutFileActivitiesInput, UserUncheckedCreateWithoutFileActivitiesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFileActivitiesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFileActivitiesInput, UserUncheckedUpdateWithoutFileActivitiesInput>
  }

  export type UserUpdateWithoutFileActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownedProjects?: ProjectUpdateManyWithoutOwnerNestedInput
    memberships?: ProjectMemberUpdateManyWithoutUserNestedInput
    aiSessions?: AiChatSessionUpdateManyWithoutUserNestedInput
    sessionParticipations?: SessionParticipantUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFileActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownedProjects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    memberships?: ProjectMemberUncheckedUpdateManyWithoutUserNestedInput
    aiSessions?: AiChatSessionUncheckedUpdateManyWithoutUserNestedInput
    sessionParticipations?: SessionParticipantUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProjectCreateWithoutSessionsInput = {
    id?: string
    name: string
    description?: string | null
    visibility?: $Enums.ProjectVisibility
    repositoryUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutOwnedProjectsInput
    files?: ProjectFileCreateNestedManyWithoutProjectInput
    members?: ProjectMemberCreateNestedManyWithoutProjectInput
    aiSessions?: AiChatSessionCreateNestedManyWithoutProjectInput
    gitRepository?: GitRepositoryCreateNestedOneWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutSessionsInput = {
    id?: string
    name: string
    description?: string | null
    visibility?: $Enums.ProjectVisibility
    repositoryUrl?: string | null
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
    members?: ProjectMemberUncheckedCreateNestedManyWithoutProjectInput
    aiSessions?: AiChatSessionUncheckedCreateNestedManyWithoutProjectInput
    gitRepository?: GitRepositoryUncheckedCreateNestedOneWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutSessionsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutSessionsInput, ProjectUncheckedCreateWithoutSessionsInput>
  }

  export type SessionParticipantCreateWithoutSessionInput = {
    id?: string
    cursor?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    joinedAt?: Date | string
    leftAt?: Date | string | null
    user: UserCreateNestedOneWithoutSessionParticipationsInput
  }

  export type SessionParticipantUncheckedCreateWithoutSessionInput = {
    id?: string
    userId: string
    cursor?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    joinedAt?: Date | string
    leftAt?: Date | string | null
  }

  export type SessionParticipantCreateOrConnectWithoutSessionInput = {
    where: SessionParticipantWhereUniqueInput
    create: XOR<SessionParticipantCreateWithoutSessionInput, SessionParticipantUncheckedCreateWithoutSessionInput>
  }

  export type SessionParticipantCreateManySessionInputEnvelope = {
    data: SessionParticipantCreateManySessionInput | SessionParticipantCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithoutSessionsInput = {
    update: XOR<ProjectUpdateWithoutSessionsInput, ProjectUncheckedUpdateWithoutSessionsInput>
    create: XOR<ProjectCreateWithoutSessionsInput, ProjectUncheckedCreateWithoutSessionsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutSessionsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutSessionsInput, ProjectUncheckedUpdateWithoutSessionsInput>
  }

  export type ProjectUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: EnumProjectVisibilityFieldUpdateOperationsInput | $Enums.ProjectVisibility
    repositoryUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutOwnedProjectsNestedInput
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
    members?: ProjectMemberUpdateManyWithoutProjectNestedInput
    aiSessions?: AiChatSessionUpdateManyWithoutProjectNestedInput
    gitRepository?: GitRepositoryUpdateOneWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: EnumProjectVisibilityFieldUpdateOperationsInput | $Enums.ProjectVisibility
    repositoryUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
    members?: ProjectMemberUncheckedUpdateManyWithoutProjectNestedInput
    aiSessions?: AiChatSessionUncheckedUpdateManyWithoutProjectNestedInput
    gitRepository?: GitRepositoryUncheckedUpdateOneWithoutProjectNestedInput
  }

  export type SessionParticipantUpsertWithWhereUniqueWithoutSessionInput = {
    where: SessionParticipantWhereUniqueInput
    update: XOR<SessionParticipantUpdateWithoutSessionInput, SessionParticipantUncheckedUpdateWithoutSessionInput>
    create: XOR<SessionParticipantCreateWithoutSessionInput, SessionParticipantUncheckedCreateWithoutSessionInput>
  }

  export type SessionParticipantUpdateWithWhereUniqueWithoutSessionInput = {
    where: SessionParticipantWhereUniqueInput
    data: XOR<SessionParticipantUpdateWithoutSessionInput, SessionParticipantUncheckedUpdateWithoutSessionInput>
  }

  export type SessionParticipantUpdateManyWithWhereWithoutSessionInput = {
    where: SessionParticipantScalarWhereInput
    data: XOR<SessionParticipantUpdateManyMutationInput, SessionParticipantUncheckedUpdateManyWithoutSessionInput>
  }

  export type CollaborationSessionCreateWithoutParticipantsInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    endedAt?: Date | string | null
    project: ProjectCreateNestedOneWithoutSessionsInput
  }

  export type CollaborationSessionUncheckedCreateWithoutParticipantsInput = {
    id?: string
    name: string
    isActive?: boolean
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    endedAt?: Date | string | null
  }

  export type CollaborationSessionCreateOrConnectWithoutParticipantsInput = {
    where: CollaborationSessionWhereUniqueInput
    create: XOR<CollaborationSessionCreateWithoutParticipantsInput, CollaborationSessionUncheckedCreateWithoutParticipantsInput>
  }

  export type UserCreateWithoutSessionParticipationsInput = {
    id?: string
    email: string
    username: string
    name?: string | null
    avatar?: string | null
    githubId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    image?: string | null
    emailVerified?: Date | string | null
    ownedProjects?: ProjectCreateNestedManyWithoutOwnerInput
    memberships?: ProjectMemberCreateNestedManyWithoutUserInput
    aiSessions?: AiChatSessionCreateNestedManyWithoutUserInput
    fileActivities?: FileActivityCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionParticipationsInput = {
    id?: string
    email: string
    username: string
    name?: string | null
    avatar?: string | null
    githubId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    image?: string | null
    emailVerified?: Date | string | null
    ownedProjects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    memberships?: ProjectMemberUncheckedCreateNestedManyWithoutUserInput
    aiSessions?: AiChatSessionUncheckedCreateNestedManyWithoutUserInput
    fileActivities?: FileActivityUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionParticipationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionParticipationsInput, UserUncheckedCreateWithoutSessionParticipationsInput>
  }

  export type CollaborationSessionUpsertWithoutParticipantsInput = {
    update: XOR<CollaborationSessionUpdateWithoutParticipantsInput, CollaborationSessionUncheckedUpdateWithoutParticipantsInput>
    create: XOR<CollaborationSessionCreateWithoutParticipantsInput, CollaborationSessionUncheckedCreateWithoutParticipantsInput>
    where?: CollaborationSessionWhereInput
  }

  export type CollaborationSessionUpdateToOneWithWhereWithoutParticipantsInput = {
    where?: CollaborationSessionWhereInput
    data: XOR<CollaborationSessionUpdateWithoutParticipantsInput, CollaborationSessionUncheckedUpdateWithoutParticipantsInput>
  }

  export type CollaborationSessionUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    project?: ProjectUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type CollaborationSessionUncheckedUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUpsertWithoutSessionParticipationsInput = {
    update: XOR<UserUpdateWithoutSessionParticipationsInput, UserUncheckedUpdateWithoutSessionParticipationsInput>
    create: XOR<UserCreateWithoutSessionParticipationsInput, UserUncheckedCreateWithoutSessionParticipationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionParticipationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionParticipationsInput, UserUncheckedUpdateWithoutSessionParticipationsInput>
  }

  export type UserUpdateWithoutSessionParticipationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownedProjects?: ProjectUpdateManyWithoutOwnerNestedInput
    memberships?: ProjectMemberUpdateManyWithoutUserNestedInput
    aiSessions?: AiChatSessionUpdateManyWithoutUserNestedInput
    fileActivities?: FileActivityUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionParticipationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownedProjects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    memberships?: ProjectMemberUncheckedUpdateManyWithoutUserNestedInput
    aiSessions?: AiChatSessionUncheckedUpdateManyWithoutUserNestedInput
    fileActivities?: FileActivityUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAiSessionsInput = {
    id?: string
    email: string
    username: string
    name?: string | null
    avatar?: string | null
    githubId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    image?: string | null
    emailVerified?: Date | string | null
    ownedProjects?: ProjectCreateNestedManyWithoutOwnerInput
    memberships?: ProjectMemberCreateNestedManyWithoutUserInput
    fileActivities?: FileActivityCreateNestedManyWithoutUserInput
    sessionParticipations?: SessionParticipantCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAiSessionsInput = {
    id?: string
    email: string
    username: string
    name?: string | null
    avatar?: string | null
    githubId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    image?: string | null
    emailVerified?: Date | string | null
    ownedProjects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    memberships?: ProjectMemberUncheckedCreateNestedManyWithoutUserInput
    fileActivities?: FileActivityUncheckedCreateNestedManyWithoutUserInput
    sessionParticipations?: SessionParticipantUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAiSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAiSessionsInput, UserUncheckedCreateWithoutAiSessionsInput>
  }

  export type ProjectCreateWithoutAiSessionsInput = {
    id?: string
    name: string
    description?: string | null
    visibility?: $Enums.ProjectVisibility
    repositoryUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutOwnedProjectsInput
    files?: ProjectFileCreateNestedManyWithoutProjectInput
    members?: ProjectMemberCreateNestedManyWithoutProjectInput
    sessions?: CollaborationSessionCreateNestedManyWithoutProjectInput
    gitRepository?: GitRepositoryCreateNestedOneWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutAiSessionsInput = {
    id?: string
    name: string
    description?: string | null
    visibility?: $Enums.ProjectVisibility
    repositoryUrl?: string | null
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
    members?: ProjectMemberUncheckedCreateNestedManyWithoutProjectInput
    sessions?: CollaborationSessionUncheckedCreateNestedManyWithoutProjectInput
    gitRepository?: GitRepositoryUncheckedCreateNestedOneWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutAiSessionsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutAiSessionsInput, ProjectUncheckedCreateWithoutAiSessionsInput>
  }

  export type AiMessageCreateWithoutSessionInput = {
    id?: string
    role: $Enums.MessageRole
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AiMessageUncheckedCreateWithoutSessionInput = {
    id?: string
    role: $Enums.MessageRole
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AiMessageCreateOrConnectWithoutSessionInput = {
    where: AiMessageWhereUniqueInput
    create: XOR<AiMessageCreateWithoutSessionInput, AiMessageUncheckedCreateWithoutSessionInput>
  }

  export type AiMessageCreateManySessionInputEnvelope = {
    data: AiMessageCreateManySessionInput | AiMessageCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutAiSessionsInput = {
    update: XOR<UserUpdateWithoutAiSessionsInput, UserUncheckedUpdateWithoutAiSessionsInput>
    create: XOR<UserCreateWithoutAiSessionsInput, UserUncheckedCreateWithoutAiSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAiSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAiSessionsInput, UserUncheckedUpdateWithoutAiSessionsInput>
  }

  export type UserUpdateWithoutAiSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownedProjects?: ProjectUpdateManyWithoutOwnerNestedInput
    memberships?: ProjectMemberUpdateManyWithoutUserNestedInput
    fileActivities?: FileActivityUpdateManyWithoutUserNestedInput
    sessionParticipations?: SessionParticipantUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAiSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    githubId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ownedProjects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    memberships?: ProjectMemberUncheckedUpdateManyWithoutUserNestedInput
    fileActivities?: FileActivityUncheckedUpdateManyWithoutUserNestedInput
    sessionParticipations?: SessionParticipantUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProjectUpsertWithoutAiSessionsInput = {
    update: XOR<ProjectUpdateWithoutAiSessionsInput, ProjectUncheckedUpdateWithoutAiSessionsInput>
    create: XOR<ProjectCreateWithoutAiSessionsInput, ProjectUncheckedCreateWithoutAiSessionsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutAiSessionsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutAiSessionsInput, ProjectUncheckedUpdateWithoutAiSessionsInput>
  }

  export type ProjectUpdateWithoutAiSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: EnumProjectVisibilityFieldUpdateOperationsInput | $Enums.ProjectVisibility
    repositoryUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutOwnedProjectsNestedInput
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
    members?: ProjectMemberUpdateManyWithoutProjectNestedInput
    sessions?: CollaborationSessionUpdateManyWithoutProjectNestedInput
    gitRepository?: GitRepositoryUpdateOneWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutAiSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: EnumProjectVisibilityFieldUpdateOperationsInput | $Enums.ProjectVisibility
    repositoryUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
    members?: ProjectMemberUncheckedUpdateManyWithoutProjectNestedInput
    sessions?: CollaborationSessionUncheckedUpdateManyWithoutProjectNestedInput
    gitRepository?: GitRepositoryUncheckedUpdateOneWithoutProjectNestedInput
  }

  export type AiMessageUpsertWithWhereUniqueWithoutSessionInput = {
    where: AiMessageWhereUniqueInput
    update: XOR<AiMessageUpdateWithoutSessionInput, AiMessageUncheckedUpdateWithoutSessionInput>
    create: XOR<AiMessageCreateWithoutSessionInput, AiMessageUncheckedCreateWithoutSessionInput>
  }

  export type AiMessageUpdateWithWhereUniqueWithoutSessionInput = {
    where: AiMessageWhereUniqueInput
    data: XOR<AiMessageUpdateWithoutSessionInput, AiMessageUncheckedUpdateWithoutSessionInput>
  }

  export type AiMessageUpdateManyWithWhereWithoutSessionInput = {
    where: AiMessageScalarWhereInput
    data: XOR<AiMessageUpdateManyMutationInput, AiMessageUncheckedUpdateManyWithoutSessionInput>
  }

  export type AiMessageScalarWhereInput = {
    AND?: AiMessageScalarWhereInput | AiMessageScalarWhereInput[]
    OR?: AiMessageScalarWhereInput[]
    NOT?: AiMessageScalarWhereInput | AiMessageScalarWhereInput[]
    id?: StringFilter<"AiMessage"> | string
    role?: EnumMessageRoleFilter<"AiMessage"> | $Enums.MessageRole
    content?: StringFilter<"AiMessage"> | string
    metadata?: JsonNullableFilter<"AiMessage">
    sessionId?: StringFilter<"AiMessage"> | string
    createdAt?: DateTimeFilter<"AiMessage"> | Date | string
  }

  export type AiChatSessionCreateWithoutMessagesInput = {
    id?: string
    title?: string | null
    context?: $Enums.AiContext
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAiSessionsInput
    project?: ProjectCreateNestedOneWithoutAiSessionsInput
  }

  export type AiChatSessionUncheckedCreateWithoutMessagesInput = {
    id?: string
    title?: string | null
    context?: $Enums.AiContext
    userId: string
    projectId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiChatSessionCreateOrConnectWithoutMessagesInput = {
    where: AiChatSessionWhereUniqueInput
    create: XOR<AiChatSessionCreateWithoutMessagesInput, AiChatSessionUncheckedCreateWithoutMessagesInput>
  }

  export type AiChatSessionUpsertWithoutMessagesInput = {
    update: XOR<AiChatSessionUpdateWithoutMessagesInput, AiChatSessionUncheckedUpdateWithoutMessagesInput>
    create: XOR<AiChatSessionCreateWithoutMessagesInput, AiChatSessionUncheckedCreateWithoutMessagesInput>
    where?: AiChatSessionWhereInput
  }

  export type AiChatSessionUpdateToOneWithWhereWithoutMessagesInput = {
    where?: AiChatSessionWhereInput
    data: XOR<AiChatSessionUpdateWithoutMessagesInput, AiChatSessionUncheckedUpdateWithoutMessagesInput>
  }

  export type AiChatSessionUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    context?: EnumAiContextFieldUpdateOperationsInput | $Enums.AiContext
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAiSessionsNestedInput
    project?: ProjectUpdateOneWithoutAiSessionsNestedInput
  }

  export type AiChatSessionUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    context?: EnumAiContextFieldUpdateOperationsInput | $Enums.AiContext
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateWithoutGitRepositoryInput = {
    id?: string
    name: string
    description?: string | null
    visibility?: $Enums.ProjectVisibility
    repositoryUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutOwnedProjectsInput
    files?: ProjectFileCreateNestedManyWithoutProjectInput
    members?: ProjectMemberCreateNestedManyWithoutProjectInput
    sessions?: CollaborationSessionCreateNestedManyWithoutProjectInput
    aiSessions?: AiChatSessionCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutGitRepositoryInput = {
    id?: string
    name: string
    description?: string | null
    visibility?: $Enums.ProjectVisibility
    repositoryUrl?: string | null
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
    members?: ProjectMemberUncheckedCreateNestedManyWithoutProjectInput
    sessions?: CollaborationSessionUncheckedCreateNestedManyWithoutProjectInput
    aiSessions?: AiChatSessionUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutGitRepositoryInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutGitRepositoryInput, ProjectUncheckedCreateWithoutGitRepositoryInput>
  }

  export type GitCommitCreateWithoutRepositoryInput = {
    id?: string
    hash: string
    message: string
    author: string
    authorEmail: string
    committedAt: Date | string
    createdAt?: Date | string
  }

  export type GitCommitUncheckedCreateWithoutRepositoryInput = {
    id?: string
    hash: string
    message: string
    author: string
    authorEmail: string
    committedAt: Date | string
    createdAt?: Date | string
  }

  export type GitCommitCreateOrConnectWithoutRepositoryInput = {
    where: GitCommitWhereUniqueInput
    create: XOR<GitCommitCreateWithoutRepositoryInput, GitCommitUncheckedCreateWithoutRepositoryInput>
  }

  export type GitCommitCreateManyRepositoryInputEnvelope = {
    data: GitCommitCreateManyRepositoryInput | GitCommitCreateManyRepositoryInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithoutGitRepositoryInput = {
    update: XOR<ProjectUpdateWithoutGitRepositoryInput, ProjectUncheckedUpdateWithoutGitRepositoryInput>
    create: XOR<ProjectCreateWithoutGitRepositoryInput, ProjectUncheckedCreateWithoutGitRepositoryInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutGitRepositoryInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutGitRepositoryInput, ProjectUncheckedUpdateWithoutGitRepositoryInput>
  }

  export type ProjectUpdateWithoutGitRepositoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: EnumProjectVisibilityFieldUpdateOperationsInput | $Enums.ProjectVisibility
    repositoryUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutOwnedProjectsNestedInput
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
    members?: ProjectMemberUpdateManyWithoutProjectNestedInput
    sessions?: CollaborationSessionUpdateManyWithoutProjectNestedInput
    aiSessions?: AiChatSessionUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutGitRepositoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: EnumProjectVisibilityFieldUpdateOperationsInput | $Enums.ProjectVisibility
    repositoryUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
    members?: ProjectMemberUncheckedUpdateManyWithoutProjectNestedInput
    sessions?: CollaborationSessionUncheckedUpdateManyWithoutProjectNestedInput
    aiSessions?: AiChatSessionUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type GitCommitUpsertWithWhereUniqueWithoutRepositoryInput = {
    where: GitCommitWhereUniqueInput
    update: XOR<GitCommitUpdateWithoutRepositoryInput, GitCommitUncheckedUpdateWithoutRepositoryInput>
    create: XOR<GitCommitCreateWithoutRepositoryInput, GitCommitUncheckedCreateWithoutRepositoryInput>
  }

  export type GitCommitUpdateWithWhereUniqueWithoutRepositoryInput = {
    where: GitCommitWhereUniqueInput
    data: XOR<GitCommitUpdateWithoutRepositoryInput, GitCommitUncheckedUpdateWithoutRepositoryInput>
  }

  export type GitCommitUpdateManyWithWhereWithoutRepositoryInput = {
    where: GitCommitScalarWhereInput
    data: XOR<GitCommitUpdateManyMutationInput, GitCommitUncheckedUpdateManyWithoutRepositoryInput>
  }

  export type GitCommitScalarWhereInput = {
    AND?: GitCommitScalarWhereInput | GitCommitScalarWhereInput[]
    OR?: GitCommitScalarWhereInput[]
    NOT?: GitCommitScalarWhereInput | GitCommitScalarWhereInput[]
    id?: StringFilter<"GitCommit"> | string
    hash?: StringFilter<"GitCommit"> | string
    message?: StringFilter<"GitCommit"> | string
    author?: StringFilter<"GitCommit"> | string
    authorEmail?: StringFilter<"GitCommit"> | string
    repoId?: StringFilter<"GitCommit"> | string
    committedAt?: DateTimeFilter<"GitCommit"> | Date | string
    createdAt?: DateTimeFilter<"GitCommit"> | Date | string
  }

  export type GitRepositoryCreateWithoutCommitsInput = {
    id?: string
    url: string
    branch?: string
    lastSync?: Date | string | null
    syncStatus?: $Enums.SyncStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutGitRepositoryInput
  }

  export type GitRepositoryUncheckedCreateWithoutCommitsInput = {
    id?: string
    url: string
    branch?: string
    lastSync?: Date | string | null
    syncStatus?: $Enums.SyncStatus
    projectId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GitRepositoryCreateOrConnectWithoutCommitsInput = {
    where: GitRepositoryWhereUniqueInput
    create: XOR<GitRepositoryCreateWithoutCommitsInput, GitRepositoryUncheckedCreateWithoutCommitsInput>
  }

  export type GitRepositoryUpsertWithoutCommitsInput = {
    update: XOR<GitRepositoryUpdateWithoutCommitsInput, GitRepositoryUncheckedUpdateWithoutCommitsInput>
    create: XOR<GitRepositoryCreateWithoutCommitsInput, GitRepositoryUncheckedCreateWithoutCommitsInput>
    where?: GitRepositoryWhereInput
  }

  export type GitRepositoryUpdateToOneWithWhereWithoutCommitsInput = {
    where?: GitRepositoryWhereInput
    data: XOR<GitRepositoryUpdateWithoutCommitsInput, GitRepositoryUncheckedUpdateWithoutCommitsInput>
  }

  export type GitRepositoryUpdateWithoutCommitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    branch?: StringFieldUpdateOperationsInput | string
    lastSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncStatus?: EnumSyncStatusFieldUpdateOperationsInput | $Enums.SyncStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutGitRepositoryNestedInput
  }

  export type GitRepositoryUncheckedUpdateWithoutCommitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    branch?: StringFieldUpdateOperationsInput | string
    lastSync?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    syncStatus?: EnumSyncStatusFieldUpdateOperationsInput | $Enums.SyncStatus
    projectId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateManyOwnerInput = {
    id?: string
    name: string
    description?: string | null
    visibility?: $Enums.ProjectVisibility
    repositoryUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectMemberCreateManyUserInput = {
    id?: string
    role?: $Enums.ProjectRole
    projectId: string
    joinedAt?: Date | string
  }

  export type AiChatSessionCreateManyUserInput = {
    id?: string
    title?: string | null
    context?: $Enums.AiContext
    projectId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileActivityCreateManyUserInput = {
    id?: string
    action: $Enums.FileAction
    changes?: NullableJsonNullValueInput | InputJsonValue
    fileId: string
    createdAt?: Date | string
  }

  export type SessionParticipantCreateManyUserInput = {
    id?: string
    sessionId: string
    cursor?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    joinedAt?: Date | string
    leftAt?: Date | string | null
  }

  export type AccountCreateManyUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type SessionCreateManyUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type ProjectUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: EnumProjectVisibilityFieldUpdateOperationsInput | $Enums.ProjectVisibility
    repositoryUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
    members?: ProjectMemberUpdateManyWithoutProjectNestedInput
    sessions?: CollaborationSessionUpdateManyWithoutProjectNestedInput
    aiSessions?: AiChatSessionUpdateManyWithoutProjectNestedInput
    gitRepository?: GitRepositoryUpdateOneWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: EnumProjectVisibilityFieldUpdateOperationsInput | $Enums.ProjectVisibility
    repositoryUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
    members?: ProjectMemberUncheckedUpdateManyWithoutProjectNestedInput
    sessions?: CollaborationSessionUncheckedUpdateManyWithoutProjectNestedInput
    aiSessions?: AiChatSessionUncheckedUpdateManyWithoutProjectNestedInput
    gitRepository?: GitRepositoryUncheckedUpdateOneWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    visibility?: EnumProjectVisibilityFieldUpdateOperationsInput | $Enums.ProjectVisibility
    repositoryUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectMemberUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumProjectRoleFieldUpdateOperationsInput | $Enums.ProjectRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutMembersNestedInput
  }

  export type ProjectMemberUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumProjectRoleFieldUpdateOperationsInput | $Enums.ProjectRole
    projectId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectMemberUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumProjectRoleFieldUpdateOperationsInput | $Enums.ProjectRole
    projectId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiChatSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    context?: EnumAiContextFieldUpdateOperationsInput | $Enums.AiContext
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneWithoutAiSessionsNestedInput
    messages?: AiMessageUpdateManyWithoutSessionNestedInput
  }

  export type AiChatSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    context?: EnumAiContextFieldUpdateOperationsInput | $Enums.AiContext
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: AiMessageUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type AiChatSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    context?: EnumAiContextFieldUpdateOperationsInput | $Enums.AiContext
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileActivityUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumFileActionFieldUpdateOperationsInput | $Enums.FileAction
    changes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    file?: ProjectFileUpdateOneRequiredWithoutActivitiesNestedInput
  }

  export type FileActivityUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumFileActionFieldUpdateOperationsInput | $Enums.FileAction
    changes?: NullableJsonNullValueInput | InputJsonValue
    fileId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileActivityUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumFileActionFieldUpdateOperationsInput | $Enums.FileAction
    changes?: NullableJsonNullValueInput | InputJsonValue
    fileId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionParticipantUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    cursor?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    session?: CollaborationSessionUpdateOneRequiredWithoutParticipantsNestedInput
  }

  export type SessionParticipantUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    cursor?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SessionParticipantUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    cursor?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFileCreateManyProjectInput = {
    id?: string
    path: string
    name: string
    type?: $Enums.FileType
    content?: string | null
    size?: number
    mimeType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectMemberCreateManyProjectInput = {
    id?: string
    role?: $Enums.ProjectRole
    userId: string
    joinedAt?: Date | string
  }

  export type CollaborationSessionCreateManyProjectInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    endedAt?: Date | string | null
  }

  export type AiChatSessionCreateManyProjectInput = {
    id?: string
    title?: string | null
    context?: $Enums.AiContext
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectFileUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumFileTypeFieldUpdateOperationsInput | $Enums.FileType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activities?: FileActivityUpdateManyWithoutFileNestedInput
  }

  export type ProjectFileUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumFileTypeFieldUpdateOperationsInput | $Enums.FileType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activities?: FileActivityUncheckedUpdateManyWithoutFileNestedInput
  }

  export type ProjectFileUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumFileTypeFieldUpdateOperationsInput | $Enums.FileType
    content?: NullableStringFieldUpdateOperationsInput | string | null
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectMemberUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumProjectRoleFieldUpdateOperationsInput | $Enums.ProjectRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMembershipsNestedInput
  }

  export type ProjectMemberUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumProjectRoleFieldUpdateOperationsInput | $Enums.ProjectRole
    userId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectMemberUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumProjectRoleFieldUpdateOperationsInput | $Enums.ProjectRole
    userId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollaborationSessionUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    participants?: SessionParticipantUpdateManyWithoutSessionNestedInput
  }

  export type CollaborationSessionUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    participants?: SessionParticipantUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type CollaborationSessionUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AiChatSessionUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    context?: EnumAiContextFieldUpdateOperationsInput | $Enums.AiContext
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAiSessionsNestedInput
    messages?: AiMessageUpdateManyWithoutSessionNestedInput
  }

  export type AiChatSessionUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    context?: EnumAiContextFieldUpdateOperationsInput | $Enums.AiContext
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: AiMessageUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type AiChatSessionUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    context?: EnumAiContextFieldUpdateOperationsInput | $Enums.AiContext
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileActivityCreateManyFileInput = {
    id?: string
    action: $Enums.FileAction
    changes?: NullableJsonNullValueInput | InputJsonValue
    userId: string
    createdAt?: Date | string
  }

  export type FileActivityUpdateWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumFileActionFieldUpdateOperationsInput | $Enums.FileAction
    changes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutFileActivitiesNestedInput
  }

  export type FileActivityUncheckedUpdateWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumFileActionFieldUpdateOperationsInput | $Enums.FileAction
    changes?: NullableJsonNullValueInput | InputJsonValue
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileActivityUncheckedUpdateManyWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumFileActionFieldUpdateOperationsInput | $Enums.FileAction
    changes?: NullableJsonNullValueInput | InputJsonValue
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionParticipantCreateManySessionInput = {
    id?: string
    userId: string
    cursor?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    joinedAt?: Date | string
    leftAt?: Date | string | null
  }

  export type SessionParticipantUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    cursor?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutSessionParticipationsNestedInput
  }

  export type SessionParticipantUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    cursor?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SessionParticipantUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    cursor?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AiMessageCreateManySessionInput = {
    id?: string
    role: $Enums.MessageRole
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AiMessageUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiMessageUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiMessageUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMessageRoleFieldUpdateOperationsInput | $Enums.MessageRole
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GitCommitCreateManyRepositoryInput = {
    id?: string
    hash: string
    message: string
    author: string
    authorEmail: string
    committedAt: Date | string
    createdAt?: Date | string
  }

  export type GitCommitUpdateWithoutRepositoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    authorEmail?: StringFieldUpdateOperationsInput | string
    committedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GitCommitUncheckedUpdateWithoutRepositoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    authorEmail?: StringFieldUpdateOperationsInput | string
    committedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GitCommitUncheckedUpdateManyWithoutRepositoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    hash?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    author?: StringFieldUpdateOperationsInput | string
    authorEmail?: StringFieldUpdateOperationsInput | string
    committedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}