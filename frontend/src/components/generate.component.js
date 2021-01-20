import React, { useState } from "react";
import { useHistory } from "react-router";
import axios from "axios";
import configData from "../config.json";

function Generate({ account, level, remain }) {
    const history = useHistory();

    const [uploadfile, setUploadfile] = useState(null);
    const [attackTarget, setAttackTarget] = useState("");
    const [attackAlgorithm, setAttackAlgorithm] = useState("PGD");
    const [attackEpsilon, setAttackEpsilon] = useState(0.3);
    const [attackAlpha, setAttackAlpha] = useState(0.01);
    const [attackIteration, setAttackIteration] = useState(50);

    const noAuth = (
        <div>
            <p>Your level is {level}</p>
            <p>Please Login first</p>
        </div>
    )
    const allLetter = (inputtxt) => { 
        var letters = /^[A-Za-z ]+$/;
        if (inputtxt.length === 0) {
            return true;
        }else if (inputtxt.match(letters) && (inputtxt.length <= 50)) {
            return true;
        } else {
            alert('Please input 1~50 alphabet characters and space only');
            return false;
        }
    }
    
    const handleTargetChange = (e) => {
        if (allLetter(e.target.value)) {
            setAttackTarget(e.target.value)
        }
    }

    const handleAlgorithmChange = (e) => {
        setAttackAlgorithm(e.target.value);
    }

    const handleEpsilonChange = (e) => {
        setAttackEpsilon(e.target.value);
    }

    const handleAlphaChange = (e) => {
        setAttackAlpha(e.target.value);
    }

    const handleIterationChange = (e) => {
        setAttackIteration(e.target.value);
    }

    const onFileChange = (e) => {
        console.log(e.target.files[0].size)
        console.log(e.target.files[0].name)
        if (e.target.files[0].size > (4*1024*1024)) {
            alert("File is too large!")
            e.target.value = ""
        } else if (!e.target.files[0].name.endsWith(".wav")) {
            alert("Please upload wav. file!")
            e.target.value = ""
        } else {
            setUploadfile(e.target.files[0])
        }        
    }

    const onFileUpload = (e) => {
        e.preventDefault();
        if (attackTarget.length === 0){
            alert("Please specify your target sentence!")
            return
        }

        if (!allLetter(attackTarget)){
            return
        }
        if (uploadfile === null) {
            alert("Please upload wav. file!")
            return
        }
        let file = uploadfile;
        const formData = new FormData();
        
        formData.append("user", account);
        formData.append("target", attackTarget)
        formData.append("algorithm", attackAlgorithm);
        formData.append("epsilon", attackEpsilon);
        formData.append("alpha", attackAlpha);
        formData.append("iteration", attackIteration);
        formData.append("file", file);
        
        axios.post(`${configData.SERVER_URL}/upload`, formData)
            .then(res => {
                if (res.data.save_name === "ERROR") {
                    alert("Upload ERROR! Please upload again!")
                } else {
                    alert("Upload success!", res.data.save_name)
                }
            })
            .catch(err => console.warn(err));
        setUploadfile(null)
        history.push({
            pathname:  "/",
        });
      }

    return (
    <div className="main-wrapper">
        <div className="main-inner">
            {((level === "guest") || (account === ""))?(
                noAuth
            ):(
                <form>
                    <h3>Generate adversarial song</h3>
                    <h5>You have {remain} times left!</h5>
                    <div className="form-group">
                        <label htmlFor="formGroupExampleInput">Target sentence</label>
                        <input type="text" className="form-control" id="formGroupExampleInput" placeholder="OK GOOGLE" value={attackTarget} onChange={handleTargetChange}/>
                    </div>
                    <div class="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="FGSM" checked={attackAlgorithm === "FGSM"} onChange={handleAlgorithmChange}/>
                        <label className="form-check-label" htmlFor="exampleRadios1">
                            FGSM
                        </label>
                        </div>
                        <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="PGD" checked={attackAlgorithm === "PGD"} onChange={handleAlgorithmChange}/>
                        <label className="form-check-label" htmlFor="exampleRadios2">
                            PGD
                        </label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="formControlRange">Epsilon = {attackEpsilon}</label>
                        <input type="range" className="form-control-range" id="formControlRange" min="0.05" max="0.5" step="0.01" defaultValue={attackEpsilon} onMouseUp={handleEpsilonChange}/>
                    </div>
                    {(attackAlgorithm === "PGD")? (
                        <>
                        <div className="form-group">
                            <label htmlFor="formControlRange">Alpha = {attackAlpha}</label>
                            <input type="range" className="form-control-range pantoneZOZ1-range" id="formControlRange" min="0.001" max="0.5" step="0.001" defaultValue={attackAlpha} onMouseUp={handleAlphaChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="formControlRange">Iteration = {attackIteration}</label>
                            <input type="range" className="form-control-range pantoneZOZ1-range" id="formControlRange" min="1" max="200" step="1" defaultValue={attackIteration} onMouseUp={handleIterationChange}/>
                        </div>
                        </>
                    ):(
                        <></>
                    )}
                    
                    <div className="form-group">
                        <label htmlFor="exampleFormControlFile1">Song in wav format</label>
                        <input type="file" className="form-control-file" id="exampleFormControlFile1" onChange={onFileChange}/>
                        <br/>
                        {(level===0)?(
                            <button type="button" className="btn btn-primary btn-block pantoneZOZl" onClick={onFileUpload} disabled>Submit</button>
                        ):
                        (<button type="button" className="btn btn-primary btn-block pantoneZOZl" onClick={onFileUpload}>Submit</button>)}
                        
                    </div> 
                </form>
            )}
        </div>
    </div>
    )
  }

export default Generate