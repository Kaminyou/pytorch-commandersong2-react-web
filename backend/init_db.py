import sqlite3
from datetime import datetime
from utils.crypto import sha256_string
from utils.sqlite_operator import create_connection, create_table, user_signup_write_db, user_login
from utils.secret import Secret

def main():
    database = "./sqlite_db/adv_sound.sqlite"

    # level -> admin / member / guest
    sql_create_users_table = """ CREATE TABLE IF NOT EXISTS users (
                                        id integer PRIMARY KEY,
                                        account text NOT NULL,
                                        passwordHash text NOT NULL, 
                                        level text NOT NULL,
                                        create_date text NOT NULL
                                    ); """
    
    sql_create_submissions_table = """ CREATE TABLE IF NOT EXISTS submissions (
                                        id integer PRIMARY KEY,
                                        account text NOT NULL,
                                        filename text NOT NULL,
                                        create_date text NOT NULL,
                                        status text NOT NULL,
                                        downloadlink text NOT NULL,
                                        target text NOT NULL,
                                        algorithm text NOT NULL,
                                        epsilon real NOT NULL,
                                        alpha real NOT NULL,
                                        iteration int NOT NULL,
                                        levenshtein int NOT NULL,
                                        prediction text NOT NULL
                                    ); """

    # create a database connection
    conn = create_connection(database)

    # create tables
    if conn is not None:
        # create users table
        create_table(conn, sql_create_users_table)

        # create submissions table
        create_table(conn, sql_create_submissions_table)

    else:
        print("Error! cannot create the database connection.")
    
    # create admin account
    now = datetime.now()
    date_time = now.strftime("%m/%d/%Y %H:%M:%S")
    
    admin_identity = Secret()
    sha_password = sha256_string(admin_identity.password)
    
    admin_data = (admin_identity.account, sha_password, admin_identity.level, date_time)

    # create tasks
    user_signup_write_db(conn, admin_data)


if __name__ == '__main__':
    main()