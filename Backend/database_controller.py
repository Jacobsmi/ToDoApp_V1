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
        try:
            sql_statement = "INSERT INTO tasks VALUES(?)"
            conn = self.get_connection()
            cur = conn.cursor()
            cur.execute(sql_statement,task_info)
            conn.commit()
            cur.close()
            return 1
        except:
            return 0
    
    def get_all_tasks(self):
        try: 
            conn = self.get_connection()
            cur = conn.cursor()
            cur.execute("SELECT rowid,* FROM tasks")
            rows = cur.fetchall()
            return list(rows)
        except:
            return 0
    

    def delete_task(self, id):
        try:
            sql_statement = "DELETE FROM tasks WHERE rowid = ?"
            conn = self.get_connection()
            cur = conn.cursor()
            cur.execute(sql_statement,[id])
            conn.commit()
            cur.execute('VACUUM')
            conn.commit()
            cur.close()
            return 1
        except:
            return 0