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