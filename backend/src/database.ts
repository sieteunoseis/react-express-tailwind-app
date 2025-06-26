import sqlite3 from 'sqlite3';
import fs from 'fs';
import { ConnectionRecord, DatabaseError } from './types';
import { Logger } from './logger';
import bcrypt from 'bcrypt';

export class Database {
  private db: sqlite3.Database;
  private tableColumns: string[];

  constructor(dbPath: string, tableColumns: string[]) {
    this.tableColumns = tableColumns;
    
    // Ensure database directory exists
    const dbDir = './db';
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Initialize database connection
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        Logger.error('Failed to connect to database:', err);
        throw err;
      }
      Logger.info('Connected to SQLite database');
    });

    this.initializeSchema();
  }

  private initializeSchema(): void {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS connections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ${this.tableColumns.join(' TEXT, ')} TEXT,
        password_hash TEXT,
        selected TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(selected)
      )
    `;

    this.db.run(createTableQuery, (err) => {
      if (err) {
        Logger.error('Failed to create table:', err);
        throw err;
      }
      Logger.info('Database schema initialized');
    });
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  getAllConnections(): Promise<ConnectionRecord[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT id, name, hostname, username, version, selected, created_at, updated_at FROM connections',
        [],
        (err, rows) => {
          if (err) {
            Logger.error('Failed to fetch connections:', err);
            reject(err);
          } else {
            Logger.debug(`Retrieved ${rows.length} connections`);
            resolve(rows as ConnectionRecord[]);
          }
        }
      );
    });
  }

  getConnectionById(id: number): Promise<ConnectionRecord | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT id, name, hostname, username, version, selected, created_at, updated_at FROM connections WHERE id = ?',
        [id],
        (err, row) => {
          if (err) {
            Logger.error('Failed to fetch connection by ID:', err);
            reject(err);
          } else {
            Logger.debug(`Retrieved connection with ID: ${id}`);
            resolve(row as ConnectionRecord || null);
          }
        }
      );
    });
  }

  getSelectedConnection(): Promise<ConnectionRecord | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT id, name, hostname, username, version, selected, created_at, updated_at FROM connections WHERE selected = "YES"',
        [],
        (err, row) => {
          if (err) {
            Logger.error('Failed to fetch selected connection:', err);
            reject(err);
          } else {
            Logger.debug('Retrieved selected connection');
            resolve(row as ConnectionRecord || null);
          }
        }
      );
    });
  }

  async createConnection(data: Omit<ConnectionRecord, 'id'>): Promise<number> {
    const hashedPassword = await this.hashPassword(data.password);
    
    return new Promise((resolve, reject) => {
      // Check if this is the first entry
      this.db.get('SELECT COUNT(*) AS count FROM connections', [], (err, row: any) => {
        if (err) {
          Logger.error('Failed to check connection count:', err);
          reject(err);
          return;
        }

        const isFirstEntry = row.count === 0;
        const selectedValue = isFirstEntry ? 'YES' : null;

        const insertQuery = `
          INSERT INTO connections (${this.tableColumns.join(', ')}, password_hash, selected) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        this.db.run(
          insertQuery,
          [data.name, data.hostname, data.username, data.version, hashedPassword, selectedValue],
          function (err) {
            if (err) {
              Logger.error('Failed to create connection:', err);
              reject(err);
            } else {
              Logger.info(`Created connection with ID: ${this.lastID}`);
              resolve(this.lastID);
            }
          }
        );
      });
    });
  }

  deleteConnection(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM connections WHERE id = ?', [id], function (err) {
        if (err) {
          Logger.error('Failed to delete connection:', err);
          reject(err);
        } else {
          Logger.info(`Deleted connection with ID: ${id}`);
          resolve();
        }
      });
    });
  }

  selectConnection(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run('UPDATE connections SET selected = NULL', [], (err) => {
          if (err) {
            Logger.error('Failed to clear selected connections:', err);
            reject(err);
            return;
          }
        });

        this.db.run('UPDATE connections SET selected = "YES" WHERE id = ?', [id], function (err) {
          if (err) {
            Logger.error('Failed to select connection:', err);
            reject(err);
          } else {
            Logger.info(`Selected connection with ID: ${id}`);
            resolve();
          }
        });
      });
    });
  }

  close(): void {
    this.db.close((err) => {
      if (err) {
        Logger.error('Failed to close database:', err);
      } else {
        Logger.info('Database connection closed');
      }
    });
  }
}