import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { QueryResultRow, Pool } from 'pg';

export interface Queryable {
    query<T extends QueryResultRow = any>(text: string, params?: unknown[]): Promise<T[]>;
}

@Injectable()
export class DatabaseService implements Queryable, OnModuleDestroy {

    constructor(@InjectPinoLogger(DatabaseService.name) private readonly logger: PinoLogger) { }

    private readonly pool = new Pool({
        host: process.env.DB_HOST ?? "localhost",
        port: Number(process.env.DB_PORT ?? 5432),
        database: process.env.DB_NAME ?? "subscriptions_test",
        user: process.env.DB_USER ?? "postgres",
        password: process.env.DB_PASSWORD ?? "postgres",
        max: 10,
    });


    async query<T extends QueryResultRow = any>(text: string, params?: unknown[]): Promise<T[]> {
        const start = Date.now();
        const { rows } = await this.pool.query<T>(text, params);
        const ms = Date.now() - start;
        if (ms > 200) this.logger.warn(`slow query (${ms}ms): ${text.slice(0, 80)}`);
        return rows;
    }

    async tx<T>(fn: (q: Queryable) => Promise<T>): Promise<T> {
        const client = await this.pool.connect();
        const q: Queryable = { query: async (text, params) => (await client.query(text, params)).rows };
        try {
            await client.query('BEGIN');
            const result = await fn(q);
            await client.query('COMMIT');
            return result;
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }

    onModuleDestroy() {
        return this.pool.end();
    }

}


// ? Usage
// @Injectable()
// export class ExpensesRepository {
//     constructor(private db: DatabaseService) { }

//     insertExpense(input: NewExpense, q: Queryable = this.db) {
//         return q.query<ExpenseRow>(
//             `INSERT INTO expenses (group_id, paid_by, amount) VALUES ($1, $2, $3) RETURNING *`,
//             [input.groupId, input.paidBy, input.amount],
//         );
//     }

//     insertSplits(expenseId: string, splits: NewSplit[], q: Queryable = this.db) { /* ... */ }
// }