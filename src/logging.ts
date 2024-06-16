export {fatalError,notify};

// Critical Errors displayed here
function fatalError(msg:string) {
    let div = document.getElementById('critical') as HTMLDivElement;
    if (div != null) {
        div.classList.add('critical_show');
        div.innerHTML = msg;
    }
    console.log(msg);
}

// Non-crictical Errors displayed here
function notify(msg:string) {
    let div = document.getElementById('notification') as HTMLDivElement;
    if (div != null) {
        div.classList.add('notification_show');
        div.innerHTML = msg;
        setTimeout(() => {
            div.classList.remove('notification_show');
        }, 1000);
    }
    console.log(msg);
}
