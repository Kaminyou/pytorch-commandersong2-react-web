import sqlite3
from utils.crypto import sha256_string

def create_connection(db_file):
    """ create a database connection to the SQLite database
        specified by db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Exception as e:
        print(e)

    return conn

def create_table(conn, create_table_sql):
    """ create a table from the create_table_sql statement
    :param conn: Connection object
    :param create_table_sql: a CREATE TABLE statement
    :return:
    """
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Exception as e:
        print(e)

def user_signup_write_db(conn, new_user):
    sql = ''' INSERT INTO users(account,passwordHash,level,create_date)
              VALUES(?,?,?,?) '''
    cur = conn.cursor()
    cur.execute(sql, new_user)
    conn.commit()
    return cur.lastrowid


def insert_submission(conn, submission):
    sql = ''' INSERT INTO submissions(account,filename,create_date,status,downloadlink,target,algorithm,epsilon,alpha,iteration,levenshtein,prediction)
              VALUES(?,?,?,?,?,?,?,?,?,?,?,?) '''
    cur = conn.cursor()
    cur.execute(sql, submission)
    conn.commit()
    return cur.lastrowid

def attack_success_update_submission(conn, update_task):
    sql = ''' UPDATE submissions
              SET status = ? ,
                  downloadlink = ? ,
                  levenshtein = ?,
                  prediction = ?
              WHERE account = ? and filename = ?'''
    cur = conn.cursor()
    cur.execute(sql, update_task)
    conn.commit()

def get_user_submissions_times(conn, account):
    cur = conn.cursor()
    cur.execute(f"SELECT filename FROM submissions WHERE account = '{account}'")
    rows = cur.fetchall()
    return len(rows)

def get_user_submissions(conn, account):
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM submissions WHERE account = '{account}'")
    rows = cur.fetchall()
    return rows

def update_submission(conn, submission):
    """
    :param conn:
    :param task:
    :return: project id
    """
    sql = ''' UPDATE submissions
              SET status = ? ,
                  done_date = ? ,
              WHERE account = ? and filename = ?'''
    cur = conn.cursor()
    cur.execute(sql, submission)
    conn.commit()

def user_exists(conn, account):
    """
    If the user account exists or not
    """
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM users WHERE account = '{account}'")

    rows = cur.fetchall()

    if len(rows) > 0:
        return True
    else:
        return False

def user_login(conn, account, password):
    password_hash = sha256_string(password)
    cur = conn.cursor()
    cur.execute(f"SELECT level FROM users WHERE account = '{account}' and passwordHash = '{password_hash}'")

    rows = cur.fetchall()

    if len(rows) == 1:
        return rows[0][0] #level
    else:
        return "guest"