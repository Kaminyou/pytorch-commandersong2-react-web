from datetime import datetime
import librosa    
import os
            
def get_time_now():
    now = datetime.now()
    date_time = now.strftime("%m/%d/%Y %H:%M:%S")
    return date_time

def wav_convert_to_16k(wav_file_in, wav_file_out):
    y, s = librosa.load(wav_file_in, sr=16000)
    librosa.output.write_wav(wav_file_out, y, s)

