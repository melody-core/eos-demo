const { exec } = require('child_process');

const runShell = shell => new Promise((resolved, rejected)=>{
    exec(shell, (err, stido, statt) => {
        console.log(stido)
        if(!err){
            resolved(stido)
        }else{
            rejected(statt)
        }
    })
})


runShell(`git config core.hooksPath ./.melody-sss`)
    .then(console.log, console.error)
    .then(()=>{
        runShell(`chmod +x ./.melody-sss/*`)
            .then(console.log)
    })
