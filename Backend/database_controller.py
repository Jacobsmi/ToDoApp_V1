import sqlite3


class Database:
    def __init__(self, name):
        self.db_name = name
        self.setup_db()
    
    def get_connection(self):
        try:
            conn = sqlite3.connect(self.db_name)
            return conn
        except sqlite3.Error as e:
            print("There was a sqlite error")
            print(e)
        return None

    def setup_db(self):
        print("Running setup")
        sql_statement = """CREATE TABLE IF NOT EXISTS tasks (task_name TEXT, completed INTEGER DEFAULT 0, due_date TEXT); """
        conn = self.get_connection()
        cur = conn.cursor()
        cur.execute(sql_statement)
        conn.commit()
        conn.close()


    def insert_new_task(self, task_info):
        sql_statement = "INSERT INTO tasks(task_name, due_date) VALUES(?, ?)"
        conn = self.get_connection()
        cur = conn.cursor()
        cur.execute(sql_statement, task_info)
        conn.commit()
        conn.close()

    def get_all_tasks(self):
        conn = self.get_connection()
        cur = conn.cursor()
        cur.execute("SELECT rowid,* FROM tasks")
        rows = cur.fetchall()
        conn.close()
        return list(rows)

    def delete_task(self, id):
        sql_statement = "DELETE FROM tasks WHERE rowid = ?"
        conn = self.get_connection()
        cur = conn.cursor()
        cur.execute(sql_statement, [id])
        conn.commit()
        cur.execute('VACUUM')
        conn.commit()
        conn.close()

    def update_completed(self, task_info):
        sql_statement = "UPDATE tasks SET completed = ? WHERE rowid = ?"
        conn = self.get_connection()
        cur = conn.cursor()
        cur.execute(sql_statement, task_info)
        conn.commit()
        conn.close()
