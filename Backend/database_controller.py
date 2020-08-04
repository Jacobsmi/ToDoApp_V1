import sqlite3


class Database:
    def __init__(self, name):
        self.db_name = name

    def get_connection(self):
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            return conn
        except sqlite3.Error as e:
            print("There was a sqlite error")
            print(e)
        return None

    def insert_new_task(self, task_info):
        sql_statement = "INSERT INTO tasks(task_name) VALUES(?)"
        conn = self.get_connection()
        cur = conn.cursor()
        cur.execute(sql_statement, task_info)
        conn.commit()
        cur.close()

    def get_all_tasks(self):
        conn = self.get_connection()
        cur = conn.cursor()
        cur.execute("SELECT rowid,* FROM tasks")
        rows = cur.fetchall()
        return list(rows)

    def delete_task(self, id):
        sql_statement = "DELETE FROM tasks WHERE rowid = ?"
        conn = self.get_connection()
        cur = conn.cursor()
        cur.execute(sql_statement, [id])
        conn.commit()
        cur.execute('VACUUM')
        conn.commit()
        cur.close()

    def update_completed(self, task_info):
        sql_statement = "UPDATE tasks SET completed = ? WHERE rowid = ?"
        conn = self.get_connection()
        cur = conn.cursor()
        cur.execute(sql_statement, task_info)
        conn.commit()
        cur.close()
