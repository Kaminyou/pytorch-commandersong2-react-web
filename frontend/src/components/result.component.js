import axios from "axios";
import MaterialTable from "material-table";
import React, { useState, useEffect } from "react"
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import configData from "../config.json";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

function ResultPage({ level, account }) {
    console.log(level)
    console.log(account)
    const [resultdata, setResultdata] = useState([]);

    const getFile = (e, dwlink) => {
        e.preventDefault();
        e.persist();
        console.log("dwline")
        console.log(dwlink)
        console.log("dwline")
        axios
          .get(`${configData.SERVER_URL}/download?filename=${dwlink}&account=${account}`, {
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'audio/wav'
            }})
          .then((data) => {
            //console.log('this is data: ', data.data);
            let blob=new Blob([data.data],{type:"wav/audio"});
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob) //<---- this should be data.data
            link.download = dwlink.substr(15);
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          })
          .catch((e) => {
            console.log(e)
            console.log('We were not able to complete your request.');
          });
      };

    const noAuth = (
        <div>
            <p>Your level is {level}</p>
            <p>Please Login first</p>
        </div>
    )

    const classes = useStyles();

    const DownloadButton = (data) => {
        const dwlink = data.downloadlink
        console.log("dw")
        console.log(dwlink)

        if (dwlink === "notyet"){
            return(
            <IconButton edge="start" className={classes.menuButton} name={dwlink} color="inherit" aria-label="menu" disabled>
                <ArrowDropDownCircleIcon />
            </IconButton>
        )} else {
            return(
                <IconButton edge="start" className={classes.menuButton} name={dwlink} color="inherit" aria-label="menu" onClick={(e) => getFile(e, dwlink)}>
                    <ArrowDropDownCircleIcon />
                </IconButton>
            )
        }
    }

    const getResults = (account) => {
        axios.get(`${configData.SERVER_URL}/result`, { params: { account: account } })
        .then((res) => { 
            console.log(res.data.submissions)
            const submissions_list = res.data.submissions.map(submission => {
                return({file:submission[2].substr(11), submittime:submission[3], status:submission[4], downloadlink:submission[5], target:submission[6], mode:submission[7], epsilon:submission[8], alpha:submission[9], iteration:submission[10], levenshtein:submission[11], prediction:submission[12]})
            })
            setResultdata(submissions_list)
        })
        .catch((error) => { console.error(error) })
    }

    useEffect(() => {
        getResults(account);
    },[]);

    const columns = [
        {
          title: "File Name",
          field: "file"
        },
        {
          title: "Submit time",
          field: "submittime",
        },
        {
          title: "Status",
          field: "status",
        },
        {
          title: "Download Link",
          field: "downloadlink",
          render: (adv_file_name) => DownloadButton(adv_file_name)
        },
        {
            title: "Target",
            field: "target",
        },
        {
            title: "Algorithm",
            field: "mode",
        },
        {
            title: "Epsilon",
            field: "epsilon",
        },
        {
            title: "Alpha",
            field: "alpha",
        },
        {
            title: "Iteration",
            field: "iteration",
        },
        {
            title: "Levenshtein",
            field: "levenshtein",
        },
        {
            title: "Prediction",
            field: "prediction",
        },
      ];
    
    

    return (
      <div className="main-wrapper">
        <div className="main-inner">
        {((level === "guest") || (account === ""))?(
            noAuth
        ):(
            <MaterialTable title="Your submissions" data={resultdata} columns={columns} />
        )}
        </div>
      </div>
    )
  }

export default ResultPage