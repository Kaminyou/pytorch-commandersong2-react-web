import time
import os
import sys
from threading import Thread
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from utils.secret import Secret
from utils.sqlite_operator import user_login, create_connection, insert_submission, get_user_submissions, attack_success_update_submission, user_signup_write_db, user_exists, get_user_submissions_times
from utils.crypto import get_random_string, sha256_string
from utils.util import get_time_now, wav_convert_to_16k

sys.path.append("../deepspeech.pytorch/")
from deepspeech_pytorch.configs.inference_config import TranscribeConfig
from deepspeech_pytorch.utils import load_decoder, load_model
from attack import Attacker
import torchaudio
import librosa
from args import Args

# prepare misc
database = "./sqlite_db/adv_sound.sqlite"
config = Args()
app = Flask(__name__)
CORS(app)
admin_identity = Secret()

# prepare model
cfg = TranscribeConfig
model = load_model(device="cpu", model_path=config.model_path, use_half=False)
decoder = load_decoder(labels=model.labels, cfg=cfg.lm)

def attack_pipeline(user_name, save_name, target_sentence, algorithm, epsilon, alpha, iteration):
    try:
        # TO 16K
        print("Convert ...")
        wave_from_path = f"./user_upload/{user_name}/ori/{save_name}"
        wave_to_path = f"./user_upload/{user_name}/adv/CONVERT_{save_name}"
        wav_convert_to_16k(wave_from_path, wave_to_path)

        # ADV ATTACK
        print("Attack ...")
        output_wav = f"./user_upload/{user_name}/adv/adv_{save_name}"
        sound, sample_rate = torchaudio.load(wave_to_path)
        target_sentence = target_sentence.upper()
        attacker = Attacker(model=model, sound=sound, target=target_sentence, decoder=decoder, device=config.device, save=output_wav)

        db_difference, l_distance, _, final_output = attacker.attack(epsilon = epsilon, alpha=alpha, attack_type=algorithm, PGD_round=iteration)

        # REVISE DB
        print("Update db ...")
        conn = create_connection(database)
        update_status = f"Done at {get_time_now()}"
        update_task = (update_status, f"adv_{save_name}", int(l_distance), final_output, user_name, save_name)
        attack_success_update_submission(conn, update_task)
        print("Finish!")

    except Exception as e:
        print(e)
        print("attack failed")
        update_status = f"Failed at {get_time_now()}"
        update_task = (update_status, "notyet", 0, "None", user_name, save_name)

@app.route('/login', methods=['POST'])
def userlogin():
    data = request.get_json()
    account = data.get('account')
    password = data.get('password')
    print(account, password)
    
    conn = create_connection(database)
    level = user_login(conn, account, password)
    print(level)
    
    remain = 5
    submission_times = get_user_submissions_times(conn, account)
    if level == "admin":
        remain = 10000
    elif level == "member":
        remain = remain - submission_times
    else:
        remain = 0
    

    return jsonify({"level":level, "remain":remain})

@app.route('/signup', methods=['POST'])
def usersignup():
    data = request.get_json()
    account = data.get('account')
    password = data.get('password')
    invitation = data.get('invitation')
    
    if (invitation == admin_identity.gift):
        password_hash = sha256_string(password)
    
        conn = create_connection(database)
        if user_exists(conn, account):
            return jsonify({"level":"exist"})
        else:
            signup_task = (account, password_hash, "member", get_time_now())
            user_signup_write_db(conn, signup_task)
            return jsonify({"level":"member"})
    else:
        return jsonify({"level":"guest"})

@app.route('/upload', methods = ['POST'])
def upload_file():
    try:
        print(request.form)
        user_name = request.form["user"]
        target_sentence = request.form["target"]
        algorithm = request.form["algorithm"]
        epsilon = float(request.form["epsilon"])
        alpha = float(request.form["alpha"])
        iteration = int(request.form["iteration"])

        wav_file = request.files['file']

        if not os.path.exists(f"./user_upload/{user_name}/ori"):
            os.makedirs(f"./user_upload/{user_name}/ori")
        if not os.path.exists(f"./user_upload/{user_name}/adv"):
            os.makedirs(f"./user_upload/{user_name}/adv")

        if wav_file.filename != '':
            prefix = get_random_string()
            save_name = f"{prefix}_{wav_file.filename}"
            save_path = f"./user_upload/{user_name}/ori/{save_name}"
            wav_file.save(save_path)

            # write to db
            print("connect db")
            conn = create_connection(database)
            submit_task = (user_name, save_name, get_time_now(), "processing", "notyet", target_sentence, algorithm, epsilon, alpha, iteration, 0, "None")
            insert_submission(conn, submit_task)
            print("write db")

            # start processing
            thread = Thread(target=attack_pipeline, kwargs={'user_name':user_name, 
                                                            "save_name":save_name, 
                                                            "target_sentence":target_sentence, 
                                                            "algorithm":algorithm,
                                                            "epsilon":epsilon,
                                                            "alpha":alpha,
                                                            "iteration":iteration})
            thread.start()

            return jsonify({"save_name":save_name})
        return jsonify({"save_name":"ERROR"})

    except Exception as e:
        print(e)
        return jsonify({"save_name":"ERROR"})

@app.route('/result', methods = ['GET'])
def get_results():
    account = request.args.get('account')
    conn = create_connection(database)
    submissions = get_user_submissions(conn, account)
    return jsonify({"submissions":submissions})

@app.route('/download', methods = ['GET'])
def get_wav_file():
    account = request.args.get('account')
    filename = request.args.get('filename')
    current_path = os.path.abspath(os.getcwd())
    print(account)
    print(filename)
    file_path = os.path.join(current_path, f"user_upload/{account}/adv/{filename}")
    return send_file(file_path, as_attachment=True)


if __name__ == '__main__':
    app.debug = False
    app.run(host="0.0.0.0",port=5002)